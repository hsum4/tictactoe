function Gameboard() {
    const board = [];
    const rows = 3;
    const cols = 3;

    //initialize
    function initializeBoard() {
        for (let i = 0; i < rows; i++){
            board[i] = []
            for ( let j = 0; j < cols; j++){
                board[i].push("");
            }
        }
    }

    initializeBoard();

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

    return { initializeBoard, getBoard, placeMarker }
}

function GameController() {
    const resetBtn = document.querySelector("button");
    const {initializeBoard, getBoard, placeMarker} = Gameboard();
    const resultElement = document.querySelector("#result");    
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

        const winPatterns = [
        [[0,0], [0,1], [0,2]],  
        [[1,0], [1,1], [1,2]],  
        [[2,0], [2,1], [2,2]],

        [[0,0], [1,0], [2,0]],
        [[0,1], [1,1], [2,1]],
        [[0,2], [1,2], [2,2]],
        
        [[0,0], [1,1], [2,2]],  
        [[0,2], [1,1], [2,0]]   
    ];
    
    for (const pattern of winPatterns) {
        const [a, b, c] = pattern.map(([r, c]) => getBoard()[r][c]);
        if (a && a === b && b === c) return a;
    }
    
    return null;
    }

    function checkTie() {
        let b = getBoard();

        for (let i=0; i<b.length; i++) {
            for (let j=0; j<b[i].length; j++){
                if(b[i][j] === ""){
                    return false;
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

    function resetGame(){
        initializeBoard();
        isGameOver = false;
        CurrentPlayer = 0;
        display.renderBoard();
        resultElement.style.display = "none";
    }

    resetBtn.addEventListener("click", resetGame);

    return { playTurn, getCurrentPlayer, getBoard };

}

function DisplayController(game){
    const boardElement = document.querySelector(".board");
    const resultElement = document.querySelector("#result");

    resultElement.style.display = "none";

    boardElement.addEventListener("click", (event) => {
        if (event.target.classList.contains("cell")) {
            handleCellClick(event)
        }
    })

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

                // cellElement.addEventListener("click", handleCellClick);
                boardElement.appendChild(cellElement);

            });
        });

    }

    function handleCellClick(event) {
        const row = event.target.dataset.row;
        const column = event.target.dataset.column;

        let result = game.playTurn(parseInt(row), parseInt(column));

        event.target.textContent = game.getBoard()[row][column];
        event.target.classList.add("taken");
             
        if(result === "X" || result === "O"){
            const winner = result === "X" ? "Player 1" : "Player 2";
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