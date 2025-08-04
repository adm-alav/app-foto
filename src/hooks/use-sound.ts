'use client';

import { useCallback, useEffect, useRef } from 'react';

export function useSound() {
  const notificationSound = useRef<HTMLAudioElement | null>(null);
  const successSound = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    notificationSound.current = new Audio('/sounds/notification.mp3');
    successSound.current = new Audio('/sounds/success.mp3');

    // Pré-carregar os sons
    notificationSound.current.load();
    successSound.current.load();

    return () => {
      if (notificationSound.current) {
        notificationSound.current = null;
      }
      if (successSound.current) {
        successSound.current = null;
      }
    };
  }, []);

  const playNotification = useCallback(() => {
    if (notificationSound.current) {
      notificationSound.current.currentTime = 0;
      notificationSound.current.play().catch(() => {
        // Ignora erros de reprodução (comum em mobile)
      });
    }
  }, []);

  const playSuccess = useCallback(() => {
    if (successSound.current) {
      successSound.current.currentTime = 0;
      successSound.current.play().catch(() => {
        // Ignora erros de reprodução (comum em mobile)
      });
    }
  }, []);

  return {
    playNotification,
    playSuccess,
  };
}
