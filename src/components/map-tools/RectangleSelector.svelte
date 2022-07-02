<script lang="ts">
  import { createEventDispatcher, onMount, onDestroy } from "svelte";

  let isVisible: boolean = false;
  let selectionTopLeft: any = { x: 0, y: 0 };
  let selectionBottomRight: any = { x: 0, y: 0 };
  let initialClickPosition: any = { x: 0, y: 0 };
  export let containerElement: HTMLElement;

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
    isVisible = true;
    initialClickPosition = { x: event.clientX, y: event.clientY };
    selectionTopLeft = { x: event.clientX, y: event.clientY };
    selectionBottomRight = { x: event.clientX, y: event.clientY };
  };

  const bindMouseMove = (event) => {
    if (!detectLeftButton(event)) return;
    if (initialClickPosition.x > event.clientX) {
      selectionTopLeft.x = event.clientX;
      selectionBottomRight.x = initialClickPosition.x;
    } else {
      selectionTopLeft.x = initialClickPosition.x;
      selectionBottomRight.x = event.clientX;
    }
    if (initialClickPosition.y > event.clientY) {
      selectionTopLeft.y = event.clientY;
      selectionBottomRight.y = initialClickPosition.y;
    } else {
      selectionTopLeft.y = initialClickPosition.y;
      selectionBottomRight.y = event.clientY;
    }
  };

  const bindMouseUp = () => {
    isVisible = false;
    dispatchSelection(selectionTopLeft, selectionBottomRight);
    selectionTopLeft = { x: 0, y: 0 };
    selectionBottomRight = { x: 0, y: 0 };
  };

  onMount(() => {
    containerElement.addEventListener("mousedown", bindMouseDown);
    containerElement.addEventListener("mouseup", bindMouseUp);
    containerElement.addEventListener("mousemove", bindMouseMove);
  });

  onDestroy(() => {
    containerElement.removeEventListener("mousedown", bindMouseDown);
    containerElement.removeEventListener("mouseup", bindMouseUp);
    containerElement.removeEventListener("mousemove", bindMouseMove);
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
