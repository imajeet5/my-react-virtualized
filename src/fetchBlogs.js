let apiUrl = 'https://api.slingacademy.com/v1/sample-data/blog-posts';

async function fetchBlogs(offset = 0, size = 5) {
   const resp = await fetch(`${apiUrl}?offset=${offset}&limit=${size}`);
   const blogs = await resp.json();
   return blogs;
}

export default fetchBlogs;