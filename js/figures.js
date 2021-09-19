/*************** Basic Classes ***************/

class BasicFigure {
    
    constructor(defaultRotation, rotationConfig) {
        this.rotation = defaultRotation;
        this.rotationConfig = rotationConfig;
        this.pieces = [];
    }

    rotate() {
        /** Update pieces position */
        const conf = this.rotationConfig[this.rotation];
        this.pieces.forEach( (piece, i) => piece.adjustPosition(...conf[i]) );


        /** Update pieces rotation */
        if (this.rotation < 3) this.rotation++;
        else this.rotation = 0;
        this.pieces.forEach(piece => piece.rotation = this.rotation);


        // TODO: Check if piece not out of border or not cross other pieces

        this.render();
    }

    render() {
        this.pieces.forEach(piece => piece.render());
    }
    
}

class BasicPiece {
    constructor(x, y, imgName, rotation) {
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
        gameFieldElement.appendChild(this.element);
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

/*************** Common Figures ***************/


class OFigure extends BasicFigure {
    constructor() {
        const defaultRotation = 0;
        const rotationConfig = [
            [ [1, 0], [0, 1], [0, -1], [-1, 0] ],
            [ [0, 1], [-1, 0], [1, 0], [0, -1] ],
            [ [-1, 0], [0, -1], [0, 1], [1, 0] ],
            [ [0, -1], [1, 0], [-1, 0], [0, 1] ]
        ];

        super(defaultRotation, rotationConfig);

        this.initPieces();
        super.render();
    }

    initPieces() {
       this.pieces = [
            new BasicPiece(4, 1, 'O0.png', this.rotation),
            new BasicPiece(5, 1, 'O1.png', this.rotation),
            new BasicPiece(4, 2, 'O2.png', this.rotation),
            new BasicPiece(5, 2, 'O3.png', this.rotation)
       ];
    }

}

class IFigure extends BasicFigure {
    constructor() {
        const defaultRotation = 3;
        const rotationConfig = [
            [ [1, 2], [0, 1], [-1, 0], [-2, -1] ],
            [ [-2, 1], [-1, 0], [0, -1], [1, -2] ],
            [ [-1, -2], [0, -1], [1, 0], [2, 1] ],
            [ [2, -1], [1, 0], [0, 1], [-1, 2] ]
        ];

        super(defaultRotation, rotationConfig);

        this.initPieces();
        super.render();
    }

    initPieces() {
       this.pieces = [
            new BasicPiece(3, 1, 'I0.png', this.rotation),
            new BasicPiece(4, 1, 'I1.png', this.rotation),
            new BasicPiece(5, 1, 'I2.png', this.rotation),
            new BasicPiece(6, 1, 'I3.png', this.rotation)
       ];
    }

}

class TFigure extends BasicFigure {
    constructor() {
        const defaultRotation = 3;
        const rotationConfig = [
            [ [1, 1], [0, 0], [-1, 1], [-1, -1] ],
            [ [-1, 1], [0, 0], [-1, -1], [1, -1] ],
            [ [-1, -1], [0, 0], [1, -1], [1, 1] ],
            [ [1, -1], [0, 0], [1, 1], [-1, 1] ]
        ];

        super(defaultRotation, rotationConfig);

        this.initPieces();
        super.render();
    }

    initPieces() {
       this.pieces = [
            new BasicPiece(3, 1, 'T0.png', this.rotation),
            new BasicPiece(4, 1, 'T1.png', this.rotation),
            new BasicPiece(4, 0, 'T2.png', this.rotation),
            new BasicPiece(5, 1, 'T3.png', this.rotation)
       ];
    }

}

class SFigure extends BasicFigure {
    constructor() {
        const defaultRotation = 3;
        const rotationConfig = [
            [ [1, 1], [0, 0], [-1, 1], [-2, 0] ],
            [ [-1, 1], [0, 0], [-1, -1], [0, -2] ],
            [ [-1, -1], [0, 0], [1, -1], [2, 0] ],
            [ [1, -1], [0, 0], [1, 1], [0, 2] ]
        ];

        super(defaultRotation, rotationConfig);

        this.initPieces();
        super.render();
    }

    initPieces() {
       this.pieces = [
            new BasicPiece(3, 1, 'S0.png', this.rotation),
            new BasicPiece(4, 1, 'S1.png', this.rotation),
            new BasicPiece(4, 0, 'S2.png', this.rotation),
            new BasicPiece(5, 0, 'S3.png', this.rotation)
       ];
    }

}

class ZFigure extends BasicFigure {
    constructor() {
        const defaultRotation = 3;
        const rotationConfig = [
            [ [0, 2], [0, 0], [-1, 1], [-1, -1] ],
            [ [-2, 0], [0, 0], [-1, -1], [1, -1] ],
            [ [0, -2], [0, 0], [1, -1], [1, 1] ],
            [ [2, 0], [0, 0], [1, 1], [-1, 1] ]
        ];

        super(defaultRotation, rotationConfig);

        this.initPieces();
        super.render();
    }

    initPieces() {
       this.pieces = [
            new BasicPiece(3, 0, 'Z0.png', this.rotation),
            new BasicPiece(4, 1, 'Z1.png', this.rotation),
            new BasicPiece(4, 0, 'Z2.png', this.rotation),
            new BasicPiece(5, 1, 'Z3.png', this.rotation)
       ];
    }

}

class JFigure extends BasicFigure {
    constructor() {
        const defaultRotation = 3;
        const rotationConfig = [
            [ [1, 1], [0, 2], [0, 0], [-1, -1] ],
            [ [-1, 1], [-2, 0], [0, 0], [1, -1] ],
            [ [-1, -1], [0, -2], [0, 0], [1, 1] ],
            [ [1, -1], [2, 0], [0, 0], [-1, 1] ]
        ];

        super(defaultRotation, rotationConfig);

        this.initPieces();
        super.render();
    }

    initPieces() {
       this.pieces = [
            new BasicPiece(3, 1, 'J0.png', this.rotation),
            new BasicPiece(3, 0, 'J1.png', this.rotation),
            new BasicPiece(4, 1, 'J2.png', this.rotation),
            new BasicPiece(5, 1, 'J3.png', this.rotation)
       ];
    }

}

class LFigure extends BasicFigure {
    constructor() {
        const defaultRotation = 1;
        const rotationConfig = [
            [ [2, 0], [1, 1], [0, 0], [-1, -1] ],
            [ [0, 2], [-1, 1], [0, 0], [1, -1] ],
            [ [-2, 0], [-1, -1], [0, 0], [1, 1] ],
            [ [0, -2], [1, -1], [0, 0], [-1, 1] ]
        ];
        
        super(defaultRotation, rotationConfig);

        this.initPieces();
        super.render();
    }

    initPieces() {
       this.pieces = [
            new BasicPiece(5, 0, 'L0.png', this.rotation),
            new BasicPiece(5, 1, 'L1.png', this.rotation),
            new BasicPiece(4, 1, 'L2.png', this.rotation),
            new BasicPiece(3, 1, 'L3.png', this.rotation)
       ];
    }

}