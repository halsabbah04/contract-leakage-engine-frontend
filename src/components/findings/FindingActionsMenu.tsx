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

  const actions = [
    {
      label: 'Accept Finding',
      icon: Check,
      onClick: onAccept,
      className: 'text-success hover:bg-green-50',
    },
    {
      label: 'Reject Finding',
      icon: X,
      onClick: onReject,
      className: 'text-error hover:bg-red-50',
    },
    {
      label: 'Mark as False Positive',
      icon: AlertTriangle,
      onClick: onMarkFalsePositive,
      className: 'text-warning hover:bg-yellow-50',
    },
    {
      label: 'Change Severity',
      icon: AlertTriangle,
      onClick: onChangeSeverity,
      className: 'text-gray-700 hover:bg-gray-50',
    },
    {
      label: 'Add Note',
      icon: MessageSquare,
      onClick: onAddNote,
      className: 'text-primary hover:bg-blue-50',
    },
    {
      label: 'Mark as Resolved',
      icon: CheckCircle,
      onClick: onResolve,
      className: 'text-success hover:bg-green-50',
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
        title="Finding actions"
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
                    action.onClick();
                    setIsOpen(false);
                  }}
                  className={clsx(
                    'w-full flex items-center space-x-3 px-4 py-2 text-sm transition-colors',
                    action.className
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
