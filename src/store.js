// https://github.com/binance-exchange/binance-official-api-docs/blob/master/web-socket-streams.md

/* eslint no-shadow: ["error", { "allow": ["state", "actions"] }] */
/* tslint:disable:no-shadowed-variable */

export const state = {
  __data: [],
  __sort: 'n', // sort by trade volume by default
  __count: 5,
  __filter: '',
  __totalSymbols: 150,
  __showInfo: false,
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
    __data: value
      .sort((a, b) => b[state.__sort] - a[state.__sort])
      .slice(0, state.__count),
  }),
  __setFilter: value => ({ __filter: value.target.value }),
  __setCount: value => ({ __count: value.target.value }),
  __toggleShowInfo: () => state => ({ __showInfo: !state.__showInfo }),
};
