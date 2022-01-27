<script lang="ts">
  import Board from "./components/Board.svelte";
  import ColorPicker from "./components/ColorPicker.svelte";
  import { currentColorKey, colorPickerItems } from "./stores/color";
  import { board, resetBoard } from "./stores/board";
  import Button from "./components/ui/Button.svelte";

  let isRectangleSelector: boolean = false;

  const updateDot = (event: CustomEvent<any>) => {
    const currentColorPicker = $colorPickerItems.find(
      (colorPickerItem) => colorPickerItem.key === $currentColorKey
    );
    if (!currentColorPicker || currentColorPicker.count <= 0) return;

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
  <Board {isRectangleSelector} on:updateDot={updateDot} />
  <div class="sidebar">
    <h1 class="sidebar-header">Lego World Map</h1>
    <div class="sidebar-buttons">
      <Button
        type="primary"
        on:click={() => (isRectangleSelector = false)}
        isActive={!isRectangleSelector}
      >
        Default
      </Button>
      <Button
        type="primary"
        on:click={() => (isRectangleSelector = true)}
        isActive={isRectangleSelector}
      >
        Drag Selector
      </Button>
    </div>
    <ColorPicker />
    <div class="sidebar-reset">
      <Button type="danger" on:click={resetBoard}>Reset board</Button>
    </div>
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
  .sidebar-buttons {
    display: flex;
  }
  .sidebar-buttons :global(.button) {
    flex: 1 0 auto;
  }

  .sidebar-buttons :global(.button + .button) {
    margin-left: 15px;
  }

  .sidebar-reset {
    padding: 15px 0;
  }
  .sidebar-reset :global(.button) {
    width: 100%;
  }
</style>
