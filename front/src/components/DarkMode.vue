<template>
  <div class="main_div">
        <input id="toggleDarkMode" :value="value" class="toggle" type="checkbox" checked>
  </div>
</template>

<script>
export default {
    name: "DarkMode",
    props: ['value']
}
</script>

<style>
:root {
    --size: 5rem;
    --moon-color: hsl(240, 100%, 95%);
    --sun-color: hsl(40, 100%, 50%);
    --ray-size: calc(var(--size) * -0.4);
    --offset-orthogonal: calc(var(--size) * 0.65);
    --offset-diagonal: calc(var(--size) * 0.45);
}

.toggle {
    appearance: none;
    outline: none;
    cursor: pointer;
    width: var(--size);
    height: var(--size);
    box-shadow: inset calc(var(--size) * 0.33) calc(var(--size) * -0.25) 0;
    border-radius: 999px;
    color: var(--moon-color);
    transition: all 500ms;
}
.toggle:checked {
    transform: scale(0.75);
    color: var(--sun-color);
    box-shadow: inset 0 0 0 var(--size), calc(var(--offset-orthogonal) * -1) 0 0 var(--ray-size), var(--offset-orthogonal) 0 0 var(--ray-size), 0 calc(var(--offset-orthogonal) * -1) 0 var(--ray-size), 0 var(--offset-orthogonal) 0 var(--ray-size), calc(var(--offset-diagonal) * -1) calc(var(--offset-diagonal) * -1) 0 var(--ray-size), var(--offset-diagonal) var(--offset-diagonal) 0 var(--ray-size), calc(var(--offset-diagonal) * -1) var(--offset-diagonal) 0 var(--ray-size), var(--offset-diagonal) calc(var(--offset-diagonal) * -1) 0 var(--ray-size);
}
</style>
