// https://medium.com/better-programming/log-in-with-the-google-oauth-demo-app-9e7d0e801c29
// async function getClientId() {
// 	const redirectUri = 'http://localhost:3000/oauth2callback'
// 	const scope = 'profile email openid'
// 	const responseType = 'code'
// 	const response = await fetch('clientId')
// 	const json = await response.json()
// 	document.querySelector('#link').href = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${json.clientId}&redirect_uri=${redirectUri}&scope=${scope}&response_type=${responseType}&access_type=offline&include_granted_scopes=true`
// }

var redirect_uri = Meteor.absoluteUrl() + 'oauth/google';

signInGoogleRedirect = function(options)
{
	var hrefReq = 'https://accounts.google.com/o/oauth2/v2/auth?client_id=' + googleAPI.clientId
		+ '&redirect_uri=' + encodeURIComponent(redirect_uri)
        + '&scope=' + googleScopes
        + '&prompt=select_account'
		+ '&response_type=code'    
        + '&access_type=offline'
        + '&include_granted_scopes=true';

    window.open(hrefReq, "_self");
};

callLoginWithGoogleReturn = function(options, callback)
{
    // solved state after callback data
    // console.log("options %o", options);

    // transfer code to login function by get Token return
    var code = options.codeGoogle;
    if (!code)
    {
        return;
    }

    // support a callback without options
    var callGoogleLoginServer = function (res, options) 
    {
        var data = {};
        if (options)
        {
            data = options;
        }        
        data.googleResponse = res;

        Accounts.callLoginMethod({
            methodArguments: [data],
            userCallback: callback
        });
    };

    console.log('calling login with Google ...');

    Meteor.call('getGoogleAccessToken', {
        code: code,
        clientId: googleAPI.clientId,
        redirect_uri: redirect_uri
    }, function(error, result)
    {
        if (showErrorIfError(error, result))
        {
            return;
        }

        callGoogleLoginServer(result);
    });
};