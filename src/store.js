/* eslint no-shadow: ["error", { "allow": ["state"] }] */

export const state = {
  __count: 0,
};

export const actions = {
  __down: value => state => ({ __count: state.__count - value }),
  __up: value => state => ({ __count: state.__count + value }),
};
