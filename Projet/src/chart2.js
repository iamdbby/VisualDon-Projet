function chart2(container, raw) {
    //size
    const width = 800;
    const height = 300;
    const margin = { top: 10, bottom: 40, left: 40, right: 40 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;
  
    //data process always the same
    const data = d3
      .rollups(
        raw,
        (v) => ({
          universe: v[0].universe,
          sex: v[0].SEX.replace("Characters", "").trim(),
          cnt: v.length,
        }),
        (d) => [d.universe, d.SEX].join(",")
      )
      .map((d) => d[1])
      .filter((d) => ["Male", "Female"].includes(d.sex));
  
    //scale
    //   const domains = data.map((d) => [d.universe, d.sex].join(","));
    //   console.log("domains", domains);
  
    const xScale = d3
      .scaleBand()
      .domain([
        "Marvel,Male",
        "DC Comics,Male",
        "DC Comics,Female",
        "Marvel,Female",
      ])
      .range([0, innerWidth])
      .padding(0.3);
  
    const maxValue = d3.max(data, (d) => d.cnt);
  
    const yPositiveScale = d3
      .scaleLinear()
      .domain([0, maxValue * 1.2])
      .range([innerHeight / 2, 0]);
  
    const yNegativeScale = d3
      .scaleLinear()
      .domain([0, maxValue * 1.2])
      .range([0, innerHeight / 2]);
  
    //
    const svg = container
      .append("svg")
      .attr("width", width)
      .attr("height", height);
  
    svg
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`)
      .call(d3.axisLeft(yPositiveScale).ticks(6));
  
    svg
      .append("g")
      .attr(
        "transform",
        `translate(${margin.left},${margin.top + innerHeight / 2})`
      )
      .call(d3.axisLeft(yNegativeScale).ticks(6));
  
    svg
      .append("g")
      .attr(
        "transform",
        `translate(${margin.left},${margin.top + innerHeight / 2})`
      )
      .call(d3.axisBottom(xScale))
      .call((g) => {
        g.selectAll("line").remove();
        g.selectAll("text").remove();
      })
      .call((g) => {
        g.selectAll("text")
          .data(xScale.domain())
          .join("text")
          .attr("class", (d) => d.split(",")[0].replaceAll(" ", ""))
          .attr("dominant-baseline", "middle")
          .attr("text-anchor", "middle")
          .attr("x", (d) => xScale(d) + xScale.bandwidth() / 2)
          .attr("y", (d, i, a) => (i < a.length / 2 ? 30 : -30))
          .text((d) => d.split(",")[0]);
  
        g.selectAll("text.sex")
          .data(xScale.domain())
          .join("text")
          .attr("class", "sex")
          .attr("dominant-baseline", "middle")
          .attr("text-anchor", "middle")
          .attr("fill", "grey")
          .attr("font-size", 12)
          .attr("x", (d) => xScale(d) + xScale.bandwidth() / 2)
          .attr("y", (d, i, a) => (i < a.length / 2 ? 14 : -14))
          .text((d) => d.split(",")[1]);
      });
  
    svg
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`)
      .call((g) => {
        g.selectAll("rect.male")
          .data(data.filter((d) => d.sex == "Male"))
          .join("rect")
          .attr("class", (d) =>
            d.universe == "Marvel" ? "male marvel" : "male dc"
          )
          .on("mouseover", onMouseOver) // <-- Add listener for the mouseout event
          .on("mouseout", onMouseOut) // <-- Add listener for the mouseout event
          .attr("stroke", "none")
          .attr("x", (d) => xScale([d.universe, d.sex].join(",")))
          .attr("y", (d) => yPositiveScale(d.cnt))
          .attr("width", xScale.bandwidth())
          .attr("height", (d) => innerHeight / 2 - yPositiveScale(d.cnt));
  
        g.selectAll("rect.female")
          .data(data.filter((d) => d.sex == "Female"))
          .join("rect")
          .attr("class", (d) =>
            d.universe == "Marvel" ? "female marvel" : "female dc"
          )
          .on("mouseover", onMouseOver) // <-- Add listener for the mouseout event
          .on("mouseout", onMouseOut) // <-- Add listener for the mouseout event
          .attr("stroke", "none")
          .attr("x", (d) => xScale([d.universe, d.sex].join(",")))
          .attr("y", innerHeight / 2)
          .attr("width", xScale.bandwidth())
          .attr("height", (d) => yNegativeScale(d.cnt));
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
  