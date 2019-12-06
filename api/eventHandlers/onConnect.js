import client from '../constants/client';
import config from '../constants/config';

const onConnect = () => {
  const listeners = [
    'order_updates',
    'trade_updates',
    ...config.ticker.map(ticker => `Q.${ticker}`),
  ];
  client.subscribe(listeners);
  // eslint-disable-next-line no-console
  console.log(`Websocket connected. Listening to ${listeners.join(', ')}`);
};

export default onConnect;
