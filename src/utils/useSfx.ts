import React from 'react';

export const useSfx = () => {
  const successPlayer = React.useRef<HTMLAudioElement>(null);
  const errorPlayer = React.useRef<HTMLAudioElement>(null);

  const initAudioPlayer = () => {
    Reflect.set(successPlayer, 'current', new Audio('/sfx/success.wav'));
    Reflect.set(errorPlayer, 'current', new Audio('/sfx/error.mp3'));
  };

  React.useEffect(initAudioPlayer, []);

  const playSuccessSfx = () => {
    successPlayer.current?.play();
  };

  const playErrprSfx = () => {
    errorPlayer.current?.play();
  };

  return {
    playSuccessSfx,
    playErrprSfx,
  };
};
