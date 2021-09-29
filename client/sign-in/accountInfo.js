Template.accountInfo.created = function()
{
    Meteor.subscribe('userData');
};

Template.accountInfo.helpers(
{
    user: function()
    {
        return JSON.stringify(Meteor.user());
    }
});

Template.accountInfo.events(
{
    'click .btnSignOut': function()
    {
        Meteor.logout(function()
        {
            Router.go('/');
        });
    }
});