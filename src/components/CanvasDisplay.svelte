<script lang="ts">
  import { createEventDispatcher, onDestroy, onMount } from "svelte";
  import { CanvasDisplay } from "../lib/CanvasDisplay";
  import type { IBoard } from "../models/Board";
  import { zoom } from "../stores/zoom";
  import RectangleSelector from "./map-tools/RectangleSelector.svelte";

  let canvasContainer;
  let canvasDisplay: CanvasDisplay;
  export let isRectangleSelector: boolean = false;
  export let board: IBoard;
  const dispatch = createEventDispatcher();

  onMount(() => {
    canvasDisplay = new CanvasDisplay(canvasContainer);
    board.addRenderer(canvasDisplay);
    canvasDisplay.canvasElement.addEventListener("click", bindClick);
  });

  const bindClick = (event: PointerEvent) => {
    if (isRectangleSelector) return;
    const rect = (event.target as HTMLCanvasElement).getBoundingClientRect();
    var x = event.clientX - rect.left;
    var y = event.clientY - rect.top;
    const { dotX, dotY } = canvasDisplay.getDescaledDot(x, y);

    changeStoreDotColor(dotX, dotY);
  };

  const changeStoreDotColor = (x: number, y: number) => {
    dispatch("updateDots", {
      dots: [
        {
          x,
          y,
        },
      ],
    });
  };

  const selectArea = (e) => {
    const { selectionTopLeft, selectionBottomRight } = e.detail;
    const rect = (
      canvasDisplay.canvasElement as HTMLCanvasElement
    ).getBoundingClientRect();
    const topLeftX = selectionTopLeft.x - rect.left;
    const topLeftY = selectionTopLeft.y - rect.top;

    const bottomRightX = selectionBottomRight.x - rect.left;
    const bottomRightY = selectionBottomRight.y - rect.top;

    const { dotX: dotTopLeftX, dotY: dotTopLeftY } =
      canvasDisplay.getDescaledDot(topLeftX, topLeftY);
    const { dotX: dotBottomRightX, dotY: dotBottomRightY } =
      canvasDisplay.getDescaledDot(bottomRightX, bottomRightY);
    updateDotsInRange(
      dotTopLeftX,
      dotTopLeftY,
      dotBottomRightX,
      dotBottomRightY
    );
  };

  const updateDotsInRange = (
    dotTopLeftX: number,
    dotTopLeftY: number,
    dotBottomRightX: number,
    dotBottomRightY: number
  ) => {
    let xIndex = dotTopLeftX;
    let yIndex = dotTopLeftY;
    const dotsToUpdate = [];
    dotsToUpdate.push({ x: dotTopLeftX, y: dotTopLeftY });
    while (xIndex < dotBottomRightX || yIndex < dotBottomRightY) {
      if (xIndex < dotBottomRightX) xIndex++;
      else if (yIndex < dotBottomRightY) {
        xIndex = dotTopLeftX;
        yIndex++;
      }
      dotsToUpdate.push({ x: xIndex, y: yIndex });
    }
    dispatch("updateDots", {
      dots: dotsToUpdate,
    });
  };

  const unsubscribe = zoom.subscribe((value) => {
    canvasDisplay?.updateScale(value);
    dispatch("updateDots", {
      dots: [],
    });
  });

  onDestroy(() => {
    unsubscribe();
    canvasDisplay.canvasElement.removeEventListener("click", bindClick);
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
