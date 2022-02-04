<script>
  let container;
  let map;
  let zoom = 8;
  let center = { lat: -34.397, lng: 150.644 };

  import { onMount } from "svelte";
  import { mapsStyles } from "./mapsStyles";
  onMount(async () => {
    map = new google.maps.Map(container, {
      zoom,
      center,
      styles: mapsStyles,
    });

    const drawingManager = new google.maps.drawing.DrawingManager({
      drawingMode: google.maps.drawing.OverlayType.MARKER,
      drawingControl: true,
      drawingControlOptions: {
        position: google.maps.ControlPosition.TOP_CENTER,
        drawingModes: [
          google.maps.drawing.OverlayType.POLYGON,
          google.maps.drawing.OverlayType.RECTANGLE,
        ],
      },
      circleOptions: {
        fillColor: "#ffff00",
        fillOpacity: 1,
        strokeWeight: 5,
        clickable: false,
        editable: true,
        zIndex: 1,
      },
    });

    drawingManager.setMap(map);

    google.maps.event.addListener(
      drawingManager,
      "overlaycomplete",
      function (event) {
        if (event.type == "rectangle") {
          console.log(event.overlay);
        }
        if (event.type == "polygon") {
          console.log(event.overlay);
        }
      }
    );
  });

  const getCurrentMapData = () => {
    console.log("yo");
  };
</script>

<div class="full-screen">
  <button class="map-button" on:click={getCurrentMapData}>Get data</button>
  <div class="map" bind:this={container} />
</div>

<style>
  .full-screen {
    width: calc(100vw - 20px);
    height: calc(100vh - 120px);
    padding-top: 100px;
    position: relative;
  }
  .map-button {
    position: absolute;
    top: 0;
    left: 0;
  }
  .map {
    width: 100%;
    height: 100%;
  }
</style>
