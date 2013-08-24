(function( $, undefined) {

  $(document).ready(init);

  function init() {
    registerEventListeners();
  }

  function registerEventListeners() {
    $(".graphLaunch").click(fetchChart);
  }

  // fetchChart
  function fetchChart() {
    var $this, id, metric, el, school;
    $this = $(this);
    school = $('li.rosters a').attr('href').split('/')[1];
    id = $(".aPhoto").attr('id');     //athlete ID
    metric = $this.data('metric');  //metric category
    el = $this.data('reveal-id');   //metric measurment
    $('.drawChart').attr('id', el); //chart ID
    // console.log('id / metric / el:', id, metric, el);

    $.ajax(
      {
        url: "/" +school+ "/rosters/athlete/" + id + "/" + metric + "/" + el,
        type: "GET",
        dataType: 'json',
        error: ajaxError
      }
    ).success(function(data) {
      // $this.text("Viewing");
      launchChart(metric, el, data);
    });

    return true;
  }

  // display athlete chart in profile
  function launchChart(metric, el, dataElements) {
    // console.log('dataElements', dataElements);
    // console.log('chartID', el);
    var chartId = '#' + el + 'Chart';
    var values, labels, name, Metric, metricTag, element;
    values = dataElements.values;
    labels = dataElements.labels;

    name = $(".name").text();
    metric = metric.replace('metrics', '');
    Metric = metric[0].toUpperCase() + metric.slice(1) + " " + "Metrics";

    element = $("." + el).text();

    $('.athName').text(name);
    $('.metrics').text(Metric);
    $('.element').text(element);
    $('canvas').attr('id', el + 'Chart');

    drawChart(chartId, labels, values);
  }

  // draw chart on canvas
  function drawChart(chartId, labels, values) {
    // console.log('values', values);
    // console.log('labels', labels);
    var ctx = $(chartId).get(0).getContext("2d");
    var data = {
      labels : labels,
      datasets : [
            {
              fillColor : "#F5DFDF",
              strokeColor : "#E80000",
              pointColor : "#F5C5BA",
              pointStrokeColor : "#E80000",
              data : values
            }
      ]
    };
    var option = {
      bezierCurve : false,
      datasetStrokeWidth : 5
     };
    new Chart(ctx).Line(data,option);
  }

  // AJAX Error
  function ajaxError(jqXHR, status, error) {
    console.log('jqXHR', jqXHR);
    console.log('status', status);
    console.log('error', error);
  }

})(jQuery);
