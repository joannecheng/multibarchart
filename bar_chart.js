function multiBarChart() {
  var margin = {top: 20, right: 20, bottom: 20, left: 20}
  var width = 200;
  var height = 100;
  var xScale = d3.scale.linear();
  var yScale = d3.scale.linear();
  var barWidth = 10;
  var barSpacing = 4;

  var findMaxValue = function(data) {
    var maxVal = -1;
    for(var i=0; i<data.length;i++) {
      var d = data[i];
      for(var j=0; j<d.values.length; j++) {
        var val = d.values[j].y;
        if (val > maxVal) {
          maxVal = val;
        }
      }
    }
    return maxVal;
  };

  function chart() {
    var selection = this;
    var maxValue = findMaxValue(data);
    yScale.domain([0, maxValue]).range([2, height])

    var svg = selection
      .selectAll('g')
      .data(data);

    var sets = svg.enter()
      .append('g')
      .attr('width', width)
      .attr("transform", function(d, i) { return 'translate('+ (i * (barWidth)) + ', 0)'; })
      .attr('fill', function(d, i) { if(i == 1) { return 'black'}} )
      .classed('set', true);

    sets.selectAll('rect')
      .data(function(d) { return d.values; }).enter()
      .append('rect')
      .attr('width', barWidth)
      .attr('height', function(d) { return yScale(d.y) })
      .attr('x', function(d, i) { return i * (barWidth * 2 + barSpacing); })
      .attr('y', function(d) { return height - yScale(d.y) });
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

  return chart;
}

var data = [{"values":[{"timestamp":1378598400000,"y":71},{"timestamp":1378684800000,"y":242},{"timestamp":1378771200000,"y":158},{"timestamp":1378857600000,"y":79},{"timestamp":1378944000000,"y":7},{"timestamp":1379030400000,"y":65},{"timestamp":1379116800000,"y":10}],"key":"chat"},{"values":[{"timestamp":1378598400000,"y":213},{"timestamp":1378684800000,"y":230},{"timestamp":1378771200000,"y":134},{"timestamp":1378857600000,"y":254},{"timestamp":1378944000000,"y":205},{"timestamp":1379030400000,"y":63},{"timestamp":1379116800000,"y":190}],"key":"offline"}];

var svg = d3.selectAll('#graphtest')
  .append('svg');
var m = multiBarChart()

svg.datum(data).call(m);
