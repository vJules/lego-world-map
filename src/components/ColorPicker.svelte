<script>
  import {
    currentColorKey,
    colorPickerItems,
    removeColorPickerLimit,
  } from "../stores/color";
  import Button from "./ui/Button.svelte";
  function updateCurrentColorKey(colorKey) {
    currentColorKey.update(() => colorKey);
  }
</script>

<div class="color-picker">
  {#each $colorPickerItems as colorPickerItem}
    <div
      class="color-picker-item"
      class:current={$currentColorKey === colorPickerItem.key}
      on:click={() => updateCurrentColorKey(colorPickerItem.key)}
    >
      <div
        class="color-picker-item-circle"
        style={`background-color: ${colorPickerItem.hex}`}
      />
      <span class="color-picker-item-name">
        {colorPickerItem.displayName}
      </span>
      <span class="color-picker-item-count">{colorPickerItem.amountLeft}</span>
    </div>
  {/each}
  <Button on:click={removeColorPickerLimit}>Remove limit</Button>
</div>

<style>
  .color-picker {
    display: flex;
    flex-direction: column;

    padding: 20px 10px;
    background-color: #6b6b6b;
    margin-bottom: auto;
  }
  .color-picker-item {
    padding: 5px;
    margin-bottom: 10px;
    cursor: pointer;
    transition: color 0.25s ease-in-out, background-color 0.25s ease-in-out;
    display: flex;
    align-items: center;
  }
  .color-picker-item:hover {
    background-color: #999999;
  }

  .color-picker-item:last-of-type {
    margin-bottom: 0;
  }
  .color-picker-item.current {
    background-color: #313131;
    color: white;
  }

  .color-picker-item-circle {
    height: 12px;
    width: 12px;
    border: 1px solid white;
    border-radius: 50%;
  }
  .color-picker-item-name {
    margin-left: 5px;
  }
  .color-picker-item-count {
    margin-left: auto;
  }
</style>
