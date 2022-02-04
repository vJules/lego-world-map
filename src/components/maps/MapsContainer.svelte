<script>
  import Map from "./Map.svelte";
  export let ready;
</script>

<svelte:head>
  <script
    defer
    async
    src="https://maps.googleapis.com/maps/api/js?key=AIzaSyAS-pzF3LZ6vgSnU4HaIYE-DKgseBqRChQ&libraries=drawing&callback=initMap">
  </script>
</svelte:head>

{#if ready}
  <Map />
{/if}

<style>
  :global(body) {
    padding: 0;
  }
</style>
