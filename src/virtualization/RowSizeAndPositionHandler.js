class RowSizeAndPositionHandler {
    constructor({ rowHeight, rowCount }) {
        this._rowCount = rowCount;
        this._rowSize = rowHeight;
    }

    getTotalSize() {
        return this._rowCount * this._rowSize;
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
        if (offset > maxOffset) {
            return this._rowCount - 1;
        }
        // Math.floor bcz we want to show the partial rows
        // which is the row before.
        return Math.floor(offset / this._rowSize);
    }

    getOffsetOfRow(index) {
        return this._rowSize * index;
    }

    // binarySearch(high, low, offset){
    //     while(low <= high){
    //         const middle = low + Math.floor((high - low) / 2);

    //     }
    // }
}

export default RowSizeAndPositionHandler;
