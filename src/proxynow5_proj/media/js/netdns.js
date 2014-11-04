/*
 * @include "defnet.js"
 */

var netdns = (function()
{
	var dns_allownet = {
			save_url: "/netdns/allownet/save/",
			delete_url: "/netdns/allownet/delete/"
	};
	var dns_relay = {
			save_url: "/netdns/relay/save/",
			delete_url: "/netdns/relay/delete/",
			defnet_save_url: "/netdns/relay/defnet/save/"
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
				scope: 'dns2',
				drag: utils.add_drag_css,
				stop: utils.remove_drag_css
		};
	}

	function show_panel1()
	{
		$("#leftcolumn").hide();
		$("#list_body").load(defnet.list.panel, null,
				function()
				{
					$(".add_button").click(add_dns_allownet);
					$(".drag_zone").draggable(drag_opt_1);
					$("#id_filters").change(filter_list1);
					$("#id_filter_text").keyup(function()
							{
								utils.countdown_filter(filter_list1);
							});
					$("#id_filter_text").keydown(utils.stop_filter_timer);
					defnet.init_tooltip();
					utils.bind_hover($("#list_body").find(".add_button"));
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

	function show_panel2()
	{
		$("#leftcolumn").hide();
		$("#list_body").load(defnet.list.panel_custom1, null,
				function()
				{
					$(".add_button").click(add_dns_relay);
					$(".drag_zone").draggable(drag_opt_2);
					$("#id_filters").change(filter_list2);
					$("#id_filter_text").keyup(function()
							{
								utils.countdown_filter(filter_list2);
							});
					$("#id_filter_text").keydown(utils.stop_filter_timer);
					defnet.init_tooltip();
					utils.bind_hover($("#list_body").find(".add_button"));
					$("#list-panel").dialog('open');
				});
		return false;
	}

	function filter_list2()
	{
		var search_by_qry = "?find=" + $("#id_filters").val();
		var keyword = $("#id_filter_text").val();
		var s = (search_by_qry == '?find=0' && keyword == "" ? "" : search_by_qry + "&text=" + keyword);
		$("#panel_body").load(defnet.list.select_custom1 + s, null,
				function()
				{
					$(".drag_zone").draggable(drag_opt_2);
					defnet.init_tooltip();
				});
	}

	function hide_panel()
	{
		var isopen = $("#list-panel").dialog('isOpen');
		if (isopen)
			$("#list-panel").dialog('close');

		$("#panel_tooltip").hide();
		$("#leftcolumn").show();
	}
	
	function add_dns_allownet_(id, name)
	{
		var arr_id = [id];
		var arr_name = [name];
		var data = get_dns_data(arr_id);
		ajax_add_dns(dns_allownet.save_url, data, arr_id, arr_name, add_dnslist1);
	}

	function add_dns_allownet()
	{
		var arr_id = [];
		var arr_name = [];
		$("input[name=chklist]:checked").each(
				function()
				{
					var o = $(this);
					var id = o.parent().attr("id");
					var name = o.next().html();
					arr_id.push(parseInt(id, 10));
					arr_name.push(name);
				});
		var data = get_dns_data(arr_id);
		ajax_add_dns(dns_allownet.save_url, data, arr_id, arr_name, add_dnslist1);
	}
	
	function add_dns_relay_(id, name)
	{
		var arr_id = [id];
		var arr_name = [name];
		var data = get_dns_data(arr_id);
		ajax_add_dns(dns_relay.save_url, data, arr_id, arr_name, add_dnslist2);
	}

	function add_dns_relay()
	{
		var arr_id = [];
		var arr_name = [];
		$("input[name=chklist]:checked").each(
				function()
				{
					var o = $(this);
					var id = o.parent().attr("id");
					var name = o.next().html();
					arr_id.push(parseInt(id, 10));
					arr_name.push(name);
				});
		var data = get_dns_data(arr_id);
		ajax_add_dns(dns_relay.save_url, data, arr_id, arr_name, add_dnslist2);
	}

	function get_dns_data(arr_id)
	{
		var arr = arr_id.join(',');
		var data = {
				data: arr
		};
		return data;
	}

	function ajax_add_dns(save_url, data, arr_id, arr_name, func_add)
	{
		$.post(save_url, data,
				function(result)
				{
					if (result == "success")
					{
						func_add(arr_id, arr_name);
					}
		
					else if (result.error == 1)
					{
						var f = result.fail_list;
						for (var i = 0; i < f.length; i++)
						{
							var o = parseInt(f[i], 10);
							var j = $.inArray(o, arr_id);
							if (j >= 0)
							{
								arr_id.splice(j, 1);
								arr_name.splice(j, 1);
							}
						}
		
						func_add(arr_id, arr_name);
					}
		
					else
					{
						utils.show_dialog(2, result);
					}
				});
	}

	function delete_dns_allownet(o)
	{
		var item = $(o);
		var id = item.parent().attr("id");
		var _id = utils.get_itemid(id);
		var data = {
				id: _id
		};
		ajax_delete_dns(dns_allownet.delete_url, data, id, "#dnslist1");
	}

	function delete_dns_relay(o)
	{
		var item = $(o);
		var id = item.parent().attr("id");
		var _id = utils.get_itemid(id);
		var data = {
				id: _id
		};
		ajax_delete_dns(dns_relay.delete_url, data, id, "#dnslist2");
	}

	function ajax_delete_dns(delete_url, data, id, parent_id)
	{
		$.post(delete_url, data,
				function(result)
				{
					if (result == "success")
					{
						$(parent_id).find("#" + id).remove();
						utils.set_alt_css(parent_id);
					}
		
					else
					{
						utils.show_dialog(2, result);
					}
				});
	}

	function add_dragged_dns_allownet(o)
	{
		var item = $(o);
		var name = item.html();
		var id = item.parent().attr("id");
		var _id = parseInt(id, 10);
		var arr_id = [_id];
		var arr_name = [name];
		var arr = arr_id.join(',');
		var data = {
				data: arr
		};
		ajax_add_dns(dns_allownet.save_url, data, arr_id, arr_name, add_dnslist1);
	}

	function add_dragged_dns_relay(o)
	{
		var item = $(o);
		var name = item.html();
		var id = item.parent().attr("id");
		var _id = parseInt(id, 10);
		var arr_id = [_id];
		var arr_name = [name];
		var arr = arr_id.join(',');
		var data = {
				data: arr
		};
		ajax_add_dns(dns_relay.save_url, data, arr_id, arr_name, add_dnslist2);
	}

	function add_dnslist1(arr_id, arr_name)
	{
		var n = arr_id.length;
		var o = $("#dnslist1");
		var data = null;
		var h = null;
		for (var i = 0; i < n; i++)
		{
			data = {
					id_prefix: 'item_',
					id: arr_id[i],
					click: 'netdns.delete_dns_allownet(this)',
					editclick: 'netdns.edit_dns_allownet(this)',
					name: arr_name[i]
			};
			h = new EJS({url: '/media/tpl/list_item.ejs'}).render(data);
			o.append(h);
		}

		utils.set_alt_css("#dnslist1");
	}

	function add_dnslist2(arr_id, arr_name)
	{
		var n = arr_id.length;
		var o = $("#dnslist2");
		var data = null;
		var h = null;
		for (var i = 0; i < n; i++)
		{
			data = {
					id_prefix: 'item_',
					id: arr_id[i],
					click: 'netdns.delete_dns_relay(this)',
					editclick: 'netdns.edit_dns_relay(this)',
					name: arr_name[i]
			}
			h = new EJS({url: '/media/tpl/list_item.ejs'}).render(data);
			o.append(h);
		}

		utils.set_alt_css("#dnslist2");
	}
	
	function edit_dns_allownet(obj)
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
				scope: 'dnslist1',
				func_update: update_dns_allownet,
				func_show_all: show_all_1,
				func_show_add: show_add_1
		};
		defnet.init_edit_form(data);
		return false;
	}
	
	function edit_dns_relay(obj)
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
				scope: 'dnslist2',
				edit: '',
				func_update: update_dns_relay
		};
		defnet.init_edit_form(data);
		return false;
	}

	// this method will add the saved data to the dns allowed network list
	function save_to_dns_allownet()
	{
		var o = {
				level: 1,
				scope: 'dnslist1',
				func_add: add_dns_allownet_
		};
		return defnet.save_inner_form(o);
	}

	// this method will add the saved data to the dns relay list
	function save_to_dns_relay()
	{
		var o = {
				level: 1,
				scope: 'dnslist2',
				func_add: add_dns_relay_
		};
		return defnet.save_inner_form(o);
	}
	
	function update_dns_allownet(id, name, self)
	{
		$(self).next().html(name);
		var isopen = $("#list-panel").dialog('isOpen');
		if (isopen)
			filter_list1();
	}
	
	function update_dns_relay(id, name, self)
	{
		$(self).next().html(name);
		var isopen = $("#list-panel").dialog('isOpen');
		if (isopen)
			filter_list2();
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
				scope: 'dnslist1',
				func_save: save_to_dns_allownet,
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
				scope: 'dnslist2',
				url: dns_relay.defnet_save_url,
				func_save: save_to_dns_relay
		};
		show_add_init_helper(data);
		return false;
	}

	function show_add_1()
	{
		var self = this;
		var data = {
				self: self,
				scope: 'dnslist1',
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

	function init()
	{
		init_ui_opt();
		utils.init_alert_dialog("#dialog-message");
		utils.init_list_panel("#list-panel", hide_panel);
		$("#dialog-add-dnslist1").dialog(defnet.get_ui_opt().popup_dialog_opt);
		$("#dialog-edit-dnslist1").dialog(defnet.get_ui_opt().popup_dialog_opt);
		$("#dialog-add-dnslist2").dialog(defnet.get_ui_opt().popup_dialog_opt);
		$("#dialog-edit-dnslist2").dialog(defnet.get_ui_opt().popup_dialog_opt);
		var fs1 = $("fieldset.dns1");
		fs1.find(".img_folder").click(show_panel1);
		fs1.find(".img_add").click(show_add1);
		var fs2 = $("fieldset.dns2");
		fs2.find(".img_folder").click(show_panel2);
		fs2.find(".img_add").click(show_add2);
		$("#dnslist1").droppable({
			hoverClass: 'ui-state-active',
			scope: defnet.drop_scope,
			drop: function(evt, ui)
			{
				var o = ui.draggable;
				add_dragged_dns_allownet(o);
			}
		});
		$("#dnslist2").droppable({
			hoverClass: 'ui-state-active',
			scope: 'dns2',
			drop: function(evt, ui)
			{
				var o = ui.draggable;
				add_dragged_dns_relay(o);
			}
		});
		utils.set_alt_css("#dnslist1");
		utils.set_alt_css("#dnslist2");
	}

	function load()
	{
		return menu.get('/netdns/', init);
	}

	return {
		load:load,
		edit_dns_allownet:edit_dns_allownet,
		delete_dns_allownet:delete_dns_allownet,
		edit_dns_relay:edit_dns_relay,
		delete_dns_relay:delete_dns_relay
	};
}());