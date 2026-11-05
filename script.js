const optionsTable = document.getElementById("options-table");
const choiceTable = document.getElementById("choice-table");
const scoreTable = document.getElementById("score-table");
const startBtn = document.getElementById("start-game");
const calcBtn = document.getElementById("calculate");
const newGameBar = document.getElementById("new-game-bar");
const choiceContainer = document.getElementById("choice-container");
const optionsContainer = document.getElementById("options-container");
const scoreContainer = document.getElementById("score-container");
const numberDisplay = document.getElementById("number-of-players");
const addBtn = document.getElementById("add-player");
const removeBtn = document.getElementById("remove-player");
const restartBtn = document.getElementById("restart");
let numberOfPlayers = 4;
let activePlayer = 0;
let colours = ["#003cff", "#ff0000", "#ffd900", "#00ff5e", "#ff005d", "#ff0095"];
let names = [];
let playerScores = [];
let played = [];
let voted = [];


function generateOptions(number) {
    for (let i = 0; i < number; i++) {
        const row = optionsTable.insertRow();
        row.innerHTML = `
            <td><input type="color" /></td>
            <td><input type="text" value="Player ${i+1}"/></td>`
    }
}

function getOptions(number) {
    for (let i = 1; i < number + 1; i++) {
        const colourChoice = optionsTable.rows[i].cells[0];
        const nameChoice = optionsTable.rows[i].cells[1];
        const colour = colourChoice?.querySelector("input")?.value || "#000000";
        const name = nameChoice?.querySelector("input")?.value || "N/A";
        colours.push(colour);
        names.push(name);    
    }
}

function generateChoices(number) {
    for (let i = 0; i < number; i++) {
        playerScores.push(0);
        const colour = colours[i];
        const name = names[i];
        const row = choiceTable.insertRow();
        row.innerHTML = `        
            <td>${name}</td>
            <td></td>
            <td><input id="played" type="number" value="${i + 1}" min="1" max="${number}" /></td>
            <td><input id="voted" type="number" value="1" min="1" max="${number}" /></td>`
        row.cells[1].textContent = playerScores[i];
        row.cells[0].style.borderBottom = `1px solid ${colour}`;
        if (i === activePlayer) {
            row.classList.add("active");
        }
    }
}

function generateScoresheet(number) {
    const firstRow = scoreTable.insertRow();
    for (let i = 0; i < number; i++) {
        const name = names[i];
        firstRow.innerHTML += `<td>${name}</td>`    
    }
}

function addScoreRow(arr) {
    const row = scoreTable.insertRow();
    for (let i = 0; i < arr.length; i++) {
        row.innerHTML += `<td>${arr[i]}</td>`        
    }
}

function deleteRows(number, table) {
    for (let i = 0; i < number; i++) {
        table.deleteRow(-1);
    }
}

function getData(number) {
    played.length = 0;
    voted.length = 0;
    for (let i = 0; i < number; i++) {
        const playedCell = choiceTable.rows[i+1].cells[2];
        const votedCell = choiceTable.rows[i+1].cells[3];
        const playedValue = Number(playedCell?.querySelector("input")?.value) || 0;
        const votedValue = i != activePlayer ? (Number(votedCell?.querySelector("input")?.value) || 0) : 0;
        played.push(playedValue);
        voted.push(votedValue);    
    }
}

function calculateScores() {
    const activeCard = played[activePlayer];
    const allSame = voted.every(v => v === activeCard || v === 0) || voted.every(v => v != activeCard || v === 0);
    if(allSame) {
        for (let i = 0; i < numberOfPlayers; i++) {
            if (i != activePlayer) {
                playerScores[i] += 2;
            }      
        }
    } else {
        playerScores[activePlayer] += 3;
        for (let i = 0; i < voted.length; i++) {
            let vote = i == activePlayer ? 0 : voted[i];
            if (i != activePlayer && vote === activeCard) {
                playerScores[i] += 3;
            } else if (i != activePlayer){
                let bonusPointPlayer = played.indexOf(vote);
                if (i != bonusPointPlayer) {
                    playerScores[bonusPointPlayer] += 1;
                }
            }
        }
    }
}

function updateScores() {
    for (let i = 0; i < numberOfPlayers; i++) {
        const score = choiceTable.rows[i + 1].cells[1];
        score.textContent = playerScores[i];
    }
}

function toggleVisibility(element) {
    element.classList.toggle("hidden");
}

function displayPlayers() {
    numberDisplay.textContent = numberOfPlayers;
}

function changeActiveIndicator(number) {
  document.querySelectorAll("tr.active")
          .forEach(row => row.classList.remove("active"));
  document.querySelectorAll("#choice-container tr")[number + 1]
          .classList.add("active");
}

addBtn.addEventListener("click", () => {
    const row = optionsTable.insertRow();
    row.innerHTML = `
        <td><input type="color" /></td>
        <td><input type="text" value="Player ${numberOfPlayers + 1}"/></td>`
    numberOfPlayers += 1;
    numberDisplay.textContent = numberOfPlayers;
})

removeBtn.addEventListener("click", () => {
    optionsTable.deleteRow(-1);
    numberOfPlayers -= 1;
    numberDisplay.textContent = numberOfPlayers;
})

startBtn.addEventListener("click", () => {
    getOptions(numberOfPlayers);
    generateChoices(numberOfPlayers);
    toggleVisibility(optionsContainer);
    toggleVisibility(choiceContainer);
    toggleVisibility(scoreContainer);
    generateScoresheet(numberOfPlayers);
})

calcBtn.addEventListener("click",() => {
    getData(numberOfPlayers);
    calculateScores();
    addScoreRow(playerScores);
    updateScores();
    activePlayer = (activePlayer + 1) % numberOfPlayers;
    changeActiveIndicator(activePlayer);
})

restartBtn.addEventListener("click", () => {
    playerScores = [];
    const rowsToDelete = scoreTable.rows.length;  
    deleteRows(numberOfPlayers, choiceTable);
    deleteRows(rowsToDelete, scoreTable);  
    generateChoices(numberOfPlayers);
    generateScoresheet(numberOfPlayers);
    activePlayer = 0;
    changeActiveIndicator(activePlayer);
})

generateOptions(4);
displayPlayers();