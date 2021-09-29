Template.signIn.events(
{
    'click .btnSignUp': function() 
    {
        Meteor.setTimeout(function() 
        {
            Router.go('/signup');
            
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

    'click .loginAccount': function()
    {
        var username = $('#username').val();
        var password = $('#password').val();

        Meteor.loginWithPassword(username, password);
    }
});