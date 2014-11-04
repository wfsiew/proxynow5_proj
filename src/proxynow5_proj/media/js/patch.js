/*
 * @include "utils.js"
 */

var patch = (function()
{
	var page_url = "/patch/";
	var tab_opt = null;
	
	function init_ui_opt()
	{
		tab_opt = {
				load: init_content
		};
	}
	
	function init_content(evt, ui)
	{
		var i = ui.index;			
		if (i == 1)
			patchdowngrade.init();
	}
	
	function init()
	{
		init_ui_opt();
		$("#patch_tabs").tabs(tab_opt);
		patchupgrade.init();
	}
	
	function load()
	{
		return menu.get(page_url, init);
	}
	
	return {
		load:load
	}
}());