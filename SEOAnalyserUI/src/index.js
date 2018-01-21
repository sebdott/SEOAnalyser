import 'babel-polyfill';
import dva from 'dva';
import {message} from 'antd';
import Fingerprint2 from 'fingerprintjs2';
import {browserHistory} from 'dva/router';
import './index.css';
import {encryptAES, decryptAES} from './utils';

const ERROR_MSG_DURATION = 3; // 3 秒

// 1. Initialize
const app = dva({
  history: browserHistory,
  onError(e) {
    const msgs = document.querySelectorAll('.ant-message-notice');
    if (msgs.length < 1) {
      message.error(e, /* duration */ 3);
    }
  },
});
// 2. Plugins
app.model(require('./models/analyser'));
// 3. Model
// Moved to router.js

// 4. Router
app.router(require('./router'));

const getFingerprint = () =>
  new Promise(resolve => {
    new Fingerprint2().get((result, components) => resolve(result));
  });

const main = async () => {
  const deviceToken = await getFingerprint();
  window.sessionStorage.id = new Date().getTime();
  window.sessionStorage.init = encryptAES(
    deviceToken,
    window.sessionStorage.id,
  );
  app.model({
    namespace: 'appModel',
    state: {deviceToken},
  });
  return app.start('#root');
};

const getToken = async () => {
  if (window.sessionStorage.init && window.sessionStorage.id) {
    var value = decryptAES(
      window.sessionStorage.init,
      window.sessionStorage.id,
    );
    if (value) {
      app.model({
        namespace: 'appModel',
        state: {deviceToken: value},
      });
      return app.start('#root');
    }
  }
  main();
};

getToken();
