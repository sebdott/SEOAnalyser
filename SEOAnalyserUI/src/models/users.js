import queryString from 'query-string';

const INITIAL_STATE = {
  list: [],
  total: null,
  page: null,
};

export default {
  namespace: 'userModel',
  state: INITIAL_STATE,
  reducers: {
    save(state, {payload: {data: list, total, page}}) {
      return {...state, list, total, page};
    },
  },
  effects: {},
  subscriptions: {
    setup({dispatch, history}) {
      return history.listen(({pathname, search}) => {
        const query = queryString.parse(search);
        if (pathname === '/users') {
          dispatch({type: 'fetch', payload: query});
        }
      });
    },
  },
};
