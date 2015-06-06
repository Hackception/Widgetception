# Endpoints

- /chart/:content_id
	- GET
		Return the html page containing the blank, ready-to-be-filled out graph. This is the main page of the app. It is where the user draws their guess for the graph. It needs to have the axis labels and title, as well as logic for how to POST the user's drawn line to our server. It should also have the correct answer, to be displayed after the user guesses, and the heatmap data (same purpose).
	- POST with data for a single user's line draw.
		Add the user's submission to our db, and push it on to the lockerdome API.
- /wizard
	- GET
		This is the form where a content creator can define the metadata for a chart. The metadata required will be:
			- Headline
			- subheader, optional
			- x-axis label
			- y-axis label
			- x-domain (min and max)
			- y-domain (min and max)
			- (maybe more later?)
	- POST
		Make a new chart using the metadata above. Store this in the db so we don't have to do an extra query?
