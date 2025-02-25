function Gameboard() {
    const board = [];
    const rows = 3;
    const cols = 3;

    //create a table based on the rows and columns
    for (let i = 0; i < rows; i++){
        board[i] = []
        for ( let j = 0; j < cols; j++){
            board[i].push("");
        }
    }

    function getBoard() {
        return board;
    }

    function placeMarker(row, column, symbol) {
        if (board[row][column] == ""){
            board[row][column] = symbol;
            return true;
        }
        else{
            console.log("position already taken");
            return false;
        }
    }

    return { getBoard, placeMarker }
}

function GameController() {
    const {getBoard, placeMarker} = Gameboard();
    let isGameOver = false;

    const players = [
        { name: "Player 1", marker: "X"},
        { name: "Player 2", marker: "O"}
    ]

    let CurrentPlayer = 0;

    function getCurrentPlayer() {
        return players[CurrentPlayer];
    }

    function switchTurn() {
        CurrentPlayer = CurrentPlayer === 0 ? 1 : 0;
    }

    function checkWin() {
        let b = getBoard();

        for (let i=0; i < 3; i++) {
            if (b[i][0] && b[i][0] === b[i][1] && b[i][1] === b[i][2]) {
                return b[i][0];
            }
        }

        for (let j=0; j < 3; j++) {
            if (b[0][j] && b[0][j] === b[1][j] && b[1][j] === b[2][j]) {
                return b[0][j];
            }
        }

        if (b[0][0] && b[0][0] === b[1][1] && b[1][1] === b[2][2]) {
            return b[0][0];
        }
        if (b[0][2] && b[0][2] === b[1][1] && b[1][1] === b[2][0]) {
            return b[0][2];
        }

        return null;
    }

    function checkTie() {
        let b = getBoard();

        for (let i=0; i<b.length; i++) {
            for (let j=0; j<b[i].length; j++){
                if(b[i][j] === ""){
                    return null;
                }
            }
        }

        return true;
    }

    function playTurn(row, column) {
        if (!isGameOver) {
            if(!placeMarker(row, column, getCurrentPlayer().marker)){
                return;
            }
    
            const winner = checkWin();
            if(winner) {
                console.log(`${getCurrentPlayer().name} wins!`);
                isGameOver = true;
                return winner;
            }
    
            const tie = checkTie()
            if (tie){
                console.log("It's a tie!");
                isGameOver = true;
                return tie;
            }
            switchTurn();
        }
        else {
            return;
        }
        
    }

    return { playTurn, getCurrentPlayer, getBoard };

}

function DisplayController(game){
    const boardElement = document.querySelector(".board");
    const resultElement = document.querySelector("#result");

    resultElement.style.display = "none";

    function renderBoard(){
        boardElement.innerHTML = "";
        const board = game.getBoard();

        board.forEach((row,i) => {
            row.forEach((cell,j) => {
               const cellElement = document.createElement("div");
               cellElement.classList.add("cell");
               cellElement.dataset.row = i;
               cellElement.dataset.column = j;
               cellElement.textContent=cell;

                if (cell !== "") {
                    cellElement.classList.add("taken");
                }

                cellElement.addEventListener("click", handleCellClick);
                boardElement.appendChild(cellElement);

            });
        });

    }

    function handleCellClick(event) {
        const row = event.target.dataset.row;
        const column = event.target.dataset.column;

        result = game.playTurn(parseInt(row), parseInt(column));

        event.target.textContent = game.getBoard()[row][column];
        event.target.classList.add("taken");
             
        if(result === "X" || result === "O"){
            winner = game.getCurrentPlayer().marker === result ? game.getCurrentPlayer().name : "Player 2";
            resultElement.style.display = "block";
            resultElement.textContent = `the winner is ${winner}`;
        }
        else if (result === true){
            resultElement.style.display = "block";
            resultElement.textContent = "its a tie";
        }
    }

    return {renderBoard};
}

const game = GameController();
const display = DisplayController(game);

display.renderBoard();