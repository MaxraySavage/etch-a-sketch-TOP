
function setGridDimensions(numRows, numCols) {
    const gridContainer = document.getElementById("grid-container");
    while (gridContainer.firstChild) {
        gridContainer.removeChild(gridContainer.firstChild);
    }
    gridContainer.style.gridTemplateColumns = "repeat(" + numCols + ", 1fr)";
    gridContainer.style.gridTemplateRows = "repeat(" + numRows + ", 1fr)";
    const totalDivs = numRows * numCols;
    const docFrag = document.createDocumentFragment();
    for (let i = 0; i < totalDivs; i++) {
        const div = document.createElement('div');
        div.className = "grid-square";
        div.addEventListener("mouseenter", function changeColor(e) {
            e.target.style.backgroundColor = "cyan";
        });
        docFrag.appendChild(div);
    }
    gridContainer.appendChild(docFrag);
}




setGridDimensions(16,16);