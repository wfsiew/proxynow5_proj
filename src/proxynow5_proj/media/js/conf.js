var conf = (function()
{
	var page_url = "/setting/conf/";
	var import_url = "/setting/conf/import/";
	var export_url = "/setting/conf/export/";
	var form_options = {
		target: '',
		dataType: 'json',
		async: false,
		timeout: 300000, //5 mins timeout
		beforeSubmit: import_request,
		success: import_response
	}
	
	function func_import()
	{
		$("#upload-form").ajaxSubmit(form_options);
		return false;
	}
	
	function func_export()
	{
		open(export_url, '_blank');
		return false;
	}
	
	function import_request(formData, jqForm, options)
	{ 
	    // formData is an array; here we use $.param to convert it to a string to display it 
	    // but the form plugin does this for you automatically when it submits the data 
	    //var queryString = $.param(formData);
		
		$("#status_import").show();
	 
	    // jqForm is a jQuery object encapsulating the form element.  To access the 
	    // DOM element for the form do this: 
	    // var formElement = jqForm[0];
	 
	    // here we could return false to prevent the form from being submitted; 
	    // returning anything other than false will allow the form submit to continue
		
	    return true; 
	}
	
	function import_response(responseText, statusText, xhr, $form)
	{ 
	    // for normal html responses, the first argument to the success callback 
	    // is the XMLHttpRequest object's responseText property 
	 
	    // if the ajaxForm method was passed an Options Object with the dataType 
	    // property set to 'xml' then the first argument to the success callback 
	    // is the XMLHttpRequest object's responseXML property 
	 
	    // if the ajaxForm method was passed an Options Object with the dataType 
	    // property set to 'json' then the first argument to the success callback 
	    // is the json data object returned by the server
		$("#status_import").hide();
		
		if (statusText == 'success')
		{
			if (responseText.success == 1)
			{
				stat.show_status(0, responseText.msg);
				window.location.replace(window.location.href);
			}
				
			else
				stat.show_status(1, responseText.msg);
		}
		
		else
		{
			stat.show_status(1, responseText);
		}
	}
	
	function init()
	{
		$("#.save_button.import").click(func_import);
		$(".save_button.export").click(func_export);
		utils.bind_hover($(".save_button"));
	}
	
	function load()
	{
		return menu.get(page_url, init);
	}
	
	return {
		load:load,
		func_export:func_export
	}
}());