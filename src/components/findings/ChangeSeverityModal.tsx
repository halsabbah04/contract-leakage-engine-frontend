import { useState } from 'react';
import { X, AlertTriangle } from 'lucide-react';
import { Severity } from '@contract-leakage/shared-types';
import SeverityBadge from '../common/SeverityBadge';

interface ChangeSeverityModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentSeverity: Severity;
  onSubmit: (newSeverity: Severity, reason: string) => void;
  isSubmitting?: boolean;
}

const severityOptions: Severity[] = [
  Severity.CRITICAL,
  Severity.HIGH,
  Severity.MEDIUM,
  Severity.LOW,
];

export default function ChangeSeverityModal({
  isOpen,
  onClose,
  currentSeverity,
  onSubmit,
  isSubmitting = false,
}: ChangeSeverityModalProps) {
  const [newSeverity, setNewSeverity] = useState<Severity>(currentSeverity);
  const [reason, setReason] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newSeverity === currentSeverity) {
      return;
    }
    onSubmit(newSeverity, reason);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
            <AlertTriangle size={20} className="text-warning" />
            <span>Change Severity</span>
          </h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Current Severity */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Current Severity
            </label>
            <SeverityBadge severity={currentSeverity} showIcon size="lg" />
          </div>

          {/* New Severity */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              New Severity <span className="text-error">*</span>
            </label>
            <div className="space-y-2">
              {severityOptions.map((severity) => (
                <label
                  key={severity}
                  className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  <input
                    type="radio"
                    name="severity"
                    value={severity}
                    checked={newSeverity === severity}
                    onChange={(e) => setNewSeverity(e.target.value as Severity)}
                    className="w-4 h-4 text-primary border-gray-300 focus:ring-primary"
                  />
                  <SeverityBadge severity={severity} showIcon size="md" />
                </label>
              ))}
            </div>
          </div>

          {/* Reason */}
          <div>
            <label htmlFor="reason" className="block text-sm font-medium text-gray-700 mb-2">
              Reason for Change
            </label>
            <textarea
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Explain why you're changing the severity..."
              rows={3}
              className="input w-full resize-none"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="btn btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || newSeverity === currentSeverity}
              className="btn btn-primary"
            >
              {isSubmitting ? (
                <>
                  <span className="spinner mr-2"></span>
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
