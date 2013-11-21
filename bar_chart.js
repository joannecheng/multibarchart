var data = [
  {
    "values":[
    {"x":1378598400000,"y":71},
    {"x":1378684800000,"y":242},
    {"x":1378771200000,"y":158},
    {"x":1378857600000,"y":79},
    {"x":1378944000000,"y":7},
    {"x":1379030400000,"y":65},
    {"x":1379116800000,"y":10}
    ],
    "key":"chat"
  },
  {
    "values":
    [
      {"x":1378598400000,"y":213},
      {"x":1378684800000,"y":230},
      {"x":1378771200000,"y":134},
      {"x":1378857600000,"y":254},
      {"x":1378944000000,"y":205},
      {"x":1379030400000,"y":63},
      {"x":1379116800000,"y":190}
    ],
    "key":"offline"
  }
];

var svg = d3.selectAll('#graphtest')
  .append('svg');
var m = multiBarChart().width(500).height(300);
m.mouseclick(function(event) {
  console.log(this);
  console.log(event);
});

svg.datum(data).call(m);

$(window).resize(function() {
  $('#graphtest svg').remove();
  var svg = d3.selectAll('#graphtest')
    .append('svg');
  svg.datum(data).call(m);
});
