// Makes updates to the homepage when it loads
function finishPageLoad(){
	$( ".article-element" ).each(function( index ) {
	  
	});
};

$( document ).ready(function() {
    $( "#scrape-btn" ).click(function() {
		$.get("/scrape", function(data) {
			console.log(data);
		});
	});
});