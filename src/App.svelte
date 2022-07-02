<script lang="ts">
  import Board from "./components/Board.svelte";
  import ColorPicker from "./components/ColorPicker.svelte";
  import { resetBoard } from "./stores/board";
  import Button from "./components/ui/Button.svelte";
  import CanvasDisplay from "./components/CanvasDisplay.svelte";
  import { currentZoom } from "./stores/zoom";
  let isRectangleSelector: boolean = false;

  function decreaseZoom() {
    updateCurrentZoom($currentZoom - 1);
  }

  function increaseZoom() {
    updateCurrentZoom($currentZoom + 1);
  }

  function updateCurrentZoom(newZoom: number) {
    currentZoom.update(() => newZoom);
  }
</script>

<main>
  <div class="container">
    <!-- <Board {isRectangleSelector} /> -->
    <CanvasDisplay {isRectangleSelector} />
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
        <Button on:click={decreaseZoom}>-</Button>
        <span>Zoom level: {$currentZoom}</span>
        <Button on:click={increaseZoom}>+</Button>
      </div>
      <ColorPicker />
      <div class="sidebar-reset">
        <Button type="danger" on:click={resetBoard}>Reset board</Button>
      </div>
    </div>
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
