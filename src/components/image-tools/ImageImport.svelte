<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import type { RGBColor } from "../../models/RGBColor";
  import { colorPickerItems } from "../../stores/color";
  import { distanceBetweenRGB } from "../../utils/color.utils";

  const dispatch = createEventDispatcher();

  const onFileSelected = (e: Event) => {
    const canvas = document.getElementById("canvas") as HTMLCanvasElement;
    const ctx = canvas.getContext("2d");
    const reader = new FileReader();
    reader.onload = function (event) {
      const img = new Image();
      img.onload = function () {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        getColorArray();
      };
      img.src = event.target.result.toString();
    };
    reader.readAsDataURL((e.target as HTMLInputElement).files[0]);
  };

  const getColorArray = () => {
    const interval = 10;
    let currentX = 0;
    let currentY = 0;
    const canvas = document.getElementById("canvas") as HTMLCanvasElement;
    const newColors = [];
    while (canvas.width > currentX && canvas.height > currentY) {
      const ctx = canvas.getContext("2d");
      const pixel = ctx.getImageData(currentX, currentY, 1, 1);
      const data = pixel.data;
      const rgb = { red: data[0], green: data[1], blue: data[2] } as RGBColor;

      var lowest = Number.POSITIVE_INFINITY;
      var tmp;
      let closestColor = null;
      $colorPickerItems.forEach((colorItem) => {
        tmp = distanceBetweenRGB(rgb, colorItem.rgb);
        if (tmp < lowest) {
          lowest = tmp;
          closestColor = colorItem;
        }
      });
      newColors.push({
        x: currentX / interval,
        y: currentY / interval,
        dotColorKey: closestColor.key,
      });
      if (currentX < canvas.width) {
        currentX += interval;
        if (currentX + interval > canvas.width) {
          currentX = 0;
          currentY += interval;
        }
      }
    }
    dispatch("updateOverlayDots", {
      dots: newColors,
    });
  };
</script>

<main>
  <canvas id="canvas">
    <div>Loading</div>
  </canvas>
  <input
    type="file"
    accept=".jpg, .jpeg, .png"
    on:change={(e) => onFileSelected(e)}
  />
</main>

<style>
</style>
