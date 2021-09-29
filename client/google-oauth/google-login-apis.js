// login on website
callGoogleLoginAPI = function(options, callback)
{
	options = options || {};
    // support a callback without options
    if (!callback && typeof options === "function") {
        callback = options;
        options = null;
    }

    connectGoogleAPI(options, function(error, result)
    {
        // console.log(result);
        if (showErrorIfError(error, result))
        {
            return;
        }

        callGoogleLoginServer(options, result, callback);
    });
};

var callGoogleLoginServer = function (options, res, callback) 
{
	var data = {};
	if (options)
	{
		data = options;
	}        
	data.googleResponse = res;
	console.log(options);

	Accounts.callLoginMethod({
		methodArguments: [data],
		userCallback: callback
	});
};