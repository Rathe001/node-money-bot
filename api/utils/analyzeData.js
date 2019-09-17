import moment from 'moment';
import storage from 'node-persist';
import config from '../constants/config';
import state from '../constants/state';
import buyStock from '../utils/buyStock';
import sellStock from '../utils/sellStock';
import {
  isLowestPosition,
  isNoPendingBuyOrders,
  isBelowMaxPositions,
  isEnoughCash,
  isDailyPercentageDown,
  isLowOfTheDay,
  isLargeRecentDrop,
} from '../utils/buyConditions';

const checkShouldBuy = () => {
  Object.keys(state.quotes).forEach(ticker => {
    if (state.history['1min'][ticker] && state.quotes[ticker]) {
      const buyCurrent = state.quotes[ticker].ap;
      const buy1min = state.history['1min'][ticker][0].o;
      const buy5min = state.history['5min'][ticker][0].o;
      const buy15min = state.history['15min'][ticker][0].o;
      const buyDay = state.history['day'][ticker][0].o;
      const tickerPositions = state.app.positions.filter(p => p.symbol === ticker);
      const lowestPosition = tickerPositions.length
        ? tickerPositions.reduce(
            (min, p) =>
              parseFloat(p.filled_avg_price) < min ? parseFloat(p.filled_avg_price) : min,
            9999,
          )
        : 9999;

      if (
        isLowestPosition(lowestPosition, buyCurrent) &&
        isNoPendingBuyOrders(ticker) &&
        isBelowMaxPositions() &&
        isEnoughCash(buyCurrent) &&
        isDailyPercentageDown(buyCurrent, buyDay) &&
        (isLowOfTheDay(buyCurrent, buy1min, buy5min, buy15min, buyDay) ||
          isLargeRecentDrop(buyCurrent, buy1min, buy5min))
      ) {
        buyStock(ticker);
      }
    }
  });
};

const checkShouldSell = stock => {
  let daysOld = moment().diff(moment(stock.filled_at), 'days');
  const sellCurrent = (state.quotes[stock.symbol] && state.quotes[stock.symbol].bp) || 0;

  // Stock should be 24h old to avoid being flagged as a day trader
  if (
    sellCurrent &&
    stock.filled_avg_price &&
    daysOld >= 1 &&
    sellCurrent >= parseFloat(stock.filled_avg_price) * (1 + config.profitMargin / daysOld)
  ) {
    sellStock(stock);
  }
};

const analyzeData = async () => {
  // Buy?
  checkShouldBuy();

  // Sell?
  state.app.positions.forEach(stock => {
    checkShouldSell(stock);
  });

  state.app.updated = moment().format('MMMM Do YYYY, h:mm:ss a');
  state.app.ticks += 1;
  await storage.setItem('app', state.app);
};

export default analyzeData;
