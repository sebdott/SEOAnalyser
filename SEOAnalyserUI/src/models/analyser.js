import queryString from 'query-string';
import {notification} from 'antd';
import _ from 'lodash';
import {API} from '../utils';
import {apiRequest as request} from '../services';

const INITIAL_STATE = {
  searchID: '',
  searchText: '',
  searchWordFilterList: null,
  searchMetaInfoFilterList: null,
  searchExternalLinksFilterList: null,
  sortWordFilter: {
    order: '',
    columnKey: '',
  },
  sortExternalLinkFilter: {
    order: '',
    columnKey: '',
  },
  sortMetaInfoFilter: {
    order: '',
    columnKey: '',
  },
  isPageFilterStopWords: false,
  isCountNumberofWords: false,
  isMetaTagsInfo: false,
  isGetExternalLink: false,
  isUrl: false,
  isSearchStarted: false,
};

export default {
  namespace: 'analyserModel',
  state: INITIAL_STATE,
  reducers: {
    updateState(state, {payload}) {
      return {
        ...state,
        ...payload,
      };
    },
    removeState(state, {payload}) {
      const newState = _.omit(state, payload);
      return {
        ...newState,
      };
    },
    initializeState(state, {payload}) {
      const initialStates = _.pick(INITIAL_STATE, payload);
      return {
        ...state,
        ...initialStates,
      };
    },
    initializeAll(state, {payload}) {
      let newState = {};
      if (payload) {
        newState = _.omit(INITIAL_STATE, payload);
      } else {
        newState = INITIAL_STATE;
      }

      return {
        ...state,
        ...newState,
      };
    },
  },
  effects: {
    *registerSearchText(payloadObj, {put, call, select}) {
      yield put({
        type: 'updateState',
        payload: {
          awaitingResponse: true,
        },
      });
      const {analyserModel, appModel} = yield select(state => state);
      const {
        searchText,
        isPageFilterStopWords,
        isCountNumberofWords,
        isMetaTagsInfo,
        isGetExternalLink,
        isUrl,
      } = analyserModel;
      const body = {
        searchText,
        isUrl,
        isPageFilterStopWords,
        isCountNumberofWords,
        isMetaTagsInfo,
        isGetExternalLink,
      };
      const response = yield call(request.to, {
        url: API.analyserRegisterSearchText,
        method: 'post',
        headers: {device_token: appModel.deviceToken},
        body,
      });
      if (response)
        if (response.data) {
          const statusOK = typeof response.data === 'string';
          if (statusOK) {
            yield put({
              type: 'updateState',
              payload: {
                searchID: response.data,
              },
            });
            yield put({
              type: 'updateState',
              payload: {
                isSearchStarted: true,
              },
            });
            if (isCountNumberofWords) {
              yield put({
                type: 'getAllWordsInfo',
                searchID: response.data,
              });
            }

            if (isMetaTagsInfo) {
              yield put({
                type: 'getAllMetaTagsInfo',
                searchID: response.data,
              });
            }

            if (isGetExternalLink) {
              yield put({
                type: 'getAllExternalLinks',
                searchID: response.data,
              });
            }
          }
        } else if (response.err) {
          notification['error']({
            message: 'Connection Error',
            description:
              'Warning: Server Connection error, Please Try again later',
          });
        }
      yield put({
        type: 'updateState',
        payload: {
          awaitingResponse: false,
        },
      });
    },
    *getAllWordsInfo(payloadObj, {put, call, select}) {
      yield put({
        type: 'updateState',
        payload: {
          awaitingResponseWordsInfo: true,
        },
      });
      const {appModel} = yield select(state => state);
      const params = {
        searchID: payloadObj.searchID,
      };
      const response = yield call(request.to, {
        url: API.analyserGetAllWordsInfo + '?' + queryString.stringify(params),
        method: 'get',
        headers: {device_token: appModel.deviceToken},
      });
      if (response)
        if (response.data) {
          const statusOK = typeof response.data === 'object';
          if (statusOK) {
            yield put({
              type: 'updateState',
              payload: {
                searchWordFilterList: response.data,
              },
            });
          }
        } else if (response.err) {
          // throw new Error(`API Failed，${response.err.message}`);
        }
      yield put({
        type: 'updateState',
        payload: {
          awaitingResponseWordsInfo: false,
        },
      });
    },
    *getAllExternalLinks(payloadObj, {put, call, select}) {
      yield put({
        type: 'updateState',
        payload: {
          awaitingResponseExternalLinks: true,
        },
      });
      const {appModel} = yield select(state => state);
      const params = {
        searchID: payloadObj.searchID,
      };
      const response = yield call(request.to, {
        url:
          API.analyserGetAllExternalLinks + '?' + queryString.stringify(params),
        method: 'get',
        headers: {device_token: appModel.deviceToken},
      });
      if (response)
        if (response.data) {
          const statusOK = typeof response.data === 'object';
          if (statusOK) {
            yield put({
              type: 'updateState',
              payload: {
                searchExternalLinksFilterList: response.data,
              },
            });
          }
        } else if (response.err) {
          // throw new Error(`API Failed，${response.err.message}`);
        }
      yield put({
        type: 'updateState',
        payload: {
          awaitingResponseExternalLinks: false,
        },
      });
    },
    *getAllMetaTagsInfo(payloadObj, {put, call, select}) {
      yield put({
        type: 'updateState',
        payload: {
          awaitingResponseMetaTagLinks: true,
        },
      });
      const {appModel} = yield select(state => state);
      const params = {
        searchID: payloadObj.searchID,
      };
      const response = yield call(request.to, {
        url:
          API.analyserGetAllMetaTagsInfo + '?' + queryString.stringify(params),
        method: 'get',
        headers: {device_token: appModel.deviceToken},
      });
      if (response)
        if (response.data) {
          const statusOK = typeof response.data === 'object';
          if (statusOK) {
            yield put({
              type: 'updateState',
              payload: {
                searchMetaInfoFilterList: response.data,
              },
            });
          }
        } else if (response.err) {
          // throw new Error(`API Failed，${response.err.message}`);
        }
      yield put({
        type: 'updateState',
        payload: {
          awaitingResponseMetaTagLinks: false,
        },
      });
    },
  },
};
