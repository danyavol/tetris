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
            this._render();
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

const Game = {
    gameFieldElem: document.querySelector('#game-field'),
    nextPieceElem: document.querySelector('#next-piece'),

    reset() {
        this.flags = {
            started: false,
            paused: true,
            fastDropActive: false
        };
        this.map = new GameMap();
        this.speed = 1;
        this.currentSpeed = 1;
        this.currentFigure = null;
        this.nextFigureNumber = null;
        this.gameLoop = null;
        this.pressedSideButtons = [];
        this.movementInterval = null;
        this._clearElement(this.gameFieldElem);
        this._clearElement(this.nextPieceElem);
        Stats.init();
    },

    start() {
        this.flags.started = true;
        this.flags.paused = false;
        this._startGameLoop();
        Stats.time.start();
    },

    pause() {
        this.flags.paused = true;
        this._stopGameLoop();
        Stats.time.pause();
    },

    gameOver() {
        this.flags.started = false;
        this.pause();
        DOM.START_PAUSE_BTNS.forEach(elem => elem.classList.add('d-none'));
        DOM.RESTART_BTNS.forEach(elem => elem.classList.remove('d-none'));
        if (isMobileDevice()) DOM.MOBILE_MENU.classList.remove('hidden');
    },

    generateNewFigure() {
        this.map.addFigure(this.currentFigure);

        const completedLines = this.map.getCompletedLines();
        if (completedLines) {
            this.currentFigure = null;
            this._stopGameLoop();
            this.map.destroyCompletedLines(completedLines);
            this._updateScore(completedLines);
            this._updateSpeed();

            setTimeout(() => this._startGameLoop(), 1000);
        } else {
            this.currentFigure = null;
            this._step();
        }
    },

    _step() {
        if (this.nextFigureNumber == null) 
            this.nextFigureNumber = getRandomFigureNumber();

        if (this.currentFigure == null) {
            this.currentFigure = getFigureByNumber(this.nextFigureNumber, this.gameFieldElem);

            this.nextFigureNumber = getRandomFigureNumber();
            this._clearElement(this.nextPieceElem);
            getFigureByNumber(this.nextFigureNumber, this.nextPieceElem, false);
            return;
        }

        this.currentFigure.cellDown();
    },



    // Helpers

    _startGameLoop() {
        if (!this.gameLoop) {
            this._step();
            this.gameLoop = setInterval(() => this._step(), 1000/this.currentSpeed);
        }
    },

    _stopGameLoop() {
        clearInterval(this.gameLoop);
        this.gameLoop = null;
    },

    _updateScore(completedLines) {
        if (completedLines)
            switch (completedLines.length) {
                case 4: Stats.score.add(15); break;
                case 3: Stats.score.add(7); break;
                case 2: Stats.score.add(3); break;
                default: Stats.score.add(1);
            }
    },

    _updateSpeed() {
        const newSpeed = 1 + Math.floor(Stats.score.score / 5)*0.5;
        console.log('speed up', newSpeed);
        if (this.currentSpeed === this.speed) 
            this.currentSpeed = newSpeed;
        this.speed = newSpeed;
    },

    _clearElement(element) {
        while (element.firstChild) 
            element.removeChild(element.firstChild);
    },



    // Movement

    sideMoveStart(direction) {
        if (this.pressedSideButtons.indexOf(direction) == -1)
            this.pressedSideButtons.push(direction);

        if (this.movementInterval == null) {
            this._sideMove();
            this.movementInterval = setInterval(() => this._sideMove(), 130);
        }
    },

    sideMoveEnd(direction) {
        if (this.pressedSideButtons.length == 1) {
            this.pressedSideButtons = [];
            clearInterval(this.movementInterval);
            this.movementInterval = null;
        }
        else if (this.pressedSideButtons.length == 2) {
            let i = this.pressedSideButtons.indexOf(direction);
            if (i == 0) this.pressedSideButtons = [ this.pressedSideButtons[1] ];
            else if (i == 1) this.pressedSideButtons = [ this.pressedSideButtons[0] ];
        }
    },

    _sideMove() {
        const pb = this.pressedSideButtons;
        const direction = pb.length ? pb[pb.length-1] : null;
        if (this.currentFigure && !this.flags.paused && direction) {
            if (direction == 'left')
                this.currentFigure.moveLeft();
            else if (direction == 'right')
                this.currentFigure.moveRight();
        } 
    },

    fastDropStart() {
        if (!this.flags.paused && !this.flags.fastDropActive) {
            this.flags.fastDropActive = true;
            this.currentSpeed = 15;

            if (this.gameLoop) {
                this._stopGameLoop();
                this._startGameLoop();
            }
        }
    },

    fastDropEnd() {
        if (!this.flags.paused && this.flags.fastDropActive) {
            this.flags.fastDropActive = false;
            this.currentSpeed = this.speed;

            if (this.gameLoop) {
                this._stopGameLoop();
                this._startGameLoop();
            }
        }
    },
    
    
};


Game.gameFieldElem.style = `
    width: ${FIELD_WIDTH * CELL_SIZE}px;
    height: ${FIELD_HEIGHT * CELL_SIZE}px;
    background-size: ${CELL_SIZE}px ${CELL_SIZE}px
`;
Game.nextPieceElem.style.height = `${CELL_SIZE*2}px`;
Game.nextPieceElem.style.width = `${CELL_SIZE*4}px`;


Game.reset();