import { useState, useEffect } from 'react';

const FOCUS_MODE_KEY = 'taskzen-focus-mode';

export function useFocusMode() {
  const [isFocusModeEnabled, setIsFocusModeEnabled] = useState<boolean>(() => {
    const stored = localStorage.getItem(FOCUS_MODE_KEY);
    return stored === 'true';
  });

  useEffect(() => {
    localStorage.setItem(FOCUS_MODE_KEY, String(isFocusModeEnabled));
  }, [isFocusModeEnabled]);

  return {
    isFocusModeEnabled,
    setFocusModeEnabled: setIsFocusModeEnabled,
    toggleFocusMode: () => setIsFocusModeEnabled(prev => !prev),
  };
}
