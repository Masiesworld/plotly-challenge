
// Build bar chart and bubble plot

function buildPlots(id){
    var barchart = d3.select("#bar");
    barchart.html("");

    d3.json("data/samples.json").then(function(data){
        console.log(data);
        // find or filter the sample by id
        var samples = data.samples.filter(sample => sample.id.toString() === id)[0];
        console.log(samples);

        var sampleValues = samples.sample_values;
        var otuIds = samples.otu_ids;
        var otuLabels = samples.otu_labels;

        var top10SampleValues = sampleValues.slice(0,10);
        var top10Ids = otuIds.slice(0,10)
        var top10Labels = otuLabels.slice(0,10);

        // build the top 10 otu bar chart
        var trace1 = {
            x: top10SampleValues,
            y: top10Ids,
           // name: "OTU",
            type: "bar",
            hovertext:otuLabels.slice(0,10),
            marker: {
                color: 'rgb(158,202,225)',
            opacity: 0.5,
            line: {
             color: 'rgb(8,48,107)',
             width: 8
    }
            },
            orientation: "h"
        }
        var data1 = [trace1];

        var layout1 = {
            title: "Top 10 OTUs",
            margin:{
                l:100,
                r:100,
                t:150,
                b:100
                },
            bargap: 5
        };
        Plotly.newPlot("bar",data1,layout1);

        // second, build the bubble chart
        var trace2 = {
            x: otuIds,
            y: sampleValues,
            mode: 'markers',
            opacity: 1,
            marker: {
              color: otuIds,
              size: sampleValues
            },
            text: otuLabels
          };

        var data2 = [trace2];
          
        var layout2 = {
            margin: {t:50,r:10,l:10,b:50},
            title: 'OTU ID',
            showlegend:false,
            height:600,
            width:1000
          };
        Plotly.newPlot("bubble", data2, layout2);
          
    }).catch(function(err){
        console.log(err);
    });
}

// Display Metadata info 
function getMetadata(id) {
    d3.json("data/samples.json").then(function(data){
        if (id == undefined) { exit; }

        // find or filter the sample by id
        var idInput = data.names.indexOf(id);
        var metadata = data.metadata[idInput];

        var panel = d3.select(".panel-body");
        panel.html("");

        var dataEntries = Object.entries(metadata);
        dataEntries.forEach(function([key,value]){
            var row = panel.append("p")
                .text(`\t${key.toUpperCase()}: ${value}`);
        });
    });
}

// Optional: Belly washing frequency -- Gauge chart
function buildGaugeChart(id) {
    d3.json("data/samples.json").then(function(data){
         // find or filter the sample by id
         var idInput = data.names.indexOf(id);
         var metadata = data.metadata[idInput];
         var washFreq = metadata.wfreq;

        var data3 = [{
            domain: { x: [0, 1], y: [0, 1] },
		    value: washFreq,
		    title: { text: " Belly Button Washing Frequency" },
		    type: "indicator",
            mode: "gauge+number",
            gauge:{
                axis:{ range:[null,9]},
                bar: { color: "#425c53"},
                bgcolor: "white",
                borderwidth: 2,
                bordercolor: "gray",
                steps: [
                    {range: [0,1], color: "#f7faf9"},
                    {range: [1,2], color: "#e9f5f1"},
                    {range: [2,3], color: "#d1e6df"},
                    {range: [3,4], color: "#b6d4ca"},
                    {range: [4,5], color: "#9bbfb3"},
                    {range: [5,6], color: "#7ea89a"},
                    {range: [6,7], color: "#5f9482"},
                    {range: [7,8], color: "#397561"},
                    {range: [8,9], color: "#1b523f"},
                ]
            }
         }];
        var layout3 = { 
            width: 500, 
            height: 500, 
            margin: { t: 30, r: 50, l:50, b:30 }, 
            paper_bgcolor:"white",
            font:{color:"#2f3d38", family: "Arial"}
        };
        Plotly.newPlot("gauge", data3, layout3);
    });
}



// Update Plots and Meta information when new id is selected

d3.selectAll("select").on("change",updatePlotly);

function updatePlotly(id) {
    buildPlots(id);
    getMetadata(id);
    buildGaugeChart(id);
}

// Default function
function init() {
    var dropDownMenu = d3.select("#selDataset");
    d3.json("data/samples.json").then((data) => {
        var names = data.names;
        //console.log(names);
        names.forEach(name => dropDownMenu.append("option")
                            .text(name)
                            .property("value",name));
        var defaultName = names[0];
        console.log(`Default Name: ${defaultName}`);
        buildPlots(defaultName);
        getMetadata(defaultName);
        buildGaugeChart(defaultName);
    });
    
    
}

init();