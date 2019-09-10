const config = {
  baseApi: 'https://paper-api.alpaca.markets',
  throttleDelay: 1000,
  ticker: [
    'AAPL',
    'GOOGL',
    'WTI',
    'TWTR',
    'TSLA',
    'BFLX',
    'FB',
    'MSFT',
    'DIS',
    'GPRO',
    'SBUX',
    'F',
    'BABA',
    'BAC',
    'FIT',
    'AABA',
    'GE',
    'DUST',
    'SPOT',
  ],
  tick: 10000,
  profitMargin: 0.005,
  maxStocks: 5000,
  startTime: '09:30:00',
  stopTime: '16:00:00',
};

export default config;
