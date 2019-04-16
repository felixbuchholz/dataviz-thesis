<template>
  <div class="chart">
    <h2>Chart starts here</h2>
    <button @click="click">click</button>

    <div
      v-for="(element, index) in data"
      :key="index * 10 + element.id"
      :style="
        `opacity:${tooltip.opacity};position:fixed;left:${tooltip.x}px;top:${
          tooltip.y
        }px;`
      "
    >
      <p v-if="index == tooltip.id">{{ element.minc }}</p>
    </div>
    <svg :width="svgWidth" :height="svgHeight">
      <g :transform="`translate(${margin.left}, ${margin.bottom})`">
        <!-- <g v-if="show"> -->
        <g v-for="(e, i) in data" :key="e.id">
          <transition name="fade">
            <path
              v-if="show"
              class="rough roughfill"
              :key="e.id"
              fill="none"
              stroke="rgba(87, 176, 234, 1)"
              stroke-width="2"
              :d="
                computeRect(
                  scale.x(e.bin),
                  scale.y(e.minc),
                  scale.x.bandwidth(),
                  height - scale.y(e.minc)
                ).fill
              "
            />
          </transition>
          <transition name="fade">
            <path
              v-if="show"
              fill="none"
              stroke="rgba(87, 176, 234, 1)"
              stroke-width="1"
              :d="
                computeRect(
                  scale.x(e.bin),
                  scale.y(e.minc),
                  scale.x.bandwidth(),
                  height - scale.y(e.minc)
                ).stroke
              "
            />
          </transition>
          <transition name="fade">
            <rect
              v-if="show"
              :x="scale.x(e.bin)"
              :y="scale.y(e.minc + e.snap)"
              :width="scale.x.bandwidth()"
              :height="height - scale.y(e.snap)"
              fill="rgba(255, 0, 0, 1)"
            />
          </transition>
          <rect
            :x="scale.x(e.bin)"
            :y="0"
            :width="scale.x.bandwidth()"
            :height="height"
            opacity="0"
            @mousemove="mouseover"
            :id="i"
          />
        </g>
        <!-- </g> -->
        <g
          v-axis:x="scale"
          :transform="`translate(${0}, ${height})`"
          class="x-axis"
        ></g>
        <g v-axis:y="scale" class="y-axis"></g>
      </g>
    </svg>
  </div>
</template>
<script>
import * as d3 from "d3"; // eslint-disable-line
import { rough } from "../assets/lib/rough.js"; // eslint-disable-line

export default {
  name: "graphModelOne",
  props: {
    msg: String
  },
  data() {
    return {
      data: [],
      svgWidth: 400, // get container
      svgHeight: 600,
      margin: { top: 50, left: 90, bottom: 50, right: 25 },
      // selectIndex: null,
      tooltip: { id: null, x: 0, y: 0, opacity: 0 },
      show: false,
      mouseDown: false
      // scaled: {
      //   x: null,
      //   y: null,
      // }
    };
  },
  computed: {
    width() {
      return this.svgWidth - this.margin.left - this.margin.right;
    },
    height() {
      return this.svgHeight - this.margin.top - this.margin.bottom;
    },
    scale() {
      const x = d3
        .scaleBand()
        .domain(this.data.map(x => x.bin))
        .rangeRound([0, this.width])
        .padding(0.1);
      const y = d3
        .scaleLinear()
        .domain([0, 20000])
        .rangeRound([this.height, 0]);
      // const gridLine = d3
      //   .scaleLinear()
      //   .domain([this.domain.y.min, this.domain.y.max])
      //   .rangeRound([this.height, 0]);
      // this.scaled.x = x;
      // this.scaled.y = y;
      return { x, y };
    }
  },
  watch: {
    width() {
      // console.log("width has changed");
    },
    data() {
      console.log("data has changed");
    },
    tooltip() {
      console.log("tooltip has changed");
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
    // const _this = this.$el; // eslint-disable-line
    // let generator = rough.generator();
    // console.log(generator);
    // let roughSvg = rough.svg(this.$el.children[1]); // eslint-disable-line
    // let roughSvg = rough.svg(document.getElementById("svg")); // eslint-disable-line
  },
  methods: {
    loadData() {
      d3.json("data/test2.json").then(d => {
        console.log(d); // eslint-disable-line
        this.data = d;
      });
    },
    computeRect(x, y, w, h) {
      let generator = rough.generator();
      let rect = generator.rectangle(x, y, w, h, {
        fill: "rgba(0,0,0,1)",
        stroke: "rgba(0,0,0,1)",
        roughness: 1,
        fillWeight: 2,
        hachureGap: 5,
        hachureAngle: 45,
        fillStyle: "hachure"
      });
      let path = generator.toPaths(rect);
      const fill = path[0].d;
      const stroke = path[1].d;
      // console.log(rect) // eslint-disable-line
      // console.log(path); // eslint-disable-line
      // console.log(path[0].d); // eslint-disable-line
      return { fill, stroke };
      // window.rough = require("../assets/lib/rough.js");
      // let generator = rough.generator();
      // let generator = rough.generator();
      // console.log(rough);
    },
    mouseover(e) {
      const i = e.target.id;
      // console.log(e) // eslint-disable-line
      // console.log(e.target.id) // eslint-disable-line
      // this.selectIndex = e.target.id;
      this.tooltip = { id: i, x: e.clientX, y: e.clientY, opacity: 1 };
      // console.log(this) // eslint-disable-line
    },
    click() {
      console.log();
      this.$el.style = "width: 300px";
      this.onResize();
    },
    onResize(event) {
      // console.log("window has been resized", event, this);
      // console.log(this.$el.getBoundingClientRect().width);
      this.svgWidth = this.$el.getBoundingClientRect().width;
      this.show = false;
      setTimeout(() => {
        if (this.mouseDown == false) {
          this.show = true;
        }
      }, 1000);
      // this.$el.querySelector(".rough").style("opacity", 0);
    }
  },
  directives: {
    axis(el, binding) {
      const axis = binding.arg; // x or y
      const axisMethod = { x: "axisBottom", y: "axisLeft" }[axis];
      // The line below assigns the x or y function of the scale object
      const methodArg = binding.value[axis];
      // d3.axisBottom(scale.x)
      d3.select(el).call(d3[axisMethod](methodArg));
    }
    // grid(el, binding) {
    //   const axis = binding.arg; // x or y
    //   const axisMethod = { gridLine: "axisLeft" }[axis];
    //   // The line below assigns the x or y function of the scale object
    //   const methodArg = binding.value[axis];
    //   // d3.axisBottom(scale.x)
    //   d3.select(el).call(
    //     d3[axisMethod](methodArg)
    //       .tickFormat("")
    //       .tickSize(-2000)
    //       .ticks(5)
    //   );
    // }
  },
  beforeDestroy() {
    // Unregister the event listener before destroying this Vue instance
    window.removeEventListener("resize", this.onResize);
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
h1 {
  color: #42b983;
}
</style>
