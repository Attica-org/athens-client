import { useEffect } from 'react';

function useScreenReaderClickOutside(
  ref: React.RefObject<HTMLElement>,
  setIsActive: React.Dispatch<React.SetStateAction<boolean>>,
) {
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsActive(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [ref, setIsActive]);
}

export default useScreenReaderClickOutside;
