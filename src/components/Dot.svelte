<script lang="ts">
  import type { IDot } from "../models/Board";
  import { DOT_COLOR } from "../constants/DotColor";
  import { currentColorKey } from "../stores/color";

  import { createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();
  const updateDot = () => $currentColorKey !== dot.color && dispatch("update");

  export let dot: IDot;
  export let dragging: boolean;
</script>

<div
  class="dot__hitbox"
  on:click={updateDot}
  on:mouseover={() => dragging && updateDot()}
  on:focus={() => dragging && updateDot()}
>
  <div class={`dot`} style={`background-color: ${DOT_COLOR[dot.color].hex};`} />
</div>

<style>
  .dot {
    width: 100%;
    border-radius: 50%;
  }
  .dot__hitbox {
    width: 8px;
    height: 8px;
    display: flex;
    margin: 1px;
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
