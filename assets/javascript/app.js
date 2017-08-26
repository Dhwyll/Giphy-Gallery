// Create an array of pre-defined buttons
// Push that array to the page
// Allow the user to add a new button
// When a button is clicked, clear the display area and add the top 10 gifs from Giphy for that category
// when a GIF is clicked, animate it and when clicked again, still it



$(document).ready(function(){

	// Create the default button array and push to gifButtons
	
	var buttonArray = ["Cats", "Dogs", "Fails", "Golden Girls"];
	var buttonStyling = "<button class='btn btn-success margin-left' data-gif='";
	for (var i = 0; i < buttonArray.length; i++) {
		$("#gifButtons").append(buttonStyling + buttonArray[i] + "'>" + buttonArray[i] + "</button>");
	}
	
	
	// Function to display the GIF results that were searched for
	
	function displayGIFInfo() {
		var gifSubject = $(this).attr("data-gif");																							// For this particular button that was clicked
		var queryURL = "https://api.giphy.com/v1/gifs/search?q=" + gifSubject + "&api_key=9ff99f6b61a7456292e1370adae07000&limit=10";		// Set the queryURL for the API with a limit of 10

		$.ajax({
			url: queryURL,
			method: "GET"
		})
		.done(function(response) {
			$("#gifDisplayArea").empty();												// Empty the GIF Display Area of any previous searches
			var results = response.data;												// Set a var to make references easier to the response inforation
			console.log(results)

			for (var i = 0; i < results.length; i++) {									// For each item in the results array
				var gifDiv = $("<div>");												// Set the beginning of the DIV
				gifDiv.addClass("item");

				var rating = results[i].rating;											// Get the Rating property from the results

				var pRating = $("<p>").text("Rating: " + rating);						// Set the paragraph that will hold the Rating

				var gifImage = $("<img>");												// Begin the gifImage variable to be pushed later
				gifImage.addClass("gifPic");
				gifImage.attr("src", results[i].images.fixed_height_still.url);			// Add the source of the still image for the fixed height
				gifImage.attr("data-state", "still");									// Set the animation state to still
				gifImage.attr("data-still", results[i].images.fixed_height_still.url);	// Set the data-still URL
				gifImage.attr("data-animate", results[i].images.fixed_height.url);		// Set the data-animate URL

				gifDiv.append(pRating);													// Add the Rating to the GIF DIV
				gifDiv.append(gifImage);												// Add the GIF Image to the GIF DIV

				$("#gifDisplayArea").append(gifDiv);									// Push the new image package to the GIF Display Area
			}
		});
	}


	// Function to get the button array set up correctly

	function renderButtons() {
		$("#gifButtons").empty();													// Empty the GIF Buttons area since we don't want duplicates

		for (var i = 0; i < buttonArray.length; i++) {								// For each item in the Button Array
			var aButton = $("<button>");											// Create a new button
			aButton.addClass("btn btn-success margin-left gifSearch");				// Add the appropriate classes
			aButton.attr("data-gif", buttonArray[i]);								// Add the data-gif attribute
			aButton.text(buttonArray[i]);											// Add the text to the button
			$("#gifButtons").append(aButton);										// Add button to the display
		}
	}


	// Function to manage when a GIF search is added
	
	$("#addGIF").on("click", function(event) {
		event.preventDefault();														// Prevent the Submit button from behaving normally

		var newGIF = $("#gifInput").val().trim();									// Get the search term that was added
		if (newGIF !== "") {														// If the search term isn't blank...
			buttonArray.push(newGIF);												// Push the new button into the array...
			renderButtons();														// And render the new list.		
		}
	});
	
	
	// Function to animate and still the GIF
	
	function gifAnimation() {

		var state = $(this).attr("data-state");

		if (state === "still") {
			$(this).attr("data-state", "animate");
			$(this).attr("src", $(this).attr("data-animate"));
		}
		else {
			$(this).attr("data-state", "animate");
			$(this).attr("src", $(this).attr("data-still"));
		}

	}

	renderButtons();																// Render the buttons at the beginning

	$(document).on("click", ".gifSearch", displayGIFInfo);							// When a GIF Item is clicked, display its results
	$(document).on("click tap", ".gifPic", gifAnimation);
	  
});