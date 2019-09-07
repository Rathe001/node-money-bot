import uuid from 'uuid/v4';
import moment from 'moment';
import config from '../constants/config';
import state from '../constants/state';
import alpaca from '../constants/alpaca';

const buyStock = ticker => {
  const buyCurrent = state.quotes[ticker].ap;
  state.app.buys += 1;
  state.app.buyTotal += buyCurrent;

  alpaca
    .createOrder({
      symbol: ticker, // any valid ticker symbol
      qty: 1,
      side: 'buy',
      type: 'market',
      time_in_force: 'fok',
    })
    .then(order => {
      console.log(`${moment.format()}: Buying ${ticker} for ${buyCurrent}`);
      state.app.positions.push(order);
    });
};

export default buyStock;
