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

const TickerItem = ({ s, w, p, n }) => ( // eslint-disable-line no-unused-vars
  <tr>
    <td>{s}</td>
    <td class={p > 0 ? 'green' : 'red'}>${w}</td>
    <td>{n}</td>
  </tr>
);

export default (state, actions) => (
  <div class="con">
    <p>Showing the top 10 cryptocurrencies based on trade volume. Or filter for your prefered currency.</p>

    <input
      type="text"
      placeholder="Filter by symbol..."
      value={state.__filter}
      oninput={actions.__setFilter}
    />
    <p>{state.__filter}</p>

    <table>
      <thead>
        <tr>
          <th>Symbol</th>
          <th>Price<sup>*1</sup></th>
          <th>Volume<sup>*2</sup></th>
        </tr>
      </thead>
      <tbody>
        {state.__data.map(data => (
          <TickerItem {...data}/>
        ))}
      </tbody>
    </table>

    <p>Data provided by <a href="https://github.com/binance-exchange/binance-official-api-docs" target="_blank" rel="noopener">Binance</a> with 1 second updates.</p>
    <p><sup>*1</sup> Based on weighted average in <abbr title="United States dollar">USD</abbr>.</p>
    <p><sup>*2</sup> Number of trades in the last 24 hours.</p>

    <footer class="footer con tc">
      © <a href="https://maxmilton.com" class="inherit">Max Milton</a> | <a href="https://github.com/MaxMilton/MinimalCoins.com" class="inherit" rel="noopener">Source on GitHub</a>
    </footer>

    {/* <code>
      <pre>{JSON.stringify(state.__data, null, 2)}</pre>
    </code> */}
  </div>
);
