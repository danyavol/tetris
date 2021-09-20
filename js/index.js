const nextPieceElement = document.querySelector('#next-piece');
nextPieceElement.style.height = `${CELL_SIZE*2}px`;
nextPieceElement.style.width = `${CELL_SIZE*4}px`;

const Game = {
    paused: true,
    fieldElement: document.querySelector('#game-field'),
    map: new GameMap(),
    gameInterval: null,
    currentSpeed: 1,
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
        this.paused = false;
        this.gameInterval = setInterval(step, 1000/this.currentSpeed);
    },
    stop() {
        this.paused = true;
        clearInterval(this.gameInterval);
    },
    updateNextFigure() {

    }
};


Game.fieldElement.style = `
    width: ${FIELD_WIDTH * CELL_SIZE}px;
    height: ${FIELD_HEIGHT * CELL_SIZE}px;
    background-size: ${CELL_SIZE}px ${CELL_SIZE}px
`;










document.addEventListener('keydown', (e) => {
    if (!Game.paused && Game.currentFigure)
        switch (e.code) {
            case 'ArrowUp':
                Game.currentFigure.rotate();
                break;
            case 'ArrowRight':
                Game.currentFigure.moveRight();
                break;
            case 'ArrowLeft':
                Game.currentFigure.moveLeft();
                break;
            case 'ArrowDown':
                break;
            case 'Space':
                break;
        }
});

document.getElementById('new-game-btn').addEventListener('click', () => {
    Game.start();
});

document.getElementById('pause-btn').addEventListener('click', () => {
    Game.stop();
});

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

function getRandomFigure(...args) {
    
}



