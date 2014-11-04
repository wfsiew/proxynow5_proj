/*
 * @include "utils.js"
 * @include "nav_list.js"
 * @include "defnet.js"
 */

var natmasq = (function()
{
	var save_url = "/nat/masq/save/";
	var delete_url = "/nat/masq/delete/";
	var update_location_url = "/nat/masq/save/location/";
	var list_url = "/nat/masq/list/";
	var drag_opt_1 = null;
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
				scope: defnet.drop_scope,
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
		}
	}
	
	function init_list_cmd()
	{
		$("#network .img_folder").click(show_all1);
		$("#network .img_add").click(show_add1);
	}
	
	function init_list_droppable()
	{
		var hoverclass = 'ui-state-active';
		$("#id_network").droppable({
			hoverClass: hoverclass,
			scope: defnet.drop_scope,
			drop: function(evt, ui)
			{
				var o = ui.draggable;
				add_dragged_network(o);
			}
		});
	}
	
	function init_dialog()
	{
		$("#dialog-add-network").dialog(defnet.get_ui_opt().popup_dialog_opt);
		$("#dialog-edit-network").dialog(defnet.get_ui_opt().popup_dialog_opt);
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
						show_dialog(2, result);
					}
				});
	}
	
	function func_clone()
	{
		var self = this;
		edit_helper({self: self, clone: 1});
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
		var network = $("#id_network").data('network');
		var data = {
				network: network,
				location: form.find("#id_location").val(),
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
		$("#list_body").load(defnet.list.panel_custom2, null,
				function()
				{
					utils.set_mutual_exclusive($("input[name=chklist]"));
					$(".add_button").click(add_network_);
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
	
	function show_all_1()
	{
		return show_all_defnet_helper(defnet.add_members, this);
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
	/* endregion */
	
	/* region show add */
	function show_add1()
	{
		var self = this;
		var data = {
				self: self,
				scope: 'network',
				func_save: save_to_network,
				func_show_all: show_all_1,
				func_show_add: show_add_1
		};
		show_add_defnet_init_helper(data);
		return false;
	}
	
	function show_add_1()
	{
		var self = this;
		var data = {
				self: self,
				scope: 'network',
				func_show_all: show_all_1,
				func_show_add: show_add_1
		};
		show_add_defnet_helper(data);
		return false;
	}
	
	function show_add_defnet_init_helper(data)
	{
		data['level'] = 1;
		data['prefix'] = '';
		defnet.init_form(data);
	}
	
	function show_add_defnet_helper(data)
	{
		var o = defnet.get_level_data(data.self);
		data['level'] = o.level;
		data['prefix'] = o.prefix;
		defnet.init_form(data);
	}
	/* endregion */
	
	/* region save helper */
	function save_to_network()
	{
		var o = {
				level: 1,
				scope: 'network',
				func_add: add_network
		};
		return defnet.save_inner_form(o);
	}
	/* endregion */
	
	/* region add dragged item */
	function add_dragged_network(o)
	{
		var item = $(o);
		var name = item.html();
		var id = item.parent().attr("id");
		add_network(id, name);
	}
	
	function add_network(id, name)
	{
		utils.set_data($("#id_network"), 'network', id);
		var data = {
				id_prefix: 'network_',
				id: id,
				click: 'natmasq.remove_network(this)',
				editclick: 'natmasq.edit_network(this)',
				name: name
		};
		var h = new EJS({url: '/media/tpl/list_item.ejs'}).render(data);
		$("#id_network").html(h);
	}
	
	function add_network_()
	{
		$("input[name=chklist]:checked").each(
				function()
				{
					var o = $(this);
					var id = o.parent().attr("id");
					var name = o.next().html();
					add_network(id, name);
				});
	}
	/* endregion */
	
	/* region remove */
	function remove_network(o)
	{
		var item = $(o);
		var id = item.parent().attr("id");
		$("#id_network").removeData('network');
		$("#" + id).remove();
		return false;
	}
	/* endregion */
	
	/* region edit */
	function edit_network(obj)
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
				scope: 'network',
				func_update: update_network,
				func_show_all: show_all_1,
				func_show_add: show_add_1
		};
		defnet.init_edit_form(data);
		return false;
	}
	
	function update_network(id, name, self)
	{
		$(self).next().html(name);
		var isopen = $("#list-panel").dialog('isOpen');
		if (isopen)
			filter_list1();
	}
	/* endregion */
	
	function set_items()
	{
		var network = $("#id_network > div").attr("id");
		var _network = utils.get_itemid(network);
		utils.set_data($("#id_network"), 'network', _network);
	}
	
	function init_list()
	{
		$(".list_button.edit").click(func_edit);
		$(".list_button.delete").click(func_delete);
		$(".list_button.clone").click(func_clone);
		$(".list_table").sortable(sort_opt);
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
		edit_network:edit_network,
		remove_network:remove_network
	}
}());