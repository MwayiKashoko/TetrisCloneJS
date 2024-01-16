"use strict";
/*
MODES:
- Survival (Lines form from the bottom every once and a while getting faster each level)
- Type B
- Tetris ai to play against
*/

window.onload = () => {
    const canvas = document.getElementById("canvas");
    const graphics = canvas.getContext("2d");

    const startButton = document.getElementById("startButton");

    startButton.onclick = () => {
        if (state == "none") {
            state = "Title Screen";
        }
    }

    let rows = 20;
    let cols = 10;
    let blockSize = 30;
    const width = cols*blockSize;
    const height = rows*blockSize;

    let blockSpeed = .25;
    let blockSpeedScale = 1;
    let blockSpeedIncrement = 0;
    let yPos = 0;
    let timeToLock = 100;
    let canIncreaseSpeed = true;

    canvas.width = width;
    canvas.height = height;

    const hud = document.getElementById("hud");
    const ctx = hud.getContext("2d");

    let downPressed = false;
    let score = 0;
    let level = 1;
    let linesCleared = 0;
    let rotations = 0;

    let grid = [];

    let lastState = "";
    let state = "none";

    for (let i = 0; i < rows; i++) {
        grid.push([]);
        for (let j = 0; j < cols; j++) {
            grid[i].push(0)
        }
    }

    const random = (min, max) => {
        return Math.floor(Math.random() * (max-min+1))+min;
    }

    let colors = ["#00f0f0", "#0000f0", "#f0a000", "#f0f000", "#00f000", "#a000f0", "#f00000"];

    let pieces = [  //I piece
                    [[0, 0, 0, 0],
                    [1, 1, 1, 1],
                    [0, 0, 0, 0],
                    [0, 0, 0, 0]],

                    //J Piece
                    [[2, 0, 0],
                    [2, 2, 2],
                    [0, 0, 0]],

                    //L Piece
                    [[0, 0, 3],
                    [3, 3, 3],
                    [0, 0, 0]],

                    //O Piece
                    [[4, 4],
                    [4, 4]],

                    //S Piece
                    [[0, 5, 5],
                    [5, 5, 0],
                    [0, 0, 0]],

                    //T Piece
                    [[0, 6, 0],
                    [6, 6, 6],
                    [0, 0, 0]],

                    //Z Piece
                    [[7, 7, 0],
                    [0, 7, 7],
                    [0, 0, 0]]
    ];

    let bag7a = [];
    let bag7b = [];

    while (bag7a.length < pieces.length) {
        let pieceNum = random(0, pieces.length-1);

        if (bag7a.indexOf(pieces[pieceNum]) == -1) {
            bag7a.push(pieces[pieceNum]);
        }
    }

    while (bag7b.length < pieces.length) {
        let pieceNum = random(0, pieces.length-1);

        if (bag7b.indexOf(pieces[pieceNum]) == -1) {
            bag7b.push(pieces[pieceNum]);
        }
    }

    let currentPiece = [];

    let canHold = true;
    let pieceHolding = [];

    for (let i = 0; i < bag7a[0].length; i++) {
        currentPiece.push([]);

        for (let j = 0; j < bag7a[0][i].length; j++) {
            currentPiece[i].push(bag7a[0][i][j]);
        }
    }

    //currentPiece = pieces[0];

    let currentRow = 10;
    let currentCol = Math.round((cols-currentPiece.length)/2);

    const dropBoard = row => {
        for (let i = row; i >= 1; i--) {
            let tempRow = grid[i].slice();
            grid[i].fill(0);
            grid[i+1] = tempRow;
        }

        linesCleared++;
    }

    const findState = () => {
        if (state == "Game Over") {
            grid.forEach(row => row.fill(0));
        }
    }

    const clearLine = () => {
        let totalLines = 0;

        grid.forEach((row, j) => {
            if (row.every(block => block != 0)) {
                row.forEach((block, i, arr) => {
                    arr[i] = 0;
                });

                totalLines++;

                dropBoard(j-1);
            }
        });

        if (totalLines == 1) {
            score += 100*level;
        } else if (totalLines == 2) {
            score += 300*level;
        } else if (totalLines == 3) {
            score += 600*level;
        } else if (totalLines == 4) {
            score += 1000*level;
        }

        level = Math.floor(linesCleared/10)+1;
    }

    const isValid = direction => {
        if (direction == "left") {
            let startingPosition = 0;

            let firstCol = [];

            for (let j = 0; j < currentPiece.length; j++) {
                firstCol.push(currentPiece[j][startingPosition]);
            }

            while (firstCol.every(block => block == 0)) {
                startingPosition++;
                firstCol = [];

                for (let j = 0; j < currentPiece.length; j++) {
                    firstCol.push(currentPiece[j][startingPosition]);
                }
            }

            return firstCol.every(block => block == 0 || (startingPosition+currentCol >= 0)) &&
                  currentPiece.every((row, i, arr) => row.every((block, j) => {
                    let comparison = i+currentRow;

                    if (comparison >= grid.length) {
                        comparison--;
                    }

                    return block == 0 || (j+currentCol-1 >= 0 && grid[i+currentRow][j+currentCol-1] == 0);
                }));

        } else if (direction == "right") {
            let endingPosition = currentPiece.length-1;

            let lastCol = [];

            for (let j = 0; j < currentPiece.length; j++) {
                lastCol.push(currentPiece[j][endingPosition]);
            }

            while (lastCol.every(block => block == 0)) {
                endingPosition--;
                lastCol = [];

                for (let j = 0; j < currentPiece.length; j++) {
                    lastCol.push(currentPiece[j][endingPosition]);
                }
            }

            return lastCol.every(block => block == 0 || (endingPosition+currentCol < grid[0].length)) &&
                  currentPiece.every((row, i, arr) => row.every((block, j) => {
                    return block == 0 || (j+currentCol+1 < grid[0].length && grid[i+currentRow][j+currentCol+1] == 0);
                }));
        }

        let endingPosition = currentPiece.length-1;

        let lastRow = currentPiece[endingPosition];

        while (lastRow.every(block => block == 0)) {
            endingPosition--;
            lastRow = currentPiece[endingPosition];
        }

        return lastRow.every(block => block == 0 || currentRow+endingPosition < grid.length) &&
               currentPiece.every((row, i) => row.every((block, j) => block == 0 || (i+currentRow+1 < grid.length && grid[i+currentRow+1][j+currentCol] == 0)));
    }

    const translatePiece = (col, row) => {
        currentRow += row;
        yPos += blockSize*row;
        currentCol += col;
    }

    const rotatePiece = direction => {
        let copyPiece = [];

        for (let i = 0; i < currentPiece.length; i++) {
            copyPiece.push([]);

            for (let j = 0; j < currentPiece[i].length; j++) {
                copyPiece[i].push(currentPiece[i][j]);
            }
        }

        for (let i = 0; i < currentPiece.length; i++) {
            for (let j = 0; j < currentPiece[i].length; j++) {
                if (direction == "clockwise") {
                    currentPiece[i][j] = copyPiece[currentPiece.length-j-1][i];
                } else {
                    currentPiece[i][j] = copyPiece[j][currentPiece[0].length-i-1];
                }
            }
        }

        let sign = 1;

        if (direction == "clockwise") {
            rotations++;
        } else {
            rotations--;
            sign = -1;
        }

        if (rotations < 0) {
            rotations = 3;
        }

        let startRow = 0;
        let endRow = currentPiece.length-1;
        let startCol = 0;
        let endCol = currentPiece[0].length-1;

        while (currentPiece[startRow].every(block => block == 0)) {
            startRow++;
        }

        while (currentPiece[endRow].every(block => block == 0)) {
            endRow--;
        }

        while (currentPiece.every((row, i) => currentPiece[i][startCol] == 0)) {
            startCol++;
        }

        while (currentPiece.every((row, i) => currentPiece[i][endCol] == 0)) {
            endCol--;
        }

        let wallKickCondition = currentRow+endRow > grid.length-1 || currentCol+startCol < 0 || currentCol+endCol > grid[0].length-1;
        
        for (let i = 0; i < currentPiece.length; i++) {
            for (let j = 0; j < currentPiece[i].length; j++) {
                if (currentPiece[i][j] != 0) {
                    if (!wallKickCondition && grid[i+currentRow][j+currentCol] != 0) {
                        wallKickCondition = true;
                    }
                }
            }
        }

        let wallKickCase = 1;

        let translateX = 0;
        let translateY = 0;

        while (wallKickCondition && wallKickCase < 5) {
            if (currentPiece.length < 4) {
                if (rotations%4 == 0) {
                    if (direction == "clockwise") {
                        if (wallKickCase == 1) {
                            translateX = -1;
                        } else if (wallKickCase == 2) {
                            translateX = -1;
                            translateY = 1;
                        } else if (wallKickCase == 3) {
                            translateY = -2;
                        } else {
                            translateX = -1;
                            translateY = -2;
                        }
                    } else {
                        if (wallKickCase == 1) {
                            translateX = 1;
                        } else if (wallKickCase == 2) {
                            translateX = 1;
                            translateY = 1;
                        } else if (wallKickCase == 3) {
                            translateY = -2;
                        } else {
                            translateX = 1;
                            translateY = -2;
                        }
                    }
                } else if (rotations%4 == 1) {
                    if (wallKickCase == 1) {
                        translateX = -1;
                    } else if (wallKickCase == 2) {
                        translateX = -1;
                        translateY = -1;
                    } else if (wallKickCase == 3) {
                        translateY = 2;
                    } else {
                        translateX = -1;
                        translateY = 2;
                    }
                } else if (rotations%4 == 2) {
                    if (direction == "clockwise") {
                        if (wallKickCase == 1) {
                            translateX = 1;
                        } else if (wallKickCase == 2) {
                            translateX = 1;
                            translateY = 1;
                        } else if (wallKickCase == 3) {
                            translateY = -2;
                        } else {
                            translateX = 1;
                            translateY = -2;
                        }
                    } else {
                        if (wallKickCase == 1) {
                            translateX = -1;
                        } else if (wallKickCase == 2) {
                            translateX = -1;
                            translateY = 1;
                        } else if (wallKickCase == 3) {
                            translateY = -2;
                        } else {
                            translateX = -1;
                            translateY = -2;
                        }
                    }
                } else {
                    if (wallKickCase == 1) {
                        translateX = 1;
                    } else if (wallKickCase == 2) {
                        translateX = 1;
                        translateY = -1;
                    } else if (wallKickCase == 3) {
                        translateY = 2;
                    } else {
                        translateX = 1;
                        translateY = 2;
                    }
                }
            } else {
                if (rotations%4 == 0) {
                    if (wallKickCase == 1) {
                        if (direction == "clockwise") {
                            translateX = 1;
                        } else {
                            translateX = 2;
                        }
                    } else if (wallKickCase == 2) {
                        if (direction == "clockwise") {
                            translateX = -2;
                        } else {
                            translateX = -1;
                        }
                    } else if (wallKickCase == 3) {
                        if (direction == "clockwise") {
                            translateX = 1;
                            translateY = 2;
                        } else {
                            translateX = 2;
                            translateY = -1;
                        }
                    } else {
                        if (direction == "clockwise") {
                            translateX = -2;
                            translateY = -1;
                        } else {
                            translateX = -1;
                            translateY = 2;
                        }
                    }
                } else if (rotations%4 == 1) {
                    if (wallKickCase == 1) {
                        if (direction == "clockwise") {
                            translateX = -2;
                        } else {
                            translateX = 1;
                        }
                    } else if (wallKickCase == 2) {
                        if (direction == "clockwise") {
                            translateX = 1;
                        } else {
                            translateX = -2;
                        }
                    } else if (wallKickCase == 3) {
                        if (direction == "clockwise") {
                            translateX = -2;
                            translateY = 1;
                        } else {
                            translateX = 1;
                            translateY = 2;
                        }
                    } else {
                        if (direction == "clockwise") {
                            translateX = 1;
                            translateY = -2;
                        } else {
                            translateX = -2;
                            translateY = -1;
                        }
                    }
                } else if (rotations%4 == 2) {
                    if (wallKickCase == 1) {
                        if (direction == "clockwise") {
                            translateX = -1;
                        } else {
                            translateX = -2;
                        }
                    } else if (wallKickCase == 2) {
                        if (direction == "clockwise") {
                            translateX = 2;
                        } else {
                            translateX = 1;
                        }
                    } else if (wallKickCase == 3) {
                        if (direction == "clockwise") {
                            translateX = -1;
                            translateY = -2;
                        } else {
                            translateX = -2;
                            translateY= 1;
                        }
                    } else {
                        if (direction == "clockwise") {
                            translateX = 2;
                            translateY = 1;
                        } else {
                            translateX = 1;
                            translateY = -2;
                        }
                    }
                } else {
                    if (wallKickCase == 1) {
                        if (direction == "clockwise") {
                            translateX = 2;
                        } else {
                            translateX = -1;
                        }
                    } else if (wallKickCase == 2) {
                        if (direction == "clockwise") {
                            translateX = -1;
                        } else {
                            translateX = 2;
                        }
                    } else if (wallKickCase == 3) {
                        if (direction == "clockwise") {
                            translateX = 2;
                            translateY = -1;
                        } else {
                            translateX = -1;
                            translateY= -2;
                        }
                    } else {
                        if (direction == "clockwise") {
                            translateX = -1;
                            translateY = 2;
                        } else {
                            translateX = 2;
                            translateY = 1;
                        }
                    }
                }
            }

            translatePiece(translateX, translateY);

            wallKickCondition = currentRow+endRow > grid.length-1 || currentCol+startCol < 0 || currentCol+endCol > grid[0].length-1;
        
            for (let i = 0; i < currentPiece.length; i++) {
                for (let j = 0; j < currentPiece[i].length; j++) {
                    if (currentPiece[i][j] != 0) {
                        if (!wallKickCondition && grid[i+currentRow][j+currentCol] != 0) {
                            wallKickCondition = true;
                        }
                    }
                }
            }

            if (wallKickCondition) {
                wallKickCase++;
                translatePiece(-translateX, -translateY);
                translateX = 0;
                translateY = 0;
            }
        }

        if (wallKickCase > 4) {
            currentPiece = copyPiece;
            rotations -= sign;
        }
    }

    const nextPiece = () => {
        rotations = 0;

        currentPiece = [];
            bag7a.shift();

            if (bag7a.length == 0) {
                bag7a = bag7b;
                bag7b = [];

                while (bag7b.length < pieces.length) {
                    let pieceNum = random(0, pieces.length-1);

                    if (bag7b.indexOf(pieces[pieceNum]) == -1) {
                        bag7b.push(pieces[pieceNum]);
                    }
                }
            }

            for (let i = 0; i < bag7a[0].length; i++) {
                currentPiece.push([]);

                for (let j = 0; j < bag7a[0][i].length; j++) {
                    currentPiece[i].push(bag7a[0][i][j]);
                }
            }

            yPos = 0;

            currentRow = Math.floor(yPos/blockSize);

            currentCol = Math.round((cols-currentPiece.length)/2);
    }

    const findGhost = drop => {
        let startingPosition = 0;

        while (currentPiece[startingPosition].every(block => block == 0)) {
            startingPosition++;
        }

        let endingPosition = currentPiece.length-1;

        let lastRow = currentPiece[endingPosition];

        while (lastRow.every(block => block == 0)) {
            endingPosition--;
            lastRow = currentPiece[endingPosition];
        }

        let lastPosition = currentRow;

        let collision = false;

        while (!collision) {
            let validPieces = 0;

            for (let i = lastPosition; i < lastPosition+currentPiece.length; i++) {
                if (currentPiece[i-lastPosition].every(block => block == 0)) {
                    continue;
                }

                for (let j = currentCol; j < currentCol+currentPiece[0].length; j++) {
                    try {
                        if (i < grid.length && currentPiece[i-lastPosition][j-currentCol] != 0 && grid[i][j] == 0) {
                            validPieces++;
                        }
                    } catch(error) {
                        state = "Game Over";
                    }
                }
            }

            if (validPieces == 4) {
                lastPosition++;
            } else {
                collision = true;
            }
        }

        lastPosition += startingPosition-1;

        //console.log(lastPosition, startingPosition);

        let ghostPiece = [];

        for (let i = 0; i < currentPiece.length; i++) {
            for (let j = 0; j < currentPiece[i].length; j++) {
                if (currentPiece[i][j] != 0) {
                    graphics.globalAlpha = 0.5;
                    graphics.fillStyle = colors[currentPiece[i][j]-1];
                    graphics.fillRect((j+currentCol)*blockSize, (lastPosition+i-startingPosition)*blockSize, blockSize, blockSize);
                    graphics.globalAlpha = 1;
                }
            }
        }

        if (drop) {
            for (let i = 0; i < currentPiece.length; i++) {
                for (let j = 0; j < currentPiece[i].length; j++) {
                    if (currentPiece[i][j] != 0) {
                        //console.log((lastPosition+i-startingPosition))
                        try {
                            grid[lastPosition+i-startingPosition][currentCol+j] = currentPiece[i][j];
                        } catch (err) {

                        }
                    }
                }
            }

            timeToLock = Math.ceil(25/(level/8)); 

            if (state == "Master") {
                timeToLock = Math.ceil(25/((level-50)/8)); 
            }

            nextPiece();

            score += level*30;

            canHold = true;
        }
    }

    const updatePiece = (increment) => {
        findGhost(false);

        if (canIncreaseSpeed) {
            blockSpeedIncrement = level;
            blockSpeedScale = 1+blockSpeedIncrement;
        }

        if (isValid("vertical")) {
            yPos += increment;
            currentRow = Math.floor(yPos/blockSize);

            if (downPressed && increment > blockSpeed) {
                score += level;
            }
        } else {
            for (let i = 0; i < currentPiece.length; i++) {
                for (let j = 0; j < currentPiece[i].length; j++) {
                    if (currentPiece[i][j] != 0) {
                        if (i+currentRow >= 0 && grid[i+currentRow][j+currentCol] != 0) {
                            transition = true;

                            lastState = state;
                            state = "Game Over";
                        }
                    }
                }
            }

            if (timeToLock > 0) {
                timeToLock--;

                if (downPressed && increment > blockSpeed) {
                    timeToLock = 0;
                }
            } else {
                timeToLock = Math.ceil(25/(level/8)); 
                
                if (state == "Master") {
                    timeToLock = Math.ceil(25/((level-50)/8)); 
                }

                for (let i = 0; i < currentPiece.length; i++) {
                    for (let j = 0; j < currentPiece[i].length; j++) {
                        if (currentPiece[i][j] != 0) {
                            grid[i+currentRow][j+currentCol] = currentPiece[i][j];
                        }
                    }
                }

                nextPiece();

                score += level*3;

                canHold = true;
            }
        }
    }

    const drawPiece = () => {
        let happened = false;

        for (let i = 0; i < currentPiece.length; i++) {
            if (happened) {
                break;
            }
                
            for (let j = 0; j < currentPiece[i].length; j++) {
                if (happened) {
                    break;
                }

                if (currentPiece[i][j] != 0) {
                    graphics.fillStyle = colors[currentPiece[i][j]-1];
                    happened = true;
                    break;
                }
            }
        }

        for (let i = 0; i < currentPiece.length; i++) {
            for (let j = 0; j < currentPiece[i].length; j++) {
                if (currentPiece[i][j] != 0) {
                    graphics.fillRect((j+currentCol)*blockSize, (i+currentRow)*blockSize, blockSize, blockSize);
                    //graphics.fillRect((j+currentCol)*blockSize, Math.floor(yPos+(i*blockSize)), blockSize, blockSize);
                }
            }
        }
    }

    const drawGrid = () => {
        graphics.strokeStyle = "white";

        for (let i = 1; i < rows; i++) {
            graphics.beginPath();
            graphics.moveTo(0, i*blockSize);
            graphics.lineTo(width, i*blockSize);
            graphics.stroke();
        }

        for (let i = 1; i < cols; i++) {
            graphics.beginPath();
            graphics.moveTo(i*blockSize, 0);
            graphics.lineTo(i*blockSize, height);
            graphics.stroke();
        }

        if (!invisible) {
            for (let i = 0; i < rows; i++) {
                for (let j = 0; j < cols; j++) {
                    if (grid[i][j] != 0) {
                        graphics.fillStyle = colors[grid[i][j]-1];
                        graphics.fillRect(j*blockSize, i*blockSize, blockSize, blockSize);
                    }
                }
            }
        }
    }

    let showTimer = false;
    let time = 0;

    const reset = () => {
        blockSpeed = .25;
        blockSpeedScale = 1;
        blockSpeedIncrement = 0;
        yPos = 0;
        timeToLock = 100;
        canIncreaseSpeed = true;

        time = 0
        showTimer = false;

        downPressed = false;
        score = 0;
        level = 1;
        linesCleared = 0;
        pieceHolding = [];
        rotations = 0;
        canHold = true;
        currentRow = 10;
        currentCol = Math.round((cols-currentPiece.length)/2);
        invisible = false;

        grid.forEach((row, i, arr) => {
            arr[i].fill(0);
        });
    }

    const updateHud = () => {
        ctx.fillStyle = "white";
        ctx.font = "30px Helvetica";
        ctx.textAlign = "center";

        ctx.fillText(`Score: ${score}`, hud.width/4, 40);
        ctx.fillText(`Level: ${level}`, hud.width/4, 80);
        ctx.fillText(`Lines: ${linesCleared}`, hud.width/4, 120);

        ctx.fillStyle = "red";
        ctx.fillText("Next", hud.width/4, 180);

        let shiftY = 0;

        for (let i = 1; i < bag7a.length; i++) {
            if (i < 5) {
                let startingPosition = 0
                let endingPosition = bag7a[i].length-1;

                for (let j = 0; j < bag7a[i].length; j++) {
                    for (let k = 0; k < bag7a[i][j].length; k++) {
                        if (bag7a[i][j][k] != 0) {
                            ctx.fillStyle = colors[bag7a[i][j][k]-1];

                            while (bag7a[i][startingPosition].every(block => block == 0)) {
                                startingPosition++;
                            }

                            while (bag7a[i][endingPosition].every(block => block == 0)) {
                                endingPosition--;
                            }

                            let yAlign = 170-startingPosition*blockSize;

                            ctx.fillRect(Math.floor(k*blockSize+width/2-blockSize*bag7a[i][0].length/2), Math.floor((j+shiftY)*blockSize+yAlign+blockSize*i), blockSize, blockSize);
                        }
                    }
                }

                shiftY += endingPosition-startingPosition+1;
            }
        }

        if (bag7a.length < 5) {
            let piecesLeft = 5-bag7a.length;

            for (let i = 0; i < piecesLeft; i++) {
                let startingPosition = 0
                let endingPosition = bag7b[i].length-1;

                for (let j = 0; j < bag7b[i].length; j++) {
                    for (let k = 0; k < bag7b[i][j].length; k++) {
                        if (bag7b[i][j][k] != 0) {
                            ctx.fillStyle = colors[bag7b[i][j][k]-1];

                            startingPosition = 0;

                            while (bag7b[i][startingPosition].every(block => block == 0)) {
                                startingPosition++;
                            }

                            endingPosition = bag7b[i].length-1;

                            while (bag7b[i][endingPosition].every(block => block == 0)) {
                                endingPosition--;
                            }

                            let yAlign = 170-startingPosition*blockSize;

                            ctx.fillRect(Math.floor(k*blockSize+width/2-blockSize*bag7b[i][0].length/2), Math.floor((j+shiftY)*blockSize+yAlign+blockSize*(i+bag7a.length)), blockSize, blockSize);
                        }
                    }
                }

                shiftY += endingPosition-startingPosition+1;
            }
        }

        ctx.fillStyle = "white";
        ctx.fillText(`Hold`, hud.width/4, 580);

        ctx.strokeStyle = "white";
        ctx.strokeRect(hud.width/4-75, hud.height-200, 150, 150);

        for (let i = 0; i < pieceHolding.length; i++) {
            for (let j = 0; j < pieceHolding[i].length; j++) {
                if (pieceHolding[i][j] != 0) {
                    ctx.fillStyle = colors[pieceHolding[i][j]-1];

                    let startingPosition = 0;

                    while (pieceHolding[startingPosition].every(block => block == 0)) {
                        startingPosition++;
                    }

                    let endingPosition = pieceHolding.length-1;

                    while (pieceHolding[endingPosition].every(block => block == 0)) {
                        endingPosition--;
                    }

                    let yAlign = hud.height-200-startingPosition*blockSize;

                    let newAlign = 150-blockSize*(endingPosition-startingPosition+1);

                    ctx.fillRect(Math.floor(j*blockSize+width/2-blockSize*pieceHolding[0].length/2), Math.floor(i*blockSize+yAlign+newAlign/2), blockSize, blockSize);
                }
            }
        }

        if (showTimer) {
            ctx.fillStyle = "white";

            let minutes = `0${Math.floor(time/3600)%3600}`.slice(-2);
            let seconds = `0${Math.floor(time/60)%60}`.slice(-2);
            let milliseconds = `0${((time/60)%1).toString().substring(2, 4)}`.slice(-2);

            ctx.fillText(`Time: ${minutes}:${seconds}.${milliseconds}`, hud.width/2+100, 50);
        }
    }

    let invisible = false;

    const gameLogic = () => {
        showTimer = false;
        canIncreaseSpeed = true;

        if (state == "Marathon" && linesCleared >= 200) {
            transition = true;
            lastState = state;
            state = "Game Complete";
        } else if (state == "Sprint") {
            showTimer = true;
            canIncreaseSpeed = false;

            if (graphics.globalAlpha >= 1) {
                time++;
            } else {
                time = 0;
            }

            if (linesCleared >= 40) {
                transition = true;
                lastState = state;
                state = "Game Complete";
            }
        } else if (state == "Invisible") {
            invisible = true;
        } else if (state == "Master") {
            if (lastState != state) {
                linesCleared = 500;
            }

            lastState = state;
        } else if (state == "Big") {
            if (lastState != state) {
                blockSize *= 4;
            }

            lastState = state;
        }

        if (!showTimer) {
            time = 0;
        }
    }

    let titleScreenImage = new Image();
    titleScreenImage.src = "Images/titleScreen.png";
    let title = new Image();
    title.src = "Images/tetris.svg";

    let gameOverImage = new Image();
    gameOverImage.src = "Images/gameOver.jpeg";
    let gameCompleteImage = new Image();
    gameCompleteImage.src = "Images/gameComplete.jpeg";

    let transition = false;

    let games = ["Endless", "Marathon", "Sprint", "Invisible", "Master"];//, "Big", "ColorBlind", "Battle", ];

    const draw = (increment, score) => {
        graphics.clearRect(0, 0, width, height);
        ctx.clearRect(0, 0, hud.width, hud.height);

        findState();
        gameLogic();

        if (state == "Title Screen") {
            graphics.drawImage(titleScreenImage, 0, 0, width, height);

            graphics.fillStyle = "white";
            graphics.textAlign = "center";
            graphics.font = "30px Helvetica";

            graphics.fillText("Press Enter To Start", width/2, 200);

            graphics.drawImage(title, width/2-125, 25, 250, 150);

            if (transition) {
                graphics.globalAlpha -= 0.01;
            }

            if (graphics.globalAlpha <= 0.01) {
                state = "Game Select";
                transition = false;
            }
        } else if (state == "Game Select") {
            if (graphics.globalAlpha < 1 && !transition) {
                graphics.globalAlpha += 0.01;

                if (graphics.globalAlpha >= 0.99) {
                    graphics.globalAlpha = 1;
                }
            }

            graphics.fillStyle = "white";

            let buttonHeight = height/(games.length*2);

            for (let i = 0; i < games.length; i++) {
                graphics.fillRect(width/2-100, i*(buttonHeight+25)+50, 200, buttonHeight);
            }

            graphics.font = `${buttonHeight/3}px Helvetica`;
            graphics.fillStyle = "red";

            for (let i = 0; i < games.length; i++) {
                graphics.fillText(games[i], width/2, i*(buttonHeight*1.4)+90);
            }
        } else if (games.includes(state)) {
            if (graphics.globalAlpha <= 0.01 && transition) {
                transition = false;
            } else if (graphics.globalAlpha <= 1 && transition) {
                graphics.globalAlpha = 0;
            } else if (graphics.globalAlpha < 1) {
                graphics.globalAlpha += 0.01;

                if (graphics.globalAlpha >= 0.99) {
                    graphics.globalAlpha = 1;
                }
            }

            if (graphics.globalAlpha >= 1 && !transition) {
                clearLine();

                if (increment != 0) {
                    updatePiece(increment);
                }

                drawPiece();
            }

            drawGrid();

            updateHud();
        } else if (state == "Game Complete" || state == "Game Over") {
            if (graphics.globalAlpha <= 0.01 && transition) {
                transition = false;
            } else if (graphics.globalAlpha <= 1 && transition) {
                graphics.globalAlpha = 0;
            } else if (graphics.globalAlpha < 1) {
                graphics.globalAlpha += 0.01;

                if (graphics.globalAlpha >= 0.99) {
                    graphics.globalAlpha = 1;
                }
            }

            graphics.fillStyle = "lime";

            if (state == "Game Complete") {
                graphics.drawImage(gameCompleteImage, 0, 0, width, height);

                graphics.fillText(`${lastState} Complete!!!`, width/2, 200);

                if (time != 0) {
                    graphics.fillText(`Completed in ${Math.floor(time/3600)}:${Math.floor(time/60)}.${((time/60)%1).toString().substring(2, 4)}`, width/2, 400);
                }
            } else {
                graphics.drawImage(gameOverImage, 0, 0, width, height);

                graphics.fillText("GAME OVER!", width/2, 200);
            }
        }
    }

    let music = new Audio();
    let titleScreenMusic = new Audio("Sounds/TitleScreen.mp3");

    let gameSelect = new Audio("Sounds/GameSelect.mp3");

    let gameMusic = [];

    let gameOverMusic = new Audio("Sounds/GameOver.mp3");
    let gameCompletedMusic = new Audio("Sounds/GameCompleted.mp3");

    for (let i = 1; i < 12; i++) {
        gameMusic.push(new Audio());
        gameMusic[i-1].src = "Sounds/GameMusic"+i+".mp3";
    }

    music.ontimeupdate = function() {
        /*switch(this.src) {

        case "Sounds/GameSelect.mp3":
            if (this.currentTime > 56.115761) {
                this.currentTime = 0;
            }

            break;

        }*/
    }

    const resetMusic = () => {
        gameMusic.forEach((sound, i, arr) => {
            if (sound != music) {
                arr[i].currentTime = 0;
            }
        });

        if (music != gameSelect) {
            gameSelect.currentTime = 0;
        } 

        if (music != gameOverMusic) {
            gameOverMusic.currentTime = 0;
        }

        if (music != gameCompletedMusic) {
            gameCompletedMusic.currentTime = 0;
        }
    }

    const playAudio = () => {
        switch(music) {
            case titleScreenMusic:
                if (music.currentTime > 94.68) {
                    music.currentTime = 0;
                }
            break;

            case gameSelect:
                if (music.currentTime > 56.115761) {
                    music.currentTime = 0;
                }

            break;

            case gameOverMusic:
                if (music.currentTime >= gameOverMusic.duration-0.01) {
                    music.currentTime = 0;
                }
            break;

            case gameCompletedMusic:
                if (music.currentTime >= 55.216129) {
                    music.currentTime = 28.39297;
                }
            break;

            default:
                null;
            break;
        }

        if (state == "Title Screen") {
            music = titleScreenMusic;
        } else if (state == "Game Select") {
            if (graphics.globalAlpha == 1) {
                if (music != gameSelect) {
                    music.pause();
                    resetMusic();
                }

                music.volume = 1;
                music = gameSelect;
            } else if (music.volume > 0.02) {
                music.volume -= 0.02;
            }
        } else if (games.includes(state)) {
            let canStop = true;

            for (let i = 0; i < 7; i++) {
                if (grid[i].some(block => block != 0)) {
                    music.playbackRate = 1.5;
                    canStop = false;
                }
            }

            if (canStop) {
                music.playbackRate = 1;
            }

            if (graphics.globalAlpha >= 1) {
                if (music.src.indexOf("GameMusic") == -1 || music.currentTime == music.duration) {
                    let randInt = random(0, gameMusic.length-1);
                    gameMusic[randInt].currentTime = 0;
                    music = gameMusic[randInt];
                }

                let marathonIndex = level%gameMusic.length;

                if (marathonIndex == 0) {
                    marathonIndex = 1;
                }

                if (state == "Marathon" && gameMusic.indexOf(music) != marathonIndex) {
                    if (music.volume > 0.003 && level != 1) {
                        music.volume -= 0.003;
                    } else {
                        music.volume = 1;
                        music.pause();
                        resetMusic();
                        gameMusic[marathonIndex].currentTime = 0;
                        music = gameMusic[marathonIndex];
                    }
                }
            } else if (music.volume > 0.02) {
                music.volume -= 0.02
            }
        } else if (state == "Game Complete") {
            if (graphics.globalAlpha >= 1 && !transition) {
                if (music != gameCompletedMusic) {
                    music.pause();
                    resetMusic();
                }

                music.volume = 1;
                music = gameCompletedMusic;
            } else if (music.volume > 0.02) {
                music.volume -= 0.02;
            }
        } else if (state == "Game Over") {
            if (graphics.globalAlpha >= 1 && !transition) {
                if (music != gameOverMusic) {
                    music.pause();
                    resetMusic();
                }

                music.volume = 1;
                music = gameOverMusic;
            } else if (music.volume > 0.02) {
                music.volume -= 0.02;
            }
        }

        if (music.src && music.currentTime == 0) {
            music.play();
        }
    }

    const update = () => {
        draw(blockSpeed*blockSpeedScale);
        playAudio();
        //draw(blockSize);

        requestAnimationFrame(update);
    }

    update();

    canvas.addEventListener("click", mouse => {
        let mouseX = mouse.offsetX;
        let mouseY = mouse.offsetY;

        let buttonHeight = height/(games.length*2);

        if (state == "Game Select") {
            for (let i = 0; i < games.length; i++) {
                if (mouseX >= width/2-100 && mouseX <= width/2+100 && mouseY >= i*(buttonHeight+25)+50 && mouseY <= i*(buttonHeight+25)+50+buttonHeight) {
                    if (graphics.globalAlpha >= 1) {
                        state = games[i];
                        transition = true;
                        reset();
                    }
                }
            }
        }
    })

    document.addEventListener("keydown", key => {
        if (state == "Title Screen") {
            transition = true;
        } else if (games.includes(state) && graphics.globalAlpha >= 1) {
            let moved = 0;

            if (key.keyCode == 32) {
                console.clear();
            } else if (key.keyCode == 40) {
                moved = blockSize;
                //blockSpeedScale = blockSize;
                downPressed = true;
            } else if (key.keyCode == 37 && isValid("left")) {
                currentCol--;
            } else if (key.keyCode == 39 && isValid("right")) {
                currentCol++;
            } else if (key.keyCode == 38) {
                try {
                    rotatePiece("clockwise");
                } catch (error) {
                    state = "Game Over"
                }
            } else if (key.keyCode == 88) {
                try {
                    rotatePiece("counter-clockwise");
                } catch(error) {
                    state = "Game Over"
                }
            } else if (key.keyCode == 16) {
                if (canHold) {
                    canHold = false;

                    let piece = 0;

                    for (let i = 0; i < currentPiece.length; i++) {
                        for (let j = 0; j < currentPiece[i].length; j++) {
                            if (currentPiece[i][j] != 0) {
                                piece = currentPiece[i][j]
                            }
                        }
                    }

                    if (pieceHolding.length != 0) {
                        currentPiece = pieceHolding;

                        currentRow = 0;
                        yPos = 0;

                        currentCol = Math.round((cols-currentPiece.length)/2);
                    } else {
                        nextPiece();
                    }

                    pieceHolding = [];

                    for (let i = 0; i < pieces[piece-1].length; i++) {
                        pieceHolding.push([]);
                        for (let j = 0; j < pieces[piece-1][i].length; j++) {
                            pieceHolding[i].push(pieces[piece-1][i][j]);
                        }
                    }
                }
            } else if (key.keyCode == 90) {
                findGhost(true);
            }

            if ([90,  88, 16, 37, 38, 39, 40].includes(key.keyCode)) {
                draw(moved);
            }
        } else if ((state == "Game Over" || state == "Game Complete") && graphics.globalAlpha >= 1 && key.keyCode == 13) {
            graphics.globalAlpha = 0;
            transition = false;
            state = "Game Select";
        }
    });

    document.addEventListener("keyup", key => {
        if (games.includes(state) && graphics.globalAlpha >= 1) {
            if (key.keyCode == 40) {   
                downPressed = false;
            }
        }
    });
}
