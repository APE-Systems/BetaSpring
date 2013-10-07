$(function() {

   var editMode = false;  
  //  Edit Team Mode
  $('.foundicon-edit').on("click", function(event) {
    var teamName = $(this).closest('li').find('h3');
    if (teamName.attr("contenteditable")) {
      teamName.attr("contenteditable", "false");
      console.log("was true, now it's false");
      $(this).removeClass('white');
      editMode = false;
      console.log(editMode);
    } else {
      teamName.attr("contenteditable", "true");
      console.log("was false, now it's true");
      $(this).addClass('white');
      editMode = true;
      console.log(editMode);
    }

    // display_OK_Cancel_Buttons($(this));

  });

  $(document).keydown(function(event) { 

   });
  // document.addEventListener('keydown', function (event) {
  //-  
  //   var esc = event.which == 27,
  //       nl = event.which == 13,
  //       el = event.target,
  //       input = el.nodeName != 'INPUT' && el.nodeName != 'TEXTAREA',
  //       data = {};

  //   if (input && editMode) {
  //     console.log('user pressed a key');
  //     if (esc) {
  //       console.log('user hit the ESC key');
  //       $(this).
  //       $('.foundicon-edit').trigger("click");
  //     } else if (nl) {
  //       console.log('user hit enter');
  //       editMode = false;
  //     }
  //   }
  //   event.preventDefault();


  // });

  //- EDIT TEAM FUNCTION BELOW
  //var editMode = false;
  //$('.edit-team').on("click", function(event) {
  //  $(this).find('.foundicon-edit').addClass('white');
  //  var teamName = $(this).closest('li').find('h3');
  //  editMode = true;
  //  $(teamName).attr("contenteditable", "true");
  //  console.log(editMode);
  //});  


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
