<template>
  <div class="chart">
    <h2>Model 1: Re-Allocation of welfare benefits</h2>
    <button @click="click">click</button>
    <input
      v-if="isLoaded"
      type="number"
      v-model="data[0].positions[0].val"
      v-on:input="onChange"
    />
    <div
      v-for="(element, index) in data"
      :key="index * 10 + element.id"
      :style="
        `opacity:${tooltip.opacity};position:fixed;left:${tooltip.x}px;top:${
          tooltip.y
        }px;`
      "
    >
      <div v-if="index == tooltip.id" v-html="formatTooltip(element)"></div>
    </div>
    <transition name="fade">
      <svg v-if="isLoaded" :width="svgWidth" :height="svgHeight">
        <g :transform="`translate(${margin.left}, ${margin.bottom})`">
          <g v-for="(e, i) in data" :key="i" :id="i">
            <!-- <transition name="fade"> -->
            <!-- <rect
            v-show="show"
            v-for="(f, j) in e.positions"
            :key="`${i}${f.name}`"
            :x="scale.x(e.bin)"
            :y="scale.y(reduceByValue(e.positions, j))"
            :width="scale.x.bandwidth()"
            :height="height - scale.y(f.val)"
            opacity="0.3"
            @mousemove="mouseover"
            :id="`${f.name}${i}`"
          /> -->
            <!-- </transition> -->
            <transition name="fade">
              <g v-if="show">
                <path
                  v-show="show"
                  v-for="(f, j) in e.positions"
                  :key="`${i}${f.name}`"
                  fill="none"
                  stroke="rgba(87, 176, 234, 1)"
                  stroke-width="2"
                  :d="f.pathFill"
                  :id="e.id"
                  @mousemove="mousemove"
                  @mouseleave="mouseleave"
                />
              </g>
            </transition>
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
      mouseDown: false,
      isLoaded: false,
      testArray: [1, 2, 3]
      // scaled: {
      //   x: null,
      //   y: null,
      // }
    };
  },
  computed: {
    paths() {
      let paths = {};
      for (const [i, e] of this.data.entries()) {
        for (const [j, f] of e.positions.entries()) {
          f["path"] = parseFloat(f.val) * 1;
          // console.log(`${f.name}${i}`);
          paths[`${f.name}${i}`] = {
            path: f.path,
            val: JSON.parse(JSON.stringify(f.val))
          };
        }
      }
      return paths;
    },
    generatedPaths() {
      let paths = {};
      // computeRect(
      //  let x = scale.x(e.bin),
      //  let y = scale.y(e.minc),
      //  let width = scale.x.bandwidth(),
      //  let height = height - scale.y(e.minc)
      //).stroke
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
      return paths;
    },
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
    dataCopy: {
      deep: true,
      handler(update) {
        console.log("width has changed");
        // console.log("data", this.data[0].positions[0].val);
        // console.log("dataCopy", this.dataCopy[0].positions[0].val);
        // let self = this;
        // let transfer = [];
        // let newData = this.data.slice(0);
        // let oldData = this.dataCopy.slice(0);
        // // console.log(this.dataCopy[0].positions[0].val);
        // async function firstFunction() {
        //   for (const [i, e] of newData.entries()) {
        //     // console.log(i, e);
        //     for (const [j, f] of e.positions.entries()) {
        //       // console.log(f);
        //       const newVal = f.val;
        //       // console.log(oldData[i]); // returns undefined
        //       if (oldData[i] != undefined) {
        //         const oldVal = oldData[i].positions[j].val;
        //         console.log("old/new:", newVal, oldVal);
        //         if (newVal != oldVal) {
        //           console.log("update path");
        //           console.log(newVal);
        //         } else {
        //           console.log("don’t update here");
        //         }
        //       } else {
        //         console.log("update all");
        //       }
        //     }
        //   }
        //   return;
        // }
        // async function secondFunction() {
        //   await firstFunction();
        //   // now wait for firstFunction to finish...
        //   // do something else
        //   console.log("finished");
        //   transfer = newData.slice(0);
        //   self.dataCopy = transfer;
        //   console.log(self.dataCopy[0].positions[0].val);
        // }
        // secondFunction();
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
    // const _this = this.$el; // eslint-disable-line
    // let generator = rough.generator();
    // console.log(generator);
    // let roughSvg = rough.svg(this.$el.children[1]); // eslint-disable-line
    // let roughSvg = rough.svg(document.getElementById("svg")); // eslint-disable-line
  },
  methods: {
    loadData() {
      d3.json("data/test2.json").then(d => {
        // console.log(d); // eslint-disable-line
        this.data = d;
        this.isLoaded = true;
        this.computePaths();
        // this.dataCopy = Object.assign({}, d);
        // console.log(this.dataCopy);
        // console.log(this.data);
      });
    },
    computePaths() {
      let generator = rough.generator();
      for (const [i, e] of this.data.entries()) {
        for (const [j, f] of e.positions.entries()) {
          const x = this.scale.x(e.bin);
          const y = this.scale.y(this.reduceByValue(e.positions, j));
          const w = this.scale.x.bandwidth();
          const h = this.height - this.scale.y(f.val);
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
          f["pathFill"] = path[0].d;
          f["pathStroke"] = path[1].d;
        }
      }
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
      console.log(e);
      let tooltiphtml = `<h3>Income range: <span class"em">${
        e.bin
      }</span></h3>`;
      return tooltiphtml;
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
          this.computePaths();
          this.show = true;
        }
      }, 1000);
      // this.$el.querySelector(".rough").style("opacity", 0);
    },
    onChange(event) {
      console.log("changed");
      this.computePaths();
    },
    reduceByValue(array, index) {
      var arrayAtPosition = array.slice(0, index + 1);
      // console.log(index);
      // console.log(arrayAtPosition);
      let sum = 0;
      for (var i = 0; i < arrayAtPosition.length; i++) {
        // console.log(arrayAtPosition[i].val);
        sum += arrayAtPosition[i].val;
      }
      // const sum = arrayAtPosition.reduce((a, b) => a.val + b.val);
      // console.log(sum);
      return sum;
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
