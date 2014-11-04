var netint = (function()
{
	var save_url = "/netint/save/";
	var delete_url = "/netint/delete/";
	var list_url = "/netint/list/";

	function show_form()
	{
		$("#left_box").load(save_url, null,
				function()
				{
					$("#left_box").css('width', '300px');
					$(".save_button.save").click(func_save);
					$(".save_button.cancel,.form_title div.close").click(utils.cancel_form);
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
					utils.bind_hover($(".save_button,.form_title div.close"));
					$("#left_box").show();
				});
	}

	function func_save()
	{
		var data = get_data("", "");
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
		var data = get_data(arg, "update");
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
				text: keyword,
				confirm: ''
		};
		ajax_delete(data, item);
	}

	function func_clone()
	{
		var self = this;
		edit_helper({self: self, clone: 1})
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

	function get_data(arg, savetype)
	{
		var data = {
				name: $("#id_name").val(),
				type: $("#id_type").val(),
				hardware: $("#id_hardware").val(),
				address: $("#id_address").val(),
				netmask: $("#id_netmask").val(),
				gateway: $("#id_gateway").val(),
				mtu: $("#id_mtu").val(),
				comment: $("#id_comment").val(),
				id: arg,
				save_type: savetype
		}

		return data;
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
		$("#id_display,#id_selection").change(nav_list.show_list);
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
		return menu.get('/netint/', init);
	}

	return {
		load:load
	};
}());