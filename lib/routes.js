Router.configure({		

	title: "Oauth",

	notFoundTemplate: 'pageNotFound',

	loadingTemplate: 'loading'
});

if (Meteor.isClient)
{
	Router.route('/',
	{
		name: 'home',
		template: 'home'
	});
	
	Router.route('/signin',
	{
		name: 'signin',
		template: 'home'
	});
	
	Router.route('/signup',
	{
		name: 'signup',
		template: 'signUp',
	});
	
	Router.route('/oauth/google',
	{
		template: 'loadingTemplate',
	
		onBeforeAction: function()
		{	
			console.log(this);
	
			callLoginWithGoogleReturn(this.params.query, function()
			{
				Router.go('/');
			});
	
			this.next();
		},
	
		data: function()
		{
	
		}
	});
}