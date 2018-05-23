import { app } from 'hyperapp';
import { state, actions } from './store.js';
import view from './App.jsx';
import './css'; // tslint:disable-line:no-import-side-effect

const main = app(state, actions, view, document.body);

main.__init();
