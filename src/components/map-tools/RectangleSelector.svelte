<script lang="ts">
  import { createEventDispatcher, onMount, onDestroy } from "svelte";

  let isVisible: boolean = false;
  let selectionTopLeft: any = { x: 0, y: 0 };
  let selectionBottomRight: any = { x: 0, y: 0 };

  const dispatch = createEventDispatcher();
  const dispatchSelection = (selectionTopLeft, selectionBottomRight) =>
    dispatch("selection", { selectionTopLeft, selectionBottomRight });

  const detectLeftButton = (event) => {
    event = event || window.event;
    if ("buttons" in event) {
      return event.buttons == 1;
    }
    var button = event.which || event.button;
    return button == 1;
  };

  const bindMouseDown = (event) => {
    if (!detectLeftButton(event)) return;
    console.log("this is left click");
    isVisible = true;
    selectionTopLeft = { x: event.clientX, y: event.clientY };
    selectionBottomRight = { x: event.clientX, y: event.clientY };
  };

  const bindMouseMove = (event) => {
    if (!detectLeftButton(event)) return;
    selectionBottomRight = { x: event.clientX, y: event.clientY };
  };

  const bindMouseUp = () => {
    isVisible = false;
    dispatchSelection(selectionTopLeft, selectionBottomRight);
    selectionTopLeft = { x: 0, y: 0 };
    selectionBottomRight = { x: 0, y: 0 };
  };

  onMount(() => {
    document.addEventListener("mousedown", bindMouseDown);
    document.addEventListener("mouseup", bindMouseUp);
    document.addEventListener("mousemove", bindMouseMove);
  });

  onDestroy(() => {
    document.removeEventListener("mousedown", bindMouseDown);
    document.removeEventListener("mouseup", bindMouseUp);
    document.removeEventListener("mousemove", bindMouseMove);
  });
</script>

<div
  class="rectangle-selector"
  class:active={isVisible}
  style={`top: ${selectionTopLeft.y}px; left: ${selectionTopLeft.x}px; width: ${
    selectionBottomRight.x - selectionTopLeft.x
  }px; height: ${selectionBottomRight.y - selectionTopLeft.y}px;`}
/>

<style>
  .rectangle-selector {
    position: fixed;
    background-color: dodgerblue;
    opacity: 0;
  }

  .rectangle-selector.active {
    opacity: 0.6;
  }
</style>
