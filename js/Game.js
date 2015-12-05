function Game (canvas) {
    this._boardRect = null;
    this._canvas = canvas;
    this._context = canvas.getContext('2d');
    this._boardModel = new BoardModel();
    this._boardRenderer = new BoardRenderer(this._context, this._boardModel);
    this.handleResize();
}

_p = Game.prototype;

_p.handleResize = function() {
    this._clearCanvas();
    this._boardRect = this._getBoardRect();
    this._boardRenderer.setSize(this._boardRect.x, this._boardRect.y, this._boardRect.cellSize);
    this._boardRenderer.repaint();
}

_p._getBoardRect = function() {
    var columns = this._boardModel.getColumns();
    var rows = this._boardModel.getRows();
    var cellSize = Math.floor(Math.min(this._canvas.width/columns, this._canvas.height/rows));

    var boardWidth = cellSize * columns;
    var boardHeight = cellSize * rows;

    return {
        x: Math.floor((this._canvas.width - boardWidth) /2 ),
        y: Math.floor((this._canvas.height - boardHeight) / 2),
        cellSize: cellSize
    }
}

_p.handleClick = function(x, y) {
    // get the column index
    var column = Math.floor((x - this._boardRect.x) / this._boardRect.cellSize);

    // Play turn, check result
    var turn = this._boardModel.makeTurn(column);
    // If turn was legal, update model, draw piece
    if (turn.status != this._boardModel.ILLEGAL_TURN) {
        this._boardRenderer.drawToken(turn.x, turn.y);
    }

    if (turn.status === this._boardModel.WIN) {
        alert((turn.piece === this._boardModel.RED ? 'red': 'green') + ' won the match!');
        this._reset();
    }

    // check for draw
    if (turn.status === this._boardModel.DRAW) {
        alert('Its a draw!');
        this._reset();
    }
}

_p._reset = function() {
    this._clearCanvas();
    this._boardModel.reset();
    this._boardRenderer.repaint();
}

_p._clearCanvas = function() {
    this._context.fillStyle = '#FFFFFF';
    this._context.fillRect(0, 0, this._canvas.width, this._canvas.height);
}