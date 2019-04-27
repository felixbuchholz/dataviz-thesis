<template>
  <div id="app">
    <landingPage />
    <div class="grid-container">
      <div class="margin-left"></div>
      <div class="center-block">
        <!-- <HelloWorld msg="Universal Income Guarantees" /> -->
        <!-- <h2>Universal Income Guarantees</h2> -->
        <h2 class="hug">
          <span class="italic">How</span> would a universal income guarantee
          <br />
          <span class="italic">affect incomes in the US?</span>
        </h2>
        <h6 class="subheadline">A comparison of two static models</h6>
        <div class="unhug">
          <p class="intro">
            In order to understand the
            <span class="bold"
              >nuances and challenges of a pragmatic implementation</span
            >
            in regards to a fair share of growth, it’s important to look at how
            a UIG would affect incomes.
          </p>
          <p class="intro">
            We will look at two different models, that are still very
            <span class="bold">general approaches</span> to income guarantees
            but try to start thinking about how incomes after benefits would
            change overall.
          </p>
        </div>
        <p class="left">
          The first model puts a strong emphasis on
          <span class="bold">compatibility with the current</span>
          income tax model.
        </p>
        <p class="left">
          The idea is to determine a income tax threshold (similar to the
          already existing one) below which households don’t have to pay income
          tax. In addition to being an allowance this threshold would also
          determine the amount of a new tax return. For example for every dollar
          below that threshold a household would receive 50 cents. If the
          threshold was set at $ 24,000 and a household has earned $ 12,000 the
          difference would be $ 12,000. The difference multiplied by $ 0.50
          would result in a $ 6,000 tax return or a combined income of $18,000.
          Because of this construction this concept is often called a
          <span class="bold">Negative Income Tax,</span> but other names like
          Basic Inome are also sometimes used.
        </p>
        <p class="left">
          In tax terminology we can also think of the rate of $ 0.50 per dollar
          less income as a negative marginal tax rate of 50 %. Fifty percent is
          a value that is often chosen in UIG concepts because it is
          <span class="bold">considered a good compromise</span> of the need to
          fade out a benefit with increased earnings and work incentives,
          avoiding the welfare trap (see also the earlier section).
        </p>
        <p class="left">
          The next question we need to answer for this model is:
          <span class="bold">What is the right income threshold?</span> When the
          model was conceived, there was no final answer, but instead an
          approach to compare different outcomes. – First we would assess how
          much is currently spent on welfare. (Second identify everything that
          can be translated into a cash transfer.) And then calculate the
          outcomes of transforming this amount into an UIG for different income
          thresholds and compare and estimate which one would have a reasonable
          benefit for the most people.
        </p>
        <p class="left">
          In the following interactive graph we will see
          <span class="bold">the results of these calculations</span>. You can
          select and de-select which welfare programs should be in place and
          which lower income brackets should be affected by the new income
          guarantee.
        </p>
      </div>
    </div>
    <div class="margin-right"></div>

    <graphModelOne />
  </div>
</template>

<script>
import landingPage from "./components/landingPage.vue";
import graphModelOne from "./components/graphModelOne.vue";
export default {
  name: "app",
  components: {
    landingPage,
    graphModelOne
  },
  title: "Universal Income Guarantees"
};
</script>

<style lang="scss">
#app {
}
</style>
