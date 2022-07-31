import { Col, Input } from 'antd';
import _debounce from 'lodash.debounce';

function MovieSearch({ onChangeQueryHandler }) {
  const onChangeHandle = (e) => {
    const query = e.target.value;

    if (!query.trim()) return;
    onChangeQueryHandler(query);
  };

  return (
    <Col span={24}>
      <Input placeholder="Type to search..." onChange={_debounce(onChangeHandle, 500)} />
    </Col>
  );
}

export default MovieSearch;
