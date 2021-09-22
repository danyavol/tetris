class GameMap {

    constructor() {
        this.map = {};
    }

    isCellOutOfSideBorder(x) {
        if (x < 0) return 'left';
        if (x > FIELD_WIDTH - 1) return 'right';
        return false;
    }

    isCellOutOfBottomBorder(y) {
        if (y > FIELD_HEIGHT - 1) return true;
        return false;
    }
    
    isCellTaken(x, y) {
        return !!this.map[this._getCellName(x, y)];
    }

    getValidAdjustment(x, y) {
        let newX = x;
        let newY = y;

        if (newX < 0) newX = 0;
        else if (newX > FIELD_WIDTH - 1) newX = FIELD_WIDTH - 1;

        if (newY < 0) newY = 0;
        else if (newY > FIELD_HEIGHT - 1) newY = FIELD_HEIGHT - 1;
        

        return [newX - x, newY - y];
    }

    updatePiecePosition(piece, oldX, oldY) {
        this.map[this._getCellName(piece.x, piece.y)] = piece;
        delete this.map[this._getCellName(oldX, oldY)];
    }

    addFigure(figure) {
        figure.pieces.forEach(piece => {
            this.map[this._getCellName(piece.x, piece.y)] = piece;
        })
    }

    getCompletedLines() {
        const lines = [];
        for (let r = 0; r < FIELD_HEIGHT; r++) {
            let isLineCompleted = true;
            for (let c = 0; c < FIELD_WIDTH; c++) {
                if (!this.isCellTaken(c, r)) 
                    isLineCompleted = false;
            }
            if (isLineCompleted) lines.push(r);
        }
        return lines.length ? lines : null;
    }

    destroyCompletedLines(lines) {
        const elements = [];
        lines.forEach(line => {
            for (let c = 0; c < FIELD_WIDTH; c++) {
                const cellName = this._getCellName(c, line)
                const piece = this.map[cellName];
                delete this.map[cellName];
                piece.element.classList.add('active');
                elements.push(piece.element);
            }
        });
        setTimeout(() => {
            elements.forEach(elem => elem.remove());
            setTimeout(() => this._dropPiecesLower(lines), 350);
        }, 350);
    }

    _dropPiecesLower(lines) {
        let dropCount = 0;
        const linesDropCount = [];
        for (let r = FIELD_HEIGHT-1; r >= 0; r--) {
            if (lines.indexOf(r) != -1) dropCount++;
            linesDropCount[r] = dropCount;
        }

        const newMap = {};
        for (let cellName in this.map) {
            const row = this._getRowNumber(cellName);
            const piece = this.map[cellName];

            piece.y += linesDropCount[row];
            piece.render();

            newMap[this._getCellName(piece.x, piece.y)] = piece;
        }

        this.map = newMap;
    }

    _getRowNumber(cellName) {
        return parseInt(cellName.split('x')[1]);
    }

    _getCellName(x, y) {
        return x + 'x' + y;
    }

} 