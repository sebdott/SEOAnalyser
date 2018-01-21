import React, {Component} from 'react';
import {connect} from 'dva';
import css from '../../styles/general/layout.less';

class Footer extends Component {
  render() {
    return (
      <div className={css.footer}>
        <div>2010-2018 © Codedsphere All Rights Reserved.</div>
      </div>
    );
  }
}

const mapStatesToProps = ({userModel}) => {
  return {
    ...userModel,
  };
};

export default connect(mapStatesToProps)(Footer);
