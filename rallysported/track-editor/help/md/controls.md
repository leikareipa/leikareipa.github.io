# Controls

## Terrain editor

<dokki-table>
    <template #caption>
        Keyboard
    </template>
    <template #table>
        <tr>
            <th>Input</th>
            <th>Result</th>
        </tr>
        <tr>
            <td><key-input>E</key-input> <key-input>S</key-input> <key-input>D</key-input> <key-input>F</key-input></td>
            <td>Move the camera.</td>
        </tr>
        <tr>
            <td><key-input>1</key-input> <key-input>2</key-input> <key-input>3</key-input> <key-input>4</key-input></td>
            <td>Set the brush radius.</td>
        </tr>
        <tr>
            <td><key-input>L</key-input></td>
            <td>Bulldoze the ground to a given height.</td>
        </tr>
        <tr>
            <td><key-input>W</key-input></td>
            <td>Toggle wireframe rendering on/off.</td>
        </tr>
        <tr>
            <td><key-input>B</key-input></td>
            <td>Toggle prop transparency on/off.</td>
        </tr>
        <tr>
            <td><key-input>T</key-input></td>
            <td>Open in the texture editor the texture on which the mouse hovers.</td>
        </tr>
        <tr>
            <td><key-input>G</key-input></td>
            <td>Toggle mouse hover PALA preview on/off.</td>
        </tr>
        <tr>
            <td><key-input>A</key-input></td>
            <td>Toggle the PALA texture pane on/off.</td>
        </tr>
        <tr>
            <td><key-input>Q</key-input></td>
            <td>Open the tilemap editor.</td>
        </tr>
        <tr>
            <td><key-input>Space</key-input></td>
            <td>Toggle ground smoothing on/off.</td>
        </tr>
        <tr>
            <td><key-input>&uarr;</key-input></td>
            <td>Raise the ground by one unit where the mouse cursor is hovering.</td>
        </tr>
        <tr>
            <td><key-input>&darr;</key-input></td>
            <td>Lower the ground by one unit where the mouse cursor is hovering.</td>
        </tr>
        <tr>
            <td><key-input>Ctrl + S</key-input></td>
            <td>Download (save) the current track.</td>
        </tr>
        <tr>
            <td><key-input>Ctrl + Z</key-input></td>
            <td>Undo changes (across all editors).</td>
        </tr>
        <tr>
            <td><key-input>Ctrl + Shift + Z</key-input></td>
            <td>Redo changes (across all editors).</td>
        </tr>
    </template>
</dokki-table>

<dokki-table>
    <template #caption>
        Mouse
    </template>
    <template #table>
        <tr>
            <th>Input</th>
            <th>Target</th>
            <th>Result</th>
        </tr>
        <tr>
            <td><mouse-input>Left click</mouse-input></td>
            <td>Ground</td>
            <td>Move the ground up; or, if ground smoothing is enabled, apply a smoothing filter to the ground. The size of the area affected depends on the current brush radius.</td>
        </tr>
        <tr>
            <td><mouse-input>Left click and drag</mouse-input></td>
            <td>Prop</td>
            <td>Move the prop.</td>
        </tr>
        <tr>
            <td><mouse-input>Shift + Left click</mouse-input></td>
            <td>Prop</td>
            <td>Remove the prop.</td>
        </tr>
        <tr>
            <td><mouse-input>Shift + Left click</mouse-input></td>
            <td>Ground</td>
            <td>Add a prop.</td>
        </tr>
        <tr>
            <td><mouse-input>Tab + Left click</mouse-input></td>
            <td>Ground</td>
            <td>Eye dropper tool: select the PALA on which the cursor hovers.</td>
        </tr>
        <tr>
            <td><mouse-input>Right click</mouse-input></td>
            <td>Ground</td>
            <td>Move the ground down; or, if ground smoothing is enabled, apply a smoothing filter to the ground. The size of the area affected down depends on the current brush radius.</td>
        </tr>
        <tr>
            <td><mouse-input>Right click</mouse-input></td>
            <td>Prop</td>
            <td>Change the prop's type.</td>
        </tr>
        <tr>
            <td><mouse-input>Middle click</mouse-input></td>
            <td>Ground</td>
            <td>Paint the ground with the currently-selected PALA texture.</td>
        </tr>
        <tr>
            <td><mouse-input>Shift + Mouse wheel</mouse-input></td>
            <td>(Any)</td>
            <td>Tilt the camera.</td>
        </tr>
    </template>
