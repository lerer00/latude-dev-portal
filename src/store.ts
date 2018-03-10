import main from './reducers/main';
import { createStore } from 'redux';

const store = createStore(main);
export default store; 