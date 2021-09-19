const FIGURES_PATH = './img/';
const FIELD_WIDTH = 10;
const FIELD_HEIGHT = 20;
const CELL_SIZE = getCellSize();

function getCellSize() {
    if (document.documentElement.clientWidth < 600) {
        // Mobile
        return ((document.documentElement.clientHeight - 20 - 200) / FIELD_HEIGHT).toFixed();
    }
    return ((document.documentElement.clientHeight - 20) / FIELD_HEIGHT).toFixed();
}