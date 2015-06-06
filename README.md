# Charted for GlobalHack 4

## Endpoints

- /api/chart

	- GET
		Consumes content_id param. Produces the database record object consisting of the heat map object for that content id.
	- POST
		Consumes data for a single user's line draw with content_id and account_id. Add the user's submission to our db, and update the content id's heat map.

- /api/content

	- GET
		Consumes a url encoded JSON object with content_id attribute. Returns the same object returned by app_fetch_content in Lockerdome's api.
	- POST
		Consumes the same object defined in Lockerdome's api for app_create_content minus app_id and app_secret. These will be added by the service. Returns the same object return by Lockerdome's api for this service.
