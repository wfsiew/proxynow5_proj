var admin = (function()
{
	var save_url = "/administration/save/";

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
				datetime: $("#id_datetime").val(),
				timezone: $("#id_timezone").val(),
				id: "",
				save_type: ""
		}
		var id = $("#id_id").val();
		if (id != "")
		{
			data.id = id;
			data.save_type = "update";
		}

		return data;
	}

	function init()
	{
		$(".save_button.save").click(func_save);
		$(".save_button.save").css("margin-right", "0");
		utils.bind_hover($(".save_button"));
	}

	function load()
	{
		return menu.get(save_url, init);
	}

	return {
		load:load
	};
}());