</dokki-table>

## Texture editor

<dokki-table>
    <template #caption>
        Keyboard
    </template>
    <template #table>
        <tr>
            <th>Input</th>
            <th>Result</th>
        </tr>
        <tr>
            <td><key-input>E</key-input> <key-input>S</key-input> <key-input>D</key-input> <key-input>F</key-input></td>
            <td>Move the camera.</td>
        </tr>
        <tr>
            <td><key-input>A</key-input></td>
            <td>Toggle the PALA texture pane on/off.</td>
        </tr>
        <tr>
            <td><key-input>R</key-input></td>
            <td>Rotate the texture.</td>
        </tr>
        <tr>
            <td><key-input>Ctrl + C</key-input></td>
            <td>Copy the texture onto the clipboard.</td>
        </tr>
        <tr>
            <td><key-input>Ctrl + V</key-input></td>
            <td>Paste the clipboard over the texture.</td>
        </tr>
        <tr>
            <td><key-input>Ctrl + Z</key-input></td>
            <td>Undo changes (across all editors).</td>
        </tr>
        <tr>
            <td><key-input>Ctrl + Shift + Z</key-input></td>
            <td>Redo changes (across all editors).</td>
        </tr>
    </template>
</dokki-table>

<dokki-table>
    <template #caption>
        Mouse
    </template>
    <template #table>
        <tr>
            <th>Input</th>
            <th>Target</th>
            <th>Result</th>
        </tr>
        <tr>
            <td><mouse-input>Left click</mouse-input></td>
            <td>Texture</td>
            <td>Paint the texture with the currently-selected color.</td>
        </tr>
        <tr>
            <td><mouse-input>Tab + Left click</mouse-input></td>
            <td>Texture</td>
            <td>Eye dropper tool: select the color on which the cursor hovers.</td>
        </tr>
        <tr>
            <td><mouse-input>Shift + Mouse wheel</mouse-input></td>
            <td>(Any)</td>
            <td>Adjust the zoom level.</td>
        </tr>
    </template>
</dokki-table>

## Tilemap editor

<dokki-table>
    <template #caption>
        Keyboard
    </template>
    <template #table>
        <tr>
            <th>Input</th>
            <th>Result</th>
        </tr>
        <tr>
            <td><key-input>E</key-input> <key-input>S</key-input> <key-input>D</key-input> <key-input>F</key-input></td>
            <td>Move the camera.</td>
        </tr>
        <tr>
            <td><key-input>A</key-input></td>
            <td>Toggle the PALA texture pane on/off.</td>
        </tr>
        <tr>
            <td><key-input>Ctrl + Z</key-input></td>
            <td>Undo changes (across all editors).</td>
        </tr>
        <tr>
            <td><key-input>Ctrl + Shift + Z</key-input></td>
            <td>Redo changes (across all editors).</td>
        </tr>
    </template>
</dokki-table>

<dokki-table>
    <template #caption>
        Mouse
    </template>
    <template #table>
        <tr>
            <th>Input</th>
            <th>Target</th>
            <th>Result</th>
        </tr>
        <tr>
            <td><mouse-input>Left click</mouse-input></td>
            <td>Tilemap</td>
            <td>Paint the tilemap with the currently-selected PALA texture.</td>
        </tr>
        <tr>
            <td><mouse-input>Shift + Mouse wheel</mouse-input></td>
            <td>(Any)</td>
            <td>Adjust the zoom level.</td>
        </tr>
    </template>
</dokki-table>
