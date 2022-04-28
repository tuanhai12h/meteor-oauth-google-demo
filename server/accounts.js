Accounts.config({
	sendVerificationEmail: false,
	forbidClientAccountCreation: false,
});

Accounts.onCreateUser(function(options, user)
{
	// console.log(user);
	// console.log("-----");
	// console.log(options);

	if (options)
	{
		user.profile = options;
	}

	return user;
});

Accounts.onLogin(function(response)
{
	// server-side login notification
	// we are going to store login date on our server and send an event to activecampaign

	const user = response.user;			// this is basically the entire user doc!
	const date = new Date();

	// console.log(response);
	// console.log("onLogin:" + user._id);
	// console.log("onLogin: " + user.failedLogins);

	const blob = {
		$set: {
			lastLogin: date,
		},
	};

	if (user.failedLogins)
	{
		// if user had failed logins... let's reset that now
		blob["$unset"] = {
			failedLogins: 1				// reset failure count
		}
	}

	// update lastLogin on user collection (don't block, don't care if it fails)
	Meteor.users.update(
		{_id: user._id},
		blob,
		function(error) {}				// callback does nothing... but unblocks server
	);
});

Accounts.onLoginFailure(function(response)
{
	// server-side login failure notification
	// console.log("onLoginFailure: " + response.error.message);
	// console.log(response);

	const user = response.user;
	if (!user) return;

	// console.log("onLoginFailure: " + response.user._id);

	// count failures
	Meteor.users.update(
		{_id: user._id},
		{
			$inc: {
				failedLogins: 1
			}
		}
	);
});

Accounts.validateLoginAttempt(function(response)
{
	// server-side login validator
	// console.log("validateLoginAttempt: ");

	// console.log(response);
	// console.log(response.methodArguments);
	const user = response.user;
	if (!user) return;

	// console.log("validateLoginAttempt: " + response.user._id);
	// console.log("previous failures: " + response.user.failedLogins);

	const failures = user.failedLogins || 0;

	// note... do NOT lower this number without adding a reset button
	if (failures > 300)
	{
		throw new Meteor.Error("Too many failures", "Your account is locked.");
	}

	return true;
});