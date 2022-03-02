import axios, { AxiosRequestConfig } from "axios";

export const $authHost = axios.create({
  baseURL: 'http://localhost:5000',
  withCredentials: true
});
function tokenInterceptor(config: AxiosRequestConfig) {
  config.headers!.authorization = `Bearer ${localStorage.getItem('access-token')}` || '';
  return config;
}
// function unauthorizedErrorHandler(error: AxiosResponseE) {

// }
$authHost.interceptors.request.use(tokenInterceptor);
// $authHost.interceptors.response.use(
//   (config) => config.,
//   (error) => {
//     if (error.response.status === 401) {

//     }
//   }
// );
export const $host = axios.create({
  baseURL: 'http://localhost:5000',
  withCredentials: true
});