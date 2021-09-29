// shows an error message if there is an error
// returns true if there is an error, false if success
showErrorIfError = function(error, result)
{
	if (error)
	{
		console.error('error: %o', error);
		return true;
	}

	if (result && result.status)
	{
		console.error('error: ' + result.status);
		return true;
	}

	return false;
};