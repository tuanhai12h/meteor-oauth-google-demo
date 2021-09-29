Template.accountInfo.events(
{
    'click .btnSignOut': function()
    {
        Meteor.logout();
    }
});