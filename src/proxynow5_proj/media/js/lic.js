/*
 * @include "utils.js"
 * @include "stat.js"
 * @include "menu.js"
 */

var lic = (function()
{
	var page_url = "/lic/";
	var activate_url = "/lic/activate/";
	var deactivate_url = "/lic/deactivate/";
	
	function func_activate()
	{
		var data = {
			licensekey: $("#id_licensekey").val()
		};
		$.post(activate_url, data,
				function(result)
				{
					if (result.success == 1)
					{
						stat.show_status(0, result.msg);
						$("#info").html(result.contents);
					}
					
					else if (result.error == 1)
					{
						var err = utils.get_errors(result.errors);
						stat.show_status(1, err);
					}
					
					else
					{
						stat.show_status(1, result);
					}
				})
		return false;
	}
	
	function func_deactivate()
	{
		var id = $("#id_id").val();
		if (id == "")
			id = '0';
			
		var data = {
			licensekey: $("#id_licensekey").val(),
			id: id
		};
		$.post(deactivate_url, data,
				function(result)
				{
					if (result.success == 1)
					{
						stat.show_status(0, result.msg);
						$("#info").html(result.contents);
					}
					
					else if (result.error == 1)
					{
						var err = utils.get_errors(result.errors);
						stat.show_status(1, err);
					}
					
					else
					{
						stat.show_status(1, result);
					}
				});
		return false;
	}
	
	function init()
	{
		$(".save_button.activate").click(func_activate);
		$(".save_button.deactivate").click(func_deactivate);
		utils.bind_hover($(".save_button"));
	}
	
	function load()
	{
		return menu.get(page_url, init);
	}
	
	return {
		load:load
	};
}());