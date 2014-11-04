/*
 * @include "utils.js"
 * @include "nav_list.js"
 * @include "defnet.js"
 * @include "defschedule.js"
 * @include "defuser.js"
 * @include "wpcat.js"
 * @include "wpext.js"
 * @include "wpmime.js"
 * @include "wpwhitelist.js"
 * @include "wpblacklist.js"
 * @include "wpcontent.js"
 */

var wpprofile = (function()
{
	/* region var */
	var save_url = "/wpprofile/save/";
	var delete_url = "/wpprofile/delete/";
	var update_enable_url = "/wpprofile/save/enable/";
	var update_location_url = "/wpprofile/save/location/";
	var list_url = "/wpprofile/list/";
	var save_except_url_url = "/wpcat/url/save/";
	var import_except_url = "/wpcat/import/";
	var export_except_url = "/wpcat/export/";
	var popup_dialog_opt = null;
	var popup_dialog_edit_except_url_opt = null;
	var popup_dialog_import_except_url_opt = null;
	var popup_dialog_export_except_url_opt = null;
	var drag_opt_1 = null;
	var drag_opt_2 = null;
	var drag_opt_3 = null;
	var drag_opt_4 = null;
	var drag_opt_5 = null;
	var drag_opt_6 = null;
	var drag_opt_7 = null;
	var drag_opt_8 = null;
	var drag_opt_9 = null;
	var drag_opt_10 = null;
	var drag_opt_11 = null;
	var drag_opt_except_1 = null;
	var drag_opt_except_2 = null;
	var sort_opt = null;
	/* endregion */

	function init_ui_opt()
	{
		popup_dialog_edit_except_url_opt = {
				autoOpen: false,
				width: 320,
				resizable: false,
				draggable: false,
				modal: false,
				stack: false,
				zIndex: 1000
		};
		popup_dialog_import_except_url_opt = {
				autoOpen: false,
				width: 350,
				resizable: false,
				draggable: false,
				modal: false,
				stack: false,
				zIndex: 1000
		};
		popup_dialog_export_except_url_opt = {
				autoOpen: false,
				width: 350,
				resizable: false,
				draggable: false,
				modal: false,
				stack: false,
				zIndex: 1000
		};
		drag_opt_1 = {
				revert: true,
				snap: false,
				revertDuration: 0,
				zIndex: 1001,
				appendTo: 'body',
				helper: 'clone',
				scope: 'schedules',
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
				scope: 'users',
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
				scope: 'exts',
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
				scope: 'exts',
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
				scope: 'mimes',
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
				scope: 'mimes',
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
				scope: 'categories',
				drag: utils.add_drag_css,
				stop: utils.remove_drag_css
		};
		drag_opt_8 = {
				revert: true,
				snap: false,
				revertDuration: 0,
				zIndex: 1001,
				appendTo: 'body',
				helper: 'clone',
				scope: 'whitelist',
				drag: utils.add_drag_css,
				stop: utils.remove_drag_css
		};
		drag_opt_9 = {
				revert: true,
				snap: false,
				revertDuration: 0,
				zIndex: 1001,
				appendTo: 'body',
				helper: 'clone',
				scope: 'blacklist',
				drag: utils.add_drag_css,
				stop: utils.remove_drag_css
		};
		drag_opt_10 = {
				revert: true,
				snap: false,
				revertDuration: 0,
				zIndex: 1001,
				appendTo: 'body',
				helper: 'clone',
				scope: 'contentfilters',
				drag: utils.add_drag_css,
				stop: utils.remove_drag_css
		};
		drag_opt_11 = {
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
		drag_opt_except_1 = {
				revert: true,
				snap: false,
				revertDuration: 0,
				zIndex: 1001,
				appendTo: 'body',
				helper: 'clone',
				scope: 'nets',
				drag: utils.add_drag_css,
				stop: utils.remove_drag_css
		};
		drag_opt_except_2 = {
				revert: true,
				snap: false,
				revertDuration: 0,
				zIndex: 1001,
				appendTo: 'body',
				helper: 'clone',
				scope: 'users',
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

	function get_ui_opt()
	{
		init_ui_opt();
		return {
			popup_dialog_edit_except_url_opt: popup_dialog_edit_except_url_opt,
			popup_dialog_import_except_url_opt: popup_dialog_import_except_url_opt,
			popup_dialog_export_except_url_opt: popup_dialog_export_except_url_opt,
			drag_opt_1: drag_opt_1,
			drag_opt_2: drag_opt_2,
			drag_opt_3: drag_opt_3,
			drag_opt_4: drag_opt_4,
			drag_opt_5: drag_opt_5,
			drag_opt_6: drag_opt_6,
			drag_opt_7: drag_opt_7,
			drag_opt_8: drag_opt_8,
			drag_opt_9: drag_opt_9,
			drag_opt_10: drag_opt_10,
			drag_opt_11: drag_opt_11,
			drag_opt_except_1: drag_opt_except_1,
			drag_opt_except_2: drag_opt_except_2
		}
	}
	
	function init_form(data)
	{
		var offset = $(data.self).offset();
		var position = [offset.left, utils.get_elm_top(offset.top)];
		var _prefix = '_' + data.level;
		var sep = (data.scope == '' ? '' : '-');
		var scopeq = (data.scope == '' ? '' : '&scope=' + data.scope);
		utils.remove_dialog("#dialog-add" + sep + data.scope + _prefix);
		$("#dialog_edit_body" + sep + data.scope + data.prefix).empty();
		$("#dialog-edit" + sep + data.scope + data.prefix).dialog('close');
		var url = (data.url == null ? save_url : data.url);
		$("#dialog-add" + sep + data.scope + data.prefix).dialog('option', 'position', position);
		$("#dialog_body" + sep + data.scope + data.prefix).load(url + "?level=" + data.level + scopeq, null,
				function()
				{
					init_ui_opt();
					var nextform = $("#save-form" + sep + data.scope + _prefix);
					init_list_data(nextform);
					nextform.find("#id_scheduleon").click(toggle_schedule);
					nextform.find(".save_button.save").bind('click',function(){
						return data.func_save;
					});
					nextform.find(".save_button.cancel").click(function()
							{
								utils.cancel_dialog(data.level, "#dialog-add" + sep + data.scope);
							});
					init_list_cmd_(nextform, data);
					init_dialog(sep + data.scope + _prefix);
					init_list_droppable(nextform);
					nextform.find("#wpprofile_tabs").tabs();
					nextform.find("#wpprofile_filter_tabs").tabs();
					utils.bind_hover(nextform.find("#except .add_button"));
					utils.bind_hover(nextform.find(".save_button"));
					$("#dialog-edit" + sep + data.scope + data.prefix).dialog('close');
					$("#dialog-add" + sep + data.scope + data.prefix).dialog('open');
				});
	}

	function init_edit_except_url_form(data)
	{
		var offset = $(data.self).offset();
		var position = [offset.left, utils.get_elm_top(offset.top)];
		var _prefix = '_' + data.level;
		var sep = (data.scope == '' ? '' : '-');
		var scopeq = (data.scope == '' ? '' : '&scope=' + data.scope);
		utils.remove_dialog("#dialog-edit-excepturl" + sep + data.scope + _prefix);
		var url = (data.url == null ? save_except_url_url : data.url);
		$("#dialog-edit-excepturl" + sep + data.scope + data.prefix).dialog('option', 'position', position);
		$("#dialog_edit_body-excepturl" + sep + data.scope + data.prefix).load(url + "?level=" + data.level + scopeq, null,
				function()
				{
					var nextform = $("#save-urlform" + sep + data.scope + _prefix);
					nextform.find("#id_url").val(data.urlvalue);
					nextform.find(".save_button.save").click(function()
							{
								return update_excepturl(data);
							});
					nextform.find(".save_button.cancel").click(function()
							{
								utils.cancel_dialog(data.level, "#dialog-edit-excepturl" + sep + data.scope);
							});
					utils.bind_hover(nextform.find(".save_button"));
					$("#dialog-edit-excepturl" + sep + data.scope + data.prefix).dialog('open');
				});
	}

	function init_import_except_url_form(data)
	{
		var offset = $(data.self).offset();
		var position = [offset.left, utils.get_elm_top(offset.top)];
		var _prefix = '_' + data.level;
		var sep = (data.scope == '' ? '' : '-');
		var scopeq = (data.scope == '' ? '' : '&scope=' + data.scope);
		$("#dialog-import-excepturl" + sep + data.scope + data.prefix).dialog('option', 'position', position);
		$("#dialog_import_body-excepturl" + sep + data.scope + data.prefix).load(import_except_url + "?level=" + data.level + scopeq, null,
				function()
				{
					var nextform = $("#import-form" + sep + data.scope + _prefix);
					nextform.find(".save_button.import").click(function()
							{
								return func_importexcepturl(data);
							});
					nextform.find(".save_button.cancel").click(function()
							{
								utils.cancel_dialog(data.level, "#dialog-import-excepturl" + sep + data.scope);
							});
					utils.bind_hover(nextform.find(".save_button"));
					$("#dialog-import-excepturl" + sep + data.scope + data.prefix).dialog('open');
				});
	}

	function init_export_except_url_form(data)
	{
		var offset = $(data.self).offset();
		var position = [offset.left, utils.get_elm_top(offset.top)];
		var _prefix = '_' + data.level;
		var sep = (data.scope == '' ? '' : '-');
		var scopeq = (data.scope == '' ? '' : '&scope=' + data.scope);
		$("#dialog-export-excepturl" + sep + data.scope + data.prefix).dialog('option', 'position', position);
		$("#dialog_export_body-excepturl" + sep + data.scope + data.prefix).load(export_except_url + "?level=" + data.level + scopeq, null,
				function()
				{
					var nextform = $("#export-form" + sep + data.scope + _prefix);
					nextform.find(".save_button.cancel").click(function()
							{
								utils.cancel_dialog(data.level, "#dialog-export-excepturl" + sep + data.scope);
							});
					nextform.find("#id_delimiter").change(set_export_excepturl_delimiter);
					utils.bind_hover(nextform.find(".save_button"));
					init_export_excepturl_data(data, nextform);
					$("#dialog-export-excepturl" + sep + data.scope + data.prefix).dialog('open');
				});
	}

	function show_form()
	{
		$("#left_box").load(save_url, null,
				function()
				{
					var form = $("#save-form");
					init_list_data(form);
					$("#left_box").css('width', '99%');
					$(".save_button.save").click(func_save);
					$(".save_button.cancel,.form_title div.close").click(utils.cancel_form);
					$("#id_scheduleon").click(toggle_schedule);
					init_list_cmd();
					init_list_droppable(form);
					init_dialog('');
					$("#wpprofile_tabs").tabs();
					$("#wpprofile_filter_tabs").tabs();
					utils.bind_hover($("#except .add_button"));
					utils.bind_hover($(".save_button,.form_title div.close"));
					$("#left_box").show();
				});
		return false;
	}
	
	// Nghia create this one to support wizard.
	function show_form_dialog(url_profile_save,data,cmd,self)
	{
		try
		{
			$("#dialog_body-profile").load(url_profile_save,data,function(){
					try
					{
						var form1 = $("#save-form-profile_1");
						init_list_data(form1);
						
						$("#wpprofile_tabs").tabs();
						$("#wpprofile_filter_tabs").tabs();
						
						
						if (data["id"] != null)
							form1.find(".save_button.save").bind('click',function(){ return cmd.func_save_profile(); });
						else
							form1.find(".save_button.save").bind('click',function(){ return cmd.func_create_profile(); });
							
						cmd.set_items_(form1);
						init_list_cmd_(form1,cmd);
						
						$(".save_button.cancel,.form_title div.close").click(utils.cancel_form);
						utils.bind_hover($("#except .add_button"));
						utils.bind_hover($(".save_button,.form_title div.close"));
						
						init_dialog_wizard("-profile_1");
						
						$("#id_scheduleon").click(toggle_schedule);
						
						location_parent = $("#id_location").parent();
						$(location_parent).hide();
						
						$("#wpprofile_tabs").tabs("remove",4);
						$("#wpprofile_tabs").tabs("remove",1);
							
								
						obb = $("#id_exceptusers");
			
						a = $(obb).find(".editicon");
			
						$(a).each(function(index){
							$(this).removeClass('proxynow editicon item_edit');
							$(this).addClass('proxynow usericon spaceiconlist');
							});
			
						$($("#exceptusers").find(".img_add")).remove(); 
						$($("#excepturls").find(".img_import")).remove();
						$($("#excepturls").find(".img_export")).remove();
				
					}
					catch(error)
					{
						
					}
				});
		}
		catch(error)
		{
		
		}
		
	}
	
	//-------------------------------------------------------------------------------
	
	function toggle_schedule()
	{
		if (this.checked)
			$(".wpprofileschd").hide();

		else
			$(".wpprofileschd").show();
	}

	function init_list_data(form)
	{
		utils.set_data(form.find("#id_schedules"), 'schedules', []);
		utils.set_data(form.find("#id_users"), 'userinternals', []);
		utils.set_data(form.find("#id_users"), 'userexternals', []);
		utils.set_data(form.find("#id_allowexts"), 'allowexts', []);
		utils.set_data(form.find("#id_blockexts"), 'blockexts', []);
		utils.set_data(form.find("#id_allowmimes"), 'allowmimes', []);
		utils.set_data(form.find("#id_blockmimes"), 'blockmimes', []);
		utils.set_data(form.find("#id_categories"), 'categories', []);
		utils.set_data(form.find("#id_whitelist"), 'whitelist', []);
		utils.set_data(form.find("#id_blacklist"), 'blacklist', []);
		utils.set_data(form.find("#id_contents"), 'contents', []);
		utils.set_data(form.find("#id_nets"), 'nets', []);
		var except = $("#except");
		utils.set_data(except.find("#id_exceptnets"), 'exceptnets', []);
		utils.set_data(except.find("#id_excepturls"), 'excepturls', []);
		utils.set_data(except.find("#id_exceptusers"), 'exceptuserinternals', []);
		utils.set_data(except.find("#id_exceptusers"), 'exceptuserexternals', []);
	}

	function init_list_cmd()
	{
		$("#schedules .img_folder").click(show_all1);
		$("#schedules .img_add").click(show_add1);
		$("#users .img_folder").click(show_all2);
		$("#users .img_add").click(show_add2);
		$("#allowexts .img_folder").click(show_all3);
		$("#allowexts .img_add").click(show_add3);
		$("#blockexts .img_folder").click(show_all4);
		$("#blockexts .img_add").click(show_add4);
		$("#allowmimes .img_folder").click(show_all5);
		$("#allowmimes .img_add").click(show_add5);
		$("#blockmimes .img_folder").click(show_all6);
		$("#blockmimes .img_add").click(show_add6);
		$("#categories .img_folder").click(show_all7);
		$("#categories .img_add").click(show_add7);
		$("#whitelist .img_folder").click(show_all8);
		$("#whitelist .img_add").click(show_add8);
		$("#blacklist .img_folder").click(show_all9);
		$("#blacklist .img_add").click(show_add9);
		$("#contents .img_folder").click(show_all10);
		$("#contents .img_add").click(show_add10);
		$("#nets .img_folder").click(show_all11);
		$("#nets .img_add").click(show_add11);
		var except = $("#except");
		except.find("#exceptnets .img_folder").click(show_allexcept1);
		except.find("#exceptnets .img_add").click(show_addexcept1);
		except.find("#excepturls .img_import").click(show_importexcept1);
		except.find("#excepturls .img_export").click(show_exportexcept1);
		except.find("#exceptusers .img_folder").click(show_allexcept2);
		except.find("#exceptusers .img_add").click(show_addexcept2);
		except.find("#id_url").keypress(function(evt)
				{
					except_url_keypress(evt, $("#save-form"));
				});
		except.find(".add_button").click(function()
				{
					return add_except_url($("#save-form"));
				});
	}
	
	function init_list_cmd_(form, o)
	{
		form.find("#schedules .img_folder").click(o.func_show_all1);
		form.find("#schedules .img_add").click(o.func_show_add1);
		form.find("#users .img_folder").click(o.func_show_all2);
		form.find("#users .img_add").click(o.func_show_add2);
		form.find("#allowexts .img_folder").click(o.func_show_all3);
		form.find("#allowexts .img_add").click(o.func_show_add3);
		form.find("#blockexts .img_folder").click(o.func_show_all4);
		form.find("#blockexts .img_add").click(o.func_show_add4);
		form.find("#allowmimes .img_folder").click(o.func_show_all5);
		form.find("#allowmimes .img_add").click(o.func_show_add5);
		form.find("#blockmimes .img_folder").click(o.func_show_all6);
		form.find("#blockmimes .img_add").click(o.func_show_add6);
		form.find("#categories .img_folder").click(o.func_show_all7);
		form.find("#categories .img_add").click(o.func_show_add7);
		form.find("#whitelist .img_folder").click(o.func_show_all8);
		form.find("#whitelist .img_add").click(o.func_show_add8);
		form.find("#blacklist .img_folder").click(o.func_show_all9);
		form.find("#blacklist .img_add").click(o.func_show_add9);
		form.find("#contents .img_folder").click(o.func_show_all10);
		form.find("#contents .img_add").click(o.func_show_add10);
		form.find("#nets .img_folder").click(o.func_show_all11);
		form.find("#nets .img_add").click(o.func_show_add11);
		var except = form.find("#except");
		except.find("#exceptnets .img_folder").click(o.func_show_allexcept1);
		except.find("#exceptnets .img_add").click(o.func_show_addexcept1);
		//except.find("#excepturls .img_import").click(o.func_show_importexcept1);
		//except.find("#excepturls .img_export").click(o.func_show_exportexcept1);
		except.find("#exceptusers .img_folder").click(o.func_show_allexcept2);
		except.find("#exceptusers .img_add").click(o.func_show_addexcept2);
		except.find("#id_url").keypress(function(evt)
				{
					except_url_keypress_wizard(evt, form);
				});
		except.find(".add_button").click(function()
				{
					return add_except_url_wizard(form);
				});
	}

	function init_list_droppable(form)
	{
		var hoverclass = 'ui-state-active';
		form.find("#id_schedules").droppable({
			hoverClass: hoverclass,
			scope: 'schedules',
			drop: function(evt, ui)
			{
				var o = ui.draggable;
				add_dragged_schedule(form, o);
			}
		});
		form.find("#id_users").droppable({
			hoverClass: hoverclass,
			scope: 'users',
			drop: function(evt, ui)
			{
				var o = ui.draggable;
				add_dragged_user(form, o);
			}
		});
		form.find("#id_allowexts").droppable({
			hoverClass: hoverclass,
			scope: 'exts',
			drop: function(evt, ui)
			{
				var o = ui.draggable;
				add_dragged_allowext(form, o);
			}
		});
		form.find("#id_blockexts").droppable({
			hoverClass: hoverclass,
			scope: 'exts',
			drop: function(evt, ui)
			{
				var o = ui.draggable;
				add_dragged_blockext(form, o);
			}
		});
		form.find("#id_allowmimes").droppable({
			hoverClass: hoverclass,
			scope: 'mimes',
			drop: function(evt, ui)
			{
				var o = ui.draggable;
				add_dragged_allowmime(form, o);
			}
		});
		form.find("#id_blockmimes").droppable({
			hoverClass: hoverclass,
			scope: 'mimes',
			drop: function(evt, ui)
			{
				var o = ui.draggable;
				add_dragged_blockmime(form, o);
			}
		});
		form.find("#id_categories").droppable({
			hoverClass: hoverclass,
			scope: 'categories',
			drop: function(evt, ui)
			{
				var o = ui.draggable;
				add_dragged_cat(form, o);
			}
		});
		form.find("#id_whitelist").droppable({
			hoverClass: hoverclass,
			scope: 'whitelist',
			drop: function(evt, ui)
			{
				var o = ui.draggable;
				add_dragged_whitelist(form, o);
			}
		});
		form.find("#id_blacklist").droppable({
			hoverClass: hoverclass,
			scope: 'blacklist',
			drop: function(evt, ui)
			{
				var o = ui.draggable;
				add_dragged_blacklist(form, o);
			}
		});
		form.find("#id_contents").droppable({
			hoverClass: hoverclass,
			scope: 'contentfilters',
			drop: function(evt, ui)
			{
				var o = ui.draggable;
				add_dragged_content(form, o);
			}
		});
		form.find("#id_nets").droppable({
			hoverClass: hoverclass,
			scope: defnet.drop_scope,
			drop: function(evt, ui)
			{
				var o = ui.draggable;
				add_dragged_net(form, o);
			}
		});
		var except = form.find("#except");
		except.find("#id_exceptnets").droppable({
			hoverClass: hoverclass,
			scope: defnet.drop_scope,
			drop: function(evt, ui)
			{
				var o = ui.draggable;
				add_dragged_exceptnet(form, o);
			}
		});
		except.find("#id_exceptusers").droppable({
			hoverClass: hoverclass,
			scope: 'users',
			drop: function(evt, ui)
			{
				var o = ui.draggable;
				add_dragged_exceptuser(form, o);
			}
		});
	}

	function init_dialog(arg)
	{
		$("#dialog-add-schedule" + arg).dialog(defschedule.get_ui_opt().popup_dialog_opt);
		$("#dialog-edit-schedule" + arg).dialog(defschedule.get_ui_opt().popup_dialog_opt);
		$("#dialog-add-user" + arg).dialog(defuser.get_ui_opt().popup_dialog_opt);
		$("#dialog-edit-user" + arg).dialog(defuser.get_ui_opt().popup_dialog_opt);
		$("#dialog-add-allowext" + arg).dialog(wpext.get_ui_opt().popup_dialog_opt);
		$("#dialog-edit-allowext" + arg).dialog(wpext.get_ui_opt().popup_dialog_opt);
		$("#dialog-add-blockext" + arg).dialog(wpext.get_ui_opt().popup_dialog_opt);
		$("#dialog-edit-blockext" + arg).dialog(wpext.get_ui_opt().popup_dialog_opt);
		$("#dialog-add-allowmime" + arg).dialog(wpmime.get_ui_opt().popup_dialog_opt);
		$("#dialog-edit-allowmime" + arg).dialog(wpmime.get_ui_opt().popup_dialog_opt);
		$("#dialog-add-blockmime" + arg).dialog(wpmime.get_ui_opt().popup_dialog_opt);
		$("#dialog-edit-blockmime" + arg).dialog(wpmime.get_ui_opt().popup_dialog_opt);
		$("#dialog-add-cat" + arg).dialog(wpcat.get_ui_opt().popup_dialog_opt);
		$("#dialog-edit-cat" + arg).dialog(wpcat.get_ui_opt().popup_dialog_export_opt);
		$("#dialog-add-whitelist" + arg).dialog(wpwhitelist.get_ui_opt().popup_dialog_opt);
		$("#dialog-edit-whitelist" + arg).dialog(wpwhitelist.get_ui_opt().popup_dialog_opt);
		$("#dialog-add-blacklist" + arg).dialog(wpblacklist.get_ui_opt().popup_dialog_opt);
		$("#dialog-edit-blacklist" + arg).dialog(wpblacklist.get_ui_opt().popup_dialog_opt);
		$("#dialog-add-content" + arg).dialog(wpcontent.get_ui_opt().popup_dialog_opt);
		$("#dialog-edit-content" + arg).dialog(wpcontent.get_ui_opt().popup_dialog_opt);
		$("#dialog-add-net" + arg).dialog(defnet.get_ui_opt().popup_dialog_opt);
		$("#dialog-edit-net" + arg).dialog(defnet.get_ui_opt().popup_dialog_opt);
		$("#dialog-add-exceptnet" + arg).dialog(defnet.get_ui_opt().popup_dialog_opt);
		$("#dialog-edit-exceptnet" + arg).dialog(defnet.get_ui_opt().popup_dialog_opt);
		$("#dialog-add-exceptuser" + arg).dialog(defuser.get_ui_opt().popup_dialog_opt);
		$("#dialog-edit-exceptuser" + arg).dialog(defuser.get_ui_opt().popup_dialog_opt);
		$("#dialog-edit-excepturl" + arg).dialog(popup_dialog_edit_except_url_opt);
		$("#dialog-import-excepturl" + arg).dialog(popup_dialog_import_except_url_opt);
		$("#dialog-export-excepturl" + arg).dialog(popup_dialog_export_except_url_opt);
	}
	
	//nghia add
	function init_dialog_wizard(arg)
	{
		$("#dialog-add-schedule" + arg).dialog(defschedule.get_ui_opt().popup_dialog_opt);
		$("#dialog-edit-schedule" + arg).dialog(defschedule.get_ui_opt().popup_dialog_opt);
		$("#dialog-add-user" + arg).dialog(defuser.get_ui_opt().popup_dialog_opt);
		$("#dialog-edit-user" + arg).dialog(defuser.get_ui_opt().popup_dialog_opt);
		$("#dialog-add-allowext" + arg).dialog(wpext.get_ui_opt().popup_dialog_opt);
		$("#dialog-edit-allowext" + arg).dialog(wpext.get_ui_opt().popup_dialog_opt);
		$("#dialog-add-blockext" + arg).dialog(wpext.get_ui_opt().popup_dialog_opt);
		$("#dialog-edit-blockext" + arg).dialog(wpext.get_ui_opt().popup_dialog_opt);
		$("#dialog-add-allowmime" + arg).dialog(wpmime.get_ui_opt().popup_dialog_opt);
		$("#dialog-edit-allowmime" + arg).dialog(wpmime.get_ui_opt().popup_dialog_opt);
		$("#dialog-add-blockmime" + arg).dialog(wpmime.get_ui_opt().popup_dialog_opt);
		$("#dialog-edit-blockmime" + arg).dialog(wpmime.get_ui_opt().popup_dialog_opt);
		$("#dialog-add-cat" + arg).dialog(wpcat.get_ui_opt().popup_dialog_opt);
		$("#dialog-edit-cat" + arg).dialog(wpcat.get_ui_opt().popup_dialog_export_opt);
		$("#dialog-add-whitelist" + arg).dialog(wpwhitelist.get_ui_opt().popup_dialog_opt);
		$("#dialog-edit-whitelist" + arg).dialog(wpwhitelist.get_ui_opt().popup_dialog_opt);
		$("#dialog-add-blacklist" + arg).dialog(wpblacklist.get_ui_opt().popup_dialog_opt);
		$("#dialog-edit-blacklist" + arg).dialog(wpblacklist.get_ui_opt().popup_dialog_opt);
		$("#dialog-add-content" + arg).dialog(wpcontent.get_ui_opt().popup_dialog_opt);
		$("#dialog-edit-content" + arg).dialog(wpcontent.get_ui_opt().popup_dialog_opt);
		$("#dialog-add-net" + arg).dialog(defnet.get_ui_opt().popup_dialog_opt);
		$("#dialog-edit-net" + arg).dialog(defnet.get_ui_opt().popup_dialog_opt);
		$("#dialog-add-exceptnet" + arg).dialog(defnet.get_ui_opt().popup_dialog_opt);
		$("#dialog-edit-exceptnet" + arg).dialog(defnet.get_ui_opt().popup_dialog_opt);
		$("#dialog-add-exceptuser" + arg).dialog(defuser.get_ui_opt().popup_dialog_opt);
		$("#dialog-edit-exceptuser" + arg).dialog(defuser.get_ui_opt().popup_dialog_opt);
		//$("#dialog-edit-excepturl" + arg).dialog(popup_dialog_edit_except_url_opt);
		//$("#dialog-import-excepturl" + arg).dialog(popup_dialog_import_except_url_opt);
		//$("#dialog-export-excepturl" + arg).dialog(popup_dialog_export_except_url_opt);
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
					$("#left_box").css('width', '99%');
					$(".save_button.save").click(
							function()
							{
								if (o.clone == null)
									return func_update(arg);

								else
									return func_save();
							});
					$(".save_button.cancel,.form_title div.close").click(utils.cancel_form);
					$("#id_scheduleon").click(toggle_schedule);
					init_list_cmd();
					init_list_droppable($("#save-form"));
					init_dialog('');
					set_items();
					$("#wpprofile_tabs").tabs();
					$("#wpprofile_filter_tabs").tabs();
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

	function cancel_dialog(level, dialog_id)
	{
		var i = level - 1;
		var prefix = (i < 1 ? '' : '_' + i);
		$(dialog_id + prefix).dialog('close');
	}

	function init_export_excepturl_data(o, form)
	{
		var i = o.level - 1;
		var sep = (o.scope == '' ? '' : '-');
		var _prefix = (i < 1 ? '' : '_' + i);
		var prevform = $("#save-form" + sep + o.scope + _prefix);
		set_export_excepturl_text(prevform, form);
	}

	function set_export_excepturl_delimiter()
	{
		var form = utils.get_parent(this, 2);
		var formid = form.attr("id");
		var level = utils.get_form_level(formid);
		var scope = utils.get_form_scope(formid);
		var i = level - 1;
		var sep = (scope == '' ? '' : '-');
		var _prefix = (i < 1 ? '' : '_' + i);
		var prevform = $("#save-form" + sep + scope + _prefix);
		set_export_excepturl_text(prevform, form);
	}

	function set_export_excepturl_text(prevform, currform)
	{
		var delimiter = get_delimiter(currform);
		var arr = prevform.find("#except").find("#id_excepturls").data('excepturls');
		if (arr != null)
		{
			var exporttxt = '';
			var n = arr.length;
			for (var i = 0; i < n; i++)
			{
				if ($.trim(arr[i]) == '')
					continue;

				if (i < n - 1)
					exporttxt += arr[i] + delimiter;

				else
					exporttxt += arr[i];
			}

			currform.find("#id_exporttext").val(exporttxt);
		}
	}

	function show_importexcept1()
	{
		var form = utils.get_parent(this, 7);
		var o = get_form_level_data(form);
		var self = this;
		var data = {
				self: self,
				level: o.level,
				prefix: o.prefix,
				scope: ''
		};
		init_import_except_url_form(data);
		return false;
	}

	function show_exportexcept1()
	{
		var form = utils.get_parent(this, 7);
		var o = get_form_level_data(form);
		var self = this;
		var data = {
				self: self,
				level: o.level,
				prefix: o.prefix,
				scope: ''
		}
		init_export_except_url_form(data);
		return false;
	}

	function get_data(form, arg, savetype)
	{
		var except = $("#except");
		var scheduleon = (form.find("#id_scheduleon").attr("checked") ? 1 : 0);
		var skipauth = (except.find("#id_skipauth").attr("checked") == "checked" ? 1 : 0);
		var skipcache = (except.find("#id_skipcache").attr("checked") == "checked" ? 1 : 0);
		var skipav = (except.find("#id_skipav").attr("checked") == "checked" ? 1 : 0);
		var skipext = (except.find("#id_skipext").attr("checked") == "checked" ? 1 : 0);
		var skipmime = (except.find("#id_skipmime").attr("checked") == "checked" ? 1 : 0);
		var skipurl = (except.find("#id_skipurl").attr("checked") == "checked" ? 1 : 0);
		var skipcontentfilter = (except.find("#id_skipcontentfilter").attr("checked") == "checked" ? 1 : 0);
		var schedules = form.find("#id_schedules").data('schedules');
		var userinternals = form.find("#id_users").data('userinternals');
		var userexternals = form.find("#id_users").data('userexternals');
		var allowexts = form.find("#id_allowexts").data('allowexts');
		var blockexts = form.find("#id_blockexts").data('blockexts');
		var allowmimes = form.find("#id_allowmimes").data('allowmimes');
		var blockmimes = form.find("#id_blockmimes").data('blockmimes');
		var categories = form.find("#id_categories").data('categories');
		var whitelist = form.find("#id_whitelist").data('whitelist');
		var blacklist = form.find("#id_blacklist").data('blacklist');
		var contents = form.find("#id_contents").data('contents');
		var nets = form.find("#id_nets").data('nets');
		var exceptnets = except.find("#id_exceptnets").data('exceptnets');
		var excepturls = except.find("#id_excepturls").data('excepturls');
		var exceptuserinternals = except.find("#id_exceptusers").data('exceptuserinternals');
		var exceptuserexternals = except.find("#id_exceptusers").data('exceptuserexternals');
		var arrschedules = schedules.join(',');
		var arruserinternals = userinternals.join(',');
		var arruserexternals = userexternals.join(',');
		var arrallowexts = allowexts.join(',');
		var arrblockexts = blockexts.join(',');
		var arrallowmimes = allowmimes.join(',');
		var arrblockmimes = blockmimes.join(',');
		var arrcategories = categories.join(',');
		var arrwhitelist = whitelist.join(',');
		var arrblacklist = blacklist.join(',');
		var arrcontents = contents.join(',');
		var arrnets = nets.join(',');
		var arrexceptnets = exceptnets.join(',');
		var arrexcepturls = excepturls.join('||');
		var arrexceptuserinternals = exceptuserinternals.join(',');
		var arrexceptuserexternals = exceptuserexternals.join(',');
		var data = {
				name: form.find("#id_name").val(),
				location: form.find("#id_location").val(),
				timequota: form.find("#id_timequota").val(),
				sizequota: form.find("#id_sizequota").val(),
				catdef: form.find("#id_catdef").val(),
				safesearchon: form.find("#id_safesearchon").val(),
				scheduleon: scheduleon,
				schedules: arrschedules,
				userinternals: arruserinternals,
				userexternals: arruserexternals,
				allowexts: arrallowexts,
				blockexts: arrblockexts,
				allowmimes: arrallowmimes,
				blockmimes: arrblockmimes,
				cats: arrcategories,
				whitelist: arrwhitelist,
				blacklist: arrblacklist,
				contentfilters: arrcontents,
				nets: arrnets,
				skipauth: skipauth,
				skipcache: skipcache,
				skipav: skipav,
				skipext: skipext,
				skipmime: skipmime,
				skipurl: skipurl,
				skipcontentfilter: skipcontentfilter,
				exceptnets: arrexceptnets,
				excepturls: arrexcepturls,
				exceptuserinternals: arrexceptuserinternals,
				exceptuserexternals: arrexceptuserexternals,
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

	/* region show all */
	function show_all1()
	{
		$("#leftcolumn").hide();
		$("#list_body").load(defschedule.list.panel, null,
				function()
				{
					$(".add_button").click(add_schedule_);
					$(".drag_zone").draggable(drag_opt_1);
					$("#id_filters").change(filter_list1);
					$("#id_filter_text").keyup(function()
							{
								utils.countdown_filter(filter_list1);
							});
					$("#id_filter_text").keydown(utils.stop_filter_timer);
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
		$("#panel_body").load(defschedule.list.select + s, null,
				function()
				{
					$(".drag_zone").draggable(drag_opt_1);
				});
	}

	function show_all2()
	{
		$("#leftcolumn").hide();
		$("#list_body").load('/user/list/panel/', null,
				function()
				{
					$(".add_button").click(add_user_);
					$(".drag_zone").draggable(drag_opt_2);
					$("#id_filters").change(filter_list2);
					$("#id_filter_text").keyup(function()
							{
								utils.countdown_filter(filter_list2);
							});
					$("#id_filter_text").keydown(utils.stop_filter_timer);
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
		$("#panel_body").load('/user/list/select/' + s, null,
				function()
				{
					$(".drag_zone").draggable(drag_opt_2);
				});
	}

	function show_all3()
	{
		$("#leftcolumn").hide();
		$("#list_body").load(wpext.list.panel, null,
				function()
				{
					$(".add_button").click(add_allowext_);
					$(".drag_zone").draggable(drag_opt_3);
					$("#id_filter_text").attr('size', '26');
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
		var keyword = $("#id_filter_text").val();
		var s = (keyword == "" ? "" : "?text=" + keyword);
		$("#panel_body").load(wpext.list.select + s, null,
				function()
				{
					$(".drag_zone").draggable(drag_opt_3);
				});
	}

	function show_all4()
	{
		$("#leftcolumn").hide();
		$("#list_body").load(wpext.list.panel, null,
				function()
				{
					$(".add_button").click(add_blockext_);
					$(".drag_zone").draggable(drag_opt_4);
					$("#id_filter_text").attr('size', '26');
					$("#id_filter_text").keyup(function()
							{
								utils.countdown_filter(filter_list4);
							});
					$("#id_filter_text").keydown(utils.stop_filter_timer);
					utils.bind_hover($(".add_button"));
					$("#list-panel").dialog('open');
				});
		return false;
	}

	function filter_list4()
	{
		var keyword = $("#id_filter_text").val();
		var s = (keyword == "" ? "" : "?text=" + keyword);
		$("#panel_body").load(wpext.list.select + s, null,
				function()
				{
					$(".drag_zone").draggable(drag_opt_4);
				});
	}

	function show_all5()
	{
		$("#leftcolumn").hide();
		$("#list_body").load(wpmime.list.panel, null,
				function()
				{
					$(".add_button").click(add_allowmime_);
					$(".drag_zone").draggable(drag_opt_5);
					$("#id_filter_text").attr('size', '26');
					$("#id_filter_text").keyup(function()
							{
								utils.countdown_filter(filter_list5);
							});
					$("#id_filter_text").keydown(utils.stop_filter_timer);
					utils.bind_hover($(".add_button"));
					$("#list-panel").dialog('open');
				});
		return false;
	}

	function filter_list5()
	{
		var keyword = $("#id_filter_text").val();
		var s = (keyword == "" ? "" : "?text=" + keyword);
		$("#panel_body").load(wpmime.list.select + s, null,
				function()
				{
					$(".drag_zone").draggable(drag_opt_5);
				});
	}

	function show_all6()
	{
		$("#leftcolumn").hide();
		$("#list_body").load(wpmime.list.panel, null,
				function()
				{
					$(".add_button").click(add_blockmime_);
					$(".drag_zone").draggable(drag_opt_6);
					$("#id_filter_text").attr('size', '26');
					$("#id_filter_text").keyup(function()
							{
								utils.countdown_filter(filter_list6);
							});
					$("#id_filter_text").keydown(utils.stop_filter_timer);
					utils.bind_hover($(".add_button"));
					$("#list-panel").dialog('open');
				});
		return false;
	}

	function filter_list6()
	{
		var keyword = $("#id_filter_text").val();
		var s = (keyword == "" ? "" : "?text=" + keyword);
		$("#panel_body").load(wpmime.list.select + s, null,
				function()
				{
					$(".drag_zone").draggable(drag_opt_6);
				});
	}

	function show_all7()
	{
		$("#leftcolumn").hide();
		$("#list_body").load(wpcat.list.panel, null,
				function()
				{
					$(".add_button").click(add_cat_);
					$(".drag_zone").draggable(drag_opt_7);
					$("#id_filters").change(filter_list7);
					$("#id_filter_text").keyup(function()
							{
								utils.countdown_filter(filter_list7);
							});
					$("#id_filter_text").keydown(utils.stop_filter_timer);
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
		$("#panel_body").load(wpcat.list.select + s, null,
				function()
				{
					$(".drag_zone").draggable(drag_opt_1);
				});
	}

	function show_all8()
	{
		$("#leftcolumn").hide();
		$("#list_body").load(wpwhitelist.list.panel, null,
				function()
				{
					$(".add_button").click(add_whitelist_);
					$(".drag_zone").draggable(drag_opt_8);
					$("#id_filter_text").attr('size', '26');
					$("#id_filter_text").keyup(function()
							{
								utils.countdown_filter(filter_list8);
							});
					$("#id_filter_text").keydown(utils.stop_filter_timer);
					utils.bind_hover($(".add_button"));
					$("#list-panel").dialog('open');
				});
		return false;
	}

	function filter_list8()
	{
		var keyword = $("#id_filter_text").val();
		var s = (keyword == "" ? "" : "?text=" + keyword);
		$("#panel_body").load(wpwhitelist.list.select + s, null,
				function()
				{
					$(".drag_zone").draggable(drag_opt_8);
				});
	}

	function show_all9()
	{
		$("#leftcolumn").hide();
		$("#list_body").load(wpblacklist.list.panel, null,
				function()
				{
					$(".add_button").click(add_blacklist_);
					$(".drag_zone").draggable(drag_opt_9);
					$("#id_filter_text").attr('size', '26');
					$("#id_filter_text").keyup(function()
							{
								utils.countdown_filter(filter_list9);
							});
					$("#id_filter_text").keydown(utils.stop_filter_timer);
					utils.bind_hover($(".add_button"));
					$("#list-panel").dialog('open');
				});
		return false;
	}

	function filter_list9()
	{
		var keyword = $("#id_filter_text").val();
		var s = (keyword == "" ? "" : "?text=" + keyword);
		$("#panel_body").load(wpblacklist.list.select + s, null,
				function()
				{
					$(".drag_zone").draggable(drag_opt_9);
				});
	}

	function show_all10()
	{
		$("#leftcolumn").hide();
		$("#list_body").load(wpcontent.list.panel, null,
				function()
				{
					$(".add_button").click(add_content_);
					$(".drag_zone").draggable(drag_opt_10);
					$("#id_filter_text").attr('size', '26');
					$("#id_filter_text").keyup(function()
							{
								utils.countdown_filter(filter_list10);
							});
					$("#id_filter_text").keydown(utils.stop_filter_timer);
					utils.bind_hover($(".add_button"));
					$("#list-panel").dialog('open');
				});
		return false;
	}

	function filter_list10()
	{
		var keyword = $("#id_filter_text").val();
		var s = (keyword == "" ? "" : "?text=" + keyword);
		$("#panel_body").load(wpcontent.list.select + s, null,
				function()
				{
					$(".drag_zone").draggable(drag_opt_10);
				});
	}

	function show_all11()
	{
		$("#leftcolumn").hide();
		$("#list_body").load(defnet.list.panel, null,
				function()
				{
					$(".add_button").click(add_net_);
					$(".drag_zone").draggable(drag_opt_11);
					$("#id_filters").change(filter_list11);
					$("#id_filter_text").keyup(function()
							{
								utils.countdown_filter(filter_list11);
							});
					$("#id_filter_text").keydown(utils.stop_filter_timer);
					defnet.init_tooltip();
					utils.bind_hover($(".add_button"));
					$("#list-panel").dialog('open');
				});
		return false;
	}

	function filter_list11()
	{
		var search_by_qry = "?find=" + $("#id_filters").val();
		var keyword = $("#id_filter_text").val();
		var s = (search_by_qry == '?find=0' && keyword == "" ? "" : search_by_qry + "&text=" + keyword);
		$("#panel_body").load(defnet.list.select + s, null,
				function()
				{
					$(".drag_zone").draggable(drag_opt_11);
					defnet.init_tooltip();
				});
	}

	function show_allexcept1()
	{
		$("#leftcolumn").hide();
		$("#list_body").load(defnet.list.panel, null,
				function()
				{
					$(".add_button").click(add_exceptnet_);
					$(".drag_zone").draggable(drag_opt_except_1);
					$("#id_filters").change(filter_listexcept1);
					$("#id_filter_text").keyup(function()
							{
								utils.countdown_filter(filter_listexcept1);
							});
					$("#id_filter_text").keydown(utils.stop_filter_timer);
					defnet.init_tooltip();
					utils.bind_hover($(".add_button"));
					$("#list-panel").dialog('open');
				});
		return false;
	}

	function filter_listexcept1()
	{
		var search_by_qry = "?find=" + $("#id_filters").val();
		var keyword = $("#id_filter_text").val();
		var s = (search_by_qry == '?find=0' && keyword == "" ? "" : search_by_qry + "&text=" + keyword);
		$("#panel_body").load(defnet.list.select + s, null,
				function()
				{
					$(".drag_zone").draggable(drag_opt_except_1);
					defnet.init_tooltip();
				});
	}

	function show_allexcept2()
	{
		$("#leftcolumn").hide();
		$("#list_body").load('/user/list/panel/', null,
				function()
				{
					$(".add_button").click(add_exceptuser_);
					$(".drag_zone").draggable(drag_opt_except_2);
					$("#id_filters").change(filter_listexcept2);
					$("#id_filter_text").keyup(function()
							{
								utils.countdown_filter(filter_listexcept2);
							});
					$("#id_filter_text").keydown(utils.stop_filter_timer);
					utils.bind_hover($(".add_button"));
					$("#list-panel").dialog('open');
				});
		return false;
	}

	function filter_listexcept2()
	{
		var search_by_qry = "?find=" + $("#id_filters").val();
		var keyword = $("#id_filter_text").val();
		var s = (search_by_qry == '?find=0' && keyword == "" ? "" : search_by_qry + "&text=" + keyword);
		$("#panel_body").load('/user/list/select/' + s, null,
				function()
				{
					$(".drag_zone").draggable(drag_opt_except_2);
				});
	}

	function show_all_2()
	{
		return show_all_defuser_helper(defuser.add_members, this);
	}

	function show_all_11()
	{
		return show_all_defnet_helper(defnet.add_members, this);
	}

	function show_all_except1()
	{
		return show_all_defnet_helper(defnet.add_members, this);
	}

	function show_all_except2()
	{
		return show_all_defuser_helper(defuser.add_members, this);
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

	function show_all_defuser_helper(func_add, _this_)
	{
		var isopen = $("#list-panel").dialog('isOpen');
		if (isopen)
		{
			$("#list-panel").dialog('close');
			return false;
		}

		$("#leftcolumn").hide();
		var form = utils.get_parent(_this_, 4);
		$("#list_body").load(defuser.list.panel, null,
				function()
				{
					$(".add_button").click(function()
							{
								func_add(form);
							});
					$(".drag_zone").draggable(defuser.get_ui_opt().drag_opt);
					$("#id_filters").change(filter_list_defuser);
					$("#id_filter_text").keyup(function()
							{
								utils.countdown_filter(filter_list_defuser);
							});
					$("#id_filter_text").keydown(utils.stop_filter_timer);
					utils.bind_hover($(".add_button"));
					$("#list-panel").dialog('open');
				});
		return false;
	}

	function filter_list_defuser()
	{
		var search_by_qry = "?find=" + $("#id_filters").val();
		var keyword = $("#id_filter_text").val();
		var s = (search_by_qry == '?find=0' && keyword == "" ? "" : search_by_qry + "&text=" + keyword);
		$("#panel_body").load(defuser.list.select + s, null,
				function()
				{
					$(".drag_zone").draggable(defuser.get_ui_opt().drag_opt);
				});
	}
	/* endregion */

	/* region show add */
	function show_add1()
	{
		var self = this;
		var data = {
				self: self,
				scope: 'schedule',
				level: 1,
				prefix: '',
				func_save: save_to_schedule
		};
		defschedule.init_form(data);
		return false;
	}

	function show_add2()
	{
		var self = this;
		var data = {
				self: self,
				scope: 'user',
				func_save: save_to_user,
				func_show_all: show_all_2,
				func_show_add: show_add_2
		}
		show_add_defuser_init_helper(data);
		return false;
	}

	function show_add3()
	{
		var self = this;
		var data = {
				self: self,
				scope: 'allowext',
				level: 1,
				prefix: '',
				func_save: save_to_allowext,
				func_show_import: show_import4,
				func_show_export: show_export4
		};
		wpext.init_form(data);
		return false;
	}

	function show_add4()
	{
		var self = this;
		var data = {
				self: self,
				scope: 'blockext',
				level: 1,
				prefix: '',
				func_save: save_to_blockext,
				func_show_import: show_import5,
				func_show_export: show_export5
		};
		wpext.init_form(data);
		return false;
	}

	function show_add5()
	{
		var self = this;
		var data = {
				self: self,
				scope: 'allowmime',
				level: 1,
				prefix: '',
				func_save: save_to_allowmime,
				func_show_import: show_import6,
				func_show_export: show_export6
		};
		wpmime.init_form(data);
		return false;
	}

	function show_add6()
	{
		var self = this;
		var data = {
				self: self,
				scope: 'blockmime',
				level: 1,
				prefix: '',
				func_save: save_to_blockmime,
				func_show_import: show_import7,
				func_show_export: show_export7
		}
		wpmime.init_form(data);
		return false;
	}

	function show_add7()
	{
		var self = this;
		var data = {
				self: self,
				scope: 'cat',
				level: 1,
				prefix: '',
				func_save: save_to_cat,
				func_show_import: show_import1,
				func_show_export: show_export1
		};
		wpcat.init_form(data);
		return false;
	}

	function show_add8()
	{
		var self = this;
		var data = {
				self: self,
				scope: 'whitelist',
				level: 1,
				prefix: '',
				func_save: save_to_whitelist,
				func_show_import: show_import2,
				func_show_export: show_export2
		};
		wpwhitelist.init_form(data);
		return false;
	}

	function show_add9()
	{
		var self = this;
		var data = {
				self: self,
				scope: 'blacklist',
				level: 1,
				prefix: '',
				func_save: save_to_blacklist,
				func_show_import: show_import3,
				func_show_export: show_export3
		};
		wpblacklist.init_form(data);
		return false;
	}

	function show_add10()
	{
		var self = this;
		var data = {
				self: self,
				scope: 'content',
				level: 1,
				prefix: '',
				func_save: save_to_content
		};
		wpcontent.init_form(data);
		return false;
	}

	function show_add11()
	{
		var self = this;
		var data = {
				self: self,
				scope: 'net',
				func_save: save_to_net,
				func_show_all: show_all_11,
				func_show_add: show_add_11
		};
		show_add_defnet_init_helper(data);
		return false;
	}

	function show_addexcept1()
	{
		var self = this;
		var data = {
				self: self,
				scope: 'exceptnet',
				func_save: save_to_exceptnet,
				func_show_all: show_all_except1,
				func_show_add: show_add_except1
		};
		show_add_defnet_init_helper(data);
		return false;
	}

	function show_addexcept2()
	{
		var self = this;
		var data = {
				self: self,
				scope: 'exceptuser',
				func_save: save_to_exceptuser,
				func_show_all: show_all_except2,
				func_show_add: show_add_except2
		}
		show_add_defuser_init_helper(data);
		return false;
	}

	function show_add_2()
	{
		var self = this;
		var data = {
				self: self,
				scope: 'user',
				func_show_all: show_all_2,
				func_show_add: show_add_2
		};
		show_add_defuser_helper(data);
		return false;
	}

	function show_add_11()
	{
		var self = this;
		var data = {
				self: self,
				scope: 'net',
				func_show_all: show_all_11,
				func_show_add: show_add_11
		};
		show_add_defnet_helper(data);
		return false;
	}

	function show_add_except1()
	{
		var self = this;
		var data = {
				self: self,
				scope: 'exceptnet',
				func_show_all: show_all_except1,
				func_show_add: show_add_except1
		};
		show_add_defnet_helper(data);
		return false;
	}

	function show_add_except2()
	{
		var self = this;
		var data = {
				self: self,
				scope: 'exceptuser',
				func_show_all: show_all_except2,
				func_show_add: show_add_except2
		};
		show_add_defuser_helper(data);
		return false;
	}

	function show_add_filter_init_helper(self, data)
	{
		var level = 1;
		var offset = $(self).offset();
		var position = [offset.left, utils.get_elm_top(offset.top)];
		var _prefix = '_' + level;
		utils.remove_dialog("#dialog-add-" + data.scope + _prefix);
		$("#dialog-add-" + data.scope).dialog('option', 'position', position);
		$("#dialog_body-" + data.scope).load(data.save_url + "?level=" + level + "&scope=" + data.scope, null,
				function()
				{
					var nextform = $("#save-form-" + data.scope + _prefix);
					utils.set_data(nextform.find(data.list_id), data.key, []);
					nextform.find(data.input_id).keypress(function(evt)
							{
								if (evt.keyCode == '13')
								{
									evt.preventDefault();
									evt.stopPropagation();
									data.func_add(nextform);
								}
							});
					nextform.find(data.add_button).click(function()
							{
								return data.func_add(nextform);
							});
					nextform.find(".save_button.save").click(data.func_save);
					nextform.find(".save_button.cancel").click(function()
							{
								cancel_dialog(level, "#dialog-add-" + data.scope);
							});
					utils.bind_hover(nextform.find(data.hover));
					$("#dialog-add-" + data.scope).dialog('open');
				});
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

	function show_add_defuser_init_helper(data)
	{
		data['level'] = 1;
		data['prefix'] = '';
		defuser.init_form(data);
	}

	function show_add_defuser_helper(data)
	{
		var o = defuser.get_level_data(data.self);
		data['level'] = o.level;
		data['prefix'] = o.prefix;
		defuser.init_form(data);
	}
	/* endregion */

	/* region save helper */
	function save_to_schedule()
	{
		var o = {
				level: 1,
				scope: 'schedule',
				func_add: add_schedule__
		};
		return defschedule.save_inner_form(o);
	}

	function save_to_user()
	{
		var o = {
				level: 1,
				scope: 'user',
				func_add: add_userinternal__
		};
		return defuser.save_inner_form(o);
	}

	function save_to_allowext()
	{
		var o = {
				level: 1,
				scope: 'allowext',
				func_add: add_allowext__
		};
		return wpext.save_inner_form(o);
	}

	function save_to_blockext()
	{
		var o = {
				level: 1,
				scope: 'blockext',
				func_add: add_blockext__
		};
		return wpext.save_inner_form(o);
	}

	function save_to_allowmime()
	{
		var o = {
				level: 1,
				scope: 'allowmime',
				func_add: add_allowmime__
		};
		return wpmime.save_inner_form(o);
	}

	function save_to_blockmime()
	{
		var o = {
				level: 1,
				scope: 'blockmime',
				func_add: add_blockmime__
		};
		return wpmime.save_inner_form(o);
	}

	function save_to_cat()
	{
		var o = {
				level: 1,
				scope: 'cat',
				func_add: add_cat__
		};
		return wpcat.save_inner_form(o);
	}

	function save_to_whitelist()
	{
		var o = {
				level: 1,
				scope: 'whitelist',
				func_add: add_whitelist__
		};
		return wpwhitelist.save_inner_form(o);
	}

	function save_to_blacklist()
	{
		var o = {
				level: 1,
				scope: 'blacklist',
				func_add: add_blacklist__
		};
		return wpblacklist.save_inner_form(o);
	}

	function save_to_content()
	{
		var o = {
				level: 1,
				scope: 'content',
				func_add: add_content__
		};
		return wpcontent.save_inner_form(o);
	}

	function save_to_net()
	{
		var o = {
				level: 1,
				scope: 'net',
				func_add: add_net__
		};
		return defnet.save_inner_form(o);
	}

	function save_to_exceptnet()
	{
		var o = {
				level: 1,
				scope: 'exceptnet',
				func_add: add_exceptnet__
		};
		return defnet.save_inner_form(o);
	}

	function save_to_exceptuser()
	{
		var o = {
				level: 1,
				scope: 'exceptuser',
				func_add: add_exceptuserinternal__
		};
		return defuser.save_inner_form(o);
	}
	/* endregion */

	/* region add dragged item */
	function add_dragged_schedule(form, o)
	{
		var item = $(o);
		var name = item.html();
		var id = item.parent().attr("id");
		add_schedule(form, id, name);
	}

	function add_schedule(form, id, name)
	{
		var _id = parseInt(id, 10);
		var arr = form.find("#id_schedules").data('schedules');
		if (!utils.item_exist(_id, arr))
		{
			arr.push(_id);
			utils.set_data(form.find("#id_schedules"), 'id_schedules', arr);
			var data = {
					id_prefix: 'schedule_',
					id: _id,
					click: 'wpprofile.remove_schedule(this)',
					editclick: 'wpprofile.edit_schedule(this)',
					name: name
			};
			var h = new EJS({url: '/media/tpl/list_item.ejs'}).render(data);
			form.find("#id_schedules").append(h);
		}

		set_alt_css(form, "#id_schedules");
	}
	
	function add_schedule_wizard(form, id, name)
	{
		var _id = parseInt(id, 10);
		var arr = form.find("#id_schedules").data('schedules');
		if (!utils.item_exist(_id, arr))
		{
			arr.push(_id);
			utils.set_data(form.find("#id_schedules"), 'id_schedules', arr);
			var data = {
					id_prefix: 'schedule_',
					id: _id,
					click: 'wpprofile.remove_schedule(this)',
					editclick: 'wizard.edit_schedule(this)',
					name: name
			};
			var h = new EJS({url: '/media/tpl/list_item.ejs'}).render(data);
			form.find("#id_schedules").append(h);
		}

		set_alt_css(form, "#id_schedules");
	}
	
	
	function add_schedule__(id, name)
	{
		add_schedule($("#save-form"), id, name);
	}

	function add_dragged_user(form, o)
	{
		var item = $(o);
		var name = item.html();
		var id = item.parent().attr("id");
		var _id = utils.get_itemid(id);
		if (id.indexOf('userint') >= 0)
			add_userinternal(form, _id, name);

		else
			add_userexternal(form, _id, name);
	}

	function add_userinternal(form, id, name)
	{
		var arr = form.find("#id_users").data('userinternals');
		if (!utils.item_exist(id, arr))
		{
			arr.push(id);
			utils.set_data(form.find("#id_users"), 'userinternals', arr);
			var data = {
					id_prefix: 'userint_',
					id: id,
					click: 'wpprofile.remove_userinternal(this)',
					editclick: 'wpprofile.edit_userinternal(this)',
					name: name
			};
			var h = new EJS({url: '/media/tpl/list_item.ejs'}).render(data);
			form.find("#id_users").append(h);
		}

		set_alt_css(form, "#id_users");
	}

	function add_userexternal(form, id, name)
	{
		var arr = form.find("#id_users").data('userexternals');
		if (!utils.item_exist(id, arr))
		{
			arr.push(id);
			utils.set_data(form.find("#id_users"), 'userexternals', arr);
			var data = {
					id_prefix: 'userext_',
					id: id,
					click: 'wpprofile.remove_userexternal(this)',
					editclick: 'false',
					name: name
			};
			var h = new EJS({url: '/media/tpl/list_item.ejs'}).render(data);
			form.find("#id_users").append(h);
		}

		set_alt_css(form, "#id_users");
	}
	
	function add_userinternal__(id, name)
	{
		add_userinternal($("#save-form"), id, name);
	}
	
	function add_userexternal__(id, name)
	{
		add_userexternal($("#save-form"), id, name);
	}

	function add_dragged_allowext(form, o)
	{
		var item = $(o);
		var name = item.html();
		var id = item.parent().attr("id");
		add_allowext(form, id, name);
	}

	function add_allowext(form, id, name, argeditclick)
	{
		var _id = parseInt(id, 10);
		var editclick = (!argeditclick ? 'wpprofile.edit_allowext(this)' : argeditclick);
		var arr = form.find("#id_allowexts").data('allowexts');
		if (!utils.item_exist(_id, arr))
		{
			arr.push(_id);
			utils.set_data(form.find("#id_allowexts"), 'allowexts', arr);
			var data = {
					id_prefix: 'allowext_',
					id: _id,
					click: 'wpprofile.remove_allowext(this)',
					editclick: editclick,
					name: name
			};
			var h = new EJS({url: '/media/tpl/list_item.ejs'}).render(data);
			form.find("#id_allowexts").append(h);
		}

		set_alt_css(form, "#id_allowexts");
	}
	
	function add_allowext__(id, name)
	{
		add_allowext($("#save-form"), id, name);
	}

	function add_dragged_blockext(form, o)
	{
		var item = $(o);
		var name = item.html();
		var id = item.parent().attr("id");
		add_blockext(form, id, name);
	}

	function add_blockext(form, id, name, argeditclick)
	{
		var _id = parseInt(id, 10);
		var editclick = (!argeditclick ? 'wpprofile.edit_blockext(this)' : argeditclick);
		var arr = form.find("#id_blockexts").data('blockexts');
		if (!utils.item_exist(_id, arr))
		{
			arr.push(_id);
			utils.set_data(form.find("#id_blockexts"), 'blockexts', arr);
			var data = {
					id_prefix: 'blockext_',
					id: _id,
					click: 'wpprofile.remove_blockext(this)',
					editclick: editclick,
					name: name
			};
			var h = new EJS({url: '/media/tpl/list_item.ejs'}).render(data);
			form.find("#id_blockexts").append(h);
		}

		set_alt_css(form, "#id_blockexts");
	}
	
	function add_blockext__(id, name)
	{
		add_blockext($("#save-form"), id, name);
	}

	function add_dragged_allowmime(form, o)
	{
		var item = $(o);
		var name = item.html();
		var id = item.parent().attr("id");
		add_allowmime(form, id, name);
	}

	function add_allowmime(form, id, name, argeditclick)
	{
		var _id = parseInt(id, 10);
		var editclick = (!argeditclick ? 'wpprofile.edit_allowmime(this)' : argeditclick);
		var arr = form.find("#id_allowmimes").data('allowmimes');
		if (!utils.item_exist(_id, arr))
		{
			arr.push(_id);
			utils.set_data(form.find("#id_allowmimes"), 'allowmimes', arr);
			var data = {
					id_prefix: 'allowmime_',
					id: _id,
					click: 'wpprofile.remove_allowmime(this)',
					editclick: editclick,
					name: name
			};
			var h = new EJS({url: '/media/tpl/list_item.ejs'}).render(data);
			form.find("#id_allowmimes").append(h);
		}

		set_alt_css(form, "#id_allowmimes");
	}
	
	function add_allowmime__(id, name)
	{
		add_allowmime($("#save-form"), id, name);
	}

	function add_dragged_blockmime(form, o)
	{
		var item = $(o);
		var name = item.html();
		var id = item.parent().attr("id");
		add_blockmime(form, id, name);
	}

	function add_blockmime(form, id, name, argeditclick)
	{
		var _id = parseInt(id, 10);
		var editclick = (!argeditclick ? 'wpprofile.edit_blockmime(this)' : argeditclick);
		var arr = form.find("#id_blockmimes").data('blockmimes');
		if (!utils.item_exist(_id, arr))
		{
			arr.push(_id);
			utils.set_data(form.find("#id_blockmimes"), 'blockmimes', arr);
			var data = {
					id_prefix: 'blockmime_',
					id: _id,
					click: 'wpprofile.remove_blockmime(this)',
					editclick: editclick,
					name: name
			};
			var h = new EJS({url: '/media/tpl/list_item.ejs'}).render(data);
			form.find("#id_blockmimes").append(h);
		}

		set_alt_css(form, "#id_blockmimes");
	}
	
	function add_blockmime__(id, name)
	{
		add_blockmime($("#save-form"), id, name);
	}

	function add_dragged_cat(form, o)
	{
		var item = $(o);
		var name = item.html();
		var id = item.parent().attr("id");
		add_cat(form, id, name);
	}

	function add_cat(form, id, name, argeditclick)
	{
		var _id = parseInt(id, 10);
		var editclick = (!argeditclick ? 'wpprofile.edit_cat(this)' : argeditclick);
		var arr = form.find("#id_categories").data('categories');
		if (!utils.item_exist(_id, arr))
		{
			arr.push(_id);
			utils.set_data(form.find("#id_categories"), 'categories', arr);
			var data = {
					id_prefix: 'cat_',
					id: _id,
					click: 'wpprofile.remove_cat(this)',
					editclick: editclick,
					name: name
			};
			var h = new EJS({url: '/media/tpl/list_item.ejs'}).render(data);
			form.find("#id_categories").append(h);
		}

		set_alt_css(form, "#id_categories");
	}
	
	function add_cat__(id, name)
	{
		add_cat($("#save-form"), id, name);
	}

	function add_dragged_whitelist(form, o)
	{
		var item = $(o);
		var name = item.html();
		var id = item.parent().attr("id");
		add_whitelist(form, id, name);
	}

	function add_whitelist(form, id, name, argeditclick)
	{
		var _id = parseInt(id, 10);
		var editclick = (!argeditclick ? 'wpprofile.edit_whitelist(this)' : argeditclick);
		var arr = form.find("#id_whitelist").data('whitelist');
		if (!utils.item_exist(_id, arr))
		{
			arr.push(_id);
			utils.set_data(form.find("#id_whitelist"), 'whitelist', arr);
			var data = {
					id_prefix: 'whitelist_',
					id: _id,
					click: 'wpprofile.remove_whitelist(this)',
					editclick: editclick,
					name: name
			};
			var h = new EJS({url: '/media/tpl/list_item.ejs'}).render(data);
			form.find("#id_whitelist").append(h);
		}

		set_alt_css(form, "#id_whitelist");
	}
	
	function add_whitelist__(id, name)
	{
		add_whitelist($("#save-form"), id, name);
	}

	function add_dragged_blacklist(form, o)
	{
		var item = $(o);
		var name = item.html();
		var id = item.parent().attr("id");
		add_blacklist(form, id, name);
	}

	function add_blacklist(form, id, name, argeditclick)
	{
		var _id = parseInt(id, 10);
		var editclick = (!argeditclick ? 'wpprofile.edit_blacklist(this)' : argeditclick);
		var arr = form.find("#id_blacklist").data('blacklist');
		if (!utils.item_exist(_id, arr))
		{
			arr.push(_id);
			utils.set_data(form.find("#id_blacklist"), 'blacklist', arr);
			var data = {
					id_prefix: 'blacklist_',
					id: _id,
					click: 'wpprofile.remove_blacklist(this)',
					editclick: editclick,
					name: name
			};
			var h = new EJS({url: '/media/tpl/list_item.ejs'}).render(data);
			form.find("#id_blacklist").append(h);
		}

		set_alt_css(form, "#id_blacklist");
	}
	
	function add_blacklist__(id, name)
	{
		add_blacklist($("#save-form"), id, name);
	}

	function add_dragged_content(form, o)
	{
		var item = $(o);
		var name = item.html();
		var id = item.parent().attr("id");
		add_content(form, id, name);
	}

	function add_content(form, id, name, argeditclick)
	{
		var _id = parseInt(id, 10);
		var editclick = (!argeditclick ? 'wpprofile.edit_content(this)' : argeditclick);
		var arr = form.find("#id_contents").data('contents');
		if (!utils.item_exist(_id, arr))
		{
			arr.push(_id);
			utils.set_data(form.find("#id_contents"), 'contents', arr);
			var data = {
					id_prefix: 'content_',
					id: _id,
					click: 'wpprofile.remove_content(this)',
					editclick: editclick,
					name: name
			};
			var h = new EJS({url: '/media/tpl/list_item.ejs'}).render(data);
			form.find("#id_contents").append(h);
		}

		set_alt_css(form, "#id_contents");
	}
	
	function add_content__(id, name)
	{
		add_content($("#save-form"), id, name);
	}

	function add_dragged_net(form, o)
	{
		var item = $(o);
		var name = item.html();
		var id = item.parent().attr("id");
		add_net(form, id, name);
	}

	function add_net(form, id, name)
	{
		var _id = parseInt(id, 10);
		var arr = form.find("#id_nets").data('nets');
		if (!utils.item_exist(_id, arr))
		{
			arr.push(_id);
			utils.set_data(form.find("#id_nets"), 'nets', arr);
			var data = {
					id_prefix: 'net_',
					id: _id,
					click: 'wpprofile.remove_net(this)',
					editclick: 'wpprofile.edit_net(this)',
					name: name
			};
			var h = new EJS({url: '/media/tpl/list_item.ejs'}).render(data);
			form.find("#id_nets").append(h);
		}

		set_alt_css(form, "#id_nets");
	}
	
	function add_net__(id, name)
	{
		add_net($("#save-form"), id, name);
	}

	function add_dragged_exceptnet(form, o)
	{
		var item = $(o);
		var name = item.html();
		var id = item.parent().attr("id");
		add_exceptnet(form, id, name);
	}

	function add_exceptnet(form, id, name)
	{
		var exform = form.find("#except");
		var _id = parseInt(id, 10);
		var arr = exform.find("#id_exceptnets").data('exceptnets');
		if (!utils.item_exist(_id, arr))
		{
			arr.push(_id);
			utils.set_data(exform.find("#id_exceptnets"), 'exceptnets', arr);
			var data = {
					id_prefix: 'exceptnet_',
					id: _id,
					click: 'wpprofile.remove_exceptnet(this)',
					editclick: 'wpprofile.edit_exceptnet(this)',
					name: name
			};
			var h = new EJS({url: '/media/tpl/list_item.ejs'}).render(data);
			exform.find("#id_exceptnets").append(h);
		}

		set_alt_css(exform, "#id_exceptnets");
	}
	
	function add_exceptnet_wizard(form, id, name)
	{
		var exform = form.find("#except");
		var _id = parseInt(id, 10);
		var arr = exform.find("#id_exceptnets").data('exceptnets');
		if (!utils.item_exist(_id, arr))
		{
			arr.push(_id);
			utils.set_data(exform.find("#id_exceptnets"), 'exceptnets', arr);
			var data = {
					id_prefix: 'exceptnet_',
					id: _id,
					click: 'wpprofile.remove_exceptnet(this)',
					editclick: 'wizard.edit_exceptnet(this)',
					name: name
			};
			
			var h = new EJS({url: '/media/tpl/list_item.ejs'}).render(data);
			exform.find("#id_exceptnets").append(h);
		}

		set_alt_css(exform, "#id_exceptnets");
	}
	
	function add_exceptnet__(id, name)
	{
		add_exceptnet($("#save-form"), id, name);
	}

	function add_dragged_exceptuser(form, o)
	{
		var item = $(o);
		var name = item.html();
		var id = item.parent().attr("id");
		var _id = utils.get_itemid(id);
		if (id.indexOf('userint') >= 0)
			add_exceptuserinternal(form, _id, name);

		else
			add_exceptuserexternal(form, _id, name);
	}

	function add_exceptuserinternal(form, id, name)
	{
		var exform = form.find("#except");
		var arr = exform.find("#id_exceptusers").data('exceptuserinternals');
		if (!utils.item_exist(id, arr))
		{
			arr.push(id);
			utils.set_data(exform.find("#id_exceptusers"), 'exceptuserinternals', arr);
			var data = {
					id_prefix: 'exceptuserint_',
					id: id,
					click: 'wpprofile.remove_exceptuserinternal(this)',
					editclick: 'wpprofile.edit_exceptuserinternal(this)',
					name: name
			};
			var h = new EJS({url: '/media/tpl/list_item.ejs'}).render(data);
			exform.find("#id_exceptusers").append(h);
		}

		set_alt_css(exform, "#id_exceptusers");
	}
	
	function add_exceptuserinternal_wizard(form, id, name)
	{
		var exform = form.find("#except");
		var arr = exform.find("#id_exceptusers").data('exceptuserinternals');
		if (!utils.item_exist(id, arr))
		{
			arr.push(id);
			utils.set_data(exform.find("#id_exceptusers"), 'exceptuserinternals', arr);
			var data = {
					id_prefix: 'exceptuserint_',
					id: id,
					click: 'wpprofile.remove_exceptuserinternal(this)',
					editclick: 'wizard.edit_exceptuserinternal(this)',
					name: name
			};
			var h = new EJS({url: '/media/tpl/list_item_2.ejs'}).render(data);
			exform.find("#id_exceptusers").append(h);
		}

		set_alt_css(exform, "#id_exceptusers");
	}
	function add_exceptuserexternal(form, id, name)
	{
		var exform = form.find("#except");
		var arr = exform.find("#id_exceptusers").data('exceptuserexternals');
		if (!utils.item_exist(id, arr))
		{
			arr.push(id);
			utils.set_data(exform.find("#id_exceptusers"), 'exceptuserexternals', arr);
			var data = {
					id_prefix: 'exceptuserext_',
					id: id,
					click: 'wpprofile.remove_exceptuserexternal(this)',
					editclick: 'wpprofile.edit_exceptuserexternal(this)',
					name: name
			};
			var h = new EJS({url: '/media/tpl/list_item.ejs'}).render(data);
			exform.find("#id_exceptusers").append(h);
		}

		set_alt_css(exform, "#id_exceptusers");
	}
	
	function add_exceptuserinternal__(id, name)
	{
		add_exceptuserinternal($("#save-form"), id, name);
	}
	
	function add_exceptuserexternal__(id, name)
	{
		add_exceptuserexternal($("#save-form"), id, name);
	}
	/* endregion */

	/* region add selected form checkbox */
	function add_schedule_()
	{
		$("input[name=chklist]:checked").each(
				function()
				{
					var o = $(this);
					var id = o.parent().attr("id");
					var name = o.next().html();
					add_schedule__(id, name);
				});
	}

	function add_user_()
	{
		$("input[name=chklist]:checked").each(
				function()
				{
					var o = $(this);
					var id = o.parent().attr("id");
					var name = o.next().html();
					var _id = utils.get_itemid(id);
					if (id.indexOf('userint') >= 0)
						add_userinternal__(_id, name);

					else
						add_userexternal__(_id, name);
				});
	}

	function add_allowext_()
	{
		$("input[name=chklist]:checked").each(
				function()
				{
					var o = $(this);
					var id = o.parent().attr("id");
					var name = o.next().html();
					add_allowext__(id, name);
				});
	}

	function add_blockext_()
	{
		$("input[name=chklist]:checked").each(
				function()
				{
					var o = $(this);
					var id = o.parent().attr("id");
					var name = o.next().html();
					add_blockext__(id, name);
				});
	}

	function add_allowmime_()
	{
		$("input[name=chklist]:checked").each(
				function()
				{
					var o = $(this);
					var id = o.parent().attr("id");
					var name = o.next().html();
					add_allowmime__(id, name);
				});
	}

	function add_blockmime_()
	{
		$("input[name=chklist]:checked").each(
				function()
				{
					var o = $(this);
					var id = o.parent().attr("id");
					var name = o.next().html();
					add_blockmime__(id, name);
				});
	}

	function add_cat_()
	{
		$("input[name=chklist]:checked").each(
				function()
				{
					var o = $(this);
					var id = o.parent().attr("id");
					var name = o.next().html();
					add_cat__(id, name);
				});
	}

	function add_whitelist_()
	{
		$("input[name=chklist]:checked").each(
				function()
				{
					var o = $(this);
					var id = o.parent().attr("id");
					var name = o.next().html();
					add_whitelist__(id, name);
				});
	}

	function add_blacklist_()
	{
		$("input[name=chklist]:checked").each(
				function()
				{
					var o = $(this);
					var id = o.parent().attr("id");
					var name = o.next().html();
					add_blacklist__(id, name);
				});
	}

	function add_content_()
	{
		$("input[name=chklist]:checked").each(
				function()
				{
					var o = $(this);
					var id = o.parent().attr("id");
					var name = o.next().html();
					add_content__(id, name);
				});
	}

	function add_net_()
	{
		$("input[name=chklist]:checked").each(
				function()
				{
					var o = $(this);
					var id = o.parent().attr("id");
					var name = o.next().html();
					add_net__(id, name);
				});
	}

	function add_exceptnet_()
	{
		$("input[name=chklist]:checked").each(
				function()
				{
					var o = $(this);
					var id = o.parent().attr("id");
					var name = o.next().html();
					add_exceptnet__(id, name);
				});
	}

	function add_exceptuser_()
	{
		$("input[name=chklist]:checked").each(
				function()
				{
					var o = $(this);
					var id = o.parent().attr("id");
					var name = o.next().html();
					var _id = utils.get_itemid(id);
					if (id.indexOf('userint') >= 0)
						add_exceptuserinternal__(_id, name);

					else
						add_exceptuserexternal__(_id, name);
				});
	}
	/* endregion */

	/* region show import/export */
	function show_import1()
	{
		var o = wpcat.get_level_data(this);
		var self = this;
		var data = {
				self: self,
				scope: 'cat',
				level: o.level,
				prefix: o.prefix
		};
		wpcat.init_import_form(data);
		return false;
	}

	function show_export1()
	{
		var o = wpcat.get_level_data(this);
		var self = this;
		var data = {
				self: self,
				scope: 'cat',
				level: o.level,
				prefix: o.prefix
		};
		wpcat.init_export_form(data);
		return false;
	}

	function show_import2()
	{
		var o = wpwhitelist.get_level_data(this);
		var self = this;
		var data = {
				self: self,
				scope: 'whitelist',
				level: o.level,
				prefix: o.prefix
		};
		wpwhitelist.init_import_form(data);
		return false;
	}

	function show_export2()
	{
		var o = wpwhitelist.get_level_data(this);
		var self = this;
		var data = {
				self: self,
				scope: 'whitelist',
				level: o.level,
				prefix: o.prefix
		};
		wpwhitelist.init_export_form(data);
		return false;
	}

	function show_import3()
	{
		var o = wpblacklist.get_level_data(this);
		var self = this;
		var data = {
				self: self,
				scope: 'blacklist',
				level: o.level,
				prefix: o.prefix
		};
		wpblacklist.init_import_form(data);
		return false;
	}

	function show_export3()
	{
		var o = wpblacklist.get_level_data(this);
		var self = this;
		var data = {
				self: self,
				scope: 'blacklist',
				level: o.level,
				prefix: o.prefix
		};
		wpblacklist.init_export_form(data);
		return false;
	}

	function show_import4()
	{
		var o = wpext.get_level_data(this);
		var self = this;
		var data = {
				self: self,
				scope: 'allowext',
				level: o.level,
				prefix: o.prefix
		};
		wpext.init_import_form(data);
		return false;
	}

	function show_export4()
	{
		var o = wpext.get_level_data(this);
		var self = this;
		var data = {
				self: self,
				scope: 'allowext',
				level: o.level,
				prefix: o.prefix
		};
		wpext.init_export_form(data);
		return false;
	}

	function show_import5()
	{
		var o = wpext.get_level_data(this);
		var self = this;
		var data = {
				self: self,
				scope: 'blockext',
				level: o.level,
				prefix: o.prefix
		};
		wpext.init_import_form(data);
		return false;
	}

	function show_export5()
	{
		var o = wpext.get_level_data(this);
		var self = this;
		var data = {
				self: self,
				scope: 'blockext',
				level: o.level,
				prefix: o.prefix
		};
		wpext.init_export_form(data);
		return false;
	}

	function show_import6()
	{
		var o = wpmime.get_level_data(this);
		var self = this;
		var data = {
				self: self,
				scope: 'allowmime',
				level: o.level,
				prefix: o.prefix
		};
		wpmime.init_import_form(data);
		return false;
	}

	function show_export6()
	{
		var o = wpmime.get_level_data(this);
		var self = this;
		var data = {
				self: self,
				scope: 'allowmime',
				level: o.level,
				prefix: o.prefix
		};
		wpmime.init_export_form(data);
		return false;
	}

	function show_import7()
	{
		var o = wpmime.get_level_data(this);
		var self = this;
		var data = {
				self: self,
				scope: 'blockmime',
				level: o.level,
				prefix: o.prefix
		};
		wpmime.init_import_form(data);
		return false;
	}

	function show_export7()
	{
		var o = wpmime.get_level_data(this);
		var self = this;
		var data = {
				self: self,
				scope: 'blockmime',
				level: o.level,
				prefix: o.prefix
		};
		wpmime.init_export_form(data);
		return false;
	}

	function show_import8()
	{
		var o = wpcontent.get_level_data(this);
		var self = this;
		var data = {
				self: self,
				scope: 'content',
				level: o.level,
				prefix: o.prefix
		};
		wpcontent.init_import_form(data);
		return false;
	}

	function show_export8()
	{
		var o = wpcontent.get_level_data(this);
		var self = this;
		var data = {
				self: self,
				scope: 'content',
				level: o.level,
				prefix: o.prefix
		};
		wpcontent.init_export_form(data);
		return false;
	}
	/* endregion */

	function except_url_keypress(evt, form)
	{
		if (evt.keyCode == '13')
		{
			evt.preventDefault();
			evt.stopPropagation();
			add_except_url(form);
		}
	}

	function add_except_url(form)
	{
		var except = form.find("#except");
		var v = except.find("#id_url").val();
		if (v == '')
			return false;

		var arr = [v];
		add_except_urls(except, arr);
		except.find("#id_url").val('');
		return false;
	}

	function add_except_urls(form, buff)
	{
		var arr = form.find("#id_excepturls").data('excepturls');
		var n = 0;
		if (buff == null)
			return;

		else if (buff.length > 0)
		{
			n = buff.length;
			var o = form.find("#id_excepturls");
			for (var i = 0; i < n; i++)
			{
				var v = buff[i];
				if (v == '')
					continue;

				if (!utils.item_exist(v, arr))
				{
					arr.push(v);
					var data = {
							id_prefix: 'excepturl_',
							id: 'item',
							click: 'wpprofile.remove_excepturl(this)',
							editclick: 'wpprofile.edit_excepturl(this)',
							name: v
					};
					var h = new EJS({url: '/media/tpl/list_item.ejs'}).render(data);
					o.append(h);
				}
			}

			utils.set_data(form.find("#id_excepturls"), 'excepturls', arr);
			set_alt_css(form, "#id_excepturls");
		}
	}
	function except_url_keypress_wizard(evt, form)
	{
		if (evt.keyCode == '13')
		{
			evt.preventDefault();
			evt.stopPropagation();
			add_except_url_wizard(form);
		}
	}
	
	function add_except_url_wizard(form)
	{
		var except = form.find("#except");
		var v = except.find("#id_url").val();
		if (v == '')
			return false;

		var arr = [v];
		add_except_urls_wizard(except, arr);
		except.find("#id_url").val('');
		return false;
	}

	function add_except_urls_wizard(form, buff)
	{
		var arr = form.find("#id_excepturls").data('excepturls');
		var n = 0;
		if (buff == null)
			return;

		else if (buff.length > 0)
		{
			n = buff.length;
			var o = form.find("#id_excepturls");
			for (var i = 0; i < n; i++)
			{
				var v = buff[i];
				if (v == '')
					continue;

				if (!utils.item_exist(v, arr))
				{
					arr.push(v);
					var data = {
							id_prefix: 'excepturl_',
							id: 'item',
							click: 'wpprofile.remove_excepturl(this)',
							editclick: 'wpprofile.edit_excepturl(this)',
							name: v
					};
					var h = new EJS({url: '/media/tpl/list_item_2.ejs'}).render(data);
					o.append(h);
				}
			}

			utils.set_data(form.find("#id_excepturls"), 'excepturls', arr);
			set_alt_css(form, "#id_excepturls");
		}
	}
	/* region remove */
	function remove_schedule(o)
	{
		var item = $(o);
		var id = item.parent().attr("id");
		var _id = utils.get_itemid(id);
		var form = utils.get_parent(item, 7);
		var arr = form.find("#id_schedules").data('schedules');
		var i = $.inArray(_id, arr);
		if (i >= 0)
		{
			arr.splice(i, 1);
			utils.set_data(form.find("#id_schedules"), 'schedules', arr);
		}

		form.find("#" + id).remove();
		utils.set_alt_css("#id_schedules");
		return false;
	}

	function remove_userinternal(o)
	{
		var item = $(o);
		var id = item.parent().attr("id");
		var _id = utils.get_itemid(id);
		var form = utils.get_parent(item, 7);
		var arr = form.find("#id_users").data('userinternals');
		var i = $.inArray(_id, arr);
		if (i >= 0)
		{
			arr.splice(i, 1);
			utils.set_data(form.find("#id_users"), 'userinternals', arr);
		}

		form.find("#" + id).remove();
		utils.set_alt_css("#id_users");
		return false;
	}

	function remove_userexternal(o)
	{
		var item = $(o);
		var id = item.parent().attr("id");
		var _id = utils.get_itemid(id);
		var form = utils.get_parent(item, 7);
		var arr = form.find("#id_users").data('userexternals');
		var i = $.inArray(_id, arr);
		if (i >= 0)
		{
			arr.splice(i, 1);
			utils.set_data(form.find("#id_users"), 'userexternals', arr);
		}

		form.find("#" + id).remove();
		utils.set_alt_css("#id_users");
		return false;
	}

	function remove_allowext(o)
	{
		var item = $(o);
		var id = item.parent().attr("id");
		var _id = utils.get_itemid(id);
		var form = utils.get_parent(item, 8);
		var arr = form.find("#id_allowexts").data('allowexts');
		var i = $.inArray(_id, arr);
		if (i >= 0)
		{
			arr.splice(i, 1);
			utils.set_data(form.find("#id_allowexts"), 'allowexts', arr);
		}

		form.find("#" + id).remove();
		utils.set_alt_css("#id_allowexts");
		return false;
	}

	function remove_blockext(o)
	{
		var item = $(o);
		var id = item.parent().attr("id");
		var _id = utils.get_itemid(id);
		var form = utils.get_parent(item, 8);
		var arr = form.find("#id_blockexts").data('blockexts');
		var i = $.inArray(_id, arr);
		if (i >= 0)
		{
			arr.splice(i, 1);
			utils.set_data(form.find("#id_blockexts"), 'blockexts', arr);
		}

		form.find("#" + id).remove();
		utils.set_alt_css("#id_blockexts");
		return false;
	}

	function remove_allowmime(o)
	{
		var item = $(o);
		var id = item.parent().attr("id");
		var _id = utils.get_itemid(id);
		var form = utils.get_parent(item, 8);
		var arr = form.find("#id_allowmimes").data('allowmimes');
		var i = $.inArray(_id, arr);
		if (i >= 0)
		{
			arr.splice(i, 1);
			utils.set_data(form.find("#id_allowmimes"), 'allowmimes', arr);
		}

		form.find("#" + id).remove();
		utils.set_alt_css("#id_allowmimes");
		return false;
	}

	function remove_blockmime(o)
	{
		var item = $(o);
		var id = item.parent().attr("id");
		var _id = utils.get_itemid(id);
		var form = utils.get_parent(item, 8);
		var arr = form.find("#id_blockmimes").data('blockmimes');
		var i = $.inArray(_id, arr);
		if (i >= 0)
		{
			arr.splice(i, 1);
			utils.set_data(form.find("#id_blockmimes"), 'blockmimes', arr);
		}

		form.find("#" + id).remove();
		utils.set_alt_css("#id_blockmimes");
		return false;
	}

	function remove_cat(o)
	{
		var item = $(o);
		var id = item.parent().attr("id");
		var _id = utils.get_itemid(id);
		var form = utils.get_parent(item, 8);
		var arr = form.find("#id_categories").data('categories');
		var i = $.inArray(_id, arr);
		if (i >= 0)
		{
			arr.splice(i, 1);
			utils.set_data(form.find("#id_categories"), 'categories', arr);
		}

		form.find("#" + id).remove();
		utils.set_alt_css("#id_categories");
		return false;
	}

	function remove_whitelist(o)
	{
		var item = $(o);
		var id = item.parent().attr("id");
		var _id = utils.get_itemid(id);
		var form = utils.get_parent(item, 8);
		var arr = form.find("#id_whitelist").data('whitelist');
		var i = $.inArray(_id, arr);
		if (i >= 0)
		{
			arr.splice(i, 1);
			utils.set_data(form.find("#id_whitelist"), 'whitelist', arr);
		}

		form.find("#" + id).remove();
		utils.set_alt_css("#id_whitelist");
		return false;
	}

	function remove_blacklist(o)
	{
		var item = $(o);
		var id = item.parent().attr("id");
		var _id = utils.get_itemid(id);
		var form = utils.get_parent(item, 8);
		var arr = form.find("#id_blacklist").data('blacklist');
		var i = $.inArray(_id, arr);
		if (i >= 0)
		{
			arr.splice(i, 1);
			utils.set_data(form.find("#id_blacklist"), 'blacklist', arr);
		}

		form.find("#" + id).remove();
		utils.set_alt_css("#id_blacklist");
		return false;
	}

	function remove_content(o)
	{
		var item = $(o);
		var id = item.parent().attr("id");
		var _id = utils.get_itemid(id);
		var form = utils.get_parent(item, 8);
		var arr = form.find("#id_contents").data('contents');
		var i = $.inArray(_id, arr);
		if (i >= 0)
		{
			arr.splice(i, 1);
			utils.set_data(form.find("#id_contents"), 'contents', arr);
		}

		form.find("#" + id).remove();
		utils.set_alt_css("#id_contents");
		return false;
	}

	function remove_net(o)
	{
		var item = $(o);
		var id = item.parent().attr("id");
		var _id = utils.get_itemid(id);
		var form = utils.get_parent(item, 7);
		var arr = form.find("#id_nets").data('nets');
		var i = $.inArray(_id, arr);
		if (i >= 0)
		{
			arr.splice(i, 1);
			utils.set_data(form.find("#id_nets"), 'nets', arr);
		}

		form.find("#" + id).remove();
		utils.set_alt_css("#id_nets");
		return false;
	}

	function remove_exceptnet(o)
	{
		var item = $(o);
		var id = item.parent().attr("id");
		var _id = utils.get_itemid(id);
		var form = utils.get_parent(item, 7);
		var arr = form.find("#id_exceptnets").data('exceptnets');
		var i = $.inArray(_id, arr);
		if (i >= 0)
		{
			arr.splice(i, 1);
			utils.set_data(form.find("#id_exceptnets"), 'exceptnets', arr);
		}

		form.find("#" + id).remove();
		set_alt_css(form, "#id_exceptnets");
		return false;
	}

	function remove_excepturl(o)
	{
		var item = $(o);
		var v = item.next().next().html();
		var form = $("#except");
		var arr = form.find("#id_excepturls").data('excepturls');
		var i = $.inArray(v, arr);
		if (i >= 0)
		{
			arr.splice(i, 1)
			utils.set_data(form.find("#id_excepturls"), 'excepturls', arr);
		}

		item.parent().remove();
		set_alt_css(form, "#id_excepturls");
		return false;
	}

	function remove_exceptuserinternal(o)
	{
		var item = $(o);
		var id = item.parent().attr("id");
		var _id = utils.get_itemid(id);
		var form = utils.get_parent(item, 4);
		var arr = form.find("#id_exceptusers").data('exceptuserinternals');
		var i = $.inArray(_id, arr);
		if (i >= 0)
		{
			arr.splice(i, 1);
			utils.set_data(form.find("#id_exceptusers"), 'exceptuserinternals', arr);
		}

		form.find("#" + id).remove();
		set_alt_css(form, "#id_exceptusers");
		return false;
	}

	function remove_exceptuserexternal(o)
	{
		var item = $(o);
		var id = item.parent().attr("id");
		var _id = utils.get_itemid(id);
		var form = utils.get_parent(item, 4);
		var arr = form.find("#id_exceptusers").data('exceptuserexternals');
		var i = $.inArray(_id, arr);
		if (i >= 0)
		{
			arr.splice(i, 1);
			utils.set_data(form.find("#id_exceptusers"), 'exceptuserxternals', arr);
		}

		form.find("#" + id).remove();
		set_alt_css(form, "#id_exceptusers");
		return false;
	}
	/* endregion */

	/* region edit */
	function edit_schedule(obj)
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
				scope: 'schedule',
				func_update: update_schedule
		};
		defschedule.init_edit_form(data);
		return false;
	}

	function update_schedule(id, name, self)
	{
		$(self).next().html(name);
		var isopen = $("#list-panel").dialog('isOpen');
		if (isopen)
			filter_list1();
	}

	function edit_userinternal(obj)
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
				scope: 'user',
				func_update: update_userinternal,
				func_show_all: show_all_2,
				func_show_add: show_add_2
		};
		defuser.init_edit_form(data);
		return false;
	}

	function update_userinternal(id, name, self)
	{
		$(self).next().html(name);
		var isopen = $("#list-panel").dialog('isOpen');
		if (isopen)
			filter_list2();
	}

	function edit_allowext(obj)
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
				scope: 'allowext',
				func_update: update_allowext,
				func_show_import: show_import4,
				func_show_export: show_export4
		};
		wpext.init_edit_form(data);
		return false;
	}

	function update_allowext(id, name, self)
	{
		$(self).next().html(name);
		var isopen = $("#list-panel").dialog('isOpen');
		if (isopen)
			filter_list3();
	}

	function edit_blockext(obj)
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
				scope: 'blockext',
				func_update: update_blockext,
				func_show_import: show_import5,
				func_show_export: show_export5
		};
		wpext.init_edit_form(data);
		return false;
	}

	function update_blockext(id, name, self)
	{
		$(self).next().html(name);
		var isopen = $("#list-panel").dialog('isOpen');
		if (isopen)
			filter_list4();
	}

	function edit_allowmime(obj)
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
				scope: 'allowmime',
				func_update: update_allowmime,
				func_show_import: show_import6,
				func_show_export: show_export6
		};
		wpmime.init_edit_form(data);
		return false;
	}

	function update_allowmime(id, name, self)
	{
		$(self).next().html(name);
		var isopen = $("#list-panel").dialog('isOpen');
		if (isopen)
			filter_list5();
	}

	function edit_blockmime(obj)
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
				scope: 'blockmime',
				func_update: update_blockmime,
				func_show_import: show_import7,
				func_show_export: show_export7
		};
		wpmime.init_edit_form(data);
		return false;
	}

	function update_blockmime(id, name, self)
	{
		$(self).next().html(name);
		var isopen = $("#list-panel").dialog('isOpen');
		if (isopen)
			filter_list6();
	}

	function edit_cat(obj)
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
				scope: 'cat',
				func_update: update_cat,
				func_show_import: show_import1,
				func_show_export: show_export1
		};
		wpcat.init_edit_form(data);
		return false;
	}

	function update_cat(id, name, self)
	{
		$(self).next().html(name);
		var isopen = $("#list-panel").dialog('isOpen');
		if (isopen)
			filter_list7();
	}

	function edit_whitelist(obj)
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
				scope: 'whitelist',
				func_update: update_whitelist,
				func_show_import: show_import2,
				func_show_export: show_export2
		};
		wpwhitelist.init_edit_form(data);
		return false;
	}

	function update_whitelist(id, name, self)
	{
		$(self).next().html(name);
		var isopen = $("#list-panel").dialog('isOpen');
		if (isopen)
			filter_list8();
	}

	function edit_blacklist(obj)
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
				scope: 'blacklist',
				func_update: update_blacklist,
				func_show_import: show_import3,
				func_show_export: show_export3
		};
		wpblacklist.init_edit_form(data);
		return false;
	}

	function update_blacklist(id, name, self)
	{
		$(self).next().html(name);
		var isopen = $("#list-panel").dialog('isOpen');
		if (isopen)
			filter_list9();
	}

	function edit_content(obj)
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
				scope: 'content',
				func_update: update_content,
				func_show_import: show_import8,
				func_show_export: show_export8
		};
		wpcontent.init_edit_form(data);
		return false;
	}

	function update_content(id, name, self)
	{
		$(self).next().html(name);
		var isopen = $("#list-panel").dialog('isOpen');
		if (isopen)
			filter_list10();
	}

	function edit_net(obj)
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
				scope: 'net',
				func_update: update_net
		};
		defnet.init_edit_form(data);
		return false;
	}

	function update_net(id, name, self)
	{
		$(self).next().html(name);
		var isopen = $("#list-panel").dialog('isOpen');
		if (isopen)
			filter_list11();
	}

	function edit_exceptnet(obj)
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
				scope: 'exceptnet',
				func_update: update_exceptnet
		};
		defnet.init_edit_form(data);
		return false;
	}

	function update_exceptnet(id, name, self)
	{
		$(self).next().html(name);
		var isopen = $("#list-panel").dialog('isOpen');
		if (isopen)
			filter_listexcept1();
	}

	function edit_excepturl(obj)
	{
		var item = $(obj);
		var urlvalue = item.next().html();
		var form = utils.get_parent(item, 8);
		var form_id = form.attr("id");
		var scope = utils.get_form_scope(form_id);
		var arr = form.find("#except").find("#id_excepturls").data('excepturls');
		var i = $.inArray(urlvalue, arr);
		if (i >= 0)
		{
			var o = get_form_level_data(form);
			var self = item;
			var data = {
					self: self,
					urlvalue: urlvalue,
					level: o.level,
					prefix: o.prefix,
					scope: scope
			};
			init_edit_except_url_form(data);
			return false;
		}

		return false;
	}

	function update_excepturl(o)
	{
		var i = o.level - 1;
		var sep = (o.scope == '' ? '' : '-');
		var prefix = (o.level < 1 ? '' : '_' + o.level);
		var _prefix = (i < 1 ? '' : '_' + i);
		var currform = $("#save-urlform" + sep + o.scope + prefix);
		var prevform = $("#save-form" + sep + o.scope + _prefix);
		var urlvalue = currform.find("#id_url").val();
		if ($.trim(urlvalue) == '')
			return;

		var arr = prevform.find("#id_excepturls").data('excepturls');
		var j = $.inArray(o.urlvalue, arr);
		if (j >= 0)
		{
			arr[j] = urlvalue;
			$(o.self).next().html(urlvalue);
			utils.set_data(prevform.find("#id_excepturls"), 'excepturls', arr);
			utils.cancel_dialog(o.level, "#dialog-edit-excepturl" + sep + o.scope);
		}
	}

	function edit_exceptuserinternal(obj)
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
				scope: 'exceptuser',
				func_update: update_exceptuserinternal
		};
		defuser.init_edit_form(data);
		return false;
	}

	function update_exceptuserinternal(id, name, self)
	{
		$(self).next().html(name);
		var isopen = $("#list-panel").dialog('isOpen');
		if (isopen)
			filter_listexcept2();
	}
	/* endregion */

	function get_delimiter(form)
	{
		var delimiter = '\n';
		var v = form.find("#id_delimiter").val();
		if (v == '1')
			delimiter = ';';

		else if (v == '2')
			delimiter = ',';

		return delimiter;
	}

	function func_importexcepturl(o)
	{
		var i = o.level - 1;
		var sep = (o.scope == '' ? '' : '-');
		var prefix = (o.level < 1 ? '' : '_' + o.level);
		var _prefix = (i < 1 ? '' : '_' + i);
		var currform = $("#import-form" + sep + o.scope + prefix);
		var prevform = $("#save-form" + sep + o.scope + _prefix);
		var txt = currform.find("#id_importtext").val();
		var arr = null;
		if ($.trim(txt) == '')
			return;

		var j = txt.indexOf('\n');
		if (j >= 0)
		{
			arr = txt.split('\n');
			add_except_urls(prevform, arr);
			utils.cancel_dialog(o.level, "#dialog-import-excepturl" + sep + o.scope);
			return;
		}

		j = txt.indexOf(',');
		if (j >= 0)
		{
			arr = txt.split(',');
			add_except_urls(prevform, arr);
			utils.cancel_dialog(o.level, "#dialog-import-excepturl" + sep + o.scope);
			return;
		}

		j = txt.indexOf(';');
		if (j >= 0)
		{
			arr = txt.split(';');
			add_except_urls(prevform, arr);
			utils.cancel_dialog(o.level, "#dialog-import-excepturl" + sep + o.scope);
			return;
		}

		// only have 1 item
		arr = [txt];
		add_except_urls(prevform, arr);
		utils.cancel_dialog(o.level, "#dialog-import-excepturl" + sep + o.scope);
	}

	function get_form_level_data(form)
	{
		var form_id = form.attr("id");
		var level = utils.get_next_form_level(form_id);
		var prefix = utils.get_prefix(form_id);
		return {
				level: level,
				prefix: prefix
		};
	}

	function set_items()
	{
		var form = $("#save-form");
		var except = $("#except");
		if (form.find("#id_scheduleon").attr("checked") == "checked")
			$(".wpprofileschd").hide();

		else
			$(".wpprofileschd").show();

		var arrschedules = [];
		var arruserinternals = [];
		var arruserexternals = [];
		var arrallowexts = [];
		var arrblockexts = []
		var arrallowmimes = [];
		var arrblockmimes = [];
		var arrcats = [];
		var arrwhitelist = [];
		var arrblacklist = [];
		var arrcontents = [];
		var arrnets = [];
		var arrexceptnets = [];
		var arrexcepturls = [];
		var arrexceptuserinternals = [];
		var arrexceptuserexternals = [];
		form.find("#id_schedules > div").each(
				function()
				{
					var id = $(this).attr("id");
					var _id = utils.get_itemid(id);
					if (!utils.item_exist(_id, arrschedules))
					{
						arrschedules.push(_id);
					}
				});
		form.find("#id_users > div").each(
				function()
				{
					var id = $(this).attr("id");
					var _id = utils.get_itemid(id);
					if (id.indexOf('userint') >= 0)
					{
						if (!utils.item_exist(_id, arruserinternals))
						{
							arruserinternals.push(_id);
						}
					}

					else
					{
						if (!utils.item_exist(_id, arruserexternals))
						{
							arruserexternals.push(_id);
						}
					}
				});
		form.find("#id_allowexts > div").each(
				function()
				{
					var id = $(this).attr("id");
					var _id = utils.get_itemid(id);
					if (!utils.item_exist(_id, arrallowexts))
					{
						arrallowexts.push(_id);
					}
				});
		form.find("#id_blockexts > div").each(
				function()
				{
					var id = $(this).attr("id");
					var _id = utils.get_itemid(id);
					if (!utils.item_exist(_id, arrblockexts))
					{
						arrblockexts.push(_id);
					}
				});
		form.find("#id_allowmimes > div").each(
				function()
				{
					var id = $(this).attr("id");
					var _id = utils.get_itemid(id);
					if (!utils.item_exist(_id, arrallowmimes))
					{
						arrallowmimes.push(_id);
					}
				});
		form.find("#id_blockmimes > div").each(
				function()
				{
					var id = $(this).attr("id");
					var _id = utils.get_itemid(id);
					if (!utils.item_exist(_id, arrblockmimes))
					{
						arrblockmimes.push(_id);
					}
				});
		form.find("#id_categories > div").each(
				function()
				{
					var id = $(this).attr("id");
					var _id = utils.get_itemid(id);
					if (!utils.item_exist(_id, arrcats))
					{
						arrcats.push(_id);
					}
				});
		form.find("#id_whitelist > div").each(
				function()
				{
					var id = $(this).attr("id");
					var _id = utils.get_itemid(id);
					if (!utils.item_exist(_id, arrwhitelist))
					{
						arrwhitelist.push(_id);
					}
				});
		form.find("#id_blacklist > div").each(
				function()
				{
					var id = $(this).attr("id");
					var _id = utils.get_itemid(id);
					if (!utils.item_exist(_id, arrblacklist))
					{
						arrblacklist.push(_id);
					}
				});
		form.find("#id_contents > div").each(
				function()
				{
					var id = $(this).attr("id");
					var _id = utils.get_itemid(id);
					if (!utils.item_exist(_id, arrcontents))
					{
						arrcontents.push(_id);
					}
				});
		form.find("#id_nets > div").each(
				function()
				{
					var id = $(this).attr("id");
					var _id = utils.get_itemid(id);
					if (!utils.item_exist(_id, arrnets))
					{
						arrnets.push(_id);
					}
				});
		except.find("#id_exceptnets > div").each(
				function()
				{
					var id = $(this).attr("id");
					var _id = utils.get_itemid(id);
					if (!utils.item_exist(_id, arrexceptnets))
					{
						arrexceptnets.push(_id);
					}
				});
		except.find("#id_excepturls > div").each(
				function()
				{
					var v = $(this).find(".item_edit").next().html();
					if (!utils.item_exist(v, arrexcepturls))
					{
						arrexcepturls.push(v);
					}
				});
		except.find("#id_exceptusers > div").each(
				function()
				{
					var id = $(this).attr("id");
					var _id = utils.get_itemid(id);
					if (id.indexOf('userint') >= 0)
					{
						if (!utils.item_exist(_id, arrexceptuserinternals))
						{
							arrexceptuserinternals.push(_id);
						}
					}

					else
					{
						if (!utils.item_exist(_id, arrexceptuserexternals))
						{
							arrexceptuserexternals.push(_id);
						}
					}
				});
		utils.set_data(form.find("#id_schedules"), 'schedules', arrschedules);
		utils.set_data(form.find("#id_users"), 'userinternals', arruserinternals);
		utils.set_data(form.find("#id_users"), 'userexternals', arruserexternals);
		utils.set_data(form.find("#id_allowexts"), 'allowexts', arrallowexts);
		utils.set_data(form.find("#id_blockexts"), 'blockexts', arrblockexts);
		utils.set_data(form.find("#id_allowmimes"), 'allowmimes', arrallowmimes);
		utils.set_data(form.find("#id_blockmimes"), 'blockmimes', arrblockmimes);
		utils.set_data(form.find("#id_categories"), 'categories', arrcats);
		utils.set_data(form.find("#id_whitelist"), 'whitelist', arrwhitelist);
		utils.set_data(form.find("#id_blacklist"), 'blacklist', arrblacklist);
		utils.set_data(form.find("#id_contents"), 'contents', arrcontents);
		utils.set_data(form.find("#id_nets"), 'nets', arrnets);
		utils.set_data(except.find("#id_exceptnets"), 'exceptnets', arrexceptnets);
		utils.set_data(except.find("#id_excepturls"), 'excepturls', arrexcepturls);
		utils.set_data(except.find("#id_exceptusers"), 'exceptuserinternals', arrexceptuserinternals);
		utils.set_data(except.find("#id_exceptusers"), 'exceptuserexternals', arrexceptuserexternals);
		utils.set_alt_css("#id_schedules");
		utils.set_alt_css("#id_users");
		utils.set_alt_css("#id_allowexts");
		utils.set_alt_css("#id_blockexts");
		utils.set_alt_css("#id_allowmimes");
		utils.set_alt_css("#id_blockmimes");
		utils.set_alt_css("#id_categories");
		utils.set_alt_css("#id_whitelist");
		utils.set_alt_css("#id_blacklist");
		utils.set_alt_css("#id_contents");
		utils.set_alt_css("#id_nets");
		set_alt_css(except, "#id_exceptnets");
		set_alt_css(except, "#id_excepturls");
		set_alt_css(except, "#id_exceptusers");
	}

	function set_alt_css(form, members)
	{
		form.find(members + " > div").removeClass("ui-state-default");
		form.find(members + " > div").removeClass("ui-state-hover");
		form.find(members + " > div:odd").addClass("ui-state-default");
		form.find(members + " > div:even").addClass("ui-state-hover");
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
		$("#id_query").keypress(nav_list.query_keypress);
		$("#id_query").keyup(nav_list.query_keyup);
		utils.remove_dialog("div[id^='dialog-add']");
		utils.remove_dialog("div[id^='dialog-edit']");
		utils.init_alert_dialog("#dialog-message");
		utils.init_list_panel("#list-panel", hide_panel);
		utils.bind_hover($("#id_add,#id_find"));
		nav_list.config.list_url = list_url;
		nav_list.config.list_func = init_list;
		nav_list.init();
	}

	function load()
	{
		return menu.get('/wpprofile/', init);
	}

	return {
		load:load,
		add_schedule:add_schedule,
		add_schedule_wizard:add_schedule_wizard,
		edit_schedule:edit_schedule,
		remove_schedule:remove_schedule,
		add_userinternal:add_userinternal,
		edit_userinternal:edit_userinternal,
		remove_userinternal:remove_userinternal,
		remove_userexternal:remove_userexternal,
		add_allowext:add_allowext,
		edit_allowext:edit_allowext,
		remove_allowext:remove_allowext,
		add_blockext:add_blockext,
		edit_blockext:edit_blockext,
		remove_blockext:remove_blockext,
		add_allowmime:add_allowmime,
		edit_allowmime:edit_allowmime,
		remove_allowmime:remove_allowmime,
		add_blockmime:add_blockmime,
		edit_blockmime:edit_blockmime,
		remove_blockmime:remove_blockmime,
		add_cat:add_cat,
		edit_cat:edit_cat,
		remove_cat:remove_cat,
		add_whitelist:add_whitelist,
		edit_whitelist:edit_whitelist,
		remove_whitelist:remove_whitelist,
		add_blacklist:add_blacklist,
		edit_blacklist:edit_blacklist,
		remove_blacklist:remove_blacklist,
		add_content:add_content,
		edit_content:edit_content,
		remove_content:remove_content,
		add_net:add_net,
		edit_net:edit_net,
		remove_net:remove_net,
		add_exceptnet:add_exceptnet,
		add_exceptnet_wizard : add_exceptnet_wizard,
		edit_exceptnet:edit_exceptnet,
		remove_exceptnet:remove_exceptnet,
		edit_excepturl:edit_excepturl,
		remove_excepturl:remove_excepturl,
		add_exceptuserinternal:add_exceptuserinternal,
		add_exceptuserinternal_wizard : add_exceptuserinternal_wizard,
		edit_exceptuserinternal:edit_exceptuserinternal,
		remove_exceptuserinternal:remove_exceptuserinternal,
		remove_exceptuserexternal:remove_exceptuserexternal,
		init_form:init_form,
		show_form_dialog : show_form_dialog,
		set_alt_css : set_alt_css,
		get_ui_opt:get_ui_opt
	}
}());