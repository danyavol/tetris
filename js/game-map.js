class GameMap {

    constructor() {
        this.map = {};
    }

    isCellOutOfBorder(x, y) {
        if (x < 0 || y < 0 || x > FIELD_WIDTH-1 || y > FIELD_HEIGHT-1) return true;
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

    _getCellName(x, y) {
        return x + 'x' + y;
    }

} 