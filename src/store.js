// https://github.com/binance-exchange/binance-official-api-docs/blob/master/web-socket-streams.md

/* eslint no-shadow: ["error", { "allow": ["state", "actions"] }] */
/* tslint:disable:no-shadowed-variable */

export const state = {
  __data: [],
  __sort: 'n', // sort by trade volume by default
  __filter: '',
};

export const actions = {
  __init: () => (state, actions) => {
    const socket = new WebSocket('wss://stream.binance.com:9443/ws/!ticker@arr');

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);

      actions.__updateData(
        data
          .sort((a, b) => b[state.__sort] - a[state.__sort])
          .slice(0, 10)
      );
    };
  },
  __updateData: value => () => ({ __data: value }),
  __setFilter: value => state => ({ __filter: value.target.value }),
};
