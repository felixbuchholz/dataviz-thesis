svgMinWidth: 400, // get container svgMinHeight: 600, svgWidth() { if (this.$el)
{ return this.$el.getBoundingClientRect().width; } else { return
this.svgMinWidth; } }, svgHeight() { if (this.$el) { return
this.$el.getBoundingClientRect().height; } else { return this.svgMinHeight; } },
width() { if (this.svgWidth) { console.log(this.$el); return this.svgWidth -
this.margin.left - this.margin.right; } else { console.log("not mounted");
return this.svgMinWidth - this.margin.left - this.margin.right; } }, height() {
if (this.svgHeight) { return this.svgHeight - this.margin.top -
this.margin.bottom; } else { return this.svgMinHeight - this.margin.top -
this.margin.bottom; } },
