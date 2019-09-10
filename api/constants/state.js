const state = {
  account: {
    id: '',
    account_number: '',
    status: '',
    currency: '',
    buying_power: '',
    regt_buying_power: '',
    daytrading_buying_power: '',
    cash: '',
    portfolio_value: '',
    pattern_day_trader: false,
    trading_blocked: false,
    transfers_blocked: false,
    account_blocked: false,
    created_at: '',
    trade_suspended_by_user: false,
    multiplier: '',
    shorting_enabled: false,
    equity: '',
    last_equity: '',
    long_market_value: '',
    short_market_value: '',
    initial_margin: '',
    maintenance_margin: '',
    last_maintenance_margin: '',
    sma: '',
    daytrade_count: 0,
  },
  app: {
    ticks: 0,
    buys: 0,
    sells: 0,
    profit: 0,
    buyTotal: 0,
    sellTotal: 0,
    updated: null,
    positions: [],
    buyOrders: [],
    sellOrders: [],
    status: 'LOADING',
  },
  quotes: {},
  history: {},
};

export default state;
