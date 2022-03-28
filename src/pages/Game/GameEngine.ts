import EventEmitter from 'events';
import { User } from 'firebase/auth';
import * as PIXI from 'pixi.js';
import { GameData, GameState, PawnType } from '../../domains/game';
import gameService from '../../services/game.service';
import GameMap from './GameMap';
import { Pawn } from './pieces/Pawn';

const colors = [0xfff933, 0xff3333, 0x77ff33, 0x3399ff, 0x303030];
const pawnOffset = [
  { x: 0, y: 0 },
  { x: -50, y: -50 },
  { x: 50, y: -50 },
  { x: -50, y: 50 },
  { x: 50, y: 50 },
];

const GameEngine = ({ app, gameId, user }: { app: PIXI.Application; gameId: string; user: User }) => {
  let myPlayerNumber = -1;
  const gameEvents = new EventEmitter();

  const gameMap = GameMap({ app, gameEvents });

  gameService.observeGame({
    gameId,
    onlyOnce: true,
    callback: (game) => {
      if (game.state !== GameState.IN_PROGRESS) {
        initGame(game);
      }

      game.connectedPlayers?.forEach((player, index) => {
        if (player.id === user.uid) {
          myPlayerNumber = index;

          const playerLabel = new PIXI.Text(`Player ${myPlayerNumber}`, {
            fill: 0xffffff,
          });
          playerLabel.anchor.set(0.5);
          playerLabel.x = app.view.width / 2;
          playerLabel.y = 20;

          const menuLayout = new PIXI.Container();
          menuLayout.addChild(playerLabel);

          app.stage.addChild(menuLayout);
        }
        const playerPawn = new Pawn({ color: colors[index], gameId, pawnIndex: index, playerId: player.id, gameEvents });
        playerPawn.x = 1920 + pawnOffset[index].x;
        playerPawn.y = 1040 + pawnOffset[index].y;
        gameMap.addChild(playerPawn);
      });
    },
  });

  const initGame = (game: GameData) => {
    game.connectedPlayers?.forEach((player, index) => {
      gameService.addPawnToPlayer({
        gameId,
        playerId: user.uid,
        pawn: {
          x: 1920 + pawnOffset[index].x,
          y: 1040 + pawnOffset[index].y,
          type: PawnType.LAND,
        },
      });
    });
  };

  const renderPawns = () => {};
};

export default GameEngine;
