<template>
  <div class="section">
    <!-- * Template * -->
    <div class="grid-container">
      <div class="margin-left"></div>
      <div class="center-block"></div>
      <div class="margin-right"></div>
    </div>
    <!-- * -->
    <div class="grid-container">
      <div class="margin-left"></div>
      <div class="center-block">
        <h2 class="hug-bottom" id="section-2">
          <span class="italic">Why</span> should we talk about <br />
          <span class="italic">universal income guarantees?</span>
        </h2>
        <h6 class="subheadline">Three possible entry points</h6>
      </div>
      <div class="margin-right"></div>
    </div>
    <!-- * -->
    <div class="grid-container">
      <div class="margin-left"></div>
      <div class="center-block">
        <!-- These migh be links -->
        <p class="left">
          Interests in UIGs are diverse. Some see it as an opportunity to
          <span class="bold">reduce</span>
          the amount of <span class="bold">bureaucracy</span> to administer
          welfare programs, some others are concerned with
          <span class="bold">growing unemployment</span> in the face of
          advancements in <span class="bold">artificial intelligence</span> and
          many advocate that it would be just a
          <span class="bold">fair policy</span> for
          <span class="bold">shared growth</span> in a society.
        </p>
      </div>
      <div class="margin-right"></div>
    </div>
    <!-- * -->
    <div class="grid-container">
      <div class="margin-left"></div>
      <div class="center-block">
        <p class="right">
          Of course, there are also concerns that a UIG is the first step to an
          inefficient and <span class="bold">unsustainable</span> egalitarian
          system. And because it’s granted to everyone in contrast to most of
          the current welfare, confusion about the real net costs of such a
          program often lead to an early dismissal of the idea: it appears to be
          <span class="bold">too expensive</span> to be feasible.
        </p>
      </div>
      <div class="margin-right"></div>
    </div>
    <!-- * -->
    <div class="grid-container">
      <div class="margin-left"></div>
      <div class="center-block">
        <p class="intro">
          By no means are the mentioned arguments exhaustive of the debate, but
          let’s start with these
          <span class="bold">three entry points</span> (you can also skip to the
          one of your interest):
        </p>
        <ol class="intro">
          <li>
            Easing the effects of <a href="#automation">growing automation,</a>
          </li>
          <li>
            Reducing the negative aspects of
            <a href="#bureaucracy">bureaucracy,</a>
          </li>
          <li>
            <a href="#fairness">Fairness</a> and a more collaborative growth
          </li>
        </ol>
      </div>
      <div class="margin-right"></div>
    </div>
    <div class="grid-container">
      <div class="margin-left"></div>
      <div class="center-block"><div class="spacer-sub"></div></div>
      <div class="margin-right"></div>
    </div>
    <automationSubsection />
    <bureaucracySubsection />
    <fairnessSubsection />
    <!-- * Template * -->
    <div class="grid-container">
      <div class="margin-left"></div>
      <div class="center-block"><div class="spacer"></div></div>
      <div class="margin-right"></div>
    </div>
  </div>
</template>

<script>
import automationSubsection from "../components/automationSubsection.vue";
import bureaucracySubsection from "../components/bureaucracySubsection.vue";
import fairnessSubsection from "../components/fairnessSubsection.vue";
export default {
  name: "secondSection",
  components: {
    automationSubsection,
    bureaucracySubsection,
    fairnessSubsection
  },
  props: {
    msg: String
  },
  data() {
    return {};
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
// @import "../assets/scss/color_defs.scss";
graphSide {
  position: absolute;
}
</style>
