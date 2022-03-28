import * as database from 'firebase/database';
import { DatabaseReference } from 'firebase/database';
import { realtimeDb } from '../firebase/firebase';

const ref = (path: string) => database.ref(realtimeDb, path);
const push = (path: string, value?: unknown) => {
  const dbRef = ref(path);
  return database.push(dbRef, value);
};
const set = (path: string, value: unknown) => {
  const dbRef = ref(path);
  database.set(dbRef, value);
  return dbRef;
};
const update = (path: string, values: object) => {
  const dbRef = ref(path);
  database.update(dbRef, values);
};
const removeByRef = (ref: DatabaseReference) => database.remove(ref);

const realtimeService = {
  ref,
  set,
  push,
  update,
  removeByRef,
};

export default realtimeService;
