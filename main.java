
// Pressing Control-R will render this sketch.
// Copy + paste into sketchpad.cc editor to play four-in-a-row (aka Connect4)
// See working version at http://studio.sketchpad.cc/sp/pad/view/JPHA42Cimt/latest

Game game =  new Game();

void setup() {  // this is run once.
    
    // canvas size (Variable aren't evaluated. Integers only, please.)
    size(350, 300); 
      
    // smooth edges
    smooth();
    
    // limit the number of frames per second
    frameRate(30);
    
    // set the width of the line. 
    strokeWeight(1.5);
    
    game.setup();
    game.reset();
} 

void mouseClicked() {
    game.handleClick();
}

void draw() {  // this is run repeatedly.  

}

class Game {

    BoardModel model = new BoardModel();
    BoardRenderer renderer = new BoardRenderer(model);
    
    int columns, rows, cellsize;

    Game () {        

    }
    
    void setup () {

        rows = model.getRows();
        columns = model.getColumns();
        cellsize = floor(min(width/columns, height/rows));

        renderer.drawGrid(rows, columns, cellsize);
    }

    void reset () {
        
        model.reset(); 
        renderer.repaint(); 
        
    }
    
    void handleClick () {

        int x = mouseX;
        int y = mouseY;

        int column = floor(x / cellsize);

        int[] turn = model.makeTurn(column);

        int status = turn[0];
        int x = turn[1];
        int y = turn[2];
        int peice = turn[3];

        if (status != model.ILLEGAL_TURN) {
            renderer.drawToken(turn[1], turn[2]);
        }

        if (status == model.WIN) {
            
            if (peice == model.RED) {
                alert('Red won the match');
            } else {
                alert('Green won the match');
            }
            
            reset();
        }

        if (status == model.DRAW) {
            alert('Its a draw');
            reset();
        }

    }
}

class BoardModel {
    
    int[][] data = { {0, 0, 0, 0, 0, 0, 0},
                     {0, 0, 0, 0, 0, 0, 0},
                     {0, 0, 0, 0, 0, 0, 0},
                     {0, 0, 0, 0, 0, 0, 0},
                     {0, 0, 0, 0, 0, 0, 0},
                     {0, 0, 0, 0, 0, 0, 0} };
    
    int rows = 6;
    int columns = 7;
    
    int currentPlayer = RED;
    int totalTokens = 0;

    static int EMPTY = 0;
    static int RED = 1;
    static int GREEN = 2;

    static int NONE = 0;
    static int WIN = 1;
    static int DRAW = 2;
    static int ILLEGAL_TURN = 3;

    BoardModel () {
        
    }

    int getPeice (column, row) {
        return data[row][column];
    }
    
    int getRows () {
        return rows;
    }
    
    int getColumns () {
        return columns;
    }
    
    void reset() {

        int i, j;
        
        for (i = 0; i < rows; i += 1) {
            for (j = 0; j < columns; j += 1) {
                data[i][j] = 0;
            }
        }

        currentPlayer = RED;
        totalTokens = 0;
    }

    int[] makeTurn (int column) {

        int[] result = new int[4];
        int peice = currentPlayer;

        if (column < 0 || column > columns) {
            result[0] = ILLEGAL_TURN;
            return result;
        }

        int row = getEmptyRow(column);
        if (row == -1) {
            result[0] = ILLEGAL_TURN;
            return result;
        }

        totalTokens += 1;
        data[row][column] = peice;

        toggleCurrentPlayer();

        result[0] = getGameState(column, row);
        result[1] = column;
        result[2] = row;
        result[3] = peice;

        return result;
    }

    int getEmptyRow (column) {

        int i = rows -1;
        
        for (; i >= 0; i -= 1) {
            if (getPeice(column, i) == EMPTY) {
                return i;
            }
        }
        
        return -1;
    }

    void toggleCurrentPlayer () {

        if (currentPlayer == RED) {

            currentPlayer = GREEN;
        } else {

            currentPlayer = RED;
        }
    }

    int checkWinDirection (column, row, deltaX, deltaY) {

        int peiceColor = getPeice(column, row);
        int tokenCounter = 0;

        int c = column + deltaX;
        int r = row + deltaY;

        while (c >= 0 && r >= 0 && c < columns && r < rows &&
            getPeice(c, r) == peiceColor) {
                c += deltaX;
                r += deltaY;
                tokenCounter += 1;
        }

        return tokenCounter;
    }
    
    int getGameState (column, row) {

        if (totalTokens == rows*columns) {
            return DRAW;
        }

        int deltaX;
        int deltaY;
        int count = 0;

        for (deltaX = -1; deltaX < 2; deltaX +=1) {
            for (deltaY = -1; deltaY < 2; deltaY += 1) {
                
                if (deltaX == 0 && deltaY == 0) {
                    continue;
                }

                count = checkWinDirection(column, row, deltaX, deltaY) +
                    checkWinDirection(column, row, -deltaX, -deltaY) + 1;

                if (count >= 4) {
                    return WIN;
                }

            }
        }

        return NONE;
    }
}

class BoardRenderer {
    
    BoardModel model;
    int columns, rows, cellsize;


    BoardRenderer (BoardModel m) {

        model = m;
        rows = model.getRows();
        columns = model.getColumns();
    }

    
    void drawGrid (int rows, int columns) {

        int r = rows;
        int c = columns;
        cellsize = floor(min(width/columns, height/rows));    
        
        fill(255);
        rect(0,0, width, height);
        

        for (;r > 0; r -= 1) {
            line(0, cellsize * r, width, cellsize * r);
        }
        
        for (;c > 0; c -= 1) {
            line(cellsize *c, 0, cellsize *c, height);
        }
    }

    void drawToken (int cellX, int cellY) {

        int tokenColor = model.getPeice(cellX, cellY);
        cellsize = floor(min(width/columns, height/rows));    

        if (tokenColor == model.EMPTY) {
            return;
        }

        stroke(0);
        switch (tokenColor) {
            case model.RED:
                fill(255, 0, 0);
            break;
            case model.GREEN:
                fill(0, 255, 0);
            break;
        }

        // center of the token
        float x = (cellX + 0.5) * cellsize;
        float y = (cellY + 0.5) * cellsize;

        ellipse(x, y, cellsize * 0.8, cellsize * 0.8);

    }

    void repaint () {
        
        drawGrid(rows, columns);

        int r, c;

        for (r = 0; r < columns; r += 1) {
            for (c = 0; c < rows; c += 1) {
                drawToken(r, c);
            }
        }
    }
}





    
