function multiBarChart() {
  var margin = {top: 20, right: 20, bottom: 20, left: 20}
  var width = 200;
  var height = 100;
  var xScale = d3.time.scale();
  var yScale = d3.scale.linear();
  var mouseclick;

  var maxValue = function(data, key) {
    var maxVal = -1;
    for(var i=0; i<data.length;i++) {
      var d = data[i];
      for(var j=0; j<d.values.length; j++) {
        var val = d.values[j][key];
        if (val > maxVal) {
          maxVal = val;
        }
      }
    }
    return maxVal;
  };

  var minValue = function(data, key) {
    var minVal = Infinity;
    for(var i=0; i<data.length;i++) {
      var d = data[i];
      for(var j=0; j<d.values.length; j++) {
        var val = d.values[j][key];
        if (val < minVal) {
          minVal = val;
        }
      }
    }
    return minVal;
  };

  function chart() {
    var barWidth = (width - margin.left)/data[0].values.length/data.length;
    var barSpacing = 4;

    var selection = this;
    var maxYValue = maxValue(data, 'y');
    var maxXValue = maxValue(data, 'x');
    var minXValue = minValue(data, 'x');
    var dateFormat = d3.time.format('%m-%d');

    yScale.domain([0, maxYValue]).range([2, height])
    xScale.domain([minXValue, maxXValue]).range([0, width - margin.left]);
    var xAxis = d3.svg.axis()
      .scale(xScale)
      .ticks(d3.time.days, 1)
      .tickSubdivide(true)

    var svg = selection
      .selectAll('g')
      .data(data);

    // draw group for each set
    var sets = svg.enter()
      .append('g')
      .attr('width', width)
      .attr("transform", function(d, i) { return 'translate('+ (margin.left + (i * (barWidth))) + ', 0)'; })
      .attr('class', function(d, i) {
        return 'bar-set' + i;
      });

    // draw rects for each group
    var rects = sets.selectAll('rect')
      .data(function(d) { return d.values; }).enter()
      .append('rect')
      .attr('width', barWidth)
      .attr('height', function(d) { return yScale(d.y) })
      .attr('x', function(d, i) { return i * (barWidth * data.length + barSpacing); })
      .attr('y', function(d) { return height - yScale(d.y) });

    // mouseclick action
    if (typeof mouseclick !== 'undefined') {
      rects.on('click', mouseclick);
    }

    // draw axes
    svg.append('g')
      .classed('x-axis', true)
      .classed('axis', true)
      .attr('transform', 'translate(0,' + height + ')')
      .call(xAxis);
  }

  chart.width = function(value) {
    if (!arguments.length) return width;
    width = value;
    return chart;
  }

  chart.height = function(value) {
    if (!arguments.length) return height;
    height = value;
    return chart;
  }

  chart.margin = function(value) {
    if(!arguments.length) return margin;
    margin = value;
    return margin;
  }

  chart.mouseclick = function(value) {
    if(!arguments.length) return value;
    mouseclick = value;
    return value;
  }

  return chart;
}

var data = [{"values":[{"x":1378598400000,"y":71},{"x":1378684800000,"y":242},{"x":1378771200000,"y":158},{"x":1378857600000,"y":79},{"x":1378944000000,"y":7},{"x":1379030400000,"y":65},{"x":1379116800000,"y":10}],"key":"chat"},{"values":[{"x":1378598400000,"y":213},{"x":1378684800000,"y":230},{"x":1378771200000,"y":134},{"x":1378857600000,"y":254},{"x":1378944000000,"y":205},{"x":1379030400000,"y":63},{"x":1379116800000,"y":190}],"key":"offline"}];

var svg = d3.selectAll('#graphtest')
  .append('svg');
var m = multiBarChart().width(500).height(300);
m.mouseclick(function(event) {
  console.log(this);
  console.log(event);
});
svg.datum(data).call(m);
