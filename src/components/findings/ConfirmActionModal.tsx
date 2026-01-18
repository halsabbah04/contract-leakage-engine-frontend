import { useState } from 'react';
import { X, AlertTriangle, Check, XCircle, CheckCircle } from 'lucide-react';
import clsx from 'clsx';

interface ConfirmActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason?: string) => void;
  isSubmitting?: boolean;
  action: 'accept' | 'reject' | 'false_positive' | 'resolve';
  title: string;
  description: string;
  requireReason?: boolean;
}

const actionConfig = {
  accept: {
    icon: Check,
    iconColor: 'text-success',
    buttonClass: 'btn-success',
    buttonLabel: 'Accept Finding',
  },
  reject: {
    icon: XCircle,
    iconColor: 'text-error',
    buttonClass: 'bg-error hover:bg-error/90 text-white',
    buttonLabel: 'Reject Finding',
  },
  false_positive: {
    icon: AlertTriangle,
    iconColor: 'text-warning',
    buttonClass: 'bg-warning hover:bg-warning/90 text-white',
    buttonLabel: 'Mark as False Positive',
  },
  resolve: {
    icon: CheckCircle,
    iconColor: 'text-success',
    buttonClass: 'btn-success',
    buttonLabel: 'Mark as Resolved',
  },
};

export default function ConfirmActionModal({
  isOpen,
  onClose,
  onConfirm,
  isSubmitting = false,
  action,
  title,
  description,
  requireReason = false,
}: ConfirmActionModalProps) {
  const [reason, setReason] = useState('');
  const config = actionConfig[action];
  const Icon = config.icon;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (requireReason && !reason.trim()) return;
    onConfirm(reason.trim() || undefined);
  };

  const handleClose = () => {
    setReason('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
            <Icon size={20} className={config.iconColor} />
            <span>{title}</span>
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
          <p className="text-sm text-gray-700">{description}</p>

          {/* Optional/Required Reason */}
          <div>
            <label htmlFor="reason" className="block text-sm font-medium text-gray-700 mb-2">
              Reason {requireReason && <span className="text-error">*</span>}
            </label>
            <textarea
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder={
                requireReason
                  ? 'Please provide a reason for this action...'
                  : 'Optionally provide a reason...'
              }
              rows={3}
              className="input w-full resize-none"
              required={requireReason}
            />
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
              disabled={isSubmitting || (requireReason && !reason.trim())}
              className={clsx('btn', config.buttonClass)}
            >
              {isSubmitting ? (
                <>
                  <span className="spinner mr-2"></span>
                  Processing...
                </>
              ) : (
                config.buttonLabel
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
