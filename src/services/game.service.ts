import { User } from 'firebase/auth';
import { DatabaseReference, onValue } from 'firebase/database';
import { GameData, GameState, PawnData, Player } from '../domains/game';
import realtimeService from './realtime.service';

export const objToArray = (obj: Record<string, any>) =>
  Object.keys(obj).map((key) => {
    return { id: key, ...obj[key] };
  });

const gameService = {
  observeGames: (callback: (value: GameData[]) => void) => {
    const ref = realtimeService.ref('games');
    onValue(ref, (snapshot) => {
      callback(objToArray(snapshot.val()) as GameData[]);
    });
  },
  createNewGame: async ({ user, name }: { user: User; name: string }) => {
    const newGame: GameData = {
      state: GameState.PUBLISHED,
      name,
      connectedPlayers: [],
      host: {
        id: user.uid,
        name: user.displayName,
        avatarUrl: user.photoURL,
      },
    };
    const res = await realtimeService.push('games', newGame);
    return res;
  },
  observeGame: ({ gameId, callback, onlyOnce = false }: { gameId: string; callback: (value: GameData) => void; onlyOnce?: boolean }) => {
    const ref = realtimeService.ref(`games/${gameId}`);
    onValue(
      ref,
      (snapshot) => {
        const game = snapshot.val();
        callback({
          ...game,
          connectedPlayers: objToArray(game.connectedPlayers),
        } as GameData);
      },
      {
        onlyOnce,
      }
    );
  },
  addPlayerToGame: ({ gameId, player }: { gameId: string; player: Player }) => {
    const playerRef = realtimeService.ref(`games/${gameId}/connectedPlayers/${player.id}`);
    return new Promise<DatabaseReference>((resolve) => {
      onValue(playerRef, (snapshot) => {
        resolve(snapshot.exists() ? playerRef : realtimeService.set(`games/${gameId}/connectedPlayers/${player.id}`, player));
      });
    });
  },
  removePlayerFromGame: (playerRef: DatabaseReference) => {
    realtimeService.removeByRef(playerRef);
  },
  removeGame: (gameRef: DatabaseReference) => {
    realtimeService.removeByRef(gameRef);
  },
  addPawnToPlayer: ({ gameId, playerId, pawn }: { gameId: string; playerId: string; pawn: PawnData }) => {
    return realtimeService.push(`games/${gameId}/connectedPlayers/${playerId}/pawns`, pawn);
  },
  observePawn: ({ gameId, playerId, pawnIndex, callback }: { gameId: string; playerId: string; pawnIndex: number; callback: (value: PawnData) => void }) => {
    const pawnRef = realtimeService.ref(`games/${gameId}/connectedPlayers/${playerId}/pawns/${pawnIndex}`);

    onValue(pawnRef, (snapshot) => {
      callback(snapshot.val() as PawnData);
    });
    return pawnRef;
  },
};

export default gameService;
