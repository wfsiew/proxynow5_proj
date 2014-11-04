var utils = (function()
{
	var typing_timer;
	var done_typing_interval = 2000;
	var tooltip_timer;
	var tooltip_delay = 5000;
	var accesstype = {
			admin: 2,
			normal: 1
	};

	/**
	 * @public
	 * This function makes the selected id to appear as popup dialog to show alert message.
	 * @param id The element id.
	 */
	function init_alert_dialog(id)
	{
		$(id).dialog({
			autoOpen: false,
			modal: true,
	        buttons: {
	            OK: function() {
	                $(this).dialog("close");
	            }
	        }
	    });
	}

	/**
	 * @public
	 * This function monitor the progress of an ajax request by showing the progress Loading ...
	 */
	function init_progress()
	{
		$("#progress_status").ajaxSend(
				function(evt, jqXHR, ajaxOptions)
				{
					if (ajaxOptions.url.indexOf(log.run_url) == 0 ||
						ajaxOptions.url.indexOf(dashboard.data_url) == 0 ||
						ajaxOptions.url.indexOf(patchupgrade.upgrade_log_run_url) == 0 ||
						ajaxOptions.url.indexOf(patchupgrade.checkserver_url) == 0)
						return;
						
					$(this).show();
				});
		$("#progress_status").ajaxComplete(
				function()
				{
					$(this).hide();
				});
	}

	/**
	 * @public
	 * This function makes the element error-dialog to appear as popup dialog.
	 * It also attach the ajaxError event to monitor ajax error.
	 */
	function init_server_error_dialog()
	{
		$(document).ajaxError(
				function(evt, jqXHR, ajaxOptions, errorThrown)
				{
					if (ajaxOptions.url.indexOf(dashboard.data_url) == 0 ||
						ajaxOptions.url.indexOf(patchupgrade.checkserver_url) == 0)
						return;

					show_error_dialog(jqXHR.responseText);
				});
		$("#error-dialog").dialog({
			autoOpen: false,
			modal: true,
			width: 700,
			height: 500,
			buttons: {
				OK: function() {
					$(this).dialog("close");
				}
			}
		});
	}

	/**
	 * @public
	 * This function makes the selected id to appear as list panel which appears on the left, replacing the menu.
	 * @param id The element id.
	 * @param func_close the function to be called when it close.
	 */
	function init_list_panel(id, func_close)
	{
		var menu = get_menu_attr();
		var menu_pos = [menu.left, menu.top];
		$(id).dialog({
			autoOpen: false,
			width: menu.width - 3,
			resizable: false,
			draggable: true,
			modal: false,
			stack: false,
			zIndex: 1000,
			position: menu_pos,
			close: func_close
		});
	}

	/**
	 * @public
	 * This function makes the selected id to appear as popup dialog.
	 * @param id The element id.
	 */
	function init_confirm_delete(id)
	{
		$(id).dialog({
			autoOpen: false,
			modal: true
		});
	}
	
	/**
	 * @public
	 * This function makes the element panel_tooltip to appear as a popup tooltip.
	 * @param url The url to get the json data to be populated on the tooltip.
	 */
	function init_panel_tooltip(url)
	{
		$("#panel_body > .list_row").mouseout(function()
				{
					if (tooltip_timer)
						clearTimeout(tooltip_timer);
						
					tooltip_timer = setTimeout(function()
							{
								$("#panel_tooltip").hide();
							}, tooltip_delay);
				});
		$("#panel_body > .list_row").mouseenter(function(evt)
				{
					if (tooltip_timer)
						clearTimeout(tooltip_timer);
						
					var o = $(this);
					var menu = $("#menu");
					var id = o.attr('id');
					var pos = o.offset();
					var width = o.width();
					var left = menu.width() * 2 + 50;
					var top = pos.top + 10;
					
					$("#panel_tooltip_body").empty();
					
					$.getJSON(url, {id: id},
							function(result)
							{
								if (result.id == id)
								{
									$("#panel_tooltip_body").html(result.content);
									$("#panel_tooltip").position({
										my: 'center',
										at: 'left',
										of: $("body"),
										offset: left + ' ' + top
									});
									$("#panel_tooltip").show();
								}
							});
				});
		$("#panel_tooltip").mouseenter(function()
				{
					if (tooltip_timer)
						clearTimeout(tooltip_timer);
				});
		$("#panel_tooltip").mouseout(function()
				{
					if (tooltip_timer)
						clearTimeout(tooltip_timer);
						
					tooltip_timer = setTimeout(function()
							{
								$("#panel_tooltip").hide();
							}, tooltip_delay);
				});
	}

	/**
	 * @public
	 * This function checks whether an item already exist in an array.
	 * @param item The item to be checked.
	 * @param arr The array to be examined.
	 * @return true if the item exist, false otherwise.
	 */
	function item_exist(item, arr)
	{
		var i = $.inArray(item, arr);
	    return (i >= 0 ? true : false);
	}

	/**
	 * @public
	 * This function removes a dialog specified by the dialog id.
	 * @param id The dialog id.
	 */
	function remove_dialog(id)
	{
		$(id).dialog('destroy');
		$(id).remove();
	}

	/**
	 * @public
	 * This function removes all the dialogs from the DOM.
	 */
	function clear_dialogs()
	{
		remove_dialog("div[id^='dialog-message']");
		remove_dialog("div[id^='list-panel']");
		remove_dialog("div[id^='confirm']");
		remove_dialog("div[id^='dialog']");
	}

	/**
	 * @public
	 * This function closes the form that appears on the left side of a list page.
	 */
	function cancel_form()
	{
		$("#left_box").hide();
	}

	/**
	 * @public
	 * This function closes the popup dialog from the current form.
	 * @param level The current level of a dialog.
	 * @param dialog_id The dialog id.
	 */
	function cancel_dialog(level, dialog_id)
	{
		var i = level - 1;
		var prefix = (i < 1 ? '' : '_' + i);
		$(dialog_id + prefix).dialog('close');
	}

	/**
	 * @public
	 * This function shows a message in a popup dialog.
	 * @param arg The parameter to determine whether to show html (1) or plain text (2) message.
	 * @param msg The message.
	 */
	function show_dialog(arg, msg)
	{
		if (arg == 1)
			$("#dialog_msg").html(msg);

		else
			$("#dialog_msg").text(msg);

	    $("#dialog-message").dialog('open');
	}

	/**
	 * @public
	 * This function shows the error message in a popup dialog.
	 * @param msg The error message.
	 */
	function show_error_dialog(msg)
	{
		$("#error_dialog").html(msg);
		$("#error_dialog style").remove();
		$("#error-dialog").dialog('open');
	}

	/**
	 * @public
	 * This function binds the hover event to the selected object.
	 * @param selector The object selected using $
	 */
	function bind_hover(selector)
	{
		selector.hover(
				function()
				{
					$(this).toggleClass('ui-state-hover');
				},
				function()
				{
					$(this).toggleClass('ui-state-hover');
				});
	}
	
	/**
	 * @public
	 * This function makes a list of checkboxes to allow only 1 item to be selected.
	 * @param selector The list of checkboxes selected using $
	 */
	function set_mutual_exclusive(selector)
	{
		selector.click(
				function()
				{
					if (this.checked)
						selector.not(this).removeAttr('checked');
				});
	}

	/**
	 * @public
	 * This function returns the form level from a given form id.
	 * e.g if the form id is save-form-profile_2,
     * the form level will be 2
	 * @param id The form id.
	 * @return The form level.
	 */
	function get_form_level(id)
    {
        var i = id.indexOf('_');
        if (i < 0)
            return 0;

        var s = id.substr(i + 1);
        return parseInt(s, 10);
    }

    /**
     * @public
     * This function returns the form scope from a given form id.
     * e.g if the form id is save-form-profile_1,
     * the form scope will be profile
     * @param id The form id.
     * @return The form scope.
     */
    function get_form_scope(id)
    {
    	var i = id.lastIndexOf('-');
    	var j = id.lastIndexOf('_');
    	if (i < 5)
    		return '';

    	else if (id.indexOf('export-form') == 0 && i < 7)
    		return '';

    	else
    		return id.substring(i + 1, j);
    }

    /**
     * This function returns the previous form level from a given form id.
     * e.g if the form id is save-form-profile_2,
     * the previous form level will be 1
     * @param id The form id.
     * @return The previous form level.
     */
	function get_prev_form_level(id)
	{
		var i = get_form_level(id);
		return (i > 0 ? i - 1 : 0);
	}

	/**
	 * @public
	 * This function returns the next form level from a given form id.
	 * e.g if the form id is save-form,
	 * the next form level will be 1
	 * @param id The form id.
	 * @return The next form level.
	 */
    function get_next_form_level(id)
    {
    	var i = get_form_level(id);
    	return i + 1;
    }

    /**
     * @public
     * This function returns the prefix of a form id from a given form id.
     * e.g if the form id is save-form_1,
     * the prefix will be _1
     * @param id The form id.
     * @return The prefix of a form id.
     */
    function get_prefix(id)
    {
    	var p = get_form_level(id);
    	return (p == 0 ? '' : '_' + p);
    }

    /**
     * @public
     * This function sets the data associated with the object selected by jQuery.
     * @param selector The object selected using $
     * @param key The key associated with the data.
     * @param arr The object to be stored.
     */
	function set_data(selector, key, arr)
	{
		selector.removeData(key);
		selector.data(key, arr);
	}

	/**
	 * @public
	 * This function executes the specified function when the typing interval has elapsed.
	 * @param func The function to be executed.
	 */
	function countdown_filter(func)
	{
		stop_filter_timer();
		typing_timer = setTimeout(func, done_typing_interval);
	}

	/**
	 * @public
	 * This function stops the typing timer.
	 */
	function stop_filter_timer()
	{
		clearTimeout(typing_timer);
	}

	/**
	 * @public
	 * This function gets the parent object from a given selector and the level to be traversed.
	 * @param arg The jQuery selector.
	 * @param level The level to be traversed from the current selected object.
	 * @return The parent object.
	 */
	function get_parent(arg, level)
	{
		var o = $(arg);
		for (var i = 0; i < level; i++)
			o = o.parent();

		return o;
	}

	/**
	 * @public
	 * This function add dragging css class.
	 */
	function add_drag_css(evt, ui)
	{
		$(".ui-draggable-dragging").addClass("ui-state-hover");
	}

	/**
	 * @public
	 * This function remove dragging css class.
	 */
	function remove_drag_css(evt, ui)
	{
		$(".ui-draggable-dragging").removeClass("ui-state-hover");
	}

	/**
	 * @public
	 * This function makes a list of div elements to have alt row color.
	 * @param id The jQuery selector.
	 */
	function set_alt_css(id)
	{
		$(id + " > div").removeClass("ui-state-default");
		$(id + " > div").removeClass("ui-state-hover");
		$(id + " > div:odd").addClass("ui-state-default");
		$(id + " > div:even").addClass("ui-state-hover");
	}

	/**
	 * @public
	 * This function returns the id from a given element id.
	 * e.g if the element id is item_1,
	 * the id will be 1
	 * @param arg The element id.
	 * @return The id.
	 */
	function get_itemid(arg)
	{
		var i = arg.indexOf('_');
		if (i >= 0)
		{
			var s = arg.substr(i + 1);
			return parseInt(s, 10);
		}

		return -1;
	}

	/**
	 * @public
	 * This function returns the form errors in html after validation.
	 * @param errors The list of errors.
	 * @return The form errors in html.
	 */
	function get_errors(errors)
	{
		var data = {
				errors: errors
		};
		var h = new EJS({url: '/media/tpl/form_error.ejs'}).render(data);
		return h;
	}

	/**
	 * @public
	 * This function returns the cookie's value from a given cookie's name.
	 * @param name The cookie's name.
	 * @return The cookie's value.
	 */
	function get_cookie(name)
    {
        var cookieValue = null;
        if (document.cookie && document.cookie != '')
        {
            var cookies = document.cookie.split(';');
            for (var i = 0; i < cookies.length; i++)
            {
                var cookie = jQuery.trim(cookies[i]);
                // Does this cookie string begin with the name we want?
                if (cookie.substring(0, name.length + 1) == (name + '='))
                {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }

        return cookieValue;
    }

    /**
     * @public
     * This function returns the top position relative to the document's scroll top position.
     * @param v The object's offset.top
     * @return The relative top position.
     */
	function get_elm_top(v)
	{
		return v - $(document).scrollTop();
	}

	/**
	 * @private
	 * This function returns the left menu's attributes :
	 * width, left, top.
	 * @return The menu's attributes.
	 */
	function get_menu_attr()
	{
		var menu = $("#menu");
		
		var menu_width = menu.width();
		menu_width += 5;
		var menu_offset = menu.offset();
		var menu_left = menu_offset.left;
		var menu_top = menu_offset.top;
		menu_left -= 5;

		return {
			width: menu_width,
			left: menu_left,
			top: menu_top
		};
	}
	
	/**
	 * @public
	 * This function turns on the wizard.
	 * @param status
	 */
	function switch_wizard(status)
	{
		try
		{
			var url_profile_switch = "/wizard_profile_switch/";
			var data = {'status': status};
			
			$.post(url_profile_switch, data,
					function(result)
					{
						if (result.status == "success")
						{
							window.location.replace('/wizardReRun/');
						}
					
						if (result.status == "error")
						{
							alert(result.error_info);
						}
					});
		}
		
		catch (err)
		{
			alert(err.message);
		}
	}
	
	return {
		init_alert_dialog:init_alert_dialog,
		init_progress:init_progress,
		init_server_error_dialog:init_server_error_dialog,
		init_list_panel:init_list_panel,
		init_confirm_delete:init_confirm_delete,
		init_panel_tooltip:init_panel_tooltip,
		item_exist:item_exist,
		remove_dialog:remove_dialog,
		clear_dialogs:clear_dialogs,
		cancel_form:cancel_form,
		cancel_dialog:cancel_dialog,
		show_dialog:show_dialog,
		show_error_dialog:show_error_dialog,
		bind_hover:bind_hover,
		set_mutual_exclusive:set_mutual_exclusive,
		get_form_level:get_form_level,
		get_form_scope:get_form_scope,
		get_next_form_level:get_next_form_level,
		get_prefix:get_prefix,
		set_data:set_data,
		typing_timer:typing_timer,
		done_typing_interval:done_typing_interval,
		tooltip_timer:tooltip_timer,
		tooltip_delay:tooltip_delay,
		accesstype:accesstype,
		countdown_filter:countdown_filter,
		stop_filter_timer:stop_filter_timer,
		get_parent:get_parent,
		add_drag_css:add_drag_css,
		remove_drag_css:remove_drag_css,
		set_alt_css:set_alt_css,
		get_itemid:get_itemid,
		get_errors:get_errors,
		get_cookie:get_cookie,
		get_elm_top:get_elm_top,
		switch_wizard:switch_wizard
	};
}());

$.ajaxSetup({
	cache: false
});