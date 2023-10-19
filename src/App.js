import { useEffect, useRef, useState } from 'react';
import './App.css';
import fetchBlogs from './fetchBlogs';
import { Grid } from 'react-virtualized';
function App() {
    const [blogs, setBlogs] = useState([]);
    const [requestStatus, setRequestStatus] = useState('loading');
    const observerTarget = useRef(null);
    const [offset, setOffset] = useState(0);

    useEffect(() => {
        const getBlogs = async () => {
            try {
                // initiall we fetch 10 row then we fetch 5 rows
                let fetchCount = offset > 0 ? 5 : 10;
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

    const cellRenderer = ({ columnIndex, key, rowIndex, style }) => {
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
        const { rowStopIndex } = params;
        // first time we are expecting to be more then 5 rows
        if (
            rowStopIndex > 5 &&
            (rowStopIndex + 2) % 5 === 0 &&
            rowStopIndex + 2 > offset &&
            !requestStatus.includes('loading')
        ) {
            setOffset(rowStopIndex + 2);
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
        // content = blogs.map(blog => {
        //     return <div key={blog.id} className='blogContainer'>
        //       <h2>{blog.id}-{blog.title}</h2>
        //       <p>{blog.content_text.substring(0, 320)}...</p>

        //     </div>
        // })

        content = (
            <Grid
                cellRenderer={cellRenderer}
                columnWidth={window.innerWidth - 20}
                columnCount={1}
                height={800}
                noContentRenderer={noContent}
                overscanColumnCount={0}
                overscanRowCount={0}
                rowHeight={160}
                rowCount={blogs.length}
                scrollToColumn={0}
                scrollToRow={0}
                width={window.innerWidth}
                onSectionRendered={attemptLoadingNewPosts}
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
