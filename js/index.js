const Game = {
    started: false,
    paused: true,
    fieldElement: document.querySelector('#game-field'),
    nextPieceElement: document.querySelector('#next-piece'),
    map: new GameMap(),
    gameInterval: null,
    prevSpeed: null,
    fastDropActive: false,
    currentSpeed: 1.25,
    currentFigure: null,
    _nextFigureNumber: null,
    set nextFigure(number) {
        this._nextFigureNumber = number;
        this.nextPieceElement.innerHTML = '';
        getFigureByNumber(number, this.nextPieceElement, false);
    },
    get nextFigure() {
        return this._nextFigureNumber;
    },
    start() {
        this.started = true;
        this.paused = false;
        this._startInterval();
    },
    pause() {
        this.paused = true;
        this._stopInterval();
    },
    reset() {
        this.pause();
        this.started = false;
        this.currentFigure = null;
        this._nextFigureNumber = null;
        this.currentSpeed = 1;
        this.map = new GameMap();
        this._clearElement(this.fieldElement);
        this._clearElement(this.nextPieceElement);
    },
    generateNextFigure() {
        this.map.addFigure(this.currentFigure);

        const completedLines = this.map.getCompletedLines();

        if (completedLines) {
            this.map.destroyCompletedLines(completedLines);

            this.currentFigure = null;
            this._stopInterval();

            setTimeout(() => {
                this.currentFigure = getFigureByNumber(this.nextFigure, this.fieldElement);
                this.nextFigure = getRandomFigureNumber();
                this._startInterval();
            }, 1000);
            return;
        }

        this.currentFigure = getFigureByNumber(this.nextFigure, this.fieldElement);
        this.nextFigure = getRandomFigureNumber();
    },
    fastDropStart() {
        if (!this.paused && !this.fastDropActive) {
            this.fastDropActive = true;
            this.prevSpeed = this.currentSpeed;
            this.currentSpeed = 15;

            if (this.gameInterval) {
                this._stopInterval();
                this._startInterval();
            }
        }
    },
    fastDropEnd() {
        if (!this.paused && this.fastDropActive) {
            this.fastDropActive = false;
            this.currentSpeed = this.prevSpeed;
            this.prevSpeed = null;

            if (this.gameInterval) {
                this._stopInterval();
                this._startInterval();
            }
        }
    },
    _stopInterval() {
        clearInterval(this.gameInterval);
        this.gameInterval = null;
    },
    _startInterval() {
        if (!this.gameInterval) {
            step();
            this.gameInterval = setInterval(step, 1000/this.currentSpeed);
        }
    },
    _clearElement(element) {
        while (element.firstChild) 
            element.removeChild(element.firstChild);
    }
};


Game.fieldElement.style = `
    width: ${FIELD_WIDTH * CELL_SIZE}px;
    height: ${FIELD_HEIGHT * CELL_SIZE}px;
    background-size: ${CELL_SIZE}px ${CELL_SIZE}px
`;
Game.nextPieceElement.style.height = `${CELL_SIZE*2}px`;
Game.nextPieceElement.style.width = `${CELL_SIZE*4}px`;






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