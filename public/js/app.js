// Makes updates to the homepage when it loads
function finishPageLoad(){
	$( ".comments-holder" ).each(function( index ) {
		console.log($(this))
	  var commentArray = $(this).find(".comment-array")[0].innerText.split(",");
	  console.log(commentArray[0].length);
	  var commentHolder = $(this);
	  if (commentArray[0].length > 0){
	  	// Loop within a loop probably not great for performance.... 
	  	for (var i = 0; i < commentArray.length; i++){
	  		console.log("Querying " + commentArray[i]);
	  		$.get("/notes/" + commentArray[i], function(data) {
				console.log(data);
				var displayComment = "<div class='display-comment'><h3>" + data[0].title + "</h3><p>" + data[0].body + "</p><button class='delete-comment-btn' data-article='" + commentHolder.attr('data-article') + "' data-comment='" + data[0]._id + "'>Delete</button></div>";
				commentHolder.append(displayComment);
			});
	  	}
	  }
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
	  			$(this).val("");
	  			return;
	  		};
		});

		$( ".comment-input" ).each(function( index ) {
	  		if ($(this).attr('data-article') === clickedID){
	  			comment = $(this).val();
	  			console.log("Message: " + comment);
	  			$(this).val("");
	  			return;
	  		};
		});

		$.ajax({
		    method: "POST",
		    url: "/articles/" + clickedID,
		    data: {
		      // Value taken from title input
		      title: title,
		      // Value taken from note textarea
		      body: comment
	    	}
	  	})
	    // With that done
	    .done(function(data) {
	      // Log the response
	      console.log(data);
	    });
	});
});