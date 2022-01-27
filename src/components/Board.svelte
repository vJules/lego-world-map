<script lang="ts">
  import { onDestroy, onMount } from "svelte";
  import Square from "./Square.svelte";
  import RectangleSelector from "./map-tools/RectangleSelector.svelte";
  import { board } from "../stores/board";
  import { makeSelection } from "../lib/selection";
  import { currentColorKey, colorPickerItems } from "../stores/color";

  let isDragging: boolean = false;
  export let isRectangleSelector: boolean = false;

  const updateDot = (
    rowIndex,
    columnIndex,
    squareRowIndex,
    squareColumnIndex
  ) => {
    const currentColorPicker = $colorPickerItems.find(
      (colorPickerItem) => colorPickerItem.key === $currentColorKey
    );
    if (!currentColorPicker || currentColorPicker.count <= 0) return;

    const newBoard = Object.assign({}, $board);

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

  const selectArea = (e) => {
    const { selectionTopLeft, selectionBottomRight } = e.detail;
    const selectedDots = makeSelection(selectionTopLeft, selectionBottomRight);
    selectedDots.forEach((dot) =>
      updateDot(
        dot.dataset.rowIndex,
        dot.dataset.columnIndex,
        dot.dataset.squareRowIndex,
        dot.dataset.squareColumnIndex
      )
    );
  };
  const bindMouseDown = () => {
    isDragging = true;
  };

  const bindMouseUp = () => {
    isDragging = false;
  };

  onMount(() => {
    document.addEventListener("mousedown", bindMouseDown);
    document.addEventListener("mouseup", bindMouseUp);
  });

  onDestroy(() => {
    document.removeEventListener("mousedown", bindMouseDown);
    document.removeEventListener("mouseup", bindMouseUp);
  });
</script>

<div class="board">
  {#if isRectangleSelector}
    <RectangleSelector on:selection={selectArea} />
  {/if}
  {#each $board.squareRows as squareRow, squareRowIndex}
    <div class="board-row">
      {#each squareRow as square, squareColumnIndex}
        <Square
          {square}
          {isDragging}
          {squareRowIndex}
          {squareColumnIndex}
          disableDotEvents={isRectangleSelector}
          on:updateDot={(event) =>
            updateDot(
              event.detail.rowIndex,
              event.detail.columnIndex,
              squareRowIndex,
              squareColumnIndex
            )}
        />
      {/each}
    </div>
  {/each}
</div>

<style>
  .board {
    display: flex;
    flex-direction: column;
    padding: 15px;
    background-color: #505050;
  }

  .board-row {
    display: flex;
  }
</style>
