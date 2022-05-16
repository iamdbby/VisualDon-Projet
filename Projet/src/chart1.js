function chart1(container, raw) {
    //size as always
    const width = 800;
    const height = 300;
    const margin = { top: 10, bottom: 40, left: 40, right: 40 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;
  
  
    var tooltip = d3.select('body').append('div')
    .style('position', 'absolute')
    .style('background', '#9400D3')
    .style('padding', '5 15px')
    .style('border', '1px #333 solid')
    .style('border-radius', '5px')
    .style('opacity', '0')
  
  
  
    //data processus
    const data = d3
      .rollups(
        raw,
        (v) => v.length,
        (d) => d.universe
      )
      .map((d) => ({ universe: d[0], cnt: d[1] }));
  
    //scale
    const xScale = d3
      .scaleBand()
      .domain(data.map((d) => d.universe))
      .range([0, innerWidth])
      .padding(0.5);
  
    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d.cnt) * 1.2])
      .nice()
      .range([innerHeight, 0]);
  
    //
    const svg = container
      .append("svg")
      .attr("width", width)
      .attr("height", height);
  
    svg
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`)
      .call(d3.axisLeft(yScale));
  
    svg
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top + innerHeight})`)
      .call(d3.axisBottom(xScale))
      .call((g) => {
        g.selectAll("line").remove();
        g.selectAll("text").remove();
      })
      .call((g) => {
        g.selectAll("text")
          .data(xScale.domain())
          .join("text")
          .attr("class", (d) => d.replaceAll(" ", ""))
          .attr("dominant-baseline", "middle")
          .attr("text-anchor", "middle")
          .attr("x", (d) => xScale(d) + xScale.bandwidth() / 2)
          .attr("y", 20)
          .text((d) => d);
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
          .attr("x", (d) => xScale(d.universe))
          .attr("y", (d) => yScale(d.cnt))
          .attr("width", xScale.bandwidth())
          .attr("height", (d) => innerHeight - yScale(d.cnt));
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
  