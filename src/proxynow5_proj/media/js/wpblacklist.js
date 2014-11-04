var wpblacklist = (function()
{
	var save_url = "/wpblacklist/save/";
	var delete_url = "/wpblacklist/delete/";
	var list_url = "/wpblacklist/list/";
	var list = {
			panel: '/wpblacklist/list/panel/',
			select: '/wpblacklist/list/select/'
	};
	
	var save_temp_url = "/wpblacklist/save/temp/";
	var list_temp = {
			panel: '/wpblacklist/list/panel/temp/',
			select: '/wpblacklist/list/select/temp/'
	}
	
	var save_url_url = "/wpcat/url/save/";
	var import_url = "/wpcat/import/";
	var export_url = "/wpcat/export/";
	var popup_dialog_opt = null;
	var popup_dialog_edit_url_opt = null;
	var popup_dialog_import_opt = null;
	var popup_dialog_export_opt = null;

	function init_ui_opt()
	{
		popup_dialog_opt = {
				autoOpen: false,
				width: 320,
				resizable: false,
				draggable: false,
				modal: false,
				stack: true,
				zIndex: 1001
		};
		popup_dialog_edit_url_opt = {
				autoOpen: false,
				width: 320,
				resizable: false,
				draggable: false,
				modal: false,
				stack: true,
				zIndex: 1002
		};
		popup_dialog_import_opt = {
				autoOpen: false,
				width: 350,
				resizable: false,
				draggable: false,
				modal: false,
				stack: true,
				zIndex: 1002
		};
		popup_dialog_export_opt = {
				autoOpen: false,
				width: 350,
				resizable: false,
				draggable: false,
				modal: false,
				stack: true,
				zIndex: 1002
		};
	}

	function get_ui_opt()
	{
		init_ui_opt();
		return {
			popup_dialog_opt: popup_dialog_opt,
			popup_dialog_edit_url_opt: popup_dialog_edit_url_opt,
			popup_dialog_import_opt: popup_dialog_import_opt,
			popup_dialog_export_opt: popup_dialog_export_opt
		}
	}

	function init_form(data)
	{
		var offset = $(data.self).offset();
		var position = [offset.left, utils.get_elm_top(offset.top)];
		var _prefix = '_' + data.level;
		var sep = (data.scope == '' ? '' : '-');
		var scopeq = (data.scope == '' ? '' : '&scope=' + data.scope);
		var wizq = (data.url == null ? '' : '&wiz=1');
		utils.remove_dialog("#dialog-add" + sep + data.scope + _prefix);
		$("#dialog_edit_body" + sep + data.scope + data.prefix).empty();
		$("#dialog-edit" + sep + data.scope + data.prefix).dialog('close');
		var url = (data.url == null ? save_url : data.url);
		$("#dialog-add" + sep + data.scope + data.prefix).dialog('option', 'position', position);
		$("#dialog_body" + sep + data.scope + data.prefix).load(url + "?level=" + data.level + scopeq + wizq, null,
				function()
				{
					var nextform = $("#save-form" + sep + data.scope + _prefix);
					utils.set_data(nextform.find("#url_list"), 'urls', []);
					nextform.find("#id_url").keypress(function(evt)
							{
								url_keypress(evt, nextform);
							});
					nextform.find(".wpblacklist_form1 .add_button").click(function()
							{
								return add_url(nextform);
							});
					nextform.find(".save_button.save").click(data.func_save);
					nextform.find(".save_button.cancel").click(function()
							{
								utils.cancel_dialog(data.level, "#dialog-add" + sep + data.scope);
							});
					nextform.find(".img_import").click(data.func_show_import);
					nextform.find(".img_export").click(data.func_show_export);
					$("#dialog-editurl" + sep + data.scope + _prefix).dialog(get_ui_opt().popup_dialog_edit_url_opt);
					$("#dialog-import" + sep + data.scope + _prefix).dialog(get_ui_opt().popup_dialog_import_opt);
					$("#dialog-export" + sep + data.scope + _prefix).dialog(get_ui_opt().popup_dialog_export_opt);
					utils.bind_hover(nextform.find(".save_button,.wpblacklist_form1 .add_button"));
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
		var url = (data.url == null ? save_url : data.url);
		$("#dialog-edit" + sep + data.scope + data.prefix).dialog('option', 'position', position);
		$("#dialog_edit_body" + sep + data.scope + data.prefix).load(url + "?id=" + data.id + "&level=" + data.level + scopeq + wizq, null,
				function()
				{
					var nextform = $("#save-form" + sep + data.scope + _prefix);
					nextform.find("#id_url").keypress(function(evt)
							{
								url_keypress(evt, nextform);
							});
					nextform.find(".wpblacklist_form1 .add_button").click(function()
							{
								return add_url(nextform);
							});
					nextform.find(".save_button.save").click(function()
							{
								return update_inner_form(data);
							});
					nextform.find(".save_button.cancel").click(function()
							{
								utils.cancel_dialog(data.level, "#dialog-edit" + sep + data.scope);
							});
					nextform.find(".img_import").click(data.func_show_import);
					nextform.find(".img_export").click(data.func_show_export);
					$("#dialog-editurl" + sep + data.scope + _prefix).dialog(get_ui_opt().popup_dialog_edit_url_opt);
					$("#dialog-import" + sep + data.scope + _prefix).dialog(get_ui_opt().popup_dialog_import_opt);
					$("#dialog-export" + sep + data.scope + _prefix).dialog(get_ui_opt().popup_dialog_export_opt);
					set_items(nextform);
					utils.bind_hover(nextform.find(".save_button,.wpblacklist_form1 .add_button"));
					$("#dialog-edit" + sep + data.scope + data.prefix).dialog('open');
				});
	}

	function init_edit_url_form(data)
	{
		var offset = $(data.self).offset();
		var position = [offset.left, utils.get_elm_top(offset.top)];
		var _prefix = '_' + data.level;
		var sep = (data.scope == '' ? '' : '-');
		var scopeq = (data.scope == '' ? '' : '&scope=' + data.scope);
		utils.remove_dialog("#dialog-editurl" + sep + data.scope + _prefix);
		var url = (data.url == null ? save_url_url : data.url);
		$("#dialog-editurl" + sep + data.scope + data.prefix).dialog('option', 'position', position);
		$("#dialog_editurl_body" + sep + data.scope + data.prefix).load(url + "?level=" + data.level + scopeq, null,
				function()
				{
					var nextform = $("#save-urlform" + sep + data.scope + _prefix);
					nextform.find("#id_url").val(data.urlvalue);
					nextform.find(".save_button.save").click(function()
							{
								return update_url(data);
							});
					nextform.find(".save_button.cancel").click(function()
							{
								utils.cancel_dialog(data.level, "#dialog-editurl" + sep + data.scope);
							});
					utils.bind_hover(nextform.find(".save_button"));
					$("#dialog-editurl" + sep + data.scope + data.prefix).dialog('open');
				});
	}

	function init_import_form(data)
	{
		var offset = $(data.self).offset();
		var position = [offset.left, utils.get_elm_top(offset.top)];
		var _prefix = '_' + data.level;
		var sep = (data.scope == '' ? '' : '-');
		var scopeq = (data.scope == '' ? '' : '&scope=' + data.scope);
		$("#dialog-import" + sep + data.scope + data.prefix).dialog('option', 'position', position);
		$("#dialog_import_body" + sep + data.scope + data.prefix).load(import_url + "?level=" + data.level + scopeq, null,
				function()
				{
					var nextform = $("#import-form" + sep + data.scope + _prefix);
					nextform.find(".save_button.import").click(function()
							{
								return func_import(data);
							});
					nextform.find(".save_button.cancel").click(function()
							{
								utils.cancel_dialog(data.level, "#dialog-import" + sep + data.scope);
							});
					utils.bind_hover(nextform.find(".save_button"));
					$("#dialog-import" + sep + data.scope + data.prefix).dialog('open');
				});
	}

	function init_export_form(data)
	{
		var offset = $(data.self).offset();
		var position = [offset.left, utils.get_elm_top(offset.top)];
		var _prefix = '_' + data.level;
		var sep = (data.scope == '' ? '' : '-');
		var scopeq = (data.scope == '' ? '' : '&scope=' + data.scope);
		$("#dialog-export" + sep + data.scope + data.prefix).dialog('option', 'position', position);
		$("#dialog_export_body" + sep + data.scope + data.prefix).load(export_url + "?level=" + data.level + scopeq, null,
				function()
				{
					var nextform = $("#export-form" + sep + data.scope + _prefix);
					nextform.find(".save_button.cancel").click(function()
							{
								utils.cancel_dialog(data.level, "#dialog-export" + sep + data.scope);
							});
					nextform.find("#id_delimiter").change(set_export_delimiter);
					utils.bind_hover(nextform.find(".save_button"));
					init_export_data(data, nextform);
					$("#dialog-export" + sep + data.scope + data.prefix).dialog('open');
				});
	}



	function show_form()
	{
		$("#left_box").load(save_url, null,
				function()
				{
					var form = $("#save-form");
					utils.set_data(form.find("#url_list"), 'urls', []);
					$("#left_box").css('width', '300px');
					$("#id_url").keypress(function(evt)
							{
								url_keypress(evt, form);
							});
					$(".wpblacklist_form1 .add_button").click(function()
							{
								return add_url(form);
							});
					$(".save_button.save").click(func_save);
					$(".save_button.cancel,.form_title div.close").click(utils.cancel_form);
					$(".img_import").click(show_import);
					$(".img_export").click(show_export);
					$("#dialog-editurl").dialog(popup_dialog_edit_url_opt);
					$("#dialog-import").dialog(popup_dialog_import_opt);
					$("#dialog-export").dialog(popup_dialog_export_opt);
					utils.bind_hover($(".save_button,.form_title div.close,.wpblacklist_form1 .add_button"));
					$("#left_box").show();
				});

		return false;
	}

	function save_success()
	{
		utils.cancel_form();
		nav_list.show_list();
	}

	function edit_helper(o)
	{
		var arg = $(o.self).parent().attr("id");
		var cloneq = (o.clone == null ? '' : '&clone=1');
		$("#left_box").load(save_url + "?id=" + arg + cloneq, null,
				function()
				{
					var form = $("#save-form");
					$("#left_box").css('width', '300px');
					$("#id_url").keypress(function(evt)
							{
								url_keypress(evt, form);
							});
					$(".wpblacklist_form1 .add_button").click(function()
							{
								return add_url(form);
							});
					$(".save_button.save").click(
							function()
							{
								if (o.clone == null)
									return func_update(arg);

								else
									return func_save();
							});
					$(".save_button.cancel,.form_title div.close").click(utils.cancel_form);
					$(".img_import").click(show_import);
					$(".img_export").click(show_export);
					$("#dialog-editurl").dialog(popup_dialog_edit_url_opt);
					$("#dialog-import").dialog(popup_dialog_import_opt);
					$("#dialog-export").dialog(popup_dialog_export_opt);
					set_items(form);
					utils.bind_hover($(".save_button,.form_title div.close,.wpblacklist_form1 .add_button"));
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
		return list_form.save(o);
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
		return list_form.save(o);
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
		var keyword = $("#id_query").val();
		var data = {
				id: arg,
				pgnum: currpg,
				pgsize: pgsize,
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
		o['url'] = (o.url == null ? save_url : o.url);
		o['func_get_data'] = get_data;
		o['func_show_dialog'] = utils.show_dialog;
		return wpfilter.save(o);
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
		var data = get_data(currform, o.id, savetemp);
		data['level'] = o.level;
		var url = (o.url == null ? save_url : o.url);
		$.post(url, data,
				function(result)
				{
					if (result.success == 1)
					{
						o.func_update(result.id, result.name, o.self);
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
	}

	function init_export_data(o, form)
	{
		var i = o.level - 1;
		var sep = (o.scope == '' ? '' : '-');
		var _prefix = (i < 1 ? '' : '_' + i);
		var prevform = $("#save-form" + sep + o.scope + _prefix);
		set_export_text(prevform, form);
	}

	function set_export_delimiter()
	{
		var form = utils.get_parent(this, 2);
		var formid = form.attr("id");
		var level = utils.get_form_level(formid);
		var scope = utils.get_form_scope(formid);
		var i = level - 1;
		var sep = (scope == '' ? '' : '-');
		var _prefix = (i < 1 ? '' : '_' + i);
		var prevform = $("#save-form" + sep + scope + _prefix);
		set_export_text(prevform, form);
	}

	function set_export_text(prevform, currform)
	{
		var delimiter = get_delimiter(currform);
		var arr = prevform.find("#url_list").data('urls');
		if (arr != null)
		{
			var exporttxt = '';
			var n = arr.length;
			for (var i = 0; i < n; i++)
			{
				if ($.trim(arr[i]) == '')
					continue;

				if (i < n - 1)
					exporttxt += arr[i] + delimiter;

				else
					exporttxt += arr[i];
			}

			currform.find("#id_exporttext").val(exporttxt);
		}
	}

	function show_import()
	{
		var o = get_level_data(this);
		var self = this;
		var data = {
				self: self,
				level: o.level,
				prefix: o.prefix,
				scope: ''
		};
		init_import_form(data);
		return false;
	}

	function show_export()
	{
		var o = get_level_data(this);
		var self = this;
		var data = {
				self: self,
				level: o.level,
				prefix: o.prefix,
				scope: ''
		}
		init_export_form(data);
		return false;
	}

	function url_keypress(evt, form)
	{
		if (evt.keyCode == '13')
		{
			evt.preventDefault();
			evt.stopPropagation();
			add_url(form);
		}
	}

	function add_url(form)
	{
		var v = form.find("#id_url").val();
		if (v == '')
			return false;

		var arr = [v];
		add_urls(form, arr);
		form.find("#id_url").val('');
		return false;
	}

	function add_urls(form, buff)
	{
		var l = form.find("#url_list");
		var arr = l.data('urls');
		var n = 0;
		if (buff == null)
			return;

		else if (buff.length > 0)
		{
			n = buff.length;
			for (var i = 0; i < n; i++)
			{
				var v = buff[i];
				if (v == '')
					continue;

				if (!utils.item_exist(v, arr))
				{
					arr.push(v);
					var data = {
							id_prefix: 'url_',
							id: 'item',
							click: 'wpblacklist.remove_url(this)',
							editclick: 'wpblacklist.edit_url(this)',
							name: v
					};
					var h = new EJS({url: '/media/tpl/list_item.ejs'}).render(data);
					l.append(h);
				}
			}

			utils.set_data(form.find("#url_list"), 'urls', arr);
			set_alt_css(form, "#url_list");
		}
	}

	function remove_url(o)
	{
		var item = $(o);
		var v = item.next().next().html();
		var form = utils.get_parent(item, 4);
		var arr = form.find("#url_list").data('urls');
		var i = $.inArray(v, arr);
		if (i >= 0)
		{
			arr.splice(i, 1)
			utils.set_data(form.find("#url_list"), 'urls', arr);
		}

		item.parent().remove();
		set_alt_css(form, "#url_list");
		return false;
	}

	function edit_url(obj)
	{
		var item = $(obj);
		var urlvalue = item.next().html();
		var form = utils.get_parent(item, 5);
		var form_id = form.attr("id");
		var scope = utils.get_form_scope(form_id);
		var arr = form.find("#url_list").data('urls');
		var i = $.inArray(urlvalue, arr);
		if (i >= 0)
		{
			var o = get_form_level_data(form);
			var self = item;
			var data = {
					self: self,
					urlvalue: urlvalue,
					level: o.level,
					prefix: o.prefix,
					scope: scope
			};
			init_edit_url_form(data);
			return false;
		}

		return false;
	}

	function update_url(o)
	{
		var i = o.level - 1;
		var sep = (o.scope == '' ? '' : '-');
		var prefix = (o.level < 1 ? '' : '_' + o.level);
		var _prefix = (i < 1 ? '' : '_' + i);
		var currform = $("#save-urlform" + sep + o.scope + prefix);
		var prevform = $("#save-form" + sep + o.scope + _prefix);
		var urlvalue = currform.find("#id_url").val();
		if ($.trim(urlvalue) == '')
			return;

		var arr = prevform.find("#url_list").data('urls');
		var j = $.inArray(o.urlvalue, arr);
		if (j >= 0)
		{
			arr[j] = urlvalue;
			$(o.self).next().html(urlvalue);
			utils.set_data(prevform.find("#url_list"), 'urls', arr);
			utils.cancel_dialog(o.level, "#dialog-editurl" + sep + o.scope);
		}
	}

	function get_delimiter(form)
	{
		var delimiter = '\n';
		var v = form.find("#id_delimiter").val();
		if (v == '1')
			delimiter = ';';

		else if (v == '2')
			delimiter = ',';

		return delimiter;
	}

	function func_import(o)
	{
		var i = o.level - 1;
		var sep = (o.scope == '' ? '' : '-');
		var prefix = (o.level < 1 ? '' : '_' + o.level);
		var _prefix = (i < 1 ? '' : '_' + i);
		var currform = $("#import-form" + sep + o.scope + prefix);
		var prevform = $("#save-form" + sep + o.scope + _prefix);
		var txt = currform.find("#id_importtext").val();
		var arr = null;
		if ($.trim(txt) == '')
			return;

		var j = txt.indexOf('\n');
		if (j >= 0)
		{
			arr = txt.split('\n');
			add_urls(prevform, arr);
			utils.cancel_dialog(o.level, "#dialog-import" + sep + o.scope);
			return;
		}

		j = txt.indexOf(',');
		if (j >= 0)
		{
			arr = txt.split(',');
			add_urls(prevform, arr);
			utils.cancel_dialog(o.level, "#dialog-import" + sep + o.scope);
			return;
		}

		j = txt.indexOf(';');
		if (j >= 0)
		{
			arr = txt.split(';');
			add_urls(prevform, arr);
			utils.cancel_dialog(o.level, "#dialog-import" + sep + o.scope);
			return;
		}

		// only have 1 item
		arr = [txt];
		add_urls(prevform, arr);
		utils.cancel_dialog(o.level, "#dialog-import" + sep + o.scope);
	}

	function get_data(form, arg, savetype)
	{
		var arr = form.find("#url_list").data('urls');
		var data = {
				name: form.find("#id_name").val(),
				comment: form.find("#id_comment").val(),
				urls: arr.join('||'),
				id: arg,
				save_type: savetype
		}

		return data;
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
		return {
				level: level,
				prefix: prefix
		};
	}

	function set_items(form)
	{
		var arr = [];
		form.find("#url_list > div").each(
				function()
				{
					var v = $(this).find(".item_edit").next().html();
					if (!utils.item_exist(v, arr))
					{
						arr.push(v);
					}
				});
		utils.set_data(form.find("#url_list"), 'urls', arr);
		set_alt_css(form, "#url_list");
	}

	function set_alt_css(form, members)
	{
		form.find(members + " > div").removeClass("ui-state-default");
		form.find(members + " > div").removeClass("ui-state-hover");
		form.find(members + " > div:odd").addClass("ui-state-default");
		form.find(members + " > div:even").addClass("ui-state-hover");
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
		$("#id_display").change(nav_list.show_list);
		$("#id_query").keypress(nav_list.query_keypress);
		$("#id_query").keyup(nav_list.query_keyup);
		utils.init_alert_dialog("#dialog-message");
		utils.init_confirm_delete("#confirm-delete");
		utils.bind_hover($("#id_add,#id_find"));
		nav_list.config.list_url = list_url;
		nav_list.config.list_func = init_list;
		nav_list.init();
	}

	function load()
	{
		return menu.get('/wpblacklist/', init);
	}

	return {
		load:load,
		list:list,
		list_temp : list_temp,
		init:init,
		edit_url:edit_url,
		remove_url:remove_url,
		get_level_data:get_level_data,
		init_form:init_form,
		init_edit_form:init_edit_form,
		init_edit_url_form:init_edit_url_form,
		init_import_form:init_import_form,
		init_export_form:init_export_form,
		save_inner_form:save_inner_form,
		get_ui_opt: get_ui_opt,
		save_temp_url:save_temp_url
	};
}());