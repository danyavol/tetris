if (document.documentElement.clientWidth < 600) {
    document.getElementById('mobile-menu').classList.remove('hidden');
}

window.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    e.stopPropagation();
});

/*************** Game controls ***************/

document.addEventListener('keydown', (e) => {
    switch (e.code) {
        case 'ArrowUp':
            if (!Game.flags.paused && Game.currentFigure) Game.currentFigure.rotate();
            break;
        case 'ArrowRight':
            Game.sideMoveStart('right');
            break;
        case 'ArrowLeft':
            Game.sideMoveStart('left');
            break;
        case 'ArrowDown':
            Game.fastDropStart();
            break;
    }
});

document.addEventListener('keyup', (e) => {
    switch (e.code) {
        case 'ArrowRight':
            Game.sideMoveEnd('right');
            break;
        case 'ArrowLeft':
            Game.sideMoveEnd('left');
            break;
        case 'ArrowDown':
            Game.fastDropEnd();
            break;
    }
});

document.getElementById('control-btn-left').addEventListener('touchstart', () => Game.sideMoveStart('left'));
document.getElementById('control-btn-left').addEventListener('touchend', () => Game.sideMoveEnd('left'));

document.getElementById('control-btn-right').addEventListener('touchstart', () => Game.sideMoveStart('right'));
document.getElementById('control-btn-right').addEventListener('touchend', () => Game.sideMoveEnd('right'));


document.getElementById('control-btn-rotate').addEventListener('click', () => {
    if (!Game.flags.paused && Game.currentFigure) Game.currentFigure.rotate();
});

document.getElementById('control-btn-down').addEventListener('touchstart', () => Game.fastDropStart());
document.getElementById('control-btn-down').addEventListener('touchend', () => Game.fastDropEnd());

/*************** Game state ***************/

document.querySelectorAll('.game-control-btn, .mobile-pause').forEach(elem => elem.addEventListener('click', () => {
    if (Game.flags.paused) {
        DOM.START_PAUSE_BTNS.forEach(elem => elem.innerText = 'Pause');
        DOM.MOBILE_MENU.classList.add('hidden');
        
        if (isMobileDevice()) 
            setTimeout(() => Game.start(), 400);
        else 
            Game.start();
    } else {
        DOM.START_PAUSE_BTNS.forEach(elem => elem.innerText = 'Resume');
        
        if (isMobileDevice()) DOM.MOBILE_MENU.classList.remove('hidden');

        Game.pause();
    }

    if (Game.flags.started) 
        DOM.RESTART_BTNS.forEach(elem => elem.classList.remove('d-none'));
    else 
        DOM.RESTART_BTNS.forEach(elem => elem.classList.add('d-none'));
    
}));

document.querySelectorAll('.restart-btn').forEach(elem => elem.addEventListener('click', () => {
    DOM.START_PAUSE_BTNS.forEach(elem => elem.classList.remove('d-none'));

    if (Game.flags.paused)
        DOM.START_PAUSE_BTNS.forEach(elem => elem.innerText = 'Pause');
        
    DOM.MOBILE_MENU.classList.add('hidden');
    Game.reset();

    if (isMobileDevice()) 
        setTimeout(() => Game.start(), 400);
    else 
        Game.start();
}));


function isMobileDevice() {
    return document.documentElement.clientWidth < 600;
}

