/*
 * @include "defnet.js"
 */

var wpadvanceskip = (function()
{
	var save_url = "/wpadvanceskip/save/";
	var delete_url = "/wpadvanceskip/delete/";
	var drag_opt_2 = null;
	
	function init_ui_opt()
	{
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
	}
	
	function show_all2()
	{
		$("#leftcolumn").hide();
		$("#list_body").load(defnet.list.panel, null,
				function()
				{
					$(".add_button").click(add_skiplist);
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
		$("#panel_body").load(defnet.list.select + s, null,
				function()
				{
					$(".drag_zone").draggable(drag_opt_2);
					defnet.init_tooltip();
				});
	}
	
	function add_skiplist_(id, name)
	{
		var arr_id = [id];
		var arr_name = [name];
		var data = get_skiplist_data(arr_id);
		ajax_add_skiplist(save_url, data, arr_id, arr_name, add_wpadvanceskiplist);
	}
	
	function add_skiplist()
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
		var data = get_skiplist_data(arr_id);
		ajax_add_skiplist(save_url, data, arr_id, arr_name, add_wpadvanceskiplist);
	}
	
	function get_skiplist_data(arr_id)
	{
		var arr = arr_id.join(',');
		var data = {
				data: arr
		};
		return data;
	}
	
	function ajax_add_skiplist(save_url, data, arr_id, arr_name, func_add)
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
	
	function delete_skiplist(o)
	{
		var item = $(o);
		var id = item.parent().attr("id");
		var _id = utils.get_itemid(id);
		var data = {
				id: _id
		};
		ajax_delete_skiplist(delete_url, data, id, "#wpadvanceskiplist");
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
				func_show_all: show_all_2,
				func_show_add: show_add_2
		};
		defnet.init_edit_form(data);
		return false;
	}
	
	function update_skiplist(id, name, self)
	{
		$(self).next().html(name);
		var isopen = $("#list-panel").dialog('isOpen');
		if (isopen)
			filter_list2();
	}
	
	function ajax_delete_skiplist(delete_url, data, id, parent_id)
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
	
	function add_dragged_skiplist(o)
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
		ajax_add_skiplist(save_url, data, arr_id, arr_name, add_wpadvanceskiplist);
	}
	
	function add_wpadvanceskiplist(arr_id, arr_name)
	{
		var n = arr_id.length;
		var o = $("#wpadvanceskiplist");
		var data = null;
		var h = null;
		for (var i = 0; i < n; i++)
		{
			data = {
					id_prefix: 'skiplist_',
					id: arr_id[i],
					click: 'wpadvanceskip.delete_skiplist(this)',
					editclick: 'wpadvanceskip.edit_skiplist(this)',
					name: arr_name[i]
			};
			h = new EJS({url: '/media/tpl/list_item.ejs'}).render(data);
			o.append(h);
		}
		
		utils.set_alt_css("#wpadvanceskiplist");
	}
	
	function save_to_skiplist()
	{
		var o = {
				level: 1,
				scope: 'skiplist',
				func_add: add_skiplist_
		};
		return defnet.save_inner_form(o);
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
					$(".drag_zone").draggable(wpadvance.drag_opt);
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
					$(".drag_zone").draggable(wpadvance.drag_opt);
					defnet.init_tooltip();
				});
	}
	
	function show_add2()
	{
		var self = this;
		var data = {
				self: self,
				scope: 'skiplist',
				func_save: save_to_skiplist,
				func_show_all: show_all_2,
				func_show_add: show_add_2
		};
		wpadvance.show_add_init_helper(data);
		return false;
	}
	
	function show_add_2()
	{
		var self = this;
		var data = {
				self: self,
				scope: 'skiplist',
				func_show_all: show_all_2,
				func_show_add: show_add_2
		};
		wpadvance.show_add_helper(data);
		return false;
	}
	
	function init()
	{
		init_ui_opt();
		var fs = $("fieldset.wpadvanceskip");
		fs.find(".img_folder").click(show_all2);
		fs.find(".img_add").click(show_add2);
		$("#wpadvanceskiplist").droppable({
			hoverClass: 'ui-state-active',
			scope: defnet.drop_scope,
			drop: function(evt, ui)
			{
				var o = ui.draggable;
				add_dragged_skiplist(o);
			}
		});
		utils.set_alt_css("#wpadvanceskiplist");
	}
	
	return {
		init:init,
		edit_skiplist:edit_skiplist,
		delete_skiplist:delete_skiplist
	}
}());