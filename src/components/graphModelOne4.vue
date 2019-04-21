<template>
  <div class="chart">
    <h5 class="sans">Current distribution of incomes (UIG scheme 2)</h5>
    <div v-if="tooltip.id != -1">
      <div
        v-for="(element, index) in data"
        :key="index * 10 + element.id"
        :style="
          `opacity:${tooltip.opacity};position:fixed;left:${
            tooltip.x
          }px;top:${tooltip.y + 10}px;`
        "
      >
        <div
          class="tooltip"
          v-if="index == tooltip.id"
          v-html="formatTooltip(element)"
        ></div>
      </div>
    </div>
    <!-- <div id="test">Hi</div> -->
    <transition name="fade">
      <svg v-if="isLoaded" :width="svgWidth" :height="svgHeight">
        <g :transform="`translate(${margin.left}, ${margin.bottom})`">
          <g v-for="(e, i) in data" :key="i" :id="i">
            <transition name="fade">
              <g v-if="show">
                <!-- <transition-group> -->
                <!-- Needs to remove elements from list -->
                <g v-for="(f, j) in e.positions" :key="`${i}${f.name}`">
                  <transition name="fade">
                    <!-- mode="in-out" -->
                    <g v-if="moe" key="moe">
                      <path
                        v-show="show"
                        fill="none"
                        :stroke="categoryColors(f.name)"
                        stroke-width="1"
                        :d="f.pathFillvalLowLimtrue"
                      />
                      <path
                        v-show="show"
                        fill="none"
                        :stroke="categoryColors(f.name)"
                        stroke-width="1"
                        opacity="0.3"
                        :d="f.pathFillvalUpLimtrue"
                      />
                      <path
                        v-show="show"
                        fill="none"
                        :stroke="categoryColors(f.name)"
                        stroke-width="0.5"
                        :d="f.pathStrokevaltrue"
                      />
                    </g>
                    <g v-else key="predict">
                      <path
                        v-show="show"
                        fill="none"
                        :stroke="categoryColors(f.name)"
                        stroke-width="1"
                        :d="f.pathFillvalfalse"
                      />
                      <path
                        v-show="show"
                        fill="none"
                        :stroke="categoryColors(f.name)"
                        stroke-width="0.5"
                        :d="f.pathStrokevalfalse"
                      />
                    </g>
                  </transition>
                </g>
                <!-- </transition-group> -->
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
              @mousemove="mousemove"
              @mouseleave="mouseleave"
            />
          </g>
          <g
            v-axis:x="scale"
            :transform="`translate(${0}, ${height})`"
            class="x-axis"
          ></g>
          <g v-axis:y="scale" class="y-axis"></g>
        </g>
      </svg>
    </transition>
    <div class="x-axis-legend">
      <h6 class="sans">Market income bins, in 2017 $</h6>
    </div>
    <div>
      <h4>Temporary Interaction</h4>
      <button @click="click">fixed width</button>
      <button @click="click2">show/hide margin of error</button>
      <button @click="click3">remove/retain snap</button>
      <button @click="click4">scale y-axis</button>
      <input
        v-if="isLoaded"
        type="number"
        v-model.number="data[0].positions[0].val"
        v-on:input="onChange"
      />
    </div>
  </div>
</template>
<script>
import * as d3 from "d3"; // eslint-disable-line
import { rough } from "../assets/lib/rough.js"; // eslint-disable-line
import { inflateSync } from "zlib";

