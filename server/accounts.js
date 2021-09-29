// see METEOR documentation here: https://docs.meteor.com/api/accounts-multi.html#AccountsCommon-config
// see NIST documentation here: https://nvlpubs.nist.gov/nistpubs/SpecialPublications/NIST.SP.800-63b.pdf

/*
FROM NIST:

4.1.3 Reauthentication Periodic reauthentication of subscriber sessions SHALL be performed as described in
Section 7.2. At AAL1, reauthentication of the subscriber SHOULD be repeated at least once per 30 days during an
extended usage session, regardless of user activity. The session SHOULD be terminated (i.e., logged out) when
this time limit is reached

5.1.1.1 Memorized Secret Authenticators Memorized secrets SHALL be at least 8 characters in length if chosen by
the subscriber. Memorized secrets chosen randomly by the CSP or verifier SHALL be at least 6 characters in
length and MAY be entirely numeric. If the CSP or verifier disallows a chosen memorized secret based on its
appearance on a blacklist of compromised values, the subscriber SHALL be required to choose a different
memorized secret. No other complexity requirements for memorized secrets SHOULD be imposed.
A rationale for this is presented in Appendix A Strength of Memorized Secrets

Verifiers SHALL implement a rate-limiting mechanism that effectively limits the number of failed authentication
attempts that can be made on the subscriber’s account as described in Section 5.2.2. Verifiers SHOULD NOT impose
other composition rules (e.g., requiring mixtures of different character types or prohibiting consecutively
repeated characters) for memorized secrets. Verifiers SHOULD NOT require memorized secrets to be changed arbitrarily
(e.g., periodically)

*/

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
	// console.log("onLogin: " + user.failedLogins + " " + user.teacherId);

	const blob = {
		$set: {
			lastLogin: date,
		},
	};

	if (user.failedLogins)
	{
		// iff user had failed logins... let's reset that now
		blob["$unset"] = {
			failedLogins: 1				// reset failure count
		}
	}

	// update lastLogin on user collection (don't block, don't care if it fails)
	Meteor.users.update(
		{_id: user._id},
		blob,
		function(error){}				// callback does nothing... but unblocks server
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

	// note... do NOT lower this number without adding a reset button in the ADMIN control panel
	// And... we need to reset user.failedLogins every place a teacher or user is changing their password
	if (failures > 300)
	{
		throw new Meteor.Error("Too many failures",
			"Your account is locked. Ask your teacher to reset your password to unlock your account.");
	}

	return true;
});