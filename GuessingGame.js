function generateWinningNumber () {
    var rand = Math.floor(Math.random() * 100) + 1;
    if (rand === 0) rand = 1;
    return rand;
}

function shuffle (arr) {
    var back = arr.length;
    var elementIndexToShuffle;
    var elementToSwap;

    while (back) {
        //Pick a remaining element
        elementIndexToShuffle = Math.floor(Math.random() * back--);

        //Replace with the current back
        elementToSwap = arr[back];
        arr[back] = arr[elementIndexToShuffle];
        arr[elementIndexToShuffle] = elementToSwap;
    }

    return arr;
}

function Game () {
    this.playersGuess = null;
    this.pastGuesses = [];
    this.winningNumber = generateWinningNumber();
}

Game.prototype.difference = function () {
    return Math.abs(this.playersGuess - this.winningNumber);
}

Game.prototype.isLower = function () {
    return this.playersGuess < this.winningNumber;
}

Game.prototype.playersGuessSubmission = function (guess) {
    if (guess < 1 || guess > 100 || isNaN(guess)) throw "That is an invalid guess.";
    this.playersGuess = guess;
    return this.checkGuess();   
}

Game.prototype.checkGuess = function () {
    var diff = this.difference();
    var guess = this.playersGuess;
    var win = this.winningNumber;
    if (this.pastGuesses.includes(guess)) $('#title').text("You have already guessed that number.");
    else {
        this.pastGuesses.push(guess);
        var i = this.pastGuesses.length - 1;
        $('#guesses').find('li').each(function (index) {
            if (index === i) $(this).text(guess);
        }); 
        var lowerOrHigherMessage = this.isLower() ? 'Guess higher!' : 'Guess lower!';
        $('#subtitle').text(lowerOrHigherMessage);
        switch (true) {
            case (guess === win):
                $('#title').text("You Win!");
                $('#subtitle').text('Press reset to play again!');
                break;
            case (this.pastGuesses.length === 5):
                $('#title').text("You Lose.");
                $('#subtitle').text(`The winning number was ${win}. Press reset to play again!`);
                break;
            case (diff < 10):
                $('#title').text("You're burning up!");
                break;
            case (diff < 25):
                $('#title').text("You're lukewarm.");
                break;
            case (diff < 50):
                $('#title').text("You're a bit chilly.");
                break;
            default:
                $('#title').text("You're ice cold!");
                break;
        }
    }
}

function newGame () {
    return new Game();
}

Game.prototype.provideHint = function () {
    var winningArr = [this.winningNumber, generateWinningNumber(), generateWinningNumber()];
    return shuffle(winningArr);
}

function submit (game) {
    var guess = $('#player-input').val();
    $('#player-input').val('');
    return game.playersGuessSubmission(parseInt(guess, 10));
}

$(document).ready(function () {
    var game = new Game();

    $('#submit').on('click', function () {
        submit(game);
    });

    $('#player-input').keypress(function (key) {
        if (key.which === 13) submit(game);
    });
});