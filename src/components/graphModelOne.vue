<template>
  <div class="grid-container">
    <div class="margin-left">
      <div v-if="isLoaded" class="interface">
        <!-- <br /> -->
        <h5 class="sans small regular unhug-top blur" id="selectHeadline">
          Configure the scheme:
        </h5>
        <div class="uig unhug-top border-top-with-note blur" id="selectUIG">
          <div
            :class="
              `positions position${positionsArray.length -
                1} transfer-checkboxes`
            "
            @mouseenter="mouseenterCheckboxes"
            @mouseleave="mouseleaveCheckboxes"
            :id="positionsArray.length - 1"
          >
            <p class="sans small note-top-unhug">Should a UIG be active?</p>
            <div>
              <label
                class="checkbox-container sans color-primary checkbox-primary"
              >
                <div class="center">Universal Income Guarantee</div>
                <input
                  v-if="isLoaded"
                  v-show="positionsArray[positionsArray.length - 1].checked"
                  type="checkbox"
                  v-model="positionsArray[positionsArray.length - 1].checked"
                  @click="togglePosition(positionsArray.length - 1)"
                />
                <span class="checkmark checkmark-primary"></span>
              </label>
            </div>
            <!-- <h5 class="sans">Change the parameters of this scheme:</h5> -->
            <transition name="fade">
              <div v-show="onlyUIG[0].checked" class="parameters">
                <p class="sans small note-top-unhug hug-bottom">
                  – Yes, and the UIG should go to the
                </p>
                <!-- Credit input field:  https://codepen.io/anon/pen/MRXvdp -->
                <div class="group bignumberinput">
                  <!-- <label for="incomebrackets" class="bignumberinput">lowest</label> -->
                  <input
                    type="text"
                    pattern="\d*"
                    maxlength="1"
                    id="incomebrackets"
                    required="required"
                    class="bignumberinput sans"
                    max="9"
                    v-model.number="numOfUIGBins"
                    @change="doAfterIncomeBracketsChanged()"
                  />
                  <div
                    for="incomebrackets"
                    class="controls bold sans control-minus"
                    @click="minusBins()"
                  >
                    -
                  </div>
                  <label for="incomebrackets" class="bignumberinput sans"
                    >lowest income brackets</label
                  >
                  <div
                    class="controls bold sans control-plus"
                    @click="plusBins()"
                  >
                    +
                  </div>
                  <div class="bar bignumberinput"></div>
                </div>
              </div>
            </transition>
          </div>
        </div>
        <div class="border-top-with-note blur" id="selectWelfare">
          <p class="sans small note-top-unhug">
            Programs in which of these categories should be in place?
          </p>

          <div
            :class="
              `positions position${positionsOnlyWelfareR.length -
                i -
                1 +
                1} transfer-checkboxes`
            "
            v-for="(e, i) in positionsOnlyWelfareR"
            :key="i + 1"
            :id="positionsOnlyWelfareR.length - i"
            @mouseenter="mouseenterCheckboxes"
            @mouseleave="mouseleaveCheckboxes"
          >
            <label
              :key="i + 1"
              :class="
                `checkbox-container sans color-${e.name} checkbox-${e.name}`
              "
            >
              <div class="center">{{ e.listName }}</div>
              <input
                type="checkbox"
                v-model="e.checked"
                @click="
                  togglePosition(positionsOnlyWelfareR.length - 1 - i + 1)
                "
              />
              <span :class="`checkmark checkmark-${e.name}`"></span>
            </label>
          </div>
        </div>
        <div class="income border-top-with-note blur" id="selectScale">
          <p class="sans small note-top-unhug">
            Show the income without benefits in comparison?
          </p>
          <div
            :class="`positions position${0} transfer-checkboxes`"
            @mouseenter="mouseenterCheckboxes"
            @mouseleave="mouseleaveCheckboxes"
            id="0"
          >
            <label class="checkbox-container sans">
              <div class="color-minc center">Income without benefits</div>
              <input
                v-if="isLoaded"
                type="checkbox"
                v-model="positionsArray[0].checked"
                @click="togglePosition(0)"
              />
              <span class="checkmark"></span>
            </label>
          </div>
          <p class="sans small note-top-unhug">
            Focus on the lower six income brackets?
          </p>
          <div class="zoom-container" @click="scaleYAxis">
            <div class="icon-medium">
              <zoomIcon class="zoom-icon" />
              <div class="small sans color-light plusOrMinus">
                {{ zoomSign[0] }}
              </div>
            </div>
            <div>
              <p class="sans zoomText color-light">
                Zoom {{ zoomSign[1] }} the Y-axis
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="center-block">
      <div class="chart">
        <h5 class="sans hug-bottom" id="graph-headline1">UIG scheme 1:</h5>
        <span class="sans"
          >Select welfare programs to be replaced and provide a UIG to the
          <span class="bold">
            lowest
            <span v-if="isLoaded & (numOfUIGBins > 0)" class="color-uig">{{
              numOfUIGBins
            }}</span>
            income brackets
          </span></span
        >
        <div v-if="tooltip.id != null">
          <transition-group name="tipmove" tag="div">
            <div
              class="tooltip-container"
              v-for="(element, index) in data"
              :key="index * 10 + element.id"
              :style="
                `position:fixed;left:${tooltip.left}px;top:${
                  tooltip.top
                }px;right:${tooltip.right}px;bottom:${tooltip.bottom}px`
              "
            >
              <div
                class="tooltip sans"
                :id="`tooltip${element.id}`"
                v-show="index == tooltip.id"
                v-html="formatTooltip(element)"
                @mouseenter="touchedToolTip"
              ></div>
            </div>
          </transition-group>
        </div>
        <transition name="fade">
          <svg
            class="unhug-top"
            v-if="isLoaded"
            :width="svgWidth"
            :height="svgHeight"
            id="incomedistribution"
          >
            <g :transform="`translate(${margin.left}, ${margin.top})`">
              <!-- Credit grid-lines: Andrew Levinson
                  https://github.com/AndrewLevinson/thesis/blob/master/src/components/ChartOne.vue
               -->
              <g v-if="isLoaded">
                <g v-grid:gridLine="scale" class="grid-lines"></g>
              </g>
              <g v-for="(e, i) in data" :key="i" :id="`bin${i}`">
                <transition name="fade">
                  <g v-if="show" :id="`${e.id}`">
                    <g v-for="(f, j) in e.positions" :key="`${i}${f.name}`">
                      <transition name="fade">
                        <g
                          :transform="
                            `translate(${scale.x(e.bin)},${findVerticalPosition(
                              e.positions,
                              j
                            )})`
                          "
                        >
                          <path
                            v-show="show"
                            :class="
                              `positions path ${
                                f.category
                              } position${j} stroke-${f.name} stroke-deactive-${
                                f.category
                              }`
                            "
                            fill="none"
                            stroke="currentColor"
                            stroke-width="0.5"
                            :d="f.path.fill"
                          />
                          <path
                            v-show="
                              show & positionsArray[j].checked & (f.val > 0)
                            "
                            :class="
                              `positions path ${
                                f.category
                              } position${j} stroke-${f.name} stroke-deactive-${
                                f.category
                              }`
                            "
                            fill="none"
                            stroke="currentColor"
                            stroke-width="0.8"
                            :d="f.path.stroke"
                          />

                          <text
                            :x="scale.x.bandwidth() / 2"
                            y="-10"
                            :class="
                              `positions text text-no-opacity bold fill-${
                                f.name
                              } position${j}`
                            "
                            text-anchor="middle"
                          >
                            <!-- transform="rotate(-45) translate(-2,4)" -->
                            $ {{ showCurrentWelfareOrIncomeBefore(f, j) }}
                          </text>
                          <!-- <rect
                          v-show="show"
                          fill: "rgba(0,0,0,0.3)"
                          :width="scale.x.bandwidth()"
                          :height="height - scale.y(f.val)"
                        /> -->
                        </g>
                      </transition>
                    </g>
                    <g :transform="`translate(${0},${lineYPosition(e)})`">
                      <line
                        class="positions"
                        :x1="scale.x(e.bin) - scale.x.bandwidth() * 0.2"
                        :x2="scale.x(e.bin) + scale.x.bandwidth() * 1.2"
                        :stroke="decideStrokeColor(i)"
                        stroke-width="3"
                        stroke-dasharray="0.5 5"
                        stroke-linecap="round"
                      />
                    </g>
                  </g>
                </transition>
                <rect
                  v-show="show"
                  :key="`${i}${e.name}`"
                  :x="scale.x(e.bin)"
                  :y="0"
                  :width="scale.x.bandwidth()"
                  :height="height"
                  opacity="0"
                  fill="red"
                  :id="e.id"
                  @mouseenter="mouseenterBars"
                  @mousemove="mousemoveBars"
                  @mouseout="mouseleaveBars"
                />
              </g>

              <rect
                x="0"
                :y="height"
                :height="margin.bottom"
                :width="width"
                fill="#fcfcfc"
              />
              <text
                class="graph-label"
                :transform="`translate(${width}, ${height + 25})`"
                text-anchor="end"
                fill="currentColor"
              >
                *X
              </text>
              <g
                v-axis:x="scale"
                :transform="`translate(${0}, ${height})`"
                class="x-axis"
              ></g>
              <text
                class="graph-label"
                :transform="`translate(${0},-10)`"
                text-anchor="end"
                fill="currentColor"
              >
                *Y
              </text>
              <g v-axis:y="scale" class="y-axis"></g>
            </g>
          </svg>
        </transition>
        <div></div>
      </div>
      <!-- <button class="sans bold" @click="scaleYAxis">scale y-axis</button> -->
      <div class="insight sans light">
        <div v-if="insight == 'intro'">
          This graph shows the
          <span class="regular"
            >distribution of household incomes and welfare transfers</span
          >
          in the US in 2017. <br />
          <span class="regular">It is interactive!</span> – You can
          <button class="button" @click="readyToChange">directly change</button>
          the parameters of this scheme or read a
          <button class="button" @click="startIntro">
            small introduction.
          </button>
        </div>
        <div v-if="insight == 'introLegendA'">
          <span class="regular">Let’s take a look at the legend:</span> <br />
          The <span class="regular">height</span> of the bars in the chart
          indicates the sum income and benefits. Each bar stack represents an
          income group. The stacks are grouped and sorted by
          <span class="regular">income without benefits.</span>
          <button @click="goToLegendB">… continue</button> or
          <button @click="readyToChange">skip the rest of the intro?</button>
        </div>
        <div v-if="insight == 'introLegendB'">
          <span class="regular">This line </span>
          <svg
            class="inline-svg"
            v-if="isLoaded"
            :width="scale.x.bandwidth() * 1.6"
            height="5"
          >
            <line
              x1="0"
              y1="1"
              :x2="scale.x.bandwidth() * 1.6"
              y2="1"
              stroke="rgba(0,0,0,0.6)"
              stroke-width="2"
              stroke-dasharray="1 3"
              stroke-linecap="round"
            />
          </svg>
          above each stacked bar group
          <span class="regular"
            >indicates how much the sum of income and benefits was</span
          >
          before you made any changes. It will turn
          <span class="regular color-negative">red</span> if the result of this
          group is <span class="regular">negative.</span> It turns
          <span class="regular color-positive">green</span> if the group
          <span class="regular">profits</span> from your configuration. <br />
          <button @click="goToLegendC">
            Learn one more thing about the legend
          </button>
          or
          <button @click="readyToChange">… skip?</button>
        </div>
        <div v-if="insight == 'introLegendC'">
          The bars have two different textures. This one
          <svg
            class="inline-svg"
            v-if="isLoaded"
            :width="scale.x.bandwidth() * 1.6"
            height="16"
          >
            <path
              :transform="`translate(1, 1)`"
              stroke-width="0.5"
              fill="none"
              stroke="currentColor"
              :d="legendPathMarketIncomeSmall.fill"
            />
            <path
              :transform="`translate(1, 1)`"
              stroke-width="0.5"
              fill="none"
              stroke="currentColor"
              :d="legendPathMarketIncomeSmall.stroke"
            />
          </svg>
          for the <span class="regular">income without benefits</span> (but
          before taxes) and this one for
          <span class="regular"
            >welfare benefits, tax credits and the UIG:
          </span>
          <svg
            class="inline-svg"
            v-if="isLoaded"
            :width="scale.x.bandwidth() * 1.6"
            height="16"
          >
            <path
              :transform="`translate(1, 1)`"
              stroke-width="0.5"
              fill="none"
              stroke="currentColor"
              :d="legendPathTransfersSmall.fill"
            />
            <path
              :transform="`translate(1, 1)`"
              stroke-width="0.5"
              fill="none"
              stroke="currentColor"
              :d="legendPathTransfersSmall.stroke"
            />
          </svg>
          <br />
          <br />
          In the next step we can
          <button @click="goToScaleA">think about the scale</button> or
          <button @click="readyToChange">skip the rest of the intro?</button>
        </div>
        <div v-if="insight == 'readyToChange'">
          A UIG is active and the income threshold is
          <span class="color-primary"> {{ UIGthresholdF }} $. </span> <br />
          X people in y housholds will benefit from an average household income
          increase of z. <br /><span class="regular">But</span> X people in y
          housholds will experience an average decrease of household income of
          z.
          <div class="return-button">
            <button @click="startIntro" class="small">
              Back to the intro?
            </button>
          </div>
        </div>
        <div v-if="insight == 'introScaleA'">
          <span class="regular">Let’s talk about scale! </span> Because incomes
          in the last group are so high, it’s hard to see the welfare benefits.
          <span class="regular">To get more detail,</span> you can un-check this
          box:
          <label class="checkbox-container sans">
            <input
              v-if="isLoaded"
              type="checkbox"
              v-model="positionsArray[0].checked"
              @click="togglePosition(0)"
            />
            <span class="checkmark"></span>
          </label>
          on the left to exclude the incomes from the comparison.
          <span class="regular">Alternatively,</span> you can zoom
          <div class="zoom-container" @click="scaleYAxis">
            <div class="icon-medium">
              <zoomIcon class="zoom-icon" />
              <div class="small sans color-light plusOrMinus">
                {{ zoomSign[0] }}
              </div>
            </div>
          </div>
          to only focus on the first six income groups.
          <button class="button" @click="goToInterfaceA">
            Let’s learn about the interface
          </button>
          or
          <button class="button" @click="readyToChange">start using it.</button>
        </div>
        <div v-if="insight == 'introInterfaceA'">
          In this scheme
          <span class="regular"
            >the idea is to replace current welfare benefits with a UIG.</span
          >
          You can <span class="regular">hover</span> over the different
          categories to see how they affect incomes in all groups and select
          them individually. But for now –
          <span v-if="!allWelfareUnchecked">
            <button @click="uncheckAll">
              let’s un-check all of them!
            </button>
          </span>
          <span v-else-if="allWelfareUnchecked">
            Good!
            <button @click="goToInterfaceB">
              Ready to go to the UIG?
            </button>
          </span>
        </div>
        <div v-if="insight == 'introInterfaceB'">
          Let’s activate the UIG.
          <label class="checkbox-container sans color-primary checkbox-primary">
            <input
              v-if="isLoaded"
              v-show="positionsArray[positionsArray.length - 1].checked"
              type="checkbox"
              v-model="positionsArray[positionsArray.length - 1].checked"
              @click="togglePosition(positionsArray.length - 1)"
            />
            <span class="checkmark checkmark-primary"></span>
          </label>
          Now we have to decide how many of the lower income groups should
          benefit from it. For now we will
          <button @click="setUIGBinsTo5">
            set it to five.
          </button>
          <span v-if="introUIGActive & (numOfUIGBins == 5)">
            Great! Now
            <span class="regular"
              >every household with an income less than the upper boundary of
              group 5, </span
            ><span class="regular color-primary">$ {{ UIGthresholdF }},</span>
            will get <span class="regular">50 % of the difference</span> to the
            threshold as an income guarantee.
            <button class="button" @click="goToBudgetA">
              Should we go to the last step
            </button>
            or
            <button class="button" @click="readyToChange">
              start exploring?
            </button>
          </span>
        </div>
        <div v-if="insight == 'introBudgetA'">
          Our changes result in a overall balance of
          <span :class="`bold color-${balancePosOrNeg}`"
            >$ {{ currentBalanceF.join(" ") }}.</span
          >
          Still room to tweak this scheme! We could think about, whether some
          welfare programs should actually be still active, or adjust the amount
          of groups that benefit from the UIG. Keep in mind this is just a rough
          estimation! From now on you will see a summary of the effects of your
          changes in this place.
          <button @click="readyToChange">Enjoy exploring!</button>
        </div>
      </div>
      <div class="spacer"></div>
    </div>
    <div class="margin-right">
      <div v-if="isLoaded" class="budget grid-vertical-container">
        <div class="budget-calculations blur" id="selectBudget">
          <h5 class="sans small regular unhug-top">
            Overall balance effects of this scheme:
          </h5>
          <div>
            <div class="border-top-with-note unhug-top">
              <transition name="fade">
                <div v-show="currentTotalSavings != 0">
                  <p class="sans small note-top-unhug">
                    Current subtotal welfare savings ($):
                  </p>
                  <p class="sans bold align-right">
                    {{ currentTotalSavingsF }}
                  </p>
                </div>
              </transition>
              <transition name="fade">
                <div v-show="currentTotalSpendings != 0">
                  <p class="sans small">Current subtotal UIG spendings ($):</p>
                  <p class="sans bold align-right">
                    {{ currentTotalSpendingsF }}
                  </p>
                </div>
              </transition>
            </div>
            <div class="simple-flex border-top-with-note">
              <p class="sans bold note-top-unhug">
                Balance ($):
              </p>
              <p
                class="sans bold note-top-unhug"
                v-html="currentBalanceHTML"
              ></p>
            </div>
          </div>
        </div>
        <div class="spacer-auto"></div>
        <div class="legend-for-graph">
          <div class="border-top-with-note blur" id="selectLegend">
            <p class="sans small note-top-unhug">
              Legend:
            </p>
            <div class="sans small note-top-unhug simple-flex-row-nowrap">
              <div class="bold">*Y:</div>
              <div class="unhug-left-tiny">
                Household income with benefits and tax credits, before taxes
                ($), 2017
              </div>
            </div>
            <div class="sans small note-top-unhug simple-flex-row-nowrap">
              <div class="bold">*X:</div>
              <div class="unhug-left-tiny">
                Household income brackets without benefits, before taxes ($),
                2017
              </div>
            </div>
            <div class="unhug-top-small">
              <div class="simple-flex-center">
                <svg
                  class="inline-svg"
                  v-if="isLoaded"
                  :width="scale.x.bandwidth() * 1.6"
                  height="3"
                >
                  <line
                    x1="0"
                    y1="1"
                    :x2="scale.x.bandwidth() * 1.6"
                    y2="1"
                    stroke="rgba(0,0,0,0.6)"
                    stroke-width="2"
                    stroke-dasharray="1 3"
                    stroke-linecap="round"
                  />
                </svg>
                <p class="sans small legend-description">
                  Situation before changes
                </p>
              </div>
              <div class="simple-flex-center">
                <svg
                  class="inline-svg"
                  v-if="isLoaded"
                  :width="scale.x.bandwidth() * 1.6"
                  height="3"
                >
                  <line
                    x1="0"
                    y1="1"
                    :x2="scale.x.bandwidth() * 1.6"
                    y2="1"
                    stroke="rgba(51,160,44,1)"
                    stroke-width="2"
                    stroke-dasharray="1 3"
                    stroke-linecap="round"
                  />
                </svg>
                <p class="sans small color-positive legend-description">
                  More after changes
                </p>
              </div>
              <div class="simple-flex-center">
                <svg
                  class="inline-svg"
                  v-if="isLoaded"
                  :width="scale.x.bandwidth() * 1.6"
                  height="3"
                >
                  <line
                    x1="0"
                    y1="1"
                    :x2="scale.x.bandwidth() * 1.6"
                    y2="1"
                    stroke="rgba(227,26,28, 1)"
                    stroke-width="2"
                    stroke-dasharray="1 3"
                    stroke-linecap="round"
                  />
                </svg>
                <p class="sans small color-negative legend-description">
                  Less after changes
                </p>
              </div>
            </div>
            <div class="unhug-top-small">
              <div class="simple-flex-center">
                <svg
                  class="inline-svg"
                  v-if="isLoaded"
                  :width="scale.x.bandwidth() * 1.6"
                  height="30"
                >
                  <path
                    :transform="`translate(1, 1)`"
                    stroke-width="0.5"
                    fill="none"
                    stroke="currentColor"
                    :d="legendPathTransfers.fill"
                  />
                  <path
                    :transform="`translate(1, 1)`"
                    stroke-width="0.5"
                    fill="none"
                    stroke="currentColor"
                    :d="legendPathTransfers.stroke"
                  />
                </svg>
                <p class="sans small legend-description">
                  Welfare or UIG benefits
                </p>
              </div>
            </div>
            <div class="simple-flex-center unhug-top-tiny">
              <svg
                class="inline-svg"
                v-if="isLoaded"
                :width="scale.x.bandwidth() * 1.6"
                height="30"
              >
                <path
                  :transform="`translate(1, 1)`"
                  stroke-width="0.5"
                  fill="none"
                  stroke="currentColor"
                  :d="legendPathMarketIncome.fill"
                />
                <path
                  :transform="`translate(1, 1)`"
                  stroke-width="0.5"
                  fill="none"
                  stroke="currentColor"
                  :d="legendPathMarketIncome.stroke"
                />
              </svg>
              <p class="sans small legend-description">
                Income without benefits
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <!-- ***************************************************************************************** -->
</template>
<script>
// *********************************************************************************************
import * as d3 from "d3";
import { rough } from "../assets/lib/rough.js";
import zoomIcon from "../../public/assets/svg/zoom_s.svg";

