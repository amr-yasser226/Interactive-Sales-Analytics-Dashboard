function fetchDataAndUpdateChart4() {
  fetch('/get-product-revenue')
    .then(response => response.json())
    .then(data => {
      console.log(data)
      updateChart4(data);
    })
    .catch(error => console.error('Error:', error));
}

function updateChart4(data) {
  am5.ready(function () {

    // Create root element
    var root = am5.Root.new("chartdiv4");

    const myTheme = am5.Theme.new(root);

    myTheme.rule("AxisLabel", ["minor"]).setAll({
      dy: 1,
      fill: am5.color("#2F4F4F") // Dark Slate Gray for axis labels
    });

    myTheme.rule("Grid", ["x"]).setAll({
      strokeOpacity: 0.05,
      stroke: am5.color("#DCDCDC") // Gainsboro for grid lines
    });

    myTheme.rule("Grid", ["x", "minor"]).setAll({
      strokeOpacity: 0.05,
      stroke: am5.color("#DCDCDC") // Gainsboro for minor grid lines
    });

    // Set themes
    root.setThemes([
      am5themes_Animated.new(root),
      myTheme
    ]);

    // Create chart
    var chart = root.container.children.push(am5xy.XYChart.new(root, {
      panX: true,
      panY: true,
      wheelX: "panX",
      wheelY: "zoomX",
      maxTooltipDistance: 0,
      pinchZoomX: true,
      background: am5.Rectangle.new(root, {
        fill: am5.color("#FFFFFF") // White background for the chart
      })
    }));

    // Create axes
    var xAxis = chart.xAxes.push(am5xy.DateAxis.new(root, {
      maxDeviation: 0.2,
      baseInterval: {
        timeUnit: "month",
        count: 1
      },
      renderer: am5xy.AxisRendererX.new(root, {
        minorGridEnabled: true
      }),
      tooltip: am5.Tooltip.new(root, {})
    }));

    var yRenderer = am5xy.AxisRendererY.new(root, {
      strokeOpacity: 0.1,
      stroke: am5.color("#DCDCDC") // Gainsboro for Y-axis grid lines
    });

    var yAxis = chart.yAxes.push(am5xy.ValueAxis.new(root, {
      maxDeviation: 0.3,
      renderer: yRenderer
    }));

    // Initialize an array to store series data
    var seriesData = [];

    // Define a custom color list matching the new palette
    var colorList = [
      am5.color("#008080"), // Teal
      am5.color("#FF6F61"), // Coral
      am5.color("#708090"), // Slate Gray
      am5.color("#7B68EE"), // Medium Slate Blue
      am5.color("#2F4F4F")  // Dark Slate Gray
    ];

    // Add series to the chart
    for (var i = 0; i < data.length; i++) {
      var product = data[i].Product;

      // Find or create the series data for the product
      var productData = seriesData.find(item => item.name === product);
      if (!productData) {
        productData = { name: product, data: [] };
        seriesData.push(productData);
      }

      // Add data point to the series data
      var date = new Date(data[i].Year, data[i].Month - 1); // Adjust the date creation
      productData.data.push({ date: date.getTime(), value: data[i].ProductRevenue });
    }

    // Add series to the chart
    for (var i = 0; i < seriesData.length; i++) {
      var productData = seriesData[i];

      var series = chart.series.push(am5xy.LineSeries.new(root, {
        name: productData.name,
        xAxis: xAxis,
        yAxis: yAxis,
        valueYField: "value",
        valueXField: "date",
        legendValueText: "{valueY}",
        tooltip: am5.Tooltip.new(root, {
          pointerOrientation: "horizontal",
          labelText: "{valueY}"
        }),
        stroke: colorList[i % colorList.length], // Assign color from colorList
        fill: colorList[i % colorList.length] // Assign fill same as stroke for consistency
      }));

      // Add data points to the series
      series.data.setAll(productData.data);

      // Style bullets if any
      series.bullets.push(function () {
        return am5.Bullet.new(root, {
          sprite: am5.Circle.new(root, {
            radius: 4,
            fill: series.get("stroke")
          })
        });
      });

      // Make stuff animate on load
      series.appear();
    }

    // Add cursor
    var cursor = chart.set("cursor", am5xy.XYCursor.new(root, {
      behavior: "none"
    }));
    cursor.lineY.set("visible", false);

    // Add scrollbar
    chart.set("scrollbarX", am5.Scrollbar.new(root, {
      orientation: "horizontal"
    }));

    chart.set("scrollbarY", am5.Scrollbar.new(root, {
      orientation: "vertical"
    }));

    // Add legend
    var legend = chart.rightAxesContainer.children.push(am5.Legend.new(root, {
      width: 200,
      paddingLeft: 15,
      height: am5.percent(100)
    }));

    // When legend item container is hovered, dim all the series except the hovered one
    legend.itemContainers.template.events.on("pointerover", function (e) {
      var itemContainer = e.target;
      var series = itemContainer.dataItem.dataContext;

      chart.series.each(function (chartSeries) {
        if (chartSeries != series) {
          chartSeries.strokes.template.setAll({
            strokeOpacity: 0.15,
            stroke: am5.color("#2F4F4F") // Dark Slate Gray for dimmed lines
          });
        } else {
          chartSeries.strokes.template.setAll({
            strokeWidth: 3,
            stroke: chartSeries.get("stroke") // Maintain original color
          });
        }
      })
    });

    // When legend item container is unhovered, make all series as they are
    legend.itemContainers.template.events.on("pointerout", function (e) {
      chart.series.each(function (chartSeries) {
        chartSeries.strokes.template.setAll({
          strokeOpacity: 1,
          strokeWidth: 1,
          stroke: chartSeries.get("stroke")
        });
      })
    });

    legend.itemContainers.template.set("width", am5.p100);
    legend.valueLabels.template.setAll({
      width: am5.p100,
      textAlign: "right",
      fill: am5.color("#2F4F4F") // Dark Slate Gray for legend text
    });

    // Set number formatter settings for large and small numbers
    root.numberFormatter.setAll({
      numberFormat: "#a",
      bigNumberPrefixes: [
        { "number": 1e+6, "suffix": "M" },
        { "number": 1e+9, "suffix": "B" }
      ],
      smallNumberPrefixes: []
    });

    // Make stuff animate on load
    chart.appear(1000, 100);

  }); // end am5.ready()
}

document.addEventListener('DOMContentLoaded', function () {
  fetchDataAndUpdateChart4();
});
