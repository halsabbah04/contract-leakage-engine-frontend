import { useState } from 'react';
import { X, MessageSquare } from 'lucide-react';

interface AddNoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (note: string) => void;
  isSubmitting?: boolean;
}

export default function AddNoteModal({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting = false,
}: AddNoteModalProps) {
  const [note, setNote] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!note.trim()) return;
    onSubmit(note.trim());
  };

  const handleClose = () => {
    setNote('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
            <MessageSquare size={20} className="text-primary" />
            <span>Add Note</span>
          </h3>
          <button
            onClick={handleClose}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label htmlFor="note" className="block text-sm font-medium text-gray-700 mb-2">
              Your Note <span className="text-error">*</span>
            </label>
            <textarea
              id="note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Add your comments, observations, or follow-up actions..."
              rows={5}
              className="input w-full resize-none"
              autoFocus
              required
            />
            <p className="mt-2 text-xs text-gray-500">
              Notes are stored with your email and timestamp for audit purposes.
            </p>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={handleClose}
              disabled={isSubmitting}
              className="btn btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !note.trim()}
              className="btn btn-primary"
            >
              {isSubmitting ? (
                <>
                  <span className="spinner mr-2"></span>
                  Adding...
                </>
              ) : (
                'Add Note'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
