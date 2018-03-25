/* eslint no-shadow: ["error", { "allow": ["state", "actions"] }] */
/* tslint:disable:no-shadowed-variable */

// TODO: Should network and data manipulation logic be moved into a dedicated web worker?
//  ↳ That way it could only send the exact data which is necessary to the main thread.

export const state = {
  __count: 5,
  __data: [],
  __filter: '',
  __showInfo: false,
  __sort: 'n', // sort by trade volume by default
  __totalSymbols: 150,
};

export const actions = {
  __init: () => (state, actions) => {
    const socket = new WebSocket('wss://stream.binance.com:9443/ws/!ticker@arr');

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      state.__totalSymbols = data.length;
      actions.__updateData(data);
    };
  },
  __updateData: value => state => ({
    // merge new data as it arrives
    __data: Object.assign([], state.__data, value
      .filter(item => item.s.indexOf(state.__filter.toUpperCase()) > -1)
      .sort((a, b) => b[state.__sort] - a[state.__sort])
      .slice(0, state.__count)),
  }),
  __setFilter: value => ({ __filter: value.target.value }),
  __clearFilter: value => value.keyCode === 27 /* ESC */ && ({ __filter: '' }),
  __setCount: value => ({ __count: value.target.value }),
  __setCountUp: () => state => ({ __count: (state.__count += 1) }),
  __setCountDown: () => state => ({ __count: (state.__count -= 1) }),
  __toggleShowInfo: () => state => ({ __showInfo: !state.__showInfo }),
  // FIXME: Need to follow the anchor link AFTER the element is shown
  __setShowInfo: () => ({ __showInfo: true }),
};
