function generateWinningNumber() {
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
    if (guess < 1 || guess > 100 || typeof guess != 'number') throw "That is an invalid guess.";
    this.playersGuess = guess;
    return this.checkGuess();   
}

Game.prototype.checkGuess = function () {
    var diff = this.difference();
    switch (true) {
        case (this.pastGuesses.includes(this.playersGuess)):
            return "You have already guessed that number.";
            break;
        case (this.playersGuess === this.winningNumber):
            return "You Win!";
            break;
        case (this.pastGuesses.length + 1 === 5):
            return "You Lose.";
            break;
        default:
            this.pastGuesses.push(this.playersGuess);
            switch (true) {
                case (diff < 10):
                    return "You're burning up!";
                    break;
                case (diff < 25):
                    return "You're lukewarm.";
                    break;
                case (diff < 50):
                    return "You're a bit chilly.";
                    break;
                default:
                    return "You're ice cold!";
                    break;
            }
            break;
    }
}

function newGame () {
    return new Game();
}

Game.prototype.provideHint = function () {
    var winningArr = [this.winningNumber, generateWinningNumber(), generateWinningNumber()];
    return shuffle(winningArr);
}