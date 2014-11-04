var wp = (function()
{
	var save_url = "/wp/save/";

	function mode_change()
	{
		var val = $("#id_mode").val();
		if (val == '2')
		{
			$("#id_authentication > option[value=1]").attr("disabled", "disabled");
			var a = $("#id_authentication");
			if (a.val() == '1')
				a.val(['2']);
		}

		else
			$("#id_authentication > option[value=1]").removeAttr("disabled");
	}

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

	function toggle_av()
	{
		if (this.checked)
			$("#id_avscansize").removeAttr("disabled");

		else
			$("#id_avscansize").attr("disabled", "disabled");
	}

	function get_data()
	{
		var av = ($("#id_av").attr("checked") == "checked" ? 1 : 0);
		var data = {
				av: av,
				avscansize: $("#id_avscansize").val(),
				mode: $("#id_mode").val(),
				authentication: $("#id_authentication").val(),
				safesearchon: $("#id_safesearchon").val(),
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
		$("#id_av").click(toggle_av);
		$("#id_mode").change(mode_change);
		$(".save_button.save").click(func_save);
		$(".save_button.save").css("margin-right", "0");
		mode_change();
		if ($("#id_id").val() != "")
		{
			if ($("#id_av").attr("checked") != "checked")
				$("#id_avscansize").attr("disabled", "disabled");
		}

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