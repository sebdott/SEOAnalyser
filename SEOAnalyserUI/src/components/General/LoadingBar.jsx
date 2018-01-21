import React from 'react';
import classnames from 'classnames';
import css from '../../styles/general/loader.less';

function LoadingBar({duration, isLoading, className, style}) {
  const classes = classnames(
    className,
    isLoading ? css.loadingBar__loading : css.loadingBar,
  );
  return (
    <div className={classes} style={{...style}}>
      <span style={{animationDuration: duration || '2s'}} />
    </div>
  );
}

export default LoadingBar;
