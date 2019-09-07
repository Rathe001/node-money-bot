import moment from 'moment';
import storage from 'node-persist';
import state from './constants/state';
import config from './constants/config';
import client from './constants/client';
import alpaca from './constants/alpaca';
import onAccountUpdate from './eventHandlers/onAccountUpdate';
import onConnect from './eventHandlers/onConnect';
import onDisconnect from './eventHandlers/onDisconnect';
import onOrderUpdate from './eventHandlers/onOrderUpdate';
import onStateChange from './eventHandlers/onStateChange';
import onStockAggMin from './eventHandlers/onStockAggMin';
import onStockAggSec from './eventHandlers/onStockAggSec';
import onStockQuotes from './eventHandlers/onStockQuotes';
import onStockTrades from './eventHandlers/onStockTrades';
import processHistory from './utils/processHistory';
import analyzeData from './utils/analyzeData';

function marketOpen() {
  const format = 'hh:mm:ss';
  const today = moment();
  const marketOpen = moment(config.startTime, format);
  const marketClose = moment(config.stopTime, format);

  if (!today.isBetween(marketOpen, marketClose)) {
    state.app.status = 'CLOSED';
  }
  console.log(today.weekday());
  if (today.weekday() === 6 || today.weekday() === 7) {
    state.app.status = 'WEEKEND';
  }

  return today.isBetween(marketOpen, marketClose) && today.weekday() !== 6 && today.weekday() !== 7;
}

const api = app => {
  function connectWebsocket() {
    client.onConnect(onConnect);
    client.onDisconnect(onDisconnect);
    client.onStateChange(onStateChange);
    client.onOrderUpdate(onOrderUpdate);
    client.onAccountUpdate(onAccountUpdate);
    client.onStockTrades(onStockTrades);
    client.onStockQuotes(onStockQuotes);
    client.onStockAggSec(onStockAggSec);
    client.onStockAggMin(onStockAggMin);

    client.connect();
  }

  function doHistoryLookup() {
    const currentDate = moment();
    const startTime = moment('09:30 am', 'HH:mm a');
    const endTime = moment('04:55 pm', 'HH:mm a');

    const promises = [
      alpaca
        .getBars('day', config.ticker, {
          limit: 1,
        })
        .then(data => processHistory('day', data)),

      alpaca
        .getBars('15Min', config.ticker, {
          limit: 1,
        })
        .then(data => processHistory('15min', data)),

      alpaca
        .getBars('5Min', config.ticker, {
          limit: 1,
        })
        .then(data => processHistory('5min', data)),

      alpaca
        .getBars('1Min', config.ticker, {
          limit: 1,
        })
        .then(data => processHistory('1min', data)),

      alpaca.getAccount().then(account => {
        state.account = account;
      }),

      // TODO: Update local positions with this data
      /*
      alpaca.getPositions().then(positions => {
        state.app.positions = positions;
      }),
      */
    ];

    //if (marketOpen()) {
    state.app.status = 'RUNNING';
    Promise.all(promises)
      .then(() => analyzeData())
      .catch(e => console.log(e));
    //}

    setTimeout(doHistoryLookup, config.tick);
  }

  async function start() {
    await storage.init();
    const persistedApp = await storage.getItem('app');
    if (persistedApp) {
      state.app = persistedApp;
    }
    connectWebsocket();
    doHistoryLookup();
  }

  start();

  /* Endpoints */
  app.get('/update', (err, res) => {
    res.status(200);
    res.json(state);
    res.end();
  });
};

export default api;
