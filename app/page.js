'use client';

import { useState, useEffect, useRef } from "react";
import { useSession, signIn, signOut } from 'next-auth/react'
import Image from "next/image";

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
 
export default function Home() {
  const { data: session, status } = useSession()
  const [prediction, setPrediction] = useState(null);
  const [error, setError] = useState(null);
  const promptInputRef = useRef(null);

  const examplePrompts = [
    "A man wearing a white dishdasha and traditional mussar",
    "Traditional Omani wedding attire with a black bisht and silver khanjar",
    "Formal Omani clothing with a patterned mussar and silver walking stick",
    "An Omani man in ceremonial dress with traditional accessories"
  ];

  useEffect(() => {
    if (promptInputRef.current) {
      promptInputRef.current.focus();
    }
  }, [session]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Check if user is signed in
    if (!session) {
      signIn()
      return;
    }
    
    // Check if user has credits
    if (session.user.credits <= 0) {
      setError("You don't have enough credits. Please purchase more to continue.");
      return;
    }
    
    const response = await fetch("/api/predictions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt: e.target.prompt.value,
        userId: session.user.id,
      }),
    });
    let prediction = await response.json();
    if (response.status !== 201) {
      setError(prediction.detail);
      return;
    }
    setPrediction(prediction);

    while (
      prediction.status !== "succeeded" &&
      prediction.status !== "failed"
    ) {
      await sleep(250);
      const response = await fetch(`/api/predictions/${prediction.id}`);
      prediction = await response.json();
      if (response.status !== 200) {
        setError(prediction.detail);
        return;
      }
      console.log({ prediction });
      setPrediction(prediction);
    }
  };

  // Show loading state
  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="container max-w-2xl mx-auto p-5">
      {/* Header with user info */}
      {session && (
        <div className="flex justify-between items-center mb-6 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center space-x-3">
            {session.user.image && (
              <img 
                src={session.user.image} 
                alt="Profile" 
                className="w-8 h-8 rounded-full"
              />
            )}
            <div>
              <p className="text-sm font-medium">Welcome, {session.user.name}</p>
              <p className="text-xs text-gray-600">Credits: {session.user.credits}</p>
            </div>
          </div>
          <button
            onClick={() => signOut()}
            className="text-sm text-gray-600 hover:text-gray-800"
          >
            Sign Out
          </button>
        </div>
      )}

      <h1 className="py-6 text-center font-bold text-2xl">
        Generate{" "}
        <span className="text-blue-600">Omani Traditional Clothing</span>
        {" "}with AI
      </h1>

      {!session ? (
        <div className="text-center py-8">
          <p className="text-gray-600 mb-4">Sign in to start generating beautiful Omani traditional clothing images</p>
          <button
            onClick={() => signIn('google')}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Sign in with Google
          </button>
        </div>
      ) : (
        <form className="w-full flex" onSubmit={handleSubmit}>
          <input
            type="text"
            className="flex-grow"
            name="prompt"
            placeholder="Describe the traditional Omani clothing you want to generate..."
            ref={promptInputRef}
          />
          <button className="button" type="submit" disabled={prediction && prediction.status === "processing"}>
            {prediction && prediction.status === "processing" ? "Generating..." : "Generate"}
          </button>
        </form>
      )}

      {error && <div className="text-red-600 mt-4 p-3 bg-red-50 rounded">{error}</div>}

      {session && (
        <div className="mt-6">
          <p className="text-sm text-gray-600 mb-3">Try these examples:</p>
          <div className="grid grid-cols-1 gap-2">
            {examplePrompts.map((prompt, index) => (
              <button
                key={index}
                className="text-left p-2 text-sm bg-gray-50 hover:bg-gray-100 rounded transition-colors"
                onClick={() => {
                  if (promptInputRef.current) {
                    promptInputRef.current.value = prompt;
                    promptInputRef.current.focus();
                  }
                }}
              >
                "{prompt}"
              </button>
            ))}
          </div>
        </div>
      )}

      {prediction && (
        <>
          {prediction.output && (
            <div className="image-wrapper mt-5">
              <Image
                fill
                src={prediction.output[prediction.output.length - 1]}
                alt="output"
                sizes="100vw"
              />
            </div>
          )}
          <p className="py-3 text-sm opacity-50">status: {prediction.status}</p>
        </>
      )}
    </div>
  );
}
