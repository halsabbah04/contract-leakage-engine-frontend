import { useCallback, useState } from 'react';
import { Upload, File, X, CheckCircle, AlertCircle } from 'lucide-react';
import clsx from 'clsx';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  acceptedFileTypes?: string[];
  maxFileSizeMB?: number;
  disabled?: boolean;
}

const DEFAULT_ACCEPTED_TYPES = ['.pdf', '.docx', '.doc', '.txt'];
const DEFAULT_MAX_SIZE_MB = 10;

export default function FileUpload({
  onFileSelect,
  acceptedFileTypes = DEFAULT_ACCEPTED_TYPES,
  maxFileSizeMB = DEFAULT_MAX_SIZE_MB,
  disabled = false,
}: FileUploadProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validateFile = (file: File): string | null => {
    // Check file type
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
    if (!acceptedFileTypes.includes(fileExtension)) {
      return `File type not supported. Please upload: ${acceptedFileTypes.join(', ')}`;
    }

    // Check file size
    const fileSizeMB = file.size / (1024 * 1024);
    if (fileSizeMB > maxFileSizeMB) {
      return `File size exceeds ${maxFileSizeMB}MB limit. Your file is ${fileSizeMB.toFixed(2)}MB`;
    }

    return null;
  };

  const handleFileChange = useCallback(
    (file: File) => {
      setError(null);

      const validationError = validateFile(file);
      if (validationError) {
        setError(validationError);
        setSelectedFile(null);
        return;
      }

      setSelectedFile(file);
      onFileSelect(file);
    },
    [onFileSelect]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragging(false);

      if (disabled) return;

      const file = e.dataTransfer.files[0];
      if (file) {
        handleFileChange(file);
      }
    },
    [disabled, handleFileChange]
  );

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        handleFileChange(file);
      }
    },
    [handleFileChange]
  );

  const handleRemoveFile = useCallback(() => {
    setSelectedFile(null);
    setError(null);
  }, []);

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  return (
    <div className="space-y-4">
      {/* Drop Zone */}
      <div
        className={clsx(
          'relative border-2 border-dashed rounded-lg transition-all duration-200',
          isDragging && !disabled && 'border-primary bg-primary/5 scale-105',
          !isDragging && !selectedFile && !error && 'border-gray-300 hover:border-primary/50',
          selectedFile && 'border-success bg-success-light',
          error && 'border-error bg-error-light',
          disabled && 'opacity-50 cursor-not-allowed'
        )}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <input
          type="file"
          id="file-upload"
          className="hidden"
          accept={acceptedFileTypes.join(',')}
          onChange={handleInputChange}
          disabled={disabled}
        />

        <label
          htmlFor="file-upload"
          className={clsx(
            'flex flex-col items-center justify-center py-12 px-6 cursor-pointer',
            disabled && 'cursor-not-allowed'
          )}
        >
          {!selectedFile && !error && (
            <>
              <div
                className={clsx(
                  'p-4 rounded-full mb-4 transition-colors',
                  isDragging ? 'bg-primary text-white' : 'bg-gray-100 text-gray-400'
                )}
              >
                <Upload size={32} />
              </div>
              <h3 className="text-lg font-semibold text-gray-700 mb-2">
                {isDragging ? 'Drop your file here' : 'Upload Contract File'}
              </h3>
              <p className="text-sm text-gray-500 mb-2">
                Drag and drop or click to browse
              </p>
              <p className="text-xs text-gray-400">
                Supported formats: {acceptedFileTypes.join(', ')} (max {maxFileSizeMB}MB)
              </p>
            </>
          )}

          {selectedFile && !error && (
            <div className="flex items-center space-x-4 w-full">
              <div className="flex-shrink-0">
                <CheckCircle size={48} className="text-success" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2">
                  <File size={20} className="text-gray-600" />
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {selectedFile.name}
                  </p>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {formatFileSize(selectedFile.size)}
                </p>
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  handleRemoveFile();
                }}
                className="flex-shrink-0 p-2 rounded-full hover:bg-gray-100 transition-colors"
                disabled={disabled}
              >
                <X size={20} className="text-gray-500" />
              </button>
            </div>
          )}

          {error && (
            <div className="flex items-start space-x-4 w-full">
              <div className="flex-shrink-0">
                <AlertCircle size={48} className="text-error" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-error mb-2">Upload Error</h3>
                <p className="text-sm text-gray-700">{error}</p>
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    handleRemoveFile();
                  }}
                  className="mt-3 text-sm text-primary hover:underline"
                >
                  Try another file
                </button>
              </div>
            </div>
          )}
        </label>
      </div>

      {/* File Info */}
      {selectedFile && !error && (
        <div className="card-compact">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-700">Ready to upload</p>
              <p className="text-xs text-gray-500 mt-1">
                File will be processed for clause extraction and leakage analysis
              </p>
            </div>
            <CheckCircle size={24} className="text-success" />
          </div>
        </div>
      )}
    </div>
  );
}
