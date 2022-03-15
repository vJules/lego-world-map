<script lang="ts">
  import { onMount } from "svelte";
  import type { RGBColor } from "../../models/RGBColor";
  import { colorPickerItems } from "../../stores/color";
  import { distanceBetweenRGB, hexToRgb } from "../../utils/color.utils";

  let image: string | ArrayBuffer;
  let hoveredColor: string;
  let colors: RGBColor[][] = [];

  const loadImage = () => {
    const canvas = document.getElementById("canvas") as HTMLCanvasElement;
    const ctx = canvas.getContext("2d");
    var img = new Image();
    img.addEventListener(
      "load",
      function () {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
      },
      false
    );
    img.src = "/images/colors.jpg";
  };

  onMount(() => {
    loadImage();
  });

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
      };
      img.src = event.target.result.toString();
    };
    reader.readAsDataURL((e.target as HTMLInputElement).files[0]);
  };

  const getImageData = (event: MouseEvent | FocusEvent) => {
    var x = event.layerX;
    var y = event.layerY;

    const canvas = document.getElementById("canvas") as HTMLCanvasElement;
    const ctx = canvas.getContext("2d");

    const pixel = ctx.getImageData(x, y, 10, 10);
    var data = pixel.data;

    const rgba = `rgba(${data[0]}, ${data[1]}, ${data[2]}, ${data[3] / 255})`;
    hoveredColor = rgba;

    return rgba;
  };

  const getColorArray = () => {
    const interval = 10;
    let currentX = interval;
    let currentY = interval;
    const canvas = document.getElementById("canvas") as HTMLCanvasElement;
    let colorRow = [];
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
        console.log(colorItem);
        tmp = distanceBetweenRGB(rgb, colorItem.rgb);
        if (tmp < lowest) {
          lowest = tmp;
          closestColor = colorItem;
        }
      });
      console.log(closestColor);
      colorRow.push(closestColor.rgb);
      currentX += interval;

      if (currentX >= canvas.width && canvas.height >= currentY) {
        newColors.push(colorRow);
        colorRow = [];
        currentX = interval;
        currentY += interval;
      }
    }

    colors = newColors;
    console.log(colors);
  };

  //   const getClosestHex = (color: RGBColor) => {
  //     var lowest = Number.POSITIVE_INFINITY;
  //     var tmp;
  //     let index = 0;
  //     $colorPickerItems.forEach((colorItem) => {
  //       tmp = distanceBetweenRGB(color, colorItem.);
  //       if (tmp < lowest) {
  //         lowest = tmp;
  //       }
  //     });
  //     return baseColors[index];
  //   };
</script>

<main>
  <canvas
    id="canvas"
    width="200"
    height="200"
    on:mousemove={(e) => getImageData(e)}
    on:focus={(e) => getImageData(e)}
  >
    <div>Loading</div>
  </canvas>

  {hoveredColor}

  <button on:click={getColorArray}>Get colors</button>
  <input
    type="file"
    accept=".jpg, .jpeg, .png"
    on:change={(e) => onFileSelected(e)}
  />

  {#if colors}
    <div style="display: flex; flex-direction: column;">
      {#each colors as colorRow}
        <div style="display: flex;">
          {#each colorRow as color}
            <div
              style="background-color: rgba({color.red}, {color.green}, {color.blue}, 1); width: 10px; height: 10px;"
            />
          {/each}
        </div>
      {/each}
    </div>
  {/if}
</main>

<style>
</style>
