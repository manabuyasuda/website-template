import axios from 'axios';

const baseDomain = 'https://jsonplaceholder.typicode.com';
// APIの取得元URL
// WP REST APIの場合は`${baseDomain}/wp-json/wp/v2`
const baseURL = `${baseDomain}`;

export default axios.create({
  baseURL,
  // headers: {
  //   'Authorization': 'token'
  // },
});
