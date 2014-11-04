var nat = (function()
{
	var tab_opt = {
		select: clear_tabs,
		load: init_content
	};
	var modules = null;
	
	function hide_panel()
	{
		var isopen = $("#list-panel").dialog('isOpen');
		if (isopen)
			$("#list-panel").dialog('close');

		$("#panel_tooltip").hide();
		$("#leftcolumn").show();
	}
	
	function clear_tabs(evt, ui)
	{
		hide_panel();
		$("#nat_tabs > div[id^='nat']").empty();
		utils.clear_dialogs();
	}
	
	function init_content(evt, ui)
	{
		var i = ui.index;
		modules[i]();
	}
	
	function init()
	{
		modules = [natpf.init, natmasq.init, natdnatsnat.init];
		$("#nat_tabs").tabs(tab_opt);
	}
	
	function load()
	{
		$("#nat_tabs").tabs('destroy');
		$("#nat_tabs").remove();
		return menu.get('/nat/', init);
	}
	
	return {
		load:load,
		hide_panel:hide_panel
	}
}());