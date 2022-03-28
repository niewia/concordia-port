import React, { FC, useEffect, useState } from 'react';
import { Avatar, Button, Container, List, ListItemAvatar, ListItemButton, ListItemText, Stack, TextField } from '@mui/material';
import useStore from '../../hooks/useStore';
import gameService from '../../services/game.service';
import { GameData } from '../../domains/game';
import { Link, useNavigate } from 'react-router-dom';
import { Routes } from '../Router';

const Dashboard: FC = () => {
  const [games, setGames] = useState<GameData[]>([]);
  const { userStore } = useStore();
  const { user } = userStore;
  const [gameName, setGameName] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    gameService.observeGames(setGames);
  }, []);

  const createNewGame = () => {
    if (!user) {
      return navigate(Routes.login);
    }

    gameService
      .createNewGame({
        name: gameName,
        user,
      })
      .then((newGameRef) => {
        if (newGameRef.key) {
          navigate(Routes.lobby(newGameRef.key));
        }
      });
  };

  return (
    <Container>
      <Stack p={5} spacing={10} alignItems="flex-start">
        <List>
          {games.map((game) => {
            return (
              <ListItemButton sx={{ padding: 1, boxShadow: 2, borderRadius: 1 }} key={game.id} component={Link} to={Routes.lobby(game.id)}>
                <ListItemAvatar>
                  <Avatar alt={game.host.name ?? ''} src={game.host.avatarUrl ?? ''} />
                </ListItemAvatar>
                <ListItemText secondary={`Players: ${Object.keys(game.connectedPlayers ?? {}).length ?? 0}`}>{game.name}</ListItemText>
              </ListItemButton>
            );
          })}
        </List>
        <Stack spacing={1} alignItems="center">
          <TextField label="Game ID" placeholder="Enter game id" sx={{ width: 300 }} />
          <Button variant="contained">Join game</Button>
        </Stack>
        <Stack spacing={1} alignItems="center">
          <TextField label="Game Name" placeholder="Enter game name" sx={{ width: 300 }} value={gameName} onChange={(e) => setGameName(e.target.value)} />
          <Button variant="contained" onClick={createNewGame} disabled={gameName.length < 3}>
            Create new game
          </Button>
        </Stack>
      </Stack>
    </Container>
  );
};

export default Dashboard;
