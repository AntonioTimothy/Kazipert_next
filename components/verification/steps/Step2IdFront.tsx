// components/verification/steps/Step2IdFront.tsx - FIXED
"use client";

import { useState, useRef, useCallback } from 'react';
import Webcam from 'react-webcam';
import { uploadIdFront } from '@/lib/verification';

const FaceBox = ({ faceLocation, imageSize }: any) => {
  if (!faceLocation || !imageSize.width || !imageSize.height) return null;

  const { x, y, width, height } = faceLocation;
  const scaleX = imageSize.width;
  const scaleY = imageSize.height;

  return (
    <div
      className="absolute border-2 border-green-500 bg-green-500 bg-opacity-20"
      style={{
        left: `${x * scaleX}px`,
        top: `${y * scaleY}px`,
        width: `${width * scaleX}px`,
        height: `${height * scaleY}px`,
      }}
    >
      <div className="absolute -top-6 left-0 bg-green-500 text-white text-xs px-2 py-1 rounded">
        Face Detected
      </div>
    </div>
  );
};

export default function Step2IdFront({ formData, updateStep, sessionId }: any) {
  const webcamRef = useRef<Webcam>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [ocrResult, setOcrResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });

  const capture = useCallback(() => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      setCapturedImage(imageSrc);
      setUploadedFile(null);
      setError(null);
      setOcrResult(null);
    }
  }, [webcamRef]);

  const retake = () => {
    setCapturedImage(null);
    setUploadedFile(null);
    setOcrResult(null);
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
        const image = new Image();
        image.onload = () => {
          setImageSize({ width: image.width, height: image.height });
        };
        image.src = e.target?.result as string;
        setCapturedImage(e.target?.result as string);
        setError(null);
        setOcrResult(null);
      };
      reader.onerror = () => {
        setError('Failed to read file. Please try again.');
      };
      reader.readAsDataURL(file);
    }
  };

  const processImage = async () => {
    if (!sessionId) {
      setError('Session not initialized. Please refresh the page.');
      return;
    }

    setUploading(true);
    setError(null);

    try {
      console.log('🔄 Processing ID front image with session:', sessionId);
      
      let fileToUpload: File;

      if (uploadedFile) {
        fileToUpload = uploadedFile;
      } else if (capturedImage) {
        const base64Response = await fetch(capturedImage);
        const blob = await base64Response.blob();
        const fileType = blob.type || 'image/jpeg';
        const fileName = `id-front-capture.${fileType.split('/')[1] || 'jpg'}`;
        fileToUpload = new File([blob], fileName, { type: fileType });
      } else {
        setError('No image available to process');
        setUploading(false);
        return;
      }

      console.log('📤 Sending to verification service...');
      
      // This now uses the fixed uploadIdFront function
      const result = await uploadIdFront(fileToUpload, sessionId);
      setOcrResult(result);

      if (result.error) {
        setError(`Verification service error: ${result.error}`);
        return;
      }

      if (result.faceDetected && result.ocrText) {
        console.log('✅ ID front verification successful');
        updateStep(3, {
          idFront: fileToUpload,
          ocrData: { 
            ...formData.ocrData, 
            front: {
              ...result,
              ocr: result.ocrText
            }
          }
        });
      } else if (!result.faceDetected) {
        setError('No face detected in the ID photo. Please ensure your ID photo is clearly visible and try again.');
      } else if (!result.ocrText) {
        setError('Could not read ID information. Please ensure the text is clear, all details are visible, and try again.');
      }
    } catch (error) {
      console.error('❌ Error processing image:', error);
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Failed to process ID. Please check if the verification service is running and try again.';
      setError(errorMessage);
    } finally {
      setUploading(false);
    }
  };

  const canProceed = ocrResult?.faceDetected && ocrResult?.ocrText;

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Front Side of ID Card
        </h2>
        <p className="text-gray-600">
          Take a clear photo of the front side of your Kenyan National ID card
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
                  facingMode: 'environment',
                  width: 1280,
                  height: 720
                }}
                className="w-full h-auto"
                screenshotQuality={0.92}
                onUserMedia={() => {
                  setImageSize({ width: 1280, height: 720 });
                }}
              />
              
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="border-2 border-green-400 border-dashed w-64 h-40 rounded-lg bg-transparent">
                  <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-green-400 text-sm font-medium">
                    Fit ID Card Here
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="relative">
              <img
                src={capturedImage}
                alt="Captured ID front"
                className="w-full h-auto"
                onLoad={(e) => {
                  const img = e.target as HTMLImageElement;
                  setImageSize({ width: img.naturalWidth, height: img.naturalHeight });
                }}
              />
              {ocrResult?.faceDetected && ocrResult?.faceLocation && (
                <FaceBox 
                  faceLocation={ocrResult.faceLocation} 
                  imageSize={imageSize}
                />
              )}
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

        {/* OCR Results */}
        {ocrResult && !error && (
          <div className={`p-4 rounded-lg ${
            canProceed ? 'bg-green-50 border border-green-200' : 'bg-yellow-50 border border-yellow-200'
          }`}>
            <h4 className="font-semibold mb-3">Verification Results:</h4>
            {canProceed ? (
              <div className="text-green-700 space-y-2">
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>Face detected and verified</span>
                </div>
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>ID information extracted successfully</span>
                </div>
                {ocrResult.ocrText && (
                  <div className="mt-3 p-3 bg-white rounded border">
                    <h5 className="font-medium text-gray-900 mb-2">Extracted Information:</h5>
                    <pre className="text-sm text-gray-700 whitespace-pre-wrap">{ocrResult.ocrText}</pre>
                  </div>
                )}
                <p className="text-sm mt-2">You can proceed to the next step</p>
              </div>
            ) : (
              <div className="text-yellow-700 space-y-2">
                {!ocrResult.faceDetected && (
                  <div className="flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    <span>No face detected in ID photo</span>
                  </div>
                )}
                {!ocrResult.ocrText && (
                  <div className="flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    <span>Could not extract ID information</span>
                  </div>
                )}
                <p className="text-sm mt-2">Please retake the photo or try uploading a clearer image</p>
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
                <span className="mr-2">📷</span>
                Capture Photo
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
                Retake Photo
              </button>
              
              <button
                onClick={processImage}
                disabled={uploading}
                className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg disabled:opacity-50 flex items-center justify-center transition-colors duration-200"
              >
                {uploading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Processing...
                  </>
                ) : (
                  'Verify & Continue'
                )}
              </button>
            </>
          )}
        </div>

        {/* Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-semibold text-blue-900 mb-2">Tips for best results:</h4>
          <ul className="text-blue-800 text-sm space-y-1">
            <li>• Ensure good lighting without shadows</li>
            <li>• Place ID card within the guide frame</li>
            <li>• Make sure all text is clear and readable</li>
            <li>• Avoid glare and reflections</li>
            <li>• Ensure the ID photo is clearly visible</li>
            <li>• Keep the ID card flat and straight</li>
          </ul>
        </div>
      </div>
    </div>
  );
}