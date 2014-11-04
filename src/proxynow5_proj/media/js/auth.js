/*
 * @include "utils.js"
 */

var auth = (function()
{
	var login_url = "/login/";
	var logout_url = "/logout/";
	var loggingin = false;

	function func_login()
	{
		var data = {
				username: $("#id_username").val(),
				password: $("#id_password").val()
		};

		if (loggingin)
		{
			return false;
		}

		loggingin = true;
		$.ajax({
			url: login_url,
			data: data,
			type: 'POST',
			async: false,
			success: function(result, textStatus, jqXHR)
			{
				loggingin = false;
				if (result.success == 1)
				{
					$(".login_box").effect('fold', null, 500,
							function()
							{
								$("#id_accesstype_").val(result.accesstype);
								menu.load();
								if (result.accesstype == utils.accesstype.admin)
								{
									$("#section_logo").next().html(result.themeselect);
								}
								
								theme.init();
							});
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
			},
			error: function(jqXHR, textStatus, errorThrown)
			{
				loggingin = false;
			}
		});
		return false;
	}

	function login_keypress(evt)
	{
		if (evt.keyCode == '13')
		{
			evt.preventDefault();
			evt.stopPropagation();
			func_login();
		}
	}

	function logout()
	{
		dashboard.stop_refresh_timer();
		loggingin = false;
		$.ajax({
			url: logout_url,
			type: 'POST',
			async: false,
			success: function(result, textStatus, jqXHR)
			{
				if (result.success == 1)
				{
					$("#leftcolumn div.innertube").empty();
					$("#section_logo").next().empty();
					$("#contentcolumn div.innertube").html(result.loginform);
					utils.clear_dialogs();
					init();
				}
			}
		});
		return false;
	}

	function init()
	{
		utils.init_server_error_dialog();
		var o = $("#id_username");
		if (o.length == 1)
		{
			$("#id_username,#id_password").keypress(login_keypress);
			$(".login_button").click(func_login);
			utils.bind_hover($(".login_button"));
		}

		else
		{
			menu.init();
		}
	}

	return {
		init:init,
		logout:logout
	}
}());

$(document).ready(auth.init);