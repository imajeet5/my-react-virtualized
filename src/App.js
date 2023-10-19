import { useEffect, useState } from 'react';
import './App.css';
import fetchBlogs from './fetchBlogs';
function App() {
    const [blogs, setBlogs] = useState([]);
    const [requestStatus, setRequestStatus] = useState('loading');

    useEffect(() => {
        const getBlogs = async () => {
            try {
                const blogsData = await fetchBlogs();
                console.log(blogsData)
                setBlogs(blogsData.blogs);
                setRequestStatus('success');
            } catch (error) {
                setRequestStatus('failure');
            }
        };

        getBlogs();
    },[]);

    let content = null;

    if(requestStatus === 'loading'){
      content = <h2>Loading...</h2>
    }
    if(requestStatus === 'failure'){
      content = <h2>Fail to load posts</h2>
    }
    if(requestStatus === 'success'){
      content = blogs.map(blog => {
          return <div key={blog.id} className='blogContainer'>
            <h2>{blog.id}-{blog.title}</h2>
            <p>{blog.content_text}</p>

          </div>
      })
    }

    return (
        <div className="container">
           {content}
        </div>
    );
}

export default App;
