export default function Terms() {
  return (
    <div className="container max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Terms of Service</h1>
      <div className="space-y-6">
        <section>
          <h2 className="text-2xl font-semibold mb-4">Service Description</h2>
          <p className="text-gray-700">
            This service provides AI-generated images of Omani traditional clothing based on user prompts.
          </p>
        </section>
        
        <section>
          <h2 className="text-2xl font-semibold mb-4">User Credits</h2>
          <p className="text-gray-700">
            New users receive 10 free credits. Each image generation uses 1 credit. Additional credits may be purchased.
          </p>
        </section>
        
        <section>
          <h2 className="text-2xl font-semibold mb-4">Acceptable Use</h2>
          <p className="text-gray-700">
            Users must use the service respectfully and not generate inappropriate or offensive content.
          </p>
        </section>
        
        <section>
          <h2 className="text-2xl font-semibold mb-4">Limitation of Liability</h2>
          <p className="text-gray-700">
            The service is provided "as is" without warranties. We are not liable for any damages arising from use of the service.
          </p>
        </section>
        
        <section>
          <h2 className="text-2xl font-semibold mb-4">Contact</h2>
          <p className="text-gray-700">
            For any questions about these terms, contact us at oulla898@gmail.com
          </p>
        </section>
      </div>
    </div>
  )
}