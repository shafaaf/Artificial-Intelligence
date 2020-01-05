const winningCombos = [
    [0,1,2],
    [3,4,5],
    [6,7,8],
    [0,4,8],
    [2,4,6],
    [0,3,6],
    [1,4,7],
    [2,5,8]
];

let qClassElements = document.getElementsByClassName('q');

const qNumId = (qEl: string): number => {
    return parseInt(qEl.replace('q', ''));
};

const emptyQs = (): Element[] => {
    let elementsArray: Array<Element> = [];
    for (let i = 0; i < qClassElements.length; i++) {
        if (qClassElements[i].innerHTML === '') {
            elementsArray.push(qClassElements[i]);
        }
    }
    return elementsArray;
};

const isAllSame = (elementsArray: Element[]): boolean => {
    if (elementsArray.length == 0) {
        alert("isAllSame: Something wrong");
    }
    if (elementsArray[0].innerHTML === '') {
        return false;
    }
    for (let i = 0; i < elementsArray.length; i++) {
        if (elementsArray[i].innerHTML !== elementsArray[0].innerHTML) {
            return false;
        }
    }
    return true;
};

const endGame = (sequence: Element[]) => {
    console.log("endGame: ", sequence);
    for (let i = 0; i < sequence.length; i++) {
        sequence[i].classList.add('winner');
    }
};

const checkForVictory = () => {
    for (let i = 0; i < winningCombos.length; i++) {
        let sequence: Element[] = [
            qClassElements[winningCombos[i][0]],
            qClassElements[winningCombos[i][1]],
            qClassElements[winningCombos[i][2]],
        ];
        if (isAllSame(sequence)) {
            endGame(sequence);
            return true;
        }
    }
    return false;
};

const setTurn = (index: number, letter: string) => {
    qClassElements[index].innerHTML = letter;
};

let opponentChoiceRandom = (): number => {
    let element = emptyQs()[Math.floor(Math.random() * emptyQs().length)];
    return qNumId(element.id);
};

let opponentChoiceMinimaxAI = (): number => {
    let board = convertElementsToBoard();
    let bestMove = findBestMove(board);
    let moveToBoxMapping:number[][] = [ [0, 1, 2], [3, 4, 5], [6, 7, 8] ];
    return moveToBoxMapping[bestMove.row][bestMove.col];
};

let convertElementsToBoard = (): String[][] => {
    let board: String[][] = [];
    for (let i = 0; i < qClassElements.length; i++) {
        let firstIndex = Math.floor(i / 3);
        let secondIndex = i % 3;

        if (secondIndex == 0) {
            board[firstIndex] = [];
        }
        board[firstIndex][secondIndex] = qClassElements[i].innerHTML;
    }
    return board;
};

let opponentTurn = () => {
    disableListeners();
    setTimeout(() => {
        //setTurn(opponentChoiceRandom(), 'O');
        setTurn(opponentChoiceMinimaxAI(), 'O');
        if (checkForVictory()) {
        } else {
            enableListeners();
        }
    }, 500);
};

let clickFn = (event: Event) => {
    console.log("clickFn: ", event.target);

    let element = event.target as HTMLElement;
    let id = element.id;
    if ((element.innerText == 'X') || (element.innerText == 'O')) {
        return;
    }
    setTurn(qNumId(id), 'X');
    if(!checkForVictory()) {
        opponentTurn();
    } else {
        disableListeners();
    }
};

const enableListeners = () => {
    for (let i = 0; i < qClassElements.length; i++) {
        qClassElements[i].addEventListener("click", clickFn);
    }
};

const disableListeners = () => {
    for (let i = 0; i < qClassElements.length; i++) {
        qClassElements[i].removeEventListener("click", clickFn);
    }
};


//---------------------
// AI stuff

class Move {
    row: number;
    col: number;

    constructor(row: number, col: number) {
        this.row = row;
        this.col = col;
    }
}

function isMovesLeft(board: String[][]): Boolean {
    for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board[0].length; j++) {
            if (board[i][j] == '') {
                return true;
            }
        }
    }
    return false;
}

function evaluate(board: String[][]): number {
    // Checking for Rows for X or O victory.
    for (let row = 0; row < 3; row++) {
        if (board[row][0] == board[row][1] &&
            board[row][1] == board[row][2]) {
            if (board[row][0] == 'O')
                return +10;
            else if (board[row][0] == 'X')
                return -10;
        }
    }

    // Checking for Columns for X or O victory.
    for (let col = 0; col < 3; col++) {
        if (board[0][col] == board[1][col] &&
            board[1][col] == board[2][col]) {
            if (board[0][col] == 'O')
                return +10;

            else if (board[0][col] == 'X')
                return -10;
        }
    }

    // Checking for Diagonals for X or O victory.
    if (board[0][0] == board[1][1] && board[1][1] == board[2][2]) {
        if (board[0][0] == 'O')
            return +10;
        else if (board[0][0] == 'X')
            return -10;
    }

    if (board[0][2] == board[1][1] && board[1][1] == board[2][0]) {
        if (board[0][2] == 'O')
            return +10;
        else if (board[0][2] == 'X')
            return -10;
    }

    // Else if none of them have won then return 0
    return 0;
}

function minimax(board: String[][], depth: number, isMaximizer: boolean): number {
    let score = evaluate(board);

    // If Maximizer has won the game
    // return his/her evaluated score
    if (score == 10)
        return score;

    // If Minimizer has won the game
    // return his/her evaluated score
    if (score == -10)
        return score;

    // If there are no more moves and
    // no winner then it is a tie
    if (!isMovesLeft(board))
        return 0;

    if (isMaximizer) {
        let best = -1000;
        for (let i = 0; i < board.length; i++) {
            for (let j = 0; j < board[0].length; j++) {
                if (board[i][j]=='') {
                    // Make the move
                    board[i][j] = 'O';
                    best = Math.max (
                        best, minimax(board,depth + 1, !isMaximizer)
                    );
                    board[i][j] = '';
                }
            }
        }
        return best;
    } else {
        let best = 1000;

        for (let i = 0; i < board.length; i++) {
            for (let j = 0; j < board[0].length; j++) {
                if (board[i][j]=='') {
                    board[i][j] = 'X';
                    best = Math.min (
                        best, minimax(board,depth + 1, !isMaximizer)
                    );
                    board[i][j] = '';
                }
            }
        }
        return best;
    }
}

// Assume AI is maximizer
function findBestMove(board: String[][]): Move {
    let bestVal = -1000;
    let bestMove = new Move(-1, -1);

    for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board[0].length; j++) {
            if (board[i][j] == '') {
                board[i][j] = 'O';
                let moveVal = minimax(board, 0, false);
                board[i][j] = '';
                if (moveVal > bestVal) {
                    bestMove.row = i;
                    bestMove.col = j;
                    bestVal = moveVal;
                }
            }
        }
    }
    return bestMove;
}

// Main code
// ------------------
let rand = Math.floor(Math.random() * 2) + 1;
if (rand == 1) { // human turn
    enableListeners();
} else {
    opponentTurn();
}
