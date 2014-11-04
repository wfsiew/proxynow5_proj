var wpcontent = (function()
{
	var save_url = "/wpcontent/save/";
	var delete_url = "/wpcontent/delete/";
	var list_url = "/wpcontent/list/";
	var list = {
			panel: '/wpcontent/list/panel/',
			select: '/wpcontent/list/select/'
	};
	var save_temp_url = "/wpcontent/save/temp/";
	var list_temp = {
			panel: '/wpcontent/list/panel/temp/',
			select: '/wpcontent/list/select/temp/'
	}
	
	var save_content_url = "/wpcontent/content/save/";
	var import_url = "/wpcat/import/";
	var export_url = "/wpcontent/export/";
	var popup_dialog_opt = null;
	var popup_dialog_edit_content_opt = null;
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
		popup_dialog_edit_content_opt = {
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
			popup_dialog_edit_content_opt: popup_dialog_edit_content_opt,
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
		utils.remove_dialog("#dialog-add" + sep + data.scope + _prefix);
		$("#dialog_edit_body" + sep + data.scope + data.prefix).empty();
		$("#dialog-edit" + sep + data.scope + data.prefix).dialog('close');
		var url = (data.url == null ? save_url : data.url);
		$("#dialog-add" + sep + data.scope + data.prefix).dialog('option', 'position', position);
		$("#dialog_body" + sep + data.scope + data.prefix).load(url + "?level=" + data.level + scopeq, null,
				function()
				{
					var nextform = $("#save-form" + sep + data.scope + _prefix);
					utils.set_data(nextform.find("#content_list"), 'keywords', []);
					utils.set_data(nextform.find("#content_list"), 'scores', []);
					nextform.find("#id_keyword,#id_score").keypress(function(evt)
							{
								content_keypress(evt, nextform);
							});
					nextform.find(".wpcontent_form1 .add_button").click(function()
							{
								return add_content(nextform);
							});
					nextform.find(".save_button.save").click(data.func_save);
					nextform.find(".save_button.cancel").click(function()
							{
								utils.cancel_dialog(data.level, "#dialog-add" + sep + data.scope);
							});
					nextform.find(".img_import").click(data.func_show_import);
					nextform.find(".img_export").click(data.func_show_export);
					$("#dialog-editext" + sep + data.scope + _prefix).dialog(get_ui_opt().popup_dialog_edit_content_opt);
					$("#dialog-import" + sep + data.scope + _prefix).dialog(get_ui_opt().popup_dialog_import_opt);
					$("#dialog-export" + sep + data.scope + _prefix).dialog(get_ui_opt().popup_dialog_export_opt);
					utils.bind_hover(nextform.find(".save_button,.wpcontent_form1 .add_button"));
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
					nextform.find("#id_keyword,#id_score").keypress(function(evt)
							{
								content_keypress(evt, nextform);
							});
					nextform.find(".wpcontent_form1 .add_button").click(function()
							{
								return add_content(nextform);
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
					$("#dialog-editcontent" + sep + data.scope + _prefix).dialog(get_ui_opt().popup_dialog_edit_content_opt);
					$("#dialog-import" + sep + data.scope + _prefix).dialog(get_ui_opt().popup_dialog_import_opt);
					$("#dialog-export" + sep + data.scope + _prefix).dialog(get_ui_opt().popup_dialog_export_opt);
					set_items(nextform);
					utils.bind_hover(nextform.find(".save_button,.wpcontent_form1 .add_button"));
					$("#dialog-edit" + sep + data.scope + data.prefix).dialog('open');
				});
	}

	function init_edit_content_form(data)
	{
		var offset = $(data.self).offset();
		var position = [offset.left, utils.get_elm_top(offset.top)];
		var _prefix = '_' + data.level;
		var sep = (data.scope == '' ? '' : '-');
		var scopeq = (data.scope == '' ? '' : '&scope=' + data.scope);
		utils.remove_dialog("#dialog-editcontent" + sep + data.scope + _prefix);
		var url = (data.url == null ? save_content_url : data.url);
		$("#dialog-editcontent" + sep + data.scope + data.prefix).dialog('option', 'position', position);
		$("#dialog_editcontent_body" + sep + data.scope + data.prefix).load(url + "?level=" + data.level + scopeq, null,
				function()
				{
					var nextform = $("#save-contentform" + sep + data.scope + _prefix);
					nextform.find("#id_keyword").val(data.keywordvalue);
					nextform.find("#id_score").val(data.scorevalue);
					nextform.find(".save_button.save").click(function()
							{
								return update_content(data);
							});
					nextform.find(".save_button.cancel").click(function()
							{
								utils.cancel_dialog(data.level, "#dialog-editcontent" + sep + data.scope);
							});
					utils.bind_hover(nextform.find(".save_button"));
					$("#dialog-editcontent" + sep + data.scope + data.prefix).dialog('open');
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
					utils.set_data($("#save-form").find("#content_list"), 'keywords', []);
					utils.set_data($("#save-form").find("#content_list"), 'scores', []);
					$("#left_box").css('width', '300px');
					$("#id_keyword,#id_score").keypress(function(evt)
							{
								content_keypress(evt, form);
							});
					$(".wpcontent_form1 .add_button").click(function()
							{
								return add_content(form);
							});
					$(".save_button.save").click(func_save);
					$(".save_button.cancel,.form_title div.close").click(utils.cancel_form);
					$(".img_import").click(show_import);
					$(".img_export").click(show_export);
					$("#dialog-editcontent").dialog(popup_dialog_edit_content_opt);
					$("#dialog-import").dialog(popup_dialog_import_opt);
					$("#dialog-export").dialog(popup_dialog_export_opt);
					utils.bind_hover($(".save_button,.form_title div.close,.wpcontent_form1 .add_button"));
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
					$("#id_keyword,#id_score").keypress(function(evt)
							{
								content_keypress(evt, form);
							});
					$(".wpcontent_form1 .add_button").click(function()
							{
								return add_content(form);
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
					$("#dialog-editcontent").dialog(popup_dialog_edit_content_opt);
					$("#dialog-import").dialog(popup_dialog_import_opt);
					$("#dialog-export").dialog(popup_dialog_export_opt);
					set_items(form);
					utils.bind_hover($(".save_button,.form_title div.close,.wpcontent_form1 .add_button"));
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

	function set_export_text(prevform, currform)
	{
		var delimiter = '\n';
		var arr1 = prevform.find("#content_list").data('keywords');
		var arr2 = prevform.find("#content_list").data('scores');
		if (arr1 != null && arr2 != null)
		{
			var exporttxt = '';
			var n = arr1.length;
			for (var i = 0; i < n; i++)
			{
				if ($.trim(arr1[i]) == '')
					continue;

				if (i < n - 1)
					exporttxt += arr1[i] + ',' + arr2[i] + delimiter;

				else
					exporttxt += arr1[i] + ',' + arr2[i];
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

	function content_keypress(evt, form)
	{
		if (evt.keyCode == '13')
		{
			evt.preventDefault();
			evt.stopPropagation();
			add_content(form);
		}
	}

	function add_content(form)
	{
		var k = form.find("#id_keyword").val();
		var s = form.find("#id_score").val();
		if (k == '' || s == '')
			return false;

		if (!$.isNumeric(s - 0))
		{
			form.find("#id_score").val('');
			return false;
		}

		var arr1 = [k];
		var arr2 = [s];
		add_contents(form, arr1, arr2);
		form.find("#id_keyword,#id_score").val('');
		return false;
	}

	function add_contents(form, buff1, buff2)
	{
		var arr1 = form.find("#content_list").data('keywords');
		var arr2 = form.find("#content_list").data('scores');
		var n = 0;
		var l = null;
		if (buff1 == null || buff2 == null)
			return;

		else if (buff1.length > 0)
		{
			n = buff1.length;
			l = form.find("#content_list > table tbody");
			for (var i = 0; i < n; i++)
			{
				var k = buff1[i];
				var s = buff2[i];
				if (k == '' || s == '')
					continue;

				if (!$.isNumeric(s - 0))
					continue;

				if (!utils.item_exist(k, arr1))
				{
					arr1.push(k);
					arr2.push(s);
					var data = {
							click: 'wpcontent.remove_content(this)',
							editclick: 'wpcontent.edit_content(this)',
							keyword: k,
							score: s
					};
					var h = new EJS({url: '/media/tpl/contentfilter_item.ejs'}).render(data);
					l.append(h);
				}
			}

			utils.set_data(form.find("#content_list"), 'keywords', arr1);
			utils.set_data(form.find("#content_list"), 'scores', arr2);
			set_alt_css(form, "#content_list");
		}
	}

	function remove_content(o)
	{
		var item = $(o);
		var p = item.parent();
		var k = p.next().next().html();
		var s = p.next().next().next().html();
		var form = utils.get_parent(item, 7);
		var arr1 = form.find("#content_list").data('keywords');
		var arr2 = form.find("#content_list").data('scores');
		var i = $.inArray(k, arr1);
		if (i >= 0)
		{
			arr1.splice(i, 1);
			arr2.splice(i, 1);
			utils.set_data(form.find("#content_list"), 'keywords', arr1);
			utils.set_data(form.find("#content_list"), 'scores', arr2);
		}

		p.parent().remove();
		set_alt_css(form, "#content_list");
		return false;
	}

	function edit_content(obj)
	{
		var item = $(obj);
		var p = item.parent();
		var k = p.next().html();
		var s = p.next().next().html();
		var form = utils.get_parent(item, 8);
		var form_id = form.attr("id");
		var scope = utils.get_form_scope(form_id);
		var arr1 = form.find("#content_list").data('keywords');
		var arr2 = form.find("#content_list").data('scores');
		var i = $.inArray(k, arr1);
		if (i >= 0)
		{
			var o = get_form_level_data(form);
			var self = item;
			var data = {
					self: self,
					keywordvalue: k,
					scorevalue: s,
					level: o.level,
					prefix: o.prefix,
					scope: scope
			};
			init_edit_content_form(data);
			return false;
		}

		return false;
	}

	function update_content(o)
	{
		var i = o.level - 1;
		var sep = (o.scope == '' ? '' : '-');
		var prefix = (o.level < 1 ? '' : '_' + o.level);
		var _prefix = (i < 1 ? '' : '_' + i);
		var currform = $("#save-contentform" + sep + o.scope + prefix);
		var prevform = $("#save-form" + sep + o.scope + _prefix);
		var keywordvalue = currform.find("#id_keyword").val();
		var scorevalue = currform.find("#id_score").val();
		if ($.trim(keywordvalue) == '' || $.trim(scorevalue) == '')
			return;

		if (!$.isNumeric(scorevalue - 0))
			return;

		var arr1 = prevform.find("#content_list").data('keywords');
		var arr2 = prevform.find("#content_list").data('scores');
		var j = $.inArray(o.keywordvalue, arr1);
		if (j >= 0)
		{
			arr1[j] = keywordvalue;
			arr2[j] = scorevalue;
			$(o.self).parent().next().html(keywordvalue);
			$(o.self).parent().next().next().html(scorevalue);
			utils.set_data(prevform.find("#content_list"), 'keywords', arr1);
			utils.set_data(prevform.find("#content_list"), 'scores', arr2);
			utils.cancel_dialog(o.level, "#dialog-editcontent" + sep + o.scope);
		}
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
		var buf = null;
		if ($.trim(txt) == '')
			return;

		var j = txt.indexOf('\n');
		if (j >= 0)
		{
			arr = txt.split('\n');
			buf = get_contents(arr);
			add_contents(prevform, buf.keywords, buf.scores);
			utils.cancel_dialog(o.level, "#dialog-import" + sep + o.scope);
			return;
		}

		// only have 1 item
		arr = [txt];
		buf = get_contents(arr);
		add_contents(prevform, buf.keywords, buf.scores);
		utils.cancel_dialog(o.level, "#dialog-import" + sep + o.scope);
	}

	function get_contents(arr)
	{
		var n = arr.length;
		var buff1 = [];
		var buff2 = [];
		for (var i = 0; i < n; i++)
		{
			var o = arr[i].split(',');
			if (o == null)
				continue;

			if (o.length != 2)
				continue;

			if ($.trim(o[0]) == '' || $.trim(o[1]) == '')
				continue;

			if (!$.isNumeric(o[1]))
				continue;

			buff1.push(o[0]);
			buff2.push(o[1]);
		}

		return {
			keywords: buff1,
			scores: buff2
		};
	}

	function get_data(form, arg, savetype)
	{
		var arr1 = form.find("#content_list").data('keywords');
		var arr2 = form.find("#content_list").data('scores');
		var data = {
				name: form.find("#id_name").val(),
				comment: form.find("#id_comment").val(),
				keywords: arr1.join('||'),
				scores: arr2.join('||'),
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
		var arr1 = [];
		var arr2 = [];
		form.find("#content_list table tbody tr").each(
				function()
				{
					var p = $(this).children().next();
					var k = p.next().html();
					var s = p.next().next().html();
					if (!utils.item_exist(k, arr1))
					{
						arr1.push(k);
						arr2.push(s);
					}
				});
		utils.set_data(form.find("#content_list"), 'keywords', arr1);
		utils.set_data(form.find("#content_list"), 'scores', arr2);
		set_alt_css(form, "#content_list");
	}

	function set_alt_css(form, div)
	{
		form.find(div + " > table tbody tr").removeClass("ui-state-default");
		form.find(div + " > table tbody tr").removeClass("ui-state-hover");
		form.find(div + " > table tbody tr:odd").addClass("ui-state-default");
		form.find(div + " > table tbody tr:even").addClass("ui-state-hover");
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
		return menu.get('/wpcontent/', init);
	}

	return {
		load:load,
		list:list,
		list_temp:list_temp,
		init:init,
		edit_content:edit_content,
		remove_content:remove_content,
		get_level_data:get_level_data,
		init_form:init_form,
		init_edit_form:init_edit_form,
		init_edit_content_form:init_edit_content_form,
		init_import_form:init_import_form,
		init_export_form:init_export_form,
		save_inner_form:save_inner_form,
		get_ui_opt: get_ui_opt,
		save_temp_url:save_temp_url
	};
}());