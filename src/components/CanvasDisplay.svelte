<script lang="ts">
  import { onDestroy, onMount } from "svelte";
  import { DOT_COLOR } from "../constants/DotColor";
  import { CanvasDisplay } from "../lib/CanvasDisplay";
  import { board } from "../stores/board";
  import { currentColorKey } from "../stores/color";
  import { currentZoom } from "../stores/zoom";
  import RectangleSelector from "./map-tools/RectangleSelector.svelte";

  let canvasContainer;
  let canvas: CanvasDisplay;
  export let isRectangleSelector: boolean = false;

  onMount(() => {
    canvas = new CanvasDisplay(canvasContainer);
    canvas.setDotSquares($board.squareRows);
    canvas.drawDotsFromDotSquares();
    canvas.canvas.addEventListener("click", bindClick);
  });

  function bindClick(event: PointerEvent) {
    if (isRectangleSelector) return;
    const rect = (event.target as HTMLCanvasElement).getBoundingClientRect();
    var x = event.clientX - rect.left; //x position within the element.
    var y = event.clientY - rect.top; //y position within the element.
    const { dotX, dotY } = canvas.getDescaledDot(x, y);

    const currentHexColor = DOT_COLOR[$currentColorKey]?.hex;
    changeStoreDotColor(dotX, dotY);
    canvas.drawDot(dotX, dotY, currentHexColor);
  }

  function changeStoreDotColor(x: number, y: number) {
    const squareXIndex = Math.floor(x / 16);
    const squareYIndex = Math.floor(y / 16);
    const dotXIndex = x % 16;
    const dotYIndex = y % 16;
    const newBoard = Object.assign({}, $board);
    const dotToChange =
      newBoard.squareRows[squareYIndex][squareXIndex].dotRows[dotYIndex][
        dotXIndex
      ];
    dotToChange.color = $currentColorKey;

    board.update(() => newBoard);
    // canvas.drawDot(dotX, dotY, color);
  }

  const selectArea = (e) => {
    const { selectionTopLeft, selectionBottomRight } = e.detail;
    const rect = (canvas.canvas as HTMLElement).getBoundingClientRect();
    const topLeftX = selectionTopLeft.x - rect.left; //x position within the element.
    const topLeftY = selectionTopLeft.y - rect.top; //y position within the element.

    const bottomRightX = selectionBottomRight.x - rect.left; //x position within the element.
    const bottomRightY = selectionBottomRight.y - rect.top; //y position within the element.

    const { dotX: dotTopLeftX, dotY: dotTopLeftY } = canvas.getDescaledDot(
      topLeftX,
      topLeftY
    );
    const { dotX: dotBottomRightX, dotY: dotBottomRightY } =
      canvas.getDescaledDot(bottomRightX, bottomRightY);

    updateDotsInRange(
      dotTopLeftX,
      dotTopLeftY,
      dotBottomRightX,
      dotBottomRightY
    );
    canvas.drawDotsFromDotSquares();
  };

  function updateDotsInRange(
    dotTopLeftX: number,
    dotTopLeftY: number,
    dotBottomRightX: number,
    dotBottomRightY: number
  ) {
    let xIndex = dotTopLeftX;
    let yIndex = dotTopLeftY;
    changeStoreDotColor(dotTopLeftX, dotTopLeftY);
    while (xIndex < dotBottomRightX || yIndex < dotBottomRightY) {
      if (xIndex < dotBottomRightX) xIndex++;
      else if (yIndex < dotBottomRightY) {
        xIndex = dotTopLeftX;
        yIndex++;
      }
      changeStoreDotColor(xIndex, yIndex);
    }
  }

  const unsubscribe = currentZoom.subscribe((value) => {
    canvas?.updateScale(value);
    canvas?.drawDotsFromDotSquares();
  });

  onDestroy(unsubscribe);

  onDestroy(() => {
    canvas.canvas.removeEventListener("click", bindClick);
  });
</script>

<div class="overall-container">
  <div class="canvas-container" bind:this={canvasContainer}>
    {#if isRectangleSelector}
      <RectangleSelector
        containerElement={canvasContainer}
        on:selection={selectArea}
      />
    {/if}
  </div>
</div>

<style>
  .overall-container {
    max-width: calc(100% - 300px);
  }
  .canvas-container {
    height: auto;
    max-height: calc(100vh - 20px);
    overflow: auto;
    user-select: none;
    background-color: #505050;
  }
  .canvas-container canvas {
    margin: 0 auto;
  }
</style>
