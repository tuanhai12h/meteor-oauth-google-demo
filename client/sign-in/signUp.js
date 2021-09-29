Template.signUp.events(
{
    'click .btnSignIn': function() 
    {
        Router.go('signin');
    },

    'click .btnLoginGoogle': function() 
    {
        callGoogleLoginAPI();
    },

    'click .btnLoginGoogleAuth2': function() 
    {
        signInGoogleRedirect();
    },

    'click .createAccount': function()
    {
        var username = $('#username').val();
        var password = $('#password').val();

        Accounts.createUser({
            username: username,
            password: password
        }, function() 
        {
            Meteor.loginWithPassword(username, password);

            Router.go('/');
        });
    }
});