export default {
  name: "graphModelOne",
  components: {
    zoomIcon
  },
  props: {
    msg: String
  },
  data() {
    return {
      data: [],
      positionsArray: [],
      totalMax: 0,
      svgWidth: 400,
      svgHeight: 660,
      margin: { top: 25, left: 40, bottom: 70, right: 2 },
      tooltip: { id: -1, left: null, top: null, bottom: null, right: null },
      show: true,
      mouseDown: false,
      isLoaded: false,
      moe: false,
      yAxisScaled: false,
      numOfUIGBins: 0,
      zoomSign: ["+", "in"],
      insight: "intro",
      introUIGActive: false,
      allIntroElements: [
        "selectLegend",
        "selectScale",
        "selectWelfare",
        "selectHeadline",
        "selectUIG",
        "selectBudget"
      ]
    };
  },
  computed: {
    width() {
      return this.svgWidth - this.margin.left - this.margin.right;
    },
    height() {
      return this.svgHeight - this.margin.top - this.margin.bottom;
    },
    maxValue() {
      let max = 0;
      for (const e of this.data) {
        if (max < e.totalIncome) {
          max = e.totalIncome;
        }
      }
      return this.totalMax;
    },
    scale() {
      const x = d3
        .scaleBand()
        .domain(this.data.map(x => x.bin))
        .rangeRound([0, this.width])
        .padding(0.4);
      const y = d3
        .scaleLinear()
        // .domain([
        //   0,
        //   () => {
        //     return 1 * this.maxValue;
        //   }
        // ])
        .domain([0, this.maxValue * 1.01])
        // .domain([0, Math.max(...this.data.map(x => x.totalIncome))])
        .rangeRound([this.height, 0]);
      const gridLine = d3
        .scaleLinear()
        .domain([0, this.maxValue * 1.01])
        .rangeRound([this.height, 0]);
      return { x, y, gridLine };
    },
    legendPathMarketIncome() {
      return this.computeGenericPath(this.scale.x.bandwidth() * 1.55, 28, 0);
    },
    legendPathTransfers() {
      return this.computeGenericPath(this.scale.x.bandwidth() * 1.55, 28, 1);
    },
    legendPathMarketIncomeSmall() {
      return this.computeGenericPath(this.scale.x.bandwidth() * 1.55, 14, 0);
    },
    legendPathTransfersSmall() {
      return this.computeGenericPath(this.scale.x.bandwidth() * 1.55, 14, 1);
    },
    positionsOnlyWelfare() {
      return this.positionsArray.slice(1, this.positionsArray.length - 1);
    },
    positionsOnlyWelfareR() {
      // eslint-disable-next-line vue/no-side-effects-in-computed-properties
      return this.positionsOnlyWelfare.reverse();
    },
    onlyIncome() {
      return this.positionsArray.slice(0, 1);
    },
    onlyUIG() {
      return this.positionsArray.slice(this.positionsArray.length - 1);
    },
    totalHousholds() {
      let sum = 0;
      for (const e of this.data) {
        sum += e.populationDetails.hhtotal.val;
      }
      return sum;
    },
    totalHousholdsF() {
      const f = d3.format(".2s");
      return f(this.totalHousholds);
    },
    currentTotalSavings() {
      let sum = 0;
      for (const e of this.positionsOnlyWelfare) {
        if (e.checked == false) {
          sum += e.savings;
        }
      }
      return sum;
    },
    currentTotalSavingsF() {
      const f = d3.format(".3s");
      const d3FormatString = f(this.currentTotalSavings);
      return this.lazyfixFormat(d3FormatString);
    },
    UIGthreshold() {
      if (this.isLoaded && this.numOfUIGBins > 0) {
        const binIndex = this.numOfUIGBins - 1;
        return this.data[binIndex].binDetails.ul;
      } else {
        return 0;
      }
    },
    UIGthresholdF() {
      const f = d3.format(",d");
      const d3FormatString = f(this.UIGthreshold);
      return d3FormatString;
    },
    currentTotalSpendings() {
      let sum = 0;
      for (let i = 0; i < this.numOfUIGBins; i++) {
        const positionOfUIG = this.positionsArray.length - 1;
        const meanCostsInThisBracket = this.data[i].positions[positionOfUIG]
          .val;
        // console.log(meanCostsInThisBracket);
        const householdsInThisBracket = this.data[i].populationDetails.hhtotal
          .val;
        const totalCostsInThisBracket =
          meanCostsInThisBracket * householdsInThisBracket;
        sum += totalCostsInThisBracket;
      }
      return sum;
    },
    currentTotalSpendingsF() {
      const f = d3.format(".3s");
      const d3FormatString = f(this.currentTotalSpendings);
      return this.lazyfixFormat(d3FormatString);
    },
    currentBalance() {
      const balance = this.currentTotalSavings - this.currentTotalSpendings;
      return balance;
    },
    currentBalanceF() {
      const f = d3.format(".3s");
      const d3FormatString = f(this.currentBalance);
      const formatArray = this.lazyfixFormat(d3FormatString).split(" ");
      if (formatArray[0] == 0) {
        formatArray[0] = parseInt(formatArray[0]);
      }
      if (typeof formatArray[1] == "undefined") {
        formatArray[1] = "";
      }
      return formatArray;
    },
    balancePosOrNeg() {
      let posOrNeg = this.currentBalance >= 0 ? "positive" : "negative";
      if (this.currentBalance == 0) {
        posOrNeg = "neutral";
      }
      return posOrNeg;
    },
    currentBalanceHTML() {
      let posOrNeg = this.currentBalance >= 0 ? "positive" : "negative";
      const htmlString = `<div class="align-right color-${posOrNeg}"><span class="huge">${
        this.currentBalanceF[0]
      }</span><p class="huge-label">${this.currentBalanceF[1]}</p></div>`;
      return htmlString;
    },
    allWelfareUnchecked() {
      let sum = 0;
      for (const e of this.positionsOnlyWelfare) {
        if (e.checked) {
          console.log("here");
          sum++;
        }
      }
      return sum == 0;
    },
    positiveBins() {
      let binArray = [];
      for (const bin of this.data) {
        if (bin.totalWelfareBefore < bin.totalCurrentTransfers) {
          console.log(bin.bin);
          let percentageOfTotalPopulation =
            bin.populationDetails.tpersons.val / (3.2 * Math.pow(10, 8));
          bin["percentageOfTotalPopulation"] = percentageOfTotalPopulation;
          binArray.push(bin);
        }
      }
      return binArray;
    }
  },
  watch: {
    data: {
      deep: true,
      handler(update) {
        console.log("data has changed", update);
      }
    },
    positionsArray: {
      deep: true,
      // eslint-disable-next-line no-unused-vars
      handler(update) {
        // console.log("positionsArray has changed");
        setTimeout(() => {
          this.computeData();
          this.calculateUIGInAllBins();
          this.calculateTotalIncomePerBin();
          this.calculateMaxMax();
          this.computeAllPaths();
        }, 1200);
      }
    },
    numOfUIGBins() {
      this.doAfterIncomeBracketsChanged();
    },
    tooltip() {
      // console.log("tooltip has changed");
    },
    width() {
      // console.log("width has changed");
    }
  },
  created() {
    this.loadData();
  },
  mounted() {
    this.onResize();
    let w = window.innerWidth;
    let h = window.innerHeight;
    this.tooltip.left = w / 2;
    this.tooltip.top = h / 2;
    window.addEventListener("resize", this.onResize);
    window.onmousedown = () => {
      this.mouseDown = true;
    };
    window.onmouseup = () => {
      this.mouseDown = false;
    };
  },
  updated() {
    // useful but not for what I thought
  },
  methods: {
    loadData() {
      d3.json("data/stata2.json").then(d => {
        // console.log(d);
        this.data = d;
        this.doAfterDataIsLoaded();
      });
    },
    doAfterDataIsLoaded() {
      this.isLoaded = true;
      this.computeDataOnlyOnce();
      this.computeData();
      this.positionsArrayCreate();
      this.calculateSavingsOfAllPositions();
      this.calculateTotalIncomePerBin();
      this.calculateMaxMax();
      this.calculateUIGInAllBins();
      this.initiallyUncheckUIG();
      this.computeAllPaths();
      // This doesn’t work currently
      // Idea: you can change the initial state here later by using another function
      // this.positionArrayToggleForAll(false);
    },
    computeDataOnlyOnce() {
      this.calculateTotalIncomePerBinBefore();
      this.calculateTotalWelfarePerBinBefore();
    },
    computeData() {
      this.calculateUpperAndLowerLimit();
    },
    calculateUpperAndLowerLimit() {
      for (const e of this.data) {
        for (const f of e.positions) {
          f.valLowLim = f.val - f.moe;
          f.valUpLim = f.val + f.moe;
          if (this.moe) {
            f.total = f.val + f.moe;
          } else {
            f.total = f.val;
          }
        }
      }
    },
    calculateTotalIncomePerBin() {
      for (const e of this.data) {
        let sum = 0;
        for (const f of e.positions) {
          sum += f.val;
        }
        e.totalIncome = sum;
      }
      this.calculateTotalCurrentTransfersPerBin();
    },
    calculateTotalIncomePerBinBefore() {
      for (const e of this.data) {
        let sum = 0;
        for (const f of e.positions) {
          sum += f.valueBefore;
        }
        e.totalIncomeBefore = sum;
      }
    },
    calculateTotalWelfarePerBinBefore() {
      for (const e of this.data) {
        let sum = 0;
        for (const [j, f] of e.positions.entries()) {
          if (j != 0 && j != e.positions.length - 1) {
            sum += f.val;
          }
        }
        e.totalWelfareBefore = sum;
      }
    },
    calculateTotalCurrentTransfersPerBin() {
      for (const e of this.data) {
        let sum = 0;
        for (const [j, f] of e.positions.entries()) {
          if (j != 0) {
            sum += f.val;
          }
        }
        e.totalCurrentTransfers = sum;
      }
      this.calculateIncomeDifferencePerBin();
    },
    calculateIncomeDifferencePerBin() {
      for (const e of this.data) {
        e.incomeDifference = e.totalCurrentTransfers - e.totalWelfareBefore;
        if (e.incomeDifference == 0) {
          e.incomeDifferenceCat = "neutral";
        } else if (e.incomeDifference > 0) {
          e.incomeDifferenceCat = "positive";
        } else if (e.incomeDifference < 0) {
          e.incomeDifferenceCat = "negative";
        }
      }
    },
    calculateSavingsOfAllPositions() {
      // eslint-disable-next-line no-unused-vars
      for (const [i, e] of this.positionsOnlyWelfare.entries()) {
        this.calculateSavingsOfOnePosition(i);
      }
    },
    lazyfixFormat(string) {
      const lazyfix = string
        .replace("M", " million")
        .replace("G", " billion")
        .replace("T", " trillion");
      return lazyfix;
    },
    calculateSavingsOfOnePosition(index) {
      let sum = 0;
      for (const e of this.data) {
        // console.log(e.positions[index]);
        // !!!! +1
        sum +=
          e.positions[index + 1].valueBefore * e.populationDetails.hhtotal.val;
      }
      this.positionsOnlyWelfare[index]["savings"] = sum;
    },
    initiallyUncheckUIG() {
      this.positionsArray[this.positionsArray.length - 1].checked = false;
    },
    doAfterIncomeBracketsChanged() {
      console.log("input changed");
      if (this.numOfUIGBins >= 0 && this.numOfUIGBins < 10) {
        setTimeout(() => {
          this.computeData();
          this.calculateUIGInAllBins();
          this.calculateTotalIncomePerBin();
          this.calculateUpperAndLowerLimit();
          this.computePathsOfOnePosition(this.positionsArray.length - 1);
          this.calculateMaxMax();
          this.computeAllPaths();
        }, 500);
      }
    },
    calculateUIGPerBin(i) {
      let e = this.data[i];
      let UIGPositionInBin = e.positions[e.positions.length - 1];
      let incomeInBin = e.positions[0].valueBefore;
      // Negative marginal tax rate = 50 %
      // console.log("num", i, this.numOfUIGBins);
      if (this.onlyUIG[0].checked && i < this.numOfUIGBins) {
        UIGPositionInBin.val = (this.UIGthreshold - incomeInBin) * 0.5;
        UIGPositionInBin.valueBefore = (this.UIGthreshold - incomeInBin) * 0.5;
        UIGPositionInBin.valUpLim = (this.UIGthreshold - incomeInBin) * 0.5;
        UIGPositionInBin.valLowLim = (this.UIGthreshold - incomeInBin) * 0.5;
        UIGPositionInBin.total = (this.UIGthreshold - incomeInBin) * 0.5;
      } else {
        UIGPositionInBin.val = 0;
        UIGPositionInBin.valueBefore = 0;
        UIGPositionInBin.valUpLim = 0;
        UIGPositionInBin.valLowLim = 0;
        UIGPositionInBin.total = 0;
      }
    },
    calculateUIGInAllBins() {
      for (let i = 0; i < this.data.length; i++) {
        this.calculateUIGPerBin(i);
      }
    },
    calculateMaxMax() {
      let max = 0;
      for (const e of this.data) {
        if (max < e.totalIncome) {
          // console.log(max, e.totalIncome);
          max = e.totalIncome;
        }
      }
      this.totalMax = max;
      return max;
    },
    positionsArrayCreate() {
      // console.log(this.data[0].positions);
      this.positionsArray = this.data[0].positions.map(x => {
        return {
          name: x.name,
          longName: x.longName,
          listName: x.listName,
          desc: x.desc,
          checked: true
        };
      });
    },
    positionArrayToggleForAll(bool) {
      for (const position of this.positionsArray) {
        position.checked = bool;
      }
    },
    computePath(val, j) {
      const x = 0;
      const y = 0;
      const w = this.scale.x.bandwidth();
      const h = this.height - this.scale.y(val);
      let hachureAngle = -(90 - 25);
      let hachureGap = 10;
      let fillWeight = 1;
      let fillStyle = "hachure";
      // let fillStyle = "cross-hatch";
      // let fillStyle = "hachure";
      // let fillStyle = "zigzag-line";
      if (j > 0) {
        hachureAngle = -(90 + 25);
        hachureGap = 4.5;
        fillWeight = 1;
        fillStyle = "cross-hatch";
      }
      let roughness = 1;
      if (h < 10) {
        roughness = 0.3;
      }
      if (h > 510) {
        roughness = 0.3;
      }
      let generator = rough.generator();
      let rect = generator.rectangle(x, y, w, h, {
        fill: "rgba(0,0,0,1)",
        stroke: "rgba(0,0,0,1)",
        roughness: roughness,
        fillWeight: fillWeight,
        hachureGap: hachureGap,
        hachureAngle: hachureAngle,
        fillStyle: fillStyle
      });
      let path = generator.toPaths(rect);
      return { stroke: path[1].d, fill: path[0].d };
    },
    computeGenericPath(width, height, j) {
      const x = 0;
      const y = 0;
      const w = width;
      const h = height;
      let hachureAngle = -(90 - 25);
      let hachureGap = 10;
      let fillWeight = 1;
      let fillStyle = "hachure";
      // let fillStyle = "cross-hatch";
      // let fillStyle = "hachure";
      // let fillStyle = "zigzag-line";
      if (j > 0) {
        hachureAngle = -(90 + 25);
        hachureGap = 5;
        fillWeight = 1;
        fillStyle = "cross-hatch";
      }
      let generator = rough.generator();
      let rect = generator.rectangle(x, y, w, h, {
        fill: "rgba(0,0,0,1)",
        stroke: "rgba(0,0,0,1)",
        roughness: 0.8,
        fillWeight: fillWeight,
        hachureGap: hachureGap,
        hachureAngle: hachureAngle,
        fillStyle: fillStyle
      });
      let path = generator.toPaths(rect);
      return { stroke: path[1].d, fill: path[0].d };
    },
    computePathsOfOnePosition(i) {
      const index = i;
      // eslint-disable-next-line no-unused-vars
      for (const [i, e] of this.data.entries()) {
        const position = e.positions[index];
        position.path = this.computePath(position.val, index);
      }
    },
    computeAllPaths() {
      // eslint-disable-next-line no-unused-vars
      for (const [i, e] of this.data.entries()) {
        for (const [j, f] of e.positions.entries()) {
          f["path"] = this.computePath(f.val, j);
        }
      }
    },
    lineYPosition(e) {
      let valueToScale = 0;
      if (this.positionsArray[0].checked == true) {
        valueToScale = e.totalIncomeBefore;
      } else {
        valueToScale = e.totalWelfareBefore;
      }
      return this.scale.y(valueToScale);
    },
    decideStrokeColor(i) {
      let color = "rgba(0,0,0,0.7)";
      if (this.data[i].incomeDifferenceCat == "neutral") {
        color = "rgba(0,0,0,0.7)";
      } else if (this.data[i].incomeDifferenceCat == "positive") {
        color = "rgba(51,160,44,1)"; // green
      } else {
        color = "rgba(227,26,28, 1)"; // red
      }
      return color;
    },
    plusBins() {
      if (this.numOfUIGBins < 9) {
        this.numOfUIGBins++;
      }
    },
    minusBins() {
      if (this.numOfUIGBins > 0) {
        this.numOfUIGBins--;
      }
    },
    mouseenterCheckboxes(e) {
      // position indey in this case
      const i = parseInt(e.target.id);
      // console.log(i);
      this.findPositionAndToggleDeactive(i);
    },
    showCurrentWelfareOrIncomeBefore(f, j) {
      let valueToShow = "";
      // console.log(f, j);
      if (j == 0) {
        valueToShow = f.valueBefore;
        if (this.positionsArray[0].checked == false) {
          [].map.call(this.$el.querySelectorAll(`text.position0`), e => {
            e.classList.add("rotateText");
          });
        } else {
          [].map.call(this.$el.querySelectorAll(`text.position0`), e => {
            e.classList.remove("rotateText");
          });
        }
      } else {
        valueToShow = f.val;
      }
      return valueToShow;
    },
    mouseleaveCheckboxes(e) {
      // position indey in this case
      const i = parseInt(e.target.id);
      // console.log(i);
      this.findPositionAndToggleDeactive(i);
    },
    findPositionAndToggleDeactive(i) {
      const positionNum = i;
      [].map.call(this.$el.querySelectorAll(`.positions`), e => {
        e.classList.toggle("positions-less-opacity");
        // if (!e.classList.contains(`.position${positionNum}`)) {
        // }
      });
      [].map.call(this.$el.querySelectorAll(`.position${positionNum}`), e => {
        e.classList.toggle("positions-less-opacity");
        e.classList.toggle("more-stroke");
        // Colors
        if (e.classList.contains("income")) {
          e.classList.toggle("stroke-deactive-income");
        } else if (e.classList.contains("welfare")) {
          e.classList.toggle("stroke-deactive-welfare");
        } else if (e.classList.contains("uig")) {
          e.classList.toggle("stroke-deactive-uig");
        } else if (e.classList.contains("text")) {
          e.classList.toggle("text-no-opacity");
        }
      });
    },
    mouseenterBars(e) {
      const i = e.target.id;
      this.findBinAndToggleDeactive(e);
      // console.log(d3.select(`#tooltip${i}`));
      this.tooltip.id = i;
      d3.select(`#tooltip${i}`)
        .transition()
        .duration(400)
        .style("opacity", 1);
    },
    findBinAndToggleDeactive(e) {
      const binNum = e.target.id;
      [].map.call(this.$el.querySelectorAll(`#bin${binNum} .path`), e => {
        e.classList.toggle("more-stroke");
        // Colors
        if (e.classList.contains("income")) {
          e.classList.toggle("stroke-deactive-income");
        } else if (e.classList.contains("welfare")) {
          e.classList.toggle("stroke-deactive-welfare");
        } else if (e.classList.contains("uig")) {
          e.classList.toggle("stroke-deactive-uig");
        }
      });
    },
    mousemoveBars(e) {
      const i = e.target.id;
      let tooltip = this.$el.querySelector(`#tooltip${i}`);
      const tooltipHeight = tooltip.getBoundingClientRect().height;
      // console.log(tooltip, tooltipHeight);
      let mouse = { x: e.clientX, y: e.clientY };
      let w = window.innerWidth;
      let h = window.innerHeight;
      let barWidth = this.scale.x.bandwidth();
      // this.tooltip.left = mouse.x + barWidth;
      if (mouse.x < w / 2) {
        this.tooltip.left = mouse.x + barWidth;
        this.tooltip.right = null;
      } else {
        this.tooltip.left = null;
        this.tooltip.left = mouse.x - 450;
      }
      if (mouse.y > h / 2) {
        // console.log(d3.select(`#tooltip${i}`));
        // this.tooltip.top = null;
        this.tooltip.top = mouse.y - tooltipHeight - 35;
      } else {
        // this.tooltip.bottom = null;
        this.tooltip.top = mouse.y + 50;
      }
    },
    mouseleaveBars(e) {
      this.findBinAndToggleDeactive(e);
      const i = e.target.id;

      d3.select(`#tooltip${i}`)
        .transition()
        .duration(300)
        .style("opacity", 0);
      // this.tooltip.id = null;
    },
    // eslint-disable-next-line no-unused-vars
    touchedToolTip(e) {
      this.tooltip.id = -1;
    },
    formatTooltip(e) {
      let positionshtml = "";
      for (const position of e.positions) {
        // console.log(position.name);
        positionshtml += `<p class="tooltip-p color-${position.name}">${
          position.longName
        }: <br /> <span class="boldest">$ ${
          position.val
        }</span>  <span class="italic"> +/- $ ${position.moe}</span></p>`;
      }
      let tooltiphtml = `<p class="graph-label">Income range:<br /> <span class="">${
        e.bin
      } $</span></p>${positionshtml}`;
      return tooltiphtml;
    },
    togglePosition(i) {
      console.log(i);
      const index = i;
      let checkedAtIndex = this.positionsArray[index].checked;
      console.log(checkedAtIndex);
      if (checkedAtIndex == true) {
        checkedAtIndex = false;
        for (const e of this.data) {
          const positionObject = e.positions[index];
          positionObject["valueBefore"] = positionObject["val"];
          positionObject["moeBefore"] = positionObject["moe"];
          positionObject["val"] = 0;
          positionObject["moe"] = 0;
        }
      } else if (checkedAtIndex == false) {
        checkedAtIndex = true;
        console.log(checkedAtIndex);
        for (const e of this.data) {
          const positionObject = e.positions[index];
          positionObject["val"] = positionObject["valueBefore"];
          positionObject["moe"] = positionObject["moeBefore"];
        }
      }
      this.computeData();
      this.calculateUpperAndLowerLimit();
      this.computePathsOfOnePosition(index);
    },
    scaleYAxis() {
      // if else
      if (this.yAxisScaled == false) {
        this.yAxisScaled = true;
        this.zoomSign = ["-", "out"];
        setTimeout(() => {
          window.scrollBy({
            top: 2300,
            left: 0,
            behavior: "smooth"
          });
        }, 800);
        this.svgHeight = 3000;
        this.computeAllPaths();
      } else {
        this.yAxisScaled = false;
        this.zoomSign = ["+", "in"];
        setTimeout(() => {
          this.svgHeight = 700;
          this.computeAllPaths();
        }, 800);
        const element_to_scroll_to = document.getElementById("graph-headline1");
        element_to_scroll_to.scrollIntoView({
          behavior: "smooth"
        });
      }
    },
    // eslint-disable-next-line no-unused-vars
    onResize(event) {
      // console.log("window has been resized");
      // console.log( event, this);
      // complicated d3 way to get to the width
      // console.log(
      //   d3.select(".chart")["_groups"][0][0].getBoundingClientRect().width - 64
      // );
      // console.log(this.$el.querySelectorAll(".chart")[0]);
      const chartElement = this.$el.querySelectorAll(".chart")[0];
      const padding = parseInt(
        getComputedStyle(chartElement).padding.substring(0, 2)
      );
      // console.log(padding);
      const parentWidth = chartElement.getBoundingClientRect().width;
      this.svgWidth = parentWidth - 2 * padding;
      // Fade
      this.show = false;
      setTimeout(() => {
        if (this.mouseDown == false) {
          this.show = true;
          this.computeAllPaths();
        }
      }, 1000);
    },
    // This is just to test the modal event, might not be that important
    // eslint-disable-next-line no-unused-vars
    onChange(event) {
      this.computeData();
      this.computeAllPaths();
    },
    findVerticalPosition(array, index) {
      // Note:
      // This was extremely painful,
      // only individualSum is needed to calculate
      // the correct position
      // sum of scale(individual) != scale(sum)
      // … leave the comment in here to remember
      // let sum = 0;
      let individualSum = this.height;
      let arrayUpToPosition = array.slice(0, index + 1);
      for (var i = 0; i < arrayUpToPosition.length; i++) {
        // sum += arrayUpToPosition[i]["val"];
        individualSum -=
          this.height - this.scale.y(arrayUpToPosition[i]["total"]);
      }
      // console.log(
      //   "comparison:",
      //   index,
      //   "valueTotal",
      //   this.scale.y(sum),
      //   "valueindiv",
      //   individualSum
      // );
      // console.log(sum == individualSum);
      return individualSum;
    },
    blurOne(identifier) {
      let element = this.$el.querySelector(`#${identifier}`);
      element.classList.add("blur");
    },
    blurList(array) {
      for (const identifier of array) {
        this.blurOne(identifier);
      }
    },
    blurAll() {
      this.blurList(this.allIntroElements);
    },
    unblurOne(identifier) {
      let element = this.$el.querySelector(`#${identifier}`);
      element.classList.remove("blur");
    },
    unblurList(array) {
      for (const identifier of array) {
        this.unblurOne(identifier);
      }
    },
    unblurAll() {
      this.unblurList(this.allIntroElements);
    },
    readyToChange() {
      console.log("ready");
      this.unblurAll();
      this.insight = "readyToChange";
    },
    startIntro() {
      // this.blurOne("selectUIG");
      this.blurAll();
      this.unblurOne("selectLegend");
      console.log("started intro");
      this.insight = "introLegendA";
    },
    goToLegendB() {
      console.log("got to LegendB");
      this.insight = "introLegendB";
    },
    goToLegendC() {
      console.log("got to LegendC");
      this.insight = "introLegendC";
    },
    goToScaleA() {
      this.blurOne("selectLegend");
      this.unblurOne("selectScale");
      console.log("got to ScaleA");
      this.insight = "introScaleA";
    },
    goToInterfaceA() {
      this.blurOne("selectScale");
      this.unblurList(["selectWelfare", "selectHeadline"]);
      console.log("got to InterfaceA");
      this.insight = "introInterfaceA";
    },
    uncheckAll() {
      for (const [i, e] of this.positionsOnlyWelfare.entries()) {
        // this.positionsArray[i + 1].checked = true;
        if (this.positionsArray[i + 1].checked == true) {
          this.togglePosition(i + 1);
          this.positionsArray[i + 1].checked = false;
        }
      }
    },
    goToInterfaceB() {
      this.blurOne("selectWelfare");
      this.unblurOne("selectUIG");
      console.log("got to InterfaceB");
      this.insight = "introInterfaceB";
    },
    activateUIG() {
      if (
        this.positionsArray[this.positionsArray.length - 1].checked == false
      ) {
        console.log("… the thing is not checked ");
        this.positionsArray[0].checked = true;
        this.togglePosition(this.positionsArray.length - 1);
      }
    },
    setUIGBinsTo5() {
      this.numOfUIGBins = 5;
      this.introUIGActive = true;
    },
    goToBudgetA() {
      this.blurList(["selectUIG", "selectHeadline"]);
      this.unblurOne("selectBudget");
      console.log("got to BudgetA");
      this.insight = "introBudgetA";
    }
  },
  directives: {
    // eslint-disable-next-line no-unused-vars
    axis(el, binding, update) {
      // console.log(update);
      const axis = binding.arg; // x or y
      const axisMethod = { x: "axisBottom", y: "axisLeft" }[axis];
      let methodArg = binding.value[axis];
      if (binding.arg == "y") {
        d3.select(el)
          .call(
            d3[axisMethod](methodArg)
              // alternative:
              //.tickFormat(d3.format(",d"))
              .tickFormat(d3.format(".2s"))
              .ticks(15)
          )
          .selectAll(".tick text")
          .attr("transform", "rotate(-25)")
          .attr("text-anchor", "end");
      } else {
        // let self = this;
        // x-axis
        d3.select(el)
          .call(d3[axisMethod](methodArg).tickFormat(d3.format("c")))
          .selectAll(".tick text")
          .attr("transform", "rotate(-25) translate(-2,4)")
          .attr("text-anchor", "end")
          .attr("alignment-baseline", "after-edge");
      }
    },
    grid(el, binding) {
      const axis = binding.arg; // x or y
      const axisMethod = { gridLine: "axisLeft" }[axis];
      // The line below assigns the x or y function of the scale object
      const methodArg = binding.value[axis];
      // d3.axisBottom(scale.x)
      d3.select(el).call(
        d3[axisMethod](methodArg)
          .tickFormat("")
          // Fix for actual width
          .tickSize(-1000)
          .ticks(15)
      );
    }
  },
  beforeDestroy() {
    // Unregister the event listener before destroying this Vue instance
    window.removeEventListener("resize", this.onResize);
  }
};
</script>
<style scoped lang="scss"></style>
