<script lang="ts">
  import type { IDotsSquare } from "../models/Board";
  import Dot from "./Dot.svelte";
  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();
  const updateDot = (rowIndex, columnIndex) =>
    dispatch("updateDot", {
      rowIndex,
      columnIndex,
    });

  export let square: IDotsSquare;
  export let isDragging: boolean;
  export let disableDotEvents: boolean;
  export let squareRowIndex: number;
  export let squareColumnIndex: number;
</script>

<div class="square">
  {#each square.dotRows as dotRow, rowIndex}
    <div class="dot-row">
      {#each dotRow as dot, columnIndex}
        <Dot
          {dot}
          {isDragging}
          {disableDotEvents}
          {rowIndex}
          {columnIndex}
          {squareRowIndex}
          {squareColumnIndex}
          on:update={() => updateDot(rowIndex, columnIndex)}
        />
      {/each}
    </div>
  {/each}
</div>

<style>
  .square {
    background-color: #505050;
    margin: 1px;
    display: flex;
    flex-direction: column;
  }
  .dot-row {
    display: flex;
    flex: 1 0 auto;
  }
</style>
