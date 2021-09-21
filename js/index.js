const nextPieceElement = document.querySelector('#next-piece');
nextPieceElement.style.height = `${CELL_SIZE*2}px`;
nextPieceElement.style.width = `${CELL_SIZE*4}px`;

const Game = {
    started: false,
    paused: true,
    fieldElement: document.querySelector('#game-field'),
    map: new GameMap(),
    gameInterval: null,
    currentSpeed: 1.25,
    currentFigure: null,
    _nextFigureNumber: null,
    set nextFigure(number) {
        this._nextFigureNumber = number;
        nextPieceElement.innerHTML = '';
        getFigureByNumber(number, nextPieceElement, false);
    },
    get nextFigure() {
        return this._nextFigureNumber;
    },
    start() {
        this.started = true;
        this.paused = false;
        step();
        this.gameInterval = setInterval(step, 1000/this.currentSpeed);
    },
    pause() {
        this.paused = true;
        clearInterval(this.gameInterval);
    },
    reset() {
        this.pause();
        this.started = false;
        this.currentFigure = null;
        this._nextFigureNumber = null;
        this.currentSpeed = 1;
    },
    updateNextFigure() {

    }
};


Game.fieldElement.style = `
    width: ${FIELD_WIDTH * CELL_SIZE}px;
    height: ${FIELD_HEIGHT * CELL_SIZE}px;
    background-size: ${CELL_SIZE}px ${CELL_SIZE}px
`;






function step() {
    if (!Game.currentFigure && !Game.nextFigureNumber) {
        // Very first step
        Game.nextFigure = getRandomFigureNumber();
        Game.currentFigure = getFigureByNumber(getRandomFigureNumber(), Game.fieldElement);
    } else if (!Game.currentFigure && Game.nextFigureNumber) {
        // Generate next piece
        Game.currentFigure = getFigureByNumber(Game.nextFigure, Game.fieldElement);
        Game.nextFigure = getRandomFigureNumber();
    } else {
        // Drop current piece
        Game.currentFigure.cellDown();

    }
}