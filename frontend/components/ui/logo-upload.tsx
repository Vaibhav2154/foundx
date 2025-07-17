import React, { useState, useRef } from 'react';
import { Upload, X, Check } from 'lucide-react';
import { cn } from '@/utils/cn';

interface LogoUploadProps {
  onLogoChange: (logoBase64: string | null) => void;
  className?: string;
}

export function LogoUpload({ onLogoChange, className }: LogoUploadProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    if (!file.type.match('image.*')) {
      setError('Please select an image file');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const base64 = e.target?.result as string;
      setPreview(base64);
      onLogoChange(base64);
      setError(null);
    };
    reader.readAsDataURL(file);
  };

  const clearLogo = () => {
    setPreview(null);
    onLogoChange(null);
    setError(null);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  return (
    <div className={cn("w-full", className)}>
      <div className="flex flex-col items-center">
        {!preview && (
          <div 
            className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer hover:border-blue-400 transition-colors"
            onClick={() => inputRef.current?.click()}
          >
            <Upload className="h-8 w-8 text-gray-400 mb-2" />
            <p className="text-sm text-gray-500">Click to upload company logo</p>
            <p className="text-xs text-gray-400 mt-1">PNG, JPG up to 1MB</p>
          </div>
        )}

        {preview && (
          <div className="relative w-full">
            <div className="flex items-center justify-center border rounded-lg p-4 bg-gray-50">
              <img 
                src={preview} 
                alt="Logo preview" 
                className="max-h-24 max-w-full object-contain"
              />
              <button 
                className="absolute top-2 right-2 bg-red-500 rounded-full p-1 shadow-sm hover:bg-red-600 transition-colors"
                onClick={clearLogo}
              >
                <X className="h-4 w-4 text-white" />
              </button>
            </div>
            <div className="mt-2 flex items-center justify-center text-sm text-green-600">
              <Check className="h-4 w-4 mr-1" />
              Logo uploaded successfully
            </div>
          </div>
        )}

        {error && (
          <div className="mt-2 text-sm text-red-500">
            {error}
          </div>
        )}

        <input
          ref={inputRef}
          type="file"
          className="hidden"
          accept="image/png, image/jpeg"
          onChange={handleFileChange}
        />
      </div>
    </div>
  );
}
