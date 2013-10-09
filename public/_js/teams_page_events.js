$(function() {


    $('.team-edits').hide();

    $('ul#teams-list').on('click', 'a.edit-team', function(event) {
      var self = $(this);
      console.log(self);
      var team = $(this).closest('li').find('h3');
      var teamName = team.text();

      toggleContentEditable(team);

      if (contentIsEditable(team)) {
        //hide edit,trash
        //show save, cancel
        $(this).closest('li').find('.team-buttons').hide();
        $(this).closest('li').find('.team-edits').show();
      }
      //if contenteditable
         //show icons for save cancel
        // event.preventDefault();

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


    $('a.save-team').on('click', function() {
      //ajax call
      ///:school/:team-:gender
      var school = $("#school-name").text();
      var team = $(this).closest('li').find('h3').text();
      var gender = $(this).closest('li').find('span').text();
      console.log('school: ' + school + '\n team: ' + 'team' + '\n gender: ' + gender)
      $.ajax({
        url: '/',
        data: data,
        type: 'post'
      });

      $(this).closest('li').find('h3').attr('contenteditable', 'false');
      $(this).closest('li').find('.team-buttons').show();
      $(this).closest('li').find('.team-edits').hide();
    });


  // DeleteTeam
  $('a#delete-team').on('click', function(event) {
    console.log('clicked delete');
    event.preventDefault();

    var school, team, gender, url;

    var self = $(this);
    console.log(self.closest('li').find('h3').text());

    school = $("#school-name").text();
    team = self.closest('li').find('h3').text();
    gender = self.closest('li').find('span').text();
    url = '/' + school + '/' + team + '-' + gender;
    console.log('url:\n', url);

    //REVEAL MODAL
    $('#deleteModal.reveal-link').trigger('click');

    doesThisWork(self, url);
  });//DELETE TEAM END

  function doesThisWork(self, url) {
    // console.log(self, url);

    //EVENT LISTENER ON YES
    $('form#delete-team-form').off('click').on('click', function(event) {
      // event.preventDefault();
      console.log('delete-team confirmed');
      $.ajax({
        url: url,
        type: "DELETE",
        dataType: "json"
      })
      .done(function() {
          console.log('delete successful');
          self.parent().remove();
      })
      .fail(function(err) {
        console.log('error:\n', err);
        alert('error:\n', err);
      })
      .always(function() {
        $('a.close-reveal-modal').trigger('click');
      });

    });//DELETE CONFIRM END
  }


  var teamsArray = $('#teams-list h3').map(function() {
    return $(this).text();
  }).get();
  var school = $('#school-name').text();

  $('#create-team-submit').on("click", function(event) {
    console.log("clicked from " + this );

    var self, school, name, gender, url;
    self = $(this);
    school = $('#school-name').text();
    name = $('#team-name').val();
    gender = $('#team-gender').val();
    url = '/'+ school + '/teams/' + name + '-' + gender;

    console.log("teamsArray:" + teamsArray);
    console.log($.inArray(teamName, teamsArray));

    //- if ( $.inArray(teamName,teamsArray) === -1)  {
      console.log('sending PUT ajax', url);

      $.ajax({
        //- url: '/'+ school + '/' + teamName + '/' + teamGender,
        url: url,
        type: 'POST',
        contentType: "application/x-www-form-urlencoded; charset=UTF-8",
        dataType: 'json'
      }).done(function(data) {
        console.log("data saved: " + data);
        $("#teams-list").append("<li><h3 class='capitalize'>" + data.name + "</h3><span class='capitalize'>" + data.gender + "</span></li>");
        //location.reload();  
      }).fail(function(data) {
        console.log("failure: " + data);
        console.dir(data);
      }).always(function() {
        $('a.close-reveal-modal').trigger('click');     
      }); // ajax

    //- } else {
    //-   alert("Name already exists in database");
    //-   $('a.close-reveal-modal').trigger('click');
    //- }
    event.preventDefault();
  }); // create form on subsmit



});
