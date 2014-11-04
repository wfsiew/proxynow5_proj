/*
 * @include "utils.js"
 */

var theme = (function()
{
	var first = true;
	var save_url = "/setting/";
	var theme = "darkhive";

	function init()
	{
		// ------------------------------------------------------------------------------
		// Make a Themes
		//
		// themeBase:
		// 'http://ajax.googleapis.com/ajax/libs/jqueryui/1.7.2/themes/',
		// ------------------------------------------------------------------------------

		var accesstype = $("#id_accesstype_").val();
		utils.init_progress();
		utils.init_server_error_dialog();

		var select_wizard = $("#theme_wizard_select .save_button");
		select_wizard.click(function()
				{
					utils.switch_wizard('1');
				});
		utils.bind_hover(select_wizard);

		var select_close = $("#theme_option .cancelicon");
		select_close.click(function()
				{
					$("#theme_option").slideUp();
				});

		$.get(save_url + "?name=theme",
				function(result)
				{
					if (result.success == 1)
					{
						theme = (result.theme == "" ? 'darkhive' : result.theme);
					}

					$.themes.init({
						themes: ['mintchoc', 'darkhive', 'trontastic',
						         'humanity', 'cupertino', 'sunny',
						         'smoothness'],
						defaultTheme: theme,
						onSelect: reloadIE
					});

					if (accesstype == utils.accesstype.admin)
						$("#theme_body").themes();
				});

		/*
		 * $.themes.init({ themes:
		 * ['mintchoc','darkhive','trontastic','humanity','cupertino','sunny','uidarkness',
		 * 'smoothness'], defaultTheme : theme, onSelect: reloadIE});
		 */

		 if (accesstype == utils.accesstype.admin)
		{
			$("#proxy_options").click(show_options);
			utils.bind_hover($("#proxy_options"));
		}
	}

	function show_options()
	{
		$("#theme_option").slideToggle();
	}

	//IE doesn't update the display immediately, so reload the page
	function reloadIE(id, display, url)
	{
		if (!first && $.browser.msie)
		{
			// window.location.href = window.location.href;
		}

		if (first == false)
		{
			var data = {
					name: 'theme',
					value: id
			};

			$.post(save_url, data,
					function(result)
					{
					});
		}

		first = false;
	}

	return {
		init:init
	};
}());

$(document).ready(theme.init);