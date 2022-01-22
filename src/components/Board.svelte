<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import Square from "./Square.svelte";
  import { board } from "../stores/board";

  let dragging: boolean = false;

  const dispatch = createEventDispatcher();
  const updateDot = (event, squareRowIndex, squareColumnIndex) =>
    dispatch("updateDot", {
      ...event.detail,
      squareRowIndex,
      squareColumnIndex,
    });
</script>

<div
  class="board"
  on:mousedown={() => (dragging = true)}
  on:mouseup={() => (dragging = false)}
  on:mouseleave={() => (dragging = false)}
>
  {#each $board.squareRows as squareRow, squareRowIndex}
    <div class="board-row">
      {#each squareRow as square, squareColumnIndex}
        <Square
          {square}
          {dragging}
          on:updateDot={(event) =>
            updateDot(event, squareRowIndex, squareColumnIndex)}
        />
      {/each}
    </div>
  {/each}
</div>

<style>
  .board {
    display: flex;
    flex-direction: column;
    padding: 1px;
    background-color: #505050;
  }
  .board-row {
    display: flex;
  }
</style>
