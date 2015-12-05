function BoardModel (columns, rows) {
    this._columns = columns || 7;
    this._rows = rows || 6;
    this._data = [];
    this._currentPlayer = this.RED;
    this._totalTokens = 0;

    this.reset();

    this.EMPTY = 0;
    this.RED = 1;
    this.GREEN = 2;

    this.NONE = 0;
    this.WIN = 1;
    this.DRAW = 2;
    this.ILLEGAL_TURN = 3;
}

_p = BoardModel.prototype;

_p.reset = function() {
    this._data = [];
    for (var i = 0; i < this._rows; i += 1) {
        this._data[i] = [];
        for (var j = 0; j < this._columns; j += 1) {
            this._data[i][j] = 0; // BoardModel.EMPTY
        }
    }

    this._currentPlayer = this.RED;
    this._totalTokens = 0;
}

_p.getPiece = function(column, row) {
    return this._data[row][column];
}

_p.getColumns = function() {
    return this._columns;
}

_p.getRows = function() {
    return this._rows;
}

_p.makeTurn = function(column) {
    // The color of the piece that we're dropping
    var piece = this._currentPlayer;

    //  Check if the column is valid
    if (column < 0 || column > this._columns) {
        return {
            status: this.ILLEGAL_TURN
        };
    }

    // Check for empty row, if not empty the turn is illegal
    var row = this._getEmptyRow(column);
    if (row == -1) {
        return {
            status: this.ILLEGAL_TURN
        }
    }

    // Drop the piece
    this._totalTokens += 1;
    this._data[row][column] = piece;

    // Change the next player
    this._toggleCurrentPlayer();

    // Return the successful turn w/ the new state of the game (none, win, or draw)
    return {
        status: this._getGameState(column, row),
        x: column,
        y: row,
        piece: piece
    }
}

_p._getEmptyRow = function(column) {
    for (var i = this._rows - 1; i >= 0; i -= 1) {
        if (!this.getPiece(column, i)) {
            return i;
        }
    }
    return -1;
}

_p._toggleCurrentPlayer = function() {
    if (this._currentPlayer === this.RED) {
        this._currentPlayer = this.GREEN;
    } else {
        this._currentPlayer = this.RED;
    }
}

_p._checkWinDirection = function(column, row, deltaX, deltaY) {
    var pieceColor = this.getPiece(column, row);
    var tokenCounter = 0;
    var c = column + deltaX;
    var r = row + deltaY;
    while (c >= 0 && r >= 0 && c < this._columns && r < this._rows && this.getPiece(c, r) === pieceColor) {
        c += deltaX;
        r += deltaY;
        tokenCounter += 1;
    }
    return tokenCounter;
}

_p._getGameState = function(column, row) {
    if (this._totalTokens === Game.BOARD_WIDTH * Game.BOARD_HEIGHT) {
        this.BoardModel.DRAW;
    }

    for (var deltaX = -1; deltaX < 2; deltaX += 1) {
        for (var deltaY = -1; deltaY < 2; deltaY += 1) {
            if (deltaX === 0 && deltaY === 0) {
                continue;
            }
            var count = this._checkWinDirection(column, row, deltaX, deltaY) +
                        this._checkWinDirection(column, row, -deltaX, -deltaY) + 1;
            if (count >= 4) {
                return this.WIN;
            }
        }
    }

    return this.NONE;
}