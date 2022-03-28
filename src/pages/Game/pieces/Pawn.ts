import * as PIXI from 'pixi.js';
import EventEmitter from 'events';
import { InteractionData, InteractionEvent } from 'pixi.js';
import gameService from '../../../services/game.service';
import { DatabaseReference, update } from 'firebase/database';

export class Pawn extends PIXI.Graphics {
  private gameEvents: EventEmitter;
  private dragging = false;
  private data: InteractionData | null = null;
  private pawnRef: DatabaseReference;

  constructor({
    color,
    gameId,
    pawnIndex,
    playerId,
    gameEvents,
  }: {
    color?: number | undefined;
    gameId: string;
    playerId: string;
    pawnIndex: number;
    gameEvents: EventEmitter;
  }) {
    super();
    this.gameEvents = gameEvents;
    this.interactive = true;
    this.buttonMode = true;
    this.beginFill(color).lineStyle(4, 0xffea00, 1).drawCircle(0, 0, 25).endFill();
    this.on('mousedown', this.handleMouseDown);
    this.on('mousemove', this.handleMouseMove);
    this.on('mouseup', this.handleMouseUp);

    this.pawnRef = gameService.observePawn({
      gameId,
      playerId,
      pawnIndex,
      callback: (data) => {
        this.x = data.x;
        this.y = data.y;
      },
    });
  }

  handleMouseDown = (e: InteractionEvent) => {
    this.data = e.data;
    this.dragging = true;
    this.gameEvents.emit('isPawnDragged', true);
  };

  handleMouseUp = (e: InteractionEvent) => {
    this.dragging = false;
    this.data = null;
    this.gameEvents.emit('isPawnDragged', false);
  };

  handleMouseMove = (e: InteractionEvent) => {
    if (this.dragging) {
      const newPosition = this.data!.getLocalPosition(this.parent);
      // this.x = newPosition.x;
      // this.y = newPosition.y;
      update(this.pawnRef, {
        x: newPosition.x,
        y: newPosition.y,
      });
    }
  };
}
