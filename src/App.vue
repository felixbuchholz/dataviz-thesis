<template>
  <div id="app">
    <siteMenu />
    <landingPage />
    <firstSection />
    <secondSection />
    <thirdSection />
    <forthSection />
    <fifthSection />
    <div class="grid-container">
      <div class="margin-left"></div>
      <div class="center-block"></div>
      <div class="margin-right"></div>
    </div>

    <!-- <graphModelOne /> -->
  </div>
</template>

<script>
import siteMenu from "./components/siteMenu.vue";
import landingPage from "./components/landingPage.vue";
import firstSection from "./components/firstSection.vue";
import secondSection from "./components/secondSection.vue";
import thirdSection from "./components/thirdSection.vue";
import forthSection from "./components/forthSection.vue";
import fifthSection from "./components/fifthSection.vue";

export default {
  name: "app",
  components: {
    siteMenu,
    landingPage,
    firstSection,
    secondSection,
    thirdSection,
    forthSection,
    fifthSection
  },
  title: "Universal Income Guarantees",
  mounted() {
    // Credit: https://stackoverflow.com/questions/7717527/smooth-scrolling-when-clicking-an-anchor-link
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener("click", function(e) {
        e.preventDefault();

        document.querySelector(this.getAttribute("href")).scrollIntoView({
          block: "start",
          behavior: "smooth"
        });
      });
    });
  }
};
</script>

<style lang="scss"></style>
