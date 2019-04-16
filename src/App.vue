<template>
  <div id="app">
    <HelloWorld msg="Universal Income Guarantees" />
    <graphModelOne />
  </div>
</template>

<script>
import HelloWorld from "./components/HelloWorld.vue";
import graphModelOne from "./components/graphModelOne.vue";
export default {
  name: "app",
  components: {
    HelloWorld,
    graphModelOne
  }
};
</script>

<style lang="scss">
#app {
}
</style>
