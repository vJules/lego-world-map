<script lang="ts">
  import { onDestroy, onMount } from "svelte";
  import { element } from "svelte/internal";
  import { DOT_COLOR } from "../constants/DotColor";

  import { CanvasDisplay } from "../lib/CanvasDisplay";
  import { board } from "../stores/board";

  let canvasContainer;
  let canvas: CanvasDisplay;
  onMount(() => {
    canvas = new CanvasDisplay(canvasContainer, 10);
    canvas.drawBackground();
    syncCanvas();
    canvas.canvas.addEventListener("click", bindClick);
  });

  function syncCanvas() {
    $board.squareRows.forEach((row, squareRowIndex) => {
      row.forEach((square, squareColumnIndex) => {
        square.dotRows.forEach((dotRow, dotRowIndex) => {
          dotRow.forEach((dotColumn, dotColumnIndex) => {
            canvas.drawDot(
              squareColumnIndex * 16 + dotColumnIndex,
              squareRowIndex * 16 + dotRowIndex,
              DOT_COLOR[dotColumn.color].hex
            );
          });
        });
      });
    });
  }

  function bindClick(event: PointerEvent) {
    const { offsetLeft, offsetTop } = event.target as HTMLCanvasElement;
    const { clientX, clientY } = event;
    var relX = clientX - offsetLeft;
    var relY = clientY - offsetTop;
    // TODO: The Y property is completely wrong here.
    canvas.getDot(relX, relY);
  }

  onDestroy(() => {
    canvas.canvas.removeEventListener("click", bindClick);
  });
</script>

<div class="canvas-container" bind:this={canvasContainer} />

<style>
  .canvas-container {
    width: 100%;
    height: 100vh;
  }
</style>
