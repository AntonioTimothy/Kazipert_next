// components/verification/steps/Step3IdBack.tsx - IMPROVED CAMERA & CROP
"use client";

import { useState, useRef, useCallback, useEffect } from 'react';
import Webcam from 'react-webcam';
import { uploadIdBack, uploadVerificationFile } from '@/lib/verification';
import { cropImage } from '@/lib/imageUtils';

export default function Step3IdBack({ formData, updateStep, sessionId, user }: any) {
  const webcamRef = useRef<Webcam>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [ocrResult, setOcrResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
  const [containerDimensions, setContainerDimensions] = useState({ width: 0, height: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const [isRetaking, setIsRetaking] = useState(false);

  // Initialize with saved data if available
  useEffect(() => {
    if (formData.idBackPath && !capturedImage && !uploadedFile) {
      console.log('Found existing ID Back path:', formData.idBackPath);
    }
  }, [formData.idBackPath]);

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
        // Overlay is approx 90% width, aspect ratio 1.58 (ID card)
        const cropWidth = videoWidth * 0.90;
        const cropHeight = cropWidth / 1.586; // Standard ID card ratio
        const cropX = (videoWidth - cropWidth) / 2;
        const cropY = (videoHeight - cropHeight) / 2;

        const croppedImageSrc = await cropImage(imageSrc, {
          x: cropX,
          y: cropY,
          width: cropWidth,
          height: cropHeight
        });

        setCapturedImage(croppedImageSrc);
        setUploadedFile(null);
        setError(null);
        setOcrResult(null);
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
    setOcrResult(null);
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

    // Allow proceeding if we have a saved path and user hasn't taken a new photo
    if (!capturedImage && !uploadedFile && formData.idBackPath) {
      updateStep(4);
      return;
    }

    if (!capturedImage && !uploadedFile) {
      setError('Please capture or upload an image first.');
      return;
    }

    setUploading(true);
    setError(null);

    try {
      console.log('🔄 Processing ID back image with session:', sessionId);

      let fileToUpload: File;

      if (uploadedFile) {
        fileToUpload = uploadedFile;
      } else if (capturedImage) {
        const base64Response = await fetch(capturedImage);
        const blob = await base64Response.blob();
        const fileType = blob.type || 'image/jpeg';
        const fileName = `id-back-capture.${fileType.split('/')[1] || 'jpg'}`;
        fileToUpload = new File([blob], fileName, { type: fileType });
      } else {
        setError('No image available to process');
        setUploading(false);
        return;
      }

      console.log('📤 Sending to verification service...');

      const result = await uploadIdBack(fileToUpload, sessionId);
      setOcrResult(result);

      if (result.error) {
        setError(`Verification service error: ${result.error}`);
        return;
      }

      if (result.ocrText || result.ocr) {
        console.log('✅ ID back verification successful');

        // Upload file to local backend for persistence
        let filePath = null;
        if (user?.id) {
          try {
            console.log('💾 Saving ID Back locally...');
            const uploadResult = await uploadVerificationFile(fileToUpload, 'idBack', user.id);
            if (uploadResult.success) {
              filePath = uploadResult.fileUrl;
              console.log('✅ ID Back saved locally:', filePath);
            }
          } catch (uploadError) {
            console.error('⚠️ Failed to save ID Back locally:', uploadError);
          }
        }

        updateStep(4, {
          idBack: fileToUpload,
          idBackPath: filePath,
          ocrData: {
            ...formData.ocrData,
            back: {
              ...result,
              ocr: result.ocrText || result.ocr
            }
          }
        });
      } else {
        setError('Could not read ID information from the back side. Please ensure the text and barcode are clear and try again.');
      }
    } catch (error) {
      console.error('❌ Error processing image:', error);
      const errorMessage = error instanceof Error
        ? error.message
        : 'Failed to process ID back. Please check if the verification service is running and try again.';
      setError(errorMessage);
    } finally {
      setUploading(false);
    }
  };

  const canProceed = ocrResult?.ocrText || ocrResult?.ocr;

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Back Side of ID Card
        </h2>
        <p className="text-gray-600">
          Take a clear photo of the back side of your ID card
        </p>
      </div>

      <div className="space-y-6">
        {/* Camera/Preview Section */}
        <div
          ref={containerRef}
          className="bg-gray-900 rounded-2xl overflow-hidden relative w-full aspect-video shadow-xl"
        >
          {!capturedImage && (!formData.idBackPath || isRetaking) ? (
            <div className="relative w-full h-full">
              <Webcam
                ref={webcamRef}
                audio={false}
                screenshotFormat="image/jpeg"
                videoConstraints={{
                  facingMode: 'environment', // Use back camera
                  width: { ideal: 1920 },
                  height: { ideal: 1080 },
                  aspectRatio: 1.777,
                  // @ts-ignore
                  advanced: [{ focusMode: "continuous" }]
                }}
                className="w-full h-full object-cover transform scale-x-[-1]"
                screenshotQuality={0.95}
              />

              {/* Overlay Guide */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="relative w-[90%] aspect-[1.586/1] border-2 border-white rounded-lg shadow-[0_0_0_9999px_rgba(0,0,0,0.5)]">
                  <div className="absolute top-0 left-0 w-4 h-4 border-t-4 border-l-4 border-green-500 -mt-1 -ml-1 rounded-tl"></div>
                  <div className="absolute top-0 right-0 w-4 h-4 border-t-4 border-r-4 border-green-500 -mt-1 -mr-1 rounded-tr"></div>
                  <div className="absolute bottom-0 left-0 w-4 h-4 border-b-4 border-l-4 border-green-500 -mb-1 -ml-1 rounded-bl"></div>
                  <div className="absolute bottom-0 right-0 w-4 h-4 border-b-4 border-r-4 border-green-500 -mb-1 -mr-1 rounded-br"></div>

                  <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-white font-medium text-sm bg-black/50 px-3 py-1 rounded-full whitespace-nowrap">
                    Fit ID card within frame
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="relative w-full h-full flex items-center justify-center bg-black">
              <img
                src={capturedImage || (!isRetaking ? formData.idBackPath : null)}
                alt="Captured ID back"
                className="max-w-full max-h-full object-contain transform scale-x-[-1]"
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

        {/* OCR Results */}
        {ocrResult && !error && (
          <div className={`p-4 rounded-lg ${canProceed ? 'bg-green-50 border border-green-200' : 'bg-yellow-50 border border-yellow-200'
            }`}>
            <h4 className="font-semibold mb-3">Verification Results:</h4>
            {canProceed ? (
              <div className="text-green-700 space-y-2">
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>Back side information extracted successfully</span>
                </div>
                {(ocrResult.ocrText || ocrResult.ocr) && (
                  <div className="mt-3 p-3 bg-white rounded border">
                    <h5 className="font-medium text-gray-900 mb-2">Extracted Information:</h5>
                    <pre className="text-sm text-gray-700 whitespace-pre-wrap">
                      {ocrResult.ocrText || ocrResult.ocr}
                    </pre>
                  </div>
                )}
                <p className="text-sm mt-2">You can proceed to the next step</p>
              </div>
            ) : (
              <div className="text-yellow-700 space-y-2">
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <span>Could not extract ID information</span>
                </div>
                <p className="text-sm mt-2">Please retake the photo or try uploading a clearer image</p>
              </div>
            )}
          </div>
        )}

        {/* Controls */}
        <div className="flex flex-col gap-4 w-full">
          {!capturedImage && (!formData.idBackPath || isRetaking) ? (
            <>
              <button
                onClick={capture}
                className="w-full bg-[#117c82] hover:bg-[#0e666b] text-white font-bold py-4 px-6 rounded-xl flex items-center justify-center transition-all duration-200 shadow-lg active:scale-[0.98]"
              >
                <span className="mr-3 text-2xl">📷</span>
                <span className="text-lg">Capture Photo</span>
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
                onClick={processImage}
                disabled={uploading}
                className="w-full bg-[#117c82] hover:bg-[#0e666b] text-white font-bold py-4 px-6 rounded-xl disabled:opacity-50 flex items-center justify-center transition-all duration-200 shadow-lg active:scale-[0.98]"
              >
                {uploading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    <span className="mr-2">✨</span>
                    Verify & Continue
                  </>
                )}
              </button>

              <button
                onClick={retake}
                disabled={uploading}
                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-6 rounded-xl transition-colors duration-200 disabled:opacity-50"
              >
                Retake Photo
              </button>
            </div>
          )}
        </div>

        {/* Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-semibold text-blue-900 mb-2">Tips for best results:</h4>
          <ul className="text-blue-800 text-sm space-y-1">
            <li>• Ensure good lighting without shadows</li>
            <li>• Place ID card within the guide frame</li>
            <li>• Make sure all text and barcode are clear and readable</li>
            <li>• Avoid glare and reflections</li>
            <li>• Focus on the barcode and serial numbers</li>
          </ul>
        </div>
      </div>
    </div>
  );
}