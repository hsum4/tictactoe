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
        }
        else{
            console.log("position already taken")
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

    function playTurn(row, column) {
        if (board.placeMarker(row, column, getCurrentPlayer().marker)){
            console.log(`${getCurrentPlayer().name} placed ${getCurrentPlayer().marker} at (${row}, ${column})`);
        }

        switchTurn();
    }

    return { playTurn, getCurrentPlayer, getBoard: board.getBoard };

}

const game = GameController();