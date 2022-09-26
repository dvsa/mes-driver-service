import Response from '../api/Response';

export default (
  body: {},
  statusCode = 200,
  reqHeaders: { [id: string]: string } = {},
): Response => {
  const accessControlAllowOriginHeader = {
    'Access-Control-Allow-Origin': '*', // Required for CORS support to work
  };

  return {
    statusCode,
    headers: { ...accessControlAllowOriginHeader, ...reqHeaders },
    body: body === null ? null : JSON.stringify(body),
  };
};
