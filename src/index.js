import { app } from 'hyperapp';
import { state, actions } from './store';
import view from './App';
import './css';

app(state, actions, view, document.body);
