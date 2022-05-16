function chart3(container, raw) {
    //size
    const width = 800;
    const height = 300;
    const margin = { top: 10, bottom: 40, left: 40, right: 40 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;
  
    //data process
    const totals = d3
      .rollups(
        raw,
        (v) => v.length,
        (d) => d.universe
      )
      .reduce((prev, curr) => {
        prev[curr[0]] = curr[1];
        return prev;
      }, {});
  
    const data = d3
      .rollups(
        raw,
        (v) => ({
          universe: v[0].universe,
          align: v[0].ALIGN == "" ? "Unknown" : v[0].ALIGN,
          cnt: v.length,
          percent: v.length / totals[v[0].universe],
        }),
        (d) => [d.universe, d.ALIGN].join(",")
      )
      .map((d) => d[1]);
  
    //scale X 
    const xScale = d3
      .scaleBand()
      .domain(data.map((d) => d.align))
      .range([0, innerWidth])
      .padding(0.2);
  
    const xSubScale = d3  
      .scaleBand()
      .domain(data.map((d) => d.universe))
      .range([0, xScale.bandwidth()])
      .padding(0.1);
    //scale Y
    const yScale = d3.scaleLinear().range([innerHeight, 0]);
  
    //
    const svg = container
      .append("svg")
      .attr("width", width)
      .attr("height", height);
  
    svg
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`)
      .call(d3.axisLeft(yScale))
      .call((g) => {
        g.selectAll("text").each(function (d) {
          d3.select(this).text(d * 100 + "%");
        });
      });
  
    svg
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top + innerHeight})`)
      .call(d3.axisBottom(xScale))
      .call((g) => {
        g.selectAll("line").remove();
        g.selectAll("text")
          .attr("font-size", 14)
          .attr("y", 15)
          .attr("dominant-baseline", "middle");
      });
  
    svg
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`)
      .call((g) => {
        g.selectAll("rect")
          .data(data)
          .join("rect")
          .attr("class", (d) => (d.universe == "Marvel" ? "marvel" : "dc"))
          .on("mouseover", onMouseOver) // <-- Add listener for the mouseout event
          .on("mouseout", onMouseOut) // <-- Add listener for the mouseout event
          .attr("stroke", "none")
          .attr("x", (d) => xScale(d.align) + xSubScale(d.universe))
          .attr("y", (d) => yScale(d.percent))
          .attr("width", xSubScale.bandwidth())
          .attr("height", (d) => innerHeight - yScale(d.percent));
  
        g.selectAll("text")
          .data(data)
          .join("text")
          .attr("dominant-baseline", "auto")
          .attr("text-anchor", "middle")
          .attr("fill", "rgba(0,0,0,0.7)")
          .attr("font-size", 12)
          .attr(
            "x",
            (d) =>
              xScale(d.align) + xSubScale(d.universe) + xSubScale.bandwidth() / 2
          )
          .attr("y", (d) => yScale(d.percent)-5)
          .text((d) => d3.format(",.1%")(d.percent));
      });
  
           //Mouseover event 
           function onMouseOver(d, i) {
            d3.select(this).attr('class', 'highlight');
            d3.select(this)
              .transition()    //  <-- animation
              .duration(400)
              .attr('width', x.bandwidth() + 5)
              .attr("y", function(d) { return y(d.value) - 10; })
              .attr("height", function(d) { return height - y(d.value) + 10; });
      
        }
      
        //Mouseout event 
        function onMouseOut(d, i) {
            
            d3.select(this).attr('class', 'bar');
            d3.select(this)
              .transition()    //  <-- animation
              .duration(400)
              .attr('width', x.bandwidth())
              .attr("y", function(d) { return y(d.value); })
              .attr("height", function(d) { return height - y(d.value); });
      
            d3.selectAll('.val')
              .remove()
        }
  }
  