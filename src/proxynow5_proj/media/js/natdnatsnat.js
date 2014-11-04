/*
 * @include "utils.js"
 * @include "nav_list.js"
 * @include "defnet.js"
 * @include "defservices.js"
 */

var natdnatsnat = (function()
{
	var save_url = "/nat/dnatsnat/save/";
	var delete_url = "/nat/dnatsnat/delete/";
	var list_url = "/nat/dnatsnat/list/";
	var drag_opt_1 = null;
	var drag_opt_2 = null;
	var drag_opt_3 = null;
	var drag_opt_4 = null;
	var drag_opt_5 = null;
	var drag_opt_6 = null;
	var drag_opt_7 = null;
	
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
				scope: defservices.drop_scope,
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
				scope: defnet.drop_scope,
				drag: utils.add_drag_css,
				stop: utils.remove_drag_css
		};
		drag_opt_4 = {
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
		drag_opt_5 = {
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
		drag_opt_6 = {
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
		drag_opt_7 = {
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
	
	function show_form()
	{
		$("#left_box").load(save_url, null,
				function()
				{
					$("#left_box").css('width', '300px');
					$(".save_button.save").click(func_save);
					$(".save_button.cancel,.form_title div.close").click(utils.cancel_form);
					$("#id_mode").change(mode_change);
					set_mode('1');
					init_list_cmd();
					init_list_droppable();
					init_dialog();
					utils.bind_hover($(".save_button,.form_title div.close"));
					$("#left_box").show();
				});
		return false;
	}
	
	function mode_change()
	{
		var val = $(this).val();
		set_mode(val);
	}
	
	function init_list_cmd()
	{
		$("#orgsrc .img_folder").click(show_all1);
		$("#orgsrc .img_add").click(show_add1);
		$("#orgport .img_folder").click(show_all2);
		$("#orgport .img_add").click(show_add2);
		$("#orgdest .img_folder").click(show_all3);
		$("#orgdest .img_add").click(show_add3);
		$("#newdesthost .img_folder").click(show_all4);
		$("#newdesthost .img_add").click(show_add4);
		$("#newdestport .img_folder").click(show_all5);
		$("#newdestport .img_add").click(show_add5);
		$("#newsrcaddr .img_folder").click(show_all6);
		$("#newsrcaddr .img_add").click(show_add6);
		$("#newsrcport .img_folder").click(show_all7);
		$("#newsrcport .img_add").click(show_add7);
	}
	
	function init_list_droppable()
	{
		var hoverclass = 'ui-state-active';
		$("#id_originalsource").droppable({
			hoverClass: hoverclass,
			scope: defnet.drop_scope,
			drop: function(evt, ui)
			{
				var o = ui.draggable;
				add_dragged_originalsource(o);
			}
		});
		$("#id_originalport").droppable({
			hoverClass: hoverclass,
			scope: defservices.drop_scope,
			drop: function(evt, ui)
			{
				var o = ui.draggable;
				add_dragged_originalport(o);
			}
		});
		$("#id_originaldest").droppable({
			hoverClass: hoverclass,
			scope: defnet.drop_scope,
			drop: function(evt, ui)
			{
				var o = ui.draggable;
				add_dragged_originaldest(o);
			}
		});
		$("#id_newdesthost").droppable({
			hoverClass: hoverclass,
			scope: defnet.drop_scope,
			drop: function(evt, ui)
			{
				var o = ui.draggable;
				add_dragged_newdesthost(o);
			}
		});
		$("#id_newdestport").droppable({
			hoverClass: hoverclass,
			scope: defservices.drop_scope,
			drop: function(evt, ui)
			{
				var o = ui.draggable;
				add_dragged_newdestport(o);
			}
		});
		$("#id_newsrcaddr").droppable({
			hoverClass: hoverclass,
			scope: defnet.drop_scope,
			drop: function(evt, ui)
			{
				var o = ui.draggable;
				add_dragged_newsrcaddr(o);
			}
		});
		$("#id_newsrcport").droppable({
			hoverClass: hoverclass,
			scope: defservices.drop_scope,
			drop: function(evt, ui)
			{
				var o = ui.draggable;
				add_dragged_newsrcport(o);
			}
		});
	}
	
	function init_dialog()
	{
		$("#dialog-add-orgsrc").dialog(defnet.get_ui_opt().popup_dialog_opt);
		$("#dialog-edit-orgsrc").dialog(defnet.get_ui_opt().popup_dialog_opt);
		$("#dialog-add-orgport").dialog(defservices.get_ui_opt().popup_dialog_opt);
		$("#dialog-edit-orgport").dialog(defservices.get_ui_opt().popup_dialog_opt);
		$("#dialog-add-orgdest").dialog(defnet.get_ui_opt().popup_dialog_opt);
		$("#dialog-edit-orgdest").dialog(defnet.get_ui_opt().popup_dialog_opt);
		$("#dialog-add-newdesthost").dialog(defnet.get_ui_opt().popup_dialog_opt);
		$("#dialog-edit-newdesthost").dialog(defnet.get_ui_opt().popup_dialog_opt);
		$("#dialog-add-newdestport").dialog(defservices.get_ui_opt().popup_dialog_opt);
		$("#dialog-edit-newdestport").dialog(defservices.get_ui_opt().popup_dialog_opt);
		$("#dialog-add-newsrcaddr").dialog(defnet.get_ui_opt().popup_dialog_opt);
		$("#dialog-edit-newsrcaddr").dialog(defnet.get_ui_opt().popup_dialog_opt);
		$("#dialog-add-newsrcport").dialog(defservices.get_ui_opt().popup_dialog_opt);
		$("#dialog-edit-newsrcport").dialog(defservices.get_ui_opt().popup_dialog_opt);
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
					$("#id_mode").change(mode_change);
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
		var orgsrc = $("#id_originalsource").data('orgsrc');
		var orgport = $("#id_originalport").data('orgport');
		var orgdest = $("#id_originaldest").data('orgdest');
		var mode = form.find("#id_mode").val();
		var newdesthost = $("#id_newdesthost").data('newdesthost');
		var newdestport = $("#id_newdestport").data('newdestport');
		var newsrcaddr = $("#id_newsrcaddr").data('newsrcaddr');
		var newsrcport = $("#id_newsrcport").data('newsrcport');
		var autocreatepfrule = (form.find("#id_autoCreatePFRule").attr("checked") == "checked" ? 1 : 0);
		var data = {
				originalSource: orgsrc,
				originalPort: orgport,
				originalDestination: orgdest,
				mode: mode,
				autoCreatePFRule: autocreatepfrule,
				comment: form.find("#id_comment").val(),
				id: arg,
				save_type: savetype
		}
		
		if (mode == '1' || mode == '3')
		{
			data['newDestinationHost'] = newdesthost;
			data['newDestinationPort'] = newdestport;
		}
		
		else if (mode == '2' || mode == '3')
		{
			data['newSourceAddress'] = newsrcaddr;
			data['newSourcePort'] = newsrcport;
		}
		
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
					$(".add_button").click(add_originalsource_);
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
		$("#list_body").load(defservices.list.panel_custom1, null,
				function()
				{
					utils.set_mutual_exclusive($("input[name=chklist]"));
					$(".add_button").click(add_originalport_);
					$(".drag_zone").draggable(drag_opt_2);
					$("#id_filters").change(filter_list2);
					$("#id_filter_text").keyup(function()
							{
								utils.countdown_filter(filter_list2);
							});
					$("#id_filter_text").keydown(utils.stop_filter_timer);
					defservices.init_tooltip();
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
		$("#panel_body").load(defservices.list.select_custom1 + s, null,
				function()
				{
					utils.set_mutual_exclusive($("input[name=chklist]"));
					$(".drag_zone").draggable(drag_opt_2);
					defservices.init_tooltip();
				});
	}
	
	function show_all3()
	{
		$("#leftcolumn").hide();
		$("#list_body").load(defnet.list.panel_custom2, null,
				function()
				{
					utils.set_mutual_exclusive($("input[name=chklist]"));
					$(".add_button").click(add_originaldest_);
					$(".drag_zone").draggable(drag_opt_3);
					$("#id_filters").change(filter_list3);
					$("#id_filter_text").keyup(function()
							{
								utils.countdown_filter(filter_list3);
							});
					$("#id_filter_text").keydown(utils.stop_filter_timer);
					defnet.init_tooltip();
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
		$("#panel_body").load(defnet.list.select_custom2 + s, null,
				function()
				{
					utils.set_mutual_exclusive($("input[name=chklist]"));
					$(".drag_zone").draggable(drag_opt_3);
					defnet.init_tooltip();
				});
	}
	
	function show_all4()
	{
		$("#leftcolumn").hide();
		$("#list_body").load(defnet.list.panel_custom2, null,
				function()
				{
					utils.set_mutual_exclusive($("input[name=chklist]"));
					$(".add_button").click(add_newdesthost_);
					$(".drag_zone").draggable(drag_opt_4);
					$("#id_filters").change(filter_list4);
					$("#id_filter_text").keyup(function()
							{
								utils.countdown_filter(filter_list4);
							});
					$("#id_filter_text").keydown(utils.stop_filter_timer);
					defnet.init_tooltip();
					utils.bind_hover($(".add_button"));
					$("#list-panel").dialog('open');
				});
		return false;
	}
	
	function filter_list4()
	{
		var search_by_qry = "?find=" + $("#id_filters").val();
		var keyword = $("#id_filter_text").val();
		var s = (search_by_qry == '?find=0' && keyword == "" ? "" : search_by_qry + "&text=" + keyword);
		$("#panel_body").load(defnet.list.select_custom2 + s, null,
				function()
				{
					utils.set_mutual_exclusive($("input[name=chklist]"));
					$(".drag_zone").draggable(drag_opt_4);
					defnet.init_tooltip();
				});
	}
	
	function show_all5()
	{
		$("#leftcolumn").hide();
		$("#list_body").load(defservices.list.panel_custom1, null,
				function()
				{
					utils.set_mutual_exclusive($("input[name=chklist]"));
					$(".add_button").click(add_newdestport_);
					$(".drag_zone").draggable(drag_opt_5);
					$("#id_filters").change(filter_list5);
					$("#id_filter_text").keyup(function()
							{
								utils.countdown_filter(filter_list5);
							});
					$("#id_filter_text").keydown(utils.stop_filter_timer);
					defservices.init_tooltip();
					utils.bind_hover($(".add_button"));
					$("#list-panel").dialog('open');
				});
		return false;
	}
	
	function filter_list5()
	{
		var search_by_qry = "?find=" + $("#id_filters").val();
		var keyword = $("#id_filter_text").val();
		var s = (search_by_qry == '?find=0' && keyword == "" ? "" : search_by_qry + "&text=" + keyword);
		$("#panel_body").load(defservices.list.select_custom1 + s, null,
				function()
				{
					utils.set_mutual_exclusive($("input[name=chklist]"));
					$(".drag_zone").draggable(drag_opt_5);
					defservices.init_tooltip();
				});
	}
	
	function show_all6()
	{
		$("#leftcolumn").hide();
		$("#list_body").load(defnet.list.panel_custom2, null,
				function()
				{
					utils.set_mutual_exclusive($("input[name=chklist]"));
					$(".add_button").click(add_newsrcaddr_);
					$(".drag_zone").draggable(drag_opt_6);
					$("#id_filters").change(filter_list6);
					$("#id_filter_text").keyup(function()
							{
								utils.countdown_filter(filter_list6);
							});
					$("#id_filter_text").keydown(utils.stop_filter_timer);
					defnet.init_tooltip();
					utils.bind_hover($(".add_button"));
					$("#list-panel").dialog('open');
				});
		return false;
	}
	
	function filter_list6()
	{
		var search_by_qry = "?find=" + $("#id_filters").val();
		var keyword = $("#id_filter_text").val();
		var s = (search_by_qry == '?find=0' && keyword == "" ? "" : search_by_qry + "&text=" + keyword);
		$("#panel_body").load(defnet.list.select_custom2 + s, null,
				function()
				{
					utils.set_mutual_exclusive($("input[name=chklist]"));
					$(".drag_zone").draggable(drag_opt_6);
					defnet.init_tooltip();
				});
	}
	
	function show_all7()
	{
		$("#leftcolumn").hide();
		$("#list_body").load(defservices.list.panel_custom1, null,
				function()
				{
					utils.set_mutual_exclusive($("input[name=chklist]"));
					$(".add_button").click(add_newsrcport_);
					$(".drag_zone").draggable(drag_opt_7);
					$("#id_filters").change(filter_list7);
					$("#id_filter_text").keyup(function()
							{
								utils.countdown_filter(filter_list7);
							});
					$("#id_filter_text").keydown(utils.stop_filter_timer);
					defservices.init_tooltip();
					utils.bind_hover($(".add_button"));
					$("#list-panel").dialog('open');
				});
		return false;
	}
	
	function filter_list7()
	{
		var search_by_qry = "?find=" + $("#id_filters").val();
		var keyword = $("#id_filter_text").val();
		var s = (search_by_qry == '?find=0' && keyword == "" ? "" : search_by_qry + "&text=" + keyword);
		$("#panel_body").load(defservices.list.select_custom1 + s, null,
				function()
				{
					utils.set_mutual_exclusive($("input[name=chklist]"));
					$(".drag_zone").draggable(drag_opt_7);
					defservices.init_tooltip();
				});
	}
	
	function show_all_1()
	{
		return show_all_defnet_helper(defnet.add_members, this);
	}
	
	function show_all_2()
	{
		return show_all_defservices_helper(defservices.add_members, this);
	}
	
	function show_all_3()
	{
		return show_all_defnet_helper(defnet.add_members, this);
	}
	
	function show_all_4()
	{
		return show_all_defnet_helper(defnet.add_members, this);
	}
	
	function show_all_5()
	{
		return show_all_defservices_helper(defservices.add_members, this);
	}
	
	function show_all_6()
	{
		return show_all_defnet_helper(defnet.add_members, this);
	}
	
	function show_all_7()
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
				scope: 'orgsrc',
				func_save: save_to_originalsource,
				func_show_all: show_all_1,
				func_show_add: show_add_1
		};
		show_add_defnet_init_helper(data);
		return false;
	}
	
	function show_add2()
	{
		var self = this;
		var data = {
				self: self,
				scope: 'orgport',
				func_save: save_to_originalport,
				func_show_all: show_all_2,
				func_show_add: show_add_2
		};
		show_add_defservices_init_helper(data);
		return false;
	}
	
	function show_add3()
	{
		var self = this;
		var data = {
				self: self,
				scope: 'orgdest',
				func_save: save_to_originaldest,
				func_show_all: show_all_3,
				func_show_add: show_add_3
		};
		show_add_defnet_init_helper(data);
		return false;
	}
	
	function show_add4()
	{
		var self = this;
		var data = {
				self: self,
				scope: 'newdesthost',
				func_save: save_to_newdesthost,
				func_show_all: show_all_4,
				func_show_add: show_add_4
		};
		show_add_defnet_init_helper(data);
		return false;
	}
	
	function show_add5()
	{
		var self = this;
		var data = {
				self: self,
				scope: 'newdestport',
				func_save: save_to_newdestport,
				func_show_all: show_all_5,
				func_show_add: show_add_5
		};
		show_add_defservices_init_helper(data);
		return false;
	}
	
	function show_add6()
	{
		var self = this;
		var data = {
				self: self,
				scope: 'newsrcaddr',
				func_save: save_to_newsrcaddr,
				func_show_all: show_all_6,
				func_show_add: show_add_6
		};
		show_add_defnet_init_helper(data);
		return false;
	}
	
	function show_add7()
	{
		var self = this;
		var data = {
				self: self,
				scope: 'newsrcport',
				func_save: save_to_newsrcport,
				func_show_all: show_all_7,
				func_show_add: show_add_7
		};
		show_add_defservices_init_helper(data);
		return false;
	}
	
	function show_add_1()
	{
		var self = this;
		var data = {
				self: self,
				scope: 'orgsrc',
				func_show_all: show_all_1,
				func_show_add: show_add_1
		};
		show_add_defnet_helper(data);
		return false;
	}
	
	function show_add_2()
	{
		var self = this;
		var data = {
				self: self,
				scope: 'orgport',
				func_show_all: show_all_2,
				func_show_add: show_add_2
		};
		show_add_defservices_helper(data);
		return false;
	}
	
	function show_add_3()
	{
		var self = this;
		var data = {
				self: self,
				scope: 'orgdest',
				func_show_all: show_all_3,
				func_show_add: show_add_3
		};
		show_add_defnet_helper(data);
		return false;
	}
	
	function show_add_4()
	{
		var self = this;
		var data = {
				self: self,
				scope: 'newdesthost',
				func_show_all: show_all_4,
				func_show_add: show_add_4
		};
		show_add_defnet_helper(data);
		return false;
	}
	
	function show_add_5()
	{
		var self = this;
		var data = {
				self: self,
				scope: 'newdestport',
				func_show_all: show_all_5,
				func_show_add: show_add_5
		};
		show_add_defservices_helper(data);
		return false;
	}
	
	function show_add_6()
	{
		var self = this;
		var data = {
				self: self,
				scope: 'newsrcaddr',
				func_show_all: show_all_6,
				func_show_add: show_add_6
		};
		show_add_defnet_helper(data);
		return false;
	}
	
	function show_add_7()
	{
		var self = this;
		var data = {
				self: self,
				scope: 'newsrcport',
				func_show_all: show_all_7,
				func_show_add: show_add_7
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
	function save_to_originalsource()
	{
		var o = {
				level: 1,
				scope: 'orgsrc',
				func_add: add_originalsource
		};
		return defnet.save_inner_form(o);
	}
	
	function save_to_originalport()
	{
		var o = {
				level: 1,
				scope: 'orgport',
				func_add: add_originalport
		};
		return defservices.save_inner_form(o);
	}
	
	function save_to_originaldest()
	{
		var o = {
				level: 1,
				scope: 'orgdest',
				func_add: add_originaldest
		};
		return defnet.save_inner_form(o);
	}
	
	function save_to_newdesthost()
	{
		var o = {
				level: 1,
				scope: 'newdesthost',
				func_add: add_newdesthost
		};
		return defnet.save_inner_form(o);
	}
	
	function save_to_newdestport()
	{
		var o = {
				level: 1,
				scope: 'newdestport',
				func_add: add_newdestport
		};
		return defservices.save_inner_form(o);
	}
	
	function save_to_newsrcaddr()
	{
		var o = {
				level: 1,
				scope: 'newsrcaddr',
				func_add: add_newsrcaddr
		};
		return defnet.save_inner_form(o);
	}
	
	function save_to_newsrcport()
	{
		var o =  {
				level: 1,
				scope: 'newsrcport',
				func_add: add_newsrcport
		};
		return defservices.save_inner_form(o);
	}
	/* endregion */
	
	/* region add dragged item */
	function add_dragged_originalsource(o)
	{
		var item = $(o);
		var name = item.html();
		var id = item.parent().attr("id");
		add_originalsource(id, name);
	}
	
	function add_originalsource(id, name)
	{
		utils.set_data($("#id_originalsource"), 'orgsrc', id);
		var data = {
				id_prefix: 'orgsrc_',
				id: id,
				click: 'natdnatsnat.remove_originalsource(this)',
				editclick: 'natdnatsnat.edit_originalsource(this)',
				name: name
		};
		var h = new EJS({url: '/media/tpl/list_item.ejs'}).render(data);
		$("#id_originalsource").html(h);
	}
	
	function add_originalsource_()
	{
		$("input[name=chklist]:checked").each(
				function()
				{
					var o = $(this);
					var id = o.parent().attr("id");
					var name = o.next().html();
					add_originalsource(id, name);
				});
	}
	
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
				click: 'natdnatsnat.remove_originalport(this)',
				editclick: 'natdnatsnat.edit_originalport(this)',
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
	
	function add_dragged_originaldest(o)
	{
		var item = $(o);
		var name = item.html();
		var id = item.parent().attr("id");
		add_originaldest(id, name);
	}
	
	function add_originaldest(id, name)
	{
		utils.set_data($("#id_originaldest"), 'orgdest', id);
		var data = {
				id_prefix: 'orgdest_',
				id: id,
				click: 'natdnatsnat.remove_originaldest(this)',
				editclick: 'natdnatsnat.edit_originaldest(this)',
				name: name
		};
		var h = new EJS({url: '/media/tpl/list_item.ejs'}).render(data);
		$("#id_originaldest").html(h);
	}
	
	function add_originaldest_()
	{
		$("input[name=chklist]:checked").each(
				function()
				{
					var o = $(this);
					var id = o.parent().attr("id");
					var name = o.next().html();
					add_originaldest(id, name);
				});
	}
	
	function add_dragged_newdesthost(o)
	{
		var item = $(o);
		var name = item.html();
		var id = item.parent().attr("id");
		add_newdesthost(id, name);
	}
	
	function add_newdesthost(id, name)
	{
		utils.set_data($("#id_newdesthost"), 'newdesthost', id);
		var data = {
				id_prefix: 'newdesthost_',
				id: id,
				click: 'natdnatsnat.remove_newdesthost(this)',
				editclick: 'natdnatsnat.edit_newdesthost(this)',
				name: name
		};
		var h = new EJS({url: '/media/tpl/list_item.ejs'}).render(data);
		$("#id_newdesthost").html(h);
	}
	
	function add_newdesthost_()
	{
		$("input[name=chklist]:checked").each(
				function()
				{
					var o = $(this);
					var id = o.parent().attr("id");
					var name = o.next().html();
					add_newdesthost(id, name);
				});
	}
	
	function add_dragged_newdestport(o)
	{
		var item = $(o);
		var name = item.html();
		var id = item.parent().attr("id");
		add_newdestport(id, name);
	}
	
	function add_newdestport(id, name)
	{
		utils.set_data($("#id_newdestport"), 'newdestport', id);
		var data = {
				id_prefix: 'newdestport_',
				id: id,
				click: 'natdnatsnat.remove_newdestport(this)',
				editclick: 'natdnatsnat.edit_newdestport(this)',
				name: name
		};
		var h = new EJS({url: '/media/tpl/list_item.ejs'}).render(data);
		$("#id_newdestport").html(h);
	}
	
	function add_newdestport_()
	{
		$("input[name=chklist]:checked").each(
				function()
				{
					var o = $(this);
					var id = o.parent().attr("id");
					var name = o.next().html();
					add_newdestport(id, name);
				});
	}
	
	function add_dragged_newsrcaddr(o)
	{
		var item = $(o);
		var name = item.html();
		var id = item.parent().attr("id");
		add_newsrcaddr(id, name);
	}
	
	function add_newsrcaddr(id, name)
	{
		utils.set_data($("#id_newsrcaddr"), 'newsrcaddr', id);
		var data = {
				id_prefix: 'newsrcaddr_',
				id: id,
				click: 'natdnatsnat.remove_newsrcaddr(this)',
				editclick: 'natdnatsnat.edit_newsrcaddr(this)',
				name: name
		};
		var h = new EJS({url: '/media/tpl/list_item.ejs'}).render(data);
		$("#id_newsrcaddr").html(h);
	}
	
	function add_newsrcaddr_()
	{
		$("input[name=chklist]:checked").each(
				function()
				{
					var o = $(this);
					var id = o.parent().attr("id");
					var name = o.next().html();
					add_newsrcaddr(id, name);
				});
	}
	
	function add_dragged_newsrcport(o)
	{
		var item = $(o);
		var name = item.html();
		var id = item.parent().attr("id");
		add_newsrcport(id, name);
	}
	
	function add_newsrcport(id, name)
	{
		utils.set_data($("#id_newsrcport"), 'newsrcport', id);
		var data = {
				id_prefix: 'newsrcport_',
				id: id,
				click: 'natdnatsnat.remove_newsrcport(this)',
				editclick: 'natdnatsnat.edit_newsrcport(this)',
				name: name
		};
		var h = new EJS({url: '/media/tpl/list_item.ejs'}).render(data);
		$("#id_newsrcport").html(h);
	}
	
	function add_newsrcport_()
	{
		$("input[name=chklist]:checked").each(
				function()
				{
					var o = $(this);
					var id = o.parent().attr("id");
					var name = o.next().html();
					add_newsrcport(id, name);
				});
	}
	/* endregion */
	
	/* region remove */
	function remove_originalsource(o)
	{
		var item = $(o);
		var id = item.parent().attr("id");
		$("#id_originalsource").removeData('orgsrc');
		$("#" + id).remove();
		return false;
	}
	
	function remove_originalport(o)
	{
		var item = $(o);
		var id = item.parent().attr("id");
		$("#id_originalport").removeData('orgport');
		$("#" + id).remove();
		return false;
	}
	
	function remove_originaldest(o)
	{
		var item = $(o);
		var id = item.parent().attr("id");
		$("#id_originaldest").removeData('orgdest');
		$("#" + id).remove();
		return false;
	}
	
	function remove_newdesthost(o)
	{
		var item = $(o);
		var id = item.parent().attr("id");
		$("#id_newdesthost").removeData('newdesthost');
		$("#" + id).remove();
		return false;
	}
	
	function remove_newdestport(o)
	{
		var item = $(o);
		var id = item.parent().attr("id");
		$("#id_newdestport").removeData('newdestport');
		$("#" + id).remove();
		return false;
	}
	
	function remove_newsrcaddr(o)
	{
		var item = $(o);
		var id = item.parent().attr("id");
		$("#id_newsrcaddr").removeData('newsrcaddr');
		$("#" + id).remove();
		return false;
	}
	
	function remove_newsrcport(o)
	{
		var item = $(o);
		var id = item.parent().attr("id");
		$("#id_newsrcport").removeData('newsrcport');
		$("#" + id).remove();
		return false;
	}
	/* endregion */
	
	/* region edit */
	function edit_originalsource(obj)
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
				scope: 'orgsrc',
				func_update: update_originalsource,
				func_show_all: show_all_1,
				func_show_add: show_add_1
		};
		defnet.init_edit_form(data);
		return false;
	}
	
	function update_originalsource(id, name, self)
	{
		$(self).next().html(name);
		var isopen = $("#list-panel").dialog('isOpen');
		if (isopen)
			filter_list1();
	}
	
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
				func_show_all: show_all_2,
				func_show_add: show_add_2
		};
		defservices.init_edit_form(data);
		return false;
	}
	
	function update_originalport(id, name, self)
	{
		$(self).next().html(name);
		var isopen = $("#list-panel").dialog('isOpen');
		if (isopen)
			filter_list2();
	}
	
	function edit_originaldest(obj)
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
				scope: 'orgdest',
				func_update: update_originaldest,
				func_show_all: show_all_3,
				func_show_add: show_add_3
		};
		defnet.init_edit_form(data);
		return false;
	}
	
	function update_originaldest(id, name, self)
	{
		$(self).next().html(name);
		var isopen = $("#list-panel").dialog('isOpen');
		if (isopen)
			filter_list3();
	}
	
	function edit_newdesthost(obj)
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
				scope: 'newdesthost',
				func_update: update_newdesthost,
				func_show_all: show_all_4,
				func_show_add: show_add_4
		};
		defnet.init_edit_form(data);
		return false;
	}
	
	function update_newdesthost(id, name, self)
	{
		$(self).next().html(name);
		var isopen = $("#list-panel").dialog('isOpen');
		if (isopen)
			filter_list4();
	}
	
	function edit_newdestport(obj)
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
				scope: 'newdestport',
				func_update: update_newdestport,
				func_show_all: show_all_5,
				func_show_add: show_add_5
		};
		defservices.init_edit_form(data);
		return false;
	}
	
	function update_newdestport(id, name, self)
	{
		$(self).next().html(name);
		var isopen = $("#list-panel").dialog('isOpen');
		if (isopen)
			filter_list5();
	}
	
	function edit_newsrcaddr(obj)
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
				scope: 'newsrcaddr',
				func_update: update_newsrcaddr,
				func_show_all: show_all_6,
				func_show_add: show_add_6
		};
		defnet.init_edit_form(data);
		return false;
	}
	
	function update_newsrcaddr(id, name, self)
	{
		$(self).next().html(name);
		var isopen = $("#list-panel").dialog('isOpen');
		if (isopen)
			filter_list6();
	}
	
	function edit_newsrcport(obj)
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
				scope: 'newsrcport',
				func_update: update_newsrcport,
				func_show_all: show_all_7,
				func_show_add: show_add_7
		};
		defservices.init_edit_form(data);
		return false;
	}
	
	function update_newsrcport(id, name, self)
	{
		$(self).next().html(name);
		var isopen = $("#list-panel").dialog('isOpen');
		if (isopen)
			filter_list7();
	}
	/* endregion */
	
	function set_mode(mode)
	{
		if (mode == '1')
		{
			$(".row.new_src").hide();
			$(".row.new_dest").show();
		}
		
		else if (mode == '2')
		{
			$(".row.new_dest").hide();
			$(".row.new_src").show();
		}
		
		else
		{
			$(".row.new_dest,.row.new_src").show();
		}
	}
	
	function set_items()
	{
		var mode = $("#id_mode").val();
		var orgsrc = $("#id_originalsource > div").attr("id");
		var _orgsrc = utils.get_itemid(orgsrc);
		utils.set_data($("#id_originalsource"), 'orgsrc', _orgsrc);
		var orgport = $("#id_originalport > div").attr("id");
		var _orgport = utils.get_itemid(orgport);
		utils.set_data($("#id_originalport"), 'orgport', _orgport);
		var orgdest = $("#id_originaldest > div").attr("id");
		var _orgdest = utils.get_itemid(orgdest);
		utils.set_data($("#id_originaldest"), 'orgdest', _orgdest);
		if (mode == '1' || mode == '3')
		{
			var newdesthost = $("#id_newdesthost > div").attr("id");
			var _newdesthost = utils.get_itemid(newdesthost);
			utils.set_data($("#id_newdesthost"), 'newdesthost', _newdesthost);
			var newdestport = $("#id_newdestport > div").attr("id");
			var _newdestport = utils.get_itemid(newdestport);
			utils.set_data($("#id_newdestport"), 'newdestport', _newdestport);
		}
		
		else if (mode == '2' || mode == '3')
		{
			var newsrcaddr = $("#id_newsrcaddr > div").attr("id");
			var _newsrcaddr = utils.get_itemid(newsrcaddr);
			utils.set_data($("#id_newsrcaddr"), 'newsrcaddr', _newsrcaddr);
			var newsrcport = $("#id_newsrcport > div").attr("id");
			var _newsrcport = utils.get_itemid(newsrcport);
			utils.set_data($("#id_newsrcport"), 'newsrcport', _newsrcport);
		}
		
		set_mode(mode);
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
		return menu.get('/nat/dnatsnat/', init);
	}
	
	return {
		load:load,
		init:init,
		edit_originalsource:edit_originalsource,
		remove_originalsource:remove_originalsource,
		edit_originalport:edit_originalport,
		remove_originalport:remove_originalport,
		edit_originaldest:edit_originaldest,
		remove_originaldest:remove_originaldest,
		edit_newdesthost:edit_newdesthost,
		remove_newdesthost:remove_newdesthost,
		edit_newdestport:edit_newdestport,
		remove_newdestport:remove_newdestport,
		edit_newsrcaddr:edit_newsrcaddr,
		remove_newsrcaddr:remove_newsrcaddr,
		edit_newsrcport:edit_newsrcport,
		remove_newsrcport:remove_newsrcport
	}
}());