// Dropdowns
var team = $('#team');
var category = $('#category');
var metric = $('#metric');

// console.log('team', team.val());
// console.log('category', category.val());
// console.log('metric', metric.val());

// Category dropdown effects
function populateMetrics(category) {
  // console.log('category change', category);
  $.ajax({
    url: '/categories/' + category + '/metrics',
    type: 'GET',
    dataType: 'json',
    success: function(data) {
      // console.log('category change success');
      metric.empty();
      var custDrop = $('#metrics').find('.custom');
      custDrop.empty();
      var current = $('<a href="#" class="current"></a>');
      var selector = $('<a href="#" class="selector"></a>');
      for (var key in data.metricLabels) {
        current.text(data.metricLabels[key]);
        break;
      }
      custDrop.append(current);
      custDrop.append(selector);
      var options = '';
      var ul = $('<ul></ul>');
      var li = '';
      for (var key in data.metricLabels) {
        options += '<option value=' + key + '>' + data.metricLabels[key] + '</option>';
        li += '<li>' + data.metricLabels[key] + '</li>';
      }
      ul.append(li);
      custDrop.append(ul);
      metric.append(options);
      populateLastMetric(metric.val());
    }
  });
}
category.change(function() {
  populateMetrics(category.val());
});

// Last metrics
metric.change(function() {
  // console.log('metric change');
  populateLastMetric(metric.val());
});

function populateLastMetric(metric) {
  // console.log('populate last metric', metric);
  $.ajax({
    url: '/teams/' + team.val() + '/metrics/latest',
    type: 'GET',
    dataType: 'json',
    data: {
      category: category.val(),
      metric: metric
    },
    success: function(data) {
      // console.log('populate last metric success');
      $.each(data.metrics, function(key, value) {
        var span = $('.' + key).find('.last-metric span');
        span.html(value);
        span.attr('id', '');
      });
    }
  });
}

// Add new metric value
$('.submit').click(function() {
  // console.log('entered new data');
  var self = $(this);
  var container = self.closest('.athlete');
  var id = container.data('id');
  var value = container.find('input').val();
  var measured = container.find('.measured');
  var mL = measured.length;
  if (mL > 2) {
    // console.log('measured[mL-3]', measured[mL-3]);
    measured[mL-3].setAttribute('style', 'display:none');
  }
  container.find('.input').append('<span class=measured></span>');
  container.find('.measured:last').html(value);


  container.find('.confirm').val('');
  // console.log('input value', value);
  $.ajax({
    url: '/athletes/' + id + '/metrics',
    type: 'POST',
    dataType: 'json',
    data: {
      category: category.val(),
      metric: metric.val(),
      value: value
    },
    success: function(data) {
      // console.log('update:success', data);
      container.find('.edit').hide(function() {
        // TODO: Update athlete chart
        var measuredLast = container.find('.measured:last');
        measuredLast.attr('data-id', data.update._id);
        container.find('.complete').show();
      });
    }
  });
});


// Remove last added metric value
$('.remove').click(function() {
  // console.log('remove:start');
  var self = $(this);
  var container = self.closest('.athlete');
  var id = container.data('id');
  var dataId = container.find('.measured:last').data('id');
  $.ajax({
    url: '/athletes/' + id + '/metrics/latest',
    type: 'DELETE',
    dataType: 'json',
    data: {
      category: category.val(),
      metric: metric.val(),
      dataId: dataId
    },
    success: function(data) {
      // console.log('remove:success');
      // $('.' + id).find('.last-metric span').html(data.value);
      var mlBefore = container.find('.measured').length;
      var lastMeasured = container.find('.measured:last');
      lastMeasured.remove();
      var mlAfter = container.find('.measured').length;
      if (mlAfter === 0) {
        container.find('.complete').hide(function() {
          container.find('.edit').show();
        });
      } else {
        if (mlBefore > 3) {
          var lastHidden = container.find('.measured')[mlBefore-4];
          lastHidden.setAttribute('style', '');
        }
      }
    }
  });
});

// Reset athlete container
$('.new').click(function() {
  var self = $(this);
  var container = self.closest('.athlete');
  container.find('.complete').hide(function() {
    container.find('.edit').show();
  });
});
