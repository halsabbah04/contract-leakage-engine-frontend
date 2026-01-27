import { useState } from 'react';
import { MoreVertical, Check, X, AlertTriangle, MessageSquare, CheckCircle } from 'lucide-react';
import type { LeakageFinding } from '@contract-leakage/shared-types';
import clsx from 'clsx';

interface FindingActionsMenuProps {
  finding: LeakageFinding;
  onAccept: () => void;
  onReject: () => void;
  onMarkFalsePositive: () => void;
  onChangeSeverity: () => void;
  onAddNote: () => void;
  onResolve: () => void;
}

export default function FindingActionsMenu({
  finding,
  onAccept,
  onReject,
  onMarkFalsePositive,
  onChangeSeverity,
  onAddNote,
  onResolve,
}: FindingActionsMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Check if finding should have actions disabled based on its properties
  // For now, all findings can be acted upon (can be extended with override status later)
  const isResolved = false;

  const actions = [
    {
      label: 'Accept Finding',
      icon: Check,
      onClick: onAccept,
      className: 'text-success hover:bg-green-50',
      disabled: isResolved,
    },
    {
      label: 'Reject Finding',
      icon: X,
      onClick: onReject,
      className: 'text-error hover:bg-red-50',
      disabled: isResolved,
    },
    {
      label: 'Mark as False Positive',
      icon: AlertTriangle,
      onClick: onMarkFalsePositive,
      className: 'text-warning hover:bg-yellow-50',
      disabled: isResolved,
    },
    {
      label: 'Change Severity',
      icon: AlertTriangle,
      onClick: onChangeSeverity,
      className: 'text-gray-700 hover:bg-gray-50',
      disabled: false,
    },
    {
      label: 'Add Note',
      icon: MessageSquare,
      onClick: onAddNote,
      className: 'text-primary hover:bg-blue-50',
      disabled: false,
    },
    {
      label: 'Mark as Resolved',
      icon: CheckCircle,
      onClick: onResolve,
      className: 'text-success hover:bg-green-50',
      disabled: isResolved,
    },
  ];

  return (
    <div className="relative">
      <button
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        className="p-2 rounded-full hover:bg-gray-100 transition-colors"
        title={`Actions for finding: ${finding.risk_type}`}
        aria-label={`Open actions menu for ${finding.severity} severity finding`}
      >
        <MoreVertical size={20} className="text-gray-500" />
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />

          {/* Dropdown Menu */}
          <div className="absolute right-0 top-10 z-20 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-1">
            {actions.map((action, index) => {
              const Icon = action.icon;
              return (
                <button
                  key={index}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (!action.disabled) {
                      action.onClick();
                      setIsOpen(false);
                    }
                  }}
                  disabled={action.disabled}
                  className={clsx(
                    'w-full flex items-center space-x-3 px-4 py-2 text-sm transition-colors',
                    action.className,
                    action.disabled && 'opacity-50 cursor-not-allowed'
                  )}
                >
                  <Icon size={16} />
                  <span>{action.label}</span>
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
