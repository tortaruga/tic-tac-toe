### overview

Tic-tac-toe game made with vanilla JS. It can be played against a human player or against the computer, and it also has the option of having the computer play against itself. 

#### notes 

I made it as upgraded version of [this project](https://tortaruga.github.io/vanilla-js-games/html/tic-tac-toe.html). I didn't make it wildly different this time. I thought a minimal design (but with less hideous colors...) was fitting for a tic-tac-toe game. I focused on rewriting the logic in a way that was more readable, more DRY, and a bit smarter. 

The game uses the minimax algorithm to generate the computer's move: it analyses all available moves and selects the ones that will lead to the best possible outcome for the computer. Then it selects one random move among these best ones. This means that the player will never win, but either lose or manage a draw.

I wanted to include the possibility of winning, so I introduced a randomness factor: 1% of the time, instead of choosing one of the best moves the computer will select one random move among all the possible ones. This means that the player has the opportunity to win, and also that the computer sometimes makes *really dumb* choices.

#### the minimax algorithm
I believe that if a hell exists and is personal, mine will be the minimax algorithm. I will be forever stuck in those hours I spent trying to understand and implement this cursed algorithm.

Anyway, here it goes:

```
if (win(board, playerX)) {
        return {score: -10}; // if opponent wins, score is negative
    } else if (win(board, playerO)) {
        return {score: 10}; // if player wins, score is positie
    } else if (availableSpots.length === 0) {
        return {score: 0}; // if it's a draw, score is 0
    }
```
If the move results in a win for the player, a negative score is assigned to it; if the move results in a win for the computer, a positive score is assigned; if the move results in a draw, 0 is assigned as score.

```
let moves = [];

    for (let i = 0; i < availableSpots.length; i++) {
        let move = {};
        move.index = availableSpots[i];
        board[availableSpots[i]] = player;

        let result;
        if (player === playerO) {
            result = minimax(board, playerX);
        } else {
            result = minimax(board, playerO);
        }

        move.score = result.score;
        board[availableSpots[i]] = move.index;
        moves.push(move);
    }
```
For each available move, we call the minimax function recursively to evaluate whether it leads to a win, loss, or draw, and we store the moves in an array, each with its own index and score result.

```
let bestMoves = [];
    let bestScore = player === playerO ? -Infinity : Infinity;

    for (let i = 0; i < moves.length; i++) {
        if (
            (player === playerO && moves[i].score > bestScore) ||
            (player === playerX && moves[i].score < bestScore)
        ) {
            bestScore = moves[i].score;
            bestMoves = [moves[i]];
        } else if (moves[i].score === bestScore) {
            bestMoves.push(moves[i]);
        }
    }

```
Then we iterate through all the moves to find the ones that lead to a positive outcome for the computer, and we push those in the bestMoves array.

```
if (Math.random() < 0.01) {
        return moves[Math.floor(Math.random() * moves.length)];
    }

return bestMoves[Math.floor(Math.random() * bestMoves.length)];
```

Now, 1% of the time, we just select a random move; the rest of the time we select one among the best moves. And we're done! Let's clap, everybody, because this was *not* easy at all.