var defschedule = (function()
{
	var save_url = "/schedule_add/";
	var save_temp_url = "/schedule/save/temp/"; 
	
	var edit_url = "/schedule_edit/";
	var edit_temp_url = "/schedule_edit_temp/";
	
	var delete_url = "/schedule_delete/";
	var list_url = "/schedule/list/";
	
	var list = {
			panel: '/schedule/list/panel/',
			select: 'schedule/list/panel_search/'
	};
	
	var list_temp = {
			panel : '/schedule/list/panel/temp/',
			select : '/schedule/list/panel_search/temp/'
	};
	
	var popup_dialog_opt = null;
	
	function init_ui_opt()
	{
		popup_dialog_opt = {
				autoOpen: false,
				width: 340,
				resizable: false,
				draggable: false,
				modal: false,
				stack: false,
				zIndex: 10000
		};
	}

	function get_ui_opt()
	{
		init_ui_opt();
		return {
			popup_dialog_opt: popup_dialog_opt
		}
	}

	function init_form(data)
	{
		var offset = $(data.self).offset();
		var position = [offset.left, utils.get_elm_top(offset.top)];
		var _prefix = '_' + data.level;
		var sep = (data.scope == '' ? '' : '-');
		var scopeq = (data.scope == '' ? '' : '&scope=' + data.scope);
		utils.remove_dialog("#dialog-add" + sep + data.scope + _prefix);
		$("#dialog_edit_body" + sep + data.scope + data.prefix).empty();
		$("#dialog-edit" + sep + data.scope + data.prefix).dialog('close');
		var url = (data.url == null ? save_url : data.url);
		$("#dialog-add" + sep + data.scope + data.prefix).dialog('option', 'position', position);
		$("#dialog_body" + sep + data.scope + data.prefix).load(url + "?level=" + data.level + scopeq, null,
				function()
				{
					var nextform = $("#save-form" + sep + data.scope + _prefix);
					init_calendar(nextform);
					nextform.find("#id_type").change(show_inner_form);
					nextform.find(".save_button.save").click(function()
							{
								if (data.level == 2 && data.scope == 'schedule-profile')
								{
									return data.func_save();
								}
								
								else if (data.scope == '' || data.level > 1)
								{
									var o = {
											level: data.level,
											scope: data.scope
									};
									
									return save_inner_form(o);
								}
								
								else if (data.level == 1)
								{
									return data.func_save();
								}
								
								return false;
							});
					nextform.find(".save_button.cancel").click(function()
							{
								utils.cancel_dialog(data.level, "#dialog-add" + sep + data.scope);
							});
					set_inner_form(nextform, 1);
					utils.bind_hover(nextform.find(".save_button"));
					$("#dialog-add" + sep + data.scope + data.prefix).dialog('open');
				});
	}

	function init_edit_form(data)
	{
		var offset = $(data.self).offset();
		var position = [offset.left, utils.get_elm_top(offset.top)];
		var _prefix = '_' + data.level;
		var sep = (data.scope == '' ? '' : '-');
		var scopeq = (data.scope == '' ? '' : '&scope=' + data.scope);
		var wizq = (data.url == null ? '' : '&wiz=1');
		utils.remove_dialog("#dialog-edit" + sep + data.scope + _prefix);
		$("#dialog_body" + sep + data.scope + data.prefix).empty();
		$("#dialog-add" + sep + data.scope + data.prefix).dialog('close');
		var url = (data.url == null ? edit_temp_url : data.url);
		$("#dialog-edit" + sep + data.scope + data.prefix).dialog('option', 'position', position);
		$("#dialog_edit_body" + sep + data.scope + data.prefix).load(url + data.id + "/?level=" + data.level + scopeq + wizq, null,
				function()
				{
					var nextform = $("#save-form" + sep + data.scope + _prefix);
					init_calendar(nextform);
					nextform.find("#id_type").change(show_inner_form);
					nextform.find(".save_button.save").click(function()
							{
								return update_inner_form(data);
							});
					nextform.find(".save_button.cancel").click(function()
							{
								utils.cancel_dialog(data.level, "#dialog-edit" + sep + data.scope);
							});
					var i = nextform.find("#id_type").val();
					var t = parseInt(i, 10);
					set_inner_form(nextform, t);
					utils.bind_hover(nextform.find(".save_button"));
					$("#dialog-edit" + sep + data.scope + data.prefix).dialog('open');
				});
	}

	// this function to show form when user click to add new schedule.
	function show_form()
	{
		$("#left_box").load(save_url, null,
				function()
				{
					var form = $("#save-form");
					$("#left_box").css('width', '330px');
					init_calendar(form);
					$(".save_button.save").click(function()
							{
								return func_save('0');
							});
					$(".save_button.cancel,.form_title div.close").click(utils.cancel_form);
					$("#id_type").change(show_inner_form);
					set_inner_form(form, 1);
					utils.bind_hover($(".save_button,.form_title div.close"));
					$("#left_box").show();
				});

		return false;
	}

	function show_inner_form()
	{
		var form = utils.get_parent(this, 3);
		var val = $(this).val();
		var _val = parseInt(val, 10);
		set_inner_form(form, _val);
	}

	function edit_helper(o)
	{
		var arg = $(o.self).parent().attr("id");
		var url = "/schedule_edit/";
		if (o.clone == 1)
			url = "/schedule_clone/";

		url += arg + '/';
		$("#left_box").load(url, null,
				function()
				{
					var form = $("#save-form");
					$("#left_box").css('width', '330px');
					init_calendar(form);
					$(".save_button.save").click(function()
							{
								return func_save(0);
							});
					$(".save_button.cancel,.form_title div.close").click(utils.cancel_form);
					$("#id_type").change(show_inner_form);
					utils.bind_hover($(".save_button,.form_title div.close"));
					var i = $("#id_type").val();
					var t = parseInt(i, 10);
					set_inner_form(form, t);
					$("#left_box").show();
				});
	}

	function func_save()
	{
		var currform = $("#save-form");
		var data = get_data(currform);
		var action = $('#id_action').val();
		if (action == "edit")
			schedule_edit(data);

		else
			schedule_add(data);
	}

	function save_inner_form(o)
	{
		var i = o.level - 1;
		var sep = (o.scope == '' ? '' :'-');
		var prefix = (o.level < 1 ? '' : '_' + o.level);
		var _prefix = (i < 1 ? '' : '_' + i);
		var currform = $("#save-form" + sep + o.scope + prefix);
		var prevform = $("#save-form" + sep + o.scope + _prefix);
		
		var savetemp = (!('savetemp' in o) ? '' : o.savetemp);
		var url = ( !('url' in o) ? save_url : o.url);
		
		var data = get_data(currform);
		data['level'] = o.level;
		data['savetemp'] = savetemp;
		
		$.post(url, data,
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
						utils.show_dialog(1, err);
					}
					else if(result.invalid)
					{
						err = utils.get_errors(result.invalid);
						utils.show_dialog(1, err);
					}
					else
					{
						err = utils.get_errors(result.errors);
						utils.show_dialog(2, err);
					}
				});
				
		return false;
	}

	function update_inner_form(o)
	{
		var i = o.level - 1;
		var sep = (o.scope == '' ? '' : '-');
		var prefix = (o.level < 1 ? '' : '_' + o.level);
		var _prefix = (i < 1 ? '' : '_' + i);
		var currform = $("#save-form" + sep + o.scope + prefix);
		var prevform = $("#save-form" + sep + o.scope + _prefix);
		var savetemp = (o.savetemp == null ? 'update' : o.savetemp);
		var data = get_data(currform);
		
		data['savetemp'] = savetemp;
		data['level'] = o.level;
		
		var url = (o.url == null ? edit_url : o.url);
		
		$.post(url + data.id + "/", data,
				function(result)
				{
					if (result.success == 1)
					{
						if (o.level == 1 && o.scope != '')
							o.func_update(result.id, result.name, o.self);
						
						if (o.level == 2)
							o.func_update(result.id, result.name, o.self);
							
						utils.cancel_dialog(o.level, "#dialog-edit" + sep + o.scope);
					}

					else if (result.error == 1)
					{
						err = utils.get_errors(result.errors);
						utils.show_dialog(1, err);
					}
					
					else if(result.invalid)
					{
						err = utils.get_errors(result.invalid);
						utils.show_dialog(1, err);
					}
					
					else
					{
						utils.show_dialog(2, result);
					}
				});
		return false;
	}

	function func_save(level)
	{
		var i = level - 1;
		var prefix = (level < 1 ? '' : '_' + level);
		var _prefix = (i < 1 ? '' : '_' + i);
		var currform = $("#save-form" + prefix);
		var prevform = $("#save-form" + _prefix);

		action = $('#id_action').val();
		var data = null;

		// action var represent for action from user.
		// Ex : action for editing or deleting.

		if (level == 0)
			data = get_data(prevform);

		else
		{
			data = get_data(currform);
			data['level'] = level;
		}

		if (action == "edit")
			schedule_edit(data);

		else
			schedule_add(data);
	}

	// This function to get data from server.
	function func_edit()
	{
		var self = this;
		edit_helper({self: self, clone: null});
	}

	// this function edit schedule
	function schedule_edit(data)
	{
		var id = $('#id_id').val();

		url = "/schedule_edit/" + id + "/";
		// data = get_data();
		$.post(url, data,
				function(result)
				{
					show_info(result);
				});
	}

	function func_delete()
	{
		var item = $(this).parent();
		var arg = item.attr("id");
		var val = $("#id_pg").val();
		var arr = val.split(',');
		var currpg = parseInt(arr[3], 10);
		--currpg;
		var pgsize = $("#id_display").val();
		var search_by = $("#id_selection").val();
		var keyword = $("#id_query").val();
		var data = {
				id : arg,
				pgnum : currpg,
				pgsize : pgsize,
				find : search_by,
				text : keyword,
				confirm : ''
		};

		var url = "/schedule_delete/" + arg + "/";
		ajax_delete(url,data,item);
	}

	function ajax_delete(url, data, item)
	{
		$.post(url, data,
				function(result)
				{
					if (result.hasgroups == 1)
					{
						$("#confirm_delete_body").html(result.msg);
						var cd = $("#confirm-delete");
						cd.dialog('open');
						cd.find(".save_button.save").click(function()
								{
									data['confirm'] = 1;
									cd.dialog('close');
									ajax_delete(url, data, item);
								});

						cd.find(".save_button.cancel").click(function()
								{
									cd.dialog('close');
								});
						utils.bind_hover(cd.find(".save_button"));
					}

					else if (result.success == 1)
					{
						nav_list.set_item_msg(result.itemscount);
						var tr = item.parent();
						tr.remove();
						delete tr;
					}

					else
					{
						utils.show_dialog(2, result);
					}
				});
	}

	function func_clone()
	{
		var self = this;
		edit_helper({self: self, clone: 1});
	}

	function show_info(result)
	{
		if (result.Success)
		{
			utils.cancel_form();
			nav_list.show_list();
		}

		if (result.invalid)
		{
			err = utils.get_errors(result.invalid);
			utils.show_dialog(1, err);
		}

		if (result.error)
		{
			utils.show_dialog(2, result.error);
		}
	}

	function schedule_transform(tmp)
	{
		var arrpos = ["0", "0", "0", "0", "0", "0", "0", "0"];

		for (var i = 0; i < tmp.length; i++)
		{
			arrpos[tmp[i]] = "1";
		}

		var a = arrpos.join('');
		return a;
	}

	function schedule_getselected(form)
	{
		var tmp = [];
		var code = null;

		form.find("input[name='checkbox_day']").each(function()
				{
					if ($(this).attr('checked') == "checked")
					{
						var c = $(this).val();
						tmp.push(c);
					}
				});
		code = schedule_transform(tmp);
		return code;
	}

	// form variable is id of the form that you want to save
	// using in wizard
	function get_data(form)
	{
		nameVar = form.find('#id_name').val();
		id = form.find("#id_id").val();

		typeVar = form.find('#id_type').val();
		commentVar = form.find('#id_comment').val();

		// This part for Recuring.
		startTimeHourRecuringVar = form.find('#id_start_time_hour_recuring').val();
		startTimeMinRecuringVar = form.find('#id_start_time_min_recuring').val();
		endTimeHourRecuringVar = form.find('#id_end_time_hour_recuring').val();
		endTimeMinRecuringVar = form.find('#id_end_time_min_recuring').val();

		checkbox_dayVar = schedule_getselected(form);

		startdayyearSingleVar = form.find('#id_start_day_year_single').val();
		startdaymonthSingleVar = form.find('#id_start_day_month_single').val();
		startdaydaySingleVar = form.find('#id_start_day_day_single').val();
		starttimehourSingleVar = form.find('#id_start_time_hour_single').val();
		starttimeminSingleVar = form.find('#id_start_time_min_single').val();

		enddayyearSingleVar = form.find('#id_end_day_year_single').val();
		enddaymonthSingleVar = form.find('#id_end_day_month_single').val();
		enddaydaySingleVar = form.find('#id_end_day_day_single').val();
		endtimehourSingleVar = form.find('#id_end_time_hour_single').val();
		endtimeminSingleVar = form.find('#id_end_time_min_single').val();

		nameexistedVar = form.find('#id_nameexisted').val();

		var data = {
				id: id,
				name: nameVar,
				type: typeVar,
				comment : commentVar,
				start_day_year_single: startdayyearSingleVar,
				start_day_month_single: startdaymonthSingleVar,
				start_day_day_single: startdaydaySingleVar,
				start_time_hour_single: starttimehourSingleVar,
				start_time_min_single: starttimeminSingleVar,
				end_day_year_single: enddayyearSingleVar,
				end_day_month_single: enddaymonthSingleVar,
				end_day_day_single: enddaydaySingleVar,
				end_time_hour_single: endtimehourSingleVar,
				end_time_min_single: endtimeminSingleVar,
				start_time_hour_recuring: startTimeHourRecuringVar,
				start_time_min_recuring: startTimeMinRecuringVar,
				end_time_hour_recuring: endTimeHourRecuringVar,
				end_time_min_recuring: endTimeMinRecuringVar,
				checkbox_temp: checkbox_dayVar,
				nameexisted: nameexistedVar
		};

		return data;
	}

	// this function add schedule
	function schedule_add(data)
	{
		// data = get_data();
		url = "/schedule_add/";
		$.post(url, data,
				function(result)
				{
					show_info(result);
				});
	}

	function set_inner_form(form, i)
	{
		if (i == 1)
		{
			form.find(".recuring").hide();
			form.find(".single").show();
		}

		else
		{
			form.find(".single").hide();
			form.find(".recuring").show();
		}
	}

	function init_list()
	{
		$(".list_button.edit").click(func_edit);
		$(".list_button.delete").click(func_delete);
		$(".list_button.clone").click(func_clone);
	}

	function init()
	{
		$("#left_box").hide();
		$("#id_add").click(show_form);
		$("#id_find").click(nav_list.show_list);
		$("#id_display").change(nav_list.show_list);
		$("#id_prev").click(nav_list.go_prev);
		$("#id_next").click(nav_list.go_next);
		utils.bind_hover($("#id_add,#id_find"));
		utils.init_alert_dialog("#dialog-message");

		utils.init_confirm_delete("#confirm-delete");

		nav_list.config.list_url = list_url;
		nav_list.config.list_func = init_list;
		nav_list.init();
	}

	function init_calendar(form)
	{
		start_calendar(form);
		end_calendar(form);

		//set the time today for cal
		var currentTime = new Date();

		$("#id_start_day_year_single").val(currentTime.getFullYear());
		$("#id_start_day_month_single").val(currentTime.getMonth() + 1);
		$("#id_start_day_day_single").val(currentTime.getDate());

		$("#start_datetime").val(currentTime);

		$("#id_end_day_year_single").val(currentTime.getFullYear());
		$("#id_end_day_month_single").val(currentTime.getMonth() + 1);
		$("#id_end_day_day_single").val(currentTime.getDate());

		$('#end_datetime').val(currentTime);
	}

	function start_calendar(form)
	{
		startdayyearSingleVar = form.find('#id_start_day_year_single').val();
		startdaymonthSingleVar = form.find('#id_start_day_month_single').val();
		startdaydaySingleVar = form.find('#id_start_day_day_single').val();

		s = startdaymonthSingleVar + "/" + startdaydaySingleVar + "/"
				+ startdayyearSingleVar;
		form.find("#start_datetime").val(s);

		var start_Opts = {
				showOn: "button",
				buttonImage: '../media/css/img/SpriteImage/16/0255.png',
				constrainInput: true,
				showOtherMonths: true,
				buttonImageOnly: true,
				showButtonPanel: true,
				onSelect: function(date)
				{
					var date = $(this).datepicker('getDate');

					var day1 = $(this).datepicker('getDate').getDate();
					var month1 = $(this).datepicker('getDate').getMonth() + 1;
					var year1 = $(this).datepicker('getDate').getFullYear();

					form.find("#id_start_day_year_single").val(year1);
					form.find("#id_start_day_month_single").val(month1);
					form.find("#id_start_day_day_single").val(day1);
				}
		};

		form.find("#start_datetime").datepicker(start_Opts);
	}

	function end_calendar(form)
	{
		enddayyearSingleVar = form.find('#id_end_day_year_single').val();
		enddaymonthSingleVar = form.find('#id_end_day_month_single').val();
		enddaydaySingleVar = form.find('#id_end_day_day_single').val();

		e = enddaymonthSingleVar + "/" + enddaydaySingleVar + "/"
				+ enddayyearSingleVar;
		form.find("#end_datetime").val(e);

		var end_Opts = {
				showOn: "button",
				buttonImage: '../media/css/img/SpriteImage/16/0255.png',
				showOtherMonths: true,
				constrainInput: true,
				buttonImageOnly: true,
				showButtonPanel: true,
				onSelect: function(date)
				{
					var date = $(this).datepicker('getDate');
					var day1 = $(this).datepicker('getDate').getDate();
					var month1 = $(this).datepicker('getDate').getMonth() + 1;
					var year1 = $(this).datepicker('getDate').getFullYear();

					form.find('#id_end_day_year_single').val(year1);
					form.find('#id_end_day_month_single').val(month1);
					form.find('#id_end_day_day_single').val(day1);
				}
		};

		form.find("#end_datetime").datepicker(end_Opts);
	}

	function load()
	{
		return menu.get('/schedule_list/', init);
	}

	return {
		load:load,
		list:list,
		list_temp: list_temp,
		init_form:init_form,
		init_edit_form:init_edit_form,
		save_inner_form:save_inner_form,
		get_ui_opt:get_ui_opt,
		get_data:get_data,
		save_temp_url : save_temp_url,
		edit_temp_url : edit_temp_url
	};
}());