import { useState, useEffect } from 'react';
import { X, Download, Loader2, AlertCircle, Maximize2, Minimize2 } from 'lucide-react';

interface DocumentViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  documentUrl: string | null;
  filename: string;
  contentType: string;
  isLoading: boolean;
  error: string | null;
}

export default function DocumentViewerModal({
  isOpen,
  onClose,
  documentUrl,
  filename,
  contentType,
  isLoading,
  error,
}: DocumentViewerModalProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isFullscreen) {
          setIsFullscreen(false);
        } else {
          onClose();
        }
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, isFullscreen, onClose]);

  if (!isOpen) return null;

  const isPdf = contentType?.toLowerCase().includes('pdf') || filename?.toLowerCase().endsWith('.pdf');
  const isImage = contentType?.toLowerCase().startsWith('image/');

  const handleDownload = () => {
    if (documentUrl) {
      const link = document.createElement('a');
      link.href = documentUrl;
      link.download = filename || 'document';
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className={`relative bg-white rounded-lg shadow-2xl flex flex-col transition-all duration-200 ${
          isFullscreen
            ? 'w-full h-full rounded-none'
            : 'w-[95vw] h-[90vh] max-w-7xl'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b bg-gray-50 rounded-t-lg">
          <div className="flex items-center space-x-3">
            <h3 className="font-semibold text-gray-800 truncate max-w-md">
              {filename || 'Document Viewer'}
            </h3>
            {contentType && (
              <span className="px-2 py-0.5 text-xs bg-gray-200 text-gray-600 rounded">
                {contentType.split('/').pop()?.toUpperCase()}
              </span>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleDownload}
              disabled={!documentUrl || isLoading}
              className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-50"
              title="Download document"
            >
              <Download size={18} />
            </button>
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-200 rounded-lg transition-colors"
              title={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}
            >
              {isFullscreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
            </button>
            <button
              onClick={onClose}
              className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="Close"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden bg-gray-100">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-full">
              <Loader2 size={48} className="animate-spin text-primary mb-4" />
              <p className="text-gray-600">Loading document...</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center h-full">
              <AlertCircle size={48} className="text-red-500 mb-4" />
              <p className="text-gray-800 font-medium mb-2">Failed to load document</p>
              <p className="text-gray-600 text-sm">{error}</p>
              <button
                onClick={onClose}
                className="mt-4 btn btn-secondary"
              >
                Close
              </button>
            </div>
          ) : documentUrl ? (
            isPdf ? (
              <iframe
                src={documentUrl}
                className="w-full h-full border-0"
                title={filename}
              />
            ) : isImage ? (
              <div className="flex items-center justify-center h-full p-4 overflow-auto">
                <img
                  src={documentUrl}
                  alt={filename}
                  className="max-w-full max-h-full object-contain"
                />
              </div>
            ) : (
              // For other document types (DOCX, DOC, TXT), try iframe or show download option
              <div className="flex flex-col items-center justify-center h-full p-8">
                <AlertCircle size={48} className="text-yellow-500 mb-4" />
                <p className="text-gray-800 font-medium mb-2">
                  Preview not available for this file type
                </p>
                <p className="text-gray-600 text-sm mb-4 text-center">
                  This document type ({contentType || 'unknown'}) cannot be previewed directly in the browser.
                </p>
                <div className="flex space-x-3">
                  <button
                    onClick={handleDownload}
                    className="btn btn-primary flex items-center"
                  >
                    <Download size={16} className="mr-2" />
                    Download to View
                  </button>
                  <a
                    href={documentUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-secondary"
                  >
                    Open in New Tab
                  </a>
                </div>
              </div>
            )
          ) : (
            <div className="flex flex-col items-center justify-center h-full">
              <AlertCircle size={48} className="text-gray-400 mb-4" />
              <p className="text-gray-600">No document available</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
