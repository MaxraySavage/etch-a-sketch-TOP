const gridContainer = document.getElementById("grid-container");
const leftDial = document.getElementById('dial-left');
const rightDial = document.getElementById('dial-right');
let totalDivs;
let randomColors = false;

// Input an string that holds the color values for an html element
// Return the three values as numbers in an array 
function toRGBArray (rgbStyleString) {
    return rgbStyleString.split('(')[1].slice(0,-1).split(',').map((a) => Number(a));
}

// Take an array with three elements and sets each element to the
// Weighted average between those elements and corresponding ones in a target array
// With the target arrays values weighted by targetWeight
// This lets us move color values towards background color
// Used for etchasketch shake color changes
function moveTowardsTargetColor(rbgArray, rgbTarget=[190,190,190], targetWeight = 1) {
    for(let i = 0; i < 3; i++) {
        rbgArray[i] = Math.round((rbgArray[i] + rgbTarget[i] * targetWeight) / (targetWeight + 1));
    }
}

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
            if(randomColors) {
                let r = Math.floor(Math.random() * 256);
                let g = Math.floor(Math.random() * 256)
                let b = Math.floor(Math.random() * 256)
                e.target.style.backgroundColor = `rgb(${r},${g},${b})`
            } else {
                let rgbString = e.target.style.backgroundColor;
                if (rgbString === '') {
                    rgbString= 'rgb(190,190,190)';
                }
                rgbVals = toRGBArray(rgbString);
                moveTowardsTargetColor(rgbVals, [30,30,30], 1);
                e.target.style.backgroundColor = `rgb(${rgbVals[0]},${rgbVals[1]},${rgbVals[2]})`
            }
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
            currentRGB = toRGBArray(currentBackground);
            moveTowardsTargetColor(currentRGB);
            child.style.backgroundColor = `rgb(${currentRGB[0]},${currentRGB[1]},${currentRGB[2]})`;
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
    });
    document.getElementById('random').addEventListener('input',()=>{
        randomColors = true;
    });
    document.getElementById('black').addEventListener('input',()=>{
        randomColors = false;
    });
    document.getElementById('black').click();
    const slider = document.getElementById('slider');
    slider.addEventListener('input', (e) => {
    setGridDimensions(e.target.value * 3, e.target.value * 5);
});

});






setGridDimensions(15,25);