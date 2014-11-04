/*
 * @include "defnet.js"
 */
 
var wpadvance = (function()
{
	var save_url = "/wpadvance/";
	var parent_ip = {
			defnet_save_url: "/netroute/gateway/defnet/save/"
	};
	var tab_opt = null;
	var drag_opt = null;
	var drag_opt_1 = null;
	var popup_dialog_edit_allowport_opt = null;
	var popup_dialog_import_allowport_opt = null;
	var popup_dialog_export_allowport_opt = null;

	function init_ui_opt()
	{
		tab_opt = {
				select: tab_select,
				load: init_content
		};
		drag_opt = {
				revert: true,
				snap: false,
				revertDuration: 0,
				zIndex: 1001,
				appendTo: 'body',
				helper: 'clone',
				drag: utils.add_drag_css,
				stop: utils.remove_drag_css
		};
		drag_opt_1 = {
				revert: true,
				snap: false,
				revertDuration: 0,
				zIndex: 1001,
				appendTo: 'body',
				helper: 'clone',
				scope: 'parentip',
				drag: utils.add_drag_css,
				stop: utils.remove_drag_css
		};
		popup_dialog_edit_allowport_opt = {
				autoOpen: false,
				width: 320,
				resizable: false,
				draggable: false,
				modal: false,
				stack: false,
				zIndex: 1000
		};
		popup_dialog_import_allowport_opt = {
				autoOpen: false,
				width: 350,
				resizable: false,
				draggable: false,
				modal: false,
				stack: false,
				zIndex: 1000
		};
		popup_dialog_export_allowport_opt = {
				autoOpen: false,
				width: 350,
				resizable: false,
				draggable: false,
				modal: false,
				stack: false,
				zIndex: 1000
		};
	}

	function func_save()
	{
		var data = get_data();
		$.post(save_url, data,
				function(result)
				{
					if (result.success == 1)
					{
						stat.show_status(0, result.msg);
					}

					else if (result.error == 1)
					{
						var err = utils.get_errors(result.errors);
						stat.show_status(1, err);
					}

					else
					{
						stat.show_status(1, result);
					}
				});

		return false;
	}

	function get_data()
	{
		var cache = ($("#id_cache").attr("checked") == "checked" ? 1 : 0);
		var parent = ($("#id_parent").attr("checked") == "checked" ? 1 : 0);
		var parentip = $("#id_parentip").data('parentip');
		var parentport = $("#id_parentport").val();
		var parentusername = $("#id_parentusername").val();
		var parentpassword = $("#id_parentpassword").val();
		if (parent == 0)
		{
			parentip = 0;
			parentport = 0;
			parentusername = '';
			parentpassword = '';
		}

		else
		{
			if (parentip == null)
				parentip = '';
		}
		var data = {
				cache: cache,
				parent: parent,
				parentip: parentip,
				parentport: parentport,
				parentusername: parentusername,
				parentpassword: parentpassword,
				id: "",
				save_type: ""
		}
		var id = $("#id_id").val();
		if (id != "")
		{
			data.id = id;
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
		$("#list_body").load(defnet.list.panel_custom3, null,
				function()
				{
					utils.set_mutual_exclusive($("input[name=chklist]"));
					$(".add_button").click(add_parentip_);
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
		$("#panel_body").load(defnet.list.select_custom3 + s, null,
				function()
				{
					utils.set_mutual_exclusive($("input[name=chklist]"));
					$(".drag_zone").draggable(drag_opt_1);
					defnet.init_tooltip();
				});
	}

	function show_add1()
	{
		var self = this;
		var data = {
				self: self,
				scope: 'parentip',
				url: parent_ip.defnet_save_url,
				func_save: save_to_parentip
		};
		show_add_init_helper(data);
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

	function save_to_parentip()
	{
		var o = {
				level: 1,
				scope: 'parentip',
				func_add: add_parentip
		};
		return defnet.save_inner_form(o);
	}

	function add_dragged_parentip(o)
	{
		var item = $(o);
		var name = item.html();
		var id = item.parent().attr("id");
		add_parentip(id, name);
	}

	function add_parentip(id, name)
	{
		utils.set_data($("#id_parentip"), 'parentip', id);
		var data = {
				id_prefix: 'parentip_',
				id: id,
				click: 'wpadvance.remove_parentip(this)',
				editclick: 'wpadvance.edit_parentip(this)',
				name: name
		};
		var h = new EJS({url: '/media/tpl/list_item.ejs'}).render(data);
		$("#id_parentip").html(h);
	}
	
	function add_parentip_()
	{
		$("input[name=chklist]:checked").each(
				function()
				{
					var o = $(this);
					var id = o.parent().attr("id");
					var name = o.next().html();
					add_parentip(id, name);
				});
	}

	function remove_parentip(o)
	{
		var item = $(o);
		var id = item.parent().attr("id");
		$("#id_parentip").removeData('parentip');
		$("#" + id).remove();
		return false;
	}
	
	function edit_parentip(obj)
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
				scope: 'parentip',
				func_update: update_parentip
		};
		defnet.init_edit_form(data);
		return false;
	}
	
	function update_parentip(id, name, self)
	{
		$(self).next().html(name);
		var isopen = $("#list-panel").dialog('isOpen');
		if (isopen)
			filter_list1();
	}

	function set_items()
	{
		var parentip = $("#id_parentip > div").attr("id");
		if (parentip != null)
		{
			var _parentip = get_parentip(parentip);
			utils.set_data($("#id_parentip"), 'parentip', _parentip);
		}

		if ($("#id_parent").attr("checked") == "checked")
			$(".row_wpadvance_parent").show();
	}

	function get_parentip(arg)
	{
		var s = arg.substr(9);
		return parseInt(s, 10);
	}

	function toggle_parent()
	{
		if (this.checked)
			$(".row_wpadvance_parent").show();

		else
			$(".row_wpadvance_parent").hide();
	}

	function tab_select(evt, ui)
	{
		hide_panel();
	}

	function init_content(evt, ui)
	{
		var i = ui.index;
		if (i == 1)
			wpadvanceskip.init();

		else if (i == 2)
			wpadvanceallow.init();
	}

	function init()
	{
		init_ui_opt();
		$("#wpadvance_tabs").tabs(tab_opt);
		$(".save_button.save").click(func_save);
		$("#parentip .img_folder").click(show_all1);
		$("#parentip .img_add").click(show_add1);
		$("#id_parentip").droppable({
			hoverClass: 'ui-state-active',
			scope: 'parentip',
			drop: function(evt, ui)
			{
				var o = ui.draggable;
				add_dragged_parentip(o);
			}
		});
		$("#id_parent").click(toggle_parent);
		if ($("#id_id").val() != "")
		{
			set_items();
			$("#id_parentpassword").val("**********");
		}

		$(".save_button.save").css("margin-right", "0");
		utils.bind_hover($(".save_button"));
		utils.init_alert_dialog("#dialog-message");
		utils.init_list_panel("#list-panel", hide_panel);
		$("#dialog-add-parentip").dialog(defnet.get_ui_opt().popup_dialog_opt);
		$("#dialog-edit-parentip").dialog(defnet.get_ui_opt().popup_dialog_opt);
		$("#dialog-add-skiplist").dialog(defnet.get_ui_opt().popup_dialog_opt);
		$("#dialog-edit-skiplist").dialog(defnet.get_ui_opt().popup_dialog_opt);
		$("#dialog-edit-allowport").dialog(popup_dialog_edit_allowport_opt);
		$("#dialog-import-allowport").dialog(popup_dialog_import_allowport_opt);
		$("#dialog-export-allowport").dialog(popup_dialog_export_allowport_opt);
	}

	function load()
	{
		return menu.get('/wpadvance/', init);
	}

	return {
		load:load,
		drag_opt:drag_opt,
		show_add_init_helper:show_add_init_helper,
		show_add_helper:show_add_helper,
		edit_parentip:edit_parentip,
		remove_parentip:remove_parentip
	}
}());