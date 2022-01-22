<script lang="ts">
  import Board from "./components/Board.svelte";
  import ColorPicker from "./components/ColorPicker.svelte";
  import { currentColorKey, colorPickerItems } from "./stores/color";
  import { board, resetBoard } from "./stores/board";

  const updateDot = (event) => {
    const currentColorPicker = $colorPickerItems.find(
      (colorPickerItem) => colorPickerItem.key === $currentColorKey
    );
    if (currentColorPicker.count <= 0) return;

    const newBoard = Object.assign({}, $board);

    const { squareRowIndex, squareColumnIndex, rowIndex, columnIndex } =
      event.detail;
    const dotToChange =
      newBoard.squareRows[squareRowIndex][squareColumnIndex].dotRows[rowIndex][
        columnIndex
      ];
    const previousColor = dotToChange.color;
    dotToChange.color = $currentColorKey;
    colorPickerItems.update((colorPickerItems) => {
      return colorPickerItems.map((colorPickerItem) => {
        const newColorPickerItem = {
          ...colorPickerItem,
        };
        if (colorPickerItem.key === previousColor) {
          newColorPickerItem.count += 1;
        }
        if (colorPickerItem.key === $currentColorKey) {
          newColorPickerItem.count -= 1;
        }
        return newColorPickerItem;
      });
    });
    board.update(() => newBoard);
  };
</script>

<main>
  <Board on:updateDot={updateDot} />
  <div class="sidebar">
    <h1 class="sidebar-header">Lego World Map</h1>
    <ColorPicker />
    <button class="sidebar-reset" on:click={resetBoard}>Reset board</button>
  </div>
</main>

<style>
  main {
    padding: 10px;
    margin: 0;
    display: flex;
  }
  .sidebar {
    flex: 1;
    padding: 0 20px;
  }
  .sidebar-header {
    margin: 0 0 10px;
    color: #ffc312;
    text-align: center;
  }
  .sidebar-reset {
    width: 100%;
    padding: 5px 10px;
    background-color: gray;
    outline: none;
    border: none;
    margin-top: 10px;
  }
</style>
