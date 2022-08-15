<script lang="ts">
  import ColorPicker from "./components/ColorPicker.svelte";
  import Button from "./components/ui/Button.svelte";
  import CanvasDisplay from "./components/CanvasDisplay.svelte";
  import { dotsPerSquare, xSquares, ySquares } from "./stores/boardConfig";
  import { zoom } from "./stores/zoom";
  import { onMount } from "svelte";
  import { Board } from "./lib/Board";
  import type { IBoard } from "./models/Board";
  import RectangleSelector from "./components/map-tools/RectangleSelector.svelte";
  let isRectangleSelector: boolean = false;

  let board: IBoard = null;

  onMount(() => {
    board = new Board({
      xSquares: $xSquares,
      ySquares: $ySquares,
      dotsPerSquare: $dotsPerSquare,
    });
  });

  const updateDots = (event) => {
    const { dots } = event.detail;
    board.updateDots(dots);
  };

  const drawBoard = () => {
    board.drawBoard();
  };

  const resetBoard = () => {
    board.resetBoard();
  };

  const updateBoardDimensions = () => {
    board.updatePlates({ xSquares: $xSquares, ySquares: $ySquares });
  };
</script>

<main>
  <div class="container">
    {#if board}
      <CanvasDisplay
        on:updateDots={updateDots}
        on:drawBoard={drawBoard}
        {board}
        {isRectangleSelector}
      />
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
        <div class="zoom-container">
          <Button on:click={zoom.decrement}>-</Button>
          <span>Zoom level: {$zoom}</span>
          <Button on:click={zoom.increment}>+</Button>
        </div>
        <ColorPicker />
        <!-- TODO: Changing the Dimensions should not reset the dots on the board. Also the x and y values should be saved in local storage -->
        <!-- <div>
          <label for="xAxis"> X axis plates </label>
          <input
            type="number"
            on:change={updateBoardDimensions}
            bind:value={$xSquares}
            name="xAxis"
          />
        </div>
        <div>
          <label for="yAxis"> Y axis plates </label>
          <input
            type="number"
            on:change={updateBoardDimensions}
            bind:value={$ySquares}
            name="yAxis"
          />
        </div> -->
        <div class="sidebar-reset">
          <Button type="danger" on:click={resetBoard}>Reset board</Button>
        </div>
      </div>
    {/if}
  </div>
</main>

<style>
  .container {
    display: flex;
  }
  main {
    padding: 10px;
    margin: 0;
  }
  .zoom-container {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 10px 0;
  }
  .zoom-container :global(.button) {
    flex: 0 0 auto;
    margin: 0;
  }
  .zoom-container span {
    background-color: white;
    padding: 10px;
    border-radius: 5px;
    line-height: 16px;
    margin: 0 10px;
  }
  .sidebar {
    flex: 0 0 300px;
    margin-left: auto;
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
