/*
 * @include "utils.js"
 */

var menu = (function()
{
	function get(url, func, self)
	{
		utils.clear_dialogs();
		dashboard.stop_refresh_timer();
		log.stop_log_timer();
		$("#contentcolumn div.innertube").load(url, null, func);
		return false;
	}

	function menu_click()
	{
		$("#menu a").removeClass('menu_active');
		$(this).addClass('menu_active');
	}

	function init()
	{
		var accesstype = $("#id_accesstype_").val();
		$("#menu").accordion({autoHeight: false, animated: false, change: menu_change});
		$("#menu a").click(menu_click);
		if (accesstype == utils.accesstype.admin)
		{
			$("#menu_dashboard").next().hide();
			$("#menu_dashboard > a").addClass('menu_active');
			dashboard.load();
		}
		
		else
		{
			$("#menu_changepwd").next().hide();
			$("#menu_changepwd > a").addClass('menu_active');
			user.load();
		}
	}

	function load()
	{
		$("#leftcolumn div.innertube").load("/menu/", null, init);
	}

	function menu_change(evt, ui)
	{
		dashboard.stop_refresh_timer();
		log.stop_log_timer();
		patchupgrade.stop_log_timer();
		var h = $(ui.newHeader);
		var id = h.attr("id");
		if (id == 'menu_dashboard' || id == 'menu_logout' || id == 'menu_changepwd')
		{
			h.next().hide();
		}
	}

	return {
		load:load,
		get:get,
		init:init
	}
}());