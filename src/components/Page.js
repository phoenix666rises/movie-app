import { Component } from 'react';
import { Col, Alert, Pagination } from 'antd';

import MovieService from '../api/MovieService';

import MovieCard from './MovieCard';
import MovieSearch from './MovieSearch';
import ErrorMessage from './ErrorMessage';
import Spinner from './Spinner';

export default class Page extends Component {
  mService = new MovieService();

  constructor() {
    super();
    this.state = {
      movies: [],
      total: 0,
      searchQuery: 'discovery',
      currentPage: 1,
      sessionId: null,
      loading: true,
      error: false,
    };
  }

  componentDidMount() {
    const { page } = this.props;
    if (page === 'Search') this.searchMovies();
    if (page === 'Rated') this.getRatedMovies();
  }

  componentDidUpdate(prevProps, prevState) {
    const { searchQuery, currentPage } = this.state;
    const { page, currentTab } = this.props;
    if (prevState.searchQuery !== searchQuery) {
      this.searchMovies();
    }
    if (prevState.currentPage !== currentPage && page === 'Search') {
      this.searchMovies();
    }
    if (prevState.currentPage !== currentPage && page === 'Rated') {
      this.getRatedMovies();
    }
    if (prevProps.currentTab !== currentTab && page === 'Rated') {
      this.setState({ loading: true });
      this.getRatedMovies();
    }
  }

  getRatedMovies() {
    const { sessionId, currentPage } = this.state;
    const { sessionId: id } = this.props;
    const guestSession = !sessionId ? id : sessionId;
    this.mService.getRatedMovies(guestSession, currentPage).then(this.onSearchedMovies).catch(this.onError);
  }

  onSearchedMovies = ({ results, total_results: total }) => {
    this.setState({
      movies: results,
      loading: false,
      total,
    });
  };

  onChangeSearchQuery = (query) => {
    this.setState({
      searchQuery: query,
      currentPage: 1,
      loading: true,
    });
  };

  onError = () => {
    this.setState({
      error: true,
      loading: false,
    });
  };

  onChangePage = (currentPage) => {
    this.setState({ currentPage, loading: true });
  };

  onChangeRate = (id, rate) => {
    const { sessionId } = this.state;
    const { sessionId: sId } = this.props;
    const guestSession = !sessionId ? sId : sessionId;
    this.mService.rateMovie(id, guestSession, rate);
    localStorage.setItem(id, rate);
  };

  createCards = (movies, message) => {
    if (!movies.length) return <Alert message={message} type="info" />;
    return movies.map((movie) => (
      <Col key={movie.id} xs={24} sm={24} md={12} lg={12}>
        <MovieCard
          movieId={movie.id}
          title={movie.original_title}
          text={movie.overview}
          rating={movie.vote_average}
          date={movie.release_date}
          poster={movie.poster_path}
          genreIds={movie.genre_ids}
          onChangeRate={this.onChangeRate}
        />
      </Col>
    ));
  };

  searchMovies() {
    const { searchQuery, currentPage } = this.state;
    this.mService.searchMovies(searchQuery, currentPage).then(this.onSearchedMovies).catch(this.onError);
  }

  render() {
    const { movies, loading, error, currentPage, total } = this.state;
    const { page } = this.props;
    const message =
      page === 'Search' ? 'There are no such movies. Try to type another title.' : 'There are no rated movies!';
    const movieCards = this.createCards(movies, message);
    const content = !(loading || error) ? movieCards : null;

    return (
      <>
        {page === 'Search' ? <MovieSearch onChangeQueryHandler={this.onChangeSearchQuery} /> : null}
        <ErrorMessage error={error} />
        <Spinner isLoading={loading} />
        {content}
        {!error && !loading && (
          <Col span={24} style={{ textAlign: 'center', marginTop: '25px' }}>
            <Pagination
              current={currentPage}
              total={total}
              pageSize={20}
              showSizeChanger={false}
              onChange={this.onChangePage}
            />
          </Col>
        )}
      </>
    );
  }
}
