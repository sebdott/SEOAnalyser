import React, {Component} from 'react';
import {Table, Input, Button, Checkbox, Icon, Spin} from 'antd';
import {connect} from 'dva';
import {LoadingBar} from '../General';
import css from '../../styles/analyser/index.less';
import {isValidURL} from '../../utils/';
import logo from '../../assets/logo.png';
import Footer from '../MainLayout/Footer';

const {TextArea} = Input;

const filterList = {
  isPageFilterStopWords: 'Filters Stop Word',
  isCountNumberofWords: 'Number of Words in URL/Textbox',
  isMetaTagsInfo: 'Meta Tags info in URL',
  isGetExternalLink: 'Get all external link from URL/Textbox',
};
class AnalyserIndex extends Component {
  constructor(props) {
    super(props);
    this.dispatch = this.props.dispatch;
  }
  componentWillMount() {
    this.onInitializeCheckBox();
  }
  onInitializeCheckBox() {
    let searchFilterList = [];
    _.map(filterList, (value, index) => {
      searchFilterList.push(index);
    });

    this.dispatch({
      type: 'analyserModel/updateState',
      payload: {
        searchFilterList,
      },
    });
  }
  onGetApiValue = () => {
    const {searchFilterList} = this.props;
    this.dispatch({
      type: 'analyserModel/initializeState',
      payload: [
        'isPageFilterStopWords',
        'isCountNumberofWords',
        'isMetaTagsInfo',
        'isGetExternalLink',
        'searchWordFilterList',
        'searchMetaInfoFilterList',
        'searchExternalLinksFilterList',
        'isSearchStarted',
      ],
    });
    _.map(searchFilterList, (filter, index) => {
      switch (filter) {
        case 'isPageFilterStopWords':
          this.dispatch({
            type: 'analyserModel/updateState',
            payload: {
              isPageFilterStopWords: true,
            },
          });
          break;
        case 'isCountNumberofWords':
          this.dispatch({
            type: 'analyserModel/updateState',
            payload: {
              isCountNumberofWords: true,
            },
          });
          break;
        case 'isMetaTagsInfo':
          this.dispatch({
            type: 'analyserModel/updateState',
            payload: {
              isMetaTagsInfo: true,
            },
          });
          break;
        case 'isGetExternalLink':
          this.dispatch({
            type: 'analyserModel/updateState',
            payload: {
              isGetExternalLink: true,
            },
          });
          break;
        default:
          break;
      }
    });
    this.dispatch({
      type: 'analyserModel/registerSearchText',
    });
  };
  onInitializeItem() {
    this.dispatch({
      type: 'analyserModel/initializeState',
      payload: [
        'searchText',
        'searchFilterList',
        'isPageFilterStopWords',
        'isCountNumberofWords',
        'isMetaTagsInfo',
        'isGetExternalLink',
        'sortWordFilter',
        'sortExternalLinkFilter',
        'searchWordFilterList',
        'searchMetaInfoFilterList',
        'searchExternalLinksFilterList',
        'isSearchStarted',
      ],
    });
  }
  onClearAll = () => {
    this.onInitializeItem();
  };
  onCheckListChange(checkedList) {
    const {searchFilterList} = this.props;

    let list = _.cloneDeep(searchFilterList);
    const indexSelected = list.indexOf(checkedList);

    if (indexSelected > -1) {
      list.splice(indexSelected, 1);
    } else {
      list.push(checkedList);
    }

    this.dispatch({
      type: 'analyserModel/updateState',
      payload: {
        searchFilterList: list,
      },
    });
  }
  renderAnalyserID() {
    const {searchID} = this.props;
    return <div>{searchID || ''}</div>;
  }
  renderFilterCheckbox() {
    const {searchFilterList} = this.props;

    return _.map(filterList, (value, index) => {
      return (
        <Checkbox
          key={index}
          checked={
            searchFilterList &&
            searchFilterList.length > 0 &&
            searchFilterList.indexOf(index) > -1
          }
          onChange={this.onCheckListChange.bind(this, index)}>
          {value}
        </Checkbox>
      );
    });
  }
  onInputChange = e => {
    const {value} = e.target;
    this.dispatch({
      type: 'analyserModel/updateState',
      payload: {
        isUrl: isValidURL(value),
      },
    });

    this.dispatch({
      type: 'analyserModel/updateState',
      payload: {
        searchText: value,
      },
    });
  };
  renderSearch() {
    const {isUrl, searchText, awaitingResponse} = this.props;
    return (
      <div className={css.analyser_SearchOuter}>
        <div>
          <TextArea
            rows={4}
            value={searchText}
            className={css.analyser_SearchInput}
            autosize={{minRows: 4, maxRows: 4}}
            placeholder="Website URL/ Text in English"
            onChange={this.onInputChange}
          />
        </div>
        <div>
          <Icon type="info-circle" /> If you want to search URL please key as
          per following <b>Example</b>: http://www.example.com or
          http://www.example.com/index.html.
        </div>
        <div className={css.analyser_CheckBoxOuter}>
          {this.renderFilterCheckbox()}
        </div>
        <div>
          <Button
            className={css.analyser_SearchBtn}
            type="primary"
            size="large"
            disabled={!searchText || searchText.length < 1 || awaitingResponse}
            onClick={this.onGetApiValue}>
            <Icon type="search" /> Checkup {isUrl ? 'URL' : 'Text'}
          </Button>
          <Button
            className={css.analyser_CancelBtn}
            type="primary"
            size="large"
            disabled={!searchText || searchText.length < 1 || awaitingResponse}
            onClick={this.onClearAll}>
            <Icon type="close" /> Clear All
          </Button>
        </div>
      </div>
    );
  }
  onHandleWordChange = (pagination, filters, sorter) => {
    this.dispatch({
      type: 'analyserModel/updateState',
      payload: {
        sortWordFilter: sorter,
      },
    });
  };
  renderWordsInfoTable() {
    const {sortWordFilter} = this.props;
    const {
      searchWordFilterList,
      isCountNumberofWords,
      awaitingResponseWordsInfo,
    } = this.props;
    let filterList = [];
    filterList = searchWordFilterList;

    const columns = [
      {
        title: 'Words',
        dataIndex: 'title',
        key: 'title',
        sorter: (a, b) => a.title.length - b.title.length,
        sortOrder: sortWordFilter.columnKey === 'title' && sortWordFilter.order,
      },
      {
        title: 'Count',
        dataIndex: 'count',
        key: 'count',
        className: css.analyser_CountColumn,
        sorter: (a, b) => a.count - b.count,
        sortOrder: sortWordFilter.columnKey === 'count' && sortWordFilter.order,
      },
    ];

    const wordInfoTable = () => {
      let dataSource = [];
      if ((filterList && filterList.length > 0) || !awaitingResponseWordsInfo) {
        _.map(filterList, ({key, value}) => {
          dataSource.push({
            key: key,
            title: key,
            count: value,
          });
        });

        return (
          <div>
            <Table
              locale={{emptyText: 'No Words'}}
              dataSource={dataSource}
              columns={columns}
              onChange={this.onHandleWordChange}
            />
          </div>
        );
      }
      return (
        <div>
          <Spin size="large" className={css.analyser_Spinner} />
        </div>
      );
    };
    return isCountNumberofWords ? (
      <div>
        <h2>Words Analsyis</h2>
        {wordInfoTable()}
      </div>
    ) : (
      <div />
    );
  }
  onHandleExternalLinksChange = (pagination, filters, sorter) => {
    this.dispatch({
      type: 'analyserModel/updateState',
      payload: {
        sortExternalLinkFilter: sorter,
      },
    });
  };
  renderExternalLinksInfoTable() {
    const {
      searchExternalLinksFilterList,
      isGetExternalLink,
      awaitingResponseExternalLinks,
      sortExternalLinkFilter,
    } = this.props;
    const columns = [
      {
        title: 'External Links URL',
        dataIndex: 'title',
        key: 'title',
        sorter: (a, b) => a.title.length - b.title.length,
        sortOrder:
          sortExternalLinkFilter.columnKey === 'title' &&
          sortExternalLinkFilter.order,
      },
      {
        title: 'Count',
        dataIndex: 'count',
        key: 'count',
        className: css.analyser_CountColumn,
        sorter: (a, b) => a.count - b.count,
        sortOrder:
          sortExternalLinkFilter.columnKey === 'count' &&
          sortExternalLinkFilter.order,
      },
    ];

    const externalLinksTable = () => {
      let dataSource = [];
      if (
        (searchExternalLinksFilterList &&
          searchExternalLinksFilterList.length > 0) ||
        !awaitingResponseExternalLinks
      ) {
        _.map(searchExternalLinksFilterList, ({key, value}) => {
          dataSource.push({
            key: key + '_externalLinks',
            title: key,
            count: value,
          });
        });

        return (
          <div>
            <Table
              locale={{emptyText: 'No External Links URL'}}
              dataSource={dataSource}
              columns={columns}
              onChange={this.onHandleExternalLinksChange}
            />
          </div>
        );
      }
      return (
        <div>
          <Spin size="large" className={css.analyser_Spinner} />
        </div>
      );
    };
    return isGetExternalLink ? (
      <div>
        <h2>External Links Analsyis</h2>
        {externalLinksTable()}
      </div>
    ) : (
      <div />
    );
  }
  renderMetaTagInfo(item) {
    const {wordsInfoList} = item.action;
    if (wordsInfoList) {
      return this.renderWordsInfoTable(wordsInfoList);
    }
    return <div />;
  }
  renderMetaInnerInfoTable(filterList) {
    const {
      awaitingResponseWordsInfo,
      awaitingResponseExternalLinks,
    } = this.props;

    const columns = [
      {
        title: 'Words',
        dataIndex: 'title',
        key: 'title',
      },
      {
        title: 'Count',
        dataIndex: 'count',
        key: 'count',
        className: css.analyser_CountColumn,
      },
    ];

    const wordInfoTable = () => {
      let dataSource = [];
      if (
        (filterList.wordsInfoList && filterList.wordsInfoList.length > 0) ||
        !awaitingResponseWordsInfo
      ) {
        _.map(filterList.wordsInfoList, (value, key) => {
          dataSource.push({
            key: key + '_metaInnerWord',
            title: key,
            count: value,
          });
        });

        return (
          <div>
            <Table
              locale={{emptyText: 'No Words'}}
              dataSource={dataSource}
              columns={columns}
              onChange={this.onHandleWordChange}
            />
          </div>
        );
      }
      return (
        <div>
          <Spin size="large" className={css.analyser_Spinner} />
        </div>
      );
    };

    const externalLinksTable = () => {
      let dataSource = [];
      if (
        (filterList.urlInfoList && filterList.urlInfoList.length > 0) ||
        !awaitingResponseExternalLinks
      ) {
        _.map(filterList.urlInfoList, (value, key) => {
          dataSource.push({
            key: key + '_metaInnerEL',
            title: key,
            count: value,
          });
        });

        return (
          <div>
            <Table
              locale={{emptyText: 'No External Links URL'}}
              dataSource={dataSource}
              columns={columns}
              onChange={this.onHandleExternalLinksChange}
            />
          </div>
        );
      }
      return (
        <div>
          <Spin size="large" className={css.analyser_Spinner} />
        </div>
      );
    };
    return (
      <div>
        <h2>Words Analsyis</h2>
        {wordInfoTable()}
        <h2>External Links Analsyis</h2>
        {externalLinksTable()}
      </div>
    );
  }
  renderMetaInfoMainTable() {
    const {
      searchMetaInfoFilterList,
      isMetaTagsInfo,
      awaitingResponseMetaTagLinks,
    } = this.props;

    const columns = [
      {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
        className: css.analyser_TitleColumn,
      },
      {
        title: 'Property',
        dataIndex: 'property',
        key: 'property',
        className: css.analyser_TitleColumn,
      },
      {
        title: 'ItemProp',
        dataIndex: 'itemProp',
        key: 'itemProp',
        className: css.analyser_TitleColumn,
      },
      {
        title: 'HttpEquiv',
        dataIndex: 'httpEquiv',
        key: 'httpEquiv',
        className: css.analyser_TitleColumn,
      },
      {
        title: 'Content',
        dataIndex: 'content',
        key: 'content',
      },
    ];

    const metaInfoTable = () => {
      let dataSource = [];
      if (searchMetaInfoFilterList || !awaitingResponseMetaTagLinks) {
        _.map(searchMetaInfoFilterList, (item, index) => {
          const {
            name,
            property,
            itemProp,
            httpEquiv,
            content,
            urlInfoList,
            wordsInfoList,
            totalWordCount,
          } = item;

          dataSource.push({
            key: index + '_metaMainTable',
            name,
            property,
            itemProp,
            httpEquiv,
            content,
            totalWordCount,
            action: {urlInfoList, wordsInfoList},
          });
        });
        return (
          <div>
            <Table
              locale={{emptyText: 'No Meta Tag Info'}}
              dataSource={dataSource}
              columns={columns}
              expandedRowRender={data =>
                this.renderMetaInnerInfoTable(data.action)
              }
            />
          </div>
        );
      }
      return (
        <div>
          <Spin size="large" className={css.analyser_Spinner} />
        </div>
      );
    };
    return isMetaTagsInfo ? (
      <div>
        <h2>Meta Tag Info Analsyis</h2>
        {metaInfoTable()}
      </div>
    ) : (
      <div />
    );
  }
  renderTables() {
    const {
      isSearchStarted,
      isCountNumberofWords,
      isMetaTagsInfo,
      isGetExternalLink,
    } = this.props;

    const wordsInfoTable = () => {
      if (!isCountNumberofWords) return <div />;
      return (
        <div className={css.analyser_WordInfoTableOuter}>
          {this.renderWordsInfoTable()}{' '}
        </div>
      );
    };
    const externalLinkTable = () => {
      if (!isGetExternalLink) return <div />;
      return (
        <div className={css.analyser_ExternalLinkTableOuter}>
          {this.renderExternalLinksInfoTable()}{' '}
        </div>
      );
    };

    const metaInfo = () => {
      if (!isMetaTagsInfo) return <div />;
      return (
        <div className={css.analyser_MetaInfoTableOuter}>
          {this.renderMetaInfoMainTable()}{' '}
        </div>
      );
    };

    if (isSearchStarted) {
      return (
        <div>
          {wordsInfoTable()}
          {externalLinkTable()}
          {metaInfo()}
        </div>
      );
    }
    return <div />;
  }
  render() {
    const {awaitingResponse} = this.props;
    return (
      <div className={css.pageContainer}>
        <div>
          <img alt="mainLogo" src={logo} height="200" width="200" />
        </div>
        <div>
          <h1>SEO Analyser</h1>
        </div>
        <LoadingBar isLoading={awaitingResponse} />
        <div>{this.renderSearch()}</div>
        <div>{this.renderTables()}</div>
        <Footer />
      </div>
    );
  }
}

const mapStatesToProps = ({analyserModel}) => {
  return {
    ...analyserModel,
  };
};

export default connect(mapStatesToProps)(AnalyserIndex);
