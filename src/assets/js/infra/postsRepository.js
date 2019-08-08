import Repository from './Repository';

const resource = '/posts';

export default {
  get() {
    return Repository.get(`${resource}`);
  },
  getPost(postID) {
    return Repository.get(`${resource}/${postID}`);
  },
  createPost(payload) {
    return Repository.post(`${resource}`, payload);
  },
};
