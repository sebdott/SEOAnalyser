import fetch from 'dva/fetch';
import _ from 'lodash';
import {message} from 'antd';

/**
 * Requests a URL, returning a promise.
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [options] The options we want to pass to "fetch"
 * @return {object}           An object containing either "data" or "err"
 */
export function request(url, options) {
  // options.mode = 'no-cors';
  return fetch(url, options)
    .then(checkStatus)
    .then(data => ({data}))
    .catch(error => {
      const {message} = error;
      const msgArray = _.split(message, '::');
      const err = {
        message: msgArray[0],
        statusCode: msgArray[1],
      };
      return {err};
    });
}

function checkStatus(response) {
  const {status} = response;
  let responseMessage = '';
  if (status >= 200 && status < 300) {
    switch (status) {
      case 201:
        message.info(responseMessage);
        break;
      case 202:
        message.info(responseMessage);
        break;
      case 203:
        message.info(responseMessage);
        break;
      case 204:
        return {result: {status: 204}};
      default:
        return response.json();
    }
  } else if (status >= 300 && status < 400) {
    switch (status) {
      case 301:
        throw new Error(`${responseMessage}::${status}`);
      case 302:
        throw new Error(`${responseMessage}::${status}`);
      case 303:
        throw new Error(`${responseMessage}::${status}`);
      case 304:
        throw new Error(`${responseMessage}::${status}`);
      case 305:
        throw new Error(`${responseMessage}::${status}`);
      case 306:
        throw new Error(`${responseMessage}::${status}`);
      default:
        throw new Error(`${responseMessage}::${status}`);
    }
  } else if (status >= 400 && status < 500) {
    switch (status) {
      case 400:
        return response.json().then(JSON => {
          responseMessage = JSON.message || '客户机中出现的错误';
          throw new Error(`${responseMessage}::${status}`);
        });
      case 401:
        throw new Error(`${responseMessage}::${status}`);
      case 402:
        throw new Error(`${responseMessage}::${status}`);
      case 403:
        throw new Error(`${responseMessage}::${status}`);
      case 404:
        throw new Error(`${responseMessage}::${status}`);
      case 405:
        throw new Error(`${responseMessage}::${status}`);
      case 406:
        throw new Error(`${responseMessage}::${status}`);
      case 407:
        throw new Error(`${responseMessage}::${status}`);
      case 410:
        throw new Error(`${responseMessage}::${status}`);
      case 412:
        throw new Error(`${responseMessage}::${status}`);
      case 414:
        throw new Error(`${responseMessage}::${status}`);
      case 415:
        throw new Error(`${responseMessage}::${status}`);
      case 422:
        throw new Error(`${responseMessage}::${status}`);
      default:
        throw new Error(`${responseMessage}::${status}`);
    }
  } else if (status >= 500) {
    switch (status) {
      case 500:
        throw new Error(`${responseMessage}::${status}`);
      case 501:
        throw new Error(`${responseMessage}::${status}`);
      case 502:
        throw new Error(`${responseMessage}::${status}`);
      case 503:
        throw new Error(`${responseMessage}::${status}`);
      case 504:
        throw new Error(`${responseMessage}::${status}`);
      default:
        throw new Error(`${responseMessage}::${status}`);
    }
  }
}
