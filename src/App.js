import { useState } from 'react';
import './App.css';
import fetchBlogs from './fetchBlogs';
import VirtualRows from './virtualization/VirtualRows';

const FetchCount = 10;
const RowMargin = 3;

function App() {
    const [blogs, setBlogs] = useState([]);
    const [requestStatus, setRequestStatus] = useState('');
    const [postLoadedCount, setPostLoadedCount] = useState(0);
    const getBlogs = async (offset, fetchCount = FetchCount) => {
        try {
            const blogsData = await fetchBlogs(offset, fetchCount);
            console.log(blogsData);
            setBlogs([...blogs, ...blogsData.blogs]);
            setPostLoadedCount(offset + fetchCount);
            setRequestStatus('success');
        } catch (error) {
            setRequestStatus('failure');
        }
    };

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
        if (requestStatus.includes('loading')) {
            return;
        }
        if (postLoadedCount === 0) {
            //this means not post is loaded yet
            // what we do over here is what ever the page is we load that number of post
            // 14 is the endRowIndex
            // this endRowIndex + 1 is to handle the case when user is exactly at
            // post which id divisible by 10, like 20, 50 etc, then we will load post of
            // next page as well
            const totalPostToFetch = Math.ceil((endRowIndex + 1) / 10) * 10;
            getBlogs(0, totalPostToFetch);
            setRequestStatus('loading');
            return;
        }
        // first time we are expecting to be more then 5 rows
        if (
            // (endRowIndex + RowMargin) % 10 === 0 &&
            endRowIndex + RowMargin >=
            postLoadedCount // this condition is bcz we want to load new post on in scroll bottom
            // here offset is the last index at which post has been loaded.
        ) {
            getBlogs(postLoadedCount);
            console.log(params);
            setRequestStatus('loadingPosts');
        }
    };

    const handleOnScroll = (scrollTop) => {
        localStorage.setItem('scrollTop', scrollTop);
    };

    const getLastScrollPos = () => {
        const lastScroll = localStorage.getItem('scrollTop');
        if (!lastScroll) {
            return 0;
        }
        return parseInt(lastScroll);
    };

    const noContent = () => {
        return <div className="content-shimmer noContent"></div>;
    };

    return (
        <div className="container">
            <VirtualRows
                height={800}
                onRowRenderedUpdate={attemptLoadingNewPosts}
                rowCount={blogs.length}
                rowHeight={160}
                rowRenderer={cellRenderer}
                scrollToRow={0}
                scrollTop={getLastScrollPos()}
                noContent={noContent}
                onScroll={handleOnScroll}
            />
            {requestStatus === 'loadingPosts' && (
                <div className="loader" id="loader-2">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            )}
        </div>
    );
}

export default App;
