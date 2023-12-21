"use strict";
(function() {
	const random = (min, max) => {
		return Math.floor(Math.random() * (max-min+1)) + min;
	};

	const HTMLBoard = document.getElementById("tetrisBoard");
	const rows = 20;
	const cols = 10;

	const HTMLHold = document.getElementById("holdPieceBlock");
	const holdRows = 5;
	const holdCols = 5;

    const HTMLgameInfo = document.getElementById("gameInfo");
    const HTMLshowGhost = document.getElementById("showGhostCheckbox");
    const HTMLresetButton = document.getElementById("resetButton");

    let showGhost = HTMLshowGhost.checked;

    HTMLshowGhost.addEventListener("change", () => {
        showGhost = HTMLshowGhost.checked;
    });

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

    while (bag7a.length < tetrominoes.length) {
        let pieceNum = random(0, tetrominoes.length-1);

        if (bag7a.indexOf(pieceNum) == -1) {
            bag7a.push(pieceNum);
        }
    }

    while (bag7b.length < tetrominoes.length) {
        let pieceNum = random(0, tetrominoes.length-1);

        if (bag7b.indexOf(pieceNum) == -1) {
            bag7b.push(pieceNum);
        }
    }

    let currentPiece = [];

    for (let i = 0; i < bag7a.length; i++) {
        currentPiece.push(JSON.parse(JSON.stringify(tetrominoes[bag7a[i]])));
    }

	let canHold = true;

	let holdPiece = [];
    let holdPos = 0;

	let startRow = 0;
	let endRow = 0;
	let startCol = 0;
	let endCol = 0;

	//let zPressed
	let xPressed = false;
	//let shiftPressed

	let rotations = 0;

    const look = (str, substr) => {
        return isNaN(str) && str.indexOf(substr) > -1;
    }

	const isValid = direction => {
        if (direction == "left") {
            let firstCol = [];

            for (let i = 0; i < currentTetromino.length; i++) {
                firstCol.push(currentTetromino[i][startCol]);
            }

            return firstCol.every(block => block == 0 || (startCol+currentCol >= 0)) &&
                  currentTetromino.every((row, i, arr) => row.every((block, j) => {
                    return block == 0 || j > startCol || (j+currentCol-1 >= 0 && (board[i+currentRow][j+currentCol-1] == 0 || look(board[i+currentRow][j+currentCol-1], "#")));
                }));
        } else if (direction == "right") {
            let lastCol = [];

            for (let j = 0; j < currentTetromino.length; j++) {
                lastCol.push(currentTetromino[j][lastCol]);
            }

            return lastCol.every(block => block == 0 || (endCol+currentCol < board[0].length)) &&
                  currentTetromino.every((row, i, arr) => row.every((block, j) => {
                    return block == 0 || j < endCol || (j+currentCol+1 < board[0].length && (board[i+currentRow][j+currentCol+1] == 0 || look(board[i+currentRow][j+currentCol+1], "#")));
                }));
        }

        let endingPosition = currentTetromino.length-1;

        let lastRow = currentTetromino[endingPosition];

        while (lastRow.every(block => block == 0)) {
            endingPosition--;
            lastRow = currentTetromino[endingPosition];
        }

        return lastRow.every(block => block == 0 || currentRow+endingPosition < board.length) && 
        	currentTetromino.every((row, i) => row.every((block, j) => block == 0 || (i+currentRow+1 < board.length && (board[i+currentRow+1][j+currentCol] == 0 || look(board[i+currentRow+1][j+currentCol], "#")))));
    }

    const translatePiece = (col, row) => {
        currentRow += row;
        currentCol += col;
    }

    const rotatePiece = direction => {
    	let copyPiece = [];

    	for (let i = 0; i < currentTetromino.length; i++) {
            copyPiece.push([]);

            for (let j = 0; j < currentTetromino[i].length; j++) {
                copyPiece[i].push(currentTetromino[i][j]);
            }
        }

        for (let i = 0; i < currentTetromino.length; i++) {
            for (let j = 0; j < currentTetromino[i].length; j++) {
                if (direction == "c") {
                    currentTetromino[i][j] = copyPiece[currentTetromino.length-j-1][i];
                } else {
                    currentTetromino[i][j] = copyPiece[j][currentTetromino[0].length-i-1];
                }
            }
        }

        let sign = 1;

        if (direction == "c") {
            rotations++;
        } else {
            rotations--;
            sign = -1;
        }

        if (rotations < 0) {
            rotations = 3;
        }

        findBounds();

        board.forEach((row, i, arr) => {
            arr[i].forEach((block, j) => {
                if (board[i][j] >= 1 && board[i][j] <= 7) {
                    board[i][j] = 0;
                }
            });
        });

        let wallKickCondition = currentRow+endRow > board.length-1 || currentCol+startCol < 0 || currentCol+endCol > board[0].length-1;
        
        /*for (let i = 0; i < currentTetromino.length; i++) {
            for (let j = 0; j < currentTetromino[i].length; j++) {
                if (currentTetromino[i][j] != 0) {
                    if (!wallKickCondition && board[i+currentRow][j+currentCol] != 0) {
                        wallKickCondition = true;
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
            if (currentTetromino.length < 4) {
                if (rotations%4 == 0) {
                    if (direction == "c") {
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
                    if (direction == "c") {
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
                        if (direction == "c") {
                            translateX = 1;
                        } else {
                            translateX = 2;
                        }
                    } else if (wallKickCase == 2) {
                        if (direction == "c") {
                            translateX = -2;
                        } else {
                            translateX = -1;
                        }
                    } else if (wallKickCase == 3) {
                        if (direction == "c") {
                            translateX = 1;
                            translateY = 2;
                        } else {
                            translateX = 2;
                            translateY = -1;
                        }
                    } else {
                        if (direction == "c") {
                            translateX = -2;
                            translateY = -1;
                        } else {
                            translateX = -1;
                            translateY = 2;
                        }
                    }
                } else if (rotations%4 == 1) {
                    if (wallKickCase == 1) {
                        if (direction == "c") {
                            translateX = -2;
                        } else {
                            translateX = 1;
                        }
                    } else if (wallKickCase == 2) {
                        if (direction == "c") {
                            translateX = 1;
                        } else {
                            translateX = -2;
                        }
                    } else if (wallKickCase == 3) {
                        if (direction == "c") {
                            translateX = -2;
                            translateY = 1;
                        } else {
                            translateX = 1;
                            translateY = 2;
                        }
                    } else {
                        if (direction == "c") {
                            translateX = 1;
                            translateY = -2;
                        } else {
                            translateX = -2;
                            translateY = -1;
                        }
                    }
                } else if (rotations%4 == 2) {
                    if (wallKickCase == 1) {
                        if (direction == "c") {
                            translateX = -1;
                        } else {
                            translateX = -2;
                        }
                    } else if (wallKickCase == 2) {
                        if (direction == "c") {
                            translateX = 2;
                        } else {
                            translateX = 1;
                        }
                    } else if (wallKickCase == 3) {
                        if (direction == "c") {
                            translateX = -1;
                            translateY = -2;
                        } else {
                            translateX = -2;
                            translateY= 1;
                        }
                    } else {
                        if (direction == "c") {
                            translateX = 2;
                            translateY = 1;
                        } else {
                            translateX = 1;
                            translateY = -2;
                        }
                    }
                } else {
                    if (wallKickCase == 1) {
                        if (direction == "c") {
                            translateX = 2;
                        } else {
                            translateX = -1;
                        }
                    } else if (wallKickCase == 2) {
                        if (direction == "c") {
                            translateX = -1;
                        } else {
                            translateX = 2;
                        }
                    } else if (wallKickCase == 3) {
                        if (direction == "c") {
                            translateX = 2;
                            translateY = -1;
                        } else {
                            translateX = -1;
                            translateY= -2;
                        }
                    } else {
                        if (direction == "c") {
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

            wallKickCondition = currentRow+endRow > board.length-1 || currentCol+startCol < 0 || currentCol+endCol > board[0].length-1;
        
            for (let i = 0; i < currentTetromino.length; i++) {
                for (let j = 0; j < currentTetromino[i].length; j++) {
                    if (currentTetromino[i][j] != 0) {
                        if (!wallKickCondition && i + currentRow >= 0 && board[i+currentRow][j+currentCol] != 0) {
                            wallKickCondition = true;
                        }
                    }
                }
            }

            if (wallKickCondition) {
                wallKickCase++;
                translatePiece(-translateX, -translateY);
            }
        }

        if (wallKickCase > 4) {
        	currentTetromino = copyPiece;
            rotations -= sign;
        }

        findBounds();
    }

	const findBounds = () => {
		let foundStartRow = false;
		let foundStartCol = false;

		currentTetromino.forEach((row, i, arr) => {
			if (row.some((num) => num != 0)) {
				if (!foundStartRow) {
					startRow = i;

					foundStartRow = true;
				}

				endRow = i;
			}
		});

		currentTetromino.forEach((row, i, arr) => {
			for (let j = 0; j < arr.length; j++) {
				if (currentTetromino[j][i] != 0) {
					if (!foundStartCol) {
						startCol = i;

						foundStartCol = true;
					}

					endCol = i;
				}
			}
		});
	}

	findBounds();

	const createBoard = (rows, cols) => {
		const board = [];

		for (let i = 0; i < rows; i++) {
			board.push([]);

			for (let j = 0; j < cols; j++) {
				board[i].push(0);
			}
		}

		return board;
	};

	const board = createBoard(rows, cols);
	const holdBoard = createBoard(holdRows, holdCols);

    const dropBoard = row => {
        for (let i = row; i >= 1; i--) {
            let tempRow = board[i].slice();
            board[i].fill(0);
            board[i+1] = tempRow;
        }

        lines++;
    }

    const clearLine = () => {
        let totalLines = 0;

        board.forEach((row, i, arr) => {
            if (arr[i].every(block => look(block, "P"))) {
                arr[i].forEach((block, j) => {
                    arr[i][j] = 0;
                });

                totalLines++;

                dropBoard(i-1);
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

        level = Math.floor(lines/10)+1;
    }

	const nextPiece = () => {
        let thePiece = bag7a.pop();

        if (bag7a.length == 0) {
            bag7a = bag7b;
            bag7b = [];

            while (bag7b.length < tetrominoes.length) {
                let pieceNum = random(0, tetrominoes.length-1);

                if (bag7b.indexOf(pieceNum) == -1) {
                    bag7b.push(pieceNum);
                }
            }
        }

        for (let i = 0; i < bag7a[0].length; i++) {
            currentPiece.push([]);

            for (let j = 0; j < bag7a[0][i].length; j++) {
                currentPiece[i].push(bag7a[0][i][j]);
            }
        }

		currentTetromino = JSON.parse(JSON.stringify(tetrominoes[thePiece]));
        currentPos = thePiece;
		currentRow = 0;
		currentCol = cols/2-Math.ceil(currentTetromino[0].length/2);
			
		findBounds();

		canHold = true;
	};

    const findGhost = drop => {
        let lastPosition = currentRow;

        let collision = false;

        board.forEach((row, i, arr) => {
            arr[i].forEach((block, j) => {
                if (block >= 1 && block <= 7) {
                    board[i][j] = 0;
                }
            });
        });

        while (!collision) {
            let validPieces = 0;

            for (let i = lastPosition; i < lastPosition+currentTetromino.length; i++) {
                if (currentTetromino[i-lastPosition].every(block => block == 0)) {
                    continue;
                }

                for (let j = currentCol; j < currentCol+currentTetromino[0].length; j++) {
                    if (i < board.length && currentTetromino[i-lastPosition][j-currentCol] != 0 && (board[i][j] == 0 || look(board[i][j], "#"))) {
                        validPieces++;
                    }
                }
            }

            if (validPieces == 4) {
                lastPosition++;
            } else {
                collision = true;
            }
        }

        lastPosition += startRow-1;

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

            currentTetromino.forEach((row, i, arr) => {
                arr[i].forEach((block, j) => {
                    if (block != 0 && lastPosition+i-startRow >= 0) {
                        board[lastPosition+i-startRow][currentCol+j] = "#" + currentTetromino[i][j];
                    }
                });
            });

            currentTetromino.forEach((row, i, arr) => {
                arr[i].forEach((block, j) => {
                    if (block >= 1 && block <= 7) {
                        board[i+currentRow][j+currentCol] = block;
                    }
                });
            });

            drawBoard();
        }

        if (drop) {
            currentTetromino.forEach((row, i, arr) => {
                arr[i].forEach((block, j) => {
                    if (block != 0) {
                        try {
                            board[lastPosition+i-startRow][currentCol+j] = "P" + currentTetromino[i][j];
                        } catch (err) {

                        }
                    }
                });
            });

            nextPiece();

            score += level*30;

            canHold = true;
        }
    }

	const updatePiece = () => {
		let timeToBePlaced = currentRow+endRow+1 >= rows;

		currentTetromino[endRow].forEach((block, i, arr) => {
			timeToBePlaced ||= block != 0 && currentRow+endRow+1 < rows && board[currentRow+endRow+1][i+currentCol] != 0 && !look(board[currentRow+endRow+1][i+currentCol], "#");
		});

        currentTetromino.forEach((row, i, arr) => {
            if (i < currentTetromino.length-1) {
                arr[i].forEach((block, j) => {
                    timeToBePlaced ||= block != 0 && currentRow+endRow+1 < rows && currentRow+startRow >= 0 && look(board[currentRow+i+1][currentCol+j], "P");
                });
            }
        });

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

            HTMLBoard.innerHTML += "|";
		}

        HTMLBoard.innerHTML += "\n";

		for (let i = 0; i < cols; i++) {
            HTMLBoard.innerHTML += " \u203E";
		}

        HTMLBoard.innerHTML = HTMLBoard.innerHTML.replace(/\|/g, `<strong>|</strong>`).replace(/@/g, `<strong class="${colors[currentPos]}">@</strong>`);

        console.clear();
        console.log(JSON.parse(JSON.stringify(HTMLBoard.textContent)));
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

                    currentPos = holdPos;
                    holdPos = temp;

                	currentTetromino = hold;

                    currentRow = 0;
                    currentCol = Math.round((cols-currentTetromino.length)/2);
                }

                updateHoldPiece();
                findBounds();

                canHold = false;
            }
        } else if (key.keyCode == 90) {
            findGhost(true);
        }

        clearLine();
		updateBoard();
        findGhost();
	});

    HTMLresetButton.onclick = () => {
        board.forEach((row, i, arr) => {
            arr[i].forEach((block, j) => {
                arr[i][j] = 0;
            });
        });

        holdBoard.forEach((row, i, arr) => {
            arr[i].forEach((block, j) => {
                arr[i][j] = 0;
            });
        });

        drawHoldPiece();

        level = 1;
        lines = 0;
        score = 0;

        currentPos = random(0, tetrominoes.length-1);
        currentTetromino = JSON.parse(JSON.stringify(tetrominoes[currentPos]));
        currentRow = 0;
        currentCol = cols/2-Math.ceil(currentTetromino[0].length/2);

        bag7a = [];
        bag7b = [];

        while (bag7a.length < tetrominoes.length) {
            let pieceNum = random(0, tetrominoes.length-1);

            if (bag7a.indexOf(pieceNum) == -1) {
                bag7a.push(pieceNum);
            }
        }

        while (bag7b.length < tetrominoes.length) {
            let pieceNum = random(0, tetrominoes.length-1);

            if (bag7b.indexOf(pieceNum) == -1) {
                bag7b.push(pieceNum);
            }
        }

        currentPiece = [];

        for (let i = 0; i < bag7a.length; i++) {
            currentPiece.push(JSON.parse(JSON.stringify(tetrominoes[bag7a[i]])));
        }

        canHold = true;
        holdPiece = [];
        holdPos = 0;

        draw();
    }

	update();
})();
