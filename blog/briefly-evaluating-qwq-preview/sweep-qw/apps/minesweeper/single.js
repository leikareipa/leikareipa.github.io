// Generate the game board grid
function generateBoard(rows, cols, mines) {
    const board = Array.from({ length: rows }, () => Array(cols).fill(0));
    let minesPlaced = 0;

    while (minesPlaced < mines) {
        const row = Math.floor(Math.random() * rows);
        const col = Math.floor(Math.random() * cols);

        if (board[row][col] !== -1) {
            board[row][col] = -1;
            minesPlaced++;
        }
    }

    return board;
}

// Calculate the number of adjacent mines for each cell
function calculateAdjacentMines(board) {
    const rows = board.length;
    const cols = board[0].length;

    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            if (board[row][col] === -1) continue;

            let count = 0;
            const neighbors = [
                [-1, -1], [-1, 0], [-1, 1],
                [ 0, -1],          [ 0, 1],
                [ 1, -1], [ 1, 0], [ 1, 1]
            ];

            for (const [dx, dy] of neighbors) {
                const newRow = row + dx;
                const newCol = col + dy;

                if (
                    newRow >= 0 && newRow < rows &&
                    newCol >= 0 && newCol < cols &&
                    board[newRow][newCol] === -1
                ) {
                    count++;
                }
            }

            board[row][col] = count;
        }
    }

    return board;
}

// DFS to reveal empty cells and adjacent numbered cells
function revealEmptyCells(board, buttons, row, col, visited) {
    if (
        row < 0 || row >= board.length ||
        col < 0 || col >= board[0].length ||
        visited[row][col]
    ) {
        return;
    }

    visited[row][col] = true;
    buttons.label[row][col] = ("" + (board[row][col] || ''));
    buttons.isCleared[row][col] = (board[row][col] || true);

    if (board[row][col] === 0) {
        const neighbors = [
            [-1, -1], [-1, 0], [-1, 1],
            [ 0, -1],          [ 0, 1],
            [ 1, -1], [ 1, 0], [ 1, 1]
        ];

        for (const [dx, dy] of neighbors) {
            const newRow = row + dx;
            const newCol = col + dy;
            revealEmptyCells(board, buttons, newRow, newCol, visited);
        }
    }
}

// Check if the game is won
function checkWin(board, buttons) {
    for (let row = 0; row < board.length; row++) {
        for (let col = 0; col < board[0].length; col++) {
            if (board[row][col] !== -1 && !buttons.isCleared[row][col]) {
                return false;
            }
        }
    }
    return true;
}

export function minesweeper()
{
    const rows = 8;
    const cols = 8;
    const mines = 10;
    const cellSize = 20;

    const tick = w95.state(0);
    const board = w95.state(calculateAdjacentMines(generateBoard(rows, cols, mines)), {repaintOnChange: false});
    const boardButtons = w95.state({
        label: Array(rows).fill().map(() => Array(cols).fill('')),
        isCleared: Array(rows).fill().map(() => Array(cols).fill(false)),
        isFlagged: Array(rows).fill().map(() => Array(cols).fill(false)), // New property for flags
    }, {repaintOnChange: false});
    const remainingMines = w95.state(mines, { repaintOnChange: false });

    const numberColors = {
        1: w95.palette.named.blue,
        2: w95.palette.named.green,
        3: w95.palette.named.red,
        4: w95.palette.named.brown,
        5: w95.palette.named.darkRed,
        6: w95.palette.named.cyan,
        7: w95.palette.named.black,
        8: w95.palette.named.gray,
    };

    return {
        get appMeta() {
            return {
                name: "Minesweeper clone",
                version: "0.1",
            }
        },
        Form() {
            return MinesweeperWindow({
                board: board.now,
                remainingMines,
                reset_game_state() {
                    tick.set(0);
                    board.set(calculateAdjacentMines(generateBoard(rows, cols, mines)));
                    boardButtons.set({
                        label: Array(rows).fill().map(() => Array(cols).fill('')),
                        isCleared: Array(rows).fill().map(() => Array(cols).fill(false)),
                        isFlagged: Array(rows).fill().map(() => Array(cols).fill(false)),
                    }, {repaintOnChange: false});
                    remainingMines.set(mines);
                },
                update_board_buttons() {
                    const boardChildren = [];
                    for (let row = 0; row < rows; row++) {
                        for (let col = 0; col < cols; col++) {
                            const cellValue = boardButtons.now.label[row][col];
                            let textColor = w95.palette.named.black; // default color

                            if (cellValue === '*') {
                                textColor = w95.palette.named.white;
                            } else if (!isNaN(cellValue) && cellValue > 0) {
                                textColor = numberColors[cellValue] || w95.palette.named.black;
                            }

                            const cell = w95.widget.button({
                                x: col * cellSize,
                                y: row * cellSize,
                                width: cellSize,
                                height: cellSize,
                                text: cellValue || '',
                                color: textColor,
                                backgroundColor: (
                                    boardButtons.now.isCleared[row][col]
                                        ? w95.palette.named.offWhite
                                        : (boardButtons.now.isFlagged[row][col])
                                            ? w95.palette.named.yellow // or another color for flagged cells
                                            : w95.palette.widget.background
                                ),
                                shape: (
                                    boardButtons.now.isCleared[row][col]
                                        ? w95.enum.buttonShape.flat
                                        : w95.enum.buttonShape.regular
                                ),
                                styleHints: [
                                    (boardButtons.now.isCleared[row][col]) ? w95.enum.styleHint.disabled : w95.enum.styleHint.void,
                                    w95.enum.styleHint.raised,
                                ],
                                onClick() {
                                    if (!boardButtons.now.isFlagged[row][col]) { // Only proceed if not flagged
                                        if (board.now[row][col] === -1) {
                                            // Reveal all mines
                                            for (let r = 0; r < rows; r++) {
                                                for (let c = 0; c < cols; c++) {
                                                    if (board.now[r][c] === -1) {
                                                        boardButtons.now.label[r][c] = '*';
                                                    }
                                                }
                                            }
                                            // Disable all buttons
                                            for (let r = 0; r < rows; r++) {
                                                for (let c = 0; c < cols; c++) {
                                                    boardButtons.now.isCleared[r][c] = true;
                                                }
                                            }
                                            // Show game over message
                                            alert('Game Over! You clicked on a mine.');
                                        } else {
                                            revealEmptyCells(board.now, boardButtons.now, row, col, Array.from({length: rows}, () => Array(cols).fill(false)));
                                            if (checkWin(board.now, boardButtons.now)) {
                                                alert('Congratulations! You won!');
                                                for (let r = 0; r < rows; r++) {
                                                    for (let c = 0; c < cols; c++) {
                                                        boardButtons.now.isCleared[r][c] = true;
                                                    }
                                                }
                                            }
                                        }
                                    }
                                    tick.set(tick.now + 1);
                                },
                                onRightClick() {
                                    if (!boardButtons.now.isCleared[row][col]) { // Only toggle flag if not cleared
                                        boardButtons.now.isFlagged[row][col] = !boardButtons.now.isFlagged[row][col];
                                        if (boardButtons.now.isFlagged[row][col]) {
                                            remainingMines.set(remainingMines.now - 1);
                                        } else {
                                            remainingMines.set(remainingMines.now + 1);
                                        }
                                        tick.set(tick.now + 1);
                                    }
                                },
                            });

                            boardChildren.push(cell);
                        }
                    }

                    return boardChildren;
                },
            });
        },
    };
}

