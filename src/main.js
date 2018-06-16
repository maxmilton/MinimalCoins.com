import App from './App.html';
import store from './store.js';

new App({ // eslint-disable-line no-new
  target: document.body,
  store,
});

window.store = store; // useful for debugging!

// if (process.env.NODE_ENV !== 'production') {
//   // useful for debugging!
//   window.store = store;
// }
