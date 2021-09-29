Accounts.registerLoginHandler(function (loginRequest) 
{
    // Google login
    if (loginRequest.googleResponse)
    {
        var googleResponse = loginRequest.googleResponse;

        // update id token
        var idToken = googleResponse.id_token; // the id token had been disable on the cordova apps

        // update access token in cordova and web browser
        var accessToken = googleResponse.accessToken || googleResponse.access_token;

        var googleIdentity = getIdentityGoogle(accessToken);
        // console.log(googleIdentity);

        let serviceData = {
            accessToken: accessToken,
            idToken: idToken
        };
    
        let fields = _.pick(googleIdentity, ['id', 'email', 'name', 'picture', 'link', 'verified_email']);
        _.extend(serviceData, fields);

        // update more profile data default of teacher
        var options = {
                profile: {
                    nickname: googleIdentity.name,
                    picture: googleIdentity.picture
                }
            };
        
        return Accounts.updateOrCreateUserFromExternalService('google', serviceData, options);
    }

    throw new Meteor.Error("You can't connect Boom account via invalid data.");
});

Meteor.methods(
{ 
    'getGoogleAccessToken': function(params)
    {
        var code        = params.code;
        var clientId    = params.clientId;
        var redirect_uri = params.redirect_uri;

        var urlRequest = 'https://www.googleapis.com/oauth2/v4/token';
        try {       

            return HTTP.call('POST', urlRequest, {
                data:  {                
                    code: code,
                    client_id: clientId,
                    client_secret: Meteor.settings.GOOGLE_SECRET_KEY,
                    redirect_uri: redirect_uri,
                    grant_type: 'authorization_code'     
                },        
                headers: {
                    "Content-Type": "application/json",
                }  
            }).data;

        } catch (err) {
            throw new Meteor.Error("Failed to fetch identity from Google: " + err.message);
            // throw _.extend(new Error("Failed to fetch identity from google. " + err.message),
            //     { response: err.response });
        }
    }
});

// update new get Identity Google data at Sep 21, 2018
getIdentityGoogle = function(accessToken)
{
    if (!accessToken)
    {
        throw new Meteor.Error("Failed to get Google data.");
    }

    // new url update Sep 21, 2018
    var urlRequest = 'https://www.googleapis.com/oauth2/v1/userinfo';
    try {
        return HTTP.call('GET', urlRequest, {
            params: { 
                alt: 'json',
                access_token: accessToken 
            }
        }).data;
    } 
    catch (err) 
    {
        throw new Meteor.Error("Failed to fetch identity from Google: " + err.message);
    }
};