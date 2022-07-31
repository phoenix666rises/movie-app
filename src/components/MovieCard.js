import { Component } from 'react';
import { Card, Image, Rate, Tag, Typography } from 'antd';
import format from 'date-fns/format';
import classNames from 'classnames';

import cutText from '../utils/cutText';
import poster404 from '../img/404poster.jpg';
import { Consumer } from '../Context';

const { Title, Paragraph, Text } = Typography;

class MovieCard extends Component {
  constructor() {
    super();
    this.state = {
      value: 0,
    };
  }

  onHandleChangeRate = (value) => {
    const { onChangeRate, movieId } = this.props;
    this.setState({ value });
    onChangeRate(movieId, value);
  };

  render() {
    const { title, text, date, poster, movieId, genreIds } = this.props;
    const { value } = this.state;
    const stars = +localStorage.getItem(movieId) || value;
    let { rating } = this.props;
    const ratingClass = classNames({
      rating: true,
      'to-three': rating <= 3,
      'to-five': rating > 3 && rating <= 5,
      'to-seven': rating > 5 && rating <= 7,
      'to-ten': rating > 7 && rating <= 10,
    });

    if (rating.toString().length === 1) rating = `${rating}.0`;

    return (
      <Consumer>
        {(genres) => (
          <Card hoverable>
            <Image src={poster ? `https://image.tmdb.org/t/p/w500/${poster}` : poster404} />
            <Title level={3}>{title}</Title>
            <div className={ratingClass}>{rating}</div>
            <Text>{date ? format(new Date(date), 'd MMMM, Y') : 'Unknown'}</Text>
            <div className="card-tags">
              {genreIds.map((id) => {
                const genre = genres.find((g) => g.id === id);
                return <Tag key={genre.id}>{genre.name}</Tag>;
              })}
            </div>
            <Paragraph>{cutText(text)}</Paragraph>
            <Rate allowHalf count={10} value={stars} onChange={this.onHandleChangeRate} />
          </Card>
        )}
      </Consumer>
    );
  }
}

export default MovieCard;
