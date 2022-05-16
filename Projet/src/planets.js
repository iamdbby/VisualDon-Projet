// Planétarium du monde MARVEL
var w = 800, h = 600;
var t0 = Date.now();

var planets_marvel = [
  { R: 200, r:  5, speed: 5, phi0: 90},
  { R: 100, r: 10, speed: 2, phi0: 190}
];

var svgM = d3.select("#planetarium_marvel").insert("svg")
.attr("width", w).attr("height", h);

svgM.append("circle").attr("r", 20).attr("cx", w/2)
.attr("cy", h/2).attr("class", "sun_marvel")

var container = svgM.append("g")
.attr("transform", "translate(" + w/2 + "," + h/2 + ")")

container.selectAll("g.planet_marvel").data(planets_marvel).enter().append("g")
.attr("class", "planet_marvel").each(function(d, i) {
  d3.select(this).append("circle").attr("class", "orbit_marvel")
    .attr("r", d.R);
  d3.select(this).append("circle").attr("r", d.r).attr("cx",d.R)
    .attr("cy", 0).attr("class", "planet_marvel");
});

d3.timer(function() {
var delta = (Date.now() - t0);
svgM.selectAll(".planet_marvel").attr("transform", function(d) {
  return "rotate(" + d.phi0 + delta * d.speed/200 + ")";
});
});


// Planétarium du monde DC Comics

var planets_dc = [
  { R: 200, r:  5, speed: 5, phi0: 90},
  { R: 100, r: 10, speed: 2, phi0: 190}
];

var svg = d3.select("#planetarium_dc").insert("svg")
.attr("width", w).attr("height", h);

svg.append("circle").attr("r", 20).attr("cx", w/2)
.attr("cy", h/2).attr("class", "sun_dc")

var container = svg.append("g")
.attr("transform", "translate(" + w/2 + "," + h/2 + ")")

container.selectAll("g.planet_dc").data(planets_dc).enter().append("g")
.attr("class", "planet_dc").each(function(d, i) {
  d3.select(this).append("circle").attr("class", "orbit_dc")
    .attr("r", d.R);
  d3.select(this).append("circle").attr("r", d.r).attr("cx",d.R)
    .attr("cy", 0).attr("class", "planet_dc");
});

d3.timer(function() {
var delta = (Date.now() - t0);
svg.selectAll(".planet_dc").attr("transform", function(d) {
  return "rotate(" + d.phi0 + delta * d.speed/200 + ")";
});
});
