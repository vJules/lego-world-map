<script>
  import { currentColorKey, colorPickerItems } from "../stores/color";
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
      <span style={`color: ${colorPickerItem.hex}`}>
        {colorPickerItem.displayName}
      </span>:
      {colorPickerItem.count}
    </div>
  {/each}
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
    margin-bottom: 5px;
    cursor: pointer;
    transition: background-color 0.25s ease-in-out;
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
</style>
