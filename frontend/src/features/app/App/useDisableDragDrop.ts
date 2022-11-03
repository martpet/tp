import { useEffect } from 'react';

export const useDisableDragDrop = () => {
  useEffect(() => {
    document.addEventListener('dragover', (event) => {
      event.preventDefault();
    });

    document.addEventListener('drop', (event) => {
      event.preventDefault();
    });
  }, []);
};
