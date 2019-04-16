// const positionsArray = ["mktinc"]

// const loadCSV = (position) => {
//   d3.csv(`meanhh_${position}_by_inccat.csv`)
//     .then((data) => {
//       wrangleData(data)
//     });
// }

// const wrangleData = (data) => {
//   console.log(data);
// }

// for (const position of positionsArray) {
//   loadCSV(position)
// }

d3.csv(`meanhh_mktinc_by_inccat.csv`)
  .then((data) => {
    console.log(data);
    var bins = d3.nest()
    .key(function(d) { return d.bin; })
    .entries(data);
    console.log(bins);
    for (const [i, e] of bins.entries()) {
      e["id"] = i;
      e["bin"] = e.key;
      delete e.key;
      e["positions"] = e.values;
      delete e.values;
      e.positions[0]["name"] = "minc"
      e.positions[0]["val"] = parseFloat(e.positions[0].mean)
      e.positions[0]["moe"] = parseFloat(e.positions[0].moe)
      delete e.positions[0].mean
      delete e.positions[0].bin
      delete e.positions[0].ll
      delete e.positions[0].ul
    }
    console.log(bins);
    console.log(JSON.stringify(bins));

  });