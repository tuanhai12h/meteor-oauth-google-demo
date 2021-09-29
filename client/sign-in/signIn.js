Template.signIn.events(
{
    'click .btnSignUp': function() 
    {
        Router.go('signup');
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