const resetBtn = document.querySelector('.reset-button');
const twoPlayersBtn = document.querySelector('.two-players-btn');
const computerBtn = document.querySelector('.computer-btn');
const aiBattleBtn = document.querySelector('.ai-battle-btn');
const btns = document.querySelector('.btns');
const boardContainer = document.querySelector('.board');
const result = document.getElementById('result');
const gameOverDisplay = document.querySelector('.game-over-display');
let tiles;


const playerX_color = '#ab3585';
const playerO_color = '#ffad03';

function handleColor(tile, player) {
    if (player == playerO) {
        tile.style.color = playerO_color
    } else {
        tile.style.color = playerX_color
    }
}

let againstComputer;
let easy;
let medium;
let hard;

twoPlayersBtn.addEventListener('click', () => {
    againstComputer = false;
    hide(btns);
    startGame();
})

computerBtn.addEventListener('click', () => {
    againstComputer = true;
    hide(btns);
    startGame();
})

function resetBoard() {
    tiles.forEach(tile => tile.innerHTML = '');
}

resetBtn.addEventListener('click', () => {
    deleteBoard();
    resetBooleans();
    show(btns);
    hide(gameOverDisplay);
    // startGame();
});

let boardState = [0, 1, 2, 3, 4, 5, 6, 7, 8];
let currentPlayer;
let playerX = 'X';
let playerO = 'O';

function resetBooleans() {
    againstComputer = undefined;
    aiBattle = undefined;
}

function startGame() {
    deleteBoard();
    createBoard();
    tiles = document.querySelectorAll('.tile');
    handleBorders()
    resetBoard();
    currentPlayer = playerX; 
    boardState = [0, 1, 2, 3, 4, 5, 6, 7, 8];
    gameOverDisplay.style.display = 'none';

    playerTurn(boardState, currentPlayer) 
    
}

twoPlayersBtn.addEventListener('click', startGame);

function playerTurn(board, player) {
    if (!isGameActive() || win(board, playerX) || win(board, playerO)) {
        // hadle game over
        console.log('game over')
        gameOver(board, playerX, playerO);
    } else {
        console.log(tiles);
        tiles.forEach((tile, index) => {
                tile.addEventListener('click', () => {
                    if (tile.innerHTML == '') {
                    tile.innerHTML = player;
                    board[index] = player;
                    console.log(tile.innerHTML);
                    console.log(board);
                    handleColor(tile, player);
                if (!againstComputer) {
                    player == playerX ? player = playerO : player = playerX;
                    playerTurn(board, player);    
                } else {
                //   minimax

                    setTimeout(function() {
                        computerTurn(board, playerO, depth = 0, 1);
                    }, 800)
                }    
                } 
            }, { once: true });
        })
    }
}
   

function isGameActive() {
   if (Array.from(tiles).some(tile => tile.innerHTML == '')) {
    return true;
   } else {
    return false;
   }
}



function win(board, player) {
    if (
        board[0] == player && board[1] == player && board[2] == player ||
        board[3] == player && board[4] == player && board[5] == player ||
        board[6] == player && board[7] == player && board[8] == player ||
        board[0] == player && board[3] == player && board[6] == player ||
        board[1] == player && board[4] == player && board[7] == player ||
        board[2] == player && board[5] == player && board[8] == player ||
        board[0] == player && board[4] == player && board[8] == player ||
        board[2] == player && board[4] == player && board[6] == player
    ) {
        return true;
    } else {
        return false;
    }
}

function gameOver(board, player1, player2) {
    if (win(board, player1)) {
        result.innerHTML = 'Player X won!'
    } else if (win(board, player2)) {
        result.innerHTML = 'Player O won!'
    } else {
        result.innerHTML = 'It\'s a tie!!!'
    }
    show(gameOverDisplay);
}

function createBoard() {
    for (let i = 0; i < 9; i++) {
        const tile = document.createElement('div');
        tile.classList.add('tile');
        boardContainer.appendChild(tile);
    }
}

function handleBorders() {
    tiles.forEach((tile, index) => {
            if (index === 0 || index % 3 === 0) {
                tile.classList.add('no-border-left');
            }
            if (index === 6 || index === 7 || index === 8) {
                tile.classList.add('no-border-bottom');     
            }
        })

}

function deleteBoard() {
    boardContainer.innerHTML = ''
}


// minimax algorithm heavens pray for me 
function emptyIndexes(board) {
    return board.filter(spot => spot != 'O' && spot != 'X')
}

function minimax(board, player, depth = 0, maxDepth) {
    let availableSpots = emptyIndexes(board);

    if (win(board, playerX)) {
        return {score: -10 + depth };
    } else if (win(board, playerO)) {
        return {score: 10 - depth};
    } else if (availableSpots.length === 0) {
        return {score: 0};
    } else if (depth >= maxDepth) {
        return {score: 0}; 
    }

    let moves = [];

    for (let i = 0; i < availableSpots.length; i++) {
        let move = {};
        move.index = board[availableSpots[i]];
        board[availableSpots[i]] = player;

        let result;
        if (player == playerO) {
            result = minimax(board, playerX, depth);
        } else {
            result = minimax(board, playerO, maxDepth);
        }
        move.score = result.score;

        board[availableSpots[i]] = move.index;
        moves.push(move);
    }

    let bestMoves = [];
    if (player == playerO) {
        let bestScore = -Infinity;
        for (let i = 0; i < moves.length; i++) {
            if (moves[i].score > bestScore) {
                bestScore = moves[i].score;
                bestMoves = [i];
            } else if (moves[i].score === bestScore) {
                bestMoves.push(i)
            }
        }
    } else {
        let bestScore = Infinity;
        for (let i = 0; i < moves.length; i++) {
            if (moves[i].score < bestScore) {
                bestScore = moves[i].score;
                bestMoves = [i];
            }else if (moves[i].score === bestScore) {
                bestMoves.push(i)
            }
        }
    }

    let bestMove;
    if (Math.random() < 0.05) {
        bestMove = Math.floor(Math.random() * bestMoves.length);
    } else {
        bestMove = bestMoves[Math.floor(Math.random() * bestMoves.length)];
    }


    return moves[bestMove];
}


function computerTurn(board, player) {
    if (!isGameActive() || win(board, playerX) || win(board, playerO)) {
        // hadle game over
        console.log('game over')
        gameOver(board, playerX, playerO);
    } else {
          
            let bestMove = minimax(board, player, depth = 0, 1);
            tiles[bestMove.index].innerHTML = player;
            board[bestMove.index] = player;
            handleColor(tiles[bestMove.index], player);
       
            if (aiBattle) { 
                player = player == playerX ? playerO : playerX;
                setTimeout(() => {
                    computerTurn(board, player)
                }, 800);
            } else {
                playerTurn(board, playerX);    
            }

    }
    
}


let aiBattle;

aiBattleBtn.addEventListener('click', () => {
    aiBattle = true;
    hide(btns);
    deleteBoard();
    createBoard();
    tiles = document.querySelectorAll('.tile');
    handleBorders();
    resetBoard();
    currentPlayer = playerX; 
    boardState = [0, 1, 2, 3, 4, 5, 6, 7, 8];
    computerTurn(boardState, currentPlayer) 
    hide(gameOverDisplay);
})

function hide(element) {
    element.style.display = 'none';
}

function show(element) {
    element.style.display = 'flex';
}