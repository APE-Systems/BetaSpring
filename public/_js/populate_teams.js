<script>
maleList = document.getElementById('male');
femaleList = document.getElementById('female');
for (i = 0; i < teamsPage.apeLibrary.teams.length; i++) {
  if (teamsPage.apeLibrary.teams[i].gender === 'male') {
     $('#male').append('<li>' + teamsPage.apeLibrary.teams[i].name + '</li>');
  }  else {
     $('#female').append('<li>' + teamsPage.apeLibrary.teams[i].name + '</li>');
  }
}

$('#show-male').click(function(){
  $('.female-teams').hide();
  $('.male-teams').show();
});

$('#show-female').click(function(){
  $('.female-teams').show();
  $('.male-teams').hide();
});

$('#show-all').click(function(){
  $('.female-teams').show();
  $('.male-teams').show();
});

</script>