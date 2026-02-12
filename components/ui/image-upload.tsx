"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { ImagePlus, X, Loader2 } from "lucide-react"

interface ImageUploadProps {
    value: string | null
    onChange: (file: File | null) => void
    onRemove: () => void
    disabled?: boolean
    className?: string
}

export function ImageUpload({ value, onChange, onRemove, disabled = false, className = "" }: ImageUploadProps) {
    const [preview, setPreview] = useState<string | null>(value)
    const fileInputRef = useRef<HTMLInputElement>(null)
    const [isHovering, setIsHovering] = useState(false)

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                alert("El archivo es demasiado grande. Máximo 5MB.")
                return
            }

            const objectUrl = URL.createObjectURL(file)
            setPreview(objectUrl)
            onChange(file)
        }
    }

    const handleRemove = () => {
        setPreview(null)
        onRemove()
        if (fileInputRef.current) {
            fileInputRef.current.value = ""
        }
    }

    const triggerUpload = () => {
        if (!disabled) {
            fileInputRef.current?.click()
        }
    }

    return (
        <div className={`relative ${className}`}>
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/png, image/jpeg, image/webp"
                className="hidden"
                disabled={disabled}
            />

            {preview ? (
                <div className="relative w-32 h-32 rounded-lg overflow-hidden border border-border group">
                    <img
                        src={preview}
                        alt="Upload preview"
                        className="w-full h-full object-cover"
                    />
                    {!disabled && (
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                            <Button
                                type="button"
                                variant="destructive"
                                size="icon"
                                className="h-8 w-8 rounded-full"
                                onClick={handleRemove}
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                    )}
                </div>
            ) : (
                <div
                    onClick={triggerUpload}
                    onMouseEnter={() => setIsHovering(true)}
                    onMouseLeave={() => setIsHovering(false)}
                    className={`
            w-32 h-32 rounded-lg border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-colors
            ${isHovering ? "border-primary bg-primary/5" : "border-border bg-secondary/50"}
            ${disabled ? "opacity-50 cursor-not-allowed" : ""}
          `}
                >
                    <div className="flex flex-col items-center gap-2 text-muted-foreground p-2 text-center">
                        <ImagePlus className={`w-8 h-8 ${isHovering ? "text-primary" : ""}`} />
                        <span className="text-xs">Subir imagen</span>
                    </div>
                </div>
            )}
            <p className="text-xs text-muted-foreground mt-2">
                PNG, JPG, WEBP hasta 5MB
            </p>
        </div>
    )
}
