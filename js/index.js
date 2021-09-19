const gameFieldElement = document.querySelector('#game-field');
const nextPieceElement = document.querySelector('#next-piece');
nextPieceElement.style.height = `${CELL_SIZE*2}px`;
nextPieceElement.style.width = `${CELL_SIZE*4}px`;
const gameMap = new GameMap();
let currentFigure = null;


gameFieldElement.style = `
    width: ${FIELD_WIDTH * CELL_SIZE}px;
    height: ${FIELD_HEIGHT * CELL_SIZE}px;
    background-size: ${CELL_SIZE}px ${CELL_SIZE}px
`;


currentFigure = new LFigure(gameFieldElement);

new OFigure(nextPieceElement, false);




document.addEventListener('keydown', (e) => {
    switch (e.code) {
        case 'ArrowUp':
            if (currentFigure) currentFigure.rotate();
            break;
        case 'ArrowRight':
            break;
        case 'ArrowLeft':
            break;
        case 'ArrowDown':
            break;
        case 'Space':
            break;
    }
});

