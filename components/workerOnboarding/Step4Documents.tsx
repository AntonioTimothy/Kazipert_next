// components/Step4Documents.tsx
"use client"

import React, { useState, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import {
  FileText,
  Upload,
  CheckCircle,
  Loader2,
  Camera,
  Eye,
  XCircle,
  Download,
  Info,
  User,
  CreditCard
} from "lucide-react"
import { cn } from "@/lib/utils"

interface Step4DocumentsProps {
  data: any
  updateData: (section: string, updates: any) => void
  user: any
  onFileUpload: (file: File, documentType: string) => Promise<boolean>
  uploadProgress: { [key: string]: number }
}

interface ImagePreviewData {
  src: string
  name: string
  size: string
  type: string
  dimensions: string
}

const formatFileSize = (bytes: number): string => {
  if (!bytes) return "0 Bytes"
  const k = 1024
  const sizes = ["Bytes", "KB", "MB", "GB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
}

export default function Step4Documents({
  data,
  updateData,
  user,
  onFileUpload,
  uploadProgress
}: Step4DocumentsProps) {
  // preview data state for each field id
  const [imagePreviews, setImagePreviews] = useState<{ [key: string]: ImagePreviewData | null }>({
    profilePicture: null,
    idDocumentFront: null,
    idDocumentBack: null,
    passportDocument: null,
    kraDocument: null,
    goodConductDocument: null
  })

  const [isUploadingMap, setIsUploadingMap] = useState<{ [key: string]: boolean }>({})
  const [imageErrors, setImageErrors] = useState<{ [key: string]: boolean }>({})
  const fileInputsRef = useRef<{ [key: string]: HTMLInputElement | null }>({})

  // call this to set local preview and persist to parent data.documents
  const setPreviewAndPersist = (fieldId: string, preview: ImagePreviewData | null) => {
    setImagePreviews((p) => ({ ...p, [fieldId]: preview }))
    // persist to data.documents so the parent state knows something is uploaded
    // we store the data URL locally. In production you might replace with server URL returned from onFileUpload().
    updateData("documents", { [fieldId]: preview ? preview.src : null })
  }

  // Generic handler used by all UnifiedUploadField instances
  const handleFileSelected = async (fieldId: string, documentType: string, file?: File) => {
    const input = fileInputsRef.current[fieldId]
    const chosen = file ?? (input?.files && input.files[0])
    if (!chosen) return

    // size check (you said <= 5MB preferred)
    if (chosen.size > 5 * 1024 * 1024) {
      alert("File is too large — please select a file under 5 MB.")
      return
    }

    // If expected to be image-only (profile & id), enforce image MIME
    const expectsImageOnly = documentType.includes("profilePicture") || documentType.includes("idDocument")
    if (expectsImageOnly && !chosen.type.startsWith("image/")) {
      alert("Please select an image file (JPG, PNG, WebP).")
      return
    }

    setIsUploadingMap((m) => ({ ...m, [documentType]: true }))
    let previewData: ImagePreviewData | null = null

    try {
      const reader = new FileReader()
      const result: string = await new Promise((res, rej) => {
        reader.onerror = () => rej(new Error("Failed to read file"))
        reader.onload = () => res(String(reader.result))
        reader.readAsDataURL(chosen)
      })

      // If image -> get dimensions
      if (chosen.type.startsWith("image/")) {
        await new Promise<void>((res) => {
          const img = new Image()
          img.onload = () => {
            previewData = {
              src: result,
              name: chosen.name,
              size: formatFileSize(chosen.size),
              type: chosen.type,
              dimensions: `${img.width} × ${img.height} pixels`
            }
            res()
          }
          img.onerror = () => {
            // still set preview but mark error
            previewData = {
              src: result,
              name: chosen.name,
              size: formatFileSize(chosen.size),
              type: chosen.type,
              dimensions: "Unknown"
            }
            setImageErrors((s) => ({ ...s, [fieldId]: true }))
            res()
          }
          img.src = result
        })
      } else {
        // non-image (PDF/DOC) -> create simple preview object (we'll show icon + filename)
        previewData = {
          src: result,
          name: chosen.name,
          size: formatFileSize(chosen.size),
          type: chosen.type || "application/octet-stream",
          dimensions: "N/A"
        }
      }

      // call the provided upload handler (server upload); if it fails we still show local preview
      try {
        const ok = await onFileUpload(chosen, documentType)
        // if server returns success but you return a server URL instead, you can set updateData to that URL.
        // Here we persist local dataUrl so preview works immediately:
        setPreviewAndPersist(fieldId, previewData)
      } catch (err) {
        console.error("upload error:", err)
        // still show the preview locally so user can see the file they selected
        setPreviewAndPersist(fieldId, previewData)
      }
    } catch (err) {
      console.error(err)
      alert("Failed to read selected file.")
    } finally {
      setIsUploadingMap((m) => ({ ...m, [documentType]: false }))
    }
  }

  // open preview (image or dataURL/pdf)
  const handleView = (fieldId: string, currentFileValue: string | null) => {
    const preview = imagePreviews[fieldId]
    const src = preview?.src || currentFileValue
    if (!src) return alert("No file to view")
    // open in new tab
    window.open(src, "_blank", "noopener,noreferrer")
  }

  // helper to programmatically click the hidden input
  const triggerInputClick = (fieldId: string) => {
    const el = fileInputsRef.current[fieldId]
    if (el) el.click()
  }

  // Unified upload field component (keeps code DRY)
  const UnifiedUploadField: React.FC<{
    id: string
    label: string
    required: boolean
    currentFile: string | null
    documentType: string
    aspectRatio?: "square" | "rectangle"
    optional?: boolean
    onSkip?: () => void
    description?: string
    icon?: React.ComponentType<any>
  }> = ({
    id,
    label,
    required,
    currentFile,
    documentType,
    aspectRatio = "square",
    optional = false,
    onSkip,
    description,
    icon: Icon = Camera
  }) => {
    const isUploading = Boolean(isUploadingMap[documentType])
    const preview = imagePreviews[id]
    const hasFile = Boolean(preview?.src || (currentFile && currentFile !== "skipped"))
    const isImageFile = Boolean(preview?.type?.startsWith("image/") || (currentFile && /(\.jpg|\.jpeg|\.png|\.webp|\.gif)$/i.test(String(currentFile))))
    const hasError = Boolean(imageErrors[id])

    return (
      <div className="group relative">
        <div
          className={cn(
            "p-4 rounded-2xl border transition-all duration-200 bg-white",
            hasFile ? "border-theme-success/30 bg-theme-success/5" : "border-theme-border/50",
            isUploading && "opacity-80"
          )}
        >
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-start gap-3 flex-1">
              <div
                className={cn(
                  "h-10 w-10 rounded-xl flex items-center justify-center flex-shrink-0 mt-1",
                  hasFile ? "bg-theme-success/20 text-theme-success" : "bg-theme-primary/10 text-theme-primary"
                )}
              >
                <Icon className="h-5 w-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <Label htmlFor={id} className="text-lg font-semibold text-theme-text cursor-pointer">
                    {label}
                  </Label>
                  {required && <span className="text-theme-error text-sm font-medium">* Required</span>}
                  {optional && <span className="text-theme-text-muted text-sm">(Optional)</span>}
                </div>
                {description && <p className="text-theme-text-muted text-sm mt-1">{description}</p>}
              </div>
            </div>

            {optional && !hasFile && onSkip && (
              <Button
                variant="outline"
                size="sm"
                onClick={onSkip}
                className="h-8 text-xs border-theme-border hover:bg-theme-primary/10 text-theme-text-muted"
              >
                Skip
              </Button>
            )}
          </div>

          <div
            className={cn(
              "border-2 border-dashed rounded-xl relative overflow-hidden cursor-pointer",
              hasFile ? "border-theme-success/50 bg-theme-success/5" : "border-theme-border/70 bg-gradient-to-br from-theme-primary/3 to-theme-primary/8",
              "hover:border-theme-primary hover:bg-theme-primary/10"
            )}
            onClick={() => triggerInputClick(id)}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault()
              const file = e.dataTransfer.files?.[0]
              if (file) {
                // attach the dropped file to the hidden input so single path handles selection
                const input = fileInputsRef.current[id]
                if (input) {
                  const dt = new DataTransfer()
                  dt.items.add(file)
                  input.files = dt.files
                  // call the generic handler
                  void handleFileSelected(id, documentType, file)
                }
              }
            }}
          >
            {/* Hidden file input */}
            <input
              id={id}
              ref={(el) => (fileInputsRef.current[id] = el)}
              type="file"
              accept={
                documentType.includes("profilePicture") || documentType.includes("idDocument")
                  ? "image/*,.jpg,.jpeg,.png,.webp"
                  : "image/*,.pdf,.doc,.docx,.jpg,.jpeg,.png,.webp"
              }
              className="hidden"
              onChange={() => void handleFileSelected(id, documentType)}
              disabled={isUploading}
            />

            <div className={cn("p-4 sm:p-6 text-center min-h-[140px] flex flex-col items-center justify-center", isUploading && "opacity-60")}>
              {isUploading ? (
                <div className="flex flex-col items-center">
                  <Loader2 className="h-8 w-8 animate-spin text-theme-primary mb-3" />
                  <p className="font-medium text-theme-text">Uploading...</p>
                  <p className="text-sm text-theme-text-muted mt-1">Please wait</p>
                </div>
              ) : hasFile && !hasError ? (
                <div className="w-full space-y-4">
                  <div className="flex flex-col sm:flex-row items-center gap-4">
                    <div
                      className={cn(
                        "rounded-lg overflow-hidden shadow border border-theme-border/20 bg-white flex-shrink-0",
                        aspectRatio === "square" ? "w-20 h-20 sm:w-24 sm:h-24" : "w-32 h-20 sm:w-40 sm:h-24"
                      )}
                    >
                      {isImageFile ? (
                        <img
                          src={preview?.src || String(currentFile)}
                          alt="Preview"
                          className="w-full h-full object-cover"
                          onError={() => setImageErrors((s) => ({ ...s, [id]: true }))}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-theme-primary/10 to-theme-primary/20">
                          <FileText className="h-8 w-8 text-theme-primary" />
                        </div>
                      )}
                    </div>

                    <div className="flex-1 text-left space-y-2 min-w-0">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-theme-success flex-shrink-0" />
                        <p className="font-semibold text-theme-text truncate">{preview?.name || String(currentFile)}</p>
                      </div>

                      {preview && (
                        <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-theme-text-muted">
                          <div className="flex justify-between">
                            <span>Size:</span>
                            <span className="font-medium">{preview.size}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Type:</span>
                            <span className="font-medium">{preview.type.split("/")?.[1]?.toUpperCase?.() || "FILE"}</span>
                          </div>
                          {preview.dimensions !== "N/A" && (
                            <div className="flex justify-between col-span-2">
                              <span>Dimensions:</span>
                              <span className="font-medium">{preview.dimensions}</span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2 justify-center">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 h-9 border-theme-border hover:bg-theme-primary/10"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleView(id, typeof currentFile === "string" ? currentFile : null)
                      }}
                    >
                      <Eye className="h-3 w-3 mr-2" />
                      View
                    </Button>

                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 h-9 border-theme-border hover:bg-theme-primary/10"
                      onClick={(e) => {
                        e.stopPropagation()
                        triggerInputClick(id)
                      }}
                    >
                      <Camera className="h-3 w-3 mr-2" />
                      Change
                    </Button>
                  </div>
                </div>
              ) : currentFile === "skipped" ? (
                <div className="text-center text-theme-text-muted">
                  <FileText className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p className="font-medium">Document Skipped</p>
                  <p className="text-sm mt-1">Optional - not required</p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-3 h-8 text-xs border-theme-border hover:bg-theme-primary/10"
                    onClick={(e) => {
                      e.stopPropagation()
                      triggerInputClick(id)
                    }}
                  >
                    Upload Anyway
                  </Button>
                </div>
              ) : (
                <div className="text-center">
                  <div className="h-12 w-12 rounded-full bg-theme-primary/20 flex items-center justify-center mx-auto mb-3">
                    <Upload className="h-6 w-6 text-theme-primary" />
                  </div>
                  <p className="font-semibold text-theme-text mb-1">Click to upload {label.toLowerCase()}</p>
                  <p className="text-sm text-theme-text-muted">
                    {documentType.includes("profilePicture") || documentType.includes("idDocument")
                      ? "JPG, PNG, WebP (max 5MB)"
                      : "Images, PDF, DOC (max 5MB)"}
                  </p>
                  <p className="text-xs text-theme-text-muted/80 mt-2">or drag and drop</p>
                </div>
              )}
            </div>

            {/* progress */}
            {uploadProgress[documentType] > 0 && uploadProgress[documentType] < 100 && (
              <div className="absolute bottom-0 left-0 right-0 p-2 bg-white/90 backdrop-blur-sm">
                <div className="space-y-1">
                  <Progress value={uploadProgress[documentType]} className="h-1" />
                  <p className="text-xs text-theme-text-muted text-center">Uploading... {uploadProgress[documentType]}%</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 px-4 sm:px-0">
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-theme-primary/10 border border-theme-primary/20">
          <CreditCard className="h-4 w-4 text-theme-primary" />
          <span className="text-sm font-medium text-theme-primary">Step 4 of 8</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-theme-text">Upload Your Documents</h1>
        <p className="text-theme-text-muted text-lg max-w-2xl mx-auto">
          Please provide the required documents to complete your profile verification
        </p>
      </div>

      <div className="rounded-2xl p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200">
        <div className="flex items-start gap-4">
          <div className="h-12 w-12 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0">
            <Info className="h-6 w-6 text-blue-600" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Upload Guidelines</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-gray-700">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                <span>Ensure documents are clear and readable</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                <span>Use good lighting for photos</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                <span>File size should be under 5MB</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                <span>Supported formats: JPG, PNG, PDF, DOC</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Required Documents */}
      <div className="space-y-1">
        <h2 className="text-xl font-semibold text-theme-text flex items-center gap-2">
          <User className="h-5 w-5 text-theme-primary" />
          Required Documents
        </h2>
        <p className="text-theme-text-muted text-sm">These documents are mandatory for profile verification</p>
      </div>

      <div className="space-y-4">
        <UnifiedUploadField
          id="profilePicture"
          label="Profile Photo"
          required={true}
          currentFile={data?.documents?.profilePicture ?? null}
          documentType="profilePicture"
          aspectRatio="square"
          description="A clear headshot photo for your profile"
          icon={User}
        />

        <div className="grid gap-4 md:grid-cols-2">
          <UnifiedUploadField
            id="idDocumentFront"
            label="National ID - Front"
            required={true}
            currentFile={data?.documents?.idDocumentFront ?? null}
            documentType="idDocumentFront"
            aspectRatio="rectangle"
            description="Front side of your national ID card"
            icon={CreditCard}
          />

          <UnifiedUploadField
            id="idDocumentBack"
            label="National ID - Back"
            required={true}
            currentFile={data?.documents?.idDocumentBack ?? null}
            documentType="idDocumentBack"
            aspectRatio="rectangle"
            description="Back side of your national ID card"
            icon={CreditCard}
          />
        </div>
      </div>

      {/* Optional Documents */}
      <div className="space-y-1 pt-4">
        <h2 className="text-xl font-semibold text-theme-text flex items-center gap-2">
          <FileText className="h-5 w-5 text-theme-primary" />
          Additional Documents
        </h2>
        <p className="text-theme-text-muted text-sm">These documents are optional but recommended</p>
      </div>

      <div className="space-y-4">
        <UnifiedUploadField
          id="passportDocument"
          label="Passport"
          required={false}
          optional
          currentFile={data?.documents?.passportDocument ?? null}
          documentType="passport"
          description="International passport if available"
          onSkip={() => updateData("documents", { passportDocument: "skipped" })}
        />

        <UnifiedUploadField
          id="kraDocument"
          label="KRA PIN Certificate"
          required={false}
          optional
          currentFile={data?.documents?.kraDocument ?? null}
          documentType="kra"
          description="Kenya Revenue Authority PIN certificate"
          onSkip={() => updateData("documents", { kraDocument: "skipped" })}
        />

        <UnifiedUploadField
          id="goodConductDocument"
          label="Certificate of Good Conduct"
          required={false}
          optional
          currentFile={data?.documents?.goodConductUrl ?? null}
          documentType="goodConduct"
          description="Police clearance certificate"
          onSkip={() => updateData("documents", { goodConductUrl: "skipped" })}
        />
      </div>

      {/* status summary */}
      {(data?.documents?.profilePicture || data?.documents?.idDocumentFront || data?.documents?.idDocumentBack) && (
        <div className="rounded-2xl p-6 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200">
          <div className="flex items-center gap-3">
            <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-green-900">Great progress!</h3>
              <p className="text-green-700 text-sm">
                You've uploaded{" "}
                {[
                  data?.documents?.profilePicture && "profile photo",
                  data?.documents?.idDocumentFront && "ID front",
                  data?.documents?.idDocumentBack && "ID back"
                ]
                  .filter(Boolean)
                  .length}{" "}
                of 3 required documents
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
