/*
 * @include "utils.js"
 * @include "nav_list.js"
 * @include "defnet.js"
 * @include "defservices.js"
 */

var natpf = (function()
{
	var save_url = "/nat/pf/save/";
	var delete_url = "/nat/pf/delete/";
	var list_url = "/nat/pf/list/";
	var drag_opt_1 = null;
	var drag_opt_2 = null;
	var drag_opt_3 = null;
	
	function init_ui_opt()
	{
		drag_opt_1 = {
				revert: true,
				snap: false,
				revertDuration: 0,
				zIndex: 1001,
				appendTo: 'body',
				helper: 'clone',
				scope: defservices.drop_scope,
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
				scope: defnet.drop_scope,
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
				scope: defservices.drop_scope,
				drag: utils.add_drag_css,
				stop: utils.remove_drag_css
		};
	}
	
	function init_list_cmd()
	{
		$("#orgport .img_folder").click(show_all1);
		$("#orgport .img_add").click(show_add1);
		$("#host .img_folder").click(show_all2);
		$("#host .img_add").click(show_add2);
		$("#newservice .img_folder").click(show_all3);
		$("#newservice .img_add").click(show_add3);
	}
	
	function init_list_droppable()
	{
		var hoverclass = 'ui-state-active';
		$("#id_originalport").droppable({
			hoverClass: hoverclass,
			scope: defservices.drop_scope,
			drop: function(evt, ui)
			{
				var o = ui.draggable;
				add_dragged_originalport(o);
			}
		});
		$("#id_host").droppable({
			hoverClass: hoverclass,
			scope: defnet.drop_scope,
			drop: function(evt, ui)
			{
				var o = ui.draggable;
				add_dragged_host(o);
			}
		});
		$("#id_newservice").droppable({
			hoverClass: hoverclass,
			scope: defservices.drop_scope,
			drop: function(evt, ui)
			{
				var o = ui.draggable;
				add_dragged_newservice(o);
			}
		});
	}
	
	function init_dialog()
	{
		$("#dialog-add-orgport").dialog(defservices.get_ui_opt().popup_dialog_opt);
		$("#dialog-edit-orgport").dialog(defservices.get_ui_opt().popup_dialog_opt);
		$("#dialog-add-host").dialog(defnet.get_ui_opt().popup_dialog_opt);
		$("#dialog-edit-host").dialog(defnet.get_ui_opt().popup_dialog_opt);
		$("#dialog-add-newservice").dialog(defservices.get_ui_opt().popup_dialog_opt);
		$("#dialog-edit-newservice").dialog(defservices.get_ui_opt().popup_dialog_opt);
	}
	
	function show_form()
	{
		$("#left_box").load(save_url, null,
				function()
				{
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
				text: keyword
		};
		$.post(delete_url, data,
				function(result)
				{
					if (result.indexOf("success") == 0)
					{
						var arr = result.split('|');
						nav_list.set_item_msg(arr[1]);
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
	
	function get_data(form, arg, savetype)
	{
		var orgport = $("#id_originalport").data('orgport');
		var host = $("#id_host").data('host');
		var newservice = $("#id_newservice").data('newservice');
		var data = {
				originalPort: orgport,
				host: host,
				newService: newservice,
				comment: form.find("#id_comment").val(),
				id: arg,
				save_type: savetype
		}
		
		data['interface'] = form.find("#id_interface").val();
		return data;
	}
	
	/* region show all */
	function show_all1()
	{
		$("#leftcolumn").hide();
		$("#list_body").load(defservices.list.panel_custom1, null,
				function()
				{
					utils.set_mutual_exclusive($("input[name=chklist]"));
					$(".add_button").click(add_originalport_);
					$(".drag_zone").draggable(drag_opt_1);
					$("#id_filters").change(filter_list1);
					$("#id_filter_text").keyup(function()
							{
								utils.countdown_filter(filter_list1);
							});
					$("#id_filter_text").keydown(utils.stop_filter_timer);
					defservices.init_tooltip();
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
		$("#panel_body").load(defservices.list.select_custom1 + s, null,
				function()
				{
					utils.set_mutual_exclusive($("input[name=chklist]"));
					$(".drag_zone").draggable(drag_opt_1);
					defservices.init_tooltip();
				});
	}
	
	function show_all2()
	{
		$("#leftcolumn").hide();
		$("#list_body").load(defnet.list.panel_custom2, null,
				function()
				{
					utils.set_mutual_exclusive($("input[name=chklist]"));
					$(".add_button").click(add_host_);
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
		$("#panel_body").load(defnet.list.select_custom2 + s, null,
				function()
				{
					utils.set_mutual_exclusive($("input[name=chklist]"));
					$(".drag_zone").draggable(drag_opt_2);
					defnet.init_tooltip();
				});
	}
	
	function show_all3()
	{
		$("#leftcolumn").hide();
		$("#list_body").load(defservices.list.panel_custom1, null,
				function()
				{
					utils.set_mutual_exclusive($("input[name=chklist]"));
					$(".add_button").click(add_newservice_);
					$(".drag_zone").draggable(drag_opt_3);
					$("#id_filters").change(filter_list3);
					$("#id_filter_text").keyup(function()
							{
								utils.countdown_filter(filter_list3);
							});
					$("#id_filter_text").keydown(utils.stop_filter_timer);
					defservices.init_tooltip();
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
		$("#panel_body").load(defservices.list.select_custom1 + s, null,
				function()
				{
					utils.set_mutual_exclusive($("input[name=chklist]"));
					$(".drag_zone").draggable(drag_opt_3);
					defservices.init_tooltip();
				});
	}
	
	function show_all_1()
	{
		return show_all_defservices_helper(defservices.add_members, this);
	}
	
	function show_all_2()
	{
		return show_all_defnet_helper(defnet.add_members, this);
	}
	
	function show_all_3()
	{
		return show_all_defservices_helper(defservices.add_members, this);
	}
	
	function show_all_defnet_helper(func_add, _this_)
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
					$("#id_filters").change(filter_list_defnet);
					$("#id_filter_text").keyup(function()
							{
								utils.countdown_filter(filter_list_defnet);
							});
					$("#id_filter_text").keydown(utils.stop_filter_timer);
					defnet.init_tooltip();
					utils.bind_hover($(".add_button"));
					$("#list-panel").dialog('open');
				});
		return false;
	}
	
	function filter_list_defnet()
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
	
	function show_all_defservices_helper(func_add, _this_)
	{
		var isopen = $("#list-panel").dialog('isOpen');
		if (isopen)
		{
			$("#list-panel").dialog('close');
			return false;
		}

		$("#leftcolumn").hide();
		var form = utils.get_parent(_this_, 4);
		$("#list_body").load(defservices.list.panel, null,
				function()
				{
					$(".add_button").click(function()
							{
								func_add(form);
							});
					$(".drag_zone").draggable(defservices.get_ui_opt().drag_opt);
					$("#id_filters").change(filter_list_defservices);
					$("#id_filter_text").keyup(function()
							{
								utils.countdown_filter(filter_list_defservices);
							});
					$("#id_filter_text").keydown(utils.stop_filter_timer);
					defservices.init_tooltip();
					utils.bind_hover($(".add_button"));
					$("#list-panel").dialog('open');
				});
		return false;
	}
	
	function filter_list_defservices()
	{
		var search_by_qry = "?find=" + $("#id_filters").val();
		var keyword = $("#id_filter_text").val();
		var s = (search_by_qry == '?find=0' && keyword == "" ? "" : search_by_qry + "&text=" + keyword);
		$("#panel_body").load(defservices.list.select + s, null,
				function()
				{
					$(".drag_zone").draggable(defservices.get_ui_opt().drag_opt);
					defservices.init_tooltip();
				});
	}
	/* endregion */
	
	/* region show add */
	function show_add1()
	{
		var self = this;
		var data = {
				self: self,
				scope: 'orgport',
				func_save: save_to_originalport,
				func_show_all: show_all_1,
				func_show_add: show_add_1
		};
		show_add_defservices_init_helper(data);
		return false;
	}
	
	function show_add2()
	{
		var self = this;
		var data = {
				self: self,
				scope: 'host',
				func_save: save_to_host,
				func_show_all: show_all_2,
				func_show_add: show_add_2
		};
		show_add_defnet_init_helper(data);
		return false;
	}
	
	function show_add3()
	{
		var self = this;
		var data = {
				self: self,
				scope: 'newservice',
				func_save: save_to_newservice,
				func_show_all: show_all_3,
				func_show_add: show_add_3
		};
		show_add_defservices_init_helper(data);
		return false;
	}
	
	function show_add_1()
	{
		var self = this;
		var data = {
				self: self,
				scope: 'orgport',
				func_show_all: show_all_1,
				func_show_add: show_add_1
		};
		show_add_defservices_helper(data);
		return false;
	}
	
	function show_add_2()
	{
		var self = this;
		var data = {
				self: self,
				scope: 'host',
				func_show_all: show_all_2,
				func_show_add: show_add_2
		};
		show_add_defnet_helper(data);
		return false;
	}
	
	function show_add_3()
	{
		var self = this;
		var data = {
				self: self,
				scope: 'newservice',
				func_show_all: show_all_3,
				func_show_add: show_add_3
		};
		show_add_defservices_helper(data);
		return false;
	}
	
	function show_add_defnet_init_helper(data)
	{
		data['level'] = 1;
		data['prefix'] = '';
		defnet.init_form(data);
	}
	
	function show_add_defservices_init_helper(data)
	{
		data['level'] = 1;
		data['prefix'] = '';
		defservices.init_form(data);
	}
	
	function show_add_defnet_helper(data)
	{
		var o = defnet.get_level_data(data.self);
		data['level'] = o.level;
		data['prefix'] = o.prefix;
		defnet.init_form(data);
	}
	
	function show_add_defservices_helper(data)
	{
		var o = defservices.get_level_data(data.self);
		data['level'] = o.level;
		data['prefix'] = o.prefix;
		defservices.init_form(data);
	}
	/* endregion */
	
	/* region save helper */
	function save_to_originalport()
	{
		var o =  {
				level: 1,
				scope: 'orgport',
				func_add: add_originalport
		};
		return defservices.save_inner_form(o);
	}
	
	function save_to_host()
	{
		var o =  {
				level: 1,
				scope: 'host',
				func_add: add_host
		};
		return defnet.save_inner_form(o);
	}
	
	function save_to_newservice()
	{
		var o =  {
				level: 1,
				scope: 'mewservice',
				func_add: add_newservice
		};
		return defservices.save_inner_form(o);
	}
	/* endregion */
	
	/* region add dragged item */
	function add_dragged_originalport(o)
	{
		var item = $(o);
		var name = item.html();
		var id = item.parent().attr("id");
		add_originalport(id, name);
	}
	
	function add_originalport(id, name)
	{
		utils.set_data($("#id_originalport"), 'orgport', id);
		var data = {
				id_prefix: 'orgport_',
				id: id,
				click: 'natpf.remove_originalport(this)',
				editclick: 'natpf.edit_originalport(this)',
				name: name
		};
		var h = new EJS({url: '/media/tpl/list_item.ejs'}).render(data);
		$("#id_originalport").html(h);
	}
	
	function add_originalport_()
	{
		$("input[name=chklist]:checked").each(
				function()
				{
					var o = $(this);
					var id = o.parent().attr("id");
					var name = o.next().html();
					add_originalport(id, name);
				});
	}
	
	function add_dragged_host(o)
	{
		var item = $(o);
		var name = item.html();
		var id = item.parent().attr("id");
		add_host(id, name);
	}
	
	function add_host(id, name)
	{
		utils.set_data($("#id_host"), 'host', id);
		var data = {
				id_prefix: 'host_',
				id: id,
				click: 'natpf.remove_host(this)',
				editclick: 'natpf.edit_host(this)',
				name: name
		};
		var h = new EJS({url: '/media/tpl/list_item.ejs'}).render(data);
		$("#id_host").html(h);
	}
	
	function add_host_()
	{
		$("input[name=chklist]:checked").each(
				function()
				{
					var o = $(this);
					var id = o.parent().attr("id");
					var name = o.next().html();
					add_host(id, name);
				});
	}
	
	function add_dragged_newservice(o)
	{
		var item = $(o);
		var name = item.html();
		var id = item.parent().attr("id");
		add_newservice(id, name);
	}
	
	function add_newservice(id, name)
	{
		utils.set_data($("#id_newservice"), 'newservice', id);
		var data = {
				id_prefix: 'newsrv_',
				id: id,
				click: 'natpf.remove_newservice(this)',
				editclick: 'natpf.edit_newservice(this)',
				name: name
		};
		var h = new EJS({url: '/media/tpl/list_item.ejs'}).render(data);
		$("#id_newservice").html(h);
	}
	
	function add_newservice_()
	{
		$("input[name=chklist]:checked").each(
				function()
				{
					var o = $(this);
					var id = o.parent().attr("id");
					var name = o.next().html();
					add_newservice(id, name);
				});
	}
	/* endregion */
	
	/* region remove */
	function remove_originalport(o)
	{
		var item = $(o);
		var id = item.parent().attr("id");
		$("#id_originalport").removeData('orgport');
		$("#" + id).remove();
		return false;
	}
	
	function remove_host(o)
	{
		var item = $(o);
		var id = item.parent().attr("id");
		$("#id_host").removeData('host');
		$("#" + id).remove();
		return false;
	}
	
	function remove_newservice(o)
	{
		var item = $(o);
		var id = item.parent().attr("id");
		$("#id_newservice").removeData('newservice');
		$("#" + id).remove();
		return false;
	}
	/* endregion */
	
	/* region edit */
	function edit_originalport(obj)
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
				scope: 'orgport',
				func_update: update_originalport,
				func_show_all: show_all_1,
				func_show_add: show_add_1
		};
		defservices.init_edit_form(data);
		return false;
	}
	
	function update_originalport(id, name, self)
	{
		$(self).next().html(name);
		var isopen = $("#list-panel").dialog('isOpen');
		if (isopen)
			filter_list1();
	}
	
	function edit_host(obj)
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
				scope: 'host',
				func_update: update_host,
				func_show_all: show_all_2,
				func_show_add: show_add_2
		};
		defnet.init_edit_form(data);
		return false;
	}
	
	function update_host(id, name, self)
	{
		$(self).next().html(name);
		var isopen = $("#list-panel").dialog('isOpen');
		if (isopen)
			filter_list2();
	}
	
	function edit_newservice(obj)
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
				scope: 'newservice',
				func_update: update_newservice,
				func_show_all: show_all_3,
				func_show_add: show_add_3
		};
		defservices.init_edit_form(data);
		return false;
	}
	
	function update_newservice(id, name, self)
	{
		$(self).next().html(name);
		var isopen = $("#list-panel").dialog('isOpen');
		if (isopen)
			filter_list3();
	}
	/* endregion */
	
	function set_items()
	{
		var orgport = $("#id_originalport > div").attr("id");
		var _orgport = utils.get_itemid(orgport);
		utils.set_data($("#id_originalport"), 'orgport', _orgport);
		var host = $("#id_host > div").attr("id");
		var _host = utils.get_itemid(host);
		utils.set_data($("#id_host"), 'host', _host);
		var newservice = $("#id_newservice > div").attr("id");
		var _newservice = utils.get_itemid(newservice);
		utils.set_data($("#id_newservice"), 'newservice', _newservice);
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
		utils.remove_dialog("div[id^='dialog-add']");
		utils.remove_dialog("div[id^='dialog-edit']");
		utils.init_alert_dialog("#dialog-message");
		utils.init_list_panel("#list-panel", nat.hide_panel);
		utils.bind_hover($("#id_add,#id_find"));
		nav_list.config.list_url = list_url;
		nav_list.config.list_func = init_list;
		nav_list.init();
	}
	
	function load()
	{
		return menu.get('/nat/pf/', init);
	}
	
	return {
		load:load,
		init:init,
		edit_originalport:edit_originalport,
		remove_originalport:remove_originalport,
		edit_host:edit_host,
		remove_host:remove_host,
		edit_newservice:edit_newservice,
		remove_newservice:remove_newservice
	}
}());