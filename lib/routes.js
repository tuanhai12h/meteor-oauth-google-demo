Router.configure({		

	title: "Oauth",

	notFoundTemplate: 'pageNotFound',

	loadingTemplate: 'loading'
});

Router.route('/',
{
	name: 'home',
	template: 'home',

	onBeforeAction: function()
	{
		this.next();
	},

	onRun: function()
	{
		this.next();
	},

	onAfterAction: function()
	{

	}
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

		this.next();
	},

	data: function()
	{

	}
});