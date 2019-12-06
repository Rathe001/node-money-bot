import state from '../constants/state';
import config from '../constants/config';

export const isLowestPosition = (lowestPosition, buyCurrent) => lowestPosition > buyCurrent;

export const isNoPendingBuyOrders = ticker =>
  state.app.buyOrders.filter(o => o.symbol === ticker).length === 0;

export const isBelowMaxPositions = () => state.app.positions.length < config.maxStocks;

export const isEnoughCash = buyCurrent => {
  const normalizedCount =
    config.normalizedMax / buyCurrent < 1 ? 1 : (config.normalizedMax / buyCurrent).toFixed(0);
  if (state.app.buyOrders.length > 0) {
    return false;
  }
  return state.account.cash > buyCurrent * normalizedCount;
};

export const isDailyPercentageDown = (buyCurrent, buyDay) =>
  ((1 - buyCurrent / buyDay) * 100).toFixed(1) >= 1.0;

export const isLowOfTheDay = (buyCurrent, buy1min, buy5min, buy15min, buyDay) =>
  buyCurrent <= buy1min && buy1min <= buy5min && buy5min <= buy15min && buy15min <= buyDay;

export const isLargeRecentDrop = (buyCurrent, buy1min, buy5min) =>
  (1 - buyCurrent / buy1min) * 100 > 10 || (1 - buyCurrent / buy5min) * 100 > 10;

export default {
  isBelowMaxPositions,
  isDailyPercentageDown,
  isEnoughCash,
  isLargeRecentDrop,
  isLowOfTheDay,
  isLowestPosition,
  isNoPendingBuyOrders,
};
