const Stats = {
    init() {
        this.score.reset();
        this.time.reset();
    },
    score: {
        get score() {
            return this._score;
        },
        _scoreElement: document.getElementById('stats-scrore'),
        add(num) {
            this._score += num;
            this._render();
        },
        reset() {
            this._score = 0;
            this._render();
        },
        _render() {
            this._scoreElement.innerText = this._score;
        }
    },
    time: {
        _timeElement: document.getElementById('stats-time'),
        reset() {
            this._timeTotal = 0;
            this._timeStart = 0;
            this._timePaused = true;
            this._timeElement.innerText = '';
        },
        start() {
            this._timePaused = false;
            this._timeStart = new Date().getTime();
            this._render();
            
            this._interval = setInterval(() => {
                let timeEnd = new Date().getTime();
                this._timeTotal += timeEnd - this._timeStart;
                this._timeStart = timeEnd;
                this._render();
            }, 1000);
        },
        pause() {
            this._timePaused = true;

            clearInterval(this._interval);
            let timeEnd = new Date().getTime();
            this._timeTotal += timeEnd - this._timeStart;
            this._render;
        },
        _render() {
            let timeStr = this._getTimeString(this._timeTotal);
            this._timeElement.innerText = timeStr;
        },
        _getTimeString(time) {
            let mins = Math.floor(time / (1000 * 60));
            let seconds = Math.floor((time - (mins * 60 * 1000)) / 1000);
            
            return `${mins < 10 ? '0'+mins : mins}:${seconds < 10 ? '0'+seconds : seconds}`;
        }
    }
}

Stats.init();

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
    speed: 1.25,
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
        Stats.time.start();
    },
    pause() {
        this.paused = true;
        this._stopInterval();
        Stats.time.pause();
    },
    reset() {
        this.pause();
        this.started = false;
        this.currentFigure = null;
        this._nextFigureNumber = null;
        this.currentSpeed = 1.25;
        this.speed = 1.25;
        this.map = new GameMap();
        this._clearElement(this.fieldElement);
        this._clearElement(this.nextPieceElement);
        Stats.time.reset();
        Stats.score.reset();
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

            switch (completedLines.length) {
                case 4: Stats.score.add(15); break;
                case 3: Stats.score.add(7); break;
                case 2: Stats.score.add(3); break;
                default: Stats.score.add(1);
            }
            this.increseSpeed();
            return;
        }

        this.currentFigure = getFigureByNumber(this.nextFigure, this.fieldElement);
        this.nextFigure = getRandomFigureNumber();
    },
    increseSpeed() {
        this.speed = 1.25 + Math.floor(Stats.score.score / 8);
    },
    sideMoveStart(direction) {
        this.movementDirection = direction;

        if (!this.movementInterval) {
            this._move();
            this.movementInterval = setInterval(() => this._move(), 130);
        }
    },
    sideMoveEnd() {
        clearInterval(this.movementInterval);
        this.movementInterval = null;
    },
    _move() {
        if (this.currentFigure && !this.paused) {
            if (this.movementDirection == 'left')
                this.currentFigure.moveLeft();
            else if (this.movementDirection == 'right')
                this.currentFigure.moveRight();
        } 
    },
    fastDropStart() {
        if (!this.paused && !this.fastDropActive) {
            this.fastDropActive = true;
            this.currentSpeed = 12;

            if (this.gameInterval) {
                this._stopInterval();
                this._startInterval();
            }
        }
    },
    fastDropEnd() {
        if (!this.paused && this.fastDropActive) {
            this.fastDropActive = false;
            this.currentSpeed = this.speed;

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
    if (!Game.currentFigure && !Game.nextFigure) {
        // Very first step
        Game.nextFigure = getRandomFigureNumber();
        Game.currentFigure = getFigureByNumber(getRandomFigureNumber(), Game.fieldElement);
    } else if (!Game.currentFigure && Game.nextFigure) {
        // Generate next piece
        Game.currentFigure = getFigureByNumber(Game.nextFigure, Game.fieldElement);
        Game.nextFigure = getRandomFigureNumber();
    } else {
        // Drop current piece
        Game.currentFigure.cellDown();

    }
}