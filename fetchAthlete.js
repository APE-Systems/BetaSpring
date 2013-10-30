(function( $, undefined) {

  $(document).ready(init);

  function init() {
    registerEventListeners();
  }

  function registerEventListeners() {
    $(".rosterTableRow").click(fetchAthlete);
  }

  // fetchAthlete
  function fetchAthlete() {
    var $this = $(this);
    var id = $this.attr('id');
    // console.log('ajaxid:', id);
    var school = $('li.rosters a').attr('href').split('/')[1];
    // console.log('ajaxSchool', school);

    $('.rosterTableRow.active').removeClass('active');
    $this.addClass('active');
    var url = "/" +school+ "/athlete/" + id;
    // console.log('ajax:url', url);

    // $this.text('Getting...');
    $.ajax(
      {
        url: url,
        type: "GET",
        dataType: 'json',
        error: ajaxError
      }
    ).done(function(data) {
      // $this.text("Viewing");
      // console.log('data gotten', data);

      displayAthlete(data);
    });
    return false;
  }

  // display Athlete in rosters
  function displayAthlete(data) {
    var fName = data.athlete.fullname.split(' ')[0];
    var lName = data.athlete.fullname.split(' ')[1];
    // console.log(fName + lName, '/_imgs/'+data.athlete.school+'/athletes/' + lName + '_' + fName + '.jpeg');

    // change box values per athlete
    // console.log(data.Metrics, data.labels);
    catBoxes(data.Metrics, data.labels);

    $('.aPhoto').attr('src', '/_imgs/' +data.athlete.school.replace(/ /g, '')+ '/' + lName + '_' + fName + '.jpeg');
    $('.name').html(fName + ' <strong>' + lName);
    // $('.LRMDate').text('Latest Recorded Metric - ' + data.date);
    var position = (typeof data.athlete.position === 'undefined') ? '' : data.athlete.position;
    var group = (typeof data.athlete.group === 'undefined') ? '' : data.athlete.group;
    var year = (typeof data.athlete.year === 'undefined') ? '' : data.athlete.year;
    $('.position').html('Position: <strong>' + position + '</strong>');
    $('.group').html('Group: <strong>' + group + '</strong>');
    $('.year').html('Year: <strong>' + year + '</strong>');
    $('.vProfile').attr('href', '/' +data.athlete.school.replace(/ /g, '')+ '/rosters/athlete/' + data.athlete._id);
  }

  // Metric Category Boxes
  function catBoxes(Metrics, labs) {
    // console.log('Metrics', Metrics, 'labs', labs);
    var loadValues = [];
    var loadLabels = [];
    for (var key in Metrics) {
      var obj = Metrics[key][0];
      for (var metric in obj) {
        loadValues.push(obj[metric].val);
        loadLabels.push(labs[metric]);
      }
    }
    // console.log('loadValues', loadValues);
    // console.log('loadLabels', loadLabels);
    $('.catBox').each(function(ind, el) {
      el.getElementsByClassName('metric')[0].textContent = loadValues.shift();
    });
  }

  // AJAX Error
  function ajaxError(jqXHR, status, error) {
    console.log('jqXHR', jqXHR);
    console.log('status', status);
    console.log('error', error);
  }

  // display athlete Biometrics

})(jQuery);