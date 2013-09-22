(function( $, undefined) {
  console.log("createTeams.js has been successfully loaded");

  $(document).ready(init);
    function init() {
      registerEventListeners();
      console.log("event listeners registered for createTeams page");
    }

    function registerEventListeners() {
      $('#create-team-form').on("submit", submitTeam(event))
    }

    function submitTeam(event) {
      event.preventDefault();
      console.log("event.preventDefault ran ");
      console.log("this = " + $(this));
      var $this = $('#create-team-form');
      console.dir($this);

      $.ajax({
        url: '/to-be-determined',
        type: 'POST',
        contentType: 'application/json: charset=utf-8',
        dataType: 'json',
      }).fail(function(msg) {
        console.log("failure:");
        console.dir(msg);
      }).done(function(msg) {
        console.log("data saved: " + msg);
      }).always(function() {
        $('a.close-reveal-modal').trigger('click');
      }); // ajax
    } // create form on submit

})(jQuery);

