const gridContainer = document.getElementById("grid-container");
const leftDial = document.getElementById('dial-left');
const rightDial = document.getElementById('dial-right');
const etchASketch = document.getElementById('etch-a-sketch');
const slider = document.getElementById('slider');
const defaultGridSquareRGB = [190,190,190];
let totalDivs;
let randomColors = false;

// Input an string that holds the color values for an html element
// Return the three values as numbers in an array 
function toRGBArray (rgbStyleString) {
    return rgbStyleString.split('(')[1].slice(0,-1).split(',').map((a) => Number(a));
}

// Input a domElement and a target color 
// sets the domelement backgroundcolor to the weighted average of it's current color
// and the target color
// Used for etchasketch shake erasing and coloring in the grid squares
function moveTowardsTargetColor(domElement, rgbTarget=[190,190,190], targetWeight = 1) {
    let rbgArray = toRGBArray(domElement.style.backgroundColor)
    for(let i = 0; i < 3; i++) {
        rbgArray[i] = Math.round((rbgArray[i] + rgbTarget[i] * targetWeight) / (targetWeight + 1));
    }
    domElement.style.backgroundColor = `rgb(${rbgArray.join(',')})`;
}

function setGridDimensions(numRows, numCols) {    
    // Remove all grid squares
    while (gridContainer.firstChild) {
        gridContainer.removeChild(gridContainer.firstChild);
    }
    // Set number of rows and columns in the css grid 
    gridContainer.style.gridTemplateColumns = "repeat(" + numCols + ", 1fr)";
    gridContainer.style.gridTemplateRows = "repeat(" + numRows + ", 1fr)";
    totalDivs = numRows * numCols;
    const docFrag = document.createDocumentFragment();
    for (let i = 0; i < totalDivs; i++) {
        const div = document.createElement('div');
        div.className = "grid-square";
        div.style.backgroundColor = `rgb(${defaultGridSquareRGB.join(',')})`;
        docFrag.appendChild(div);
    }
    gridContainer.appendChild(docFrag);

}

function shakeEtchASketch() {
    etchASketch.style.transform = ''
    etchASketch.style.animationPlayState = 'running';
    gridContainer.childNodes.forEach((child) => {
        moveTowardsTargetColor(child, defaultGridSquareRGB);
    });
}

window.addEventListener('load', () => {
    // Track angle of etchasketch dials and turn them as mouse moves
    let leftDialDegrees = 270;
    let rightDialDegrees = 90;
    let movementScale = 1;
    gridContainer.addEventListener('mousemove',(e) => {
        leftDialDegrees = (leftDialDegrees + e.movementX * movementScale) % 360;
        leftDial.style.transform = `rotate(${leftDialDegrees}deg`;
        rightDialDegrees = (rightDialDegrees + e.movementY * movementScale) % 360;
        rightDial.style.transform = `rotate(${rightDialDegrees}deg`;       
    });

    // Click on etchasketch to shake it and erase
    etchASketch.addEventListener('click', shakeEtchASketch);

    // pauses animation at the end of loop
    etchASketch.addEventListener('animationiteration', (e) => {
        e.target.style.animationPlayState = 'paused';
    });

    // Add event listeners to radio buttons that set etcher color flag
    document.getElementById('random').addEventListener('input',()=>{
        randomColors = true;
    });
    document.getElementById('black').addEventListener('input',()=>{
        randomColors = false;
    });
    
    // Add event listener to slider that adjusts grid dimensions
    // 3 by 5 ratio keeps grids as squares
    slider.addEventListener('input', (e) => {
        setGridDimensions(e.target.value * 3, e.target.value * 5);
    });

    // This event listener colors in grid squares on mouse over
    gridContainer.addEventListener("mouseover", function changeColor(e) {
        if (e.target.className === "grid-square") {
            if(randomColors) {
                let r = Math.floor(Math.random() * 256);
                let g = Math.floor(Math.random() * 256)
                let b = Math.floor(Math.random() * 256)
                e.target.style.backgroundColor = `rgb(${r},${g},${b})`
            } else {
                // Get color of current square, convert to numerical array,
                // Then move the color a third of the way to black.
                moveTowardsTargetColor(e.target, [10,10,10], 0.5);
            }
        }
    });
});

setGridDimensions(15,25);