import React from 'react';
import {Router, Route} from 'dva/router';
import AnalyserIndex from '../src/components/Analyser/AnalyserIndex';

function RouterConfig({history, app}) {
  return (
    <Router history={history}>
      <Route path="/" component={AnalyserIndex} />
      <Route path="/analyser" component={AnalyserIndex} />
    </Router>
  );
}

export default RouterConfig;
