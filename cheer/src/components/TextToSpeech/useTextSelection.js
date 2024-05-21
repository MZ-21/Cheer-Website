import { useState, useEffect } from 'react';

const useTextSelection = () => {
  const [selectedText, setSelectedText] = useState('');

  useEffect(() => {
    const handleTextSelect = () => {
      const text = window.getSelection().toString().trim();
      setSelectedText(text);
    };

    document.addEventListener('mouseup', handleTextSelect);
    document.addEventListener('touchend', handleTextSelect);

    return () => {
      document.removeEventListener('mouseup', handleTextSelect);
      document.removeEventListener('touchend', handleTextSelect);
    };
  }, []);

  return selectedText;
};

export default useTextSelection;