function MinesweeperWindow(widgetOptions = {}, renderArgs = {}) {
    return ()=>w95.$render(window, widgetOptions, renderArgs);
    function window({
        board = undefined,
        reset_game_state = undefined,
        update_board_buttons = undefined,
    } = {})
    {
        w95.debug?.assert(typeof board === "object");
        w95.debug?.assert(typeof reset_game_state === "function");
        w95.debug?.assert(typeof update_board_buttons === "function");

        const rows = 8;
        const cols = 8;
        const cellSize = 20;
        const menuBarHeight = 24;
        const statusBarHeight = 24;
        const paddingVertical = 46;
        const paddingHorizontal = 10;

        const x = w95.state(5);
        const y = w95.state(5);
        const width = w95.state(paddingHorizontal + (cellSize * cols));
        const height = w95.state(paddingVertical + menuBarHeight + statusBarHeight + (cellSize * rows));

        return {
            get x() { return x.now },
            get y() { return y.now },
            get width() { return width.now },
            get height() { return height.now },
            Form() {
                return w95.widget.window({
                    x: x.now,
                    y: y.now,
                    width: width.now,
                    height: height.now,
                    title: "Minesweeper",
                    move(newX, newY, {isRelative}) {
                        x.set(newX + (isRelative ? x.now : 0));
                        y.set(newY + (isRelative ? y.now : 0));
                    },
                    resize(newWidth, newHeight, {isRelative}) {
                        width.set(newWidth + (isRelative ? width.now : 0));
                        height.set(newHeight + (isRelative ? height.now : 0));
                    },
                    children: [
                        // Menu bar.
                        w95.widget.frame({
                            x: 1,
                            y: 1,
                            width: (width.now - 10),
                            height: 24,
                            shape: w95.enum.frameShape.box,
                            styleHints: [
                                w95.enum.styleHint.raised,
                            ],
                            children: [
                                w95.widget.menuBar({
                                    x: 8,
                                    y: 3,
                                    width: (width.now - 6),
                                    children: [
                                        w95.widget.menuItem({
                                            text: "Game",
                                            isTopLevel: true,
                                        }),
                                        w95.widget.menuItem({
                                            text: "Help",
                                            isTopLevel: true,
                                        }),
                                    ],
                                }),
                            ],
                        }),

                        // Game header.
                        w95.widget.frame({
                            x: 1,
                            y: 25,
                            width: (width.now - 10),
                            height: 42,
                            shape: w95.enum.frameShape.box,
                            styleHints: [
                                w95.enum.styleHint.raised,
                            ],
                            children: [
                                w95.widget.label({
                                    x: 4,
                                    y: 8,
                                    width: 42,
                                    height: 24,
                                    text: widgetOptions.remainingMines.now.toString().padStart(3, '0'),
                                    styleHints: [
                                        w95.enum.styleHint.alignVCenter,
                                        w95.enum.styleHint.alignHCenter,
                                    ],
                                }),
                                w95.widget.label({
                                    x: (width.now - 52),
                                    y: 8,
                                    width: 42,
                                    height: 24,
                                    text: "000", // Timer or other info can be added here
                                    styleHints: [
                                        w95.enum.styleHint.alignVCenter,
                                        w95.enum.styleHint.alignHCenter,
                                    ],
                                }),
                                w95.widget.button({
                                    x: Math.floor((width.now - 10) / 2 - 21),
                                    y: 8,
                                    width: 42,
                                    height: 24,
                                    text: ":)",
                                    onClick() {
                                        reset_game_state();
                                    },
                                }),
                            ],
                        }),

                        // Minesweeper game board.
                        w95.widget.frame({
                            x: 1,
                            y: 67,
                            width: (width.now - 10),
                            height: (height.now - 94),
                            shape: w95.enum.frameShape.box,
                            styleHints: [
                                w95.enum.styleHint.raised,
                            ],
                            children: update_board_buttons(),
                        }),
                    ],
                });
            },
        };
    }
}
