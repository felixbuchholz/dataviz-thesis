! Feedback Daniel:
  - Input and Output at the same level -> balance in big! move the $-sign to the label, remove the .decimal point
  - Add only the rounded numbers
  - number in the center of the column 
  - Population is not another graph, but small numbers on top of the bars
  - the zoom is good
  - remove invalid input from the input thing
  - use the line as an indicator to lock the initial state
  - 

- axis (how to reduce)
- typo
- population
- make a black & white version
- moe
- max value
- v-model
- make the model already
- refactor for transform="translate(x,y)"
  - element gets transform="translate(x,y)"
  - calculatePaths only calculates in terms of width and height
  - findVerticalEndings only is relevant to the transform=translate()
  - Rebuild the path and positioning function
  - move tooltip around according to the position: bind the top and bottom position as well
  - use java-script hooks to animate the tooltips
  - re-arrange the data buckets
  - socialsec and vet reason
  - sccs media queries
  - remove single programs
  - how to add stuff from the x-axis (animation)
  - compute the max, max value
  - compute the total income after benefits for each bin, and show it in the tool tip!
  - Data: **Create valueBefore in data-wrangling-script**
  - Data: **You need the household information: number of households per bin, avg. household size, avg.number of adults per household**
  - Totals: calculate with if/else on position[i].checked
  - sumSavings - (((threshold-meanIncome)/2)*households)=0
  - grid!
  - moe, aaron

totalSavings - SUM(BINS) = 0 
BIN1 = (Threshold - meanIncome[BIN1])*0.5 * totalHouseholds[BIN1]

- Responsiveness:
  - If min-width then the tooltip has a fixed position,
  - **If window.innerHeight < 550px!!!**
  - Reformat mix-ins to scss
  - Scss function to make all the classes that I do manually?


- video src=""






--- done!

- d3.nest, bin is top-level, rest is an array (nested v-for, sum for i)

resize, _ animation (css?),

What’s the plan?
 - Have an object with all paths.
 - Have a function that replaces only one of the paths at a time

- I have a data object, with all the elements
- I have unique identifiers
- I can process all the paths and store them in an object
- I can use the object and the unique identifiers to retrieve the paths in the dom
- If I update the paths, I only want to update those that have changed data, therefore I need to store some information on how it was generated: scale.x.bandwidth(), height, value

do a new computed property: data with paths
container für tooltips und v-if

moe means it could be more or less than the value, so I have to draw one with the lower limit and upper limit