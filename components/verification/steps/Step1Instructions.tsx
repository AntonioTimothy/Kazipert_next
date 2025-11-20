// components/verification/steps/Step1Instructions.tsx
"use client"
export default function Step1Instructions({ updateStep, formData }: any) {
  const requirements = [
    {
      icon: '🆔',
      title: 'Kenyan National ID',
      description: 'Valid, non-expired Kenyan National ID card'
    },
    {
      icon: '📱',
      title: 'Good Lighting',
      description: 'Ensure good lighting without shadows or glare'
    },
    {
      icon: '📷',
      title: 'Clear Photos',
      description: 'Take clear, focused photos without blur'
    },
    {
      icon: '🔍',
      title: 'All Details Visible',
      description: 'Ensure all text and photos are clearly visible'
    }
  ];

  const steps = [
    'Take photos of both sides of your ID card',
    'Take a clear selfie photo',
    'Verify your personal details',
    'Complete the verification payment'
  ];

  const handleStartVerification = () => {
    updateStep(2);
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-2xl">🔒</span>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Identity Verification Required
        </h2>
        <p className="text-gray-600">
          To ensure the security and authenticity of our platform, we need to verify your identity.
          This process takes about 5-10 minutes.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 mb-8">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <span className="mr-2">📋</span> What You'll Need
          </h3>
          <div className="space-y-3">
            {requirements.map((req, index) => (
              <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                <span className="text-xl">{req.icon}</span>
                <div>
                  <p className="font-medium text-gray-900">{req.title}</p>
                  <p className="text-sm text-gray-600">{req.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <span className="mr-2">👣</span> Steps to Complete
          </h3>
          <div className="space-y-3">
            {steps.map((step, index) => (
              <div key={index} className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
                <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-sm font-bold">{index + 1}</span>
                </div>
                <p className="text-gray-700">{step}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-8">
        <div className="flex">
          <div className="flex-shrink-0">
            <span className="text-yellow-400">⚠️</span>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-yellow-800">
              Important Notice
            </h3>
            <div className="mt-2 text-sm text-yellow-700">
              <p>
                • All information must match your official documents
                <br />
                • Photos must be clear and readable
                <br />
                • You must be at least 22 years old to proceed
                <br />
                • Verification fee: KES 200 (refundable if verification fails)
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="text-center">
        <button
          onClick={handleStartVerification}
          className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-200"
        >
          Start Verification
        </button>
      </div>
    </div>
  );
}