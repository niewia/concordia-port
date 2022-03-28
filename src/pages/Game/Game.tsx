import styled from '@emotion/styled';
import * as PIXI from 'pixi.js';
import React, { FC, useEffect, useRef } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useNavigate, useParams } from 'react-router-dom';
import { auth } from '../../firebase/firebase';
import useStore from '../../hooks/useStore';
import { Routes } from '../Router';
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
  const { gameId } = useParams<{ gameId?: string }>();
  const { userStore } = useStore();
  const [user, loading] = useAuthState(auth);
  const navigate = useNavigate();

  useEffect(() => {
    // On first render create our application
    if (!ref.current || loading) return;

    if (!user) {
      return navigate(Routes.login);
    }

    if (!gameId) {
      return navigate(Routes.dashboard);
    }

    const { width, height } = ref.current.getBoundingClientRect();

    const app = new PIXI.Application({
      width,
      height,
      // resolution: devicePixelRatio,
      backgroundColor: 0x5bba6f,
    });

    GameEngine({
      gameId,
      app,
      user,
    });

    // Add app to DOM
    ref.current.appendChild(app.view);
    // Start the PixiJS app
    app.start();

    return () => {
      // On unload completely destroy the application and all of it's children
      app.destroy(true, true);
    };
  }, [gameId, navigate, user, loading]);

  return <Container ref={ref} />;
};

export default Game;
