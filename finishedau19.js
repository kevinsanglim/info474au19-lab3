"use strict";
(function(){
    let data = ""
    let svgContainer = ""

    const measurements = {
        width: 500,
        height: 500,
        marginAll: 50
    }

    function test(time) {
        svgContainer = d3.select('body').append("svg")
            .attr('width', measurements.width)
            .attr('height', measurements.height);
        d3.csv("dataEveryYear.csv")
            .then((csvData) => data = csvData)
            .then(() => makeScatterPlot(time))
    }

    window.onload = function() {
        test(this.document.getElementById("slide").value)
        let time = document.getElementById("slide");
        time.addEventListener('change',test(this.value));
        }

    function makeScatterPlot(time) {
        
        let fertilityRate = data.map((row) => parseInt(row["fertility_rate"]))
        let lifeExpect = data.map((row) =>  parseFloat(row["life_expectancy"]))
        let year = data.map((row) =>  parseFloat(row["time"]))

        const limits = findMinMax(fertilityRate, lifeExpect,year)

        let scaleX = d3.scaleLinear()
            .domain([limits.greMin, limits.greMax])
            .range([0 + measurements.marginAll, measurements.width - measurements.marginAll])

        let scaleY = d3.scaleLinear()
            .domain([limits.admitMax, limits.admitMin - 0.05])
            .range([0 + measurements.marginAll, measurements.height - measurements.marginAll])
        
          // Add a scale for bubble size
        let scaleS = d3.scaleLinear()
        .domain([limits.greMin, limits.greMax])
        .range([ 1, 1.10]);

        drawAxes(scaleX, scaleY)

        plotData(scaleX, scaleY, scaleS, time)
    }

    function findMinMax(fertilityRate, lifeExpect,year) {
        return {
            greMin: d3.min(fertilityRate),
            greMax: d3.max(fertilityRate),
            admitMin: d3.min(lifeExpect),
            admitMax: d3.max(lifeExpect),
            yearMin: d3.min(year),
            yearMax: d3.max(year)
        }
    }

    function drawAxes(scaleX, scaleY) {
        // these are not HTML elements. They're functions!
        let xAxis = d3.axisBottom()
            .scale(scaleX)

        let yAxis = d3.axisLeft()
            .scale(scaleY)
            
        svgContainer.append('g')
            .attr('transform', 'translate(0,450)')
            .call(xAxis)

        svgContainer.append('g')
            .attr('transform', 'translate(50, 0)')
            .call(yAxis)
    }

    function plotData(scaleX, scaleY, scaleS,time) {
        const xMap = function(d) { return scaleX(+d["fertility_rate"]) }
        const yMap = function(d) { return scaleY(+d["life_expectancy"]) }   
        const sMap = function(d) { return scaleS(+d["pop_mlns"]) } 
        //datas = d3.max(data, function(d) { return +d.time; })])
        let filtered = data.filter(function(d) {
            return d["time"] === time
          })
        const circles = svgContainer.selectAll(".circle")
            .data(filtered)
            .enter()
            .append('circle')
                .attr('cx', xMap)
                .attr('cy', yMap)
                .attr('r', sMap)
                .attr('fill', "#4286f4")
    }

})()