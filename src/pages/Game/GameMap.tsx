import EventEmitter from 'events';
import * as PIXI from 'pixi.js';
import { InteractionEvent } from 'pixi.js';

type Coordinates = { x: number; y: number };

const GameMap = ({ app, gameEvents }: { app: PIXI.Application; gameEvents: EventEmitter }) => {
  let lastPos: Coordinates | null = null;
  let isPawnDragged = false;

  gameEvents.on('isPawnDragged', (value) => (isPawnDragged = value));

  const mapTexture = PIXI.Texture.from('../../assets/concordia_cropped.jpg');
  const map = new PIXI.Sprite(mapTexture);

  const mapContainer = new PIXI.Container();
  mapContainer.addChild(map);
  mapContainer.scale.x = 0.4;
  mapContainer.scale.y = 0.4;

  const onmousedown = (e: InteractionEvent) => {
    if (isPawnDragged) return;
    lastPos = { x: e.data.global.x, y: e.data.global.y };
  };

  const onmouseup = () => {
    lastPos = null;
  };

  const onmouseleave = () => {
    lastPos = null;
  };

  const onmousemove = (e: InteractionEvent) => {
    if (lastPos) {
      const {} = e;
      const newStageX = mapContainer.x + e.data.global.x - lastPos.x;
      const overflowX = map.width * mapContainer.scale.x - app.screen.width;
      console.log(`overflowX ${overflowX}, new pos ${newStageX}`);
      if (newStageX < 0 && Math.abs(newStageX) < overflowX) {
        mapContainer.x = newStageX;
      }
      const newStageY = mapContainer.y + e.data.global.y - lastPos.y;
      const overflowY = map.height * mapContainer.scale.y - app.screen.height;
      if (newStageY < 0 && Math.abs(newStageY) < overflowY) {
        mapContainer.y = newStageY;
      }
      lastPos = { x: e.data.global.x, y: e.data.global.y };
    }
  };

  const onwheel = (e: any) => {
    const scaleChange = e.deltaY > 0 ? -0.05 : 0.05;
    const x = e.offsetX;
    const y = e.offsetY;

    const worldPos = { x: (x - mapContainer.x) / mapContainer.scale.x, y: (y - mapContainer.y) / mapContainer.scale.y };
    const newScale = { x: mapContainer.scale.x + scaleChange, y: mapContainer.scale.y + scaleChange };

    const newScreenPos = { x: worldPos.x * newScale.x + mapContainer.x, y: worldPos.y * newScale.y + mapContainer.y };

    const overflowY = app.screen.height - map.height * newScale.y;
    const overflowX = app.screen.width - map.width * newScale.x;

    if (!(overflowY > 0 || overflowX > 0)) {
      const newX = mapContainer.x - (newScreenPos.x - x);
      mapContainer.x = newX > 0 ? 0 : newX;

      const newY = mapContainer.y - (newScreenPos.y - y);
      mapContainer.y = newY > 0 ? 0 : newY;

      mapContainer.scale.x = newScale.x;
      mapContainer.scale.y = newScale.y;
    } else {
      const newScale = overflowX > overflowY ? app.screen.width / map.width : app.screen.height / map.height;
      mapContainer.scale.x = newScale;
      mapContainer.scale.y = newScale;
      mapContainer.x = 0;
      mapContainer.y = 0;
    }
  };

  mapContainer.interactive = true;
  mapContainer.interactiveChildren = true;

  mapContainer.on('mousedown', onmousedown);
  mapContainer.on('mouseup', onmouseup);
  mapContainer.on('mouseleave', onmouseleave);
  mapContainer.on('mousemove', onmousemove);
  // mapContainer.on('wheel', onwheel);
  document.addEventListener('wheel', onwheel, false);
  app.stage.addChild(mapContainer);

  return mapContainer;
};

export default GameMap;
