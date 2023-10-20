import { useEffect, useRef, useState } from "react";
import RowSizeAndPositionHandler from "./RowSizeAndPositionHandler";

const VirtualRows = ({
    rowRenderer,
    height,
    rowHeight,
    scrollToRow,
    rowCount,
    onRowRenderedUpdate,
    scrollTop = 0
}) => {


    const rowManager = useRef(new RowSizeAndPositionHandler({rowHeight, rowCount}));
    const [visibleRowIndices,setVisibleRowIndices] = useState(rowManager.current.getCellRangeInViewPort({offset:scrollTop, viewPortSize:height}));
    const containerRef = useRef(null);
  

    useEffect(() => {
        if(rowCount > 10){
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
            <div style={scrollContainer}>{calculateRowToRender(startRowIndex, endRowIndex)}</div>
        </div>
    );
};

export default VirtualRows;
