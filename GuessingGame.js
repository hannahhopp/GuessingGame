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
    if (this.pastGuesses.includes(this.playersGuess)) return 'You have already guessed that number.';
    else {
        this.pastGuesses.push(this.playersGuess);
        $('#guess-list li:nth-child(' + this.pastGuesses.length + ')').text(this.playersGuess);

        if (this.playersGuess === this.winningNumber) {
            $('#subtitle').text('Press reset to play again!');
            $('#submit, #hint-button').prop('disabled', true);
            return 'You Win!';
        } else if (this.pastGuesses.length === 5) {
            $('#subtitle').text('Press reset to play again!');
            $('#submit, #hint-button').prop('disabled', true);
            return 'You Lose.';
        } else {
            var lowerOrHigherMessage = this.isLower() ? 'Guess higher!' : 'Guess lower!';
            $('#subtitle').text(lowerOrHigherMessage);
            switch (true) {
                case (diff < 10):
                    return 'You\'re burning up!';
                    break;
                case (diff < 25):
                    return 'You\'re lukewarm.';
                    break;
                case (diff < 50):
                    return 'You\'re a bit chilly.';
                    break;
                default:
                    return 'You\'re ice cold!';
                    break;
            }
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
    var output = game.playersGuessSubmission(parseInt(guess, 10));
    $('#title').text(output);
}

$(document).ready(function () {
    var game = new Game();
    var titleClone = $('#title').clone();
    var subtitleClone = $('#subtitle').clone();
    var guessListClone = $('#guess-list').clone();

    $('#submit').on('click', function () {
        submit(game);
    });

    $('#player-input').keypress(function (key) {
        if (key.which === 13 && !$('#submit').prop('disabled')) submit(game);
    });

    $('#reset-button').on('click', function () {
        $('#title').replaceWith(titleClone.clone());
        $('#subtitle').replaceWith(subtitleClone.clone());
        $('#guess-list').replaceWith(guessListClone.clone());
        $('#submit, #hint-button').prop('disabled', false);
        game = newGame();
    });

    $('#hint-button').on('click', function () {
        var hintArr = game.provideHint();
        var hint = 'The winning number is ' + hintArr[0] + ', ' + hintArr[1] + ' or ' + hintArr[2] + '.';
        $('#title').text(hint);
    });
});