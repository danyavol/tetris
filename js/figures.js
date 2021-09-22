/*************** Basic Classes ***************/

class BasicFigure {
    
    constructor(defaultRotation, rotationConfig, piecesConfig, defaultIndent, rootElement, withIndent = true) {
        this.rotation = defaultRotation;
        this.rotationConfig = rotationConfig;
        this.rootElement = rootElement;
        
        this._initPieces(piecesConfig, withIndent ? defaultIndent : [0, 0]);
        this.render();
    }

    rotate() {
        const oldCoords = this._getPiecesCoords();

        let xAdjustment = 0, yAdjustment = 0;

        /** Update pieces position */
        const conf = this.rotationConfig[this.rotation];
        this.pieces.forEach( (piece, i) => {
            piece.adjustPosition(...conf[i]);

            let outOfSideBorder = Game.map.isCellOutOfSideBorder(piece.x);
            if (outOfSideBorder === 'left') {
                piece.x < xAdjustment ? xAdjustment = piece.x : null;
            } else if (outOfSideBorder === 'right') {
                piece.x - FIELD_WIDTH + 1 > xAdjustment ? xAdjustment = piece.x - FIELD_WIDTH + 1 : null;
            }

            if (Game.map.isCellOutOfBottomBorder(piece.y)) {
                piece.y - FIELD_HEIGHT + 1 > yAdjustment ? yAdjustment = piece.y - FIELD_HEIGHT + 1 : null;
            } 
        });

        /** Adjust coords and check if new coords is okay */
        let isNewCoordsOkay = true;
        this.pieces.forEach(piece => {
            piece.adjustPosition(-xAdjustment, -yAdjustment);
            
            if (Game.map.isCellTaken(piece.x, piece.y))
                isNewCoordsOkay = false;
        });

        /** Cannot rotate, applying old coords */
        if (!isNewCoordsOkay) {
            this._applyPiecesCoords(oldCoords);
            return;
        }

        /** Update pieces rotation */
        if (this.rotation < 3) this.rotation++;
        else this.rotation = 0;
        this.pieces.forEach(piece => piece.rotation = this.rotation);

        this.render();
    }

    cellDown() {
        const oldCoords = this._getPiecesCoords();

        let hasDropped = false;
        this.pieces.forEach(piece => {
            if (Game.map.isCellOutOfBottomBorder(++piece.y) || Game.map.isCellTaken(piece.x, piece.y))
                hasDropped = true;
        });

        if (hasDropped) {
            this._applyPiecesCoords(oldCoords);
            Game.generateNextFigure();
            return;
        }
        
        this.render();
    }

    moveRight() {
        const oldCoords = this._getPiecesCoords();
        
        for (let piece of this.pieces) {
            if (Game.map.isCellOutOfSideBorder(++piece.x) || Game.map.isCellTaken(piece.x, piece.y)) {
                this._applyPiecesCoords(oldCoords);
                return;
            }
        }

        this.render();
    }

    moveLeft() {
        const oldCoords = this._getPiecesCoords();

        for (let piece of this.pieces) {
            if (Game.map.isCellOutOfSideBorder(--piece.x) || Game.map.isCellTaken(piece.x, piece.y)) {
                this._applyPiecesCoords(oldCoords);
                return;
            }
        }

        this.render();
    }

    render() {
        this.pieces.forEach(piece => piece.render());
    }

    _getPiecesCoords() {
        const coords = [];
        this.pieces.forEach((piece, i) => 
            coords[i] = {x: piece.x, y: piece.y}
        );
        return coords;
    }

    _applyPiecesCoords(coords) {
        this.pieces.forEach((piece, i) => {
            piece.x = coords[i].x;
            piece.y = coords[i].y;
        });
    }

    _initPieces(piecesConfig, indent) {
        this.pieces = [];
        piecesConfig.forEach(pieceArgs => {
            pieceArgs[0] += indent[0];
            pieceArgs[1] += indent[1];
            this.pieces.push(
                new BasicPiece(...pieceArgs, this.rotation, this.rootElement)
            );
        });
    }
    
}

class BasicPiece {
    constructor(x, y, imgName, rotation, rootElement) {
        this.x = x;
        this.y = y;
        this.rotation = rotation;
        /*
            0 - normal
            1 - right rotated
            2 - upside down rotated
            3 - left rotated
        */
        this.element = document.createElement('img');
        this.element.classList.add('piece');
        this.element.src = FIGURES_PATH + imgName;
        this.element.style.width = `${CELL_SIZE}px`;
        this.element.style.height = `${CELL_SIZE}px`;
        this.element.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            e.stopPropagation();
        });

        rootElement.appendChild(this.element);
    }

    adjustPosition(x = 0, y = 0) {
        this.x += x;
        this.y += y;
    }

    render() {
        this.element.style.top = `${this.y * CELL_SIZE}px`;
        this.element.style.left = `${this.x * CELL_SIZE}px`;
        this.element.style.transform = `rotate(${this.rotation*90}deg)`;
    }
    
}

function randomInteger(min, max) {
    const rand = min + Math.random() * (max + 1 - min);
    return Math.floor(rand);
}

function getRandomFigureNumber() {
    return randomInteger(0, 6);
}

function getFigureByNumber(num, ...params) {
    switch (num) {
        case 0: return new OFigure(...params);
        case 1: return new IFigure(...params);
        case 2: return new TFigure(...params);
        case 3: return new SFigure(...params);
        case 4: return new ZFigure(...params);
        case 5: return new JFigure(...params);
        case 6: return new LFigure(...params);
    }
}

