var mergeWith = require('lodash/mergeWith');

var path = require('path');

var mergeFunction = function(a, b) {
  if(Array.isArray(a) && Array.isArray(b)) {
    return a.concat(b);
  }
  if(Array.isArray(a) && !Array.isArray(b)) {
    return a.map(function(item) {
      return mergeWith({}, {x:item}, {x:b}, mergeFunction).x;
    });
  }
  if(Array.isArray(b) && !Array.isArray(a)) {
    return b.map(function(item) {
      return mergeWith({}, {x:a}, {x:item}, mergeFunction).x;
    });
  }
};


/**
 * @param {...Object} config The webpack configs which will be merged
 * @return {Object} The webpack config object
 */
var mergeWebpackConfig = function() {
  var defaultConfig = {
    context: ".",
    output: {
      path: "."
    },
    progress: true,
    stats: {},
    failOnError: true
  };
  var configsList = Array.prototype.slice.call(arguments);

  var mergeConfigsList = [defaultConfig]
    .concat(configsList)
    .map(function(config) {

      /**
       * Create special merge object
       */
      return {
        x: config
      };
    });

  /**
   * Add merge function to the end of the configs
   * list
   */
  var options = mergeWith.apply(null, mergeConfigsList.concat(mergeFunction)).x;

  [].concat(options).forEach(function(options) {
    options.context = path.resolve(process.cwd(), options.context);
    options.output.path = path.resolve(process.cwd(), options.output.path);
  });

  return options;
};

module.exports = mergeWebpackConfig;
