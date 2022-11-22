
const grid = document.getElementById('mainGrid');
const addButton = document.getElementById('add');
const removeButton = document.getElementById('remove');
const fieldTypesSelect = document.getElementById('fieldTypes');
const editSelectedField = document.getElementById('editSelectedField');
const jsonOut = document.getElementById('jsonOut');
const copyButton = document.getElementById('copy');
var gridSize = 0;
var playField = [];
var selectedId = null;
const fieldTypes = {
    empty: 'empty',
    wall: 'wall',
    start: 'start',
    checkpoint: 'checkpoint',
    laser: 'laser',
};

Object.keys(fieldTypes).forEach(key => {
    const option = document.createElement('option');
    option.value = fieldTypes[key];
    option.textContent = key;
    fieldTypesSelect.appendChild(option);
});

fieldTypesSelect.addEventListener('change', () => {
    const selectedElement = playField.find(element => element.id === selectedId);
    if(selectedElement)
        selectedElement.type = fieldTypesSelect.value;
    updateAllGridItems();
});

copyButton.addEventListener('click', () => {
    jsonOut.select();
    navigator.clipboard.writeText(jsonOut.value);
});


const addNewPlayFieldElements = () => {
    for (let i = 0; i < (gridSize * gridSize) - gridSize; i++) {
        if((i) % gridSize === gridSize-1)
            playField.splice(i, 0, generatePlayFieldElement());
    }
    for (let i = 0; i < gridSize; i++) {
        playField.push(generatePlayFieldElement());
    }
    jsonOut.textContent = JSON.stringify(playField);
}

const generatePlayFieldElement = () => {
    return {
        id: makeId(),
        type: fieldTypes.empty
    };
}

const renderPlayField = () => {
    clearGrid();
    setGridSize();
    playField.forEach(element => {
        grid.appendChild(generateGridItem(element.id, element.type));
    });
}
    
const setGridSize = () => {
    let newGridStyle = "";
    for (let i = 0; i < gridSize; i++) {
        newGridStyle += "1fr ";
    };
    grid.style.gridTemplateColumns = newGridStyle;
    grid.style.gridTemplateRows = newGridStyle;
}


const addGrid = () => {
    gridSize +=1;
    addNewPlayFieldElements();
    renderPlayField();
}

// const removeGrid = () => {
//     let newGridStyle = "";
//     if(gridSize <= 1)
//         return;
//     gridSize --;
//     for (let i = 0; i < gridSize; i++) {
//         newGridStyle += "1fr ";
//     };
//     grid.style.gridColumn = newGridStyle;
//     grid.style.gridRow = newGridStyle;
//     clearGrid();
// }

const clearGrid = () => {
    while (grid.firstChild) {
        grid.removeChild(grid.firstChild);
    }
}

const generateGridItem = (id, type) => {
    const newGridItem = document.createElement('div');
    newGridItem.classList.add('grid-item');
    newGridItem.id = id;
    newGridItem.textContent = type;
    newGridItem.addEventListener('click', () => {
        selectedId = selectedId === id ? null : id;
        updateSelected();
    });
    return newGridItem;
}

const updateSelected = () => {
    if(selectedId === null) {
        editSelectedField.style.display = 'none';
        return;
    }
    editSelectedField.style.display = 'unset';
    fieldTypesSelect.value = playField.find(element => element.id === selectedId).type;
    updateAllGridItems();
}

const updateAllGridItems = () => { 
    const gridItems = document.getElementsByClassName('grid-item');
    for (let i = 0; i < gridItems.length; i++) {
        const element = gridItems[i];
        element.textContent = playField.find(a => a.id+"" === element.id+"").type;
        if(element.id === selectedId)
            element.classList.add('selected');
        else
            element.classList.remove('selected');
    }
    jsonOut.textContent = JSON.stringify(playField);
}


//credit: https://stackoverflow.com/questions/1349404/generate-random-string-characters-in-javascript
function makeId(length) {
    length = length ?? 5;
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

addButton.addEventListener('click', addGrid);
removeButton.addEventListener('click', removeGrid);