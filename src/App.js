import { useEffect, useRef, useState } from 'react';
import './App.css';
import fetchBlogs from './fetchBlogs';
import { Grid } from 'react-virtualized';
import VirtualRows from './virtualization/VirtualRows';
function App() {
    const [blogs, setBlogs] = useState([]);
    const [requestStatus, setRequestStatus] = useState('loading');
    const observerTarget = useRef(null);
    const [offset, setOffset] = useState(0);

    useEffect(() => {
        const getBlogs = async () => {
            try {
                // initiall we fetch 10 row then we fetch 5 rows
                let fetchCount =  10;
                const blogsData = await fetchBlogs(offset, fetchCount);
                console.log(blogsData);
                setBlogs([...blogs, ...blogsData.blogs]);
                setRequestStatus('success');
            } catch (error) {
                setRequestStatus('failure');
            }
        };

        getBlogs();
    }, [offset]);

    const cellRenderer = (rowIndex, style) => {
        const blog = blogs[rowIndex];
        return (
            <div
                id={blog.id}
                key={blog.id}
                className="blogContainer"
                style={style}
            >
                <h2 className="title">
                    {blog.id}-{blog.title}
                </h2>
                <p>{blog.content_text.substring(0, 320)}...</p>
            </div>
        );
    };

    const attemptLoadingNewPosts = (params) => {
        const { endRowIndex } = params;
        // first time we are expecting to be more then 5 rows
        if (
          endRowIndex > 5 &&
            (endRowIndex + 3) % 10 === 0 &&
            endRowIndex > offset && // this condition is bcz we want to load new post on in scroll bottom
            // here offset is the last index at which post has been loaded. 
            !requestStatus.includes('loading')
        ) {
            setOffset(endRowIndex + 3);
            console.log(params);
            setRequestStatus('loadingPosts');
        }
    };

    const noContent = () => {
        return <div>No Blog Post</div>;
    };

    let content = null;

    if (requestStatus === 'loading') {
        content = <h2 className="title">Loading...</h2>;
    }
    if (requestStatus === 'failure') {
        content = <h2>Fail to load posts</h2>;
    }
    if (requestStatus === 'success' || requestStatus === 'loadingPosts') {
        content = (
            <VirtualRows
                height={800}
                onRowRenderedUpdate={attemptLoadingNewPosts}
                rowCount={blogs.length}
                rowHeight={160}
                rowRenderer={cellRenderer}
                scrollToRow={0} 
                scrollTop={0}
            />
        );
    }

    return (
        <div className="container">
            {content}
            {requestStatus === 'loadingPosts' && (
                <div className="title" id="observerTarget" ref={observerTarget}>
                    Loading...
                </div>
            )}
        </div>
    );
}

export default App;
