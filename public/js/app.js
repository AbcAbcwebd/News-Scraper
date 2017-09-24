// Makes updates to the homepage when it loads
function finishPageLoad(){
	$( ".article-element" ).each(function( index ) {
	  
	});
};

$( document ).ready(function() {
    $( "#scrape-btn" ).click(function() {
		$.get("/scrape", function(data) {
			console.log(data);
			location.reload();
		});
	});

	$( ".comment-submit-btn" ).click(function() {
		var clickedID = $(this).attr('data-article');
		console.log(clickedID);
		var title;
		var comment;

		// Finding the right info
		$( ".title-input" ).each(function( index ) {
	  		if ($(this).attr('data-article') === clickedID){
	  			title = $(this).val();
	  			console.log("Title: " + title);
	  			return;
	  		};
		});

		$( ".comment-input" ).each(function( index ) {
	  		if ($(this).attr('data-article') === clickedID){
	  			comment = $(this).val();
	  			console.log("Message: " + comment);
	  			return;
	  		};
		});
/*
		$.ajax({
		    method: "POST",
		    url: "/articles/" + clickedID,
		    data: {
		      // Value taken from title input
		      title: $("#titleinput").val(),
		      // Value taken from note textarea
		      body: $("#bodyinput").val()
	    }
	  })
	    // With that done
	    .done(function(data) {
	      // Log the response
	      console.log(data);
	      // Empty the notes section
	      $("#notes").empty();
	    });

	  // Also, remove the values entered in the input and textarea for note entry
	  $("#titleinput").val("");
	  $("#bodyinput").val(""); */
		});
});