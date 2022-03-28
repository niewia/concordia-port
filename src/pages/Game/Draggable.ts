import EventEmitter from 'events';
import { onValue, ref, update } from 'firebase/database';
import { DisplayObject, InteractionData, InteractionEvent } from 'pixi.js';
import { realtimeDb } from '../../firebase/firebase';

const addDraggingHandler = ({ displayObject, gameEvents }: { displayObject: DisplayObject; gameEvents: EventEmitter }) => {
  let dragging = false;
  let data: InteractionData | null = null;

  // const pawn = ref(realtimeDb, 'games/-MysvH2rnjMjkWXY01rx/player1/pawns/0');
  // onValue(pawn, (snapshot) => {
  //   const { position } = snapshot.val();
  //   displayObject.x = position.x;
  //   displayObject.y = position.y;
  // });

  const handleMouseDown = (e: InteractionEvent) => {
    data = e.data;
    dragging = true;
    gameEvents.emit('isPawnDragged', true);
  };

  const handleMouseUp = (e: InteractionEvent) => {
    dragging = false;
    data = null;
    gameEvents.emit('isPawnDragged', false);
  };

  const handleMouseMove = (e: InteractionEvent) => {
    if (dragging) {
      const newPosition = data!.getLocalPosition(displayObject.parent);
      displayObject.x = newPosition.x;
      displayObject.y = newPosition.y;
      // update(pawn, {
      //   position: {
      //     x: newPosition.x,
      //     y: newPosition.y,
      //   },
      // });
    }
  };

  displayObject.interactive = true;
  displayObject.buttonMode = true;
  displayObject.on('mousedown', handleMouseDown);
  displayObject.on('mousemove', handleMouseMove);
  displayObject.on('mouseup', handleMouseUp);
};

export default addDraggingHandler;
