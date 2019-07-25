import PostsRepository from './postsRepository';

// repositoriesディレクトリーにあるエンティティを登録する
const repositories = {
  posts: PostsRepository,
};

const RepositoryFactory = {
  get: name => repositories[name],
};

export default RepositoryFactory;
