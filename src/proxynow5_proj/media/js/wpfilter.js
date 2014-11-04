var wpfilter = (function()
{
	var tab_opt = {
			select: clear_tabs,
			load: init_content
	};
	var modules = null;
	
	function clear_tabs(evt, ui)
	{
		$("#wpfilter_tabs > div[id^='wpfilter']").empty();
		utils.clear_dialogs();
	}
	
	function save(o)
	{
		var i = o.level - 1;
		var sep = (o.scope == '' ? '' :'-');
		var prefix = (o.level < 1 ? '' : '_' + o.level);
		var _prefix = (i < 1 ? '' : '_' + i);
		var currform = $("#save-form" + sep + o.scope + prefix);
		var prevform = $("#save-form" + sep + o.scope + _prefix);
		var savetemp = (o.savetemp == null ? '' : o.savetemp);
		var data = o.func_get_data(currform, "", savetemp);
		data['level'] = o.level;
		$.post(o.url, data,
				function(result)
				{
					if (result.success == 1)
					{
						o.func_add(result.id, result.name);
						utils.cancel_dialog(o.level, "#dialog-add" + sep + o.scope);
					}
		
					else if (result.error == 1)
					{
						err = utils.get_errors(result.errors);
						o.func_show_dialog(1, err);
					}
		
					else
					{
						o.func_show_dialog(2, result);
					}
				});
		return false;
	}

	function init_content(evt, ui)
	{
		var i = ui.index;
		modules[i]();
	}

	function init()
	{
		modules = [wpcat.init, wpwhitelist.init, wpblacklist.init, wpext.init, wpcontent.init, wpmime.init];
		$("#wpfilter_tabs").tabs(tab_opt);
	}

	function load()
	{
		$("#wpfilter_tabs").tabs('destroy');
		$("#wpfilter_tabs").remove();
		return menu.get('/wpfilter/', init);
	}

	return {
		load:load,
		save:save
	}
}());