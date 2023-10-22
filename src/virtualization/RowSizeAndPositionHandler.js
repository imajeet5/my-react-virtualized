class RowSizeAndPositionHandler {
    constructor({ rowHeight, rowCount }) {
        this._rowCount = rowCount;
        this._rowSize = rowHeight;
    }

    getTotalSize() {
        return this._rowCount * this._rowSize;
    }


    // this function will return the cell range even if it is not present in the viewport 
    // and the grid. Useful for initial rendering the grid.
    getCellRangeInViewPortUnsafe({ offset, viewPortSize }){
        const maxOffset = offset + viewPortSize;
        const startRowIndex = this.findCellAtOffsetUnsafe(offset);
        let endRowIndex = this.findCellAtOffsetUnsafe(maxOffset);

        return {
            startRowIndex,
            endRowIndex,
        };
    }

    getCellRangeInViewPort({ offset, viewPortSize }) {
        const maxOffset = offset + viewPortSize;
        const startRowIndex = this.findCellAtOffset(offset);
        let endRowIndex = this.findCellAtOffset(maxOffset);

        return {
            startRowIndex,
            endRowIndex,
        };
    }

    findCellAtOffset(offset) {
        const maxOffset = this.getTotalSize() - this._rowSize;
        if(this._rowCount === 0 || offset === 0){
            return 0;
        }
        if (offset > maxOffset) {
            return this._rowCount - 1;
        }
        // Math.floor bcz we want to show the partial rows
        // which is the row before.
        return Math.floor(offset / this._rowSize);
    }

    findCellAtOffsetUnsafe(offset){
        return Math.floor(offset / this._rowSize);
    }

    getOffsetOfRow(index) {
        return this._rowSize * index;
    }
}

export default RowSizeAndPositionHandler;
