var netdhcp = (function()
{
	var save_url = "/netdhcp/save/";
	var delete_url = "/netdhcp/delete/";
	var list_url = "/netdhcp/list/";

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
		$("#left_box").load(save_url + "?netid=" + arg + cloneq, null,
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
		var keyword = $("#id_query").val();
		var data = {
				netid: arg,
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

	function get_data(arg, savetype)
	{
		var data = {
				netid: $("#id_netid").val(),
				start: $("#id_start").val(),
				end: $("#id_end").val(),
				dnsserver1: $("#id_dnsserver1").val(),
				dnsserver2: $("#id_dnsserver2").val(),
				gateway: $("#id_gateway").val(),
				domain: $("#id_domain").val(),
				leasetime: $("#id_leasetime").val(),
				_netid: arg,
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
		$("#id_display").change(nav_list.show_list);
		$("#id_query").keypress(nav_list.query_keypress);
		$("#id_query").keyup(nav_list.query_keyup);
		utils.init_alert_dialog("#dialog-message");
		utils.bind_hover($("#id_add,#id_find"));
		nav_list.config.list_url = list_url;
		nav_list.config.list_func = init_list;
		nav_list.init();
	}
	
	function load()
	{
		return menu.get('/netdhcp/', init);
	}

	return {
		load:load
	};
}());