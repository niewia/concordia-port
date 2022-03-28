import { useContext } from 'react';
import { rootStoreContext } from '../store';

const useStore = () => useContext(rootStoreContext);

export default useStore;
