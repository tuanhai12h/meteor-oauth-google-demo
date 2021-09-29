Template.signUp.events(
{
    'click .btnSignIn': function(event) 
    {
        Meteor.setTimeout(function() 
        {
            Router.go('/signin');
            
        }, 300);
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