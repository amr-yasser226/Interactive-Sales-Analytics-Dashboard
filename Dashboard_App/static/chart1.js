function fetchDataAndUpdateChart1() {
  fetch(`/get-employee-count-by-country`)
    .then(response => response.json())
    .then(data => {
      console.log(data);
      updateChart1(data);
    })
    .catch(error => console.error('Error:', error));
}

function updateChart1(data) {

  am5.ready(function () {

    // Create root element
    var root = am5.Root.new("chartdiv1");

    // Set themes
    root.setThemes([
      am5themes_Animated.new(root)
    ]);

    // Define a custom color list matching the new palette
    var colorList = [
      am5.color("#008080"), // Teal
      am5.color("#FF6F61"), // Coral
      am5.color("#708090"), // Slate Gray
      am5.color("#7B68EE"), // Medium Slate Blue
      am5.color("#2F4F4F")  // Dark Slate Gray
    ];

    // Create chart
    var chart = root.container.children.push(am5xy.XYChart.new(root, {
      panX: true,
      panY: true,
      wheelX: "panX",
      wheelY: "zoomX",
      pinchZoomX: true,
      paddingLeft: 0,
      paddingRight: 1
    }));

    // Apply custom color list
    chart.set("colors", am5.ColorSet.new(root, { colors: colorList }));

    // Add cursor
    var cursor = chart.set("cursor", am5xy.XYCursor.new(root, {}));
    cursor.lineY.set("visible", false);

    // Create axes
    var xRenderer = am5xy.AxisRendererX.new(root, {
      minGridDistance: 30,
      minorGridEnabled: true
    });

    xRenderer.labels.template.setAll({
      rotation: -90,
      centerY: am5.p50,
      centerX: am5.p100,
      paddingRight: 15,
      fill: am5.color("#2F4F4F") // Dark Slate Gray for label text
    });

    xRenderer.grid.template.setAll({
      location: 1,
      stroke: am5.color("#DCDCDC") // Gainsboro for grid lines
    });

    var xAxis = chart.xAxes.push(am5xy.CategoryAxis.new(root, {
      maxDeviation: 0.3,
      categoryField: "Country",
      renderer: xRenderer,
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

    // Create series
    var series = chart.series.push(am5xy.ColumnSeries.new(root, {
      name: "Employee Count",
      xAxis: xAxis,
      yAxis: yAxis,
      valueYField: "AverageEmployeeCount",
      sequencedInterpolation: true,
      categoryXField: "Country",
      tooltip: am5.Tooltip.new(root, {
        labelText: "{valueY}"
      })
    }));

    series.columns.template.setAll({ cornerRadiusTL: 5, cornerRadiusTR: 5, strokeOpacity: 0 });

    series.columns.template.adapters.add("fill", function (fill, target) {
      return chart.get("colors").getIndex(series.columns.indexOf(target));
    });

    series.columns.template.adapters.add("stroke", function (stroke, target) {
      return chart.get("colors").getIndex(series.columns.indexOf(target));
    });

    xAxis.data.setAll(data);
    series.data.setAll(data);

    // Apply styles to tooltip
    series.tooltip.label.setAll({
      fill: am5.color("#FFFFFF"), // White text in tooltip
      background: am5.RoundedRectangle.new(root, {
        fill: am5.color("#008080"), // Teal background
        cornerRadius: 5,
        padding: 10
      })
    });

    // Make stuff animate on load
    series.appear(1000);
    chart.appear(1000, 100);

  }); // end am5.ready()

}

document.addEventListener('DOMContentLoaded', function () {
  fetchDataAndUpdateChart1();
});
