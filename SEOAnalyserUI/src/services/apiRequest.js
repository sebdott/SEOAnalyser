import {request} from '../utils/';

const apiRequest = ({method, url, headers, body, shouldStringify = true}) => {
  return request(url, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    body: shouldStringify ? JSON.stringify(body) : body,
  });
};

export {apiRequest as to};
