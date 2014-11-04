/*
 * @include "utils.js"
 * @include "defnet.js"
 */

var appctrlrule = (function()
{
	var save_url = "/appctrlrule/save/";
	var delete_url = "/appctrlrule/delete/";
	var update_enable_url = "/appctrlrule/save/enable/";
	var update_location_url = "/appctrlrule/save/location/";
	var list_url = "/appctrlrule/list/";
	var app_ctrl = {
			save_url: "/appctrl/save/"
	};
	var drag_opt_1 = null;
	var drag_opt_2 = null;
	var drag_opt_3 = null;
	var sort_opt = null;

	function init_ui_opt()
	{
		drag_opt_1 = {
				revert: true,
				snap: false,
				revertDuration: 0,
				zIndex: 1001,
				appendTo: 'body',
				helper: 'clone',
				scope: 'skiplist',
				drag: utils.add_drag_css,
				stop: utils.remove_drag_css
		};
		drag_opt_2 = {
				revert: true,
				snap: false,
				revertDuration: 0,
				zIndex: 1001,
				appendTo: 'body',
				helper: 'clone',
				scope: 'applyto',
				drag: utils.add_drag_css,
				stop: utils.remove_drag_css
		};
		drag_opt_3 = {
				revert: true,
				snap: false,
				revertDuration: 0,
				zIndex: 1001,
				appendTo: 'body',
				helper: 'clone',
				scope: 'whichapp',
				drag: utils.add_drag_css,
				stop: utils.remove_drag_css
		};
		sort_opt = {
				items: 'tr',
				start: function(evt, ui)
				{
					var o = $(".list_table > tbody > tr > td[id]").sortable('toArray');
					$(".list_table").data('arrold', o);
					utils.set_data($(".list_table"), 'arrold', o);
				},
				update: func_update_location
		};
	}

	function show_form()
	{
		$("#left_box").load(save_url, null,
				function()
				{
					var form = $("#save-form");
					init_list_data(form);
					$("#left_box").css('width', '300px');
					$(".save_button.save").click(func_save);
					$(".save_button.cancel,.form_title div.close").click(utils.cancel_form);
					init_list_cmd();
					init_list_droppable();
					init_dialog();
					utils.bind_hover($(".save_button,.form_title div.close"));
					$("#left_box").show();
				});
		return false;
	}
	
	function init_list_data(form)
	{
		utils.set_data(form.find("#id_skiplist"), 'skiplist', []);
		utils.set_data(form.find("#id_applyto"), 'applyto', []);
		utils.set_data(form.find("#id_whichapp"), 'whichapp', []);
	}
	
	function init_list_cmd()
	{
		$("#skiplist .img_folder").click(show_all1);
		$("#skiplist .img_add").click(show_add1);
		$("#applyto .img_folder").click(show_all2);
		$("#applyto .img_add").click(show_add2);
		$("#whichapp .img_folder").click(show_all3);
	}
	
	function init_list_droppable()
	{
		var hoverclass = 'ui-state-active';
		$("#id_skiplist").droppable({
			hoverClass: hoverclass,
			scope: 'skiplist',
			drop: function(evt, ui)
			{
				var o = ui.draggable;
				add_dragged_skiplist(o);
			}
		});
		$("#id_applyto").droppable({
			hoverClass: hoverclass,
			scope: 'applyto',
			drop: function(evt, ui)
			{
				var o = ui.draggable;
				add_dragged_applyto(o);
			}
		});
		$("#id_whichapp").droppable({
			hoverClass: hoverclass,
			scope: 'whichapp',
			drop: function(evt, ui)
			{
				var o = ui.draggable;
				add_dragged_whichapp(o);
			}
		});
	}
	
	function init_dialog()
	{
		$("#dialog-add-skiplist").dialog(defnet.get_ui_opt().popup_dialog_opt);
		$("#dialog-edit-skiplist").dialog(defnet.get_ui_opt().popup_dialog_opt);
		$("#dialog-add-applyto").dialog(defnet.get_ui_opt().popup_dialog_opt);
		$("#dialog-edit-applyto").dialog(defnet.get_ui_opt().popup_dialog_opt);
	}
	
	function save_success()
	{
		utils.cancel_form();
		hide_panel();
		nav_list.show_list();
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
					$(".save_button.cancel,.form_title div.close").click(utils.cancel_form);
					init_list_cmd();
					init_list_droppable();
					init_dialog();
					set_items();
					utils.bind_hover($(".save_button,.form_title div.close"));
					$("#left_box").show();
				});
	}

	function func_save()
	{
		var data = get_data($("#save-form"), "", "");
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
		var data = get_data($("#save-form"), arg, "update");
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
		var search_by = $("#id_selection").val();
		var keyword = $("#id_query").val();
		var data = {
				id: arg,
				pgnum: currpg,
				pgsize: pgsize,
				find: search_by,
				text: keyword
		};
		$.post(delete_url, data,
				function(result)
				{
					if (result.indexOf("success") == 0)
					{
						nav_list.update_list();
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

	function func_update_enable()
	{
		var sw = $(this);
		var o = utils.get_parent(this, 2);
		var arg = o.prev().attr("id");
		var data = null;
		if (sw.hasClass('sw-on'))
		{
			//enable
			data = {
					id: arg,
					enable: 1
			};
			$.post(update_enable_url, data,
					function(result)
					{
						if (result == "success")
						{
							sw.next().removeClass('redicon');
							sw.next().addClass('greyicon');
							sw.removeClass('greyicon');
							sw.addClass('greenicon');
						}
		
						else
						{
							utils.show_dialog(2, result);
						}
					});
		}

		else
		{
			//disable
			data = {
					id: arg,
					enable: 0
			};
			$.post(update_enable_url, data,
					function(result)
					{
						if (result == "success")
						{
							sw.prev().removeClass('greenicon');
							sw.prev().addClass('greyicon');
							sw.removeClass('greyicon');
							sw.addClass('redicon');
						}
		
						else
						{
							utils.show_dialog(2, result);
						}
					});
		}

		return false;
	}

	function func_update_location(evt, ui)
	{
		var o = $(".list_table > tbody > tr > td[id]").sortable('toArray');
		var arrold = $(".list_table").data('arrold');
		var id = ui.item.children().attr("id");
		var loc = 0;
		for (var i = 0; i < o.length; i++)
		{
			if (o[i].id == id)
			{
				loc = i + 1;
				break;
			}
		}
		var swapid = arrold[loc - 1].id;
		var data = {
				id: id,
				swapid: swapid
		};
		$.post(update_location_url, data,
				function(result)
				{
					if (result == "success")
					{
						nav_list.update_list();
					}
		
					else
					{
						utils.show_dialog(2, result);
					}
				});
	}

	function get_data(form, arg, savetype)
	{
		var skiplist = form.find("#id_skiplist").data('skiplist');
		var applyto = form.find("#id_applyto").data('applyto');
		var arrskiplist = skiplist.join(',');
		var arrapplyto = applyto.join(',');
		var data = {
				name: form.find("#id_name").val(),
				location: form.find("#id_location").val(),
				action: form.find("#id_action").val(),
				comment: form.find("#id_comment").val(),
				skiplist: arrskiplist,
				applyto: arrapplyto,
				id: arg,
				save_type: savetype
		}

		return data;
	}

	function hide_panel()
	{
		var isopen = $("#list-panel").dialog('isOpen');
		if (isopen)
			$("#list-panel").dialog('close');

		$("#leftcolumn").show();
	}

	function show_all1()
	{
		$("#leftcolumn").hide();
		$("#list_body").load(defnet.list.panel, null,
				function()
				{
					$(".add_button").click(add_skiplist_);
					$(".drag_zone").draggable(drag_opt_1);
					$("#id_filters").change(filter_list1);
					$("#id_filter_text").keyup(function()
							{
								utils.countdown_filter(filter_list1);
							});
					$("#id_filter_text").keydown(utils.stop_filter_timer);
					init_tooltip();
					utils.bind_hover($(".add_button"));
					$("#list-panel").dialog('open');
				});
		return false;
	}

	function filter_list1()
	{
		var search_by_qry = "?find=" + $("#id_filters").val();
		var keyword = $("#id_filter_text").val();
		var s = (search_by_qry == '?find=0' && keyword == "" ? "" : search_by_qry + "&text=" + keyword);
		$("#panel_body").load(defnet.list.select + s, null,
				function()
				{
					$(".drag_zone").draggable(drag_opt_1);
					defnet.init_tooltip();
				});
	}

	function show_all2()
	{
		$("#leftcolumn").hide();
		$("#list_body").load(defnet.list.panel, null,
				function()
				{
					$(".add_button").click(add_applyto_);
					$(".drag_zone").draggable(drag_opt_2);
					$("#id_filters").change(filter_list2);
					$("#id_filter_text").keyup(function()
							{
								utils.countdown_filter(filter_list2);
							});
					$("#id_filter_text").keydown(utils.stop_filter_timer);
					defnet.init_tooltip();
					utils.bind_hover($(".add_button"));
					$("#list-panel").dialog('open');
				});
		return false;
	}

	function filter_list2()
	{
		var search_by_qry = "?find=" + $("#id_filters").val();
		var keyword = $("#id_filter_text").val();
		var s = (search_by_qry == '?find=0' && keyword == "" ? "" : search_by_qry + "&text=" + keyword);
		$("#panel_body").load(defnet.list.select + s, null,
				function()
				{
					$(".drag_zone").draggable(drag_opt_2);
					defnet.init_tooltip();
				});
	}

	function show_all3()
	{
		$("#leftcolumn").hide();
		$("#list_body").load('/appctrlapplist/list/panel/', null,
				function()
				{
					$(".add_button").click(add_whichapp_);
					$(".drag_zone").draggable(drag_opt_3);
					$("#id_filters").change(filter_list3);
					$("#id_filter_text").keyup(function()
							{
								utils.countdown_filter(filter_list3);
							});
					$("#id_filter_text").keydown(utils.stop_filter_timer);
					utils.bind_hover($(".add_button"));
					$("#list-panel").dialog('open');
				});
		return false;
	}

	function filter_list3()
	{
		var search_by_qry = "?find=" + $("#id_filters").val();
		var keyword = $("#id_filter_text").val();
		var s = (search_by_qry == '?find=0' && keyword == "" ? "" : search_by_qry + "&text=" + keyword);
		$("#panel_body").load('/appctrlapplist/list/select/' + s, null,
				function()
				{
					$(".drag_zone").draggable(drag_opt_3);
				});
	}

	function show_all_1()
	{
		return show_all_helper(defnet.add_members, this);
	}

	function show_all_2()
	{
		return show_all_helper(defnet.add_members, this);
	}

	function show_all_helper(func_add, _this_)
	{
		var isopen = $("#list-panel").dialog('isOpen');
		if (isopen)
		{
			$("#list-panel").dialog('close');
			return false;
		}

		$("#leftcolumn").hide();
		var form = utils.get_parent(_this_, 4);
		$("#list_body").load(defnet.list.panel, null,
				function()
				{
					$(".add_button").click(function()
							{
								func_add(form);
							});
					$(".drag_zone").draggable(defnet.get_ui_opt().drag_opt);
					$("#id_filters").change(filter_list);
					$("#id_filter_text").keyup(function()
							{
								utils.countdown_filter(filter_list);
							});
					$("#id_filter_text").keydown(utils.stop_filter_timer);
					defnet.init_tooltip();
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
		$("#panel_body").load(defnet.list.select + s, null,
				function()
				{
					$(".drag_zone").draggable(defnet.get_ui_opt().drag_opt);
					defnet.init_tooltip();
				});
	}

	function show_add1()
	{
		var self = this;
		var data = {
				self: self,
				scope: 'skiplist',
				func_save: save_to_skiplist,
				func_show_all: show_all_1,
				func_show_add: show_add_1
		};
		show_add_init_helper(data);
		return false;
	}

	function show_add2()
	{
		var self = this;
		var data = {
				self: self,
				scope: 'applyto',
				func_save: save_to_applyto,
				func_show_all: show_all_2,
				func_show_add: show_add_2
		};
		show_add_init_helper(data);
		return false;
	}

	function show_add_1()
	{
		var self = this;
		var data = {
				self: self,
				scope: 'skiplist',
				func_show_all: show_all_1,
				func_show_add: show_add_1
		};
		show_add_helper(data);
		return false;
	}

	function show_add_2()
	{
		var self = this;
		var data = {
				self: self,
				scope: 'applyto',
				func_show_all: show_all_2,
				func_show_add: show_add_2
		};
		show_add_helper(data);
		return false;
	}

	function show_add_init_helper(data)
	{
		data['level'] = 1;
		data['prefix'] = '';
		defnet.init_form(data);
	}

	function show_add_helper(data)
	{
		var o = defnet.get_level_data(data.self);
		data['level'] = o.level;
		data['prefix'] = o.prefix;
		defnet.init_form(data);
	}

	function save_to_skiplist()
	{
		var o = {
				level: 1,
				scope: 'skiplist',
				func_add: add_skiplist
		};
		return defnet.save_inner_form(o);
	}

	function save_to_applyto()
	{
		var o = {
				level: 1,
				scope: 'applyto',
				func_add: add_applyto
		};
		return defnet.save_inner_form(o);
	}

	function add_dragged_skiplist(o)
	{
		var item = $(o);
		var name = item.html();
		var id = item.parent().attr("id");
		add_skiplist(id, name);
	}

	function add_skiplist(id, name)
	{
		var _id = parseInt(id, 10);
		var arr = $("#id_skiplist").data('skiplist');
		if (!utils.item_exist(_id, arr))
		{
			arr.push(_id);
			utils.set_data($("#id_skiplist"), 'skiplist', arr);
			var data = {
					id_prefix: 'skiplist_',
					id: _id,
					click: 'appctrlrule.remove_skiplist(this)',
					editclick: 'appctrlrule.edit_skiplist(this)',
					name: name
			};
			var h = new EJS({url: '/media/tpl/list_item.ejs'}).render(data);
			$("#id_skiplist").append(h);
		}

		utils.set_alt_css("#id_skiplist");
	}

	function add_dragged_applyto(o)
	{
		var item = $(o);
		var name = item.html();
		var id = item.parent().attr("id");
		add_applyto(id, name);
	}

	function add_applyto(id, name)
	{
		var _id = parseInt(id, 10);
		var arr = $("#id_applyto").data('applyto');
		if (!utils.item_exist(_id, arr))
		{
			arr.push(_id);
			utils.set_data($("#id_applyto"), 'applyto', arr);
			var data = {
					id_prefix: 'applyto_',
					id: _id,
					click: 'appctrlrule.remove_applyto(this)',
					editclick: 'appctrlrule.edit_applyto(this)',
					name: name
			};
			var h = new EJS({url: '/media/tpl/list_item.ejs'}).render(data);
			$("#id_applyto").append(h);
		}

		utils.set_alt_css("#id_applyto");
	}

	function add_dragged_whichapp(o)
	{
		var item = $(o);
		var name = item.html();
		var id = item.parent().attr("id");
		add_whichapp(id, name);
	}

	function add_whichapp(id, name)
	{
		var _id = parseInt(id, 10);
		var arr = $("#id_whichapp").data('whichapp');
		if (!utils.item_exist(_id, arr))
		{
			arr.push(_id);
			utils.set_data($("#id_whichapp"), 'whichapp', arr);
			var data = {
					id_prefix: 'whichapp_',
					id: _id,
					click: 'appctrlrule.remove_whichapp(this)',
					editclick: 'false',
					name: name
			};
			var h = new EJS({url: '/media/tpl/list_item.ejs'}).render(data);
			$("#id_whichapp").append(h);
		}

		utils.set_alt_css("#id_whichapp");
	}

	function add_skiplist_()
	{
		$("input[name=chklist]:checked").each(
				function()
				{
					var o = $(this);
					var id = o.parent().attr("id");
					var name = o.next().html();
					add_skiplist(id, name);
				});
	}

	function add_applyto_()
	{
		$("input[name=chklist]:checked").each(
				function()
				{
					var o = $(this);
					var id = o.parent().attr("id");
					var name = o.next().html();
					add_applyto(id, name);
				});
	}

	function add_whichapp_()
	{
		$("input[name=chklist]:checked").each(
				function()
				{
					var o = $(this);
					var id = o.parent().attr("id");
					var name = o.next().html();
					add_whichapp(id, name);
				});
	}

	function remove_skiplist(o)
	{
		var item = $(o);
		var id = item.parent().attr("id");
		var _id = utils.get_itemid(id);
		var form = utils.get_parent(item, 5);
		var arr = form.find("#id_skiplist").data('skiplist');
		var i = $.inArray(_id, arr);
		if (i >= 0)
		{
			arr.splice(i, 1);
			utils.set_data(form.find("#id_skiplist"), 'skiplist', arr);
		}

		form.find("#" + id).remove();
		utils.set_alt_css("#id_skiplist");
		return false;
	}

	function remove_applyto(o)
	{
		var item = $(o);
		var id = item.parent().attr("id");
		var _id = utils.get_itemid(id);
		var form = utils.get_parent(item, 5);
		var arr = form.find("#id_applyto").data('applyto');
		var i = $.inArray(_id, arr);
		if (i >= 0)
		{
			arr.splice(i, 1);
			utils.set_data(form.find("#id_applyto"), 'applyto', arr);
		}

		form.find("#" + id).remove();
		utils.set_alt_css("#id_applyto");
		return false;
	}

	function remove_whichapp(o)
	{
		var item = $(o);
		var id = item.parent().attr("id");
		var _id = utils.get_itemid(id);
		var form = utils.get_parent(item, 5);
		var arr = form.find("#id_whichapp").data('whichapp');
		var i = $.inArray(_id, arr);
		if (i >= 0)
		{
			arr.splice(i, 1);
			utils.set_data(form.find("#id_whichapp"), 'whichapp', arr);
		}

		form.find("#" + id).remove();
		utils.set_alt_css("#id_whichapp");
		return false;
	}
	
	function edit_skiplist(obj)
	{
		var item = $(obj);
		var id = item.parent().attr("id");
		var _id = utils.get_itemid(id);
		var self = item;
		var data = {
				self: self,
				id: _id,
				level: 1,
				prefix: '',
				scope: 'skiplist',
				func_update: update_skiplist,
				func_show_all: show_all_1,
				func_show_add: show_add_1
		};
		defnet.init_edit_form(data);
		return false;
	}
	
	function update_skiplist(id, name, self)
	{
		$(self).next().html(name);
		var isopen = $("#list-panel").dialog('isOpen');
		if (isopen)
			filter_list1();
	}
	
	function edit_applyto(obj)
	{
		var item = $(obj);
		var id = item.parent().attr("id");
		var _id = utils.get_itemid(id);
		var self = item;
		var data = {
				self: self,
				id: _id,
				level: 1,
				prefix: '',
				scope: 'applyto',
				func_update: update_applyto,
				func_show_all: show_all_2,
				func_show_add: show_add_2
		};
		defnet.init_edit_form(data);
		return false;
	}
	
	function update_applyto(id, name, self)
	{
		$(self).next().html(name);
		var isopen = $("#list-panel").dialog('isOpen');
		if (isopen)
			filter_list2();
	}

	function set_items()
	{
		var form = $("#save-form");
		var arrskiplist = [];
		var arrapplyto = [];
		var arrwhichapp = [];
		form.find("#id_skiplist > div").each(
				function()
				{
					var id = $(this).attr("id");
					var _id = utils.get_itemid(id);
					if (!utils.item_exist(_id, arrskiplist))
					{
						arrskiplist.push(_id);
					}
				});
		form.find("#id_applyto > div").each(
				function()
				{
					var id = $(this).attr("id");
					var _id = utils.get_itemid(id);
					if (!utils.item_exist(_id, arrapplyto))
					{
						arrapplyto.push(_id);
					}
				});
		form.find("#id_whichapp > div").each(
				function()
				{
					var id = $(this).attr("id");
					var _id = utils.get_itemid(id);
					if (!utils.item_exist(_id, arrwhichapp))
					{
						arrwhichapp.push(_id);
					}
				});
		utils.set_data(form.find("#id_skiplist"), 'skiplist', arrskiplist);
		utils.set_data(form.find("#id_applyto"), 'applyto', arrapplyto);
		utils.set_data(form.find("#id_whichapp"), 'whichapp', arrwhichapp);
		utils.set_alt_css("#id_skiplist");
		utils.set_alt_css("#id_applyto");
		utils.set_alt_css("#id_whichapp");
	}

	function enable_appctrl()
	{
		var data = {
				value: 1
		};
		$.post(app_ctrl.save_url, data,
				function(result)
				{
					if (result == "success")
					{
						$("#sw > .sw-off").removeClass('redicon');
						$("#sw > .sw-off").addClass('greyicon');
						$("#sw > .sw-on").removeClass('greyicon');
		                $("#sw > .sw-on").addClass('greenicon');
					}
				});
	}

	function disable_appctrl()
	{
		var data = {
				value: 0
		};
		$.post(app_ctrl.save_url, data,
				function(result)
				{
					if (result == "success")
					{
						$("#sw > .sw-on").removeClass('greenicon');
						$("#sw > .sw-on").addClass('greyicon');
						$("#sw > .sw-off").removeClass('greyicon');
		                $("#sw > .sw-off").addClass('redicon');
					}
				});
	}

	function init_list()
	{
		$(".list_button.edit").click(func_edit);
		$(".list_button.delete").click(func_delete);
		$(".list_button.clone").click(func_clone);
		$(".switch_button > .sw-on").click(func_update_enable);
		$(".switch_button > .sw-off").click(func_update_enable);
		$(".list_table").sortable(sort_opt);
	}

	function init()
	{
		init_ui_opt();
		$("#left_box").hide();
		$("#id_add").click(show_form);
		$("#id_find").click(nav_list.show_list);
		$("#id_display,#id_selection").change(nav_list.show_list);
		$("#sw > .sw-on").click(enable_appctrl);
		$("#sw > .sw-off").click(disable_appctrl);
		$("#id_query").keypress(nav_list.query_keypress);
		$("#id_query").keyup(nav_list.query_keyup);
		utils.remove_dialog("#dialog-add-skiplist");
		utils.remove_dialog("#dialog-edit-skiplist");
		utils.remove_dialog("#dialog-add-applyto");
		utils.remove_dialog("#dialog-edit-applyto");
		utils.init_alert_dialog("#dialog-message");
		utils.init_list_panel("#list-panel", hide_panel);
		utils.bind_hover($("#id_add,#id_find"));
		nav_list.config.list_url = list_url;
		nav_list.config.list_func = init_list;
		nav_list.init();
	}
	
	function load()
	{
		return menu.get('/appctrlrule/', init);
	}

	return {
		load:load,
		edit_skiplist:edit_skiplist,
		remove_skiplist:remove_skiplist,
		edit_applyto:edit_applyto,
		remove_applyto:remove_applyto,
		remove_whichapp:remove_whichapp
	}
}());