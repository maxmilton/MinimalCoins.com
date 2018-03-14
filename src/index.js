import { app } from 'hyperapp';
import { state, actions } from './store';
import view from './App';
import './css'; // tslint:disable-line:no-import-side-effect

const main = app(state, actions, view, document.body);

main.__init();
