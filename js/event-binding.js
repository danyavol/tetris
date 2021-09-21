if (document.documentElement.clientWidth < 600) {
    document.getElementById('mobile-menu').classList.remove('hidden');
}

/*************** Game controls ***************/

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
        }
});

document.getElementById('control-btn-left').addEventListener('click', () => {
    if (!Game.paused && Game.currentFigure) Game.currentFigure.moveLeft();
});

document.getElementById('control-btn-right').addEventListener('click', () => {
    if (!Game.paused && Game.currentFigure) Game.currentFigure.moveRight();
});

document.getElementById('control-btn-rotate').addEventListener('click', () => {
    if (!Game.paused && Game.currentFigure) Game.currentFigure.rotate();
});

document.getElementById('control-btn-down').addEventListener('click', () => {
    
});

/*************** Game state ***************/

document.querySelectorAll('.game-control-btn, .mobile-pause').forEach(elem => elem.addEventListener('click', () => {
    if (Game.paused) {
        document.querySelectorAll('.game-control-btn').forEach(elem => elem.innerText = 'Pause');
        document.getElementById('mobile-menu').classList.add('hidden');
        
        if (document.documentElement.clientWidth < 600) setTimeout(() => Game.start(), 400);
        else Game.start();
    } else {
        document.querySelectorAll('.game-control-btn').forEach(elem => elem.innerText = 'Resume');
        
        if (document.documentElement.clientWidth < 600) 
            document.getElementById('mobile-menu').classList.remove('hidden');

        Game.pause();
    }

    if (Game.started) {
        document.querySelectorAll('.restart-btn').forEach(elem => elem.classList.remove('d-none'));
    } else {
        document.querySelectorAll('.restart-btn').forEach(elem => elem.classList.add('d-none'));
    }
}));

document.querySelectorAll('.restart-btn').forEach(elem => elem.addEventListener('click', () => {
    if (Game.paused)
        document.querySelectorAll('.game-control-btn').forEach(elem => elem.innerText = 'Pause');
        
    document.getElementById('mobile-menu').classList.add('hidden');
    Game.reset();

    if (document.documentElement.clientWidth < 600) setTimeout(() => Game.start(), 400);
    else Game.start();
}));

