const FIGURES_PATH = './img/';
const FIELD_WIDTH = 10;
const FIELD_HEIGHT = 20;
const CELL_SIZE = getCellSize();

function getCellSize() {
    const max_size = (document.documentElement.clientWidth - 26) / FIELD_WIDTH;
    if (document.documentElement.clientWidth < 600) {
        // Mobile
        const size = Math.floor( (document.documentElement.clientHeight - 155) / (FIELD_HEIGHT + 2) )-1;
        return size > max_size ? max_size : size;
    }
    return Math.floor( (document.documentElement.clientHeight - 20) / FIELD_HEIGHT );
}