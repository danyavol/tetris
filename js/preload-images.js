const images = [];

['O', 'I', 'T', 'S', 'Z', 'J', 'L'].forEach(letter => {
    for (let i = 0; i < 4; i++) {
        const img = new Image();
        img.src = `${FIGURES_PATH}${letter}${i}.png`;
        images.push(img);
    } 
});