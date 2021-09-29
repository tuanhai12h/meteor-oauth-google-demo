// Enter the API Discovery Docs that describes the APIs you want to
// access. In this example, we are accessing the People API, so we load
// Discovery Doc found here: https://developers.google.com/people/api/rest/
// Array of API discovery doc URLs for APIs used by the quickstart
googleDiscoveryDocs = [	
	// "https://people.googleapis.com/$discovery/rest?version=v1", 
];

// Enter one or more authorization scopes. Refer to the documentation for
// the API or https://developers.google.com/people/v1/how-tos/authorizing for details.
googleScopes = 'profile email';
// Authorization scopes required by the API; multiple scopes can be included, separated by spaces.

// Main method
connectGoogleAPI = function(options, callback)
{
	if (isGoogleAPI())
	{
		signInGoogleAuth2(options, callback);

		return;
	}

	loadExternalScript('https://apis.google.com/js/api.js', function()
	{
		// load auth2 is default in client type connect data with google API
		gapi.load('client:auth2', function() 
		{
			initGoogleAPI(options,callback);
		});

	}, {'defer': true, 'async': true});
};

initGoogleAPI = function(options, callback)
{
	if (!isGoogleAPI())
	{
		throw new Meteor.Error("Could not find Google authenticator");
	}

	if (debugGoogleAPI) console.log("init google api");

	gapi.client.init({
		apiKey: googleAPI.apiKey,
		discoveryDocs: googleDiscoveryDocs,
		clientId: googleAPI.clientId,
		scope: googleScopes
	}).then(function(result)
	{
		// call login sign in after init
		if (debugGoogleAPI) console.log("init google complete");

		signInGoogleAuth2(options, callback);

	}, function(error)
	{
		// console.log(error);
		callback(error.details, null);
		// throw new Meteor.Error("Could not initialize Google authenticator: " + error.toString());
	});
};

signInGoogleAuth2 = function(options, callback)
{
	if (!isGoogleAPI())
	{
		if (callback)
		{
			callback("Could not load Google authenticator.", null);
		}
		else
		{
			throw new Meteor.Error("Could not load Google authenticator");
		}
	}

	if (debugGoogleAPI) console.log("calling google signin");

	if (gapi && gapi.auth2)
	{
		gapi.auth2.getAuthInstance().signIn({
			prompt: 'select_account'
		}).then(
			function(result)
			{
				var token = getGoogleToken();
				if (debugGoogleAPI) console.log("The token of the Google sign-in is: %o", token);

				if (token && token.access_token)
				{
					callback(null, token);
				}
				else
				{
					callback("Could not retrieve Google sign-in token. Try flushing your browser's cache.", null);
				}
			},
			function(error)
			{
				// console.log("error %o", error);
				if (error.error == "popup_blocked_by_browser" && !options.importedClassroom)
				{
					signInGoogleRedirect(options);
					
					return;
				}
				
				// console.log("navigator.cookieEnabled %o", navigator.cookieEnabled);
				if (error.error === "popup_closed_by_user")
				{
					return;
				}
				

				{
					if (error.error)
					{
						error = error.error;		//  make the error code printable
					}

					if (callback)
					{
						callback(error, null);
					}
					else
					{
						throw new Meteor.Error(JSON.stringify(error));
					}
				}
			});
	}
	else
	{
		if (callback)
		{
			callback("Could not call Google authenticator.", null);
		}
		else
		{
			throw new Meteor.Error("Could not call Google authenticator");
		}
	}
};

logoutGoogleAuth2 = function(callback)
{
	if (isGoogleAPI())
	{
		if (gapi && gapi.auth2)
		{
			if (debugGoogleAPI) console.log("sign out google account");
			
			// What the user really means is to "disconnect" the credentials... not just sign out of the account

			if (getGoogleToken())
			{
				gapi.auth2.getAuthInstance().signOut().then(
					function(result)
					{
						// console.log(result);
						callback(null, result);
					},
					function(error)
					{
						// console.log(error);
						// callback(error, null);
					}
				);
			}
			else 
			{
				callback(null, null);
			}
	
			// signOut session and clear the current access token
			// gapi.auth2.getAuthInstance().signOut().then(callback);
		}
	}
	else
	{
		callback("Google API NOT initialized", null);
	}
};

// make way to get userinfo same the server side data
getGoogleInfo = function(callback)
{
	if (!isGoogleAPI())
		return;

	if (debugGoogleAPI) console.log("get google info");

	var token = getGoogleToken();
	if (debugGoogleAPI) console.log("The token of the Google sign-in is: %o", token);

	if (token && token.access_token)
	{
		HTTP.call('GET', 'https://www.googleapis.com/oauth2/v1/userinfo', {
			params: {
				alt: 'json',
                access_token: token.access_token
			}
		}, function(error, result)
		{
			// console.log(error, result);
			if (result && result.data)
			{
				callback(result.data);
			}
			else
			{
				throw new Meteor.Error("Could not get Google information." + JSON.stringify(error));
			}
		});
	}

	return;
};

getGoogleToken = function()
{
	if (!isGoogleAPI())
		return;

	if (debugGoogleAPI) console.log("get google token");	

	// init the null token support for return data
	var token = null;

	// the current way to get token data
	if (gapi && gapi.client)
	{
		token = gapi.client.getToken();
	}

	// try catch the second way to get data return
	if ((!token || !token.access_token) && gapi && gapi.auth2)
	{
		token = gapi.auth2.getAuthInstance().currentUser.get().getAuthResponse();
	}

	if (debugGoogleAPI) console.log("The token of the Google sign-in is: %o", token);

	return token;
};

isGoogleAPI = function()
{
	if (typeof gapi != 'undefined')
	{
		return true;
	}

	return false;
};