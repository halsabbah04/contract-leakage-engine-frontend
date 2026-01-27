import { useState, useEffect } from 'react';

const USER_EMAIL_KEY = 'contract_leakage_user_email';

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

export { USER_EMAIL_KEY };
