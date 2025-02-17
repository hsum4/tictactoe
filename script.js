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

    function placeMarker(array, row, column, symbol) {
        if (array[row][column] == ""){
            array[row][column] = symbol;
        }
        else{
            console.log("position already taken")
        }
    }

    return { getBoard, placeMarker }
}

const game = Gameboard();