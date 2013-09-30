(jQuery, document);
(function() {

  CS.Observers.SidebarObserver = (function() {

    function SidebarObserver(settings) {
      this.settings = settings;
      _.bindAll(this, 'toggleSidebar', 'first', 'deactivateExercise');
      CS.on('sidebar:toggled', this.toggleSidebar);
      CS.on('exercise:first', this.first);
      CS.on('exercise:activate:before', this.deactivateExercise);
      CS.on('exercise:activate:after', this.activateExercise);
    }

    SidebarObserver.prototype.first = function() {
      this.activateExercise(null, this.settings.currentExercise().exercise());
      $('.sidebar-levels li').filter(function() {
        return $(this).data("completed");
      }).addClass('inactive');
      return $('#sidebar').addClass(this.defaultClass()).data('active', this.defaultClass());
    };

    SidebarObserver.prototype.deactivateExercise = function(from, to) {
      return $(".exercise-" + from.cid).removeClass('active').addClass('inactive');
    };

    SidebarObserver.prototype.activateExercise = function(from, to) {
      return $(".exercise-" + to.cid).addClass('active');
    };

    SidebarObserver.prototype.toggleSidebar = function(el, sidebar) {
      var bodyClass, currentActive, requestedSidebar;
      requestedSidebar = "sidebar-" + ($(el).data('name'));
      $('.sidebar-toggle').removeClass('active');
      $(el).addClass('active');
      if (!$('body').hasClass('is-expanded')) {
        $('body').addClass('is-expanded');
        if (currentActive = $(sidebar).data('active')) {
          $(sidebar).removeClass(currentActive);
        }
        $(sidebar).addClass(requestedSidebar).data('active', requestedSidebar);
        bodyClass = 'is-expanded';
      } else {
        if ($(sidebar).hasClass(requestedSidebar)) {
          $(sidebar).removeClass(requestedSidebar).addClass(this.defaultClass()).data('active', this.defaultClass());
          $('body').removeClass('is-expanded');
        } else {
          if (currentActive = $(sidebar).data('active')) {
            $(sidebar).removeClass(currentActive);
          }
          $(sidebar).addClass(requestedSidebar).data('active', requestedSidebar);
        }
      }
      bodyClass = $('body').hasClass('is-expanded') ? 'is-expanded' : '';
      return $.cookie('bodyClass', bodyClass, {
        path: '/'
      });
    };

    SidebarObserver.prototype.showGlossary = function() {
      if ($("#sidebar.sidebar-glossary").length === 0) {
        return this.toggleSidebar($("#sidebar a.sidebar-toggle-glossary"), $("#sidebar"));
      }
    };

    SidebarObserver.prototype.defaultClass = function() {
      return "sidebar-navigation";
    };

    return SidebarObserver;

  })();