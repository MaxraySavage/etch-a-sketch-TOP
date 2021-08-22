const gridContainer = document.getElementById("grid-container");
const leftDial = document.getElementById('dial-left');
const rightDial = document.getElementById('dial-right');
let totalDivs;

function setGridDimensions(numRows, numCols) {    
    while (gridContainer.firstChild) {
        gridContainer.removeChild(gridContainer.firstChild);
    }
    gridContainer.style.gridTemplateColumns = "repeat(" + numCols + ", 1fr)";
    gridContainer.style.gridTemplateRows = "repeat(" + numRows + ", 1fr)";
    totalDivs = numRows * numCols;
    const docFrag = document.createDocumentFragment();
    for (let i = 0; i < totalDivs; i++) {
        const div = document.createElement('div');
        div.className = "grid-square";
        div.addEventListener("mouseenter", function changeColor(e) {
            e.target.style.backgroundColor = 'rgb(80,80,80)'
        });
        docFrag.appendChild(div);
    }
    gridContainer.appendChild(docFrag);
}

function shakeEtchASketch() {
    let destinationRGB = 190;
    gridContainer.childNodes.forEach((child) => {
        let currentBackground = child.style.backgroundColor;
        if(currentBackground.includes('rgb')) {
            let currentRGB = Number(currentBackground.split('(')[1].split(',')[0]);
            let nextRGB = Math.ceil(.5 * Math.abs(destinationRGB - currentRGB) + currentRGB);
            child.style.backgroundColor = `rgb(${nextRGB},${nextRGB},${nextRGB})`;
        }
    });
}

window.addEventListener('load', () => {
    let leftDialDegrees = 270;
    let rightDialDegrees = 90;
    let movementScale = 1;
    gridContainer.addEventListener('mousemove',(e) => {
        leftDialDegrees = (leftDialDegrees + e.movementX * movementScale) % 360;
        leftDial.style.transform = `rotate(${leftDialDegrees}deg`;
        rightDialDegrees = (rightDialDegrees + e.movementY * movementScale) % 360;
        rightDial.style.transform = `rotate(${rightDialDegrees}deg`;       
    });

    const etchASketch = document.getElementById('etch-a-sketch');
    etchASketch.addEventListener('click', () => {
        etchASketch.style.animationPlayState = 'running';
        shakeEtchASketch();
        setTimeout(()=> {
            etchASketch.style.animationPlayState = 'paused';
            etchASketch.style.transform = 'rotate(0deg)'
            etchASketch.style.transform = 'transform(0px)'
        }, 500)
    })
});

const slider = document.getElementById('slider');
slider.addEventListener('input', (e) => {
    setGridDimensions(e.target.value * 3, e.target.value * 5);
});




setGridDimensions(15,25);