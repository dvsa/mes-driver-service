/* eslint-disable semi */
export default interface Response {
  body: any;
  statusCode: number;
  headers: { [id: string]: string };
}
