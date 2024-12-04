/*
 * 2023 Tarpeeksi Hyvae Soft
 * 
 */

import MinesweeperWindow from "./widget.js";

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

export function minesweeper()
{
    const rows = 8;
    const cols = 8;
    const mines = 10;
    const cellSize = 20;

    const tick = w95.state(0);
    const board = w95.state(calculateAdjacentMines(generateBoard(rows, cols, mines)), {repaintOnChange: false});
    const boardButtons = w95.state({
        label: Array(rows).fill().map(()=>Array(cols).fill('')),
        isCleared: Array(rows).fill().map(()=>Array(cols).fill('')),
    }, {repaintOnChange: false});

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
                reset_game_state() {
                    tick.set(0);
                    board.set(calculateAdjacentMines(generateBoard(rows, cols, mines)));
                    boardButtons.set({
                        label: Array(rows).fill().map(()=>Array(cols).fill('')),
                        isCleared: Array(rows).fill().map(()=>Array(cols).fill('')),
                    }, {repaintOnChange: false});
                },
                update_board_buttons() {
                    const boardChildren = [];
                    for (let row = 0; row < rows; row++) {
                        for (let col = 0; col < cols; col++) {
                            const cell = w95.widget.button({
                                x: col * cellSize,
                                y: row * cellSize,
                                width: cellSize,
                                height: cellSize,
                                text: (boardButtons.now.label[row][col] || ""),
                                color: (
                                    (boardButtons.now.label[row][col] == '*')
                                        ? w95.palette.named.white
                                        : w95.palette.named.black
                                ),
                                backgroundColor: (
                                    boardButtons.now.isCleared[row][col]
                                        ? w95.palette.named.offWhite
                                        : (boardButtons.now.label[row][col] == '*')
                                            ? w95.palette.named.red
                                            : w95.palette.widget.background
                                ),
                                shape: (
                                    boardButtons.now.isCleared[row][col]
                                        ? w95.enum.buttonShape.flat
                                        : w95.enum.buttonShape.regular
                                ),
                                styleHints: [
                                    (boardButtons.now.isCleared[row][col]? w95.enum.styleHint.disabled : w95.enum.styleHint.void),
                                    w95.enum.styleHint.raised,
                                ],
                                onClick() {
                                    if (board.now[row][col] === -1) {
                                        boardButtons.now.label[row][col] = '*';
                                        // Add game over logic here
                                    } else {
                                        revealEmptyCells(board.now, boardButtons.now, row, col, Array.from({ length: rows }, () => Array(cols).fill(false)));
                                    }
            
                                    tick.set(tick.now + 1);
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
