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
  - 




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