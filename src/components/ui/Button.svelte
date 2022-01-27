<script lang="ts">
  import { createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();
  export let isActive: boolean = false;
  export let type: string = "primary";
</script>

<button
  on:click={(e) => dispatch("click", e)}
  class={`button ${type}`}
  class:active={isActive}
>
  <slot />
</button>

<style>
  .button {
    display: flex;
    overflow: hidden;
    padding: 8px 12px;
    cursor: pointer;
    user-select: none;
    transition: all 150ms linear;
    text-align: center;
    white-space: nowrap;
    text-decoration: none !important;
    text-transform: none;
    text-transform: capitalize;
    color: #fff;
    border: 1px solid;
    border-radius: 4px;
    font-size: 13px;
    font-weight: 500;
    line-height: 1.3;
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    justify-content: center;
    align-items: center;
    flex: 0 0 160px;
    font-family: "Alatsi", sans-serif;
  }
  .button:hover:not(.active) {
    transition: all 150ms linear;
    opacity: 0.85;
  }
  .button:active {
    transition: all 150ms linear;
    opacity: 0.75;
  }

  .button.primary {
    background-color: #01cecb;
    border-color: #01cecb;
    color: #96e6e6;
  }

  .button.danger {
    background: #f32c52;
    border-color: #f32c52;
    color: #fda7b7;
  }

  .button:focus {
    outline: none;
  }
  .button.primary.active {
    background-color: #008381;
    border-color: rgb(0, 235, 231);
  }
</style>
