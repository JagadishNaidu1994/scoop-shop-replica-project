
import { useState, useEffect } from 'react';

const POPUP_DELAY = 30000; // 30 seconds
const POPUP_SHOWN_KEY = 'email-popup-shown';
const POPUP_CLOSED_KEY = 'email-popup-closed';

export const useEmailPopup = () => {
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    // Check if popup was already shown or closed in this session
    const popupShown = sessionStorage.getItem(POPUP_SHOWN_KEY);
    const popupClosed = localStorage.getItem(POPUP_CLOSED_KEY);
    
    // Don't show if already shown this session or permanently closed
    if (popupShown || popupClosed) {
      return;
    }

    // Set timer to show popup after 30 seconds
    const timer = setTimeout(() => {
      setShowPopup(true);
      sessionStorage.setItem(POPUP_SHOWN_KEY, 'true');
    }, POPUP_DELAY);

    return () => clearTimeout(timer);
  }, []);

  const closePopup = (permanent = false) => {
    setShowPopup(false);
    if (permanent) {
      localStorage.setItem(POPUP_CLOSED_KEY, 'true');
    }
  };

  return { showPopup, closePopup };
};
