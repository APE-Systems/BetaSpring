(function(e){function t(e){return e.attr("contenteditable")=="true"?!0:!1}function n(e){t(e)?e.attr("contenteditable","false"):e.attr("contenteditable","true")}function r(t,n){e("a.save-team").off("click").on("click",function(){var r=e("#school-name").text(),i=e(this).closest("li").find("h3").text(),s=e(this).closest("li").find("span").text();console.log("school: "+r+"\n team: "+"team"+"\n gender: "+s);e.ajax({url:"/"+r+"/teams/"+t+"-"+n,data:{"edit-team-name":i,"edit-team-gender":s},dataType:"json",type:"put"}).done(function(){console.log("save new team name successful")}).fail(function(e){console.log("save new team name failed")}).always(function(){console.log("end save-team function")});e(this).closest("li").find("h3").attr("contenteditable","false");e(this).closest("li").find(".team-buttons").show();e(this).closest("li").find(".team-edits").hide()})}function i(t,n){e("form#delete-team-form").off("click").on("click",function(r){console.log("delete-team confirmed");e.ajax({url:n,type:"DELETE",dataType:"json"}).done(function(){console.log("delete successful");t.parent().remove()}).fail(function(e){console.log("error:\n",e);alert("error:\n",e)}).always(function(){e("a.close-reveal-modal").trigger("click")})})}e(".team-edits").hide();e("ul#teams-list").on("click","a.edit-team",function(i){var s=e(this);console.log(s);var o=e(this).closest("li").find("h3"),u=o.text();n(o);if(t(o)){var a=e(this).closest("li").find("h3").text(),f=e(this).closest("li").find("span").text();e(this).closest("li").find(".team-buttons").hide();e(this).closest("li").find(".team-edits").show();r(a,f)}});e("a.cancel-team").on("click",function(){document.execCommand("undo");e(this).closest("li").find("h3").attr("contenteditable","false");e(this).closest("li").find(".team-buttons").show();e(this).closest("li").find(".team-edits").hide()});e("a#delete-team").on("click",function(t){console.log("clicked delete");t.preventDefault();var n,r,s,o,u=e(this);console.log(u.closest("li").find("h3").text());n=e("#school-name").text();r=u.closest("li").find("h3").text();s=u.closest("li").find("span").text();o="/"+n+"/teams/"+r+"-"+s;console.log("url:\n",o);e("#deleteModal.reveal-link").trigger("click");i(u,o)});var s=e("#teams-list h3").map(function(){return e(this).text()}).get(),o=e("#school-name").text();e("#create-team-submit").on("click",function(t){console.log("clicked from "+this);var n,r,i,u;n=e(this);r=e("#team-name").val();i=e("#team-gender").val();u="/"+o+"/teams/"+r+"-"+i;console.log("teamsArray:"+s);console.log(e.inArray(r,s));e.ajax({url:u,type:"POST",contentType:"application/x-www-form-urlencoded; charset=UTF-8",dataType:"json"}).done(function(t){console.log("data saved: "+t);window.location.reload();e("a.close-reveal-modal").trigger("click")}).fail(function(e){console.log("failure: "+e);console.dir(e)}).always(function(){});t.preventDefault()})})(jQuery);