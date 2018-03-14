/* tslint:disable:max-line-length */

import { h } from 'hyperapp'; // eslint-disable-line no-unused-vars

const TickerItem = ({ s, w, p, n }) => (
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
      © <a href="https://minimalcoins.com" class="inherit">MinimalCoins.com</a> | <a href="https://github.com/MaxMilton/MinimalCoins.com" class="inherit" rel="noopener">Source on GitHub</a>
    </footer>

    {/* <code>
      <pre>{JSON.stringify(state.__data, null, 2)}</pre>
    </code> */}
  </div>
);
