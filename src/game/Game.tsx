import styled from '@emotion/styled';
import * as PIXI from 'pixi.js';
import React, { FC, useEffect, useRef } from 'react';
import GameEngine from './GameEngine';

const Container = styled('div')({
  width: '100%',
  height: '100%',
  display: 'flex',
  justifyContent: 'center',
  '& canvas': {
    objectFit: 'cover',
  },
});

const Game: FC = () => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // On first render create our application
    if (!ref.current) return;
    const { width, height } = ref.current.getBoundingClientRect();

    const app = new PIXI.Application({
      width,
      height,
      // resolution: devicePixelRatio,
      backgroundColor: 0x5bba6f,
    });
    GameEngine({
      app,
    });

    // Add app to DOM
    ref.current.appendChild(app.view);
    // Start the PixiJS app
    app.start();

    return () => {
      // On unload completely destroy the application and all of it's children
      app.destroy(true, true);
    };
  }, []);

  return <Container ref={ref} />;
};

export default Game;
