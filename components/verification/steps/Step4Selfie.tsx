// components/verification/steps/Step4Selfie.tsx - IMPROVED CAMERA & CROP
"use client";

import { useState, useRef, useCallback, useEffect } from 'react';
import Webcam from 'react-webcam';
import { verifySelfie, uploadVerificationFile } from '@/lib/verification';
import { cropImage } from '@/lib/imageUtils';

export default function Step4Selfie({ formData, updateStep, sessionId, user }: any) {
  const webcamRef = useRef<Webcam>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [verificationResult, setVerificationResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [containerDimensions, setContainerDimensions] = useState({ width: 0, height: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const [isRetaking, setIsRetaking] = useState(false);

  // Initialize with saved data if available
  useEffect(() => {
    if (formData.selfiePath && !capturedImage && !uploadedFile) {
      console.log('Found existing Selfie path:', formData.selfiePath);
    }
  }, [formData.selfiePath]);

  // Measure container for responsive overlay
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        setContainerDimensions({
          width: containerRef.current.offsetWidth,
          height: containerRef.current.offsetHeight
        });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  const capture = useCallback(async () => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      if (!imageSrc) return;

      try {
        const video = webcamRef.current.video;
        if (!video) return;

        const videoWidth = video.videoWidth;
        const videoHeight = video.videoHeight;

        // Define the crop box (matching the visual overlay)
        // Overlay is a circle/square, approx 70% of min dimension
        const minDim = Math.min(videoWidth, videoHeight);
        const cropSize = minDim * 0.75;
        const cropX = (videoWidth - cropSize) / 2;
        const cropY = (videoHeight - cropSize) / 2;

        const croppedImageSrc = await cropImage(imageSrc, {
          x: cropX,
          y: cropY,
          width: cropSize,
          height: cropSize
        });

        setCapturedImage(croppedImageSrc);
        setUploadedFile(null);
        setError(null);
        setVerificationResult(null);
        setIsRetaking(false);
      } catch (err) {
        console.error('Error cropping image:', err);
        setCapturedImage(imageSrc);
      }
    }
  }, [webcamRef]);

  const retake = () => {
    setCapturedImage(null);
    setUploadedFile(null);
    setVerificationResult(null);
    setError(null);
    setIsRetaking(true);
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

    // Allow proceeding if we have a saved path and user hasn't taken a new photo
    if (!capturedImage && !uploadedFile && formData.selfiePath) {
      updateStep(5);
      return;
    }

    if (!capturedImage && !uploadedFile) {
      setError('Please capture or upload a selfie first.');
      return;
    }

    // Check if we have ID front file OR a saved path from previous session
    if (!formData.idFront && !formData.idFrontPath) {
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
        const fileName = `selfie - capture.${fileType.split('/')[1] || 'jpg'} `;
        selfieFile = new File([blob], fileName, { type: fileType });
      } else {
        setError('No selfie available to process');
        setUploading(false);
        return;
      }

      console.log('🔄 Verifying selfie with session:', sessionId);

      // Pass either the file object or the saved path string
      const idFrontSource = formData.idFront || formData.idFrontPath;
      const result = await verifySelfie(selfieFile, idFrontSource, sessionId);
      setVerificationResult(result);

      if (result.error) {
        setError(`Verification service error: ${result.error} `);
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

        // Upload file to local backend for persistence
        let filePath = null;
        if (user?.id) {
          try {
            console.log('💾 Saving Selfie locally...');
            const uploadResult = await uploadVerificationFile(selfieFile, 'selfie', user.id);
            if (uploadResult.success) {
              filePath = uploadResult.fileUrl;
              console.log('✅ Selfie saved locally:', filePath);
            }
          } catch (uploadError) {
            console.error('⚠️ Failed to save Selfie locally:', uploadError);
          }
        }

        updateStep(5, {
          selfie: selfieFile,
          selfiePath: filePath,
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
        setError(`Face match failed.Similarity: ${similarityPercent}% (minimum 51 % required). Please try again with better lighting and ensure you're looking directly at the camera.`);
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
        <div
          ref={containerRef}
          className="bg-gray-900 rounded-2xl overflow-hidden relative w-full aspect-square max-w-[500px] mx-auto shadow-xl"
        >
          {!capturedImage && (!formData.selfiePath || isRetaking) ? (
            <div className="relative w-full h-full">
              <Webcam
                ref={webcamRef}
                audio={false}
                screenshotFormat="image/jpeg"
                videoConstraints={{
                  facingMode: 'user', // Use front camera
                  width: { ideal: 720 },
                  height: { ideal: 720 },
                  aspectRatio: 1,
                  // @ts-ignore
                  advanced: [{ focusMode: "continuous" }]
                }}
                className="w-full h-full object-cover transform scale-x-[-1]" // Mirror the preview
                screenshotQuality={0.92}
              />

              {/* Overlay Guide */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="relative w-[75%] aspect-square border-2 border-green-400 border-dashed rounded-full shadow-[0_0_0_9999px_rgba(0,0,0,0.5)]">
                  <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-white font-medium text-sm bg-black/50 px-3 py-1 rounded-full whitespace-nowrap">
                    Position face in circle
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="relative w-full h-full flex items-center justify-center bg-black">
              <img
                src={capturedImage || (!isRetaking ? formData.selfiePath : null)}
                alt="Captured selfie"
                className="w-full h-full object-cover transform scale-x-[-1]" // Mirror captured selfie too
              />
              {/* Overlay for saved/captured image to indicate it's done */}
              <div className="absolute bottom-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium shadow-lg flex items-center">
                <span className="mr-1">✓</span> Photo Ready
              </div>
            </div>
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
          <div className={`p-4 rounded-lg ${canProceed ? 'bg-green-50 border border-green-200' : 'bg-yellow-50 border border-yellow-200'
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
        <div className="flex flex-col gap-4 w-full">
          {!capturedImage && (!formData.selfiePath || isRetaking) ? (
            <>
              <button
                onClick={capture}
                className="w-full bg-[#117c82] hover:bg-[#0e666b] text-white font-bold py-4 px-6 rounded-xl flex items-center justify-center transition-all duration-200 shadow-lg active:scale-[0.98]"
              >
                <span className="mr-3 text-2xl">🤳</span>
                <span className="text-lg">Take Selfie</span>
              </button>

              <div className="relative flex items-center justify-center">
                <div className="border-t border-gray-300 w-full"></div>
                <span className="bg-white px-3 text-gray-500 text-sm">OR</span>
                <div className="border-t border-gray-300 w-full"></div>
              </div>

              <label className="w-full bg-white border-2 border-[#117c82] text-[#117c82] hover:bg-gray-50 font-semibold py-3 px-6 rounded-xl flex items-center justify-center cursor-pointer transition-all duration-200 shadow-sm">
                <span className="mr-2 text-xl">📁</span>
                Upload from Gallery
                <input
                  type="file"
                  accept="image/jpeg,image/jpg,image/png"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </>
          ) : (
            <div className="flex flex-col gap-3">
              <button
                onClick={processSelfie}
                disabled={uploading}
                className="w-full bg-[#117c82] hover:bg-[#0e666b] text-white font-bold py-4 px-6 rounded-xl disabled:opacity-50 flex items-center justify-center transition-all duration-200 shadow-lg active:scale-[0.98]"
              >
                {uploading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                    Verifying...
                  </>
                ) : (
                  <>
                    <span className="mr-2">✨</span>
                    Verify Face & Continue
                  </>
                )}
              </button>

              <button
                onClick={retake}
                disabled={uploading}
                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-6 rounded-xl transition-colors duration-200 disabled:opacity-50"
              >
                Retake Selfie
              </button>
            </div>
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