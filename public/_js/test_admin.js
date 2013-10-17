$(function() {

  $(".edit").editable("http://localhost:3000/school/team/", {
    indicator : 'Saving ...',
    tooltip: 'Click to edit...'
  });
  
  $(".editable_select").editable("http://www.appelsiini.net/projects/jeditable/php/save.php", { 
    indicator : '<img src="http://swapitzone.com/images/indicator.gif">',
    data   : "{'Lorem ipsum':'Lorem ipsum','Ipsum dolor':'Ipsum dolor','Dolor sit':'Dolor sit'}",
    type   : "select",
    submit : "OK",
    style  : "inherit",
    submitdata : function() {
      return {id : 2};
    }
  });

});