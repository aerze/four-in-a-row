function BoardRenderer (context, model) {
    this._context = context;
    this._model = model;

    // Save for convenience
    this._columns = model.getColumns();
    this._rows = model.getRows();

    // Top left corner of the board
    this._x = 0;
    this._y = 0;

    // Width and height of the board rectangle
    this._width = 0;
    this._height = 0;

    // the optimal size of the board cell
    this._cellSize = 0;
}

_p = BoardRenderer.prototype;

/**
 * Sets the new position and size for a board. Should call repaint to
 * see the changes
 * @param x the x coordinate of the top-left corner
 * @param y the y coordinate of the top-left corner
 * @param cellSize optimal size of the cell in pixels
 */
_p.setSize = function(x, y, cellSize) {
    this._x = x;
    this._y = y;
    this._cellSize = cellSize;
    this._width = this._cellSize * this._columns;
    this._height = this._cellSize * this._rows;
}

_p._drawBackground = function() {
    var context = this._context;

    // Background
    var gradient = context.createLinearGradient(0, 0, 0, this._height);
    gradient.addColorStop(0, '#fffbb3');
    gradient.addColorStop(1, '#f6f6b2');
    context.fillStyle = gradient;
    context.fillRect(0, 0, this._width, this._height);

    // Drawing Curves
    var co = this._width/6; // Curve offset
    context.strokeStyle = '#dad7ac';
    context.fillStyle = '#f6f6b2';

    // First Curve
    context.beginPath();
    context.moveTo(co, this._height);
    context.bezierCurveTo(this._width + co * 3, -co, -co * 3, -co, this._width - co, this._height);
    context.fill();

    // Second Curve 
    context.beginPath();
    context.moveTo(co, 0);
    context.bezierCurveTo(this._width + co * 3, this._height + co, -co * 3, this._height + co, this._width - co, 0);
    context.fill();
}

_p._drawGrid = function() {
    var context = this._context;
    context.beginPath();
    
    // Draw horizontal lines
    for (var i = 0; i <= this._columns; i += 1) {
        context.moveTo(i * this._cellSize + 0.5, 0.5);
        context.lineTo(i * this._cellSize + 0.5, this._height + 0.5);
    }

    // Draw Vertical lines
    for (var j = 0; j <= this._rows; j += 1) {
        context.moveTo(0.5, j * this._cellSize + 0.5);
        context.lineTo(this._width + 0.5, j * this._cellSize + 0.5);
    }

    // Write to the screen
    context.strokeStyle = '#cccccc';
    context.stroke();
}

_p.drawToken = function(cellX, cellY) {
    var context = this._context;
    var cellSize = this._cellSize;
    var tokenType = this._model.getPiece(cellX, cellY);

    // Cell is empty
    if (!tokenType) {
        return;
    }

    var colorCode = "black";
    console.log(tokenType);
    switch(tokenType) {
        case this._model.RED:
            colorCode = 'red';
        break;
        case this._model.GREEN:
            colorCode = 'green';
        break;
    }

    // Center of the token
    var x = this._x + (cellX + 0.5) * cellSize;
    var y = this._y + (cellY + 0.5) * cellSize;
    context.save();
    context.translate(x, y);

    // Token radius
    var radius = cellSize * 0.4;

    // Center of gradient
    var gradientX = cellSize * 0.1,
        gradientY = cellSize * 0.1;

    var gradient = context.createRadialGradient(
        gradientX, gradientY, cellSize * 0.1, // Inner Circle glare
        gradientX, gradientY, radius * 1.2); // Outer Circle

    gradient.addColorStop(0, 'yellow');
    gradient.addColorStop(1, colorCode);
    context.fillStyle = gradient;

    context.beginPath();
    context.arc(0, 0, radius, 0, 2*Math.PI, true);
    context.fill();
    context.restore();
}

_p.repaint = function() {
    console.log('BoardRenderer: repaint');
    this._context.save();
    this._context.translate(this._x, this._y);
    this._drawBackground();
    this._drawGrid();
    this._context.restore();

    for (var i = 0; i < this._columns; i += 1) {
        for (var j = 0; j < this._rows; j +=1) {
            this.drawToken(i, j);
        }
    }
}
