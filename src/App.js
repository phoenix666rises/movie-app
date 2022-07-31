import { Component } from 'react';
import { Offline, Online } from 'react-detect-offline';
import { RemoveScroll } from 'react-remove-scroll';
import { Layout, Tabs, Row, Spin } from 'antd';

import MovieService from './api/MovieService';
import Page from './components/Page';
import { Provider } from './Context';

const { TabPane } = Tabs;

class App extends Component {
  mService = new MovieService();

  pages = [{ page: 'Search' }, { page: 'Rated' }];

  constructor() {
    super();
    this.state = {
      currentTab: 'Search',
      sessionId: null,
      genres: null,
    };
  }

  componentDidMount() {
    this.mService.getGenresMovies().then(({ genres }) => this.setState({ genres }));
    this.mService.createGuestSession().then(({ guest_session_id: sessionId }) => this.setState({ sessionId }));
  }

  handleChangeTab = (page) => {
    this.setState({ currentTab: page });
  };

  render() {
    const { genres, sessionId, currentTab } = this.state;
    return (
      <Provider value={genres}>
        <Layout className="container">
          <Tabs defaultActiveKey="1" centered onChange={this.handleChangeTab}>
            {this.pages.map(({ page }) => (
              <TabPane tab={page} key={page}>
                <Row gutter={[30, 30]} justify="center">
                  <Online polling={false}>
                    <Page page={page} sessionId={sessionId} currentTab={currentTab} />
                  </Online>
                  <Offline polling={false}>
                    <RemoveScroll>
                      <Spin tip="Error Internet Disconnected. We're trying to connect...">
                        <Row>
                          <Page page={page} sessionId={sessionId} />
                        </Row>
                      </Spin>
                    </RemoveScroll>
                  </Offline>
                </Row>
              </TabPane>
            ))}
          </Tabs>
        </Layout>
      </Provider>
    );
  }
}

export default App;
