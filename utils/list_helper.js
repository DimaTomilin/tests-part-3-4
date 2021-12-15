const dummy = (blogs) => {
  if (blogs) {
    return 1;
  }
};

const totalLikes = (blogs) => {
  let sumOfLikes = 0;
  for (const blog of blogs) {
    sumOfLikes += blog.likes;
  }
  return sumOfLikes;
};

const findFavorite = (blogs) => {
  const biggestAmountOfLikes = Math.max.apply(
    Math,
    blogs.map((blog) => {
      return blog.likes;
    })
  );
  const { author, title, likes } = blogs.find((blog) => {
    return blog.likes === biggestAmountOfLikes;
  });
  return { author, title, likes };
};

const mostBlogs = (blogs) => {
  const authorBlogs = {};
  blogs.forEach((blog) => {
    if (!authorBlogs[`${blog.author}`]) {
      authorBlogs[`${blog.author}`] = 1;
    } else {
      authorBlogs[`${blog.author}`]++;
    }
  });
  const amountOfBlogs = Math.max(...Object.values(authorBlogs));
  const mostPopularAuthor = Object.keys(authorBlogs).find(
    (author) => authorBlogs[author] === amountOfBlogs
  );
  return { author: mostPopularAuthor, blogs: authorBlogs[mostPopularAuthor] };
};

const mostLikes = (blogs) => {
  const authorLikes = {};
  blogs.forEach((blog) => {
    if (!authorLikes[`${blog.author}`]) {
      authorLikes[`${blog.author}`] = blog.likes;
    } else {
      authorLikes[`${blog.author}`] += blog.likes;
    }
  });
  const amountOfLikes = Math.max(...Object.values(authorLikes));
  const mostPopularAuthor = Object.keys(authorLikes).find(
    (author) => authorLikes[author] === amountOfLikes
  );
  return { author: mostPopularAuthor, likes: authorLikes[mostPopularAuthor] };
};

module.exports = {
  dummy,
  totalLikes,
  findFavorite,
  mostBlogs,
  mostLikes,
};
