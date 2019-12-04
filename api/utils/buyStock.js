import moment from 'moment';
import uuid from 'uuid/v1';
import config from '../constants/config';
import state from '../constants/state';
import alpaca from '../constants/alpaca';

const buyStock = ticker => {
  const buyCurrent = state.quotes[ticker].ap;
  const qty =
    config.normalizedMax / buyCurrent < 1 ? 1 : (config.normalizedMax / buyCurrent).toFixed(0);
  const id = uuid();
  state.app.buyOrders.push({
    buyCurrent,
    uuid: id,
  });

  alpaca
    .createOrder({
      qty, // any valid ticker symbol
      side: 'buy',
      symbol: ticker,
      time_in_force: 'day',
      type: 'market',
    })
    .then(order => {
      // eslint-disable-next-line no-console
      console.log(`${moment().format()}: ${order.symbol} buy order for ${qty} at ${buyCurrent}`);
      const orderIndex = state.app.buyOrders.findIndex(i => i.uuid === id);
      state.app.buyOrders[orderIndex] = { ...state.app.buyOrders[orderIndex], ...order };
      state.didTransaction = true;
    });
};

export default buyStock;
