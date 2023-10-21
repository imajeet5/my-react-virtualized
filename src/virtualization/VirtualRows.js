import { useEffect, useRef, useState } from "react";
import RowSizeAndPositionHandler from "./RowSizeAndPositionHandler";


let isFirstRender = true;

const VirtualRows = ({
    rowRenderer,
    height,
    rowHeight,
    scrollToRow,
    rowCount,
    onRowRenderedUpdate,
    scrollTop = 0,
    noContent
}) => {


    const rowManager = useRef(new RowSizeAndPositionHandler({rowHeight, rowCount}));
    const [visibleRowIndices,setVisibleRowIndices] = useState(rowManager.current.getCellRangeInViewPort({offset:scrollTop, viewPortSize:height}));
    const containerRef = useRef(null);
    // const isFirstRender = useRef(true);
    if(isFirstRender){
        isFirstRender = false;
        // initiall we just want to the row range, even though they are not in viewport
        // just to get the end range where we have to fetch the blogs
        onRowRenderedUpdate(rowManager.current.getCellRangeInViewPortUnsafe({offset:scrollTop, viewPortSize:height}));
    }
  

    useEffect(() => {
          if(rowCount > 0){
            rowManager.current = new RowSizeAndPositionHandler({rowHeight, rowCount})
            setVisibleRowIndices(rowManager.current.getCellRangeInViewPort({offset:containerRef.current.scrollTop, viewPortSize: height}))
        }        
    },[ rowHeight, rowCount])

    

    const handleGridScroll = (event) => {
        const {startRowIndex, endRowIndex} = rowManager.current.getCellRangeInViewPort({offset:event.target.scrollTop, viewPortSize:height});
        if(visibleRowIndices.startRowIndex !== startRowIndex || visibleRowIndices.endRowIndex !== endRowIndex){
            setVisibleRowIndices({startRowIndex, endRowIndex});
            onRowRenderedUpdate({startRowIndex, endRowIndex})
        }
    }


    const calculateRowToRender = (start, end) => {
        let childRows = [];
        if((start === 0 && end === 0)){
            return childRows;
        }
        let offset = rowManager.current.getOffsetOfRow(start);
        for (let i = start; i <= end; i++) {
            let style = {
                position: 'absolute',
                height: rowHeight,
                top: offset,
                left: 0,
            };
            offset += rowHeight;
            let row = rowRenderer(i, style);
            childRows.push(row);
        }
      
        return childRows;
    };

    const totalRowHeight = rowHeight * rowCount;
    const containerStyles = {
        height: height,
        width: '100%',
        overflowY: 'scroll',
        background:'white',
        border:'1px solid black',
        borderRadius:'15px',
        boxShadow:'3px 3px 10px 1px'
    };
    const scrollContainer = {
        width: '100%',
        height: totalRowHeight,
        maxHeight: totalRowHeight,
        overflow: 'hidden',
        position: 'relative',
    };
    const {startRowIndex, endRowIndex} = visibleRowIndices;
    return (
        <div style={containerStyles} onScroll={handleGridScroll} ref={containerRef}>
            {rowCount === 0 && noContent()}
            <div style={scrollContainer}>{calculateRowToRender(startRowIndex, endRowIndex)}</div>
        </div>
    );
};

export default VirtualRows;
