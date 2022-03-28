import {
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  Stack,
  Typography,
  CircularProgress,
  ListItemText,
  Container,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
} from '@mui/material';
import { Box } from '@mui/system';
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { GameData } from '../../domains/game';
import useStore from '../../hooks/useStore';
import gameService from '../../services/game.service';
import { Routes } from '../Router';
import { DatabaseReference, update } from 'firebase/database';

const colors = [16775475, 16724787, 7864115, 3381759, 3158064];

const GameLobby = () => {
  const { gameId } = useParams<{ gameId: string }>();
  const { userStore } = useStore();
  const { user } = userStore;
  const navigate = useNavigate();
  const [gameData, setGameData] = useState<GameData>();
  const [playerRef, setPlayerRef] = useState<DatabaseReference>();

  useEffect(() => {
    if (gameId) {
      gameService.observeGame({ gameId, callback: setGameData });
    }
  }, [gameId]);

  useEffect(() => {
    if (!user) {
      return navigate(Routes.login);
    }

    if (!gameId) {
      return navigate(Routes.dashboard);
    }

    gameService
      .addPlayerToGame({
        gameId,
        player: {
          avatarUrl: user.photoURL,
          id: user.uid,
          name: user.displayName,
        },
      })
      .then((newPlayerRef) => setPlayerRef(newPlayerRef));
  }, [gameId, user, navigate]);

  const handleColorChange = (event: SelectChangeEvent<number>) => {
    if (playerRef) {
      update(playerRef, {
        color: event.target.value as number,
      });
    }
  };

  return (
    <Container>
      <Stack spacing={3} alignItems="flex-start">
        <Typography variant="h1">{gameData?.name}</Typography>
        <Box>
          <Typography variant="h3">Players:</Typography>
          {gameData?.connectedPlayers?.map((player) => (
            <List>
              <ListItem sx={{ padding: 1, boxShadow: 2 }}>
                <ListItemText>{player.name}</ListItemText>
                <ListItemAvatar>
                  <Avatar alt={player.name ?? ''} src={player.avatarUrl ?? ''} />
                </ListItemAvatar>
                {user?.uid === player.id && (
                  <Box sx={{ minWidth: 120, background: player.color ? '#' + player.color.toString(16) : undefined }}>
                    <FormControl fullWidth>
                      <InputLabel id="color-picker">Color</InputLabel>
                      <Select labelId="color-picker" id="color-picker" value={player.color} label="Color" onChange={handleColorChange}>
                        <MenuItem value={colors[0]} sx={{ background: '#' + colors[0].toString(16) }}>
                          <Box sx={{ height: 30 }} />
                        </MenuItem>
                        <MenuItem value={colors[1]} sx={{ background: '#' + colors[1].toString(16) }}>
                          <Box sx={{ height: 30 }} />
                        </MenuItem>
                        <MenuItem value={colors[2]} sx={{ background: '#' + colors[2].toString(16) }}>
                          <Box sx={{ height: 30 }} />
                        </MenuItem>
                        <MenuItem value={colors[3]} sx={{ background: '#' + colors[3].toString(16) }}>
                          <Box sx={{ height: 30 }} />
                        </MenuItem>
                        <MenuItem value={colors[4]} sx={{ background: '#' + colors[4].toString(16) }}>
                          <Box sx={{ height: 30 }} />
                        </MenuItem>
                      </Select>
                    </FormControl>
                  </Box>
                )}
              </ListItem>
            </List>
          ))}
          {!gameData?.connectedPlayers?.length && (
            <Stack direction="row" spacing={1} alignItems="center">
              <CircularProgress />
              <Typography>Waiting for players</Typography>
            </Stack>
          )}
        </Box>
        {gameData?.connectedPlayers && gameData.connectedPlayers.length > 1 && (
          <Button variant="contained" component={Link} to={Routes.game(gameId)}>
            Start game
          </Button>
        )}
      </Stack>
    </Container>
  );
};

export default GameLobby;
