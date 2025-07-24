import React, { useRef } from 'react';
import { Button } from '@/components/ui/Button';
import { Upload } from 'lucide-react';

interface ReceiptFileUploadButtonProps {
  onUpload: (file: File) => void;
  uploading?: boolean;
}

const ReceiptFileUploadButton: React.FC<ReceiptFileUploadButtonProps> = ({ onUpload, uploading }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onUpload(file);
      e.target.value = '';
    }
  };

  return (
    <>
      <input
        type="file"
        accept="image/*,application/pdf"
        ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />
      <Button
        variant="secondary"
        className="flex items-center"
        onClick={() => fileInputRef.current?.click()}
        disabled={!!uploading}
      >
        {uploading ? (
          <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></span>
        ) : (
          <Upload className="mr-2 h-4 w-4" />
        )}
        {uploading ? 'Uploading...' : 'Upload Receipt File'}
      </Button>
    </>
  );
};

export default ReceiptFileUploadButton;
