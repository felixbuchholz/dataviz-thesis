<template>
  <div class="grid-container">
    <div class="margin-left"></div>
    <div class="center-block">
      <div class="landing">
        <h1 class="hug-bottom">
          Universal Income Guarantees. <br />
          An opportunity to rethink welfare?
        </h1>
        <h6 class="subheadline">An interactive visual inquiry</h6>
      </div>
    </div>
    <div class="margin-right"></div>
  </div>
</template>

<script>
export default {
  name: "landingPage",
  props: {
    msg: String
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
$center-background-color: rgba(252, 252, 252, 1);

.landing {
  margin-top: 40vh;
  margin-bottom: 40vh;
  // background: $center-background-color;
}
h1 {
  margin-bottom: 1rem;
}
.subheadline {
  display: inline;
  padding-bottom: 1.5rem;
  border-bottom: 0.5px solid rgba(0, 0, 0, 0.4);
}
</style>
