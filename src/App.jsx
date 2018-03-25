/* eslint-disable max-len */
/* tslint:disable:max-line-length */

/*
Binance API reference:
https://github.com/binance-exchange/binance-official-api-docs/blob/master/web-socket-streams.md#individual-symbol-ticker-streams
{
  "e": "24hrTicker",  // Event type
  "E": 123456789,     // Event time
  "s": "BNBBTC",      // Symbol
  "p": "0.0015",      // Price change
  "P": "250.00",      // Price change percent
  "w": "0.0018",      // Weighted average price
  "x": "0.0009",      // Previous day's close price
  "c": "0.0025",      // Current day's close price
  "Q": "10",          // Close trade's quantity
  "b": "0.0024",      // Best bid price
  "B": "10",          // Bid bid quantity
  "a": "0.0026",      // Best ask price
  "A": "100",         // Best ask quantity
  "o": "0.0010",      // Open price
  "h": "0.0025",      // High price
  "l": "0.0010",      // Low price
  "v": "10000",       // Total traded base asset volume
  "q": "18",          // Total traded quote asset volume
  "O": 0,             // Statistics open time
  "C": 86400000,      // Statistics close time
  "F": 0,             // First trade ID
  "L": 18150,         // Last trade Id
  "n": 18151          // Total number of trades
}
*/

import { h } from 'hyperapp'; // eslint-disable-line no-unused-vars

// eslint-disable-next-line no-unused-vars
const InputCount = () => (state, actions) => (
  <div class="input-group">
    <input
      type="number"
      min="1"
      max={state.__totalSymbols}
      value={state.__count}
      oninput={actions.__setCount}
    />
    <button
      class="btn btn-mini br0-i rad0"
      onclick={actions.__setCountDown}
    >
      ➖
    </button>
    <button
      class="btn btn-mini"
      onclick={actions.__setCountUp}
    >
      ➕
    </button>
  </div>
);

// eslint-disable-next-line no-unused-vars
const TickerItem = ({ s, w }) => (
  <tr>
    <td>{s}</td>
    <td w={w} onupdate={(el, oldAttrs) => {
      if (w > oldAttrs.w) {
        el.className = 'green';
      } else if (w < oldAttrs.w) {
        el.className = 'red';
      } else {
        el.className = '';
      }
    }}>${w}</td>
  </tr>
);

export default (state, actions) => (
  <div class="con df f-col pos-a a0">
    <p class="mv4 tc alpha">
      Top cryptocurrencies<sup><abbr title="see info below">*1</abbr></sup> by trade volume<sup><abbr title="see info below">*2</abbr></sup>
    </p>

    <div class="df middle mb-auto">
      <div class="pa3">
        Show <InputCount />
      </div>

      <div class="pa3">
        <input
          autofocus
          type="text"
          placeholder="Filter by symbol..."
          value={state.__filter}
          oninput={actions.__setFilter}
          onkeyup={actions.__clearFilter}
        />
      </div>
    </div>

    <table class="mb4 mh-auto">
      <thead>
        <tr class="alpha">
          <th class="col-symbol">Symbol</th>
          <th class="col-price">
            Price<sup><abbr title="see info below">*3</abbr></sup>
          </th>
        </tr>
      </thead>
      <tbody class="mono">
        {state.__data.map(data => <TickerItem {...data} />)}
      </tbody>
    </table>

    {state.__showInfo && (
      <div id="info">
        <p>
          <sup>*1</sup> Data from <a
            href="https://github.com/binance-exchange/binance-official-api-docs"
            target="_blank"
            rel="noopener"
          >
            Binance
          </a> with 1 second updates.
        </p>
        <p>
          <sup>*2</sup> Trade volume is the number of trades in the last 24
          hours.
        </p>
        <p>
          <sup>*3</sup> Based on weighted average in <abbr title="United States dollar">USD</abbr>.
        </p>
      </div>
    )}

    <footer class="df middle pa5 mt-auto alpha">
      <button
        class="dif middle btn btn-clear btn-info"
        title={state.__showInfo ? 'hide info' : 'show more info'}
        onclick={actions.__toggleShowInfo}
      >
        {state.__showInfo ? '✖' : 'ℹ'} | info
      </button>

      <div class="ml-auto">
        © <a href="https://maxmilton.com" class="inherit">
          Max Milton
        </a> | <a
          href="https://github.com/MaxMilton/MinimalCoins.com"
          class="inherit"
          rel="noopener"
        >
          Source on GitHub
        </a>
      </div>
    </footer>
  </div>
);
