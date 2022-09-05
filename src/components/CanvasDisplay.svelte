<script lang="ts">
  import { createEventDispatcher, onDestroy, onMount } from "svelte";
  import { CanvasDisplay } from "../lib/CanvasDisplay";
  import type { IBoard } from "../models/Board";
  import { zoom } from "../stores/zoom";
  import RectangleSelector from "./map-tools/RectangleSelector.svelte";

  let canvasContainer;
  let canvasDisplay: CanvasDisplay;
  let isUpdatingOverlay: boolean = false;
  export let isRectangleSelector: boolean = false;
  export let board: IBoard;
  const dispatch = createEventDispatcher();

  const overlayKeyboardEvents = [""];

  onMount(() => {
    canvasDisplay = new CanvasDisplay(canvasContainer);
    board.addRenderer(canvasDisplay);
    addDotClickEventListener();
    canvasDisplay.canvasElement.addEventListener("click", bindClick);
    board.onUpdatingOverlayChange((newValue) => {
      isUpdatingOverlay = newValue;
      if (isUpdatingOverlay) {
        addOverlayEventListener();
        removeDotClickEventListener();
      } else {
        addDotClickEventListener();
        removeOverlayEventListener();
      }
    });
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

  const addOverlayDots = () => {
    board.addOverlayDots();
  };

  const unsubscribe = zoom.subscribe((value) => {
    canvasDisplay?.updateScale(value);
    dispatch("drawBoard");
  });

  const addDotClickEventListener = () => {
    canvasDisplay.canvasElement.addEventListener("click", bindClick);
  };

  const removeDotClickEventListener = () => {
    canvasDisplay.canvasElement.removeEventListener("click", bindClick);
  };

  const addOverlayEventListener = () => {
    window.addEventListener("keydown", bindKeyboardEvent);
  };

  const removeOverlayEventListener = () => {
    window.removeEventListener("keydown", bindKeyboardEvent);
  };

  const bindKeyboardEvent = (event: KeyboardEvent) => {
    event.preventDefault();
    let x = 0;
    let y = 0;
    if (event.key === "ArrowRight") x++;
    if (event.key === "ArrowLeft") x--;
    if (event.key === "ArrowUp") y--;
    if (event.key === "ArrowDown") y++;
    board.moveOverlayDots(x, y);
  };

  onDestroy(() => {
    unsubscribe();
    removeDotClickEventListener();
  });
</script>

<div class="overall-container">
  <div class="canvas-container" bind:this={canvasContainer}>
    {#if isRectangleSelector && !isUpdatingOverlay}
      <RectangleSelector
        containerElement={canvasContainer}
        on:selection={selectArea}
      />
    {/if}
  </div>
  {#if isUpdatingOverlay}
    <button on:click={addOverlayDots}>Done adding image</button>
  {/if}
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