export default {
  name: "graphModelOne",
  props: {
    msg: String
  },
  data() {
    return {
      data: [],
      svgWidth: 400,
      svgHeight: 750,
      margin: { top: 20, left: 100, bottom: 40, right: 40 },
      tooltip: { id: null, x: 0, y: 0, opacity: 0 },
      show: false,
      mouseDown: false,
      isLoaded: false,
      moe: false,
      testSnapElim: false
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
      // console.log(this.data);
      const lastIndex = this.data.length - 1;
      // console.log(lastIndex);
      const lastArrayOfPositions = this.data[lastIndex].positions;
      // console.log(lastArrayOfPositions);
      // https://stackoverflow.com/questions/5732043/javascript-reduce-on-array-of-objects
      const sumOfPositionsInLastArray = lastArrayOfPositions.reduce((a, b) => {
        return { valUpLim: a.valUpLim + b.valUpLim };
      }).valUpLim;
      // console.log(sumOfPositionsInLastArray);
      return sumOfPositionsInLastArray;
    },
    scale() {
      const x = d3
        .scaleBand()
        .domain(this.data.map(x => x.bin))
        .rangeRound([0, this.width])
        .padding(0.1);
      const y = d3
        .scaleLinear()
        .domain([0, this.maxValue])
        .rangeRound([this.height, 0]);
      return { x, y };
    }
  },
  watch: {
    width() {
      // console.log("width has changed");
    },
    data: {
      deep: true,
      handler(update) {
        console.log("data has changed", update);
        this.computeMOE();
        this.computePaths();
      }
    },
    tooltip() {
      // console.log("tooltip has changed");
    }
  },
  created() {
    this.loadData();
  },
  mounted() {
    this.onResize();
    window.addEventListener("resize", this.onResize);
    window.onmousedown = () => {
      this.mouseDown = true;
    };
    window.onmouseup = () => {
      this.mouseDown = false;
    };
  },
  methods: {
    loadData() {
      d3.json("data/test-stata2.json").then(d => {
        console.log(d); // eslint-disable-line
        this.data = d;
        this.isLoaded = true;
        this.computeMOE();
        this.computePaths();
      });
    },
    computePaths() {
      let generator = rough.generator();
      const propertiesArray = ["val", "valLowLim", "valUpLim"];
      const moeArray = [true, false];
      for (const [i, e] of this.data.entries()) {
        for (const [j, f] of e.positions.entries()) {
          for (const property of propertiesArray) {
            for (const moe of moeArray) {
              const x = this.scale.x(e.bin);
              const y = this.scale.y(
                this.findVerticalEnding(e.positions, j, property, moe)
              );
              const w = this.scale.x.bandwidth();
              const h = this.height - this.scale.y(f[property]);
              let rect = generator.rectangle(x, y, w, h, {
                fill: "rgba(0,0,0,1)",
                stroke: "rgba(0,0,0,1)",
                roughness: 0,
                fillWeight: 2,
                hachureGap: 5,
                hachureAngle: 45,
                fillStyle: "hachure"
              });
              let path = generator.toPaths(rect);
              // console.log(path);
              f[`pathFill${property}${moe}`] = path[0].d;
              f[`pathStroke${property}${moe}`] = path[1].d;
            }
          }
        }
      }
    },
    computeMOE() {
      for (const e of this.data) {
        for (const f of e.positions) {
          // console.log(f.val);
          f.valLowLim = f.val - f.moe;
          f.valUpLim = f.val + f.moe;
        }
      }
    },
    categoryColors(name) {
      // console.log(name);
      let color = "";
      if (name == "minc") {
        color = "rgba(102, 102, 102, 1)";
      } else if (name == "snap") {
        color = "rgba(255, 138, 24, 1)";
      } else if (name == "ssi") {
        color = "rgba(77, 175, 74, 1)";
      } else {
        color = "rgba(255, 0, 0, 1)";
      }
      return color;
    },
    mousemove(e) {
      // console.log(e);
      const i = e.target.id;
      // console.log(e) // eslint-disable-line
      // console.log(e.target.id) // eslint-disable-line
      // this.selectIndex = e.target.id;
      this.tooltip = { id: i, x: e.clientX, y: e.clientY, opacity: 1 };
      // console.log(this) // eslint-disable-line
    },
    mouseleave() {
      this.tooltip.id = -1;
    },
    formatTooltip(e) {
      // console.log(e);
      let positionshtml = "";
      for (const position of e.positions) {
        positionshtml += `<p>${position.name}: <span class="em">${
          position.val
        }</span> +/- ${position.moe}</p>`;
      }
      let tooltiphtml = `<p>Income range: <span class="em">${
        e.bin
      }</span></p>${positionshtml}`;
      return tooltiphtml;
    },
    click() {
      this.$el.style = "width: 300px";
      this.onResize();
    },
    click2() {
      // this.show = false;
      // setTimeout(() => {
      //   this.show = true;
      // }, 100);
      if (this.moe) {
        this.moe = false;
      } else {
        this.moe = true;
      }
    },
    click3() {
      if (!this.testSnapElim) {
        this.testSnapElim = true;
        for (const e of this.data) {
          // console.log(e.positions[1]);
          e.positions[1]["valueBefore"] = e.positions[1]["val"];
          e.positions[1]["moeBefore"] = e.positions[1]["moe"];
          e.positions[1]["val"] = 0;
          e.positions[1]["moe"] = 0;
        }
      } else {
        this.testSnapElim = false;
        for (const e of this.data) {
          e.positions[1]["val"] = e.positions[1]["valueBefore"];
          e.positions[1]["moe"] = e.positions[1]["moeBefore"];
        }
      }
    },
    click4() {
      setTimeout(() => {
        window.scrollBy({
          top: 2500,
          left: 0,
          behavior: "smooth"
        });
      }, 800);
      console.log("outside");
      this.svgHeight = 2700;
      this.computePaths();
    },
    onResize(event) {
      console.log("window has been resized", event, this);
      this.svgWidth = this.$el.getBoundingClientRect().width;
      this.show = false;
      setTimeout(() => {
        if (this.mouseDown == false) {
          this.computePaths();
          this.show = true;
        }
      }, 800);
      // this.$el.querySelector(".rough").style("opacity", 0);
    },
    onChange(event) {
      // console.log("changed", event);
      // this.computePaths();
    },
    findVerticalEnding(array, index, property, moe) {
      var arrayUpToPosition = array.slice(0, index + 1);
      // console.log(array, array[index].name, array[index].val, property);
      let sum = 0;
      if (moe) {
        if (property == "valLowLim") {
          for (var i = 0; i < arrayUpToPosition.length; i++) {
            // console.log(i);
            sum += arrayUpToPosition[i]["valUpLim"];
            if (i == arrayUpToPosition.length - 1) {
              sum -= 2 * arrayUpToPosition[i].moe;
            }
          }
        } else if (property == "valUpLim") {
          for (var i = 0; i < arrayUpToPosition.length; i++) {
            sum += arrayUpToPosition[i]["valUpLim"];
          }
        } else if (property == "val") {
          for (var i = 0; i < arrayUpToPosition.length; i++) {
            // console.log(i);
            sum += arrayUpToPosition[i]["valUpLim"];
            if (i == arrayUpToPosition.length - 1) {
              sum -= 1 * arrayUpToPosition[i].moe;
            }
          }
        }
      } else {
        for (var i = 0; i < arrayUpToPosition.length; i++) {
          // console.log(arrayAtPosition[i].val);
          sum += arrayUpToPosition[i].val;
        }
      }
      return sum;
    }
  },
  directives: {
    axis(el, binding) {
      const axis = binding.arg; // x or y
      const axisMethod = { x: "axisBottom", y: "axisLeft" }[axis];
      const methodArg = binding.value[axis];
      // d3.axisBottom(scale.x)
      d3.select(el).call(
        d3[axisMethod](methodArg)
          .tickFormat(d3.format(binding.arg === "y" ? ",d" : "c"))
          .ticks(binding.arg === "x" ? 10 : 30)
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
