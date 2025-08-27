export default function Privacy() {
  return (
    <div className="container max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Privacy Policy</h1>
      <div className="space-y-6">
        <section>
          <h2 className="text-2xl font-semibold mb-4">Information We Collect</h2>
          <p className="text-gray-700">
            We collect your name, email address, and profile picture from Google OAuth to create your account and provide our AI image generation service.
          </p>
        </section>
        
        <section>
          <h2 className="text-2xl font-semibold mb-4">How We Use Your Information</h2>
          <p className="text-gray-700">
            Your information is used solely to provide the Omani traditional clothing image generation service. We track your credit usage to manage the service.
          </p>
        </section>
        
        <section>
          <h2 className="text-2xl font-semibold mb-4">Data Storage</h2>
          <p className="text-gray-700">
            Your data is stored securely and is not shared with third parties except for the AI image generation service (Replicate).
          </p>
        </section>
        
        <section>
          <h2 className="text-2xl font-semibold mb-4">Contact</h2>
          <p className="text-gray-700">
            For any privacy concerns, contact us at oulla898@gmail.com
          </p>
        </section>
      </div>
    </div>
  )
}