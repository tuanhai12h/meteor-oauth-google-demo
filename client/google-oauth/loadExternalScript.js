// Source: https://www.nczonline.net/blog/2009/07/28/the-best-way-to-load-external-javascript/

// Load external script
loadExternalScript = function(url, callback, options)
{
    var script = document.createElement("script");
	script.setAttribute('type', "text/javascript");

	if (typeof options === 'object')
	{
		Object.keys(options).forEach(function(key) {
			script.setAttribute(key, options[key]);
		});
    }
    
	if (script.readyState)
	{  
        // IE
		script.onreadystatechange = function()
		{
			if (script.readyState == "loaded" ||
				script.readyState == "complete")
			{
				script.onreadystatechange = null;
				callback();
			}
		};
	}
	else
	{  
		// Others
		script.onload = function()
		{
			callback();
		};
	}

	script.setAttribute('src', url);
	document.getElementsByTagName("head")[0].appendChild(script);
};