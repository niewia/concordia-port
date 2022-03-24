import { onValue, ref } from 'firebase/database';
import * as PIXI from 'pixi.js';
import { realtimeDb } from '../firebase/firebase';
import addDraggingHandler from './Draggable';

type Coordinates = { x: number; y: number };

const GameEngine = ({ app }: { app: PIXI.Application }) => {
  let lastPos: Coordinates | null = null;
  let isPawnDragged = false;

  const mapTexture = PIXI.Texture.from('assets/concordia_cropped.jpg');

  const map = new PIXI.Sprite(mapTexture);

  app.stage.addChild(map);

  const circle = new PIXI.Graphics().beginFill(0x22aacc).lineStyle(4, 0xffea00, 1).drawCircle(0, 0, 25).endFill();
  circle.x = 645;
  circle.y = 350;
  app.stage.addChild(circle);
  addDraggingHandler({
    displayObject: circle,
    onDragEnd: () => {
      isPawnDragged = false;
    },
    onDragStart: () => {
      isPawnDragged = true;
    },
  });

  app.view.onmousedown = (e) => {
    if (isPawnDragged) return;
    lastPos = { x: e.offsetX, y: e.offsetY };
  };

  app.view.onmouseup = (e) => {
    lastPos = null;
  };

  app.view.onmouseleave = (e) => {
    lastPos = null;
  };

  app.view.onmousemove = (e) => {
    if (lastPos) {
      const newStageX = app.stage.x + e.offsetX - lastPos.x;
      const overflowX = map.width * app.stage.scale.x - app.screen.width;
      console.log(`overflowX ${overflowX}, new pos ${newStageX}`);
      if (newStageX < 0 && Math.abs(newStageX) < overflowX) {
        app.stage.x = newStageX;
      }
      const newStageY = app.stage.y + e.offsetY - lastPos.y;
      const overflowY = map.height * app.stage.scale.y - app.screen.height;
      if (newStageY < 0 && Math.abs(newStageY) < overflowY) {
        app.stage.y = newStageY;
      }
      lastPos = { x: e.offsetX, y: e.offsetY };
    }
  };

  app.view.onwheel = (e) => {
    const scaleChange = e.deltaY > 0 ? -0.05 : 0.05;
    const x = e.offsetX;
    const y = e.offsetY;
    const { stage } = app;

    const worldPos = { x: (x - stage.x) / stage.scale.x, y: (y - stage.y) / stage.scale.y };
    const newScale = { x: stage.scale.x + scaleChange, y: stage.scale.y + scaleChange };

    const newScreenPos = { x: worldPos.x * newScale.x + stage.x, y: worldPos.y * newScale.y + stage.y };

    const overflowY = app.screen.height - map.height * newScale.y;
    const overflowX = app.screen.width - map.width * newScale.x;

    if (!(overflowY > 0 || overflowX > 0)) {
      const newX = stage.x - (newScreenPos.x - x);
      stage.x = newX > 0 ? 0 : newX;

      const newY = stage.y - (newScreenPos.y - y);
      stage.y = newY > 0 ? 0 : newY;

      stage.scale.x = newScale.x;
      stage.scale.y = newScale.y;
    } else {
      const newScale = overflowX > overflowY ? app.screen.width / map.width : app.screen.height / map.height;
      stage.scale.x = newScale;
      stage.scale.y = newScale;
      stage.x = 0;
      stage.y = 0;
    }
  };
};

export default GameEngine;
