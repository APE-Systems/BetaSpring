$(function() {

  //  var editMode = false;  
  // //  Edit Team Mode
  // $('.foundicon-edit').on("click", function(event) {
  //   var teamName = $(this).closest('li').find('h3');
  //   if (teamName.attr("contenteditable") == 'true') {
  //     teamName.attr("contenteditable", "false");
  //     console.log("was true, now it's false");
  //     $(this).removeClass('white');
  //     editMode = false;
  //     console.log(editMode);
  //   } else {
  //     teamName.attr("contenteditable", "true");
  //     console.log("was false, now it's true");
  //     $(this).addClass('white');
  //     editMode = true;
  //     console.log(editMode);
  //   }
    $('.team-edits').hide();

    $('ul#teams-list').on('click', 'a.edit-team', function(event) {
      var self = $(this);
      console.log(self);
      var team = $(this).closest('li').find('h3');
      var teamName = team.text();

      toggleContentEditable(team);

      if (contentIsEditable(team)) {
        $(this).closest('li').find('.team-buttons').hide();
        $(this).closest('li').find('.team-edits').show();

        //hide edit,trash
        //show save, cancel
      } else {
        alert ('nope, content is not editable');
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
  $('.foundicon-trash').on("click", function(event) {
      console.log('clicked the trash can, invoked delete method');
      if (window.confirm("Are you sure you want to delete this team?")) {
        console.log("user selected yes!");
        //- ajax call to delete ROUTE
      } else {
        console.log("user cancelled delete team action");
      }

  });

});