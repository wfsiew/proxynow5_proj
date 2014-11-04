var defuser = (function()
{
	var save_url = "/defuser/save/";
	var delete_url = "/defuser/delete/";
	var list_url = "/defuser/list/";
	var list = {
			panel: '/defuser/list/panel/',
			select: '/defuser/list/select/'
	};
	
	var list_temp = {
			panel: '/defuser/list/panel/temp/',
			select: '/defuser/list/select/temp/'
	};
	
	var popup_dialog_opt = null;
	var drag_opt = null;
	var drop_scope = 'defuser';
	var list_changed = false;

	function init_ui_opt()
	{
		popup_dialog_opt = {
				autoOpen: false,
				width: 320,
				resizable: false,
				draggable: false,
				modal: false,
				stack: false,
				zIndex: 1000
		};
		drag_opt = {
				revert: true,
				snap: false,
				revertDuration: 0,
				zIndex: 1001,
				appendTo: 'body',
				helper: 'clone',
				scope: drop_scope,
				drag: utils.add_drag_css,
				stop: utils.remove_drag_css
		};
	}

	function get_ui_opt()
	{
		init_ui_opt();
		return {
			popup_dialog_opt: popup_dialog_opt,
			drag_opt: drag_opt
		};
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
					utils.set_data(nextform.find("#members"), 'members', []);
					nextform.find("#id_type").change(show_inner_form);
					nextform.find(".save_button.save").click(function()
							{
								if (data.scope == '' || data.level > 1)
								{
									var o = {
											level: data.level,
											scope: data.scope
									};
									return save_inner_form(o);
								}

								else if (data.level == 1)
									return data.func_save();

								return false;
							});
					nextform.find(".save_button.cancel").click(function()
							{
								utils.cancel_dialog(data.level, "#dialog-add" + sep + data.scope);
								update_list();
							});
					if (jQuery.isFunction(data.func_show_all) && jQuery.isFunction(data.func_show_add))
					{
						nextform.find(".img_folder").click(data.func_show_all);
						nextform.find(".img_add").click(data.func_show_add);
						nextform.find("#members_dropzone").droppable({
							hoverClass: 'ui-state-active',
							scope: drop_scope,
							drop: function(evt, ui)
							{
								var o = ui.draggable;
								add_dragged_item(nextform, o);
							}
						});
					}
					$("#dialog-add" + sep + data.scope + _prefix).dialog(get_ui_opt().popup_dialog_opt);
					$("#dialog-edit" + sep + data.scope + _prefix).dialog(get_ui_opt().popup_dialog_opt);
					set_inner_form(nextform, 1);
					utils.bind_hover(nextform.find(".save_button"));
					$("#dialog-edit" + sep + data.scope + data.prefix).dialog('close');
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
		utils.remove_dialog("#dialog-edit" + sep + data.scope + _prefix);
		$("#dialog_body" + sep + data.scope + data.prefix).empty();
		$("#dialog-add" + sep + data.scope + data.prefix).dialog('close');
		var url = (data.url == null ? save_url : data.url);
		$("#dialog-edit" + sep + data.scope + data.prefix).dialog('option', 'position', position);
		$("#dialog_edit_body" + sep + data.scope + data.prefix).load(url + "?id=" + data.id + "&level=" + data.level + scopeq, null,
				function()
				{
					var nextform = $("#save-form" + sep + data.scope + _prefix);
					nextform.find("#id_type").change(show_inner_form);
					nextform.find(".save_button.save").click(function()
							{
								return update_inner_form(data);
							});
					nextform.find(".save_button.cancel").click(function()
							{
								utils.cancel_dialog(data.level, "#dialog-edit" + sep + data.scope);
								update_list();
							});
					if (jQuery.isFunction(data.func_show_all) && jQuery.isFunction(data.func_show_add))
					{
						nextform.find(".img_folder").click(data.func_show_all);
						nextform.find(".img_add").click(data.func_show_add);
						nextform.find("#members_dropzone").droppable({
							hoverClass: 'ui-state-active',
							scope: drop_scope,
							drop: function(evt, ui)
							{
								var o = ui.draggable;
								add_dragged_item(nextform, o);
							}
						});
					}
					nextform.find("#id_password").val("**********");
					$("#dialog-add" + sep + data.scope + _prefix).dialog(get_ui_opt().popup_dialog_opt);
					$("#dialog-edit" + sep + data.scope + _prefix).dialog(get_ui_opt().popup_dialog_opt);
					set_items(nextform);
					utils.bind_hover(nextform.find(".save_button"));
					$("#dialog-add" + sep + data.scope + data.prefix).dialog('close');
					$("#dialog-edit" + sep + data.scope + data.prefix).dialog('open');
				});
	}

	function show_form()
	{
		$("#left_box").load(save_url, null,
				function()
				{
					var form = $("#save-form");
					utils.set_data(form.find("#members"), 'members', []);
					$("#left_box").css('width', '300px');
					$(".save_button.save").click(func_save);
					$(".save_button.cancel,.form_title div.close").click(cancel_form);
					$("#id_type").change(show_inner_form);
					$(".img_folder").click(show_all);
					$(".img_add").click(show_add);
					$("#members_dropzone").droppable({
						hoverClass: 'ui-state-active',
						scope: drop_scope,
						drop: function(evt, ui)
						{
							var o = ui.draggable;
							add_dragged_item(form, o);
						}
					});
					$("#dialog-add").dialog(popup_dialog_opt);
					$("#dialog-edit").dialog(popup_dialog_opt);
					utils.bind_hover($(".save_button,.form_title div.close"));
					set_inner_form(form, 1);
					$("#left_box").show();
				});

		return false;
	}

	function show_inner_form()
	{
		var form = utils.get_parent(this, 2);
		var val = $(this).val();
		var _val = parseInt(val, 10);
		set_inner_form(form, _val);
	}

	function save_success()
	{
		utils.cancel_form();
		hide_panel();
		nav_list.show_list();
	}

	function cancel_form()
	{
		utils.cancel_form();
		update_list();
	}

	function edit_helper(o)
	{
		var arg = $(o.self).parent().attr("id");
		var cloneq = (o.clone == null ? '' : '&clone=1');
		$("#left_box").load(save_url + "?id=" + arg + cloneq, null,
				function()
				{
					$("#left_box").css('width', '300px');
					$(".save_button.save").click(
							function()
							{
								if (o.clone == null)
									return func_update(arg);

								else
									return func_save();
							});
					$(".save_button.cancel,.form_title div.close").click(cancel_form);
					$(".img_folder").click(show_all);
					$(".img_add").click(show_add);
					$("#members_dropzone").droppable({
						hoverClass: 'ui-state-active',
						scope: drop_scope,
						drop: function(evt, ui)
						{
							var o = ui.draggable;
							add_dragged_item($("#save-form"), o);
						}
					});
					$("#id_password").val("**********");
					$("#dialog-add").dialog(popup_dialog_opt);
					$("#dialog-edit").dialog(popup_dialog_opt);
					set_items($("#save-form"));
					utils.bind_hover($(".save_button,.form_title div.close"));
					$("#left_box").show();
				});
	}

	function func_save()
	{
		var currform = $("#save-form");
		var data = get_data(currform, "", "");
		var o = {
				url: save_url,
				data: data,
				func_success: save_success
		};
		list_form.save(o);
		update_list();
		return false;
	}

	function func_edit()
	{
		var self = this;
		edit_helper({self: self, clone: null});
	}

	function func_update(arg)
	{
		var currform = $("#save-form");
		var data = get_data(currform, arg, "update");
		var o = {
				url: save_url,
				data: data,
				func_success: save_success
		};
		list_form.save(o);
		update_list();
		return false;
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
				id: arg,
				pgnum: currpg,
				pgsize: pgsize,
				find: search_by,
				text: keyword,
				confirm: ''
		};
		ajax_delete(data, item);
	}

	function func_clone()
	{
		var self = this;
		edit_helper({self: self, clone: 1});
	}

	function ajax_delete(data, item)
	{
		$.post(delete_url, data,
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
									ajax_delete(data, item);
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

	function save_inner_form(o)
	{
		var i = o.level - 1;
		var sep = (o.scope == '' ? '' : '-');
		var prefix = (o.level < 1 ? '' : '_' + o.level);
		var _prefix = (i < 1 ? '' : '_' + i);
		var currform = $("#save-form" + sep + o.scope + prefix);
		var prevform = $("#save-form" + sep + o.scope + _prefix);
		var data = get_data(currform, "", "");
		data['level'] = o.level;
		$.post(save_url, data,
				function(result)
				{
					if (result.success == 1)
					{
						if (o.level == 1 && o.scope != '')
							o.func_add(result.id, result.name);

						else
							add_member(prevform, result.id, result.name);

						utils.cancel_dialog(o.level, "#dialog-add" + sep + o.scope);
					}

					else if (result.error == 1)
					{
						err = utils.get_errors(result.errors);
						utils.show_dialog(1, err);
					}

					else
					{
						utils.show_dialog(2, result);
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
		var data = get_data(currform, o.id, "update");
		data['level'] = o.level;
		$.post(save_url, data,
				function(result)
				{
					if (result.success == 1)
					{
						if (o.level == 1 && o.scope != '')
							o.func_update(result.id, result.name, o.self);

						else
						{
							list_changed = true;
							update_member(prevform, result.id, result.name, o.self);
						}

						utils.cancel_dialog(o.level, "#dialog-edit" + sep + o.scope);
					}

					else if (result.error == 1)
					{
						err = utils.get_errors(result.errors);
						utils.show_dialog(1, err);
					}

					else
					{
						utils.show_dialog(2, result);
					}
				});
		return false;
	}

	function get_data(form, arg, savetype)
	{
		var val = form.find("#id_type").val();
		var data = {
				name: form.find("#id_name").val(),
				type: val,
				accesstype: form.find("#id_accesstype").val(),
				comment: form.find("#id_comment").val(),
				id: arg,
				save_type: savetype
		}
		if (val == '1')
		{
			data['displayname'] = form.find("#id_displayname").val();
			data['password'] = form.find("#id_password").val();
			if (savetype === "")
				data['confirm_password'] = form.find("#id_confirm_password").val();
		}

		else if (val == '2')
		{
			arr = form.find("#members").data('members');
			data['members'] = arr.join(',');
		}

		return data;
	}

	function set_inner_form(form, i)
	{
		for (var j = 1; j < 3; j++)
		{
			if (j == i)
				form.find(".defuser_form" + i).show();

			else
				form.find(".defuser_form" + j).hide();
		}
	}

	function hide_panel()
	{
		var isopen = $("#list-panel").dialog('isOpen');
		if (isopen)
			$("#list-panel").dialog('close');

		$("#leftcolumn").show();
	}

	function show_all()
	{
		var isopen = $("#list-panel").dialog('isOpen');
		if (isopen)
		{
			$("#list-panel").dialog('close');
			return false;
		}

		$("#leftcolumn").hide();
		var form = utils.get_parent(this, 4);
		$("#list_body").load(list.panel, null,
				function()
				{
					$(".add_button").click(function()
							{
								add_members(form);
							});
					$(".drag_zone").draggable(drag_opt);
					$("#id_filters").change(filter_list);
					$("#id_filter_text").keyup(function()
							{
								utils.countdown_filter(filter_list);
							});
					$("#id_filter_text").keydown(utils.stop_filter_timer);
					utils.bind_hover($(".add_button"));
					$("#list-panel").dialog('open');
				});
		return false;
	}

	function filter_list()
	{
		var search_by_qry = "?find=" + $("#id_filters").val();
		var keyword = $("#id_filter_text").val();
		var s = (search_by_qry == '?find=0' && keyword == "" ? "" : search_by_qry + "&text=" + keyword);
		$("#panel_body").load(list.select + s, null,
				function()
				{
					$(".drag_zone").draggable(drag_opt);
				});
	}

	function show_add()
	{
		var o = get_level_data(this);
		var self = this;
		var data = {
				self: self,
				level: o.level,
				prefix: o.prefix,
				scope: '',
				func_show_all: show_all,
				func_show_add: show_add
		};
		init_form(data);
		return false;
	}

	function add_dragged_item(form, o)
	{
		var item = $(o);
		var name = item.html();
		var id = item.parent().attr("id");
		add_member(form, id, name);
	}

	function add_member(form, id, name)
	{
		var _id = parseInt(id, 10);
		var arr = form.find("#members").data('members');
		if (!utils.item_exist(_id, arr))
		{
			arr.push(_id);
			utils.set_data(form.find("#members"), 'members', arr);
			var data = {
					id_prefix: 'item_',
					id: _id,
					click: 'defuser.remove_member(this)',
					editclick: 'defuser.edit_member(this)',
					name: name
			};
			var h = new EJS({url: '/media/tpl/list_item.ejs'}).render(data);
			form.find("#members").append(h);
		}

		set_alt_css(form, "#members");
	}

	function add_members(form)
	{
		$("input[name=chklist]:checked").each(
				function()
				{
					var o = $(this);
					var id = o.parent().attr("id");
					var name = o.next().html();
					add_member(form, id, name);
				});
	}

	function remove_member(o)
	{
		var item = $(o);
		var id = item.parent().attr("id");
		var _id = utils.get_itemid(id);
		var form = utils.get_parent(item, 5);
		var arr = form.find("#members").data('members');
		var i = $.inArray(_id, arr);
		if (i >= 0)
		{
			arr.splice(i, 1);
			utils.set_data(form.find("#members"), 'members', arr);
		}

		form.find("#" + id).remove();
		set_alt_css(form, "#members");
		return false;
	}

	function edit_member(obj)
	{
		var item = $(obj);
		var id = item.parent().attr("id");
		var _id = utils.get_itemid(id);
		var form = utils.get_parent(item, 5);
		var o = get_form_level_data(form);
		var self = item;
		var data = {
				self: self,
				id: _id,
				level: o.level,
				prefix: o.prefix,
				scope: o.scope,
				func_show_all: show_all,
				func_show_add: show_add
		};
		init_edit_form(data);
		return false;
	}

	function update_member(form, id, name, self)
	{
		$(self).next().html(name);
		var isopen = $("#list-panel").dialog('isOpen');
		if (isopen)
			filter_list();
	}

	function get_level_data(self)
	{
		var currform = utils.get_parent(self, 4);
		return get_form_level_data(currform);
	}

	function get_form_level_data(form)
	{
		var form_id = form.attr("id");
		var level = utils.get_next_form_level(form_id);
		var prefix = utils.get_prefix(form_id);
		var scope = utils.get_form_scope(form_id);
		return {
				level: level,
				prefix: prefix,
				scope: scope
		};
	}

	function set_items(form)
	{
		var val = form.find("#id_type").val();
		if (val != '2')
			return;

		arr = [];
		form.find("#members > div").each(
				function()
				{
					var id = $(this).attr("id");
					var _id = utils.get_itemid(id);
					if (!utils.item_exist(_id, arr))
					{
						arr.push(_id);
					}
				});
		utils.set_data(form.find("#members"), 'members', arr);
		set_alt_css(form, "#members");
	}

	function set_alt_css(form, members)
	{
		form.find(members + " > div").removeClass("ui-state-default");
		form.find(members + " > div").removeClass("ui-state-hover");
		form.find(members + " > div:odd").addClass("ui-state-default");
		form.find(members + " > div:even").addClass("ui-state-hover");
	}

	function update_list()
	{
		if (list_changed)
		{
			list_changed = false;
			nav_list.show_list();
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
		init_ui_opt();
		$("#left_box").hide();
		$("#id_add").click(show_form);
		$("#id_find").click(nav_list.show_list);
		$("#id_display,#id_selection,#id_find").change(nav_list.show_list);
		$("#id_query").keypress(nav_list.query_keypress);
		$("#id_query").keyup(nav_list.query_keyup);
		utils.remove_dialog("#dialog-add");
		utils.remove_dialog("#dialog-edit");
		utils.init_alert_dialog("#dialog-message");
		utils.init_confirm_delete("#confirm-delete");
		utils.init_list_panel("#list-panel", hide_panel);
		utils.bind_hover($("#id_add,#id_find"));
		nav_list.config.list_url = list_url;
		nav_list.config.list_func = init_list;
		nav_list.init();
	}

	function load()
	{
		return menu.get('/defuser/', init);
	}

	return {
		load:load,
		list:list,
		list_temp : list_temp,
		get_data:get_data,
		add_members:add_members,
		add_member:add_member,
		edit_member:edit_member,
		remove_member:remove_member,
		get_level_data:get_level_data,
		init_form:init_form,
		init_edit_form:init_edit_form,
		save_inner_form:save_inner_form,
		get_ui_opt:get_ui_opt
	};
}());