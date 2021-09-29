Meteor.publish("userData", function()
{
	if (!this.userId)
	{
		return this.ready();
	}

	return Meteor.users.find({_id: this.userId});
});