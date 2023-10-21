import { useEffect, useRef, useState } from 'react';
import './App.css';
import fetchBlogs from './fetchBlogs';
import { Grid } from 'react-virtualized';
import VirtualRows from './virtualization/VirtualRows';

const FetchCount = 10;
const RowMargin = 3;

function App() {
    const [blogs, setBlogs] = useState([]);
    const [requestStatus, setRequestStatus] = useState('');
    const observerTarget = useRef(null);
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
        // if(!blog){
        //     return
        //     // debugger;
        // }
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
        const { endRowIndex, startRowIndex } = params;
        if (requestStatus.includes('loading')) {
            return;
        }
        if (postLoadedCount === 0) {
            //this means not post is loaded yet
            // what we do over here is what ever the page is we load that number of post
            // 14 is the endRowIndex
            const totalPostToFetch = Math.ceil(endRowIndex / 10) * 10;
            getBlogs(0, totalPostToFetch);
            setRequestStatus('loading');
            return;
        }
        // first time we are expecting to be more then 5 rows
        if (
            (endRowIndex + RowMargin) % 10 === 0 &&
            endRowIndex + RowMargin >= postLoadedCount // this condition is bcz we want to load new post on in scroll bottom
            // here offset is the last index at which post has been loaded.
        ) {
            getBlogs(postLoadedCount);
            console.log(params);
            setRequestStatus('loadingPosts');
        }
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
                scrollTop={1440}
                noContent={noContent}
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
