<script lang="ts">
  import type { IDot } from "../models/Board";
  import { DOT_COLOR } from "../constants/DotColor";
  import { currentColorKey } from "../stores/color";

  import { createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();
  const updateDot = () => {
    $currentColorKey !== dot.color && dispatch("update");
  };

  export let dot: IDot;
  export let isDragging: boolean;
  export let disableDotEvents: boolean;
  export let rowIndex: number;
  export let columnIndex: number;
  export let squareRowIndex: number;
  export let squareColumnIndex: number;
</script>

<div
  class="dot__hitbox"
  on:click={() => !disableDotEvents && updateDot()}
  on:mouseover={() => isDragging && !disableDotEvents && updateDot()}
  on:focus={() => isDragging && !disableDotEvents && updateDot()}
  data-row-index={rowIndex}
  data-column-index={columnIndex}
  data-square-row-index={squareRowIndex}
  data-square-column-index={squareColumnIndex}
>
  <div class={`dot`} style={`background-color: ${DOT_COLOR[dot.color].hex};`} />
</div>

<style>
  .dot {
    width: 100%;
    border-radius: 50%;
    margin: 1px;
  }
  .dot__hitbox {
    width: 10px;
    height: 10px;
    display: flex;
  }
  @media (max-width: 900px) {
    .dot__hitbox {
      width: 5px;
      height: 5px;
      display: flex;
      margin: 1px;
    }
  }
</style>
