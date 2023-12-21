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
(function() {
	const random = (min, max) => {
		return Math.floor(Math.random() * (max-min+1)) + min;
	};

    let downPressed = false;
    let score = 0;
    let level = 1;
    let linesCleared = 0;
    let rotations = 0;
	const HTMLBoard = document.getElementById("tetrisBoard");
	const rows = 20;
	const cols = 10;

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
	const HTMLHold = document.getElementById("holdPieceBlock");
	const holdRows = 5;
	const holdCols = 5;

    let colors = ["#00f0f0", "#0000f0", "#f0a000", "#f0f000", "#00f000", "#a000f0", "#f00000"];
    const HTMLgameInfo = document.getElementById("gameInfo");
    const HTMLshowGhost = document.getElementById("showGhostCheckbox");
    const HTMLresetButton = document.getElementById("resetButton");

    let pieces = [  //I piece
                    [[0, 0, 0, 0],
                    [1, 1, 1, 1],
                    [0, 0, 0, 0],
                    [0, 0, 0, 0]],
    let showGhost = HTMLshowGhost.checked;

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
    HTMLshowGhost.addEventListener("change", () => {
        showGhost = HTMLshowGhost.checked;
    });

                    //Z Piece
                    [[7, 7, 0],
                    [0, 7, 7],
                    [0, 0, 0]]
    ];
	const tetrominoes = [
		//I Piece
		[
			[0, 0, 0, 0],
			[1, 1, 1, 1],
			[0, 0, 0, 0],
			[0, 0, 0, 0]
		],

		//J Piece
		[
			[2, 0, 0],
			[2, 2, 2],
			[0, 0, 0]
		],

		//L Piece
		[
			[0, 0, 3],
			[3, 3, 3],
			[0, 0, 0]
		],

		//O Piece
		[
			[4, 4],
			[4, 4]
		],

		//S Piece
		[
			[0, 5, 5],
			[5, 5, 0],
			[0, 0, 0]
		],

		//Z Piece

		[
			[6, 6, 0],
			[0, 6, 6],
			[0, 0, 0]
		],

		//T Piece
		[
			[0, 7, 0],
			[7, 7, 7],
			[0, 0, 0]
		],
	];

    const colors = ["cyan", "blue", "orange", "yellow", "green", "red", "magenta"];

	let level = 1;
	let score = 0;
	let lines = 0;

    const speeds = [60, 53, 48, 43, 38, 33, 28, 23, 18, 13, 8, 6, 5, 5, 5, 4, 4, 4, 3, 3, 3, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2];

	let currentPos = random(0, tetrominoes.length-1);
	//currentPos = 0;
	let currentTetromino = JSON.parse(JSON.stringify(tetrominoes[currentPos]));
	let currentRow = -1;
	//let currentRow = 0;
	let currentCol = cols/2-Math.ceil(currentTetromino[0].length/2);

    let bag7a = [];
    let bag7b = [];

    while (bag7a.length < pieces.length) {
        let pieceNum = random(0, pieces.length-1);
    while (bag7a.length < tetrominoes.length) {
        let pieceNum = random(0, tetrominoes.length-1);

        if (bag7a.indexOf(pieces[pieceNum]) == -1) {
            bag7a.push(pieces[pieceNum]);
        if (bag7a.indexOf(pieceNum) == -1) {
            bag7a.push(pieceNum);
        }
    }

    while (bag7b.length < pieces.length) {
        let pieceNum = random(0, pieces.length-1);
    while (bag7b.length < tetrominoes.length) {
        let pieceNum = random(0, tetrominoes.length-1);

        if (bag7b.indexOf(pieces[pieceNum]) == -1) {
            bag7b.push(pieces[pieceNum]);
        if (bag7b.indexOf(pieceNum) == -1) {
            bag7b.push(pieceNum);
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
    for (let i = 0; i < bag7a.length; i++) {
        currentPiece.push(JSON.parse(JSON.stringify(tetrominoes[bag7a[i]])));
    }

    const findState = () => {
        if (state == "Game Over") {
            grid.forEach(row => row.fill(0));
        }
    }
	let canHold = true;

    const clearLine = () => {
        let totalLines = 0;
	let holdPiece = [];
    let holdPos = 0;

        grid.forEach((row, j) => {
            if (row.every(block => block != 0)) {
                row.forEach((block, i, arr) => {
                    arr[i] = 0;
                });
	let startRow = 0;
	let endRow = 0;
	let startCol = 0;
	let endCol = 0;

                totalLines++;
	//let zPressed
	let xPressed = false;
	//let shiftPressed

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
	let rotations = 0;

        level = Math.floor(linesCleared/10)+1;
    const look = (str, substr) => {
        return isNaN(str) && str.indexOf(substr) > -1;
    }

    const isValid = direction => {
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
            for (let i = 0; i < currentTetromino.length; i++) {
                firstCol.push(currentTetromino[i][startCol]);
            }

            return firstCol.every(block => block == 0 || (startingPosition+currentCol >= 0)) &&
                  currentPiece.every((row, i, arr) => row.every((block, j) => {
                    let comparison = i+currentRow;

                    if (comparison >= grid.length) {
                        comparison--;
                    }

                    return block == 0 || (j+currentCol-1 >= 0 && grid[i+currentRow][j+currentCol-1] == 0);
            return firstCol.every(block => block == 0 || (startCol+currentCol >= 0)) &&
                  currentTetromino.every((row, i, arr) => row.every((block, j) => {
                    return block == 0 || j > startCol || (j+currentCol-1 >= 0 && (board[i+currentRow][j+currentCol-1] == 0 || look(board[i+currentRow][j+currentCol-1], "#")));
                }));

        } else if (direction == "right") {
            let endingPosition = currentPiece.length-1;

            let lastCol = [];

            for (let j = 0; j < currentPiece.length; j++) {
                lastCol.push(currentPiece[j][endingPosition]);
            for (let j = 0; j < currentTetromino.length; j++) {
                lastCol.push(currentTetromino[j][lastCol]);
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
            return lastCol.every(block => block == 0 || (endCol+currentCol < board[0].length)) &&
                  currentTetromino.every((row, i, arr) => row.every((block, j) => {
                    return block == 0 || j < endCol || (j+currentCol+1 < board[0].length && (board[i+currentRow][j+currentCol+1] == 0 || look(board[i+currentRow][j+currentCol+1], "#")));
                }));
        }

        let endingPosition = currentPiece.length-1;
        let endingPosition = currentTetromino.length-1;

        let lastRow = currentPiece[endingPosition];
        let lastRow = currentTetromino[endingPosition];

        while (lastRow.every(block => block == 0)) {
            endingPosition--;
            lastRow = currentPiece[endingPosition];
            lastRow = currentTetromino[endingPosition];
        }

        return lastRow.every(block => block == 0 || currentRow+endingPosition < grid.length) &&
               currentPiece.every((row, i) => row.every((block, j) => block == 0 || (i+currentRow+1 < grid.length && grid[i+currentRow+1][j+currentCol] == 0)));
        return lastRow.every(block => block == 0 || currentRow+endingPosition < board.length) && 
        	currentTetromino.every((row, i) => row.every((block, j) => block == 0 || (i+currentRow+1 < board.length && (board[i+currentRow+1][j+currentCol] == 0 || look(board[i+currentRow+1][j+currentCol], "#")))));
    }

    const translatePiece = (col, row) => {
        currentRow += row;
        yPos += blockSize*row;
        currentCol += col;
    }

    const rotatePiece = direction => {
        let copyPiece = [];
    	let copyPiece = [];

        for (let i = 0; i < currentPiece.length; i++) {
    	for (let i = 0; i < currentTetromino.length; i++) {
            copyPiece.push([]);

            for (let j = 0; j < currentPiece[i].length; j++) {
                copyPiece[i].push(currentPiece[i][j]);
            for (let j = 0; j < currentTetromino[i].length; j++) {
                copyPiece[i].push(currentTetromino[i][j]);
            }
        }

        for (let i = 0; i < currentPiece.length; i++) {
            for (let j = 0; j < currentPiece[i].length; j++) {
                if (direction == "clockwise") {
                    currentPiece[i][j] = copyPiece[currentPiece.length-j-1][i];
        for (let i = 0; i < currentTetromino.length; i++) {
            for (let j = 0; j < currentTetromino[i].length; j++) {
                if (direction == "c") {
                    currentTetromino[i][j] = copyPiece[currentTetromino.length-j-1][i];
                } else {
                    currentPiece[i][j] = copyPiece[j][currentPiece[0].length-i-1];
                    currentTetromino[i][j] = copyPiece[j][currentTetromino[0].length-i-1];
                }
            }
        }

        let sign = 1;

        if (direction == "clockwise") {
        if (direction == "c") {
            rotations++;
        } else {
            rotations--;
@@ -285,48 +211,47 @@ window.onload = () => {
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
        findBounds();

        while (currentPiece.every((row, i) => currentPiece[i][startCol] == 0)) {
            startCol++;
        }

        while (currentPiece.every((row, i) => currentPiece[i][endCol] == 0)) {
            endCol--;
        }
        board.forEach((row, i, arr) => {
            arr[i].forEach((block, j) => {
                if (board[i][j] >= 1 && board[i][j] <= 7) {
                    board[i][j] = 0;
                }
            });
        });

        let wallKickCondition = currentRow+endRow > grid.length-1 || currentCol+startCol < 0 || currentCol+endCol > grid[0].length-1;
        let wallKickCondition = currentRow+endRow > board.length-1 || currentCol+startCol < 0 || currentCol+endCol > board[0].length-1;

        for (let i = 0; i < currentPiece.length; i++) {
            for (let j = 0; j < currentPiece[i].length; j++) {
                if (currentPiece[i][j] != 0) {
                    if (!wallKickCondition && grid[i+currentRow][j+currentCol] != 0) {
        /*for (let i = 0; i < currentTetromino.length; i++) {
            for (let j = 0; j < currentTetromino[i].length; j++) {
                if (currentTetromino[i][j] != 0) {
                    if (!wallKickCondition && board[i+currentRow][j+currentCol] != 0) {
                        wallKickCondition = true;
                    }
                }
            }
        }
        }*/

        currentTetromino.forEach((row, i, arr) => {
        	arr[i].forEach((block, j) => {
        		if (block != 0) {
        			if (!wallKickCondition && board[i+currentRow][j+currentCol] != 0) {
                        wallKickCondition = true;
                    }
        		}
        	});
        });

        let wallKickCase = 1;

        let translateX = 0;
        let translateY = 0;

        while (wallKickCondition && wallKickCase < 5) {
            if (currentPiece.length < 4) {
            if (currentTetromino.length < 4) {
                if (rotations%4 == 0) {
                    if (direction == "clockwise") {
                    if (direction == "c") {
                        if (wallKickCase == 1) {
                            translateX = -1;
                        } else if (wallKickCase == 2) {
@@ -364,7 +289,7 @@ window.onload = () => {
                        translateY = 2;
                    }
                } else if (rotations%4 == 2) {
                    if (direction == "clockwise") {
                    if (direction == "c") {
                        if (wallKickCase == 1) {
                            translateX = 1;
                        } else if (wallKickCase == 2) {
@@ -405,27 +330,27 @@ window.onload = () => {
            } else {
                if (rotations%4 == 0) {
                    if (wallKickCase == 1) {
                        if (direction == "clockwise") {
                        if (direction == "c") {
                            translateX = 1;
                        } else {
                            translateX = 2;
                        }
                    } else if (wallKickCase == 2) {
                        if (direction == "clockwise") {
                        if (direction == "c") {
                            translateX = -2;
                        } else {
                            translateX = -1;
                        }
                    } else if (wallKickCase == 3) {
                        if (direction == "clockwise") {
                        if (direction == "c") {
                            translateX = 1;
                            translateY = 2;
                        } else {
                            translateX = 2;
                            translateY = -1;
                        }
                    } else {
                        if (direction == "clockwise") {
                        if (direction == "c") {
                            translateX = -2;
                            translateY = -1;
                        } else {
@@ -435,27 +360,27 @@ window.onload = () => {
                    }
                } else if (rotations%4 == 1) {
                    if (wallKickCase == 1) {
                        if (direction == "clockwise") {
                        if (direction == "c") {
                            translateX = -2;
                        } else {
                            translateX = 1;
                        }
                    } else if (wallKickCase == 2) {
                        if (direction == "clockwise") {
                        if (direction == "c") {
                            translateX = 1;
                        } else {
                            translateX = -2;
                        }
                    } else if (wallKickCase == 3) {
                        if (direction == "clockwise") {
                        if (direction == "c") {
                            translateX = -2;
                            translateY = 1;
                        } else {
                            translateX = 1;
                            translateY = 2;
                        }
                    } else {
                        if (direction == "clockwise") {
                        if (direction == "c") {
                            translateX = 1;
                            translateY = -2;
                        } else {
@@ -465,27 +390,27 @@ window.onload = () => {
                    }
                } else if (rotations%4 == 2) {
                    if (wallKickCase == 1) {
                        if (direction == "clockwise") {
                        if (direction == "c") {
                            translateX = -1;
                        } else {
                            translateX = -2;
                        }
                    } else if (wallKickCase == 2) {
                        if (direction == "clockwise") {
                        if (direction == "c") {
                            translateX = 2;
                        } else {
                            translateX = 1;
                        }
                    } else if (wallKickCase == 3) {
                        if (direction == "clockwise") {
                        if (direction == "c") {
                            translateX = -1;
                            translateY = -2;
                        } else {
                            translateX = -2;
                            translateY= 1;
                        }
                    } else {
                        if (direction == "clockwise") {
                        if (direction == "c") {
                            translateX = 2;
                            translateY = 1;
                        } else {
@@ -495,27 +420,27 @@ window.onload = () => {
                    }
                } else {
                    if (wallKickCase == 1) {
                        if (direction == "clockwise") {
                        if (direction == "c") {
                            translateX = 2;
                        } else {
                            translateX = -1;
                        }
                    } else if (wallKickCase == 2) {
                        if (direction == "clockwise") {
                        if (direction == "c") {
                            translateX = -1;
                        } else {
                            translateX = 2;
                        }
                    } else if (wallKickCase == 3) {
                        if (direction == "clockwise") {
                        if (direction == "c") {
                            translateX = 2;
                            translateY = -1;
                        } else {
                            translateX = -1;
                            translateY= -2;
                        }
                    } else {
                        if (direction == "clockwise") {
                        if (direction == "c") {
                            translateX = -1;
                            translateY = 2;
                        } else {
@@ -528,12 +453,12 @@ window.onload = () => {

            translatePiece(translateX, translateY);

            wallKickCondition = currentRow+endRow > grid.length-1 || currentCol+startCol < 0 || currentCol+endCol > grid[0].length-1;
            wallKickCondition = currentRow+endRow > board.length-1 || currentCol+startCol < 0 || currentCol+endCol > board[0].length-1;

            for (let i = 0; i < currentPiece.length; i++) {
                for (let j = 0; j < currentPiece[i].length; j++) {
                    if (currentPiece[i][j] != 0) {
                        if (!wallKickCondition && grid[i+currentRow][j+currentCol] != 0) {
            for (let i = 0; i < currentTetromino.length; i++) {
                for (let j = 0; j < currentTetromino[i].length; j++) {
                    if (currentTetromino[i][j] != 0) {
                        if (!wallKickCondition && i + currentRow >= 0 && board[i+currentRow][j+currentCol] != 0) {
                            wallKickCondition = true;
                        }
                    }
@@ -543,842 +468,525 @@ window.onload = () => {
            if (wallKickCondition) {
                wallKickCase++;
                translatePiece(-translateX, -translateY);
                translateX = 0;
                translateY = 0;
            }
        }

        if (wallKickCase > 4) {
            currentPiece = copyPiece;
        	currentTetromino = copyPiece;
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
        findBounds();
    }

    const findGhost = drop => {
        let startingPosition = 0;
	const findBounds = () => {
		let foundStartRow = false;
		let foundStartCol = false;

        while (currentPiece[startingPosition].every(block => block == 0)) {
            startingPosition++;
        }
		currentTetromino.forEach((row, i, arr) => {
			if (row.some((num) => num != 0)) {
				if (!foundStartRow) {
					startRow = i;

        let endingPosition = currentPiece.length-1;
					foundStartRow = true;
				}

        let lastRow = currentPiece[endingPosition];
				endRow = i;
			}
		});

        while (lastRow.every(block => block == 0)) {
            endingPosition--;
            lastRow = currentPiece[endingPosition];
        }
		currentTetromino.forEach((row, i, arr) => {
			for (let j = 0; j < arr.length; j++) {
				if (currentTetromino[j][i] != 0) {
					if (!foundStartCol) {
						startCol = i;

        let lastPosition = currentRow;
						foundStartCol = true;
					}

        let collision = false;
					endCol = i;
				}
			}
		});
	}

        while (!collision) {
            let validPieces = 0;
	findBounds();

            for (let i = lastPosition; i < lastPosition+currentPiece.length; i++) {
                if (currentPiece[i-lastPosition].every(block => block == 0)) {
                    continue;
                }
	const createBoard = (rows, cols) => {
		const board = [];

                for (let j = currentCol; j < currentCol+currentPiece[0].length; j++) {
                    if (i < grid.length && currentPiece[i-lastPosition][j-currentCol] != 0 && grid[i][j] == 0) {
                        validPieces++;
                    }
                }
            }
		for (let i = 0; i < rows; i++) {
			board.push([]);

            if (validPieces == 4) {
                lastPosition++;
            } else {
                collision = true;
            }
        }
			for (let j = 0; j < cols; j++) {
				board[i].push(0);
			}
		}

        lastPosition += startingPosition-1;
		return board;
	};

        //console.log(lastPosition, startingPosition);
	const board = createBoard(rows, cols);
	const holdBoard = createBoard(holdRows, holdCols);

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
    const dropBoard = row => {
        for (let i = row; i >= 1; i--) {
            let tempRow = board[i].slice();
            board[i].fill(0);
            board[i+1] = tempRow;
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
        lines++;
    }

    const updatePiece = (increment) => {
        findGhost(false);
    const clearLine = () => {
        let totalLines = 0;

        if (canIncreaseSpeed) {
            blockSpeedIncrement = level;
            blockSpeedScale = 1+blockSpeedIncrement;
        }
        board.forEach((row, i, arr) => {
            if (arr[i].every(block => look(block, "P"))) {
                arr[i].forEach((block, j) => {
                    arr[i][j] = 0;
                });

        if (isValid("vertical")) {
            yPos += increment;
            currentRow = Math.floor(yPos/blockSize);
                totalLines++;

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
                dropBoard(i-1);
            }
        });

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
        if (totalLines == 1) {
            score += 100*level;
        } else if (totalLines == 2) {
            score += 300*level;
        } else if (totalLines == 3) {
            score += 600*level;
        } else if (totalLines == 4) {
            score += 1000*level;
        }

        level = Math.floor(lines/10)+1;
    }

    const drawPiece = () => {
        let happened = false;
	const nextPiece = () => {
        let thePiece = bag7a.pop();

        for (let i = 0; i < currentPiece.length; i++) {
            if (happened) {
                break;
            }

            for (let j = 0; j < currentPiece[i].length; j++) {
                if (happened) {
                    break;
                }
        if (bag7a.length == 0) {
            bag7a = bag7b;
            bag7b = [];

                if (currentPiece[i][j] != 0) {
                    graphics.fillStyle = colors[currentPiece[i][j]-1];
                    happened = true;
                    break;
                }
            }
        }
            while (bag7b.length < tetrominoes.length) {
                let pieceNum = random(0, tetrominoes.length-1);

        for (let i = 0; i < currentPiece.length; i++) {
            for (let j = 0; j < currentPiece[i].length; j++) {
                if (currentPiece[i][j] != 0) {
                    graphics.fillRect((j+currentCol)*blockSize, (i+currentRow)*blockSize, blockSize, blockSize);
                    //graphics.fillRect((j+currentCol)*blockSize, Math.floor(yPos+(i*blockSize)), blockSize, blockSize);
                if (bag7b.indexOf(pieceNum) == -1) {
                    bag7b.push(pieceNum);
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
        for (let i = 0; i < bag7a[0].length; i++) {
            currentPiece.push([]);

        if (!invisible) {
            for (let i = 0; i < rows; i++) {
                for (let j = 0; j < cols; j++) {
                    if (grid[i][j] != 0) {
                        graphics.fillStyle = colors[grid[i][j]-1];
                        graphics.fillRect(j*blockSize, i*blockSize, blockSize, blockSize);
                    }
                }
            for (let j = 0; j < bag7a[0][i].length; j++) {
                currentPiece[i].push(bag7a[0][i][j]);
            }
        }
    }

    let showTimer = false;
    let time = 0;
		currentTetromino = JSON.parse(JSON.stringify(tetrominoes[thePiece]));
        currentPos = thePiece;
		currentRow = 0;
		currentCol = cols/2-Math.ceil(currentTetromino[0].length/2);

		findBounds();

    const reset = () => {
        blockSpeed = .25;
        blockSpeedScale = 1;
        blockSpeedIncrement = 0;
        yPos = 0;
        timeToLock = 100;
        canIncreaseSpeed = true;
		canHold = true;
	};

        time = 0
        showTimer = false;
    const findGhost = drop => {
        let lastPosition = currentRow;

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
        let collision = false;

        grid.forEach((row, i, arr) => {
            arr[i].fill(0);
        board.forEach((row, i, arr) => {
            arr[i].forEach((block, j) => {
                if (block >= 1 && block <= 7) {
                    board[i][j] = 0;
                }
            });
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
        while (!collision) {
            let validPieces = 0;

                            let yAlign = 170-startingPosition*blockSize;
            for (let i = lastPosition; i < lastPosition+currentTetromino.length; i++) {
                if (currentTetromino[i-lastPosition].every(block => block == 0)) {
                    continue;
                }

                            ctx.fillRect(Math.floor(k*blockSize+width/2-blockSize*bag7a[i][0].length/2), Math.floor((j+shiftY)*blockSize+yAlign+blockSize*i), blockSize, blockSize);
                        }
                for (let j = currentCol; j < currentCol+currentTetromino[0].length; j++) {
                    if (i < board.length && currentTetromino[i-lastPosition][j-currentCol] != 0 && (board[i][j] == 0 || look(board[i][j], "#"))) {
                        validPieces++;
                    }
                }
            }

                shiftY += endingPosition-startingPosition+1;
            if (validPieces == 4) {
                lastPosition++;
            } else {
                collision = true;
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
        lastPosition += startRow-1;

                            while (bag7b[i][endingPosition].every(block => block == 0)) {
                                endingPosition--;
                            }

                            let yAlign = 170-startingPosition*blockSize;

                            ctx.fillRect(Math.floor(k*blockSize+width/2-blockSize*bag7b[i][0].length/2), Math.floor((j+shiftY)*blockSize+yAlign+blockSize*(i+bag7a.length)), blockSize, blockSize);
                        }
        if (showGhost) {
            /*for (let i = 0; i < currentTetromino.length; i++) {
                for (let j = 0; j < currentTetromino[i].length; j++) {
                    if (currentTetromino[i][j] != 0) {
                        graphics.globalAlpha = 0.5;
                        graphics.fillStyle = colors[currentTetromino[i][j]-1];
                        graphics.fillRect((j+currentCol)*blockSize, (lastPosition+i-startRow)*blockSize, blockSize, blockSize);
                        graphics.globalAlpha = 1;
                    }
                }
            }*/

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
            currentTetromino.forEach((row, i, arr) => {
                arr[i].forEach((block, j) => {
                    if (block != 0 && lastPosition+i-startRow >= 0) {
                        board[lastPosition+i-startRow][currentCol+j] = "#" + currentTetromino[i][j];
                    }
                });
            });

                    let endingPosition = pieceHolding.length-1;

                    while (pieceHolding[endingPosition].every(block => block == 0)) {
                        endingPosition--;
            currentTetromino.forEach((row, i, arr) => {
                arr[i].forEach((block, j) => {
                    if (block >= 1 && block <= 7) {
                        board[i+currentRow][j+currentCol] = block;
                    }
                });
            });

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
            drawBoard();
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
        if (drop) {
            currentTetromino.forEach((row, i, arr) => {
                arr[i].forEach((block, j) => {
                    if (block != 0) {
                        try {
                            board[lastPosition+i-startRow][currentCol+j] = "P" + currentTetromino[i][j];
                        } catch (err) {

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
                        }
                    }
                });
            });

            lastState = state;
        } else if (state == "Big") {
            if (lastState != state) {
                blockSize *= 4;
            }
            nextPiece();

            lastState = state;
        }
            score += level*30;

        if (!showTimer) {
            time = 0;
            canHold = true;
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
	const updatePiece = () => {
		let timeToBePlaced = currentRow+endRow+1 >= rows;

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
		currentTetromino[endRow].forEach((block, i, arr) => {
			timeToBePlaced ||= block != 0 && currentRow+endRow+1 < rows && board[currentRow+endRow+1][i+currentCol] != 0 && !look(board[currentRow+endRow+1][i+currentCol], "#");
		});

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
        currentTetromino.forEach((row, i, arr) => {
            if (i < currentTetromino.length-1) {
                arr[i].forEach((block, j) => {
                    timeToBePlaced ||= block != 0 && currentRow+endRow+1 < rows && currentRow+startRow >= 0 && look(board[currentRow+i+1][currentCol+j], "P");
                });
            }
        }
    }

    let music = new Audio();
    let titleScreenMusic = new Audio("Sounds/TitleScreen.mp3");

    let gameSelect = new Audio("Sounds/GameSelect.mp3");

    let gameMusic = [];
        });

    let gameOverMusic = new Audio("Sounds/GameOver.mp3");
    let gameCompletedMusic = new Audio("Sounds/GameCompleted.mp3");
		if (!timeToBePlaced) {
			currentRow++;
		} else {
			currentTetromino.forEach((row, i, arr) => {
				arr[i].forEach((block, j) => {
					if (currentRow + i < rows && currentRow + i >= 0&& arr[i][j] >= 1 && arr[i][j] <= 7) {
						board[currentRow+i][currentCol+j] = "P" + arr[i][j];
					}
				});
			});

			nextPiece();
		}
	}

	const drawBoard = () => {
        HTMLBoard.innerHTML = "";

		for (let i = 0; i < cols; i++) {
            HTMLBoard.innerHTML += " _";
		}

		for (let i = 0; i < rows; i++) {
            HTMLBoard.innerHTML += "\n|";

			for (let j = 0; j < cols; j++) {
				if (j < cols-1) {
					if (board[i][j] == 0) {
                        HTMLBoard.innerHTML += "- ";
					} else if (board[i][j] <= tetrominoes.length) {
                        HTMLBoard.innerHTML += "@ ";
					} else if (look(board[i][j], "P")) {
                        let text = colors[board[i][j][1]-1];
                        HTMLBoard.innerHTML += `<strong class="${text}">M </strong>`;
					} else if (look(board[i][j], "#")) {
                        let text = colors[board[i][j][1]-1];
                        HTMLBoard.innerHTML += `<bold class="${text}"># </bold>`;
                    }
				} else {
					if (board[i][j] == 0) {
                        HTMLBoard.innerHTML += "-";
					} else if (board[i][j] <= tetrominoes.length) {
                        HTMLBoard.innerHTML += "@";
					} else if (look(board[i][j], "P")) {
                        let text = colors[board[i][j][1]-1];
                        HTMLBoard.innerHTML += `<strong class="${text}">M</strong>`;
					} else if (look(board[i][j], "#")) {
                        let text = colors[board[i][j][1]-1];
                        HTMLBoard.innerHTML += `<bold class="${text}">#</bold>`;
                    }
				}
			}

    for (let i = 1; i < 12; i++) {
        gameMusic.push(new Audio());
        gameMusic[i-1].src = "Sounds/GameMusic"+i+".mp3";
    }
            HTMLBoard.innerHTML += "|";
		}

    music.ontimeupdate = function() {
        /*switch(this.src) {
        HTMLBoard.innerHTML += "\n";

        case "Sounds/GameSelect.mp3":
            if (this.currentTime > 56.115761) {
                this.currentTime = 0;
            }
		for (let i = 0; i < cols; i++) {
            HTMLBoard.innerHTML += " \u203E";
		}

            break;
        HTMLBoard.innerHTML = HTMLBoard.innerHTML.replace(/\|/g, `<strong>|</strong>`).replace(/@/g, `<strong class="${colors[currentPos]}">@</strong>`);

        }*/
        console.clear();
        console.log(JSON.parse(JSON.stringify(HTMLBoard.textContent)));
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
	const updateBoard = () => {
		board.forEach((row, i, arr) => {
			arr[i].forEach((block, j) => {
				if (!look(arr[i][j], "P")) {
					arr[i][j] = 0;
				}
			});
		});

		currentTetromino.forEach((row, i, arr) => {
			arr[i].forEach((block, j) => {
				if (currentRow + i < rows) {
					if (arr[i][j] != 0) {
						board[currentRow+i][currentCol+j] = arr[i][j];
					}
				}
			});
		});

        drawBoard();
	};

	const drawHoldPiece = () => {
		HTMLHold.textContent = "\nHold Piece\n";

		for (let i = 0; i < holdCols; i++) {
			HTMLHold.textContent += " _";
		}

		for (let i = 0; i < holdRows; i++) {
			HTMLHold.textContent += "\n|";

			for (let j = 0; j < holdCols; j++) {
				if (j < holdCols-1) {
					if (holdBoard[i][j] == 0) {
						HTMLHold.textContent += "- ";
					} else if (holdBoard[i][j] <= tetrominoes.length) {
						HTMLHold.textContent += "@ ";
					}
				} else {
					if (holdBoard[i][j] == 0) {
						HTMLHold.textContent += "-";
					} else if (holdBoard[i][j] <= tetrominoes.length) {
						HTMLHold.textContent += "@";
					}
				}
			}

			HTMLHold.textContent += "|";
		}

		HTMLHold.textContent += "\n";

		for (let i = 0; i < holdCols; i++) {
			HTMLHold.textContent += " \u203E";
		}

		HTMLHold.innerHTML = HTMLHold.textContent.replace(/@/g, `<strong class="${colors[holdPos]}">@</strong>`);
	};

	const updateHoldPiece = () => {
		holdBoard.forEach((row, i, arr) => {
			arr[i].forEach((block, j) => {
				if (!look(arr[i][j], "P")) {
					arr[i][j] = 0;
				}
			});
		});

		holdPiece.forEach((row, i, arr) => {
			arr[i].forEach((block, j) => {
				if (arr[i][j] != 0) {
					holdBoard[i+1][j+1] = arr[i][j];
				}
			});
		});

		drawHoldPiece();
	};

	drawHoldPiece();

    const drawGameInfo = () => {
        HTMLgameInfo.textContent = "\n";

        HTMLgameInfo.textContent += `Level: ${level}
Score: ${score}
Lines: ${lines}`;
    }

    const playAudio = () => {
        switch(music) {
            case titleScreenMusic:
                if (music.currentTime > 94.68) {
                    music.currentTime = 0;
                }
            break;
	const draw = () => {
		updatePiece();
		updateBoard();
        drawGameInfo();
        findGhost();
	}

	const update = () => {
		let frame = requestAnimationFrame(update);

		if ((level-1 < speeds.length && frame%speeds[level-1]-1 == 0) || level-1 >= speeds.length) {
			draw();
		}
	};

	document.addEventListener("keydown", function(key) {
		if (key.keyCode == 37 && isValid("left")) {
			currentCol--;
		} else if (key.keyCode == 39 && isValid("right")) {
			currentCol++;
		} else if (key.keyCode == 38) {
			rotatePiece("c");
		} else if (key.keyCode == 88) {
			rotatePiece("cc");
		} else if (key.keyCode == 40) {
            draw();
            score += level;
        } else if (key.keyCode == 16) {
        	if (canHold) {
                let length = holdPiece.length;

                let hold = JSON.parse(JSON.stringify(holdPiece));
                holdPiece = JSON.parse(JSON.stringify(tetrominoes[currentPos]));

                if (length == 0) {
                    holdPos = currentPos;

                    currentTetromino = holdPiece;

                    currentRow = 0;
                    currentCol = Math.round((cols-currentTetromino.length)/2);

                    nextPiece();
                } else {
                    let temp = currentPos;

            case gameSelect:
                if (music.currentTime > 56.115761) {
                    music.currentTime = 0;
                }
                    currentPos = holdPos;
                    holdPos = temp;

            break;
                	currentTetromino = hold;

            case gameOverMusic:
                if (music.currentTime >= gameOverMusic.duration-0.01) {
                    music.currentTime = 0;
                    currentRow = 0;
                    currentCol = Math.round((cols-currentTetromino.length)/2);
                }
            break;

            case gameCompletedMusic:
                if (music.currentTime >= 55.216129) {
                    music.currentTime = 28.39297;
                }
            break;
                updateHoldPiece();
                findBounds();

            default:
                null;
            break;
                canHold = false;
            }
        } else if (key.keyCode == 90) {
            findGhost(true);
        }

        if (state == "Title Screen") {
            music = titleScreenMusic;
        } else if (state == "Game Select") {
            if (graphics.globalAlpha == 1) {
                if (music != gameSelect) {
                    music.pause();
                    resetMusic();
                }
        clearLine();
		updateBoard();
        findGhost();
	});

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
    HTMLresetButton.onclick = () => {
        board.forEach((row, i, arr) => {
            arr[i].forEach((block, j) => {
                arr[i][j] = 0;
            });
        });

            if (canStop) {
                music.playbackRate = 1;
            }
        holdBoard.forEach((row, i, arr) => {
            arr[i].forEach((block, j) => {
                arr[i][j] = 0;
            });
        });

            if (graphics.globalAlpha >= 1) {
                if (music.src.indexOf("GameMusic") == -1 || music.currentTime == music.duration) {
                    let randInt = random(0, gameMusic.length-1);
                    gameMusic[randInt].currentTime = 0;
                    music = gameMusic[randInt];
                }
        drawHoldPiece();

                let marathonIndex = level%gameMusic.length;
        level = 1;
        lines = 0;
        score = 0;

                if (marathonIndex == 0) {
                    marathonIndex = 1;
                }
        currentPos = random(0, tetrominoes.length-1);
        currentTetromino = JSON.parse(JSON.stringify(tetrominoes[currentPos]));
        currentRow = 0;
        currentCol = cols/2-Math.ceil(currentTetromino[0].length/2);

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
        bag7a = [];
        bag7b = [];

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
        while (bag7a.length < tetrominoes.length) {
            let pieceNum = random(0, tetrominoes.length-1);

                music.volume = 1;
                music = gameOverMusic;
            } else if (music.volume > 0.02) {
                music.volume -= 0.02;
            if (bag7a.indexOf(pieceNum) == -1) {
                bag7a.push(pieceNum);
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
        while (bag7b.length < tetrominoes.length) {
            let pieceNum = random(0, tetrominoes.length-1);

        if (state == "Game Select") {
            for (let i = 0; i < games.length; i++) {
                if (mouseX >= width/2-100 && mouseX <= width/2+100 && mouseY >= i*(buttonHeight+25)+50 && mouseY <= i*(buttonHeight+25)+50+buttonHeight) {
                    if (graphics.globalAlpha >= 1) {
                        state = games[i];
                        transition = true;
                        reset();
                    }
                }
            if (bag7b.indexOf(pieceNum) == -1) {
                bag7b.push(pieceNum);
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
                rotatePiece("clockwise");
            } else if (key.keyCode == 88) {
                rotatePiece("counter-clockwise");
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
        currentPiece = [];

                    pieceHolding = [];
        for (let i = 0; i < bag7a.length; i++) {
            currentPiece.push(JSON.parse(JSON.stringify(tetrominoes[bag7a[i]])));
        }

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
        canHold = true;
        holdPiece = [];
        holdPos = 0;

            if ([90,  88, 16, 37, 38, 39, 40].includes(key.keyCode)) {
                draw(moved);
            }
        } else if ((state == "Game Over" || state == "Game Complete") && graphics.globalAlpha >= 1 && key.keyCode == 13) {
            graphics.globalAlpha = 0;
            transition = false;
            state = "Game Select";
        }
    });
        draw();
    }

    document.addEventListener("keyup", key => {
        if (games.includes(state) && graphics.globalAlpha >= 1) {
            if (key.keyCode == 40) {   
                downPressed = false;
            }
        }
    });
}
	update();
})();
