/*
 * @include "defnet.js"
 * @include "utils.js"
 */

var netroute = (function()
{
	var save_url = "/netroute/save/";
	var delete_url = "/netroute/delete/";
	var list_url = "/netroute/list/";
	var route_gateway = {
			defnet_save_url: "/netroute/gateway/defnet/save/"
	};
	var drag_opt_1 = null;
	var drag_opt_2 = null;
	
	function init_ui_opt()
	{
		drag_opt_1 = {
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
		drag_opt_2 = {
				revert: true,
				snap: false,
				revertDuration: 0,
				zIndex: 1001,
				appendTo: 'body',
				helper: 'clone',
				scope: 'gwid',
				drag: utils.add_drag_css,
				stop: utils.remove_drag_css
		};
	}

	function show_form()
	{
		$("#left_box").load(save_url, null,
				function()
				{
					var form = $("#save-form");
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
	
	function init_list_cmd()
	{
		$("#netid .img_folder").click(show_all1);
		$("#netid .img_add").click(show_add1);
		$("#gwid .img_folder").click(show_all2);
		$("#gwid .img_add").click(show_add2);
	}
	
	function init_list_droppable()
	{
		var hoverclass = 'ui-state-active';
		$("#id_net").droppable({
			hoverClass: hoverclass,
			scope: defnet.drop_scope,
			drop: function(evt, ui)
			{
				var o = ui.draggable;
				add_dragged_netid(o);
			}
		});
		$("#id_gateway").droppable({
			hoverClass: hoverclass,
			scope: 'gwid',
			drop: function(evt, ui)
			{
				var o = ui.draggable;
				add_dragged_gwid(o);
			}
		});
	}
	
	function init_dialog()
	{
		$("#dialog-add-netid").dialog(defnet.get_ui_opt().popup_dialog_opt);
		$("#dialog-edit-netid").dialog(defnet.get_ui_opt().popup_dialog_opt);
		$("#dialog-add-gwid").dialog(defnet.get_ui_opt().popup_dialog_opt);
		$("#dialog-edit-gwid").dialog(defnet.get_ui_opt().popup_dialog_opt);
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
					$(".save_button.save").click(function()
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
		var netid = $("#id_net").data('netid');
		var gwid = $("#id_gateway").data('gwid');
		var data = {
				netid: netid,
				gwid: gwid,
				comment: form.find("#id_comment").val(),
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

		$("#panel_tooltip").hide();
		$("#leftcolumn").show();
	}

	function show_all1()
	{
		$("#leftcolumn").hide();
		$("#list_body").load(defnet.list.panel_custom2, null,
				function()
				{
					utils.set_mutual_exclusive($("input[name=chklist]"));
					$(".add_button").click(add_netid_);
					$(".drag_zone").draggable(drag_opt_1);
					$("#id_filters").change(filter_list1);
					$("#id_filter_text").keyup(function()
							{
								utils.countdown_filter(filter_list1);
							});
					$("#id_filter_text").keydown(utils.stop_filter_timer);
					defnet.init_tooltip();
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
		$("#panel_body").load(defnet.list.select_custom2 + s, null,
				function()
				{
					utils.set_mutual_exclusive($("input[name=chklist]"));
					$(".drag_zone").draggable(drag_opt_1);
					defnet.init_tooltip();
				});
	}

	function show_all2()
	{
		$("#leftcolumn").hide();
		$("#list_body").load(defnet.list.panel_custom3, null,
				function()
				{
					utils.set_mutual_exclusive($("input[name=chklist]"));
					$(".add_button").click(add_gwid_);
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
		$("#panel_body").load(defnet.list.select_custom3 + s, null,
				function()
				{
					utils.set_mutual_exclusive($("input[name=chklist]"));
					$(".drag_zone").draggable(drag_opt_2);
					defnet.init_tooltip();
				});
	}

	function show_all_1()
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
				scope: 'netid',
				func_save: save_to_netid,
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
				scope: 'gwid',
				url: route_gateway.defnet_save_url,
				func_save: save_to_gwid
		};
		show_add_init_helper(data);
		return false;
	}

	function show_add_1()
	{
		var self = this;
		var data = {
				self: self,
				scope: 'netid',
				func_show_all: show_all_1,
				func_show_add: show_add_1
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

	function save_to_netid()
	{
		var o = {
				level: 1,
				scope: 'netid',
				func_add: add_netid
		};
		return defnet.save_inner_form(o);
	}

	function save_to_gwid()
	{
		var o = {
				level: 1,
				scope: 'gwid',
				func_add: add_gwid
		};
		return defnet.save_inner_form(o);
	}

	function add_dragged_netid(o)
	{
		var item = $(o);
		var name = item.html();
		var id = item.parent().attr("id");
		add_netid(id, name);
	}

	function add_netid(id, name)
	{
		utils.set_data($("#id_net"), 'netid', id);
		var data = {
				id_prefix: 'netid_',
				id: id,
				click: 'netroute.remove_netid(this)',
				editclick: 'netroute.edit_netid(this)',
				name: name
		};
		var h = new EJS({url: '/media/tpl/list_item.ejs'}).render(data);
		$("#id_net").html(h);
	}
	
	function add_netid_()
	{
		$("input[name=chklist]:checked").each(
				function()
				{
					var o = $(this);
					var id = o.parent().attr("id");
					var name = o.next().html();
					add_netid(id, name);
				});
	}

	function add_dragged_gwid(o)
	{
		var item = $(o);
		var name = item.html();
		var id = item.parent().attr("id");
		add_gwid(id, name);
	}

	function add_gwid(id, name)
	{
		utils.set_data($("#id_gateway"), 'gwid', id);
		var data = {
				id_prefix: 'gwid_',
				id: id,
				click: 'netroute.remove_gwid(this)',
				editclick: 'netroute.edit_gwid(this)',
				name: name
		};
		var h = new EJS({url: '/media/tpl/list_item.ejs'}).render(data);
		$("#id_gateway").html(h);
	}
	
	function add_gwid_()
	{
		$("input[name=chklist]:checked").each(
				function()
				{
					var o = $(this);
					var id = o.parent().attr("id");
					var name = o.next().html();
					add_gwid(id, name);
				});
	}

	function remove_netid(o)
	{
		var item = $(o);
		var id = item.parent().attr("id");
		$("#id_net").removeData('netid');
		$("#" + id).remove();
		return false;
	}

	function remove_gwid(o)
	{
		var item = $(o);
		var id = item.parent().attr("id");
		$("#id_gateway").removeData('gwid');
		$("#" + id).remove();
		return false;
	}
	
	function edit_netid(obj)
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
				scope: 'netid',
				func_update: update_netid,
				func_show_all: show_all_1,
				func_show_add: show_add_1
		};
		defnet.init_edit_form(data);
		return false;
	}
	
	function update_netid(id, name, self)
	{
		$(self).next().html(name);
		var isopen = $("#list-panel").dialog('isOpen');
		if (isopen)
			filter_list1();
	}
	
	function edit_gwid(obj)
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
				scope: 'gwid',
				func_update: update_gwid
		};
		defnet.init_edit_form(data);
		return false;
	}
	
	function update_gwid(id, name, self)
	{
		$(self).next().html(name);
		var isopen = $("#list-panel").dialog('isOpen');
		if (isopen)
			filter_list2();
	}

	function set_items()
	{
		var netid = $("#id_net > div").attr("id");
		var _netid = utils.get_itemid(netid);
		utils.set_data($("#id_net"), 'netid', _netid);
		var gwid = $("#id_gateway > div").attr("id");
		var _gwid = utils.get_itemid(gwid);
		utils.set_data($("#id_gateway"), 'gwid', _gwid);
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
		$("#id_display,#id_selection").change(nav_list.show_list);
		$("#id_query").keypress(nav_list.query_keypress);
		$("#id_query").keyup(nav_list.query_keyup);
		utils.remove_dialog("#dialog-add-netid");
		utils.remove_dialog("#dialog-edit-netid");
		utils.remove_dialog("#dialog-add-gwid");
		utils.remove_dialog("#dialog-edit-gwid");
		utils.init_alert_dialog("#dialog-message");
		utils.init_list_panel("#list-panel", hide_panel);
		utils.bind_hover($("#id_add,#id_find"));
		nav_list.config.list_url = list_url;
		nav_list.config.list_func = init_list;
		nav_list.init();
	}
	
	function load()
	{
		return menu.get('/netroute/', init);
	}

	return {
		load:load,
		edit_netid:edit_netid,
		remove_netid:remove_netid,
		edit_gwid:edit_gwid,
		remove_gwid:remove_gwid
	};
}());