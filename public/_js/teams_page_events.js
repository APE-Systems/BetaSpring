(function ($) {


  $('.team-edits').hide();

  $('ul#teams-list').on('click', 'a.edit-team', function (event) {
    var self = $(this);
    console.log(self);
    var team = $(this).closest('li').find('h3');
    var teamName = team.text();

    toggleContentEditable(team);

    if (contentIsEditable(team)) {

      var oldTeam = $(this).closest('li').find('h3').text();
      var oldGender = $(this).closest('li').find('span').text();

      $(this).closest('li').find('.team-buttons').hide();
      $(this).closest('li').find('.team-edits').show();

      propagateEdit(oldTeam, oldGender);
    }
  });


  function contentIsEditable(el) {
    if (el.attr('contenteditable') == 'true') {
      return true;
    }
      return false;
  }

  function toggleContentEditable(el) {
    if (contentIsEditable(el)) {
      el.attr('contenteditable', 'false');
    } else {
      el.attr('contenteditable', 'true');
    }
  }

  $('a.cancel-team').on('click', function() {
    document.execCommand('undo');
    $(this).closest('li').find('h3').attr('contenteditable', 'false');
    $(this).closest('li').find('.team-buttons').show();
    $(this).closest('li').find('.team-edits').hide();
  });

  function propagateEdit(oldTeam, oldGender) {

    $('a.save-team').off('click').on('click', function() {

    var school = $("#school-name").text();
    var team = $(this).closest('li').find('h3').text();
    var gender = $(this).closest('li').find('span').text();
    console.log('school: ' + school + '\n team: ' + 'team' + '\n gender: ' + gender)
    $.ajax({
      url: '/' + school + '/teams/' + oldTeam + '-' + oldGender,
      data: {"edit-team-name" : team, "edit-team-gender" : gender},
      dataType: 'json',
      type: 'put'
    })
    .done(function() {
        console.log('save new team name successful');
    })
      .fail(function(err) {
        console.log('save new team name failed');
    })
      .always(function() {
        console.log('end save-team function');
    });

    $(this).closest('li').find('h3').attr('contenteditable', 'false');
    $(this).closest('li').find('.team-buttons').show();
    $(this).closest('li').find('.team-edits').hide();
  });
  }



  //* DELETE TEAM EVENT LISTENER ************ /

  $('a#delete-team').on('click', function(event) {
    console.log('clicked delete');
    event.preventDefault();

    var school, team, gender, url;

    var self = $(this);
    console.log(self.closest('li').find('h3').text());

    school = $("#school-name").text();
    team = self.closest('li').find('h3').text();
    gender = self.closest('li').find('span').text();
    url = '/' + school + '/teams/' + team + '-' + gender;
    console.log('url:\n', url);

    
    $('#deleteModal.reveal-link').trigger('click');

    doesThisWork(self, url);
  });//DELETE TEAM END

  function doesThisWork (self, url) {

    //EVENT LISTENER ON YES
    $('form#delete-team-form').off('click').on('click', function (event) {
      // event.preventDefault();
      console.log('delete-team confirmed');
      $.ajax({
        url: url,
        type: "DELETE",
        dataType: "json"
      })
      .done(function () {
        console.log('delete successful');
        self.parent().remove();
      })
<<<<<<< HEAD
      .fail(function(err) {

=======
      .fail(function (err) {
        console.log('error:\n', err);
        alert('error:\n', err);
>>>>>>> a554f0604e387616e23168d93c87a2e90aff1295
      })
      .always(function () {
        $('a.close-reveal-modal').trigger('click');
      });

    });//DELETE CONFIRM END
  }

  /* Lists teams on page to check against before creating new team */
  var teamsArray = $('#teams-list h3').map(function () {
    return $(this).text();
  }).get();

  var school = $('#school-name').text();

  $('#create-team-submit').on("click", function (event) {
    console.log("clicked from " + this);

    var self, name, gender, url;
    self = $(this);
    name = $('#team-name').val();
    gender = $('#team-gender').val();
    url = '/' + school + '/teams/' + name + '-' + gender;

    console.log("teamsArray:" + teamsArray);
    console.log($.inArray(name, teamsArray));

    $.ajax({
      url: url,
      type: 'POST',
      contentType: "application/x-www-form-urlencoded; charset=UTF-8",
      dataType: 'json'

    }).done(function (data) {
      console.log("data saved: " + data);
<<<<<<< HEAD
      window.location.reload()
      //$("#teams-list").append("<li><h3 class='capitalize'>" + 
      //  data.name + "</h3><span class='capitalize'>" + 
      //  data.gender + "</span></li>");
=======
      $("#teams-list").append("<li><h3 class='capitalize'>" +
        data.name + "</h3><span class='capitalize'>" +
        data.gender + "</span></li>");
>>>>>>> a554f0604e387616e23168d93c87a2e90aff1295
      $('a.close-reveal-modal').trigger('click');

    }).fail(function (data) {
      console.log("failure: " + data);
      console.dir(data);

    }).always(function () {

    }); // ajax
    event.preventDefault();
  }); // create form on subsmit

})(jQuery);
