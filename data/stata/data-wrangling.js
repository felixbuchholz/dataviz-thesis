const names = [
  {
    fileName: "hh_t_persons.csv",
    population: true,
    shortName: "tpersons",
    longName: "Total count of person per household",
    desc: ""
  },
  {
    fileName: "hh_t_adults.csv",
    population: true,
    shortName: "tadults",
    longName: "Total count of adults per household",
    desc: ""
  },
  {
    fileName: "hh_m_persons.csv",
    population: true,
    shortName: "mpersons",
    longName: "Mean count of person per household",
    desc: ""
  },
  {
    fileName: "hh_m_adults.csv",
    population: true,
    shortName: "madults",
    longName: "Mean count of adults per household",
    desc: ""
  },
  {
    fileName: "hh_m_inc.csv",
    population: false,
    shortName: "minc",
    longName: "Mean market income",
    desc: ""
  },
  {
    fileName: "hh_oadivs.csv",
    population: false,
    shortName: "oadivs",
    longName: "SSI and disability, retirement, survivor and veteran benefits",
    desc: ""
  },
  {
    fileName: "hh_eitcred.csv",
    population: false,
    shortName: "eitc",
    longName: "Earned Income Tax Credit",
    desc: ""
  },
  {
    fileName: "hh_child.csv",
    population: false,
    shortName: "child",
    longName: "Child support programs and child tax credits",
    desc: ""
  },
  {
    fileName: "hh_snap_plus.csv",
    population: false,
    shortName: "snapp",
    longName: "SNAP, AFDC, TANF and energy subsidies",
    desc: ""
  },
  {
    fileName: "hh_eduwrkunem.csv",
    population: false,
    shortName: "eduwrkunem",
    longName: "Education, Worker Compensation and unemployment benefits",
    desc: ""
  },
  {
    fileName: "hh_socialsec.csv",
    population: false,
    shortName: "socialsec",
    longName: "Social Security benefits",
    desc: ""
  }
];
const bins = [
  { string: "< 10,000", ll: -20000, ul: 9999, id: 0 },
  { string: "10,000 – 14,999", ll: 10000, ul: 14999, id: 1 },
  { string: "15,000 – 24,999", ll: 15000, ul: 24999, id: 2 },
  { string: "25,000 – 34,999", ll: 25000, ul: 34999, id: 3 },
  { string: "35,000 – 49,999", ll: 35000, ul: 49999, id: 4 },
  { string: "50,000 – 74,999", ll: 50000, ul: 74999, id: 5 },
  { string: "75,000 – 99,999", ll: 75000, ul: 99999, id: 6 },
  { string: "100,000 – 149,999", ll: 100000, ul: 149999, id: 7 },
  { string: "150,000 – 199,999", ll: 150000, ul: 199999, id: 8 },
  { string: "> 200,000", ll: 200000, ul: 4000000, id: 9 }
];

d3.csv(`hh_t_persons.csv`).then(data => {
  processCSV(
    data,
    {
      shortName: "tpersons",
      longName: "Total count of person per household",
      desc: ""
    },
    true
  );
  for (const [i, p] of names.entries()) {
    d3.csv(p.fileName).then(pData => {
      // console.log(p.population);
      processCSV(pData, p, p.population);
      // console.log(pData);
      for (const [i, e] of pData.entries()) {
        if (e.hasOwnProperty("position")) {
          data[i].positions.push(e.position);
        } else {
          data[i].populationDetails.push(e.population);
        }
      }
    });
  }
  data.map((e, i) => {
    e.bin = bins[i].string;
    e.binDetails = bins[i];
  });
  console.log(data);
});

const processCSV = (data, names, population) => {
  data.map((e, i) => {
    if (population) {
      e.population = {
        val: parseFloat(e.b),
        moe: parseFloat(e.se),
        name: names.shortName,
        longName: names.longName,
        desc: names.desc
      };
    } else {
      e.position = {
        val: parseFloat(e.b),
        moe: parseFloat(e.se),
        name: names.shortName,
        longName: names.longName,
        desc: names.desc
      };
    }
    e.bin = e[""];
    e.id = i;
    e.positions = [];
    e.populationDetails = [];
    delete e[""];
    delete e.b;
    delete e.crit;
    delete e.df;
    delete e.eform;
    delete e.pvalue;
    delete e.se;
    delete e.ll;
    delete e.ul;
    delete e.z;
  });
};
