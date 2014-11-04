var user = (function()
{
	var save_url = "/defuser/save/pwd/";
	
	function func_save()
	{
		var data = get_data();
		$.post(save_url, data,
				function(result)
				{
					if (result.success == 1)
					{
						stat.show_status(0, result.msg);
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
	
	function get_data()
	{
		var data = {
				password: $("#id_password").val()
		}
		
		return data;
	}
	
	function init()
	{
		$("#id_password").val("**********");
		$(".save_button.save").click(func_save);
		utils.bind_hover($(".save_button"));
	}
	
	function load()
	{
		return menu.get(save_url, init);
	}
	
	return {
		load:load
	}
}());