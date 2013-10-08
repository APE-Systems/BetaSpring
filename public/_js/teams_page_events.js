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
         event.preventDefault();

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
        console.log('contenteditable for' + el.text() + ' is false');
      } else {
        el.attr('contenteditable', 'true');
        console.log('contenteditable for' + el.text() + ' is true');
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
  $('a#delete-team').off('click').on('click', function(event) {
    console.log('clicked delete');
    event.preventDefault();


    var school, team, gender, url;

    var self = $(this);
    school = $("#school-name").text();
    team = self.parent().children('h3').text();
    gender = self.parent().children('span').text();
    url = '/' + school + '/' + team + '-' + gender;
    console.log('url:\n', url);

    //REVEAL MODAL
    $('#deleteModal.reveal-link').trigger('click');

    doesThisWork(self, url);
  });//DELETE TEAM END

  function doesThisWork(self, url) {
    // console.log(self, url);

    //EVENT LISTENER ON YES
    $('form#delete-team-form').on('click', function(event) {
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

    $('form#delete-team-form').off('click')
    });//DELETE CONFIRM END
  }
});
