// components/verification/steps/Step4Selfie.tsx - FIXED
"use client";

import { useState, useRef, useCallback } from 'react';
import Webcam from 'react-webcam';
import { verifySelfie } from '@/lib/verification';

export default function Step4Selfie({ formData, updateStep, sessionId }: any) {
  const webcamRef = useRef<Webcam>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [verificationResult, setVerificationResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const capture = useCallback(() => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      setCapturedImage(imageSrc);
      setUploadedFile(null);
      setError(null);
      setVerificationResult(null);
    }
  }, [webcamRef]);

  const retake = () => {
    setCapturedImage(null);
    setUploadedFile(null);
    setVerificationResult(null);
    setError(null);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setError('Please upload an image file (JPEG, PNG, etc.)');
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        setError('File size must be less than 5MB');
        return;
      }

      setUploadedFile(file);
      
      const reader = new FileReader();
      reader.onload = (e) => {
        setCapturedImage(e.target?.result as string);
        setError(null);
        setVerificationResult(null);
      };
      reader.onerror = () => {
        setError('Failed to read file. Please try again.');
      };
      reader.readAsDataURL(file);
    }
  };

  const processSelfie = async () => {
    if (!sessionId) {
      setError('Session not initialized. Please refresh the page.');
      return;
    }

    if (!capturedImage && !uploadedFile) {
      setError('Please capture or upload a selfie first.');
      return;
    }

    if (!formData.idFront) {
      setError('ID front image is required for face verification. Please go back to Step 2 and upload your ID front first.');
      return;
    }

    setUploading(true);
    setError(null);

    try {
      let selfieFile: File;

      if (uploadedFile) {
        selfieFile = uploadedFile;
      } else if (capturedImage) {
        const base64Response = await fetch(capturedImage);
        const blob = await base64Response.blob();
        const fileType = blob.type || 'image/jpeg';
        const fileName = `selfie-capture.${fileType.split('/')[1] || 'jpg'}`;
        selfieFile = new File([blob], fileName, { type: fileType });
      } else {
        setError('No selfie available to process');
        setUploading(false);
        return;
      }

      console.log('🔄 Verifying selfie with session:', sessionId);
      
      const result = await verifySelfie(selfieFile, formData.idFront, sessionId);
      setVerificationResult(result);

      if (result.error) {
        setError(`Verification service error: ${result.error}`);
        return;
      }

      // FIXED: Use the correct field names from backend response
      const similarityScore = parseFloat(result.similarityScore) || 0;
      const matchProbability = parseFloat(result.matchProbability) || 0;
      
      console.log('📊 Verification result:', {
        match: result.match,
        similarityScore,
        matchProbability,
        distance: result.distance,
        threshold: result.threshold
      });

      // Use 51% threshold as requested
      const MINIMUM_SIMILARITY = 0.51;
      
      if (result.match && similarityScore >= MINIMUM_SIMILARITY) {
        console.log('✅ Face verification successful');
        updateStep(5, {
          selfie: selfieFile,
          ocrData: { 
            ...formData.ocrData, 
            faceVerification: {
              ...result,
              similarityScore,
              matchProbability
            }
          }
        });
      } else {
        const similarityPercent = (similarityScore * 100).toFixed(1);
        setError(`Face match failed. Similarity: ${similarityPercent}% (minimum 51% required). Please try again with better lighting and ensure you're looking directly at the camera.`);
      }
    } catch (error) {
      console.error('❌ Error verifying selfie:', error);
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Failed to verify face. Please check if the verification service is running and try again.';
      setError(errorMessage);
    } finally {
      setUploading(false);
    }
  };

  // FIXED: Use correct field name and 51% threshold
  const similarityScore = verificationResult ? 
    (parseFloat(verificationResult.similarityScore) || 0) : 0;
  const canProceed = verificationResult?.match && similarityScore >= 0.51;

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Take a Selfie
        </h2>
        <p className="text-gray-600">
          Take a clear selfie for face verification against your ID photo
        </p>
      </div>

      <div className="space-y-6">
        {/* Camera/Preview Section */}
        <div className="bg-gray-900 rounded-2xl overflow-hidden relative">
          {!capturedImage ? (
            <div className="relative">
              <Webcam
                ref={webcamRef}
                audio={false}
                screenshotFormat="image/jpeg"
                videoConstraints={{
                  facingMode: 'user',
                  width: 720,
                  height: 720
                }}
                className="w-full h-auto aspect-square"
                screenshotQuality={0.92}
              />
              
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="border-2 border-green-400 border-dashed w-48 h-48 rounded-full bg-transparent">
                  <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-green-400 text-sm font-medium">
                    Position Your Face
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <img
              src={capturedImage}
              alt="Captured selfie"
              className="w-full h-auto aspect-square object-cover"
            />
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Verification Failed</h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>{error}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Verification Results */}
        {verificationResult && !error && (
          <div className={`p-4 rounded-lg ${
            canProceed ? 'bg-green-50 border border-green-200' : 'bg-yellow-50 border border-yellow-200'
          }`}>
            <h4 className="font-semibold mb-3">Face Verification Results:</h4>
            {canProceed ? (
              <div className="text-green-700 space-y-2">
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>Face match successful!</span>
                </div>
                <div className="text-sm">
                  Similarity: {(similarityScore * 100).toFixed(1)}%
                </div>
                <p className="text-sm mt-2">You can proceed to the next step</p>
              </div>
            ) : (
              <div className="text-yellow-700 space-y-2">
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <span>Face match below threshold</span>
                </div>
                <div className="text-sm">
                  Similarity: {(similarityScore * 100).toFixed(1)}% (minimum 51% required)
                </div>
                <p className="text-sm mt-2">Please retake the selfie with better lighting</p>
              </div>
            )}
          </div>
        )}

        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {!capturedImage ? (
            <>
              <button
                onClick={capture}
                className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg flex items-center justify-center transition-colors duration-200"
              >
                <span className="mr-2">🤳</span>
                Take Selfie
              </button>
              
              <label className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg flex items-center justify-center cursor-pointer transition-colors duration-200">
                <span className="mr-2">📁</span>
                Upload Photo
                <input
                  type="file"
                  accept="image/jpeg,image/jpg,image/png"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </>
          ) : (
            <>
              <button
                onClick={retake}
                disabled={uploading}
                className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 disabled:opacity-50"
              >
                Retake Selfie
              </button>
              
              <button
                onClick={processSelfie}
                disabled={uploading}
                className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg disabled:opacity-50 flex items-center justify-center transition-colors duration-200"
              >
                {uploading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Verifying...
                  </>
                ) : (
                  'Verify Face & Continue'
                )}
              </button>
            </>
          )}
        </div>

        {/* Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-semibold text-blue-900 mb-2">For best results:</h4>
          <ul className="text-blue-800 text-sm space-y-1">
            <li>• Make sure your face is clearly visible</li>
            <li>• Use good, natural lighting</li>
            <li>• Remove sunglasses or hats</li>
            <li>• Look directly at the camera</li>
            <li>• Ensure your face fits within the circle</li>
            <li>• Maintain a neutral expression</li>
          </ul>
        </div>
      </div>
    </div>
  );
}