// Game Board Module
const gameBoard = (() => {
    // Player Factory function to create player objects
    const playerFactory = (name, mark, turn) => {
        return { name, mark, turn };
    };

    // Create two players
    const player1 = playerFactory('player 1', 'X', true);
    const player2 = playerFactory('Player 2', 'O', false);

    // Winning combinations on the game board
    const winCombos = [
        [0,1,2],
        [0,3,6],
        [3,4,5],
        [6,7,8],
        [1,4,7],
        [2,4,6],
        [2,5,8],
        [0,4,8]
    ];

    let winner = null; // Variable to track the winner
    let turns = 0; // Variable to track the number of turns
    let board = []; // Array to represent the game board
    let winnerCombo = []; // Array to store the winning combination

    // Player turn event handling
    const playerTurn = (function () {
        const box = document.querySelectorAll('.box');
        box.forEach(box => {
            box.addEventListener('click', e => {
                if (player1.turn == true && gameBoard.winner == null && e.target.textContent == '') {
                    board[e.target.id] = player1.mark;
                    e.target.textContent = player1.mark;
                    e.target.style.color = 'lightblue';
                    player1.turn = false;
                    player2.turn = true;
                } else if (player2.turn == true && gameBoard.winner == null && e.target.textContent == '') {
                    board[e.target.id] = player2.mark;
                    e.target.textContent = player2.mark;
                    e.target.style.color = 'pink';
                    player1.turn = true;
                    player2.turn = false;
                } else {
                    return;
                }
    
                winCheck();
                box.style.opacity = '1';
            });
        });
        return { box };
    })();    

    // Function to check for a winner or a tie
    winCheck = () => {
        turns++;

        // Get the indices of X and O plays
        let xPlays = board.reduce((a, e, i) => 
        (e === player1.mark) ? a.concat(i) : a, []);
        let oPlays = board.reduce((a, e, i) => 
        (e === player2.mark) ? a.concat(i) : a, []);

        // Check for winning combinations
        for(let [,combo] of winCombos.entries()) {
            if (combo.every(elem => xPlays.indexOf(elem) > -1)) {
                // Player 1 wins
                gameBoard.winner = 'p1';
                gameBoard.winnerCombo = combo;
            } else if (combo.every(elem => oPlays.indexOf(elem) > -1)) {
                // Player 2 wins
                gameBoard.winner = 'p2';
                gameBoard.winnerCombo = combo;
            } else if (gameBoard.winner == null && gameBoard.winner == undefined 
                && turns == 9) {
                // It's a tie
                gameBoard.winner = 'tie';
                gameBoard.winnerCombo = combo;
            };
        };
        winDisplay(); // Display the winner or tie message
        return winnerCombo; // Return the winning combination
    };

    // Function to reset the game board
    gameReset = () => {
        gameBoard.winner = null;
        gameBoard.winnerCombo = undefined;
        player1.turn = true;
        player2.turn = false;
        turns = 0;
        board.splice(0, board.length);
    };

    // Return relevant variables and functions
    return { gameReset, winnerCombo };
})();

// Display Controller Module
const displayController = (() => {
    // DOM elements
    const boxCtn = document.querySelector('.box-ctn');
    const box = document.querySelectorAll('.box');
    const winCtn = document.querySelector('.win-display');

    // Function to display the winning combination
    combDisplay = () => {
        for(i = 0; i < gameBoard.winnerCombo.length; i++) {
            document.getElementById(gameBoard.winnerCombo[i]).style.
              backgroundColor = 'white';
        };
    };    

    // Function to display the winner or tie message
    winDisplay = () => {
        if(gameBoard.winner === 'p1') {
            winCtn.textContent = 'X Wins the round!';
            combDisplay();
        } else if (gameBoard.winner === 'p2') {
            winCtn.textContent = 'O Wins the round!';
            combDisplay();
        } else if (gameBoard.winner === 'tie') {
            winCtn.textContent = 'It\'s a tie!';
        } else {
            return;
        };

        replayBtn.style.display = 'flex';
        backBtn.style.display = 'flex';
    };

    // Function to handle game play
    gamePlay = () => {
        winCtn.style.display = 'block';
        header.style.display = 'none';
        playBtn.style.display = 'none';
        boxCtn.style.display = 'flex';
        backBtn.style.display = 'flex';
    };

    // Function to handle game replay
    gameReplay = () => {
        gameBoard.gameReset();

        // Reset the board and make boxes invisible
        box.forEach( box => {
            box.textContent = '';
            box.style.opacity = '0';
            box.style.backgroundColor = 'lightslategray';
        });

        replayBtn.style.display = 'none';

        winCtn.textContent = '';
    };
    
    // Function to return to the main page
    mainPage = () => {
        boxCtn.style.display = 'none';
        winCtn.style.display = 'none';
        backBtn.style.display = 'none';
        playBtn.style.display = 'flex';
        header.style.display = 'flex';
        gameReplay();
    };

    // Event listeners
    const playBtn = document.getElementById('play-btn');
    playBtn.addEventListener('click', gamePlay);

    const replayBtn = document.querySelector('.replay-btn');
    replayBtn.addEventListener('click', gameReplay);

    const backBtn = document.querySelector('.back-btn');
    backBtn.addEventListener('click', mainPage);

    const header = document.querySelector('header');

    // Return relevant functions
    return { winDisplay };
})();
