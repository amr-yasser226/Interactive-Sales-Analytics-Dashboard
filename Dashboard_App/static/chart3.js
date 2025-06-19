function fetchDataAndUpdateChart3() {
  fetch('/get-sales-count-by-product')
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      console.log('Fetched data:', data);
      updateChart3(data);
    })
    .catch(error => console.error('Error fetching data:', error));
}

function updateChart3(data) {

  am5.ready(function () {

    // Create root element
    var root = am5.Root.new("chartdiv3");

    // Set themes
    root.setThemes([
      am5themes_Animated.new(root)
    ]);

    // Define the desired color palette
    var colorPalette = [
      am5.color("#008080"), // Teal
      am5.color("#FF6F61"), // Coral
      am5.color("#708090"), // Slate Gray
      am5.color("#7B68EE"), // Medium Slate Blue
      am5.color("#2F4F4F")  // Dark Slate Gray
    ];

    // Create chart
    var chart = root.container.children.push(am5percent.PieChart.new(root, {
      radius: am5.percent(90),
      innerRadius: am5.percent(50),
      layout: root.horizontalLayout
    }));

    // Create series
    var series = chart.series.push(am5percent.PieSeries.new(root, {
      name: "Series",
      valueField: "salesCount",
      categoryField: "product"
    }));

    // Set data
    series.data.setAll(data);

    // Disable labels and ticks for a cleaner look
    series.labels.template.set("visible", false);
    series.ticks.template.set("visible", false);

    // Assign colors to each slice based on the colorPalette
    series.slices.template.adapters.add("fill", function (fill, target) {
      var index = target.dataItem.index;
      var color = colorPalette[index % colorPalette.length];
      console.log(`Setting color for slice ${index}: ${color}`); // Debugging
      return color;
    });

    // Remove or disable fillGradient to prevent it from overriding slice colors
    series.slices.template.set("fillGradient", undefined);
    // Alternatively, comment out the fillGradient line:
    // series.slices.template.set("fillGradient", am5.RadialGradient.new(root, {
    //   stops: [{
    //     brighten: -0.8
    //   }, {
    //     brighten: -0.8
    //   }, {
    //     brighten: -0.5
    //   }, {
    //     brighten: 0
    //   }, {
    //     brighten: -0.5
    //   }]
    // }));

    // Optionally, set stroke opacity to 0 for a cleaner look
    series.slices.template.set("strokeOpacity", 0);

    // Create legend
    var legend = chart.children.push(am5.Legend.new(root, {
      centerY: am5.percent(50),
      y: am5.percent(50),
      layout: root.verticalLayout
    }));
    // Set value labels to align to the right
    legend.valueLabels.template.setAll({ textAlign: "right" });
    // Set width and max width of labels
    legend.labels.template.setAll({
      maxWidth: 140,
      width: 140,
      oversizedBehavior: "wrap"
    });

    // Set legend data
    legend.data.setAll(series.dataItems);

    // Play initial series animation
    series.appear(1000, 100);

  }); // end am5.ready()

}

document.addEventListener('DOMContentLoaded', function () {
  fetchDataAndUpdateChart3();
});
