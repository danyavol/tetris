const images = [];

(() => {
    const imgUrls = [];
    let totalImagesLoaded = 0;

    ['O', 'I', 'T', 'S', 'Z', 'J', 'L'].forEach(letter => {
        for (let i = 0; i < 4; i++)
            imgUrls.push(`${FIGURES_PATH}${letter}${i}.png`);
    });

    imgUrls.forEach(url => {
        const img = new Image();
        img.onload = () => {
            if (++totalImagesLoaded >= imgUrls.length) 
                document.getElementById('loader').style.opacity = '0';
        };
        img.src = url;
        images.push(img);
    })
})()


