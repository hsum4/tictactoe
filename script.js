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
    const board = new Gameboard();

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
        let b = board.getBoard();

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
        let b = board.getBoard();

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
        if(!board.placeMarker(row, column, getCurrentPlayer().marker)){
            return;
        }

        const winner = checkWin();
        if(winner) {
            console.log(`${getCurrentPlayer().name} wins!`);
            return;
        }

        const tie = checkTie()
        if (tie){
            console.log("It's a tie!");
            return;
        }

        switchTurn();
    }

    return { playTurn, getCurrentPlayer, getBoard: board.getBoard };

}

function DisplayController(game){
    const boardElement = document.querySelector(".board");
    const messageElement = document.querySelector("h1");

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

        game.playTurn(parseInt(row), parseInt(column));
        renderBoard();
    }

    return {renderBoard};
}

const game = GameController();
const display = DisplayController(game);

display.renderBoard();