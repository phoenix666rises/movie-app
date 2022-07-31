import { Alert } from 'antd';

function ErrorMessage({ error }) {
  return error ? (
    <Alert message="Error" description="Something went wrong! We're trying to fix it." type="error" showIcon />
  ) : null;
}

export default ErrorMessage;
