/*
 * 2023 Tarpeeksi Hyvae Soft
 * 
 */

export default function(widgetOptions = {}, renderArgs = {}) {
    return ()=>w95.$render(MinesweeperWindow, widgetOptions, renderArgs);
}

function MinesweeperWindow({
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
                    height.set(newHeight + (isRelative ? width.now : 0));
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
                                text: "000",
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
                                text: "000",
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
            
            // Implement the Minesweeper game board elements and logic here.
        },
    };
}
