/* eslint-disable react/no-unused-class-component-methods */
import { Component } from 'react';

class MovieService extends Component {
  constructor() {
    super();
    this.url = 'https://api.themoviedb.org/3';
    this.key = '020e0bf1821c1276c52b184b9e1d7926';
    this.fetchUrl = '';
  }

  async getResource(resource, query, page, sessionId, rate) {
    this.fetchUrl = `${this.url}${resource}?api_key=${this.key}`;

    if (page) this.fetchUrl = `${this.url}${resource}?api_key=${this.key}&page=${page}`;
    if (query && page) this.fetchUrl = `${this.url}${resource}?api_key=${this.key}&query=${query}&page=${page}`;
    if (sessionId) this.fetchUrl = `${this.url}${resource}?api_key=${this.key}&guest_session_id=${sessionId}`;

    this.bodyRq = null;
    if (rate)
      this.bodyRq = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json;charset=utf-8' },
        body: JSON.stringify({ value: rate }),
      };

    const res = await fetch(this.fetchUrl, this.bodyRq);

    if (!res.ok) throw new Error(`Could not fetch ${this.url}, recieved ${res.status}`);

    const data = await res.json();
    return data;
  }

  getRatedMovies(sessionId, page) {
    return this.getResource(`/guest_session/${sessionId}/rated/movies`, null, page);
  }

  getGenresMovies() {
    return this.getResource('/genre/movie/list');
  }

  rateMovie(movieId, guestSessionId, rate) {
    return this.getResource(`/movie/${movieId}/rating`, null, null, guestSessionId, rate);
  }

  createGuestSession() {
    return this.getResource('/authentication/guest_session/new');
  }

  searchMovies(query, page) {
    return this.getResource('/search/movie', query, page);
  }
}

export default MovieService;
