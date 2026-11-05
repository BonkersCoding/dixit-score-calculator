const optionsTable = document.getElementById("options-table");
const choiceTable = document.getElementById("choice-table");
const startBtn = document.getElementById("start-game");
const calcBtn = document.getElementById("calculate");
const choiceContainer = document.getElementById("choice-container");
const optionsContainer = document.getElementById("options-container");
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
let scoreChange = [];


function generateOptions(number) {
    for (let i = 0; i < number; i++) {
        const row = optionsTable.insertRow();
        row.innerHTML = `
            <td><input type="color" value="${colours[i]}"/></td>
            <td><input type="text" value="Player ${i+1}"/></td>`
    }
}

function getOptions(number) {
    for (let i = 1; i < number + 1; i++) {
        const colourChoice = optionsTable.rows[i].cells[0];
        const nameChoice = optionsTable.rows[i].cells[1];
        const colour = colourChoice?.querySelector("input")?.value;
        const name = nameChoice?.querySelector("input")?.value || "N/A";
        if (colour) {
            colours[i-1] = colour;
        }
        names.push(name);    
    }
}

function generateNumberOptions(number) {
    let optionString = "";
    for (let i = 0; i < number; i++) {
        optionString += `<option value="${i + 1}">${i + 1}</option>`     
    }
    return optionString;
}

function generateChoices(number) {
    const numberOptions = generateNumberOptions(number);
    for (let i = 0; i < number; i++) {
        playerScores.push(0);
        const colour = colours[i];
        const name = names[i];
        const row = choiceTable.insertRow();
        row.innerHTML = `        
            <td>${name}</td>
            <td></td>
            <td><select id="played">${numberOptions}</select></td>
            <td><select id="voted">${numberOptions}</select></td>`
        row.cells[1].textContent = playerScores[i];
        row.cells[0].style.borderBottom = `1px solid ${colour}`;
        if (i === activePlayer) {
            row.classList.add("active");
        }
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
        const playedValue = Number(playedCell?.querySelector("select")?.value) || 0;
        const votedValue = i != activePlayer ? (Number(votedCell?.querySelector("select")?.value) || 0) : 0;
        played.push(playedValue);
        voted.push(votedValue);    
    }
}

function calculateScores() {
    scoreChange.length = 0;
    const activeCard = played[activePlayer];
    const allSame = voted.every(v => v === activeCard || v === 0) || voted.every(v => v != activeCard || v === 0);
    if(allSame) {
        for (let i = 0; i < numberOfPlayers; i++) {
            scoreChange.push(0);
            if (i != activePlayer) {
                playerScores[i] += 2;
                scoreChange[i] += 2;
            }     
        }
    } else {
        playerScores[activePlayer] += 3;
        for (let i = 0; i < voted.length; i++) {
            scoreChange.push(0);
            let vote = i == activePlayer ? 0 : voted[i];
            if (i != activePlayer && vote === activeCard) {
                playerScores[i] += 3;
                scoreChange[i] += 3;
            } else if (i != activePlayer){
                let bonusPointPlayer = played.indexOf(vote);
                if (i != bonusPointPlayer) {
                    playerScores[bonusPointPlayer] += 1;
                    scoreChange[bonusPointPlayer] += 1;
                }
            }
        }
        scoreChange[activePlayer] +=3;
    }
    console.log(scoreChange);
}

function updateScores() {
    for (let i = 0; i < numberOfPlayers; i++) {
        const score = choiceTable.rows[i + 1].cells[1];
        score.innerHTML = `
            <div class="hbox">
                <p>${playerScores[i]}</p>
                <p class = "score-change">+${scoreChange[i]}</p>
            </div>`
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
    generateScoresheet(numberOfPlayers);
})

calcBtn.addEventListener("click",() => {
    getData(numberOfPlayers);
    calculateScores();
    updateScores();
    activePlayer = (activePlayer + 1) % numberOfPlayers;
    changeActiveIndicator(activePlayer);
})

restartBtn.addEventListener("click", () => {
    playerScores = [];
    const rowsToDelete = scoreTable.rows.length;  
    deleteRows(numberOfPlayers, choiceTable);
    generateChoices(numberOfPlayers);
    activePlayer = 0;
    changeActiveIndicator(activePlayer);
})

generateOptions(4);
displayPlayers();