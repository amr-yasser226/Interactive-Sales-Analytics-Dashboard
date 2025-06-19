function fetchDataAndUpdateChart5() {
  fetch('/get-revenue-composition-by-product')
    .then(response => response.json())
    .then(data => {
      console.log(data)
      updateChart5(data);
    })
    .catch(error => console.error('Error:', error));
}

function updateChart5(data) {
  am5.ready(function () {

    // Create root element
    var root = am5.Root.new("chartdiv5");

    var myTheme = am5.Theme.new(root);

    myTheme.rule("Grid", ["base"]).setAll({
      strokeOpacity: 0.1,
      stroke: am5.color("#DCDCDC") // Gainsboro for grid lines
    });

    // Set themes
    root.setThemes([
      am5themes_Animated.new(root),
      myTheme
    ]);

    // Create chart
    var chart = root.container.children.push(am5xy.XYChart.new(root, {
      panX: false,
      panY: false,
      wheelX: "panY",
      wheelY: "zoomY",
      paddingLeft: 0,
      layout: root.verticalLayout,
      background: am5.Rectangle.new(root, {
        fill: am5.color("#FFFFFF") // White background for the chart
      })
    }));

    // Add scrollbar
    chart.set("scrollbarY", am5.Scrollbar.new(root, {
      orientation: "vertical"
    }));

    // Create axes
    var yRenderer = am5xy.AxisRendererY.new(root, {
      fill: am5.color("#2F4F4F"), // Dark Slate Gray for axis labels
      stroke: am5.color("#DCDCDC") // Gainsboro for Y-axis lines
    });
    var yAxis = chart.yAxes.push(am5xy.CategoryAxis.new(root, {
      categoryField: "year",
      renderer: yRenderer,
      tooltip: am5.Tooltip.new(root, {})
    }));

    yRenderer.grid.template.setAll({
      location: 1,
      stroke: am5.color("#DCDCDC") // Gainsboro for grid lines
    });

    yAxis.data.setAll(data);

    var xAxis = chart.xAxes.push(am5xy.ValueAxis.new(root, {
      min: 0,
      maxPrecision: 0,
      renderer: am5xy.AxisRendererX.new(root, {
        minGridDistance: 40,
        strokeOpacity: 0.1,
        stroke: am5.color("#DCDCDC") // Gainsboro for X-axis lines
      })
    }));

    // Add legend
    var legend = chart.children.push(am5.Legend.new(root, {
      centerX: am5.p50,
      x: am5.p50,
      layout: root.horizontalLayout
    }));

    // Define a custom color list matching the new palette
    var colorList = [
      am5.color("#008080"), // Teal
      am5.color("#FF6F61"), // Coral
      am5.color("#708090"), // Slate Gray
      am5.color("#7B68EE"), // Medium Slate Blue
      am5.color("#2F4F4F")  // Dark Slate Gray
    ];

    // Add series
    function makeSeries(name, fieldName, index) {
      var series = chart.series.push(am5xy.ColumnSeries.new(root, {
        name: name,
        stacked: true,
        xAxis: xAxis,
        yAxis: yAxis,
        baseAxis: yAxis,
        valueXField: fieldName,
        categoryYField: "year",
        fill: colorList[index % colorList.length],
        stroke: colorList[index % colorList.length]
      }));

      series.columns.template.setAll({
        tooltipText: "{name}, {categoryY}: {valueX}",
        tooltipY: am5.percent(90),
        strokeOpacity: 0
      });

      series.data.setAll(data);

      // Add bullets (labels)
      series.bullets.push(function () {
        return am5.Bullet.new(root, {
          sprite: am5.Label.new(root, {
            text: "{valueX}",
            fill: am5.color("#FFFFFF"), // White text for labels
            centerY: am5.p50,
            centerX: am5.p50,
            populateText: true
          })
        });
      });

      // Make stuff animate on load
      series.appear();

      // Add series to legend
      legend.data.push(series);
    }

    // Add series for each product
    makeSeries("Televisions", "televisions", 0);
    makeSeries("Smartphones", "smartphones", 1);
    makeSeries("Laptops", "laptops", 2);
    makeSeries("Tablets", "tablets", 3);
    makeSeries("Headphones", "headphones", 4);

    // Make stuff animate on load
    chart.appear(1000, 100);

  }); // end am5.ready()
}

document.addEventListener('DOMContentLoaded', function () {
  fetchDataAndUpdateChart5();
});
