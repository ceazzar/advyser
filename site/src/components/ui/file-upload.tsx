"use client"

import * as React from "react"
import { Upload, X, File, Image, FileText } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "./button"

// MIME type mapping for server-side validation
// The accept attribute is client-side only and can be bypassed
const ALLOWED_MIME_TYPES: Record<string, string[]> = {
  '.pdf': ['application/pdf'],
  '.doc': ['application/msword'],
  '.docx': ['application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
  '.txt': ['text/plain'],
  '.jpg': ['image/jpeg'],
  '.jpeg': ['image/jpeg'],
  '.png': ['image/png'],
  '.gif': ['image/gif'],
  '.webp': ['image/webp'],
  '.svg': ['image/svg+xml'],
  '.csv': ['text/csv', 'application/csv'],
  '.xls': ['application/vnd.ms-excel'],
  '.xlsx': ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'],
  '.zip': ['application/zip', 'application/x-zip-compressed'],
  '.mp3': ['audio/mpeg'],
  '.mp4': ['video/mp4'],
  '.json': ['application/json'],
  '.xml': ['application/xml', 'text/xml'],
}

/**
 * Parse the accept prop and return allowed MIME types
 * Handles formats like ".pdf,.doc" or "image/*" or "application/pdf"
 */
function parseAcceptToMimeTypes(accept: string): Set<string> {
  const allowedMimes = new Set<string>()
  const parts = accept.split(',').map(p => p.trim().toLowerCase())

  for (const part of parts) {
    if (part.startsWith('.')) {
      // Extension format: .pdf, .doc, etc.
      const mimes = ALLOWED_MIME_TYPES[part]
      if (mimes) {
        mimes.forEach(m => allowedMimes.add(m))
      }
    } else if (part.endsWith('/*')) {
      // Wildcard format: image/*, video/*, etc.
      const category = part.slice(0, -2)
      // Add the category prefix for wildcard matching
      allowedMimes.add(`${category}/*`)
    } else {
      // Direct MIME type: application/pdf, etc.
      allowedMimes.add(part)
    }
  }

  return allowedMimes
}

/**
 * Check if a file's MIME type is allowed
 */
function isValidMimeType(file: File, allowedMimes: Set<string>): boolean {
  const fileType = file.type.toLowerCase()

  // Direct match
  if (allowedMimes.has(fileType)) {
    return true
  }

  // Check for wildcard matches (e.g., image/*)
  const [category] = fileType.split('/')
  if (allowedMimes.has(`${category}/*`)) {
    return true
  }

  return false
}

export interface FileUploadProps {
  accept?: string
  multiple?: boolean
  maxSize?: number // in MB
  onChange?: (files: File[]) => void
  disabled?: boolean
  className?: string
  placeholder?: string
}

function FileUpload({
  accept,
  multiple = false,
  maxSize = 10,
  onChange,
  disabled = false,
  className,
  placeholder = "Drag and drop files here, or click to browse",
}: FileUploadProps) {
  const [isDragging, setIsDragging] = React.useState(false)
  const [files, setFiles] = React.useState<File[]>([])
  const [error, setError] = React.useState<string | null>(null)
  const inputRef = React.useRef<HTMLInputElement>(null)

  const handleFiles = (newFiles: FileList | null) => {
    if (!newFiles) return
    setError(null)

    // Parse allowed MIME types if accept prop is provided
    const allowedMimes = accept ? parseAcceptToMimeTypes(accept) : null

    const validFiles: File[] = []
    Array.from(newFiles).forEach((file) => {
      // Validate MIME type if accept prop is provided
      if (allowedMimes && allowedMimes.size > 0) {
        if (!isValidMimeType(file, allowedMimes)) {
          setError(`File "${file.name}" has invalid file type. Allowed: ${accept}`)
          return
        }
      }

      // Validate file size
      if (file.size > maxSize * 1024 * 1024) {
        setError(`File "${file.name}" exceeds ${maxSize}MB limit`)
        return
      }
      validFiles.push(file)
    })

    const updated = multiple ? [...files, ...validFiles] : validFiles.slice(0, 1)
    setFiles(updated)
    onChange?.(updated)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    if (!disabled) setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    if (!disabled) handleFiles(e.dataTransfer.files)
  }

  const removeFile = (index: number) => {
    const updated = files.filter((_, i) => i !== index)
    setFiles(updated)
    onChange?.(updated)
  }

  const getFileIcon = (file: File) => {
    if (file.type.startsWith("image/")) return <Image className="size-4" />
    if (file.type.includes("pdf")) return <FileText className="size-4" />
    return <File className="size-4" />
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  return (
    <div className={cn("space-y-3", className)}>
      {/* Drop Zone */}
      <div
        onClick={() => !disabled && inputRef.current?.click()}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn(
          "relative flex flex-col items-center justify-center gap-2 p-8 rounded-lg border-2 border-dashed cursor-pointer transition-all duration-200",
          "bg-muted/30 border-border",
          "hover:bg-muted/50 hover:border-primary/50",
          isDragging && "bg-primary/5 border-primary",
          error && "border-destructive",
          disabled && "opacity-50 cursor-not-allowed hover:bg-muted/30 hover:border-border"
        )}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          disabled={disabled}
          onChange={(e) => handleFiles(e.target.files)}
          className="hidden"
        />
        <div className={cn(
          "size-12 rounded-full flex items-center justify-center",
          isDragging ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
        )}>
          <Upload className="size-6" />
        </div>
        <p className="text-sm text-muted-foreground text-center">{placeholder}</p>
        <p className="text-xs text-muted-foreground">
          {accept ? `Accepted: ${accept}` : "All file types"} • Max {maxSize}MB
        </p>
      </div>

      {/* Error */}
      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}

      {/* File List */}
      {files.length > 0 && (
        <div className="space-y-2">
          {files.map((file, index) => (
            <div
              key={`${file.name}-${index}`}
              className="flex items-center gap-3 p-3 bg-muted/50 rounded-md"
            >
              <div className="text-muted-foreground">
                {getFileIcon(file)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{file.name}</p>
                <p className="text-xs text-muted-foreground">{formatFileSize(file.size)}</p>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                onClick={(e) => {
                  e.stopPropagation()
                  removeFile(index)
                }}
              >
                <X className="size-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export { FileUpload }
