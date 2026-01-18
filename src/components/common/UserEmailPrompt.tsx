import { useState, useEffect } from 'react';
import { X, User } from 'lucide-react';

interface UserEmailPromptProps {
  onEmailSet: (email: string) => void;
}

const USER_EMAIL_KEY = 'contract_leakage_user_email';

export default function UserEmailPrompt({ onEmailSet }: UserEmailPromptProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    // Check if email is already stored
    const storedEmail = localStorage.getItem(USER_EMAIL_KEY);
    if (storedEmail) {
      onEmailSet(storedEmail);
    } else {
      setIsOpen(true);
    }
  }, [onEmailSet]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validate email
    if (!email.trim()) {
      setError('Email is required');
      return;
    }

    if (!email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }

    // Store email
    localStorage.setItem(USER_EMAIL_KEY, email.trim());
    onEmailSet(email.trim());
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
            <User size={20} className="text-primary" />
            <span>Enter Your Email</span>
          </h3>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <p className="text-sm text-gray-600">
            Please enter your email address to track your changes and overrides to findings.
          </p>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email Address <span className="text-error">*</span>
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your.email@company.com"
              className="input w-full"
              autoFocus
              required
            />
            {error && <p className="mt-2 text-sm text-error">{error}</p>}
          </div>

          <p className="text-xs text-gray-500">
            Your email will be stored locally and used to sign your actions for audit purposes.
          </p>

          {/* Actions */}
          <div className="flex items-center justify-end pt-4 border-t border-gray-200">
            <button type="submit" className="btn btn-primary w-full">
              Continue
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/**
 * Hook to get and manage user email
 */
export function useUserEmail(): [string | null, () => void] {
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    const storedEmail = localStorage.getItem(USER_EMAIL_KEY);
    if (storedEmail) {
      setUserEmail(storedEmail);
    }
  }, []);

  const clearEmail = () => {
    localStorage.removeItem(USER_EMAIL_KEY);
    setUserEmail(null);
  };

  return [userEmail, clearEmail];
}
