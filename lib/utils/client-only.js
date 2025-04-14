import { useEffect, useState } from 'react';

// Use this wrapper for components that need client-side only rendering
export function ClientOnly({ children, ...delegated }) {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) {
    return null;
  }

  return <div {...delegated}>{children}</div>;
}

// For values that should only be calculated client-side
export function useClientSideValue(getValue) {
  const [value, setValue] = useState(null);

  useEffect(() => {
    setValue(getValue());
  }, [getValue]);

  return value;
}
