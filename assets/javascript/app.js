$(document).ready(function(){

	// Create the default button array and define the buttonStyling
	
	var buttonArray = ["Cats", "Dogs", "Fail", "Golden Girls"];										// Set the original Button Array
	var buttonStyling = "<button class='btn btn-success buttonMargins' data-gif='";					// Set the basic Button Styling
	$("#numberLimit").val(10);																		// Set the default value of the Number Limit to 10;
	
	
	// Function to display the GIF results that were searched for
	
	function displayGIFInfo() {
		var gifSubject = $(this).attr("data-gif");																// For this particular button that was clicked
		var gifRating = $("#ratingLimit").val();																// Get the Rating
		var gifNumber = $("#numberLimit").val();																// Get the Number
		var randomOffset = Math.floor(Math.random() * 1000);													// Create a random offset so you get the same GIFs every time
		var queryURL = "https://api.giphy.com/v1/gifs/search?q=" + gifSubject + "&offset=" + randomOffset		// Set the queryURL for the API with the gifSubject and randomOffset...
			+ "&api_key=9ff99f6b61a7456292e1370adae07000&rating=" + gifRating + "&limit=" + gifNumber;			// and gifRating and with the set limit

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
			aButton.addClass("btn btn-success buttonMargins gifSearch");			// Add the appropriate classes
			aButton.attr("data-gif", buttonArray[i]);								// Add the data-gif attribute
			aButton.text(buttonArray[i]);											// Add the text to the button
			$("#gifButtons").append(aButton);										// Add button to the display
		}
	}



	// Function to manage when a GIF search is added
	
	$("#addGIF").on("click", function(event) {
		event.preventDefault();														// Prevent the Add button from behaving normally

		var newGIF = $("#gifInput").val().trim();									// Get the search term that was added
		var isMatch = false;														// Assume there is no match
		if (newGIF !== "") {														// If the search term isn't blank...
			for (var i = 0; i < buttonArray.length; i++) {							// Then for each message in buttonArray
				if (newGIF.toLowerCase() === buttonArray[i].toLowerCase()) {		// Check to see if there is a match (case insensitive)
					isMatch = true;													// If so, set isMatch to true
				}
			}
			if (!isMatch) {															// Then if the search term isn't already in the array
				buttonArray.push(newGIF);												// Push the new button into the array...
				renderButtons();														// And render the new list.		
			}
		}
	});


	// Function to manage when a GIF search is removed
	
	$("#removeGIF").on("click", function(event) {
		event.preventDefault();														// Prevent the Remove button from behaving normally
		
		var oldGIF = $("#gifInput").val().trim();									// Get the search term to be removed
		var isMatch = false;														// Assume there is no match
		if (oldGIF !== "") {														// If the search term isn't blank...
			for (var i = 0; i < buttonArray.length; i++) {							// Then for each message in button Array
				if (oldGIF.toLowerCase() === buttonArray[i].toLowerCase()) {		// Check to see if there is a match (case insensitive)
					isMatch = true;													// If so, set isMatch to true
				}
			}
			if (isMatch) {															// Then if the search term is in the array
				buttonArray.splice(buttonArray.indexOf(oldGIF), 1);						// Delete the button from the array...
				renderButtons();														// And render the new list
			}
		}
	});

	
	
	// Function to animate and still the GIF
	
	function gifAnimation() {

		var state = $(this).attr("data-state");										// Get the current state

		if (state === "still") {													// If the GIF is currently still
			$(this).attr("data-state", "animate");									// Set the state to animate
			$(this).attr("src", $(this).attr("data-animate"));						// And load the animated GIF
		}
		else {																		// Otherwise
			$(this).attr("data-state", "still");									// Set the state to still
			$(this).attr("src", $(this).attr("data-still"));						// And load the still GIF
		}

	}

	renderButtons();															// Render the buttons at the beginning

	$(document).on("click", ".gifSearch", displayGIFInfo);						// When a search term is clicked, display its results
	$(document).on("click", ".gifPic", gifAnimation);							// When a GIF is clicked, animate it
	  
});