/*************** Common Figures ***************/

class OFigure extends BasicFigure {
    constructor(...args) {
        const defaultRotation = 0;
        const rotationConfig = [
            [ [1, 0], [0, 1], [0, -1], [-1, 0] ],
            [ [0, 1], [-1, 0], [1, 0], [0, -1] ],
            [ [-1, 0], [0, -1], [0, 1], [1, 0] ],
            [ [0, -1], [1, 0], [-1, 0], [0, 1] ]
        ];
        const piecesConfig = [
            [0, 0, 'O0.png'], [1, 0, 'O1.png'], [0, 1, 'O2.png'], [1, 1, 'O3.png']
        ];
        const defaultIndent = [4, 1];

        super(defaultRotation, rotationConfig, piecesConfig, defaultIndent, ...args);
    }
}

class IFigure extends BasicFigure {
    constructor(...args) {
        const defaultRotation = 3;
        const rotationConfig = [
            [ [1, 2], [0, 1], [-1, 0], [-2, -1] ],
            [ [-2, 1], [-1, 0], [0, -1], [1, -2] ],
            [ [-1, -2], [0, -1], [1, 0], [2, 1] ],
            [ [2, -1], [1, 0], [0, 1], [-1, 2] ]
        ];
        const piecesConfig = [
            [0, 0, 'I0.png'], [1, 0, 'I1.png'], [2, 0, 'I2.png'], [3, 0, 'I3.png']
        ];
        const defaultIndent = [3, 1];

        super(defaultRotation, rotationConfig, piecesConfig, defaultIndent, ...args);
    }
}

class TFigure extends BasicFigure {
    constructor(...args) {
        const defaultRotation = 3;
        const rotationConfig = [
            [ [1, 1], [0, 0], [-1, 1], [-1, -1] ],
            [ [-1, 1], [0, 0], [-1, -1], [1, -1] ],
            [ [-1, -1], [0, 0], [1, -1], [1, 1] ],
            [ [1, -1], [0, 0], [1, 1], [-1, 1] ]
        ];
        const piecesConfig = [
            [0, 1, 'T0.png'], [1, 1, 'T1.png'], [1, 0, 'T2.png'], [2, 1, 'T3.png']
        ];
        const defaultIndent = [3, 0];

        super(defaultRotation, rotationConfig, piecesConfig, defaultIndent, ...args);
    }
}

class SFigure extends BasicFigure {
    constructor(...args) {
        const defaultRotation = 3;
        const rotationConfig = [
            [ [1, 1], [0, 0], [-1, 1], [-2, 0] ],
            [ [-1, 1], [0, 0], [-1, -1], [0, -2] ],
            [ [-1, -1], [0, 0], [1, -1], [2, 0] ],
            [ [1, -1], [0, 0], [1, 1], [0, 2] ]
        ];
        const piecesConfig = [
            [0, 1, 'S0.png'], [1, 1, 'S1.png'], [1, 0, 'S2.png'], [2, 0, 'S3.png']
        ];
        const defaultIndent = [3, 0];

        super(defaultRotation, rotationConfig, piecesConfig, defaultIndent, ...args);
    }
}

class ZFigure extends BasicFigure {
    constructor(...args) {
        const defaultRotation = 3;
        const rotationConfig = [
            [ [0, 2], [0, 0], [-1, 1], [-1, -1] ],
            [ [-2, 0], [0, 0], [-1, -1], [1, -1] ],
            [ [0, -2], [0, 0], [1, -1], [1, 1] ],
            [ [2, 0], [0, 0], [1, 1], [-1, 1] ]
        ];
        const piecesConfig = [
            [0, 0, 'Z0.png'], [1, 1, 'Z1.png'], [1, 0, 'Z2.png'], [2, 1, 'Z3.png']
        ];
        const defaultIndent = [3, 0];

        super(defaultRotation, rotationConfig, piecesConfig, defaultIndent, ...args);
    }
}

class JFigure extends BasicFigure {
    constructor(...args) {
        const defaultRotation = 3;
        const rotationConfig = [
            [ [1, 1], [0, 2], [0, 0], [-1, -1] ],
            [ [-1, 1], [-2, 0], [0, 0], [1, -1] ],
            [ [-1, -1], [0, -2], [0, 0], [1, 1] ],
            [ [1, -1], [2, 0], [0, 0], [-1, 1] ]
        ];
        const piecesConfig = [
            [0, 1, 'J0.png'], [0, 0, 'J1.png'], [1, 1, 'J2.png'], [2, 1, 'J3.png']
        ];
        const defaultIndent = [3, 0];

        super(defaultRotation, rotationConfig, piecesConfig, defaultIndent, ...args);
    }
}

class LFigure extends BasicFigure {
    constructor(...args) {
        const defaultRotation = 1;
        const rotationConfig = [
            [ [2, 0], [1, 1], [0, 0], [-1, -1] ],
            [ [0, 2], [-1, 1], [0, 0], [1, -1] ],
            [ [-2, 0], [-1, -1], [0, 0], [1, 1] ],
            [ [0, -2], [1, -1], [0, 0], [-1, 1] ]
        ];
        const piecesConfig = [
            [2, 0, 'L0.png'], [2, 1, 'L1.png'], [1, 1, 'L2.png'], [0, 1, 'L3.png']
        ];
        const defaultIndent = [3, 0];
        
        super(defaultRotation, rotationConfig, piecesConfig, defaultIndent, ...args);
    }
}