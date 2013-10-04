$(function() {

   var editMode = false;  
  //  Edit Team Mode
  $('.foundicon-edit').on("click", function(event) {
    var teamName = $(this).closest('li').find('h3');
    if (teamName.attr("contenteditable") == 'true') {
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

  });

  document.addEventListener('keydown', function (event) {
    var esc = event.which == 27,
        nl = event.which == 13,
        el = event.target,
        input = el.nodeName != 'INPUT' && el.nodeName != 'TEXTAREA',
        data = {};

    if (input && editMode) {
      console.log('user pressed a key');
      if (esc) {
        console.log('user hit the ESC key');
        $('.foundicon-edit').trigger("click");
      } else if (nl) {
        console.log('user hit enter');
        editMode = false;
      }
    }
    event.preventDefault();


  });

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