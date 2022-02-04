<script lang="ts">
  import Board from "./components/Board.svelte";
  import ColorPicker from "./components/ColorPicker.svelte";
  import { resetBoard } from "./stores/board";
  import Button from "./components/ui/Button.svelte";
  import MapsContainer from "./components/maps/MapsContainer.svelte";

  let isRectangleSelector: boolean = false;
  export let ready: boolean = false;
</script>

<main>
  <MapsContainer {ready} />
  <!-- <Board {isRectangleSelector} />
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
  </div> -->
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
