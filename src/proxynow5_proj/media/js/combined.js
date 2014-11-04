var adinfo = (function()
{
	var save_url = "/adinfo/save/";

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
		var data = {
				adserver: $("#id_adserver").val(),
				addomain: $("#id_addomain").val(),
				adusername: $("#id_adusername").val(),
				adpassword: $("#id_adpassword").val(),
				id: "",
				save_type: ""
		}
		var id = $("#id_id").val();
		if (id != "")
		{
			data.id = id;
			data.save_type = "update";
		}

		return data;
	}

	function init()
	{
		$(".save_button.save").click(func_save);
		if ($("#id_id").val() != "")
			$("#id_adpassword").val("**********");

		$(".save_button.save").css("margin-right", "0");
		utils.bind_hover($(".save_button"));
	}

	function load()
	{
		return menu.get(save_url, init);
	}

	return {
		load:load
	};
}());
var admin = (function()
{
	var save_url = "/administration/save/";

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
		var data = {
				datetime: $("#id_datetime").val(),
				timezone: $("#id_timezone").val(),
				id: "",
				save_type: ""
		}
		var id = $("#id_id").val();
		if (id != "")
		{
			data.id = id;
			data.save_type = "update";
		}

		return data;
	}

	function init()
	{
		$(".save_button.save").click(func_save);
		$(".save_button.save").css("margin-right", "0");
		utils.bind_hover($(".save_button"));
	}

	function load()
	{
		return menu.get(save_url, init);
	}

	return {
		load:load
	};
}());
/*
 * @include "utils.js"
 * @include "defnet.js"
 */

var appctrlrule = (function()
{
	var save_url = "/appctrlrule/save/";
	var delete_url = "/appctrlrule/delete/";
	var update_enable_url = "/appctrlrule/save/enable/";
	var update_location_url = "/appctrlrule/save/location/";
	var list_url = "/appctrlrule/list/";
	var app_ctrl = {
			save_url: "/appctrl/save/"
	};
	var drag_opt_1 = null;
	var drag_opt_2 = null;
	var drag_opt_3 = null;
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
				scope: 'skiplist',
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
				scope: 'applyto',
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
				scope: 'whichapp',
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
		};
	}

	function show_form()
	{
		$("#left_box").load(save_url, null,
				function()
				{
					var form = $("#save-form");
					init_list_data(form);
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
	
	function init_list_data(form)
	{
		utils.set_data(form.find("#id_skiplist"), 'skiplist', []);
		utils.set_data(form.find("#id_applyto"), 'applyto', []);
		utils.set_data(form.find("#id_whichapp"), 'whichapp', []);
	}
	
	function init_list_cmd()
	{
		$("#skiplist .img_folder").click(show_all1);
		$("#skiplist .img_add").click(show_add1);
		$("#applyto .img_folder").click(show_all2);
		$("#applyto .img_add").click(show_add2);
		$("#whichapp .img_folder").click(show_all3);
	}
	
	function init_list_droppable()
	{
		var hoverclass = 'ui-state-active';
		$("#id_skiplist").droppable({
			hoverClass: hoverclass,
			scope: 'skiplist',
			drop: function(evt, ui)
			{
				var o = ui.draggable;
				add_dragged_skiplist(o);
			}
		});
		$("#id_applyto").droppable({
			hoverClass: hoverclass,
			scope: 'applyto',
			drop: function(evt, ui)
			{
				var o = ui.draggable;
				add_dragged_applyto(o);
			}
		});
		$("#id_whichapp").droppable({
			hoverClass: hoverclass,
			scope: 'whichapp',
			drop: function(evt, ui)
			{
				var o = ui.draggable;
				add_dragged_whichapp(o);
			}
		});
	}
	
	function init_dialog()
	{
		$("#dialog-add-skiplist").dialog(defnet.get_ui_opt().popup_dialog_opt);
		$("#dialog-edit-skiplist").dialog(defnet.get_ui_opt().popup_dialog_opt);
		$("#dialog-add-applyto").dialog(defnet.get_ui_opt().popup_dialog_opt);
		$("#dialog-edit-applyto").dialog(defnet.get_ui_opt().popup_dialog_opt);
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
		var data = get_data($("#save-form"), "", "");
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
		var data = get_data($("#save-form"), arg, "update");
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

	function get_data(form, arg, savetype)
	{
		var skiplist = form.find("#id_skiplist").data('skiplist');
		var applyto = form.find("#id_applyto").data('applyto');
		var arrskiplist = skiplist.join(',');
		var arrapplyto = applyto.join(',');
		var data = {
				name: form.find("#id_name").val(),
				location: form.find("#id_location").val(),
				action: form.find("#id_action").val(),
				comment: form.find("#id_comment").val(),
				skiplist: arrskiplist,
				applyto: arrapplyto,
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

	function show_all1()
	{
		$("#leftcolumn").hide();
		$("#list_body").load(defnet.list.panel, null,
				function()
				{
					$(".add_button").click(add_skiplist_);
					$(".drag_zone").draggable(drag_opt_1);
					$("#id_filters").change(filter_list1);
					$("#id_filter_text").keyup(function()
							{
								utils.countdown_filter(filter_list1);
							});
					$("#id_filter_text").keydown(utils.stop_filter_timer);
					init_tooltip();
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
		$("#panel_body").load(defnet.list.select + s, null,
				function()
				{
					$(".drag_zone").draggable(drag_opt_1);
					defnet.init_tooltip();
				});
	}

	function show_all2()
	{
		$("#leftcolumn").hide();
		$("#list_body").load(defnet.list.panel, null,
				function()
				{
					$(".add_button").click(add_applyto_);
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
		$("#panel_body").load(defnet.list.select + s, null,
				function()
				{
					$(".drag_zone").draggable(drag_opt_2);
					defnet.init_tooltip();
				});
	}

	function show_all3()
	{
		$("#leftcolumn").hide();
		$("#list_body").load('/appctrlapplist/list/panel/', null,
				function()
				{
					$(".add_button").click(add_whichapp_);
					$(".drag_zone").draggable(drag_opt_3);
					$("#id_filters").change(filter_list3);
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
		var search_by_qry = "?find=" + $("#id_filters").val();
		var keyword = $("#id_filter_text").val();
		var s = (search_by_qry == '?find=0' && keyword == "" ? "" : search_by_qry + "&text=" + keyword);
		$("#panel_body").load('/appctrlapplist/list/select/' + s, null,
				function()
				{
					$(".drag_zone").draggable(drag_opt_3);
				});
	}

	function show_all_1()
	{
		return show_all_helper(defnet.add_members, this);
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
				scope: 'skiplist',
				func_save: save_to_skiplist,
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
				scope: 'applyto',
				func_save: save_to_applyto,
				func_show_all: show_all_2,
				func_show_add: show_add_2
		};
		show_add_init_helper(data);
		return false;
	}

	function show_add_1()
	{
		var self = this;
		var data = {
				self: self,
				scope: 'skiplist',
				func_show_all: show_all_1,
				func_show_add: show_add_1
		};
		show_add_helper(data);
		return false;
	}

	function show_add_2()
	{
		var self = this;
		var data = {
				self: self,
				scope: 'applyto',
				func_show_all: show_all_2,
				func_show_add: show_add_2
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

	function save_to_skiplist()
	{
		var o = {
				level: 1,
				scope: 'skiplist',
				func_add: add_skiplist
		};
		return defnet.save_inner_form(o);
	}

	function save_to_applyto()
	{
		var o = {
				level: 1,
				scope: 'applyto',
				func_add: add_applyto
		};
		return defnet.save_inner_form(o);
	}

	function add_dragged_skiplist(o)
	{
		var item = $(o);
		var name = item.html();
		var id = item.parent().attr("id");
		add_skiplist(id, name);
	}

	function add_skiplist(id, name)
	{
		var _id = parseInt(id, 10);
		var arr = $("#id_skiplist").data('skiplist');
		if (!utils.item_exist(_id, arr))
		{
			arr.push(_id);
			utils.set_data($("#id_skiplist"), 'skiplist', arr);
			var data = {
					id_prefix: 'skiplist_',
					id: _id,
					click: 'appctrlrule.remove_skiplist(this)',
					editclick: 'appctrlrule.edit_skiplist(this)',
					name: name
			};
			var h = new EJS({url: '/media/tpl/list_item.ejs'}).render(data);
			$("#id_skiplist").append(h);
		}

		utils.set_alt_css("#id_skiplist");
	}

	function add_dragged_applyto(o)
	{
		var item = $(o);
		var name = item.html();
		var id = item.parent().attr("id");
		add_applyto(id, name);
	}

	function add_applyto(id, name)
	{
		var _id = parseInt(id, 10);
		var arr = $("#id_applyto").data('applyto');
		if (!utils.item_exist(_id, arr))
		{
			arr.push(_id);
			utils.set_data($("#id_applyto"), 'applyto', arr);
			var data = {
					id_prefix: 'applyto_',
					id: _id,
					click: 'appctrlrule.remove_applyto(this)',
					editclick: 'appctrlrule.edit_applyto(this)',
					name: name
			};
			var h = new EJS({url: '/media/tpl/list_item.ejs'}).render(data);
			$("#id_applyto").append(h);
		}

		utils.set_alt_css("#id_applyto");
	}

	function add_dragged_whichapp(o)
	{
		var item = $(o);
		var name = item.html();
		var id = item.parent().attr("id");
		add_whichapp(id, name);
	}

	function add_whichapp(id, name)
	{
		var _id = parseInt(id, 10);
		var arr = $("#id_whichapp").data('whichapp');
		if (!utils.item_exist(_id, arr))
		{
			arr.push(_id);
			utils.set_data($("#id_whichapp"), 'whichapp', arr);
			var data = {
					id_prefix: 'whichapp_',
					id: _id,
					click: 'appctrlrule.remove_whichapp(this)',
					editclick: 'false',
					name: name
			};
			var h = new EJS({url: '/media/tpl/list_item.ejs'}).render(data);
			$("#id_whichapp").append(h);
		}

		utils.set_alt_css("#id_whichapp");
	}

	function add_skiplist_()
	{
		$("input[name=chklist]:checked").each(
				function()
				{
					var o = $(this);
					var id = o.parent().attr("id");
					var name = o.next().html();
					add_skiplist(id, name);
				});
	}

	function add_applyto_()
	{
		$("input[name=chklist]:checked").each(
				function()
				{
					var o = $(this);
					var id = o.parent().attr("id");
					var name = o.next().html();
					add_applyto(id, name);
				});
	}

	function add_whichapp_()
	{
		$("input[name=chklist]:checked").each(
				function()
				{
					var o = $(this);
					var id = o.parent().attr("id");
					var name = o.next().html();
					add_whichapp(id, name);
				});
	}

	function remove_skiplist(o)
	{
		var item = $(o);
		var id = item.parent().attr("id");
		var _id = utils.get_itemid(id);
		var form = utils.get_parent(item, 5);
		var arr = form.find("#id_skiplist").data('skiplist');
		var i = $.inArray(_id, arr);
		if (i >= 0)
		{
			arr.splice(i, 1);
			utils.set_data(form.find("#id_skiplist"), 'skiplist', arr);
		}

		form.find("#" + id).remove();
		utils.set_alt_css("#id_skiplist");
		return false;
	}

	function remove_applyto(o)
	{
		var item = $(o);
		var id = item.parent().attr("id");
		var _id = utils.get_itemid(id);
		var form = utils.get_parent(item, 5);
		var arr = form.find("#id_applyto").data('applyto');
		var i = $.inArray(_id, arr);
		if (i >= 0)
		{
			arr.splice(i, 1);
			utils.set_data(form.find("#id_applyto"), 'applyto', arr);
		}

		form.find("#" + id).remove();
		utils.set_alt_css("#id_applyto");
		return false;
	}

	function remove_whichapp(o)
	{
		var item = $(o);
		var id = item.parent().attr("id");
		var _id = utils.get_itemid(id);
		var form = utils.get_parent(item, 5);
		var arr = form.find("#id_whichapp").data('whichapp');
		var i = $.inArray(_id, arr);
		if (i >= 0)
		{
			arr.splice(i, 1);
			utils.set_data(form.find("#id_whichapp"), 'whichapp', arr);
		}

		form.find("#" + id).remove();
		utils.set_alt_css("#id_whichapp");
		return false;
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
				func_show_all: show_all_1,
				func_show_add: show_add_1
		};
		defnet.init_edit_form(data);
		return false;
	}
	
	function update_skiplist(id, name, self)
	{
		$(self).next().html(name);
		var isopen = $("#list-panel").dialog('isOpen');
		if (isopen)
			filter_list1();
	}
	
	function edit_applyto(obj)
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
				scope: 'applyto',
				func_update: update_applyto,
				func_show_all: show_all_2,
				func_show_add: show_add_2
		};
		defnet.init_edit_form(data);
		return false;
	}
	
	function update_applyto(id, name, self)
	{
		$(self).next().html(name);
		var isopen = $("#list-panel").dialog('isOpen');
		if (isopen)
			filter_list2();
	}

	function set_items()
	{
		var form = $("#save-form");
		var arrskiplist = [];
		var arrapplyto = [];
		var arrwhichapp = [];
		form.find("#id_skiplist > div").each(
				function()
				{
					var id = $(this).attr("id");
					var _id = utils.get_itemid(id);
					if (!utils.item_exist(_id, arrskiplist))
					{
						arrskiplist.push(_id);
					}
				});
		form.find("#id_applyto > div").each(
				function()
				{
					var id = $(this).attr("id");
					var _id = utils.get_itemid(id);
					if (!utils.item_exist(_id, arrapplyto))
					{
						arrapplyto.push(_id);
					}
				});
		form.find("#id_whichapp > div").each(
				function()
				{
					var id = $(this).attr("id");
					var _id = utils.get_itemid(id);
					if (!utils.item_exist(_id, arrwhichapp))
					{
						arrwhichapp.push(_id);
					}
				});
		utils.set_data(form.find("#id_skiplist"), 'skiplist', arrskiplist);
		utils.set_data(form.find("#id_applyto"), 'applyto', arrapplyto);
		utils.set_data(form.find("#id_whichapp"), 'whichapp', arrwhichapp);
		utils.set_alt_css("#id_skiplist");
		utils.set_alt_css("#id_applyto");
		utils.set_alt_css("#id_whichapp");
	}

	function enable_appctrl()
	{
		var data = {
				value: 1
		};
		$.post(app_ctrl.save_url, data,
				function(result)
				{
					if (result == "success")
					{
						$("#sw > .sw-off").removeClass('redicon');
						$("#sw > .sw-off").addClass('greyicon');
						$("#sw > .sw-on").removeClass('greyicon');
		                $("#sw > .sw-on").addClass('greenicon');
					}
				});
	}

	function disable_appctrl()
	{
		var data = {
				value: 0
		};
		$.post(app_ctrl.save_url, data,
				function(result)
				{
					if (result == "success")
					{
						$("#sw > .sw-on").removeClass('greenicon');
						$("#sw > .sw-on").addClass('greyicon');
						$("#sw > .sw-off").removeClass('greyicon');
		                $("#sw > .sw-off").addClass('redicon');
					}
				});
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
		$("#sw > .sw-on").click(enable_appctrl);
		$("#sw > .sw-off").click(disable_appctrl);
		$("#id_query").keypress(nav_list.query_keypress);
		$("#id_query").keyup(nav_list.query_keyup);
		utils.remove_dialog("#dialog-add-skiplist");
		utils.remove_dialog("#dialog-edit-skiplist");
		utils.remove_dialog("#dialog-add-applyto");
		utils.remove_dialog("#dialog-edit-applyto");
		utils.init_alert_dialog("#dialog-message");
		utils.init_list_panel("#list-panel", hide_panel);
		utils.bind_hover($("#id_add,#id_find"));
		nav_list.config.list_url = list_url;
		nav_list.config.list_func = init_list;
		nav_list.init();
	}
	
	function load()
	{
		return menu.get('/appctrlrule/', init);
	}

	return {
		load:load,
		edit_skiplist:edit_skiplist,
		remove_skiplist:remove_skiplist,
		edit_applyto:edit_applyto,
		remove_applyto:remove_applyto,
		remove_whichapp:remove_whichapp
	}
}());
/*
 * @include "utils.js"
 */

var auth = (function()
{
	var login_url = "/login/";
	var logout_url = "/logout/";
	var loggingin = false;

	function func_login()
	{
		var data = {
				username: $("#id_username").val(),
				password: $("#id_password").val()
		};

		if (loggingin)
		{
			return false;
		}

		loggingin = true;
		$.ajax({
			url: login_url,
			data: data,
			type: 'POST',
			async: false,
			success: function(result, textStatus, jqXHR)
			{
				loggingin = false;
				if (result.success == 1)
				{
					$(".login_box").effect('fold', null, 500,
							function()
							{
								$("#id_accesstype_").val(result.accesstype);
								menu.load();
								if (result.accesstype == utils.accesstype.admin)
								{
									$("#section_logo").next().html(result.themeselect);
								}
								
								theme.init();
							});
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
			},
			error: function(jqXHR, textStatus, errorThrown)
			{
				loggingin = false;
			}
		});
		return false;
	}

	function login_keypress(evt)
	{
		if (evt.keyCode == '13')
		{
			evt.preventDefault();
			evt.stopPropagation();
			func_login();
		}
	}

	function logout()
	{
		dashboard.stop_refresh_timer();
		loggingin = false;
		$.ajax({
			url: logout_url,
			type: 'POST',
			async: false,
			success: function(result, textStatus, jqXHR)
			{
				if (result.success == 1)
				{
					$("#leftcolumn div.innertube").empty();
					$("#section_logo").next().empty();
					$("#contentcolumn div.innertube").html(result.loginform);
					utils.clear_dialogs();
					init();
				}
			}
		});
		return false;
	}

	function init()
	{
		utils.init_server_error_dialog();
		var o = $("#id_username");
		if (o.length == 1)
		{
			$("#id_username,#id_password").keypress(login_keypress);
			$(".login_button").click(func_login);
			utils.bind_hover($(".login_button"));
		}

		else
		{
			menu.init();
		}
	}

	return {
		init:init,
		logout:logout
	}
}());

$(document).ready(auth.init);
/*
 * @include "utils.js"
 */

var theme = (function()
{
	var first = true;
	var save_url = "/setting/";
	var theme = "darkhive";

	function init()
	{
		// ------------------------------------------------------------------------------
		// Make a Themes
		//
		// themeBase:
		// 'http://ajax.googleapis.com/ajax/libs/jqueryui/1.7.2/themes/',
		// ------------------------------------------------------------------------------

		var accesstype = $("#id_accesstype_").val();
		utils.init_progress();
		utils.init_server_error_dialog();

		var select_wizard = $("#theme_wizard_select .save_button");
		select_wizard.click(function()
				{
					utils.switch_wizard('1');
				});
		utils.bind_hover(select_wizard);

		var select_close = $("#theme_option .cancelicon");
		select_close.click(function()
				{
					$("#theme_option").slideUp();
				});

		$.get(save_url + "?name=theme",
				function(result)
				{
					if (result.success == 1)
					{
						theme = (result.theme == "" ? 'darkhive' : result.theme);
					}

					$.themes.init({
						themes: ['mintchoc', 'darkhive', 'trontastic',
						         'humanity', 'cupertino', 'sunny',
						         'smoothness'],
						defaultTheme: theme,
						onSelect: reloadIE
					});

					if (accesstype == utils.accesstype.admin)
						$("#theme_body").themes();
				});

		/*
		 * $.themes.init({ themes:
		 * ['mintchoc','darkhive','trontastic','humanity','cupertino','sunny','uidarkness',
		 * 'smoothness'], defaultTheme : theme, onSelect: reloadIE});
		 */

		 if (accesstype == utils.accesstype.admin)
		{
			$("#proxy_options").click(show_options);
			utils.bind_hover($("#proxy_options"));
		}
	}

	function show_options()
	{
		$("#theme_option").slideToggle();
	}

	//IE doesn't update the display immediately, so reload the page
	function reloadIE(id, display, url)
	{
		if (!first && $.browser.msie)
		{
			// window.location.href = window.location.href;
		}

		if (first == false)
		{
			var data = {
					name: 'theme',
					value: id
			};

			$.post(save_url, data,
					function(result)
					{
					});
		}

		first = false;
	}

	return {
		init:init
	};
}());

$(document).ready(theme.init);
var utils=(function(){var F;var l=2000;var u;var w=5000;var i={admin:2,normal:1};function a(M){$(M).dialog({autoOpen:false,modal:true,buttons:{OK:function(){$(this).dialog("close")}}})}function E(){$("#progress_status").ajaxSend(function(M,O,N){if(N.url.indexOf(log.run_url)==0||N.url.indexOf(dashboard.data_url)==0||N.url.indexOf(patchupgrade.upgrade_log_run_url)==0||N.url.indexOf(patchupgrade.checkserver_url)==0){return}$(this).show()});$("#progress_status").ajaxComplete(function(){$(this).hide()})}function G(){$(document).ajaxError(function(M,O,N,P){if(N.url.indexOf(dashboard.data_url)==0||N.url.indexOf(patchupgrade.checkserver_url)==0){return}c(O.responseText)});$("#error-dialog").dialog({autoOpen:false,modal:true,width:700,height:500,buttons:{OK:function(){$(this).dialog("close")}}})}function I(P,N){var O=p();var M=[O.left,O.top];$(P).dialog({autoOpen:false,width:O.width-3,resizable:false,draggable:true,modal:false,stack:false,zIndex:1000,position:M,close:N})}function D(M){$(M).dialog({autoOpen:false,modal:true})}function z(M){$("#panel_body > .list_row").mouseout(function(){if(u){clearTimeout(u)}u=setTimeout(function(){$("#panel_tooltip").hide()},w)});$("#panel_body > .list_row").mouseenter(function(N){if(u){clearTimeout(u)}var S=$(this);var R=$("#menu");var U=S.attr("id");var T=S.offset();var O=S.width();var Q=R.width()*2+50;var P=T.top+10;$("#panel_tooltip_body").empty();$.getJSON(M,{id:U},function(V){if(V.id==U){$("#panel_tooltip_body").html(V.content);$("#panel_tooltip").position({my:"center",at:"left",of:$("body"),offset:Q+" "+P});$("#panel_tooltip").show()}})});$("#panel_tooltip").mouseenter(function(){if(u){clearTimeout(u)}});$("#panel_tooltip").mouseout(function(){if(u){clearTimeout(u)}u=setTimeout(function(){$("#panel_tooltip").hide()},w)})}function g(O,M){var N=$.inArray(O,M);return(N>=0?true:false)}function k(M){$(M).dialog("destroy");$(M).remove()}function r(){k("div[id^='dialog-message']");k("div[id^='list-panel']");k("div[id^='confirm']");k("div[id^='dialog']")}function x(){$("#left_box").hide()}function H(P,M){var N=P-1;var O=(N<1?"":"_"+N);$(M+O).dialog("close")}function v(M,N){if(M==1){$("#dialog_msg").html(N)}else{$("#dialog_msg").text(N)}$("#dialog-message").dialog("open")}function c(M){$("#error_dialog").html(M);$("#error_dialog style").remove();$("#error-dialog").dialog("open")}function j(M){M.hover(function(){$(this).toggleClass("ui-state-hover")},function(){$(this).toggleClass("ui-state-hover")})}function e(M){M.click(function(){if(this.checked){M.not(this).removeAttr("checked")}})}function A(O){var M=O.indexOf("_");if(M<0){return 0}var N=O.substr(M+1);return parseInt(N,10)}function o(O){var N=O.lastIndexOf("-");var M=O.lastIndexOf("_");if(N<5){return""}else{if(O.indexOf("export-form")==0&&N<7){return""}else{return O.substring(N+1,M)}}}function B(N){var M=A(N);return(M>0?M-1:0)}function m(N){var M=A(N);return M+1}function s(N){var M=A(N);return(M==0?"":"_"+M)}function b(N,O,M){N.removeData(O);N.data(O,M)}function J(M){C();F=setTimeout(M,l)}function C(){clearTimeout(F)}function L(M,P){var O=$(M);for(var N=0;N<P;N++){O=O.parent()}return O}function K(M,N){$(".ui-draggable-dragging").addClass("ui-state-hover")}function q(M,N){$(".ui-draggable-dragging").removeClass("ui-state-hover")}function d(M){$(M+" > div").removeClass("ui-state-default");$(M+" > div").removeClass("ui-state-hover");$(M+" > div:odd").addClass("ui-state-default");$(M+" > div:even").addClass("ui-state-hover")}function y(M){var N=M.indexOf("_");if(N>=0){var O=M.substr(N+1);return parseInt(O,10)}return -1}function h(O){var N={errors:O};var M=new EJS({url:"/media/tpl/form_error.ejs"}).render(N);return M}function n(M){var Q=null;if(document.cookie&&document.cookie!=""){var P=document.cookie.split(";");for(var O=0;O<P.length;O++){var N=jQuery.trim(P[O]);if(N.substring(0,M.length+1)==(M+"=")){Q=decodeURIComponent(N.substring(M.length+1));break}}}return Q}function f(M){return M-$(document).scrollTop()}function p(){var Q=$("#menu");var N=Q.width();N+=5;var P=Q.offset();var O=P.left;var M=P.top;O-=5;return{width:N,left:O,top:M}}function t(M){try{var O="/wizard_profile_switch/";var P={status:M};$.post(O,P,function(Q){if(Q.status=="success"){window.location.replace("/wizardReRun/")}if(Q.status=="error"){alert(Q.error_info)}})}catch(N){alert(N.message)}}return{init_alert_dialog:a,init_progress:E,init_server_error_dialog:G,init_list_panel:I,init_confirm_delete:D,init_panel_tooltip:z,item_exist:g,remove_dialog:k,clear_dialogs:r,cancel_form:x,cancel_dialog:H,show_dialog:v,show_error_dialog:c,bind_hover:j,set_mutual_exclusive:e,get_form_level:A,get_form_scope:o,get_next_form_level:m,get_prefix:s,set_data:b,typing_timer:F,done_typing_interval:l,tooltip_timer:u,tooltip_delay:w,accesstype:i,countdown_filter:J,stop_filter_timer:C,get_parent:L,add_drag_css:K,remove_drag_css:q,set_alt_css:d,get_itemid:y,get_errors:h,get_cookie:n,get_elm_top:f,switch_wizard:t}}());$.ajaxSetup({cache:false});var theme=(function(){var f=true;var b="/setting/";var d="darkhive";function e(){var i=$("#id_accesstype_").val();utils.init_progress();utils.init_server_error_dialog();var h=$("#theme_wizard_select .save_button");h.click(function(){utils.switch_wizard("1")});utils.bind_hover(h);var g=$("#theme_option .cancelicon");g.click(function(){$("#theme_option").slideUp()});$.get(b+"?name=theme",function(j){if(j.success==1){d=(j.theme==""?"darkhive":j.theme)}$.themes.init({themes:["mintchoc","darkhive","trontastic","humanity","cupertino","sunny","smoothness"],defaultTheme:d,onSelect:a});if(i==utils.accesstype.admin){$("#theme_body").themes()}});if(i==utils.accesstype.admin){$("#proxy_options").click(c);utils.bind_hover($("#proxy_options"))}}function c(){$("#theme_option").slideToggle()}function a(j,i,g){if(!f&&$.browser.msie){}if(f==false){var h={name:"theme",value:j};$.post(b,h,function(k){})}f=false}return{init:e}}());$(document).ready(theme.init);
var utils = (function()
{
	var typing_timer;
	var done_typing_interval = 2000;
	var tooltip_timer;
	var tooltip_delay = 5000;
	var accesstype = {
			admin: 2,
			normal: 1
	};

	/**
	 * @public
	 * This function makes the selected id to appear as popup dialog to show alert message.
	 * @param id The element id.
	 */
	function init_alert_dialog(id)
	{
		$(id).dialog({
			autoOpen: false,
			modal: true,
	        buttons: {
	            OK: function() {
	                $(this).dialog("close");
	            }
	        }
	    });
	}

	/**
	 * @public
	 * This function monitor the progress of an ajax request by showing the progress Loading ...
	 */
	function init_progress()
	{
		$("#progress_status").ajaxSend(
				function(evt, jqXHR, ajaxOptions)
				{
					if (ajaxOptions.url.indexOf(log.run_url) == 0 ||
						ajaxOptions.url.indexOf(dashboard.data_url) == 0 ||
						ajaxOptions.url.indexOf(patchupgrade.upgrade_log_run_url) == 0 ||
						ajaxOptions.url.indexOf(patchupgrade.checkserver_url) == 0)
						return;
						
					$(this).show();
				});
		$("#progress_status").ajaxComplete(
				function()
				{
					$(this).hide();
				});
	}

	/**
	 * @public
	 * This function makes the element error-dialog to appear as popup dialog.
	 * It also attach the ajaxError event to monitor ajax error.
	 */
	function init_server_error_dialog()
	{
		$(document).ajaxError(
				function(evt, jqXHR, ajaxOptions, errorThrown)
				{
					if (ajaxOptions.url.indexOf(dashboard.data_url) == 0 ||
						ajaxOptions.url.indexOf(patchupgrade.checkserver_url) == 0)
						return;

					show_error_dialog(jqXHR.responseText);
				});
		$("#error-dialog").dialog({
			autoOpen: false,
			modal: true,
			width: 700,
			height: 500,
			buttons: {
				OK: function() {
					$(this).dialog("close");
				}
			}
		});
	}

	/**
	 * @public
	 * This function makes the selected id to appear as list panel which appears on the left, replacing the menu.
	 * @param id The element id.
	 * @param func_close the function to be called when it close.
	 */
	function init_list_panel(id, func_close)
	{
		var menu = get_menu_attr();
		var menu_pos = [menu.left, menu.top];
		$(id).dialog({
			autoOpen: false,
			width: menu.width - 3,
			resizable: false,
			draggable: true,
			modal: false,
			stack: false,
			zIndex: 1000,
			position: menu_pos,
			close: func_close
		});
	}

	/**
	 * @public
	 * This function makes the selected id to appear as popup dialog.
	 * @param id The element id.
	 */
	function init_confirm_delete(id)
	{
		$(id).dialog({
			autoOpen: false,
			modal: true
		});
	}
	
	/**
	 * @public
	 * This function makes the element panel_tooltip to appear as a popup tooltip.
	 * @param url The url to get the json data to be populated on the tooltip.
	 */
	function init_panel_tooltip(url)
	{
		$("#panel_body > .list_row").mouseout(function()
				{
					if (tooltip_timer)
						clearTimeout(tooltip_timer);
						
					tooltip_timer = setTimeout(function()
							{
								$("#panel_tooltip").hide();
							}, tooltip_delay);
				});
		$("#panel_body > .list_row").mouseenter(function(evt)
				{
					if (tooltip_timer)
						clearTimeout(tooltip_timer);
						
					var o = $(this);
					var menu = $("#menu");
					var id = o.attr('id');
					var pos = o.offset();
					var width = o.width();
					var left = menu.width() * 2 + 50;
					var top = pos.top + 10;
					
					$("#panel_tooltip_body").empty();
					
					$.getJSON(url, {id: id},
							function(result)
							{
								if (result.id == id)
								{
									$("#panel_tooltip_body").html(result.content);
									$("#panel_tooltip").position({
										my: 'center',
										at: 'left',
										of: $("body"),
										offset: left + ' ' + top
									});
									$("#panel_tooltip").show();
								}
							});
				});
		$("#panel_tooltip").mouseenter(function()
				{
					if (tooltip_timer)
						clearTimeout(tooltip_timer);
				});
		$("#panel_tooltip").mouseout(function()
				{
					if (tooltip_timer)
						clearTimeout(tooltip_timer);
						
					tooltip_timer = setTimeout(function()
							{
								$("#panel_tooltip").hide();
							}, tooltip_delay);
				});
	}

	/**
	 * @public
	 * This function checks whether an item already exist in an array.
	 * @param item The item to be checked.
	 * @param arr The array to be examined.
	 * @return true if the item exist, false otherwise.
	 */
	function item_exist(item, arr)
	{
		var i = $.inArray(item, arr);
	    return (i >= 0 ? true : false);
	}

	/**
	 * @public
	 * This function removes a dialog specified by the dialog id.
	 * @param id The dialog id.
	 */
	function remove_dialog(id)
	{
		$(id).dialog('destroy');
		$(id).remove();
	}

	/**
	 * @public
	 * This function removes all the dialogs from the DOM.
	 */
	function clear_dialogs()
	{
		remove_dialog("div[id^='dialog-message']");
		remove_dialog("div[id^='list-panel']");
		remove_dialog("div[id^='confirm']");
		remove_dialog("div[id^='dialog']");
	}

	/**
	 * @public
	 * This function closes the form that appears on the left side of a list page.
	 */
	function cancel_form()
	{
		$("#left_box").hide();
	}

	/**
	 * @public
	 * This function closes the popup dialog from the current form.
	 * @param level The current level of a dialog.
	 * @param dialog_id The dialog id.
	 */
	function cancel_dialog(level, dialog_id)
	{
		var i = level - 1;
		var prefix = (i < 1 ? '' : '_' + i);
		$(dialog_id + prefix).dialog('close');
	}

	/**
	 * @public
	 * This function shows a message in a popup dialog.
	 * @param arg The parameter to determine whether to show html (1) or plain text (2) message.
	 * @param msg The message.
	 */
	function show_dialog(arg, msg)
	{
		if (arg == 1)
			$("#dialog_msg").html(msg);

		else
			$("#dialog_msg").text(msg);

	    $("#dialog-message").dialog('open');
	}

	/**
	 * @public
	 * This function shows the error message in a popup dialog.
	 * @param msg The error message.
	 */
	function show_error_dialog(msg)
	{
		$("#error_dialog").html(msg);
		$("#error_dialog style").remove();
		$("#error-dialog").dialog('open');
	}

	/**
	 * @public
	 * This function binds the hover event to the selected object.
	 * @param selector The object selected using $
	 */
	function bind_hover(selector)
	{
		selector.hover(
				function()
				{
					$(this).toggleClass('ui-state-hover');
				},
				function()
				{
					$(this).toggleClass('ui-state-hover');
				});
	}
	
	/**
	 * @public
	 * This function makes a list of checkboxes to allow only 1 item to be selected.
	 * @param selector The list of checkboxes selected using $
	 */
	function set_mutual_exclusive(selector)
	{
		selector.click(
				function()
				{
					if (this.checked)
						selector.not(this).removeAttr('checked');
				});
	}

	/**
	 * @public
	 * This function returns the form level from a given form id.
	 * e.g if the form id is save-form-profile_2,
     * the form level will be 2
	 * @param id The form id.
	 * @return The form level.
	 */
	function get_form_level(id)
    {
        var i = id.indexOf('_');
        if (i < 0)
            return 0;

        var s = id.substr(i + 1);
        return parseInt(s, 10);
    }

    /**
     * @public
     * This function returns the form scope from a given form id.
     * e.g if the form id is save-form-profile_1,
     * the form scope will be profile
     * @param id The form id.
     * @return The form scope.
     */
    function get_form_scope(id)
    {
    	var i = id.lastIndexOf('-');
    	var j = id.lastIndexOf('_');
    	if (i < 5)
    		return '';

    	else if (id.indexOf('export-form') == 0 && i < 7)
    		return '';

    	else
    		return id.substring(i + 1, j);
    }

    /**
     * This function returns the previous form level from a given form id.
     * e.g if the form id is save-form-profile_2,
     * the previous form level will be 1
     * @param id The form id.
     * @return The previous form level.
     */
	function get_prev_form_level(id)
	{
		var i = get_form_level(id);
		return (i > 0 ? i - 1 : 0);
	}

	/**
	 * @public
	 * This function returns the next form level from a given form id.
	 * e.g if the form id is save-form,
	 * the next form level will be 1
	 * @param id The form id.
	 * @return The next form level.
	 */
    function get_next_form_level(id)
    {
    	var i = get_form_level(id);
    	return i + 1;
    }

    /**
     * @public
     * This function returns the prefix of a form id from a given form id.
     * e.g if the form id is save-form_1,
     * the prefix will be _1
     * @param id The form id.
     * @return The prefix of a form id.
     */
    function get_prefix(id)
    {
    	var p = get_form_level(id);
    	return (p == 0 ? '' : '_' + p);
    }

    /**
     * @public
     * This function sets the data associated with the object selected by jQuery.
     * @param selector The object selected using $
     * @param key The key associated with the data.
     * @param arr The object to be stored.
     */
	function set_data(selector, key, arr)
	{
		selector.removeData(key);
		selector.data(key, arr);
	}

	/**
	 * @public
	 * This function executes the specified function when the typing interval has elapsed.
	 * @param func The function to be executed.
	 */
	function countdown_filter(func)
	{
		stop_filter_timer();
		typing_timer = setTimeout(func, done_typing_interval);
	}

	/**
	 * @public
	 * This function stops the typing timer.
	 */
	function stop_filter_timer()
	{
		clearTimeout(typing_timer);
	}

	/**
	 * @public
	 * This function gets the parent object from a given selector and the level to be traversed.
	 * @param arg The jQuery selector.
	 * @param level The level to be traversed from the current selected object.
	 * @return The parent object.
	 */
	function get_parent(arg, level)
	{
		var o = $(arg);
		for (var i = 0; i < level; i++)
			o = o.parent();

		return o;
	}

	/**
	 * @public
	 * This function add dragging css class.
	 */
	function add_drag_css(evt, ui)
	{
		$(".ui-draggable-dragging").addClass("ui-state-hover");
	}

	/**
	 * @public
	 * This function remove dragging css class.
	 */
	function remove_drag_css(evt, ui)
	{
		$(".ui-draggable-dragging").removeClass("ui-state-hover");
	}

	/**
	 * @public
	 * This function makes a list of div elements to have alt row color.
	 * @param id The jQuery selector.
	 */
	function set_alt_css(id)
	{
		$(id + " > div").removeClass("ui-state-default");
		$(id + " > div").removeClass("ui-state-hover");
		$(id + " > div:odd").addClass("ui-state-default");
		$(id + " > div:even").addClass("ui-state-hover");
	}

	/**
	 * @public
	 * This function returns the id from a given element id.
	 * e.g if the element id is item_1,
	 * the id will be 1
	 * @param arg The element id.
	 * @return The id.
	 */
	function get_itemid(arg)
	{
		var i = arg.indexOf('_');
		if (i >= 0)
		{
			var s = arg.substr(i + 1);
			return parseInt(s, 10);
		}

		return -1;
	}

	/**
	 * @public
	 * This function returns the form errors in html after validation.
	 * @param errors The list of errors.
	 * @return The form errors in html.
	 */
	function get_errors(errors)
	{
		var data = {
				errors: errors
		};
		var h = new EJS({url: '/media/tpl/form_error.ejs'}).render(data);
		return h;
	}

	/**
	 * @public
	 * This function returns the cookie's value from a given cookie's name.
	 * @param name The cookie's name.
	 * @return The cookie's value.
	 */
	function get_cookie(name)
    {
        var cookieValue = null;
        if (document.cookie && document.cookie != '')
        {
            var cookies = document.cookie.split(';');
            for (var i = 0; i < cookies.length; i++)
            {
                var cookie = jQuery.trim(cookies[i]);
                // Does this cookie string begin with the name we want?
                if (cookie.substring(0, name.length + 1) == (name + '='))
                {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }

        return cookieValue;
    }

    /**
     * @public
     * This function returns the top position relative to the document's scroll top position.
     * @param v The object's offset.top
     * @return The relative top position.
     */
	function get_elm_top(v)
	{
		return v - $(document).scrollTop();
	}

	/**
	 * @private
	 * This function returns the left menu's attributes :
	 * width, left, top.
	 * @return The menu's attributes.
	 */
	function get_menu_attr()
	{
		var menu = $("#menu");
		
		var menu_width = menu.width();
		menu_width += 5;
		var menu_offset = menu.offset();
		var menu_left = menu_offset.left;
		var menu_top = menu_offset.top;
		menu_left -= 5;

		return {
			width: menu_width,
			left: menu_left,
			top: menu_top
		};
	}
	
	/**
	 * @public
	 * This function turns on the wizard.
	 * @param status
	 */
	function switch_wizard(status)
	{
		try
		{
			var url_profile_switch = "/wizard_profile_switch/";
			var data = {'status': status};
			
			$.post(url_profile_switch, data,
					function(result)
					{
						if (result.status == "success")
						{
							window.location.replace('/wizardReRun/');
						}
					
						if (result.status == "error")
						{
							alert(result.error_info);
						}
					});
		}
		
		catch (err)
		{
			alert(err.message);
		}
	}
	
	return {
		init_alert_dialog:init_alert_dialog,
		init_progress:init_progress,
		init_server_error_dialog:init_server_error_dialog,
		init_list_panel:init_list_panel,
		init_confirm_delete:init_confirm_delete,
		init_panel_tooltip:init_panel_tooltip,
		item_exist:item_exist,
		remove_dialog:remove_dialog,
		clear_dialogs:clear_dialogs,
		cancel_form:cancel_form,
		cancel_dialog:cancel_dialog,
		show_dialog:show_dialog,
		show_error_dialog:show_error_dialog,
		bind_hover:bind_hover,
		set_mutual_exclusive:set_mutual_exclusive,
		get_form_level:get_form_level,
		get_form_scope:get_form_scope,
		get_next_form_level:get_next_form_level,
		get_prefix:get_prefix,
		set_data:set_data,
		typing_timer:typing_timer,
		done_typing_interval:done_typing_interval,
		tooltip_timer:tooltip_timer,
		tooltip_delay:tooltip_delay,
		accesstype:accesstype,
		countdown_filter:countdown_filter,
		stop_filter_timer:stop_filter_timer,
		get_parent:get_parent,
		add_drag_css:add_drag_css,
		remove_drag_css:remove_drag_css,
		set_alt_css:set_alt_css,
		get_itemid:get_itemid,
		get_errors:get_errors,
		get_cookie:get_cookie,
		get_elm_top:get_elm_top,
		switch_wizard:switch_wizard
	};
}());

$.ajaxSetup({
	cache: false
});
/*
 * @include "utils.js"
 */

var theme = (function()
{
	var first = true;
	var save_url = "/setting/";
	var theme = "darkhive";

	function init()
	{
		// ------------------------------------------------------------------------------
		// Make a Themes
		//
		// themeBase:
		// 'http://ajax.googleapis.com/ajax/libs/jqueryui/1.7.2/themes/',
		// ------------------------------------------------------------------------------

		var accesstype = $("#id_accesstype_").val();
		utils.init_progress();
		utils.init_server_error_dialog();

		var select_wizard = $("#theme_wizard_select .save_button");
		select_wizard.click(function()
				{
					utils.switch_wizard('1');
				});
		utils.bind_hover(select_wizard);

		var select_close = $("#theme_option .cancelicon");
		select_close.click(function()
				{
					$("#theme_option").slideUp();
				});

		$.get(save_url + "?name=theme",
				function(result)
				{
					if (result.success == 1)
					{
						theme = (result.theme == "" ? 'darkhive' : result.theme);
					}

					$.themes.init({
						themes: ['mintchoc', 'darkhive', 'trontastic',
						         'humanity', 'cupertino', 'sunny',
						         'smoothness'],
						defaultTheme: theme,
						onSelect: reloadIE
					});

					if (accesstype == utils.accesstype.admin)
						$("#theme_body").themes();
				});

		/*
		 * $.themes.init({ themes:
		 * ['mintchoc','darkhive','trontastic','humanity','cupertino','sunny','uidarkness',
		 * 'smoothness'], defaultTheme : theme, onSelect: reloadIE});
		 */

		 if (accesstype == utils.accesstype.admin)
		{
			$("#proxy_options").click(show_options);
			utils.bind_hover($("#proxy_options"));
		}
	}

	function show_options()
	{
		$("#theme_option").slideToggle();
	}

	//IE doesn't update the display immediately, so reload the page
	function reloadIE(id, display, url)
	{
		if (!first && $.browser.msie)
		{
			// window.location.href = window.location.href;
		}

		if (first == false)
		{
			var data = {
					name: 'theme',
					value: id
			};

			$.post(save_url, data,
					function(result)
					{
					});
		}

		first = false;
	}

	return {
		init:init
	};
}());

$(document).ready(theme.init);

var conf = (function()
{
	var page_url = "/setting/conf/";
	var import_url = "/setting/conf/import/";
	var export_url = "/setting/conf/export/";
	var form_options = {
		target: '',
		dataType: 'json',
		async: false,
		timeout: 300000, //5 mins timeout
		beforeSubmit: import_request,
		success: import_response
	}
	
	function func_import()
	{
		$("#upload-form").ajaxSubmit(form_options);
		return false;
	}
	
	function func_export()
	{
		open(export_url, '_blank');
		return false;
	}
	
	function import_request(formData, jqForm, options)
	{ 
	    // formData is an array; here we use $.param to convert it to a string to display it 
	    // but the form plugin does this for you automatically when it submits the data 
	    //var queryString = $.param(formData);
		
		$("#status_import").show();
	 
	    // jqForm is a jQuery object encapsulating the form element.  To access the 
	    // DOM element for the form do this: 
	    // var formElement = jqForm[0];
	 
	    // here we could return false to prevent the form from being submitted; 
	    // returning anything other than false will allow the form submit to continue
		
	    return true; 
	}
	
	function import_response(responseText, statusText, xhr, $form)
	{ 
	    // for normal html responses, the first argument to the success callback 
	    // is the XMLHttpRequest object's responseText property 
	 
	    // if the ajaxForm method was passed an Options Object with the dataType 
	    // property set to 'xml' then the first argument to the success callback 
	    // is the XMLHttpRequest object's responseXML property 
	 
	    // if the ajaxForm method was passed an Options Object with the dataType 
	    // property set to 'json' then the first argument to the success callback 
	    // is the json data object returned by the server
		$("#status_import").hide();
		
		if (statusText == 'success')
		{
			if (responseText.success == 1)
			{
				stat.show_status(0, responseText.msg);
				window.location.replace(window.location.href);
			}
				
			else
				stat.show_status(1, responseText.msg);
		}
		
		else
		{
			stat.show_status(1, responseText);
		}
	}
	
	function init()
	{
		$("#.save_button.import").click(func_import);
		$(".save_button.export").click(func_export);
		utils.bind_hover($(".save_button"));
	}
	
	function load()
	{
		return menu.get(page_url, init);
	}
	
	return {
		load:load,
		func_export:func_export
	}
}());
$(document).ajaxSend(function(event, xhr, settings)
{
    function getCookie(name)
    {
        var cookieValue = null;
        if (document.cookie && document.cookie != '')
        {
            var cookies = document.cookie.split(';');
            for (var i = 0; i < cookies.length; i++)
            {
                var cookie = jQuery.trim(cookies[i]);
                // Does this cookie string begin with the name we want?
                if (cookie.substring(0, name.length + 1) == (name + '='))
                {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        
        return cookieValue;
    }
    
    function sameOrigin(url)
    {
        // url could be relative or scheme relative or absolute
        var host = document.location.host; // host + port
        var protocol = document.location.protocol;
        var sr_origin = '//' + host;
        var origin = protocol + sr_origin;
        // Allow absolute or scheme relative URLs to same origin
        return (url == origin || url.slice(0, origin.length + 1) == origin + '/') ||
            (url == sr_origin || url.slice(0, sr_origin.length + 1) == sr_origin + '/') ||
            // or any other URL that isn't scheme relative or absolute i.e relative.
            !(/^(\/\/|http:|https:).*/.test(url));
    }
    
    function safeMethod(method)
    {
        return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
    }

    if (!safeMethod(settings.type) && sameOrigin(settings.url))
    {
        xhr.setRequestHeader("X-CSRFToken", getCookie('csrftoken'));
    }
});
var dashboard = (function()
{
	var data_url = "/dashboard/data/";
	var refresh_timer = null;
	
	function countdown_refresh()
	{
		stop_refresh_timer();
		var val = $("#id_refresh").val();
		if (val != null && val != '0')
		{
			var interval = parseInt(val);
			if (!$.isNumeric(interval) || val == 0)
			{
				return;
			}
				
			interval *= 1000;
			refresh_timer = setTimeout(get_data, interval);
		}
	}
	
	function stop_refresh_timer()
	{
		clearTimeout(refresh_timer);
	}
	
	function init()
	{
		$("#id_refresh").change(countdown_refresh);
		countdown_refresh();
	}
	
	function load()
	{
		return menu.get('/dashboard/', init);
	}
	
	function get_data()
	{
		$.ajax({
			url: data_url,
			dataType: 'json',
			data: null,
			cache: false,
			success: function(result, textStatus, jqXHR)
			{
				set_data(result);
			},
			complete: function(jqXHR, textStatus)
			{
				countdown_refresh();
			}
		});
	}
	
	function set_data(result)
	{
		if (result.currdate != '')
		{
			$("#id_currdate").text(result.currdate);
		}
			
		if (result.error == 1)
		{
			return;
		}

		$("#id_avpattern").text(result.avpattern);
		$("#id_pgbarcpu .ui-progressbar-value").css('width', result.cpu + '%');
		$("#id_pgbarcpu .dashboard_pgbar_text").html(result.cpu + '%');
		$("#id_pgbarram .ui-progressbar-value").css('width', result.ram + '%');
		$("#id_pgbarram .dashboard_pgbar_text .ram_val").html(result.ram + '%');
		$("#id_pgbarswap .ui-progressbar-value").css('width', result.swap + '%');
		$("#id_pgbarswap .dashboard_pgbar_text .swap_val").html(result.swap + '%');
		$("#id_pgbarhd .ui-progressbar-value").css('width', result.hd + '%');
		$("#id_pgbarhd .dashboard_pgbar_text .hd_val").html(result.hd + '%');
		$("#id_request").text(result.request);
		$("#id_block").text(result.block);
		$("#id_malware").text(result.malware);
		$(".dashboard_tbl2 > tbody").html(result.niclist);
	}
	
	return {
		load:load,
		data_url:data_url,
		stop_refresh_timer:stop_refresh_timer
	}
}());
var defnet = (function()
{
	var save_url = "/defnet/save/";
	var delete_url = "/defnet/delete/";
	var list_url = "/defnet/list/";
	var info_url = "/defnet/info/";
	var list = {
			panel: '/defnet/list/panel/',
			select: '/defnet/list/select/',
			panel_custom1: '/defnet/list/panel/custom1/',
			select_custom1: '/defnet/list/select/custom1/',
			panel_custom2: '/defnet/list/panel/custom2/',
			select_custom2: '/defnet/list/select/custom2/',
			panel_custom3: '/defnet/list/panel/custom3/',
			select_custom3: '/defnet/list/select/custom3/'
	};

	var save_temp_url = "/defnet/save/temp/";
	var list_temp = {
			panel : '/defnet/list/panel/temp/',
			select: '/defnet/list/select/temp/'
	};

	var popup_dialog_opt = null;
	var drag_opt = null;
	var drop_scope = 'defnet';
	var list_changed = false;

	function init_ui_opt()
	{
		popup_dialog_opt = {
				autoOpen: false,
				width: 320,
				resizable: false,
				draggable: false,
				modal: false,
				stack: true,
				zIndex: 1000
		};
		drag_opt = {
				revert: true,
				snap: false,
				revertDuration: 0,
				zIndex: 1001,
				appendTo: 'body',
				helper: 'clone',
				scope: drop_scope,
				drag: utils.add_drag_css,
				stop: utils.remove_drag_css
		};
	}

	function get_ui_opt()
	{
		init_ui_opt();
		return {
			popup_dialog_opt: popup_dialog_opt,
			drag_opt: drag_opt
		};
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
					var nextform = $("#save-form" + sep + data.scope + _prefix);
					utils.set_data(nextform.find("#members"), 'members', []);
					nextform.find("#id_type").change(show_inner_form);
					nextform.find(".save_button.save").click(function()
							{
								if ((data.scope == '' || data.level > 1) && data.savetemp == null)
									return save_inner_form(data);

								else if (data.level == 1 || data.savetemp != null)
									return data.func_save();

								return false;
							});
					nextform.find(".save_button.cancel").click(function()
							{
								utils.cancel_dialog(data.level, "#dialog-add" + sep + data.scope);
								update_list();
							});
					if (jQuery.isFunction(data.func_show_all) && jQuery.isFunction(data.func_show_add))
					{
						nextform.find(".img_folder").click(data.func_show_all);
						nextform.find(".img_add").click(data.func_show_add);
						nextform.find("#members_dropzone").droppable({
							hoverClass: 'ui-state-active',
							scope: drop_scope,
							drop: function(evt, ui)
							{
								var o = ui.draggable;
								add_dragged_item(nextform, o);
							}
						});
					}
					$("#dialog-add" + sep + data.scope + _prefix).dialog(get_ui_opt().popup_dialog_opt);
					$("#dialog-edit" + sep + data.scope + _prefix).dialog(get_ui_opt().popup_dialog_opt);
					set_inner_form(nextform, 1);
					utils.bind_hover(nextform.find(".save_button"));
					$("#dialog-edit" + sep + data.scope + data.prefix).dialog('close');
					$("#dialog-add" + sep + data.scope + data.prefix).dialog('open');
				});
	}

	function init_edit_form(data)
	{
		var offset = $(data.self).offset();
		var position = [offset.left, utils.get_elm_top(offset.top)];
		var _prefix = '_' + data.level;
		var sep = (data.scope == '' ? '' : '-');
		var scopeq = (data.scope == '' ? '' : '&scope=' + data.scope);
		utils.remove_dialog("#dialog-edit" + sep + data.scope + _prefix);
		$("#dialog_body" + sep + data.scope + data.prefix).empty();
		$("#dialog-add" + sep + data.scope + data.prefix).dialog('close');
		var url = (data.url == null ? save_url : data.url);
		$("#dialog-edit" + sep + data.scope + data.prefix).dialog('option', 'position', position);
		$("#dialog_edit_body" + sep + data.scope + data.prefix).load(url + "?id=" + data.id + "&level=" + data.level + scopeq, null,
				function()
				{
					var nextform = $("#save-form" + sep + data.scope + _prefix);
					nextform.find("#id_type").change(show_inner_form);
					nextform.find(".save_button.save").click(function()
							{
								return update_inner_form(data);
							});
					nextform.find(".save_button.cancel").click(function()
						{
							utils.cancel_dialog(data.level, "#dialog-edit" + sep + data.scope);
							update_list();
						});
					if (jQuery.isFunction(data.func_show_all) && jQuery.isFunction(data.func_show_add))
					{
						nextform.find(".img_folder").click(data.func_show_all);
						nextform.find(".img_add").click(data.func_show_add);
						nextform.find("#members_dropzone").droppable({
							hoverClass: 'ui-state-active',
							scope: drop_scope,
							drop: function(evt, ui)
							{
								var o = ui.draggable;
								add_dragged_item(nextform, o);
							}
						});
					}
					$("#dialog-add" + sep + data.scope + _prefix).dialog(get_ui_opt().popup_dialog_opt);
					$("#dialog-edit" + sep + data.scope + _prefix).dialog(get_ui_opt().popup_dialog_opt);
					set_items(nextform);
					utils.bind_hover(nextform.find(".save_button"));
					$("#dialog-add" + sep + data.scope + data.prefix).dialog('close');
					$("#dialog-edit" + sep + data.scope + data.prefix).dialog('open');
				});
	}

	// Nghia add this code support for wizard.
	//Note don't using group in this case.
	function init_form_wizard(data)
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
					var nextform = $("#save-form" + sep + data.scope + _prefix);

					utils.set_data(nextform.find("#members"), 'members', []);
					nextform.find("#id_type").change(show_inner_form);
					nextform.find(".save_button.save").click(function()
							{
								return data.func_save();
							});

					nextform.find(".save_button.cancel").click(function()
							{
								utils.cancel_dialog(data.level, "#dialog-add" + sep + data.scope);
								//update_list();
							});

					obj_type = nextform.find("#id_type").children();
					$($(obj_type).get(3)).remove();


					if (jQuery.isFunction(data.func_show_all) && jQuery.isFunction(data.func_show_add))
					{
						nextform.find(".img_folder").click(data.func_show_all);

						//nextform.find(".img_add").click(data.func_show_add);
						nextform.find(".img_add").hide();

						nextform.find("#members_dropzone").droppable({
							hoverClass: 'ui-state-active',
							scope: drop_scope,
							drop: function(evt, ui)
							{
								var o = ui.draggable;
								add_dragged_item(nextform, o);
							}
						});
					}
					$("#dialog-add" + sep + data.scope + _prefix).dialog(get_ui_opt().popup_dialog_opt);
					$("#dialog-edit" + sep + data.scope + _prefix).dialog(get_ui_opt().popup_dialog_opt);

					nextform.find(".img_add").hide();

					set_inner_form(nextform, 3);
					nextform.find('#id_type').val(3);
					utils.bind_hover(nextform.find(".save_button"));

					$("#dialog-edit" + sep + data.scope + data.prefix).dialog('close');
					$("#dialog-add" + sep + data.scope + data.prefix).dialog('open');
				});
	}

	//Nghia create this to support for wizard.
	function init_edit_form_wizard(data)
	{
		var offset = $(data.self).offset();
		var position = [offset.left, utils.get_elm_top(offset.top)];
		var _prefix = '_' + data.level;
		var sep = (data.scope == '' ? '' : '-');
		var scopeq = (data.scope == '' ? '' : '&scope=' + data.scope);
		var wizq = (data.url == null ? '' : '&wiz=1');
		utils.remove_dialog("#dialog-edit" + sep + data.scope + _prefix);
		$("#dialog_body" + sep + data.scope + data.prefix).empty();
		$("#dialog-add" + sep + data.scope + data.prefix).dialog('close');
		var url = (data.url == null ? save_url : data.url);
		$("#dialog-edit" + sep + data.scope + data.prefix).dialog('option', 'position', position);
		$("#dialog_edit_body" + sep + data.scope + data.prefix).load(url + "?id=" + data.id + "&level=" + data.level + scopeq + wizq, null,
				function()
				{
					var nextform = $("#save-form" + sep + data.scope + _prefix);
					nextform.find("#id_type").change(show_inner_form);
					nextform.find(".save_button.save").click(function()
							{
								return update_inner_form(data);
							});
					nextform.find(".save_button.cancel").click(function()
						{
							utils.cancel_dialog(data.level, "#dialog-edit" + sep + data.scope);
							update_list();
						});
					if (jQuery.isFunction(data.func_show_all) && jQuery.isFunction(data.func_show_add))
					{
						nextform.find(".img_folder").click(data.func_show_all);
						nextform.find(".img_add").click(data.func_show_add);
						nextform.find("#members_dropzone").droppable({
							hoverClass: 'ui-state-active',
							scope: drop_scope,
							drop: function(evt, ui)
							{
								var o = ui.draggable;
								add_dragged_item(nextform, o);
							}
						});
					}
					$("#dialog-add" + sep + data.scope + _prefix).dialog(get_ui_opt().popup_dialog_opt);
					$("#dialog-edit" + sep + data.scope + _prefix).dialog(get_ui_opt().popup_dialog_opt);
					set_items(nextform);
					utils.bind_hover(nextform.find(".save_button"));
					$("#dialog-edit" + sep + data.scope + data.prefix).dialog('open');
				});
	}

	function show_form()
	{
		$("#left_box").load(save_url, null,
				function()
				{
					var form = $("#save-form");
					utils.set_data(form.find("#members"), 'members', []);
					$("#left_box").css('width', '300px');
					$(".save_button.save").click(func_save);
					$(".save_button.cancel,.form_title div.close").click(utils.cancel_form);
					$("#id_type").change(show_inner_form);
					$(".img_folder").click(show_all);
					$(".img_add").click(show_add);
					$("#members_dropzone").droppable({
						hoverClass: 'ui-state-active',
						scope: drop_scope,
						drop: function(evt, ui)
						{
							var o = ui.draggable;
							add_dragged_item(form, o);
						}
					});
					$("#dialog-add").dialog(popup_dialog_opt);
					$("#dialog-edit").dialog(popup_dialog_opt);
					set_inner_form(form, 1);
					utils.bind_hover($(".save_button,.form_title div.close"));
					$("#left_box").show();
				});

		return false;
	}

	function show_inner_form()
	{
		var form = utils.get_parent(this, 2);
		var val = $(this).val();
		var _val = parseInt(val, 10);
		set_inner_form(form, _val);
	}

	function save_success()
	{
		utils.cancel_form();
		hide_panel();
		nav_list.show_list();
	}

	function cancel_form()
	{
		utils.cancel_form();
		update_list();
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
					$(".img_folder").click(show_all);
					$(".img_add").click(show_add);
					$("#members_dropzone").droppable({
						hoverClass: 'ui-state-active',
						scope: drop_scope,
						drop: function(evt, ui)
						{
							var o = ui.draggable;
							add_dragged_item($("#save-form"), o);
						}
					});
					$("#dialog-add").dialog(popup_dialog_opt);
					$("#dialog-edit").dialog(popup_dialog_opt);
					set_items($("#save-form"));
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
		list_form.save(o);
		update_list();
		return false;
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
		list_form.save(o);
		update_list();
		return false;
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
		edit_helper({self: self, clone: 1});
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

	function save_inner_form(o)
	{
		var i = o.level - 1;
		var sep = (o.scope == '' ? '' :'-');
		var prefix = (o.level < 1 ? '' : '_' + o.level);
		var _prefix = (i < 1 ? '' : '_' + i);
		var currform = $("#save-form" + sep + o.scope + prefix);
		var prevform = $("#save-form" + sep + o.scope + _prefix);
		var savetemp = (o.savetemp == null ? '' : o.savetemp);
		var data = get_data(currform, "", savetemp);
		data['level'] = o.level;
		var url = (o.url == null ? save_url : o.url);
		$.post(url, data,
				function(result)
				{
					if (result.success == 1)
					{
						if ((o.level == 1 && o.scope != '') || (savetemp != '' && o.scope != ''))
							o.func_add(result.id, result.name);

						else
							add_member(prevform, result.id, result.name);

						utils.cancel_dialog(o.level, "#dialog-add" + sep + o.scope);
					}

					else if (result.error == 1)
					{
						err = utils.get_errors(result.errors);
						utils.show_dialog(1, err);
					}

					else
					{
						utils.show_dialog(2, result);
					}
				});
		return false;
	}

	function update_inner_form(o)
	{
		var i = o.level - 1;
		var sep = (o.scope == '' ? '' : '-');
		var prefix = (o.level < 1 ? '' : '_' + o.level);
		var _prefix = (i < 1 ? '' : '_' + i);
		var currform = $("#save-form" + sep + o.scope + prefix);
		var prevform = $("#save-form" + sep + o.scope + _prefix);
		var savetemp = (o.savetemp == null ? 'update' : o.savetemp);
		var data = get_data(currform, o.id, savetemp);
		data['level'] = o.level;
		var url = (o.url == null ? save_url : o.url);
		$.post(url, data,
				function(result)
				{
					if (result.success == 1)
					{
						if (o.level == 1 && o.scope != '')
							o.func_update(result.id, result.name, o.self);

						else if (o.level == 2 && o.savetemp != null)
						{
							o.func_update(result.id, result.name, o.self);
						}

						else
						{
							list_changed = true;
							update_member(prevform, result.id, result.name, o.self);

						}

						utils.cancel_dialog(o.level, "#dialog-edit" + sep + o.scope);
					}

					else if (result.error == 1)
					{
						err = utils.get_errors(result.errors);
						utils.show_dialog(1, err);
					}

					else
					{
						utils.show_dialog(2, result);
					}
				});
		return false;
	}

	function get_data(form, arg, savetype)
	{
		var val = form.find("#id_type").val();
		var data = {
				name: form.find("#id_name").val(),
				type: val,
				comment: form.find("#id_comment").val(),
				id: arg,
				save_type: savetype
		}
		if (val == '1')
		{
			data['host'] = form.find("#id_host").val();
		}

		else if (val == '2')
		{
			data['hostname'] = form.find("#id_hostname").val();
		}

		else if (val == '3')
		{
			data['ipaddress'] = form.find("#id_ipaddress").val();
			data['netmask'] = form.find("#id_netmask").val();
		}

		else if (val == '4')
		{
			arr = form.find("#members").data('members');
			data['members'] = arr.join(',');
		}

		return data;
	}

	function set_inner_form(form, i)
	{
		for (var j = 1; j < 5; j++)
		{
			if (j == i)
				form.find(".defnet_form" + i).show();

			else
				form.find(".defnet_form" + j).hide();
		}
	}

	function hide_panel()
	{
		var isopen = $("#list-panel").dialog('isOpen');
		if (isopen)
			$("#list-panel").dialog('close');

		$("#panel_tooltip").hide();
		$("#leftcolumn").show();
	}

	function show_all()
	{
		var isopen = $("#list-panel").dialog('isOpen');
		if (isopen)
		{
			$("#list-panel").dialog('close');
			return false;
		}

		$("#leftcolumn").hide();
		var form = utils.get_parent(this, 4);
		$("#list_body").load(list.panel, null,
				function()
				{
					$(".add_button").click(function()
							{
								add_members(form);
							});
					$(".drag_zone").draggable(drag_opt);
					$("#id_filters").change(filter_list);
					$("#id_filter_text").keyup(function()
							{
								utils.countdown_filter(filter_list);
							});
					$("#id_filter_text").keydown(utils.stop_filter_timer);
					init_tooltip();
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
		$("#panel_body").load(list.select + s, null,
				function()
				{
					$(".drag_zone").draggable(drag_opt);
					init_tooltip();
				});
	}

	function init_tooltip()
	{
		utils.init_panel_tooltip(info_url);
	}

	function show_add()
	{
		var o = get_level_data(this);
		var self = this;
		var data = {
				self: self,
				level: o.level,
				prefix: o.prefix,
				scope: '',
				func_show_all: show_all,
				func_show_add: show_add
		};
		init_form(data);
		return false;
	}

	function add_dragged_item(form, o)
	{
		var item = $(o);
		var name = item.html();
		var id = item.parent().attr("id");
		add_member(form, id, name);
	}

	function add_member(form, id, name)
	{
		var _id = parseInt(id, 10);
		var arr = form.find("#members").data('members');
		if (!utils.item_exist(_id, arr))
		{
			arr.push(_id);
			utils.set_data(form.find("#members"), 'members', arr);
			var data = {
					id_prefix: 'item_',
					id: _id,
					click: 'defnet.remove_member(this)',
					editclick: 'defnet.edit_member(this)',
					name: name
			};
			var h = new EJS({url: '/media/tpl/list_item.ejs'}).render(data);
			form.find("#members").append(h);
		}

		set_alt_css(form, "#members");
	}

	function add_members(form)
	{
		$("input[name=chklist]:checked").each(
				function()
				{
					var o = $(this);
					var id = o.parent().attr("id");
					var name = o.next().html();
					add_member(form, id, name);
				});
	}

	function remove_member(o)
	{
		var item = $(o);
		var id = item.parent().attr("id");
		var _id = utils.get_itemid(id);
		var form = utils.get_parent(item, 5);
		var arr = form.find("#members").data('members');
		var i = $.inArray(_id, arr);
		if (i >= 0)
		{
			arr.splice(i, 1);
			utils.set_data(form.find("#members"), 'members', arr);
		}

		form.find("#" + id).remove();
		set_alt_css(form, "#members");
		return false;
	}

	function edit_member(obj)
	{
		var item = $(obj);
		var id = item.parent().attr("id");
		var _id = utils.get_itemid(id);
		var form = utils.get_parent(item, 5);
		var o = get_form_level_data(form);
		var self = item;
		var data = {
				self: self,
				id: _id,
				level: o.level,
				prefix: o.prefix,
				scope: o.scope,
				func_show_all: show_all,
				func_show_add: show_add
		};
		init_edit_form(data);
		return false;
	}

	function update_member(form, id, name, self)
	{
		$(self).next().html(name);
		var isopen = $("#list-panel").dialog('isOpen');
		if (isopen)
			filter_list();
	}

	function get_level_data(self)
	{
		var currform = utils.get_parent(self, 4);
		return get_form_level_data(currform);
	}

	function get_form_level_data(form)
	{
		var form_id = form.attr("id");
		var level = utils.get_next_form_level(form_id);
		var prefix = utils.get_prefix(form_id);
		var scope = utils.get_form_scope(form_id);
		return {
				level: level,
				prefix: prefix,
				scope: scope
		};
	}

	function set_items(form)
	{
		var val = form.find("#id_type").val();
		if (val != '4')
			return;

		arr = [];
		form.find("#members > div").each(
				function()
				{
					var id = $(this).attr("id");
					var _id = utils.get_itemid(id);
					if (!utils.item_exist(_id, arr))
					{
						arr.push(_id);
					}
				});
		utils.set_data(form.find("#members"), 'members', arr);
		set_alt_css(form, "#members");
	}

	function set_alt_css(form, members)
	{
		form.find(members + " > div").removeClass("ui-state-default");
		form.find(members + " > div").removeClass("ui-state-hover");
		form.find(members + " > div:odd").addClass("ui-state-default");
		form.find(members + " > div:even").addClass("ui-state-hover");
	}

	function update_list()
	{
		if (list_changed)
		{
			list_changed = false;
			nav_list.show_list();
		}
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
		utils.remove_dialog("#dialog-add");
		utils.remove_dialog("#dialog-edit");
		utils.init_alert_dialog("#dialog-message");
		utils.init_confirm_delete("#confirm-delete");
		utils.init_list_panel("#list-panel", hide_panel);
		utils.bind_hover($("#id_add,#id_find"));
		nav_list.config.list_url = list_url;
		nav_list.config.list_func = init_list;
		nav_list.init();
	}

	function load()
	{
		return menu.get('/defnet/', init);
	}

	return {
		load:load,
		list:list,
		add_members:add_members,
		edit_member:edit_member,
		remove_member:remove_member,
		get_level_data:get_level_data,
		init_form:init_form,
		init_edit_form:init_edit_form,
		init_tooltip:init_tooltip,
		save_inner_form:save_inner_form,
		get_ui_opt:get_ui_opt,
		drop_scope:drop_scope,
		save_temp_url:save_temp_url,
		list_temp:list_temp,
		init_form_wizard:init_form_wizard,
		init_edit_form_wizard:init_edit_form_wizard
	};
}());
var defschedule = (function()
{
	var save_url = "/schedule_add/";
	var save_temp_url = "/schedule/save/temp/"; 
	
	var edit_url = "/schedule_edit/";
	var edit_temp_url = "/schedule_edit_temp/";
	
	var delete_url = "/schedule_delete/";
	var list_url = "/schedule/list/";
	
	var list = {
			panel: '/schedule/list/panel/',
			select: 'schedule/list/panel_search/'
	};
	
	var list_temp = {
			panel : '/schedule/list/panel/temp/',
			select : '/schedule/list/panel_search/temp/'
	};
	
	var popup_dialog_opt = null;
	
	function init_ui_opt()
	{
		popup_dialog_opt = {
				autoOpen: false,
				width: 340,
				resizable: false,
				draggable: false,
				modal: false,
				stack: false,
				zIndex: 10000
		};
	}

	function get_ui_opt()
	{
		init_ui_opt();
		return {
			popup_dialog_opt: popup_dialog_opt
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
					var nextform = $("#save-form" + sep + data.scope + _prefix);
					init_calendar(nextform);
					nextform.find("#id_type").change(show_inner_form);
					nextform.find(".save_button.save").click(function()
							{
								if (data.level == 2 && data.scope == 'schedule-profile')
								{
									return data.func_save();
								}
								
								else if (data.scope == '' || data.level > 1)
								{
									var o = {
											level: data.level,
											scope: data.scope
									};
									
									return save_inner_form(o);
								}
								
								else if (data.level == 1)
								{
									return data.func_save();
								}
								
								return false;
							});
					nextform.find(".save_button.cancel").click(function()
							{
								utils.cancel_dialog(data.level, "#dialog-add" + sep + data.scope);
							});
					set_inner_form(nextform, 1);
					utils.bind_hover(nextform.find(".save_button"));
					$("#dialog-add" + sep + data.scope + data.prefix).dialog('open');
				});
	}

	function init_edit_form(data)
	{
		var offset = $(data.self).offset();
		var position = [offset.left, utils.get_elm_top(offset.top)];
		var _prefix = '_' + data.level;
		var sep = (data.scope == '' ? '' : '-');
		var scopeq = (data.scope == '' ? '' : '&scope=' + data.scope);
		var wizq = (data.url == null ? '' : '&wiz=1');
		utils.remove_dialog("#dialog-edit" + sep + data.scope + _prefix);
		$("#dialog_body" + sep + data.scope + data.prefix).empty();
		$("#dialog-add" + sep + data.scope + data.prefix).dialog('close');
		var url = (data.url == null ? edit_temp_url : data.url);
		$("#dialog-edit" + sep + data.scope + data.prefix).dialog('option', 'position', position);
		$("#dialog_edit_body" + sep + data.scope + data.prefix).load(url + data.id + "/?level=" + data.level + scopeq + wizq, null,
				function()
				{
					var nextform = $("#save-form" + sep + data.scope + _prefix);
					init_calendar(nextform);
					nextform.find("#id_type").change(show_inner_form);
					nextform.find(".save_button.save").click(function()
							{
								return update_inner_form(data);
							});
					nextform.find(".save_button.cancel").click(function()
							{
								utils.cancel_dialog(data.level, "#dialog-edit" + sep + data.scope);
							});
					var i = nextform.find("#id_type").val();
					var t = parseInt(i, 10);
					set_inner_form(nextform, t);
					utils.bind_hover(nextform.find(".save_button"));
					$("#dialog-edit" + sep + data.scope + data.prefix).dialog('open');
				});
	}

	// this function to show form when user click to add new schedule.
	function show_form()
	{
		$("#left_box").load(save_url, null,
				function()
				{
					var form = $("#save-form");
					$("#left_box").css('width', '330px');
					init_calendar(form);
					$(".save_button.save").click(function()
							{
								return func_save('0');
							});
					$(".save_button.cancel,.form_title div.close").click(utils.cancel_form);
					$("#id_type").change(show_inner_form);
					set_inner_form(form, 1);
					utils.bind_hover($(".save_button,.form_title div.close"));
					$("#left_box").show();
				});

		return false;
	}

	function show_inner_form()
	{
		var form = utils.get_parent(this, 3);
		var val = $(this).val();
		var _val = parseInt(val, 10);
		set_inner_form(form, _val);
	}

	function edit_helper(o)
	{
		var arg = $(o.self).parent().attr("id");
		var url = "/schedule_edit/";
		if (o.clone == 1)
			url = "/schedule_clone/";

		url += arg + '/';
		$("#left_box").load(url, null,
				function()
				{
					var form = $("#save-form");
					$("#left_box").css('width', '330px');
					init_calendar(form);
					$(".save_button.save").click(function()
							{
								return func_save(0);
							});
					$(".save_button.cancel,.form_title div.close").click(utils.cancel_form);
					$("#id_type").change(show_inner_form);
					utils.bind_hover($(".save_button,.form_title div.close"));
					var i = $("#id_type").val();
					var t = parseInt(i, 10);
					set_inner_form(form, t);
					$("#left_box").show();
				});
	}

	function func_save()
	{
		var currform = $("#save-form");
		var data = get_data(currform);
		var action = $('#id_action').val();
		if (action == "edit")
			schedule_edit(data);

		else
			schedule_add(data);
	}

	function save_inner_form(o)
	{
		var i = o.level - 1;
		var sep = (o.scope == '' ? '' :'-');
		var prefix = (o.level < 1 ? '' : '_' + o.level);
		var _prefix = (i < 1 ? '' : '_' + i);
		var currform = $("#save-form" + sep + o.scope + prefix);
		var prevform = $("#save-form" + sep + o.scope + _prefix);
		
		var savetemp = (!('savetemp' in o) ? '' : o.savetemp);
		var url = ( !('url' in o) ? save_url : o.url);
		
		var data = get_data(currform);
		data['level'] = o.level;
		data['savetemp'] = savetemp;
		
		$.post(url, data,
				function(result)
				{
					
					if (result.success == 1)
					{
						o.func_add(result.id, result.name);
						utils.cancel_dialog(o.level, "#dialog-add" + sep + o.scope);
					}

					else if (result.error == 1)
					{
						err = utils.get_errors(result.errors);
						utils.show_dialog(1, err);
					}
					else if(result.invalid)
					{
						err = utils.get_errors(result.invalid);
						utils.show_dialog(1, err);
					}
					else
					{
						err = utils.get_errors(result.errors);
						utils.show_dialog(2, err);
					}
				});
				
		return false;
	}

	function update_inner_form(o)
	{
		var i = o.level - 1;
		var sep = (o.scope == '' ? '' : '-');
		var prefix = (o.level < 1 ? '' : '_' + o.level);
		var _prefix = (i < 1 ? '' : '_' + i);
		var currform = $("#save-form" + sep + o.scope + prefix);
		var prevform = $("#save-form" + sep + o.scope + _prefix);
		var savetemp = (o.savetemp == null ? 'update' : o.savetemp);
		var data = get_data(currform);
		
		data['savetemp'] = savetemp;
		data['level'] = o.level;
		
		var url = (o.url == null ? edit_url : o.url);
		
		$.post(url + data.id + "/", data,
				function(result)
				{
					if (result.success == 1)
					{
						if (o.level == 1 && o.scope != '')
							o.func_update(result.id, result.name, o.self);
						
						if (o.level == 2)
							o.func_update(result.id, result.name, o.self);
							
						utils.cancel_dialog(o.level, "#dialog-edit" + sep + o.scope);
					}

					else if (result.error == 1)
					{
						err = utils.get_errors(result.errors);
						utils.show_dialog(1, err);
					}
					
					else if(result.invalid)
					{
						err = utils.get_errors(result.invalid);
						utils.show_dialog(1, err);
					}
					
					else
					{
						utils.show_dialog(2, result);
					}
				});
		return false;
	}

	function func_save(level)
	{
		var i = level - 1;
		var prefix = (level < 1 ? '' : '_' + level);
		var _prefix = (i < 1 ? '' : '_' + i);
		var currform = $("#save-form" + prefix);
		var prevform = $("#save-form" + _prefix);

		action = $('#id_action').val();
		var data = null;

		// action var represent for action from user.
		// Ex : action for editing or deleting.

		if (level == 0)
			data = get_data(prevform);

		else
		{
			data = get_data(currform);
			data['level'] = level;
		}

		if (action == "edit")
			schedule_edit(data);

		else
			schedule_add(data);
	}

	// This function to get data from server.
	function func_edit()
	{
		var self = this;
		edit_helper({self: self, clone: null});
	}

	// this function edit schedule
	function schedule_edit(data)
	{
		var id = $('#id_id').val();

		url = "/schedule_edit/" + id + "/";
		// data = get_data();
		$.post(url, data,
				function(result)
				{
					show_info(result);
				});
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
				id : arg,
				pgnum : currpg,
				pgsize : pgsize,
				find : search_by,
				text : keyword,
				confirm : ''
		};

		var url = "/schedule_delete/" + arg + "/";
		ajax_delete(url,data,item);
	}

	function ajax_delete(url, data, item)
	{
		$.post(url, data,
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
									ajax_delete(url, data, item);
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

	function func_clone()
	{
		var self = this;
		edit_helper({self: self, clone: 1});
	}

	function show_info(result)
	{
		if (result.Success)
		{
			utils.cancel_form();
			nav_list.show_list();
		}

		if (result.invalid)
		{
			err = utils.get_errors(result.invalid);
			utils.show_dialog(1, err);
		}

		if (result.error)
		{
			utils.show_dialog(2, result.error);
		}
	}

	function schedule_transform(tmp)
	{
		var arrpos = ["0", "0", "0", "0", "0", "0", "0", "0"];

		for (var i = 0; i < tmp.length; i++)
		{
			arrpos[tmp[i]] = "1";
		}

		var a = arrpos.join('');
		return a;
	}

	function schedule_getselected(form)
	{
		var tmp = [];
		var code = null;

		form.find("input[name='checkbox_day']").each(function()
				{
					if ($(this).attr('checked') == "checked")
					{
						var c = $(this).val();
						tmp.push(c);
					}
				});
		code = schedule_transform(tmp);
		return code;
	}

	// form variable is id of the form that you want to save
	// using in wizard
	function get_data(form)
	{
		nameVar = form.find('#id_name').val();
		id = form.find("#id_id").val();

		typeVar = form.find('#id_type').val();
		commentVar = form.find('#id_comment').val();

		// This part for Recuring.
		startTimeHourRecuringVar = form.find('#id_start_time_hour_recuring').val();
		startTimeMinRecuringVar = form.find('#id_start_time_min_recuring').val();
		endTimeHourRecuringVar = form.find('#id_end_time_hour_recuring').val();
		endTimeMinRecuringVar = form.find('#id_end_time_min_recuring').val();

		checkbox_dayVar = schedule_getselected(form);

		startdayyearSingleVar = form.find('#id_start_day_year_single').val();
		startdaymonthSingleVar = form.find('#id_start_day_month_single').val();
		startdaydaySingleVar = form.find('#id_start_day_day_single').val();
		starttimehourSingleVar = form.find('#id_start_time_hour_single').val();
		starttimeminSingleVar = form.find('#id_start_time_min_single').val();

		enddayyearSingleVar = form.find('#id_end_day_year_single').val();
		enddaymonthSingleVar = form.find('#id_end_day_month_single').val();
		enddaydaySingleVar = form.find('#id_end_day_day_single').val();
		endtimehourSingleVar = form.find('#id_end_time_hour_single').val();
		endtimeminSingleVar = form.find('#id_end_time_min_single').val();

		nameexistedVar = form.find('#id_nameexisted').val();

		var data = {
				id: id,
				name: nameVar,
				type: typeVar,
				comment : commentVar,
				start_day_year_single: startdayyearSingleVar,
				start_day_month_single: startdaymonthSingleVar,
				start_day_day_single: startdaydaySingleVar,
				start_time_hour_single: starttimehourSingleVar,
				start_time_min_single: starttimeminSingleVar,
				end_day_year_single: enddayyearSingleVar,
				end_day_month_single: enddaymonthSingleVar,
				end_day_day_single: enddaydaySingleVar,
				end_time_hour_single: endtimehourSingleVar,
				end_time_min_single: endtimeminSingleVar,
				start_time_hour_recuring: startTimeHourRecuringVar,
				start_time_min_recuring: startTimeMinRecuringVar,
				end_time_hour_recuring: endTimeHourRecuringVar,
				end_time_min_recuring: endTimeMinRecuringVar,
				checkbox_temp: checkbox_dayVar,
				nameexisted: nameexistedVar
		};

		return data;
	}

	// this function add schedule
	function schedule_add(data)
	{
		// data = get_data();
		url = "/schedule_add/";
		$.post(url, data,
				function(result)
				{
					show_info(result);
				});
	}

	function set_inner_form(form, i)
	{
		if (i == 1)
		{
			form.find(".recuring").hide();
			form.find(".single").show();
		}

		else
		{
			form.find(".single").hide();
			form.find(".recuring").show();
		}
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
		$("#id_prev").click(nav_list.go_prev);
		$("#id_next").click(nav_list.go_next);
		utils.bind_hover($("#id_add,#id_find"));
		utils.init_alert_dialog("#dialog-message");

		utils.init_confirm_delete("#confirm-delete");

		nav_list.config.list_url = list_url;
		nav_list.config.list_func = init_list;
		nav_list.init();
	}

	function init_calendar(form)
	{
		start_calendar(form);
		end_calendar(form);

		//set the time today for cal
		var currentTime = new Date();

		$("#id_start_day_year_single").val(currentTime.getFullYear());
		$("#id_start_day_month_single").val(currentTime.getMonth() + 1);
		$("#id_start_day_day_single").val(currentTime.getDate());

		$("#start_datetime").val(currentTime);

		$("#id_end_day_year_single").val(currentTime.getFullYear());
		$("#id_end_day_month_single").val(currentTime.getMonth() + 1);
		$("#id_end_day_day_single").val(currentTime.getDate());

		$('#end_datetime').val(currentTime);
	}

	function start_calendar(form)
	{
		startdayyearSingleVar = form.find('#id_start_day_year_single').val();
		startdaymonthSingleVar = form.find('#id_start_day_month_single').val();
		startdaydaySingleVar = form.find('#id_start_day_day_single').val();

		s = startdaymonthSingleVar + "/" + startdaydaySingleVar + "/"
				+ startdayyearSingleVar;
		form.find("#start_datetime").val(s);

		var start_Opts = {
				showOn: "button",
				buttonImage: '../media/css/img/SpriteImage/16/0255.png',
				constrainInput: true,
				showOtherMonths: true,
				buttonImageOnly: true,
				showButtonPanel: true,
				onSelect: function(date)
				{
					var date = $(this).datepicker('getDate');

					var day1 = $(this).datepicker('getDate').getDate();
					var month1 = $(this).datepicker('getDate').getMonth() + 1;
					var year1 = $(this).datepicker('getDate').getFullYear();

					form.find("#id_start_day_year_single").val(year1);
					form.find("#id_start_day_month_single").val(month1);
					form.find("#id_start_day_day_single").val(day1);
				}
		};

		form.find("#start_datetime").datepicker(start_Opts);
	}

	function end_calendar(form)
	{
		enddayyearSingleVar = form.find('#id_end_day_year_single').val();
		enddaymonthSingleVar = form.find('#id_end_day_month_single').val();
		enddaydaySingleVar = form.find('#id_end_day_day_single').val();

		e = enddaymonthSingleVar + "/" + enddaydaySingleVar + "/"
				+ enddayyearSingleVar;
		form.find("#end_datetime").val(e);

		var end_Opts = {
				showOn: "button",
				buttonImage: '../media/css/img/SpriteImage/16/0255.png',
				showOtherMonths: true,
				constrainInput: true,
				buttonImageOnly: true,
				showButtonPanel: true,
				onSelect: function(date)
				{
					var date = $(this).datepicker('getDate');
					var day1 = $(this).datepicker('getDate').getDate();
					var month1 = $(this).datepicker('getDate').getMonth() + 1;
					var year1 = $(this).datepicker('getDate').getFullYear();

					form.find('#id_end_day_year_single').val(year1);
					form.find('#id_end_day_month_single').val(month1);
					form.find('#id_end_day_day_single').val(day1);
				}
		};

		form.find("#end_datetime").datepicker(end_Opts);
	}

	function load()
	{
		return menu.get('/schedule_list/', init);
	}

	return {
		load:load,
		list:list,
		list_temp: list_temp,
		init_form:init_form,
		init_edit_form:init_edit_form,
		save_inner_form:save_inner_form,
		get_ui_opt:get_ui_opt,
		get_data:get_data,
		save_temp_url : save_temp_url,
		edit_temp_url : edit_temp_url
	};
}());
var defservices = (function()
{
	var save_url = "/defservices/save/";
	var delete_url = "/defservices/delete/";
	var list_url = "/defservices/list/";
	var info_url = "/defservices/info/";
	var list = {
			panel: '/defservices/list/panel/',
			select: '/defservices/list/select/',
			panel_custom1: '/defservices/list/panel/custom1/',
			select_custom1: '/defservices/list/select/custom1/'
	}
	var icmp_types_url = "/defservices/icmp/types/";
	var icmp_codes_url = "/defservices/icmp/codes/";
	var popup_dialog_opt = null;
	var popup_icmp_types_opt = null;
	var drag_opt = null;
	var drop_scope = 'defservices';
	var list_changed = false;

	function init_ui_opt()
	{
		popup_dialog_opt = {
				autoOpen: false,
				width: 320,
				resizable: false,
				draggable: false,
				modal: false,
				stack: false,
				zIndex: 1000
		};
		popup_icmp_types_opt = {
				autoOpen: false,
				width: 300,
				height: 400,
				modal: false
		}
		drag_opt = {
				revert: true,
				snap: false,
				revertDuration: 0,
				zIndex: 1001,
				appendTo: 'body',
				helper: 'clone',
				scope: drop_scope,
				drag: utils.add_drag_css,
				stop: utils.remove_drag_css
		};
	}

	function get_ui_opt()
	{
		init_ui_opt();
		return {
			popup_dialog_opt: popup_dialog_opt,
			popup_icmp_types_opt: popup_icmp_types_opt,
			drag_opt: drag_opt
		};
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
					var nextform = $("#save-form" + sep + data.scope + _prefix);
					utils.set_data(nextform.find("#members"), 'members', []);
					nextform.find("#id_type").change(show_inner_form);
					nextform.find(".save_button.save").click(function()
							{
								if (data.scope == '' || data.level > 1)
								{
									var o = {
											level: data.level,
											scope: data.scope
									};
									return save_inner_form(o);
								}

								else if (data.level == 1)
									return data.func_save();

								return false;
							});
					nextform.find(".save_button.cancel").click(function()
							{
								utils.cancel_dialog(data.level, "#dialog-add" + sep + data.scope);
							});
					if (jQuery.isFunction(data.func_show_all) && jQuery.isFunction(data.func_show_add))
					{
						nextform.find(".img_folder").click(data.func_show_all);
						nextform.find(".img_add").click(data.func_show_add);
						nextform.find("#members_dropzone").droppable({
							hoverClass: 'ui-state-active',
							scope: drop_scope,
							drop: function(evt, ui)
							{
								var o = ui.draggable;
								add_dragged_item(nextform, o);
							}
						});
					}
					$("#dialog-add" + sep + data.scope + _prefix).dialog(get_ui_opt().popup_dialog_opt);
					$("#dialog-edit" + sep + data.scope + _prefix).dialog(get_ui_opt().popup_dialog_opt);
					nextform.find(".icmptype_link").click(show_icmp_type);
					$("#dialog-icmptype" + sep + data.scope + _prefix).dialog(get_ui_opt().popup_icmp_types_opt);
					set_inner_form(nextform, 1);
					utils.bind_hover(nextform.find(".save_button"));
					$("#dialog-edit" + sep + data.scope + data.prefix).dialog('close');
					$("#dialog-add" + sep + data.scope + data.prefix).dialog('open');
				});
	}

	function init_edit_form(data)
	{
		var offset = $(data.self).offset();
		var position = [offset.left, utils.get_elm_top(offset.top)];
		var _prefix = '_' + data.level;
		var sep = (data.scope == '' ? '' : '-');
		var scopeq = (data.scope == '' ? '' : '&scope=' + data.scope);
		utils.remove_dialog("#dialog-edit" + data.edit + sep + data.scope + _prefix);
		$("#dialog_body" + sep + data.scope + data.prefix).empty();
		$("#dialog-add" + sep + data.scope + data.prefix).dialog('close');
		var url = (data.url == null ? save_url : data.url);
		$("#dialog-edit" + sep + data.scope + data.prefix).dialog('option', 'position', position);
		$("#dialog_edit_body" + sep + data.scope + data.prefix).load(url + "?id=" + data.id + "&level=" + data.level + scopeq, null,
				function()
				{
					var nextform = $("#save-form" + sep + data.scope + _prefix);
					nextform.find("#id_type").change(show_inner_form);
					nextform.find(".save_button.save").click(function()
							{
								return update_inner_form(data);
							});
					nextform.find(".save_button.cancel").click(function()
						{
							utils.cancel_dialog(data.level, "#dialog-edit" + sep + data.scope);
							update_list();
						});
					if (jQuery.isFunction(data.func_show_all) && jQuery.isFunction(data.func_show_add))
					{
						nextform.find(".img_folder").click(data.func_show_all);
						nextform.find(".img_add").click(data.func_show_add);
						nextform.find("#members_dropzone").droppable({
							hoverClass: 'ui-state-active',
							scope: drop_scope,
							drop: function(evt, ui)
							{
								var o = ui.draggable;
								add_dragged_item(nextform, o);
							}
						});
					}
					$("#dialog-add" + sep + data.scope + _prefix).dialog(get_ui_opt().popup_dialog_opt);
					$("#dialog-edit" + sep + data.scope + _prefix).dialog(get_ui_opt().popup_dialog_opt);
					nextform.find(".icmptype_link").click(show_icmp_type);
					$("#dialog-icmptype" + sep + data.scope + _prefix).dialog(get_ui_opt().popup_icmp_types_opt);
					set_items(nextform);
					utils.bind_hover(nextform.find(".save_button"));
					$("#dialog-add" + sep + data.scope + data.prefix).dialog('close');
					$("#dialog-edit" + sep + data.scope + data.prefix).dialog('open');
				});
	}

	function show_form()
	{
		$("#left_box").load(save_url, null,
				function()
				{
					var form = $("#save-form");
					utils.set_data(form.find("#members"), 'members', []);
					$("#left_box").css('width', '300px');
					$(".save_button.save").click(function()
							{
								return func_save();
							});
					$(".save_button.cancel,.form_title div.close").click(utils.cancel_form);
					$("#id_type").change(show_inner_form);
					$(".img_folder").click(show_all);
					$(".img_add").click(show_add);
					$("#members_dropzone").droppable({
						hoverClass: 'ui-state-active',
						scope: drop_scope,
						drop: function(evt, ui)
						{
							var o = ui.draggable;
							add_dragged_item(form, o);
						}
					});
					$("#dialog-add").dialog(popup_dialog_opt);
					$("#dialog-edit").dialog(popup_dialog_opt);
					$(".icmptype_link").click(show_icmp_type);
					$("#dialog-icmptype").dialog(popup_icmp_types_opt);
					utils.bind_hover($(".save_button,.form_title div.close"));
					set_inner_form(form, 1);
					$("#left_box").show();
				});

		return false;
	}

	function show_inner_form()
	{
		var form = utils.get_parent(this, 2);
		var val = $(this).val();
		var _val = parseInt(val, 10);
		set_inner_form(form, _val);
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
		$("#left_box").load(save_url + "?id=" + arg, null,
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
					$(".img_folder").click(show_all);
					$(".img_add").click(show_add);
					$("#members_dropzone").droppable({
						hoverClass: 'ui-state-active',
						scope: drop_scope,
						drop: function(evt, ui)
						{
							var o = ui.draggable;
							add_dragged_item($("#save-form"), o);
						}
					});
					$("#dialog-add").dialog(popup_dialog_opt);
					$("#dialog-edit").dialog(popup_dialog_opt);
					$(".icmptype_link").click(show_icmp_type);
					$("#dialog-icmptype").dialog(get_ui_opt().popup_icmp_types_opt);
					set_items($("#save-form"));
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
		list_form.save(o);
		update_list();
		return false;
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
		list_form.save(o);
		update_list();
		return false;
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
		edit_helper({self: self, clone: 1});
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

	function save_inner_form(o)
	{
		var i = o.level - 1;
		var sep = (o.scope == '' ? '' :'-');
		var prefix = (o.level < 1 ? '' : '_' + o.level);
		var _prefix = (i < 1 ? '' : '_' + i);
		var currform = $("#save-form" + sep + o.scope + prefix);
		var prevform = $("#save-form" + sep + o.scope + _prefix);
		var data = get_data(currform, "", "");
		data['level'] = o.level;
		$.post(save_url, data,
				function(result)
				{
					if (result.success == 1)
					{
						if (o.level == 1 && o.scope != '')
							o.func_add(result.id, result.name);

						else
							add_member(prevform, result.id, result.name);

						utils.cancel_dialog(o.level, "#dialog-add" + sep + o.scope);
					}

					else if (result.error == 1)
					{
						err = utils.get_errors(result.errors);
						utils.show_dialog(1, err);
					}

					else
					{
						utils.show_dialog(2, result);
					}
				});
		return false;
	}

	function update_inner_form(o)
	{
		var i = o.level - 1;
		var sep = (o.scope == '' ? '' : '-');
		var prefix = (o.level < 1 ? '' : '_' + o.level);
		var _prefix = (i < 1 ? '' : '_' + i);
		var currform = $("#save-form" + sep + o.scope + prefix);
		var prevform = $("#save-form" + sep + o.scope + _prefix);
		var data = get_data(currform, o.id, "update");
		data['level'] = o.level;
		$.post(save_url, data,
				function(result)
				{
					if (result.success == 1)
					{
						if (o.level == 1 && o.scope != '')
							o.func_update(result.id, result.name, o.self);

						else
						{
							list_changed = true;
							update_member(prevform, result.id, result.name, o.self);
						}

						utils.cancel_dialog(o.level, "#dialog-edit" + sep + o.scope);
					}

					else if (result.error == 1)
					{
						err = utils.get_errors(result.errors);
						utils.show_dialog(1, err);
					}

					else
					{
						utils.show_dialog(2, result);
					}
				});
		return false;
	}

	function get_data(form, arg, savetype)
	{
		var val = form.find("#id_type").val();
		var data = {
				name: form.find("#id_name").val(),
				type: val,
				comment: form.find("#id_comment").val(),
				id: arg,
				save_type: savetype
		}
		if (val == '1' || val == '2')
		{
			var iform = form.find(".defservices_form" + val);
			data['dstport'] = iform.find("#id_dstport").val();
			data['srcport'] = iform.find("#id_srcport").val();
		}

		else if (val == '3')
		{
			data['icmptype'] = form.find("#id_icmptype").val();
			data['code'] = form.find("#id_code").val();
		}

		else if (val == '4')
		{
			data['protocol'] = form.find("#id_protocol").val();
		}

		else if (val == '5')
		{
			arr = form.find("#members").data('members');
			data['members'] = arr.join(',');
		}

		return data;
	}

	function set_inner_form(form, i)
	{
		for (var j = 1; j < 6; j++)
		{
			if (j == i)
				form.find(".defservices_form" + i).show();

			else
				form.find(".defservices_form" + j).hide();
		}
	}

	function hide_panel()
	{
		var isopen = $("#list-panel").dialog('isOpen');
		if (isopen)
			$("#list-panel").dialog('close');

		$("#panel_tooltip").hide();
		$("#leftcolumn").show();
	}

	function show_all()
	{
		var isopen = $("#list-panel").dialog('isOpen');
		if (isopen)
		{
			$("#list-panel").dialog('close');
			return false;
		}

		$("#leftcolumn").hide();
		var form = utils.get_parent(this, 4);
		$("#list_body").load(list.panel, null,
				function()
				{
					$(".add_button").click(function()
							{
								add_members(form);
							});
					$(".drag_zone").draggable(drag_opt);
					$("#id_filters").change(filter_list);
					$("#id_filter_text").keyup(function()
							{
								utils.countdown_filter(filter_list);
							});
					$("#id_filter_text").keydown(utils.stop_filter_timer);
					init_tooltip();
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
		$("#panel_body").load(list.select + s, null,
				function()
				{
					$(".drag_zone").draggable(drag_opt);
					init_tooltip();
				});
	}
	
	function init_tooltip()
	{
		utils.init_panel_tooltip(info_url);
	}

	function show_add()
	{
		var o = get_level_data(this);
		var self = this;
		var data = {
				self: self,
				level: o.level,
				prefix: o.prefix,
				scope: '',
				func_show_all: show_all,
				func_show_add: show_add
		};
		init_form(data);
		return false;
	}

	function show_icmp_type()
	{
		var currform = utils.get_parent(this, 2);
		var form_id = currform.attr("id");
		var level = utils.get_form_level(form_id);
		var scope = utils.get_form_scope(form_id);
		var sep = (scope == '' ? '' : '-');
		var prefix = utils.get_prefix(form_id);
		var tprmlevel = (level < 1 ? "" : "?level=" + level);
		var cprmlevel = (level < 1 ? "" : "&level=" + level);
		$("#dialog_icmptype" + sep + scope + prefix).load(icmp_types_url + tprmlevel, null,
				function()
				{
					$("#tb_icmp_types" + prefix + " tbody").selectable({
						selected: function(evt, ui)
						{
							var uisel = $(ui.selected);
							uisel.addClass("ui-priority-primary ui-state-active");
							var type = uisel.find('.icmp_type').text();
							$("#codes" + prefix).load(icmp_codes_url + "?type=" + type + cprmlevel, null,
									function()
									{
										$("#tb_icmp_codes" + prefix + " tbody").selectable({
											selected: function(evt, ui)
											{
												$(ui.selected).addClass("ui-priority-primary ui-state-active")
											},
											unselected: function(evt, ui)
											{
												$(ui.unselected).removeClass("ui-priority-primary ui-state-active");
											}
										});
									});
						},
						unselected: function(evt, ui)
						{
							$(ui.unselected).removeClass("ui-priority-primary ui-state-active");
						}
					});
					$("#icmp_btn" + prefix).find(".save_button.ok").click(function()
							{
								var t = $("#tb_icmp_types" + prefix + " tbody").find('.ui-selected td.icmp_type').text();
								var c = $("#tb_icmp_codes" + prefix + " tbody").find('.ui-selected td.icmp_code').text();
								t = (t == null ? "" : t);
								c = (c == null ? "" : c);
								currform.find("#id_icmptype").val(t);
								currform.find("#id_code").val(c);
								$("#dialog-icmptype" + sep + scope + prefix).dialog('close');
							});
					$("#icmp_btn" + prefix).find(".save_button.cancel").click(function()
							{
								$("#dialog-icmptype" + prefix).dialog('close');
							});
					utils.bind_hover($("#icmp_btn" + prefix).find(".save_button"));
				});
		$("#dialog-icmptype" + sep + scope + prefix).dialog('open');
		return false;
	}

	function add_dragged_item(form, o)
	{
		var item = $(o);
		var name = item.html();
		var id = item.parent().attr("id");
		add_member(form, id, name);
	}

	function add_member(form, id, name)
	{
		var _id = parseInt(id, 10);
		var arr = form.find("#members").data('members');
		if (!utils.item_exist(_id, arr))
		{
			arr.push(_id);
			utils.set_data(form.find("#members"), 'members', arr);
			var data = {
					id_prefix: 'item_',
					id: _id,
					click: 'defservices.remove_member(this)',
					editclick: 'defservices.edit_member(this)',
					name: name
			};
			var h = new EJS({url: '/media/tpl/list_item.ejs'}).render(data);
			form.find("#members").append(h);
		}

		set_alt_css(form, "#members");
	}

	function add_members(form)
	{
		$("input[name=chklist]:checked").each(
				function()
				{
					var o = $(this);
					var id = o.parent().attr("id");
					var name = o.next().html();
					add_member(form, id, name);
				});
	}

	function remove_member(o)
	{
		var item = $(o);
		var id = item.parent().attr("id");
		var _id = utils.get_itemid(id);
		var form = utils.get_parent(item, 5);
		var arr = form.find("#members").data('members');
		var i = $.inArray(_id, arr);
		if (i >= 0)
		{
			arr.splice(i, 1);
			utils.set_data(form.find("#members"), 'members', arr);
		}

		form.find("#" + id).remove();
		set_alt_css(form, "#members");
		return false;
	}

	function edit_member(obj)
	{
		var item = $(obj);
		var id = item.parent().attr("id");
		var _id = utils.get_itemid(id);
		var form = utils.get_parent(item, 5);
		var o = get_form_level_data(form);
		var self = item;
		var data = {
				self: self,
				id: _id,
				level: o.level,
				prefix: o.prefix,
				scope: o.scope,
				func_show_all: show_all,
				func_show_add: show_add
		};
		init_edit_form(data);
		return false;
	}

	function update_member(form, id, name, self)
	{
		$(self).next().html(name);
		var isopen = $("#list-panel").dialog('isOpen');
		if (isopen)
			filter_list();
	}

	function get_level_data(self)
	{
		var currform = utils.get_parent(self, 4);
		return get_form_level_data(currform);
	}

	function get_form_level_data(form)
	{
		var form_id = form.attr("id");
		var level = utils.get_next_form_level(form_id);
		var prefix = utils.get_prefix(form_id);
		var scope = utils.get_form_scope(form_id);
		return {
				level: level,
				prefix: prefix,
				scope: scope
		};
	}

	function set_items(form)
	{
		var val = form.find("#id_type").val();
		if (val != '5')
			return;

		arr = [];
		$("#save-form").find("#members > div").each(
				function()
				{
					var id = $(this).attr("id");
					var _id = utils.get_itemid(id);
					if (!utils.item_exist(_id, arr))
					{
						arr.push(_id);
					}
				});
		utils.set_data(form.find("#members"), 'members', arr);
		set_alt_css(form, "#members");
	}

	function set_alt_css(form, members)
	{
		form.find(members + " > div").removeClass("ui-state-default");
		form.find(members + " > div").removeClass("ui-state-hover");
		form.find(members + " > div:odd").addClass("ui-state-default");
		form.find(members + " > div:even").addClass("ui-state-hover");
	}

	function update_list()
	{
		if (list_changed)
		{
			list_changed = false;
			nav_list.show_list();
		}
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
		$("#id_display,#id_selection,#id_find").change(nav_list.show_list);
		$("#id_query").keypress(nav_list.query_keypress);
		$("#id_query").keyup(nav_list.query_keyup);
		utils.remove_dialog("#dialog-add");
		utils.remove_dialog("#dialog-edit");
		utils.init_alert_dialog("#dialog-message");
		utils.init_confirm_delete("#confirm-delete");
		utils.init_list_panel("#list-panel", hide_panel);
		utils.bind_hover($("#id_add,#id_find"));
		nav_list.config.list_url = list_url;
		nav_list.config.list_func = init_list;
		nav_list.init();
	}

	function load()
	{
		return menu.get('/defservices/', init);
	}

	return {
		load:load,
		list:list,
		add_members:add_members,
		edit_member:edit_member,
		remove_member:remove_member,
		get_level_data:get_level_data,
		init_form:init_form,
		init_edit_form:init_edit_form,
		init_tooltip:init_tooltip,
		save_inner_form:save_inner_form,
		get_ui_opt:get_ui_opt,
		drop_scope:drop_scope
	};
}());
var defuser = (function()
{
	var save_url = "/defuser/save/";
	var delete_url = "/defuser/delete/";
	var list_url = "/defuser/list/";
	var list = {
			panel: '/defuser/list/panel/',
			select: '/defuser/list/select/'
	};
	
	var list_temp = {
			panel: '/defuser/list/panel/temp/',
			select: '/defuser/list/select/temp/'
	};
	
	var popup_dialog_opt = null;
	var drag_opt = null;
	var drop_scope = 'defuser';
	var list_changed = false;

	function init_ui_opt()
	{
		popup_dialog_opt = {
				autoOpen: false,
				width: 320,
				resizable: false,
				draggable: false,
				modal: false,
				stack: false,
				zIndex: 1000
		};
		drag_opt = {
				revert: true,
				snap: false,
				revertDuration: 0,
				zIndex: 1001,
				appendTo: 'body',
				helper: 'clone',
				scope: drop_scope,
				drag: utils.add_drag_css,
				stop: utils.remove_drag_css
		};
	}

	function get_ui_opt()
	{
		init_ui_opt();
		return {
			popup_dialog_opt: popup_dialog_opt,
			drag_opt: drag_opt
		};
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
					var nextform = $("#save-form" + sep + data.scope + _prefix);
					utils.set_data(nextform.find("#members"), 'members', []);
					nextform.find("#id_type").change(show_inner_form);
					nextform.find(".save_button.save").click(function()
							{
								if (data.scope == '' || data.level > 1)
								{
									var o = {
											level: data.level,
											scope: data.scope
									};
									return save_inner_form(o);
								}

								else if (data.level == 1)
									return data.func_save();

								return false;
							});
					nextform.find(".save_button.cancel").click(function()
							{
								utils.cancel_dialog(data.level, "#dialog-add" + sep + data.scope);
								update_list();
							});
					if (jQuery.isFunction(data.func_show_all) && jQuery.isFunction(data.func_show_add))
					{
						nextform.find(".img_folder").click(data.func_show_all);
						nextform.find(".img_add").click(data.func_show_add);
						nextform.find("#members_dropzone").droppable({
							hoverClass: 'ui-state-active',
							scope: drop_scope,
							drop: function(evt, ui)
							{
								var o = ui.draggable;
								add_dragged_item(nextform, o);
							}
						});
					}
					$("#dialog-add" + sep + data.scope + _prefix).dialog(get_ui_opt().popup_dialog_opt);
					$("#dialog-edit" + sep + data.scope + _prefix).dialog(get_ui_opt().popup_dialog_opt);
					set_inner_form(nextform, 1);
					utils.bind_hover(nextform.find(".save_button"));
					$("#dialog-edit" + sep + data.scope + data.prefix).dialog('close');
					$("#dialog-add" + sep + data.scope + data.prefix).dialog('open');
				});
	}

	function init_edit_form(data)
	{
		var offset = $(data.self).offset();
		var position = [offset.left, utils.get_elm_top(offset.top)];
		var _prefix = '_' + data.level;
		var sep = (data.scope == '' ? '' : '-');
		var scopeq = (data.scope == '' ? '' : '&scope=' + data.scope);
		utils.remove_dialog("#dialog-edit" + sep + data.scope + _prefix);
		$("#dialog_body" + sep + data.scope + data.prefix).empty();
		$("#dialog-add" + sep + data.scope + data.prefix).dialog('close');
		var url = (data.url == null ? save_url : data.url);
		$("#dialog-edit" + sep + data.scope + data.prefix).dialog('option', 'position', position);
		$("#dialog_edit_body" + sep + data.scope + data.prefix).load(url + "?id=" + data.id + "&level=" + data.level + scopeq, null,
				function()
				{
					var nextform = $("#save-form" + sep + data.scope + _prefix);
					nextform.find("#id_type").change(show_inner_form);
					nextform.find(".save_button.save").click(function()
							{
								return update_inner_form(data);
							});
					nextform.find(".save_button.cancel").click(function()
							{
								utils.cancel_dialog(data.level, "#dialog-edit" + sep + data.scope);
								update_list();
							});
					if (jQuery.isFunction(data.func_show_all) && jQuery.isFunction(data.func_show_add))
					{
						nextform.find(".img_folder").click(data.func_show_all);
						nextform.find(".img_add").click(data.func_show_add);
						nextform.find("#members_dropzone").droppable({
							hoverClass: 'ui-state-active',
							scope: drop_scope,
							drop: function(evt, ui)
							{
								var o = ui.draggable;
								add_dragged_item(nextform, o);
							}
						});
					}
					nextform.find("#id_password").val("**********");
					$("#dialog-add" + sep + data.scope + _prefix).dialog(get_ui_opt().popup_dialog_opt);
					$("#dialog-edit" + sep + data.scope + _prefix).dialog(get_ui_opt().popup_dialog_opt);
					set_items(nextform);
					utils.bind_hover(nextform.find(".save_button"));
					$("#dialog-add" + sep + data.scope + data.prefix).dialog('close');
					$("#dialog-edit" + sep + data.scope + data.prefix).dialog('open');
				});
	}

	function show_form()
	{
		$("#left_box").load(save_url, null,
				function()
				{
					var form = $("#save-form");
					utils.set_data(form.find("#members"), 'members', []);
					$("#left_box").css('width', '300px');
					$(".save_button.save").click(func_save);
					$(".save_button.cancel,.form_title div.close").click(cancel_form);
					$("#id_type").change(show_inner_form);
					$(".img_folder").click(show_all);
					$(".img_add").click(show_add);
					$("#members_dropzone").droppable({
						hoverClass: 'ui-state-active',
						scope: drop_scope,
						drop: function(evt, ui)
						{
							var o = ui.draggable;
							add_dragged_item(form, o);
						}
					});
					$("#dialog-add").dialog(popup_dialog_opt);
					$("#dialog-edit").dialog(popup_dialog_opt);
					utils.bind_hover($(".save_button,.form_title div.close"));
					set_inner_form(form, 1);
					$("#left_box").show();
				});

		return false;
	}

	function show_inner_form()
	{
		var form = utils.get_parent(this, 2);
		var val = $(this).val();
		var _val = parseInt(val, 10);
		set_inner_form(form, _val);
	}

	function save_success()
	{
		utils.cancel_form();
		hide_panel();
		nav_list.show_list();
	}

	function cancel_form()
	{
		utils.cancel_form();
		update_list();
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
					$(".save_button.cancel,.form_title div.close").click(cancel_form);
					$(".img_folder").click(show_all);
					$(".img_add").click(show_add);
					$("#members_dropzone").droppable({
						hoverClass: 'ui-state-active',
						scope: drop_scope,
						drop: function(evt, ui)
						{
							var o = ui.draggable;
							add_dragged_item($("#save-form"), o);
						}
					});
					$("#id_password").val("**********");
					$("#dialog-add").dialog(popup_dialog_opt);
					$("#dialog-edit").dialog(popup_dialog_opt);
					set_items($("#save-form"));
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
		list_form.save(o);
		update_list();
		return false;
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
		list_form.save(o);
		update_list();
		return false;
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
		edit_helper({self: self, clone: 1});
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

	function save_inner_form(o)
	{
		var i = o.level - 1;
		var sep = (o.scope == '' ? '' : '-');
		var prefix = (o.level < 1 ? '' : '_' + o.level);
		var _prefix = (i < 1 ? '' : '_' + i);
		var currform = $("#save-form" + sep + o.scope + prefix);
		var prevform = $("#save-form" + sep + o.scope + _prefix);
		var data = get_data(currform, "", "");
		data['level'] = o.level;
		$.post(save_url, data,
				function(result)
				{
					if (result.success == 1)
					{
						if (o.level == 1 && o.scope != '')
							o.func_add(result.id, result.name);

						else
							add_member(prevform, result.id, result.name);

						utils.cancel_dialog(o.level, "#dialog-add" + sep + o.scope);
					}

					else if (result.error == 1)
					{
						err = utils.get_errors(result.errors);
						utils.show_dialog(1, err);
					}

					else
					{
						utils.show_dialog(2, result);
					}
				});
		return false;
	}

	function update_inner_form(o)
	{
		var i = o.level - 1;
		var sep = (o.scope == '' ? '' : '-');
		var prefix = (o.level < 1 ? '' : '_' + o.level);
		var _prefix = (i < 1 ? '' : '_' + i);
		var currform = $("#save-form" + sep + o.scope + prefix);
		var prevform = $("#save-form" + sep + o.scope + _prefix);
		var data = get_data(currform, o.id, "update");
		data['level'] = o.level;
		$.post(save_url, data,
				function(result)
				{
					if (result.success == 1)
					{
						if (o.level == 1 && o.scope != '')
							o.func_update(result.id, result.name, o.self);

						else
						{
							list_changed = true;
							update_member(prevform, result.id, result.name, o.self);
						}

						utils.cancel_dialog(o.level, "#dialog-edit" + sep + o.scope);
					}

					else if (result.error == 1)
					{
						err = utils.get_errors(result.errors);
						utils.show_dialog(1, err);
					}

					else
					{
						utils.show_dialog(2, result);
					}
				});
		return false;
	}

	function get_data(form, arg, savetype)
	{
		var val = form.find("#id_type").val();
		var data = {
				name: form.find("#id_name").val(),
				type: val,
				accesstype: form.find("#id_accesstype").val(),
				comment: form.find("#id_comment").val(),
				id: arg,
				save_type: savetype
		}
		if (val == '1')
		{
			data['displayname'] = form.find("#id_displayname").val();
			data['password'] = form.find("#id_password").val();
			if (savetype === "")
				data['confirm_password'] = form.find("#id_confirm_password").val();
		}

		else if (val == '2')
		{
			arr = form.find("#members").data('members');
			data['members'] = arr.join(',');
		}

		return data;
	}

	function set_inner_form(form, i)
	{
		for (var j = 1; j < 3; j++)
		{
			if (j == i)
				form.find(".defuser_form" + i).show();

			else
				form.find(".defuser_form" + j).hide();
		}
	}

	function hide_panel()
	{
		var isopen = $("#list-panel").dialog('isOpen');
		if (isopen)
			$("#list-panel").dialog('close');

		$("#leftcolumn").show();
	}

	function show_all()
	{
		var isopen = $("#list-panel").dialog('isOpen');
		if (isopen)
		{
			$("#list-panel").dialog('close');
			return false;
		}

		$("#leftcolumn").hide();
		var form = utils.get_parent(this, 4);
		$("#list_body").load(list.panel, null,
				function()
				{
					$(".add_button").click(function()
							{
								add_members(form);
							});
					$(".drag_zone").draggable(drag_opt);
					$("#id_filters").change(filter_list);
					$("#id_filter_text").keyup(function()
							{
								utils.countdown_filter(filter_list);
							});
					$("#id_filter_text").keydown(utils.stop_filter_timer);
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
		$("#panel_body").load(list.select + s, null,
				function()
				{
					$(".drag_zone").draggable(drag_opt);
				});
	}

	function show_add()
	{
		var o = get_level_data(this);
		var self = this;
		var data = {
				self: self,
				level: o.level,
				prefix: o.prefix,
				scope: '',
				func_show_all: show_all,
				func_show_add: show_add
		};
		init_form(data);
		return false;
	}

	function add_dragged_item(form, o)
	{
		var item = $(o);
		var name = item.html();
		var id = item.parent().attr("id");
		add_member(form, id, name);
	}

	function add_member(form, id, name)
	{
		var _id = parseInt(id, 10);
		var arr = form.find("#members").data('members');
		if (!utils.item_exist(_id, arr))
		{
			arr.push(_id);
			utils.set_data(form.find("#members"), 'members', arr);
			var data = {
					id_prefix: 'item_',
					id: _id,
					click: 'defuser.remove_member(this)',
					editclick: 'defuser.edit_member(this)',
					name: name
			};
			var h = new EJS({url: '/media/tpl/list_item.ejs'}).render(data);
			form.find("#members").append(h);
		}

		set_alt_css(form, "#members");
	}

	function add_members(form)
	{
		$("input[name=chklist]:checked").each(
				function()
				{
					var o = $(this);
					var id = o.parent().attr("id");
					var name = o.next().html();
					add_member(form, id, name);
				});
	}

	function remove_member(o)
	{
		var item = $(o);
		var id = item.parent().attr("id");
		var _id = utils.get_itemid(id);
		var form = utils.get_parent(item, 5);
		var arr = form.find("#members").data('members');
		var i = $.inArray(_id, arr);
		if (i >= 0)
		{
			arr.splice(i, 1);
			utils.set_data(form.find("#members"), 'members', arr);
		}

		form.find("#" + id).remove();
		set_alt_css(form, "#members");
		return false;
	}

	function edit_member(obj)
	{
		var item = $(obj);
		var id = item.parent().attr("id");
		var _id = utils.get_itemid(id);
		var form = utils.get_parent(item, 5);
		var o = get_form_level_data(form);
		var self = item;
		var data = {
				self: self,
				id: _id,
				level: o.level,
				prefix: o.prefix,
				scope: o.scope,
				func_show_all: show_all,
				func_show_add: show_add
		};
		init_edit_form(data);
		return false;
	}

	function update_member(form, id, name, self)
	{
		$(self).next().html(name);
		var isopen = $("#list-panel").dialog('isOpen');
		if (isopen)
			filter_list();
	}

	function get_level_data(self)
	{
		var currform = utils.get_parent(self, 4);
		return get_form_level_data(currform);
	}

	function get_form_level_data(form)
	{
		var form_id = form.attr("id");
		var level = utils.get_next_form_level(form_id);
		var prefix = utils.get_prefix(form_id);
		var scope = utils.get_form_scope(form_id);
		return {
				level: level,
				prefix: prefix,
				scope: scope
		};
	}

	function set_items(form)
	{
		var val = form.find("#id_type").val();
		if (val != '2')
			return;

		arr = [];
		form.find("#members > div").each(
				function()
				{
					var id = $(this).attr("id");
					var _id = utils.get_itemid(id);
					if (!utils.item_exist(_id, arr))
					{
						arr.push(_id);
					}
				});
		utils.set_data(form.find("#members"), 'members', arr);
		set_alt_css(form, "#members");
	}

	function set_alt_css(form, members)
	{
		form.find(members + " > div").removeClass("ui-state-default");
		form.find(members + " > div").removeClass("ui-state-hover");
		form.find(members + " > div:odd").addClass("ui-state-default");
		form.find(members + " > div:even").addClass("ui-state-hover");
	}

	function update_list()
	{
		if (list_changed)
		{
			list_changed = false;
			nav_list.show_list();
		}
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
		$("#id_display,#id_selection,#id_find").change(nav_list.show_list);
		$("#id_query").keypress(nav_list.query_keypress);
		$("#id_query").keyup(nav_list.query_keyup);
		utils.remove_dialog("#dialog-add");
		utils.remove_dialog("#dialog-edit");
		utils.init_alert_dialog("#dialog-message");
		utils.init_confirm_delete("#confirm-delete");
		utils.init_list_panel("#list-panel", hide_panel);
		utils.bind_hover($("#id_add,#id_find"));
		nav_list.config.list_url = list_url;
		nav_list.config.list_func = init_list;
		nav_list.init();
	}

	function load()
	{
		return menu.get('/defuser/', init);
	}

	return {
		load:load,
		list:list,
		list_temp : list_temp,
		get_data:get_data,
		add_members:add_members,
		add_member:add_member,
		edit_member:edit_member,
		remove_member:remove_member,
		get_level_data:get_level_data,
		init_form:init_form,
		init_edit_form:init_edit_form,
		save_inner_form:save_inner_form,
		get_ui_opt:get_ui_opt
	};
}());
/*
 * @include "utils.js"
 * @include "stat.js"
 * @include "menu.js"
 */

var lic = (function()
{
	var page_url = "/lic/";
	var activate_url = "/lic/activate/";
	var deactivate_url = "/lic/deactivate/";
	
	function func_activate()
	{
		var data = {
			licensekey: $("#id_licensekey").val()
		};
		$.post(activate_url, data,
				function(result)
				{
					if (result.success == 1)
					{
						stat.show_status(0, result.msg);
						$("#info").html(result.contents);
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
				})
		return false;
	}
	
	function func_deactivate()
	{
		var id = $("#id_id").val();
		if (id == "")
			id = '0';
			
		var data = {
			licensekey: $("#id_licensekey").val(),
			id: id
		};
		$.post(deactivate_url, data,
				function(result)
				{
					if (result.success == 1)
					{
						stat.show_status(0, result.msg);
						$("#info").html(result.contents);
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
	
	function init()
	{
		$(".save_button.activate").click(func_activate);
		$(".save_button.deactivate").click(func_deactivate);
		utils.bind_hover($(".save_button"));
	}
	
	function load()
	{
		return menu.get(page_url, init);
	}
	
	return {
		load:load
	};
}());
var list_form = (function()
{
	function save(o)
	{
		$.post(o.url, o.data,
				function(result)
				{
					if (result == "success")
					{
						o.func_success();
					}
					
					else if (result.error == 1)
					{
						var err = utils.get_errors(result.errors);
						utils.show_dialog(1, err);
					}
					
					else
					{
						utils.show_dialog(2, result);
					}
				});
		return false;
	}
	
	return {
		save:save
	};
}());
/*
 * @include "utils.js"
 */

var log = (function()
{
	var log_url = "/log/";
	var init_url = "/log/init/";
	var run_url = "/log/run/";
	var log_files_url = "/log/files/";
	var log_timer;
	var log_interval = 1000;
	
	function stop_log_timer()
	{
		clearTimeout(log_timer);
	}
	
	function start_log_timer()
	{
		stop_log_timer();
		if ($("#id_pause").attr('checked') != 'checked')
			log_timer = setTimeout(check_log, log_interval);
	}
	
	function init_log()
	{
		stop_log_timer();
		var filter = $("#id_filter").val();
		filter = $.trim(filter);
		var autoscroll = ($("#id_autoscroll").attr('checked') == 'checked' ? true : false);
		var data = {
				type: $("#id_type").val(),
				file: $("#id_file").val(),
				filter: filter
		};
		$.post(init_url, data,
				function(result)
				{
					$("#id_content").html(result);
					if (autoscroll)
						$("#id_content").scrollTop($("#id_content")[0].scrollHeight);
						
					start_log_timer();
				});
	}
	
	function check_log()
	{
		var filter = $("#id_filter").val();
		filter = $.trim(filter);
		var autoscroll = ($("#id_autoscroll").attr('checked') == 'checked' ? true : false);
		var data = {
				type: $("#id_type").val(),
				file: $("#id_file").val(),
				filter: filter
		};
		$.post(run_url, data,
				function(result)
				{
					if (result != "failure" && result != "")
					{
						$("#id_content").append(result);
						if (autoscroll)
							$("#id_content").scrollTop($("#id_content")[0].scrollHeight);
					}
					
					start_log_timer();
				});
	}
	
	function cmd_keypress(evt)
	{
		if (evt.keyCode == '13')
		{
			evt.preventDefault();
			evt.stopPropagation();
			init_log();
		}
	}
	
	function toggle_pause()
	{
		if (this.checked)
			stop_log_timer();
			
		else
			check_log();
	}
	
	function get_files()
	{
		var v = $(this).val();
		$.get(log_files_url, {type: v},
				function(result)
				{
					$("#id_file").html(result);
					var f = $("#id_file").children().length;
					if (f == 1)
						init_log();
				});
	}
	
	function init()
	{
		$("#id_type").change(get_files);
		$("#id_file").change(init_log);
		$("#id_filter").keypress(cmd_keypress);
		$("#id_pause").click(toggle_pause);
		$("#id_pause").button();
		var f = $("#id_file").children().length;
		if (f == 1)
			init_log();
	}
	
	function load()
	{
		return menu.get(log_url, init);
	}
	
	return {
		load:load,
		run_url:run_url,
		stop_log_timer:stop_log_timer
	};
}());
/*
 * @include "utils.js"
 */

var menu = (function()
{
	function get(url, func, self)
	{
		utils.clear_dialogs();
		dashboard.stop_refresh_timer();
		log.stop_log_timer();
		$("#contentcolumn div.innertube").load(url, null, func);
		return false;
	}

	function menu_click()
	{
		$("#menu a").removeClass('menu_active');
		$(this).addClass('menu_active');
	}

	function init()
	{
		var accesstype = $("#id_accesstype_").val();
		$("#menu").accordion({autoHeight: false, animated: false, change: menu_change});
		$("#menu a").click(menu_click);
		if (accesstype == utils.accesstype.admin)
		{
			$("#menu_dashboard").next().hide();
			$("#menu_dashboard > a").addClass('menu_active');
			dashboard.load();
		}
		
		else
		{
			$("#menu_changepwd").next().hide();
			$("#menu_changepwd > a").addClass('menu_active');
			user.load();
		}
	}

	function load()
	{
		$("#leftcolumn div.innertube").load("/menu/", null, init);
	}

	function menu_change(evt, ui)
	{
		dashboard.stop_refresh_timer();
		log.stop_log_timer();
		patchupgrade.stop_log_timer();
		var h = $(ui.newHeader);
		var id = h.attr("id");
		if (id == 'menu_dashboard' || id == 'menu_logout' || id == 'menu_changepwd')
		{
			h.next().hide();
		}
	}

	return {
		load:load,
		get:get,
		init:init
	}
}());
var nat = (function()
{
	var tab_opt = {
		select: clear_tabs,
		load: init_content
	};
	var modules = null;
	
	function hide_panel()
	{
		var isopen = $("#list-panel").dialog('isOpen');
		if (isopen)
			$("#list-panel").dialog('close');

		$("#panel_tooltip").hide();
		$("#leftcolumn").show();
	}
	
	function clear_tabs(evt, ui)
	{
		hide_panel();
		$("#nat_tabs > div[id^='nat']").empty();
		utils.clear_dialogs();
	}
	
	function init_content(evt, ui)
	{
		var i = ui.index;
		modules[i]();
	}
	
	function init()
	{
		modules = [natpf.init, natmasq.init, natdnatsnat.init];
		$("#nat_tabs").tabs(tab_opt);
	}
	
	function load()
	{
		$("#nat_tabs").tabs('destroy');
		$("#nat_tabs").remove();
		return menu.get('/nat/', init);
	}
	
	return {
		load:load,
		hide_panel:hide_panel
	}
}());
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
var nav_list = (function()
{
	/**
	 * @public
	 */
	var config = {
			list_url: '',
			list_func: null
	};

	/**
	 * @public
	 * This function shows the list, and reset back the page number to 1.
	 */
	function show_list()
	{
		$("#id_display").data('pgnum', 1);
		update_list();
	}

	/**
	 * @public
	 * This function reloads the list by using the same navigation parameters such as the
	 * display size, current page no., and search parameters.
	 */
	function update_list()
	{
		var d = $("#id_display").val();
		var pgnum = $("#id_display").data('pgnum');
		var s = get_search_query();
		$("#right_box").load(config.list_url + "?pgnum=" + pgnum + "&pgsize=" + d + s, null,
				function()
				{
					init_navigate();
				});
	}

	/**
	 * @private
	 * This function navigate the list to the previous page.
	 */
	function go_prev()
	{
		var val = $("#id_pg").val();
		var arr = val.split(',');
		var d = $("#id_display").val();
		$("#id_display").data('pgnum', arr[2]);
		update_list();
	}

	/**
	 * @private
	 * This function navigate the list to the next page.
	 */
	function go_next()
	{
		var val = $("#id_pg").val();
		var arr = val.split(',');
		var d = $("#id_display").val();
		$("#id_display").data('pgnum', arr[3]);
		update_list();
	}

	/**
	 * @public
	 * This function handles the keypress event on the search textbox.
	 * It checks for <enter> key.
	 */
	function query_keypress(evt)
	{
		if (evt.keyCode == '13')
		{
			evt.preventDefault();
			evt.stopPropagation();
			utils.stop_filter_timer();
			show_list();
		}
	}

	/**
	 * @public
	 * This function handles the keyup event on the search textbox.
	 * It checks for <enter> key.
	 */
	function query_keyup(evt)
	{
		if (evt.keyCode != '13')
		{
			utils.countdown_filter(show_list);
		}
	}

	/**
	 * @public
	 * This function sets the item text,
	 * i.e 1 to 2 of 2
	 * @param arg The text.
	 */
	function set_item_msg(arg)
	{
		$(".item_display").text(arg);
	}

	/**
	 * @private
	 * This function initialize the navigation elements after the list has been loaded.
	 * The initialization includes :<br>
	 * 1. sets the page no. to 1<br>
	 * 2. enable/disable the next/prev buttons<br>
	 * 3. initialize the edit/delete/clone buttons
	 */
	function init_navigate()
	{
		$("#id_display").data('pgnum', 1);
		if ($.isFunction(config.list_func))
			config.list_func();

		var val = $("#id_pg").val();
		var arr = val.split(',');
		if (arr[0] == 'False')
		{
			set_disabled("#id_prev", 1, null);
		}

		else
		{
			set_disabled("#id_prev", 0, go_prev);
		}

		if (arr[1] == 'False')
		{
			set_disabled("#id_next", 1, null);
		}

		else
		{
			set_disabled("#id_next", 0, go_next);
		}

		set_item_msg(arr[4]);
		utils.bind_hover($(".list_button"));
	}

	/**
	 * @private
	 * This function enable/disable an element.
	 * @param id The element id.
	 * @param arg The parameter to enable (0) or disable (1) the element.
	 * @param handler The function to be attached to the click event.
	 */
	function set_disabled(id, arg, handler)
	{
		var o = $(id);
		o.unbind("click");
		if (arg == 1)
		{
			o.attr("disabled", "disabled");
			o.removeClass("hover");
			o.addClass("ui-state-disabled");
			o.unbind("mouseenter");
			o.unbind("mouseleave");
		}

		else
		{
			o.removeAttr("disabled");
			o.removeClass("ui-state-disabled");
			o.addClass("hover");
			o.click(handler);
			utils.bind_hover(o);
		}
	}

	/**
	 * @private
	 * This function returns the search query string based on the search parameters.
	 * @return The search query string.
	 */
	function get_search_query()
	{
		var id_selection = $("#id_selection");
		var search_by_qry = (id_selection[0] == null ? "" : "&find=" + id_selection.val());
		var keyword = $("#id_query").val();
		var s = (search_by_qry == '&find=0' && keyword == "" ? "" : search_by_qry + "&text=" + encodeURIComponent(keyword));
		return s;
	}

	function init()
	{
		init_navigate();
	}

	return {
		init:init,
		config:config,
		show_list:show_list,
		update_list:update_list,
		query_keypress:query_keypress,
		query_keyup:query_keyup,
		set_item_msg:set_item_msg
	};
}());
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
var netlb = (function()
{
	var save_url = "/netlb/save/";
	var delete_url = "/netlb/delete/";
	var list_url = "/netlb/list/";
	var load_url = "/netlb/loadbl/";
	var toggle_status_url = '/togglenetlb/';

	function show_form_bl()
	{
		$("#left_box").load(load_url,
				function(result)
				{
					$("#left_box").css('width', '280px');
					$("#left_box").html(result);
				});
	}

	function func_save()
	{
		var EnableBalance = 0;

		var url_save_blance = "/netlb/savelist/";
		var tmp = [];

		$("input[name=interface_balance]:checked").each(function()
				{
					var o = $(this);
					var id = o.attr("id");
					var arr = id.split('_');
					tmp.push(arr[1]);
				});

		listBL = tmp.join(',');

		data = {
			listBL: listBL
		}
		$.post(url_save_blance, data,
				function(result)
				{
					// $('#info').html(result);
					if (result == "success")
					{
						stat.show_status(0, "Net balancing was successfully updated.");
					}

					else
					{
						stat.show_status(1, result);
					}
				});
	}

	function show_form()
	{
		$("#left_box").load(save_url, null,
				function()
				{
					$("#left_box").css('width', '280px');
					$(".save_button.save").click(func_save);
					$(".save_button.cancel").click(cancel_form);
					$("#left_box").show();
				});

		return false;
	}

	function load()
	{
		return menu.get('/netlb/loadbl/', init);
	}

	function enable_lb()
	{
		var data = {
			value: 1,
			name: 'NetBL'
		};
		$.post(toggle_status_url, data,
				function(result)
				{
					if (result == "success")
					{
						$("#sw > .sw-off").removeClass('redicon');
						$("#sw > .sw-off").addClass('greyicon');
						$("#sw > .sw-on").removeClass('greyicon');
						$("#sw > .sw-on").addClass('greenicon');
					}
				});
	}

	function disable_lb()
	{
		var data = {
			value: 0,
			name: 'NetBL'
		};
		$.post(toggle_status_url, data,
				function(result)
				{
					if (result == "success")
					{
						$("#sw > .sw-on").removeClass('greenicon');
						$("#sw > .sw-on").addClass('greyicon');
						$("#sw > .sw-off").removeClass('greyicon');
						$("#sw > .sw-off").addClass('redicon');
					}
				});
	}

	function init()
	{
		$(".save_button.save").click(func_save);
		$("#sw > .sw-on").click(enable_lb);
		$("#sw > .sw-off").click(disable_lb);
		utils.bind_hover($(".save_button"));
	}

	return {
		load : load
	};
}());
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
/*
 * @include "defnet.js"
 */

var nettrusted = (function()
{
	var nettrusted_net = {
			save_url: "/nettrusted/net/save/",
			delete_url: "/nettrusted/net/delete/"
	};
	var drag_opt_1 = null;

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
	}

	function show_panel1()
	{
		$("#leftcolumn").hide();
		$("#list_body").load(defnet.list.panel, null,
				function()
				{
					$(".add_button").click(add_net);
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

	function hide_panel()
	{
		var isopen = $("#list-panel").dialog('isOpen');
		if (isopen)
			$("#list-panel").dialog('close');

		$("#panel_tooltip").hide();
		$("#leftcolumn").show();
	}

	function add_net_(id, name)
	{
		var arr_id = [id];
		var arr_name = [name];
		var data = get_nettrusted_data(arr_id);
		ajax_add_nettrusted(nettrusted_net.save_url, data, arr_id, arr_name, add_netlist);
	}

	function add_net()
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
		var data = get_nettrusted_data(arr_id);
		ajax_add_nettrusted(nettrusted_net.save_url, data, arr_id, arr_name, add_netlist);
	}

	function get_nettrusted_data(arr_id)
	{
		var arr = arr_id.join(',');
		var data = {
				data: arr
		};
		return data;
	}

	function ajax_add_nettrusted(save_url, data, arr_id, arr_name, func_add)
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

	function delete_net(o)
	{
		var item = $(o);
		var id = item.parent().attr("id");
		var _id = utils.get_itemid(id);
		var data = {
				netid: _id
		};
		ajax_delete_nettrusted(nettrusted_net.delete_url, data, id, "#netlist");
	}

	function ajax_delete_nettrusted(delete_url, data, id, parent_id)
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

	function add_dragged_net(o)
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
		ajax_add_nettrusted(nettrusted_net.save_url, data, arr_id, arr_name, add_netlist);
	}

	function add_netlist(arr_id, arr_name)
	{
		var n = arr_id.length;
		var o = $("#netlist");
		var data = null;
		var h = null;
		for (var i = 0; i < n; i++)
		{
			data = {
					id_prefix: 'item_',
					id: arr_id[i],
					click: 'nettrusted.delete_net(this)',
					editclick: 'nettrusted.edit_net(this)',
					name: arr_name[i]
			};
			h = new EJS({url: '/media/tpl/list_item.ejs'}).render(data);
			o.append(h);
		}

		utils.set_alt_css("#netlist");
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
				scope: 'netlist',
				func_update: update_net,
				func_show_all: show_all_1,
				func_show_add: show_add_1
		};
		defnet.init_edit_form(data);
		return false;
	}

	function save_to_net()
	{
		var o = {
				level: 1,
				scope: 'netlist',
				func_add: add_net_
		};
		return defnet.save_inner_form(o);
	}

	function update_net(id, name, self)
	{
		$(self).next().html(name);
		var isopen = $("#list-panel").dialog('isOpen');
		if (isopen)
			filter_list1();
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
				scope: 'netlist',
				func_save: save_to_net,
				func_show_all: show_all_1,
				func_show_add: show_add_1
		};
		show_add_init_helper(data);
		return false;
	}

	function show_add_1()
	{
		var self = this;
		var data = {
				self: self,
				scope: 'netlist',
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
		$("#dialog-add-netlist").dialog(defnet.get_ui_opt().popup_dialog_opt);
		$("#dialog-edit-netlist").dialog(defnet.get_ui_opt().popup_dialog_opt);
		var fs1 = $("fieldset.net");
		fs1.find(".img_folder").click(show_panel1);
		fs1.find(".img_add").click(show_add1);
		$("#netlist").droppable({
			hoverClass: 'ui-state-active',
			scope: defnet.drop_scope,
			drop: function(evt, ui)
			{
				var o = ui.draggable;
				add_dragged_net(o);
			}
		});
		utils.set_alt_css("#netlist");
	}

	function load()
	{
		return menu.get('/nettrusted/', init);
	}

	return {
		load:load,
		edit_net:edit_net,
		delete_net:delete_net
	}
}());
/*
 * @include "utils.js"
 */

var patch = (function()
{
	var page_url = "/patch/";
	var tab_opt = null;
	
	function init_ui_opt()
	{
		tab_opt = {
				load: init_content
		};
	}
	
	function init_content(evt, ui)
	{
		var i = ui.index;			
		if (i == 1)
			patchdowngrade.init();
	}
	
	function init()
	{
		init_ui_opt();
		$("#patch_tabs").tabs(tab_opt);
		patchupgrade.init();
	}
	
	function load()
	{
		return menu.get(page_url, init);
	}
	
	return {
		load:load
	}
}());
var patchdowngrade = (function()
{
	function init()
	{
		
	}
	
	return {
		init:init
	}
}());
/*
 * @include "utils.js"
 * @include "conf.js"
 */

var patchupgrade = (function()
{
	var list_url = "/patch/upgrade/list/";
	var details_url = "/patch/upgrade/details/";
	var confirm_upgrade_url = "/patch/upgrade/confirm/";
	var upgrade_begin_url = "/patch/upgrade/begin/";
	var upgrade_log_init_url = "/patch/upgrade/log/init/";
	var upgrade_log_run_url = "/patch/upgrade/log/run/";
	var upgrade_restartserver_url = "/patch/restartserver/";
	var checkserver_url = "/checkserver/";
	var popup_dialog_details_opt = null;
	var popup_dialog_upgrade_opt = null;
	var log_timer = null;
	var ping_timer = null;
	var log_interval = 1000;
	var ping_interval = 30000;
	
	function init_ui_opt()
	{
		popup_dialog_details_opt = {
			autoOpen: false,
			modal: true,
			width: 480,
	        buttons: {
	            OK: function() {
	                $(this).dialog("close");
	            }
	        }
		};
		popup_dialog_upgrade_opt = {
			autoOpen: false,
			modal: true,
			width: 600
		};
	}
	
	function init_cmd()
	{
		$("#id_showbeta").click(toggle_showbeta);
		$(".save_button.refresh").click(get_list);
	}
	
	function init_dialog()
	{
		$("#confirm-upgrade").dialog({
			autoOpen: false,
			modal: true
		});
		$("#dialog-details").dialog(popup_dialog_details_opt);
	}
	
	function init_list()
	{
		$(".list_button.upgrade").click(func_upgrade);
		$(".version_details").click(func_details);
		utils.bind_hover($(".list_button"));
	}
	
	function func_upgrade()
	{
		var version = $(this).parent().parent().find(".version_details").attr("title");
		utils.remove_dialog("#dialog-upgrade");
		$("#confirm_upgrade_body").load(confirm_upgrade_url + "?ver=" + version, null,
				function(result)
				{
					$("#id_here").click(conf.func_export);
					var cd = $("#confirm-upgrade");
					$("#dialog-upgrade").dialog(popup_dialog_upgrade_opt);
					cd.find(".save_button.save").click(function()
							{
								cd.dialog('close');
								$("#dialog_upgrade_body").data('version', version);
								init_upgrade();
							});
					cd.find(".save_button.cancel").click(function()
							{
								cd.dialog('close');
							});
					utils.bind_hover(cd.find(".save_button"));
					cd.dialog('open');
				});
		return false;
	}
	
	function init_upgrade()
	{
		var version = $("#dialog_upgrade_body").data('version');
		var cd = $("#dialog-upgrade");
		$("#dialog_upgrade_body").load(upgrade_begin_url + "?ver=" + version, null,
				function(result)
				{
					var cd = $("#dialog-upgrade");
					set_disabled(cd.find(".save_button.cancel"), 1, null);
					set_disabled(cd.find(".save_button.retry"), 1, null);
					set_disabled(cd.find(".save_button.restart"), 1, null);
					utils.bind_hover($(".save_button"));
					init_log();
					cd.dialog('open');
				});
	}
	
	function func_details()
	{
		var a = $(this).attr("title");
		$.get(details_url, "ver=" + a,
				function(result)
				{
					$("#dialog_details_body").html(result);
					$("#dialog-details").dialog('open');
				});
		return false;
	}
	
	function toggle_showbeta()
	{
		if (this.checked)
			$(".row_beta").show();
			
		else
			$(".row_beta").hide();
	}
	
	function stop_log_timer()
	{
		clearTimeout(log_timer);
	}
	
	function start_log_timer()
	{
		stop_log_timer();
		log_timer = setTimeout(check_log, log_interval);
	}
	
	function stop_ping_timer()
	{
		clearTimeout(ping_timer);
	}
	
	function start_ping_timer()
	{
		stop_ping_timer();
		ping_timer = setTimeout(check_server, ping_interval);
	}
	
	function init_log()
	{
		stop_log_timer();
		var autoscroll = true;
		$.get(upgrade_log_init_url, null,
				function(result)
				{
					if (result.error == 0)
					{
						$("#id_content").html(result.content);
						if (autoscroll)
							$("#id_content").scrollTop($("#id_content")[0].scrollHeight);
						
						if (result.complete == 0)
							start_log_timer();
							
						else
						{
							stop_log_timer();
							var cd = $("#dialog-upgrade");
							var fc = function()
							{
								cd.dialog('close');
							}
							set_disabled(cd.find(".save_button.cancel"), 0, fc);
							set_disabled(cd.find(".save_button.restart"), 0, init_restart);
						}
					}
					
					else
					{
						stop_log_timer();
						if (result.content != "")
							$("#id_content").html(result.content);
							
						var cd = $("#dialog-upgrade");
						var fc = function()
						{
							cd.dialog('close');
						}
						set_disabled(cd.find(".save_button.cancel"), 0, fc);
						set_disabled(cd.find(".save_button.retry"), 0, init_upgrade);
					}
				});
	}
	
	function check_log()
	{
		var autoscroll = true;
		$.get(upgrade_log_run_url, null,
				function(result)
				{
					if (result.error == 0)
					{
						$("#id_content").append(result.content);
						if (autoscroll)
							$("#id_content").scrollTop($("#id_content")[0].scrollHeight);
							
						if (result.complete == 0)
							start_log_timer();
							
						else
						{
							stop_log_timer();
							var cd = $("#dialog-upgrade");
							var fc = function()
							{
								cd.dialog('close');
							}
							set_disabled(cd.find(".save_button.cancel"), 0, fc);
							set_disabled(cd.find(".save_button.restart"), 0, init_restart);
						}
					}
					
					else
					{
						stop_log_timer();
						if (result.content != "")
							$("#id_content").append(result.content);
							
						var cd = $("#dialog-upgrade");
						set_disabled(cd.find(".save_button.retry"), 0, init_upgrade);
					}
				});
	}
	
	function init_restart()
	{
		set_disabled($(this), 1, null);
		$("#restart_progress").show();
		$.get(upgrade_restartserver_url, null,
				function(result)
				{
					if (result == "success")
						start_ping_timer();
				});
	}
	
	function check_server()
	{
		$.ajax({
			type: 'GET',
			url: checkserver_url,
			success: function(result, textStatus, jqXHR)
			{
				var o = jqXHR.status;
				window.location.replace(window.location.href);
			},
			error: function(jqXHR, textStatus, errorThrown)
			{
				start_ping_timer();
			}
		});
	}
	
	function set_disabled(o, arg, handler)
	{
		o.unbind("click");
		if (arg == 1)
		{
			o.attr("disabled", "disabled");
			o.removeClass("hover");
			o.addClass("ui-state-disabled");
			o.unbind("mouseenter");
			o.unbind("mouseleave");
		}
		
		else
		{
			o.removeAttr("disabled");
			o.removeClass("ui-state-disabled");
			o.addClass("hover");
			o.click(handler);
			utils.bind_hover(o);
		}
	}
	
	function get_list()
	{
		var showbeta = ($("#id_showbeta").attr("checked") == "checked" ? 1 : 0);
		var q = (showbeta == 1 ? "?beta=1" : "?beta=0");
		$(".upgrade_tbl > tbody").load(list_url + q, null,
				function()
				{
					init_list();
				});
		return false;
	}
	
	function init()
	{
		init_ui_opt();
		init_cmd();
		init_dialog();
		init_list();
		utils.bind_hover($(".save_button.refresh"));
	}
	
	return {
		init:init,
		upgrade_log_run_url:upgrade_log_run_url,
		checkserver_url:checkserver_url,
		stop_log_timer:stop_log_timer,
		stop_ping_timer:stop_ping_timer
	}
}());
var report = function()
{
	//show the page report hardware.
	var load_hardware_url = "/reporthardware/";
	var load_networkusage_url = "/reportnetworkusage/";
	
	//show the page report of web security
	var load_websecurity_url = "/reportwebsecurity/";
	
	// url for navigation of the grid 
	var url_rt_list = "/report_nav_list/"; 
	
	//url for update searching 
	//apply when user click update button.
	var url_upate_list = "/report_update_list/";
	
	// url in case of user click back button
	// EX : 
	var url_get_back_cache = '/rpt_get_back_cache/';
		
	//generate data.
	var url= "/graphdata/";
	 
	var urlexportpdf = "/report_pdf/";
	var urlexportcsv = "/report_csv/";
	var urldownload ="/download_file/";
	
	var urlloatsetting = "/report_loadsetting/";
	var urlsaveemail =  "/report_save_mail/";
	var urldeletemail = "/report_delete_mail/";
	var toggle_status_rpt = "/report_toggle_status/";
	var urlloademailreport = "/report_loademailsettingreport/";
	
	var report_save_host_mail = "/report_save_host_mail/";
	
	//time line 
	// pls don't delete or change these variable.
	var vardays =  'days';
	var varweeks = 'weeks';
	var varmonths = '_months';
	var varyears = '_years';
	
	var _ispage = "";
	
	//kind of report 
	//Ex : cpu, ram , hd , netusage (network usage)
	var kindofreport ='';
	
	//this dictionary used for HardWare report.
	var tabOpts = {
			seleced :1,
			show :showtab
		};
	
	var tabOpts_SettingReport = {
		selected :0,
		show : showtabsetting
	};
	// This variable to be applied for combobox of searching in report
	// EX : today,yesterday,last 7 days , last 30  days , October, September , August ........
	var dictsearchtime = {
			'today' : 'Today',
			'yesterday' : 'Yesterday',
			'lastsevendays' : 'Last 7 Days',
			'lastthirtydays' : 'Last 30 Days'
	};
	
	// Number of month will be displayed in combobox search time
	// Ex : I set numberofmonth = 3 then It will show three time : October ,September , August
	var numberofmonth = 5;
	
	var lstmonth = new Array('January','February','March','April','May','June','July','August','September','October','November','December');
	
	function get_data_ram_cpu_hd(index)
	{
		data = {
				'types' : kindofreport,
				'ispage': _ispage
			}
		
		if (index==0)
			data['typetime'] = vardays;
		if (index==1)
			data['typetime'] =varweeks;
		if (index==2)
			data['typetime'] = varmonths;
		if (index==3)
			data['typetime'] = varyears;
		
		return data;
	}
	
	//This method is supported for clicking tab hardware ,cpu , ram ......
	function showtab(event,ui) 
	{
		index = ui.index;
		data = get_data_ram_cpu_hd(index);
		$("#" + index).load(url,data, function(){});	
	} 
	
	function showtabsetting(event,ui)
	{
		index = ui.index;
		data = { 'dataindex' : index };
		$("#" + index).load(urlloademailreport,data,function(){
			    
			    
				$("#rptenable_days > .sw-on").click(enable_rpt);
				$("#rptenable_days > .sw-off").click(disable_rpt);
				$("#rptnewemail_days").click(rpt_add_email);
		
				$("#rptenable_weeks > .sw-on").click(enable_rpt);
				$("#rptenable_weeks > .sw-off").click(disable_rpt);
				$("#rptnewemail_weeks").click(rpt_add_email);
		
				$("#rptenable_months > .sw-on").click(enable_rpt);
				$("#rptenable_months > .sw-off").click(disable_rpt);
				$("#rptnewemail_months").click(rpt_add_email);
		
				$("#rpt_rpt_days > .list_item").click(delete_rpt_email);
				$("#rpt_rpt_weeks > .list_item").click(delete_rpt_email);
				$("#rpt_rpt_months > .list_item").click(delete_rpt_email);
		
				// init dialog for user adding new data.
				$("#rpt_dialog_setting").dialog({
	           		autoOpen: false,
	           		modal: true
	       		});
	       		
	       		//init 
	       		$("#rpt_id_save_host_setting").click(add_host_email);
	       		utils.bind_hover($("#rpt_id_save_host_setting"));
	       		
	       		if ($("#id_smtpuser").val() != ""){
					$("#id_smtppass").val("**********");
					$("#id_smtprepass").val("**********"); 
	       		}
		});
	}
	
	// typerpt variable : ram, cpu ,hdd ,netio ......
	// ispage variable : HardWare page or WebSecurity page........
	function load(typerpt,ispage)
	{
		if (ispage == 'hardware')
		{
			kindofreport = typerpt;
			_ispage = "hardware";
			return menu.get(load_hardware_url, init);
		}
		
		if(ispage == 'netusage')
		{
			kindofreport = "";
			_ispage = "netusage";
			return menu.get(load_networkusage_url, init);
		}
		
		if (ispage == 'websecurity')
		{
			return menu.get(load_websecurity_url, initwebsecurity);
		}
		
		if (ispage == 'setting')
		{
			return menu.get(urlloatsetting,init_setting);
		}
		
	}

	function init()
	{
		$('#rp_tabs').tabs(tabOpts);
		
	}
	
	//init for setting
	function init_setting()
	{
	    //Init tabs for setting host(smtp,port,email address. vvv.vv. ) and email recive reports.
	    $('#rpt_tabs_setting').tabs(tabOpts_SettingReport); 
	    
	}
	
	//------------Report Web Security.------------------//
	//Init 
	function initwebsecurity()
	{
		$('#rp_websecurity').tabs(tabOptsWebSecurity); 
		
		//add options for searching. today , yesterday last 7 days......
		addoptionsearchtime();
		//start , end datetime picker
		startcustom();
		endcustom();
		$('#rptsearch_time').change(typeofrptsearch);
		
		//type of user
		//Ex : top_user , top_host ........
		$('#rptwebusage_type').change(typeofrptinfo);
		
		//
		$("#id_prev").click(rpt_nav_pre);
		$("#id_next").click(id_next);
		
		$("#rpt_update_button").click(rpt_update);
		
		$("#rpt_export_pdf").click(export_pdf);
		$("#rpt_export_csv").click(export_csv);
		
		$("#rpt_dialog").dialog({
	           autoOpen: false,
	           modal: true,
	           height: 50,
	           width: 50
	       });
		
		//utils.bind_hover($("#id_prev,#id_next,#rpt_update_button,#rpt_export_pdf,#rpt_export_csv"));
		utils.bind_hover($("#rpt_update_button,#rpt_export_pdf,#rpt_export_csv"));
		$("#id_prev,#id_next").css("cursor","pointer");
		
		$('#rpt_search_panel').hide();
		
		$("#rp_websecurity1").click(function(){$('#rpt_search_panel').hide();});
		
		show_nav = $("#id_pg").val();
		lstnav = show_nav.split(',');
		
		try{
			if (lstnav[0] == 'False')
			{
				$("#id_prev").addClass("ui-state-disabled");
				$("#id_prev").unbind("click");
				
			}
			if  (lstnav[1] == 'False')
			{
				$("#id_next").addClass("ui-state-disabled");
				$("#id_next").unbind("click");
			}
		
			$(".item_display").html(lstnav[2]);
			
			$('#rpt_data_body tr:last').addClass('ui-widget-header');
			$('#rpt_data_body tr:last').find('td:eq(1)').removeAttr('onclick');
			$('#rpt_data_body tr:last').find('td:eq(1)').removeAttr('style');
			
		}
		catch(err)
		{
			
		}
		
		report_level.init();
	}

	// this dictionary used for SebSecurity report.
	var tabOptsWebSecurity = {
			seleced : 1	
	} ;
	
	// *******************************************************************
	//  time
	//
	// *******************************************************************
	
	// this function support for add the time to combobox ,Because the time for searching is dynamic
	// EX:current month is November so the list of searching must be : October,September,August......
	function addoptionsearchtime()
	{
		numberofmonth = 5;
		timenow = new Date();
		
		for(i=0;i<numberofmonth;i++)
		{
			timenow.setMonth(timenow.getMonth() - 1);
			//format will be mm/yyyy for value.
			month = timenow.getMonth() + 1
			if (month < 10)
				month = "0" + month 
			var keys = month + "-" + timenow.getFullYear(); 
			var optvalue = lstmonth[timenow.getMonth()];
			
			dictsearchtime[keys] = optvalue;
		}
		
		// 
		$.each(dictsearchtime,function(key,optvalue){
			
			$('#rptsearch_time').append($('<option>', { value : key }).text(optvalue));
		});
		
		//Add custom 
		$('#rptsearch_time').append($('<option>', { value : 'custom' }).text('custom'));
	}
	
	//Applied the datetime picker when user want to search following the custom.
	function startcustom()
	{
		var start_Opts_custom = {
				showOn: "button",
				buttonImage: '../media/css/img/SpriteImage/16/0255.png',
				constrainInput : true,
				showOtherMonths: true,
				buttonImageOnly:true,
				dateFormat: 'yy-mm-dd',
				showButtonPanel: true
		}
		
		$("#rptcustom_start").datepicker(start_Opts_custom);
	}
	
	//Applied the datetime picker when user want to search following the custom.
	function endcustom()
	{
		var end_Opts_custom = {
				showOn: "button",
				buttonImage: '../media/css/img/SpriteImage/16/0255.png',
				constrainInput : true,
				showOtherMonths: true,
				buttonImageOnly:true,
				dateFormat: 'yy-mm-dd',
				showButtonPanel: true
		}
		
		$("#rptcustom_end").datepicker(end_Opts_custom);
	}
	
	//Check the change when user click : if selection is custom we will show start_datetime , end_datetime
	function typeofrptsearch()
	{
		var type = $("#rptsearch_time option:selected").attr('value');
		
		if (type == "custom")
			$('#rptsearch_time_custom').show();
		else
			$('#rptsearch_time_custom').hide();	
	}
	
	// *******************************************************************
	// Select type of information 
	// EX : Host, user , User by Host , Host by user ... 
	// *******************************************************************
	
	function typeofrptinfo()
	{
		var type = $("#rptwebusage_type option:selected").attr('value');
		var iscustom = $("#rptsearch_time option:selected").attr('value');
		
		if (type == 'topusersbyhost')
		{
			$("#rptwebusage_user_row").hide();
			$("#rptwebusage_host_row").show();
			$("#rptwebusage_userbymime_row").hide();
			$("#rptwebusage_mimebyuser_row").hide();
		}
		
		else if(type == 'tophostbyuser')
		{
			$("#rptwebusage_user_row").show();
			$("#rptwebusage_host_row").hide();
			$("#rptwebusage_userbymime_row").hide();
			$("#rptwebusage_mimebyuser_row").hide();
			$("#rptwebusage_destinationbymime_row").hide();
		}
		
		else if (type == 'topuserbymime')
		{
			$("#rptwebusage_user_row").hide();
			$("#rptwebusage_host_row").hide();
			$("#rptwebusage_mimebyuser_row").hide();
			$("#rptwebusage_userbymime_row").show();
			$("#rptwebusage_destinationbymime_row").hide();
			
		}
		
		else if (type == 'topmimebyuser')
		{
			$("#rptwebusage_user_row").hide();
			$("#rptwebusage_host_row").hide();
			$("#rptwebusage_userbymime_row").hide();
			$("#rptwebusage_mimebyuser_row").show();
			$("#rptwebusage_destinationbymime_row").hide();
		}
		
		else if (type == 'topdestinationbymime')
		{
			$("#rptwebusage_user_row").hide();
			$("#rptwebusage_host_row").hide();
			$("#rptwebusage_userbymime_row").hide();
			$("#rptwebusage_mimebyuser_row").hide();
			$("#rptwebusage_destinationbymime_row").show();
		}
		
		else 
		{
			$("#rptwebusage_user_row").hide();
			$("#rptwebusage_host_row").hide();
			$("#rptwebusage_userbymime_row").hide();
			$("#rptwebusage_mimebyuser_row").hide();
			$("#rptwebusage_destinationbymime_row").hide();
		}
		
		if (iscustom == "custom")
			$("#rptsearch_time_custom").show();
		else
			$("#rptsearch_time_custom").hide();
	}
	
	// *******************************************************************
	// Navigation .
	// EX : Move to pre or next page. 
	// *******************************************************************
	
	function rpt_nav_pre()
	{
		rpt_data = get_nav_rpt_data();
		rpt_data['status'] = '-1';
		
		$.ajax({
				url: url_rt_list,
				data: rpt_data,
				type: 'GET',
				success :function(result, textStatus, jqXHR)
				{
					if (result.success)
					{	
						if (result.lstobject) 
						{	
							$("#rpt_data_body").empty();
							$("#rpt_data_body").append(result.lstobject);
						}
					
						show_hide_rpt_nav(result);
						$('#rpt_data_body tr:last').addClass('ui-widget-header');
						$('#rpt_data_body tr:last').find('td:eq(1)').removeAttr('onclick');
						$('#rpt_data_body tr:last').find('td:eq(1)').removeAttr('style');
						
						//save in to the cache.
						//var infosetting = new step_report_store(result.currentpage,result.nav_nbrrow,result.nav_topic,result.nav_topic_by,result.nav_timescale,result.nav_timescale_start,result.nav_timescale_end,result.nav_sort,result.item_msg,result.hasprev,result.hasnext);
						//var levelinfo = report_level.get_level(result.topic);
						//report_level.savecache(levelinfo,infosetting);

					}
					else
					{
						alert(result.error);
					}
				}
		});
	}
	
	//This part to support nav link (get the parameter from cache)
	//data parameter included  data(from catch)
	function rpt_get_cache(data,levelinfo,pathlink,filter)
	{
		rpt_data = data;
		rpt_data['status'] = '0';
		
		$.ajax({
				url: url_get_back_cache,
				data: rpt_data,
				type: 'GET',
				success :function(result, textStatus, jqXHR)
				{
					if (result.success)
					{
						if (result.lstobject) 
						{	
							$("#rpt_list").empty();
							$("#rpt_list").append(result.lstobject);
						}
						
						//This method will update the buttons(navigation << , >> , and current page at hidden control)
						show_hide_rpt_nav(result);
						
						$('#rpt_data_body tr:last').addClass('ui-widget-header');
						$('#rpt_data_body tr:last').find('td:eq(1)').removeAttr('onclick');
						$('#rpt_data_body tr:last').find('td:eq(1)').removeAttr('style');
						
						//This part will update the controls (on the left )
						$('#rptwebusage_type').val(result.nav_topic);
						$('#rptwebsecurity_nbrofrow').val(result.nav_nbrrow);
						$('#rptsearch_time').val(result.nav_timescale);
						$('#rptcustom_start').val(result.nav_timescale_start);
						$('#rptcustom_end').val(result.nav_timescale_end);
						
						var topic = result.nav_topic;
						
						if (topic == 'tophostbyuser')
							$('#rptwebusage_user').val(result.nav_topic_by);
						if (topic == 'topusersbyhost')
							$('#rptwebusage_host').val(result.nav_topic_by);
						if (topic == 'topuserbymime')
							$('#rptwebusage_userbymime').val(result.nav_topic_by);
						if (topic == 'topmimebyuser')
							$('#rptwebusage_mimebyuser').val(result.nav_topic_by);
						if (topic == 'topdestinationbymime')
							$('#rptwebusage_destinationbymime').val(result.nav_topic_by);
						
						// This part update hidden controls
						update_nav_info(result);
						
						//show textbox is searched
						typeofrptinfo();
						
						//show link.
						//rptlink = "Nothing";
						//if (levelinfo == 1) 
						//{
						//	rptlink = report_level.showlink(1,pathlink,infosetting,filter);
						//}
						//else 
						//{
						//	if (typeof pathlink == 'undefined') 
						//		rptlink = report_level.showlink(0,result.nav_topic,infosetting,"");
						//	else
						//		rptlink = report_level.showlink(0,pathlink,infosetting,filter);
						//}
						
						// update the link text to the user info.
						var texttopic = report_level.gettext(topic);
						
						$("#rpt_link").html("<b>" + texttopic + " > "+ "</b>"); 
						
						//update the arrow for sort at header.
						remove_class();
						
						sortfield = $("#rpt_nav_sort").val();
						colsort = '';
						colsortstatus ='';
						
						if (sortfield == 'host')
						{
							colsort = 'kbyte';
							colsortstatus = 'desc';
						}
						else
						{
							arraydata = [];
							arraydata = sortfield.split('_');
							colsort = arraydata[0];
							colsortstatus = arraydata[1];
						}
						
						obj = $("div[temp="+ colsort +"]");
						objtd = obj.parent();
						
						objlst = $("#rpt_header_ls th table tr td span");
						$.each(objlst,function(){
							$(this).attr('class','');
						});
						
						if (colsortstatus == "")
							objtd.next().children().addClass("ui-icon ui-icon-triangle-1-n");
						else if(colsortstatus == "desc")
							objtd.next().children().addClass("ui-icon ui-icon-triangle-1-s");
						else
							objtd.next().children().addClass("ui-icon ui-icon-triangle-1-n");
						
					}
					else
					{
						alert(result.error);
					}
				}
		});
	}
	
	
	function id_next()
	{
		rpt_data = get_nav_rpt_data();
		rpt_data['status'] = '1';
			
		$.ajax({
				url: url_rt_list,
				data: rpt_data,
				type: 'GET',
				success :function(result, textStatus, jqXHR)
				{
					if (result.success)
					{
						if (result.lstobject) 
						{	
							$("#rpt_data_body").empty();
							$("#rpt_data_body").append(result.lstobject);
						}
					
						show_hide_rpt_nav(result);
						$('#rpt_data_body tr:last').addClass('ui-widget-header');
						$('#rpt_data_body tr:last').find('td:eq(1)').removeAttr('onclick');
						$('#rpt_data_body tr:last').find('td:eq(1)').removeAttr('style');
						
						//save in to the cache.
						//var infosetting = new step_report_store(result.currentpage,result.nav_nbrrow,result.nav_topic,result.nav_topic_by,result.nav_timescale,result.nav_timescale_start,result.nav_timescale_end,result.nav_sort,result.item_msg,result.hasprev,result.hasnext);
						//var levelinfo = report_level.get_level(result.topic);
						//report_level.savecache(levelinfo,infosetting);
					}
					else
					{
						alert(result.error);
					}
				}
		});
		
	}
	
	function get_nav_rpt_data()
	{
		// Note : the data to sent server will be included
		
		// topic var : value of what you want to search
		// Ex : Top_user,Top_host,Top_User_By_Host......
		
		// timescale : value of time that you want to search
		// Ex : Today, last 7 days , last 30 days ......
		
		// pagesize : value of item in a page that you want to display.
		
		// currentpage : 
		
		// sortfield : What kind of field you want to sort
		// EX : Top_User : you want to sort duration time , or request or byte........ 
		
		var curpage = $("#rpt_nav_currentpage").val();
		var sizepage = $("#rpt_nav_page_size").val();
		var topic =  $("#rpt_nav_topic").val();
		var topicby = $("#rpt_nav_topic_by").val();
		var starttimescale = $("#rpt_nav_starttime").val();
		var endtimescale = $("#rpt_nav_endtime").val();
		var timescale = $("#rpt_nav_time").val();
		var sortfield = $("#rpt_nav_sort").val();
		
		data = 
			{
				'currentpage' : curpage,
				'sizepage'    : sizepage,
				'topic'		  : topic,
				'topicby' 	  : topicby,	
				'timescale'   : timescale,
				'starttimescale' : starttimescale,
				'endtimescale' : endtimescale,
				'sortfield'   : sortfield
				
			}
		
		return data;
	}
	
	function show_hide_rpt_nav(result)
	{
		$("#id_prev").unbind("click");
		$("#id_next").unbind("click");
		
		if (result.hasprev == false)
		{
			$('#id_prev').attr("disabled", "disabled");
			//$('#id_prev').removeClass("hover");
			$('#id_prev').addClass("ui-state-disabled");
			//$('#id_prev').unbind("mouseenter");
			//$('#id_prev').unbind("mouseleave");
		}
		
		if (result.hasprev == true)
		{
			$('#id_prev').removeAttr("disabled");
			//$('#id_prev').addClass("hover");
			$('#id_prev').removeClass("ui-state-disabled");
			$("#id_prev").click(rpt_nav_pre);
			//utils.bind_hover($("#id_prev"));
		}
				
		if (result.hasnext == false)
		{	
			$('#id_next').attr("disabled", "disabled");
			//$('#id_next').removeClass("hover");
			$('#id_next').addClass("ui-state-disabled");
			//$('#id_next').unbind("mouseenter");
			//$('#id_next').unbind("mouseleave");
			
		}
		
		if (result.hasnext == true)
		{
			$('#id_next').removeAttr("disabled");
			//$('#id_next').addClass("hover");
			$('#id_next').removeClass("ui-state-disabled");
			$("#id_next").click(id_next);
			//utils.bind_hover($("#id_next"));
		}
			
		$(".item_display").html(result.item_msg);
		
		//
		$("#rpt_nav_currentpage").val(result.currentpage);
	}
	
	function update_nav_info(result)
	{
		$('#rpt_nav_topic').val(result.nav_topic);
		$('#rpt_nav_topic_by').val(result.nav_topic_by);
		$('#rpt_nav_page_size').val(result.nav_nbrrow);
		$('#rpt_nav_time').val(result.nav_timescale);
		$('#rpt_nav_starttime').val(result.nav_timescale_start);
		$('#rpt_nav_endtime').val(result.nav_timescale_end);
		$('#rpt_nav_sort').val(result.nav_sort);
	}
	// *******************************************************************
	// Report Update .
	// When User click on this button , It will update new criteria to server
	// Ex : User want to find , topic is top_user , timescalse is yesterday.......
	// *******************************************************************
	
	function rpt_update(levelinfo,pathlink,filter)
	{
		data = get_data_for_update();
		
		$.ajax({
			url : url_upate_list,
			data : data,
			type: 'GET',
			success :function(result, textStatus, jqXHR)
			{
				if (result.success)
				{
					if (result.lstobject) 
					{	
						$("#rpt_list").empty();
						$("#rpt_list").append(result.lstobject);
						
						rptlink = "Nothing";
						//Create a config file.
						//var infosetting = new step_report_store(result.currentpage,result.nav_nbrrow,result.nav_topic,result.nav_topic_by,result.nav_timescale,result.nav_timescale_start,result.nav_timescale_end,result.nav_sort,result.item_msg,result.hasprev,result.hasnext);
						//store into the cache data.
						//report_cache.store_cache_data(result.lstobject,infosetting);
						
						if (levelinfo == 1) 
						{
							//Note update the current page to store before assigning data from server to client
							var varcurrentpage = $("#rpt_nav_currentpage").val();
							var varsortfield = $("#rpt_nav_sort").val();
							var varpagesize = $("#rpt_nav_page_size").val();
							var vartopic = $("#rpt_nav_topic").val();
							var vartopicby = $("#rpt_nav_topic_by").val();
							var vartimescalse = $("#rpt_nav_time").val();
							var varstarttime = $("#rpt_nav_starttime").val();
							var varendtime = $("#rpt_nav_endtime").val();
							
							//var infosetting = new step_report_store(varcurrentpage,result.nav_nbrrow,result.nav_topic,result.nav_topic_by,result.nav_timescale,result.nav_timescale_start,result.nav_timescale_end,varsortfield,result.item_msg,result.hasprev,result.hasnext);
							var infosetting = new step_report_store(varcurrentpage,varpagesize,vartopic,vartopicby,vartimescalse,varstarttime,varendtime,varsortfield,result.item_msg,result.hasprev,result.hasnext);	
							rptlink = report_level.showlink(0,pathlink,infosetting,filter);
						}
						else 
						{
							
							var infosetting = new step_report_store(result.currentpage,result.nav_nbrrow,result.nav_topic,result.nav_topic_by,result.nav_timescale,result.nav_timescale_start,result.nav_timescale_end,result.nav_sort,result.item_msg,result.hasprev,result.hasnext);
						
							if (typeof pathlink == 'undefined') 
								rptlink = report_level.showlink(0,result.nav_topic,infosetting,"");
							else
								rptlink = report_level.showlink(0,pathlink,infosetting,filter);
						}
							
						show_hide_rpt_nav(result);
						
						//Update the hidden input.
						update_nav_info(result);
						
						$('#rpt_data_body tr:last').addClass('ui-widget-header');
						$('#rpt_data_body tr:last').find('td:eq(1)').removeAttr('onclick');
						$('#rpt_data_body tr:last').find('td:eq(1)').removeAttr('style');
						
						$("#rpt_link").html(rptlink); 
					}
				
					//here
				}
				
				else
				{
					alert(result.error);
				}
			}
		});
		
	}
	
	function get_data_for_update()
	{
		// Note:
		
		// When user click update we will find all the standard search from these ids.
		
		// rptwebusage_type : topic user want to search 
		// rptwebusage_user_row : when user select host by user  this one will be applied on server
		// rptwebusage_host_row : when user select user by host this one will be applied on server
		// rptwebusage_mime_row : when user select user by mime this one will be applied on server
		// rptsearch_time : includes time today, yesterday.... custom 
		// rptcustom_start : includes time when user choose custom
		// rptcustom_end : includes time when user choose custom
		// rptwebsecurity_nbrofrow : number of row
		// sort by host default
		
		var topic = $('#rptwebusage_type option:selected').attr('value');
		var byuser = $('#rptwebusage_user').val(); 
		var byhost = $('#rptwebusage_host').val();
		var userbymime = $('#rptwebusage_userbymime').val();
		var mimebyuser = $('#rptwebusage_mimebyuser').val();
		var destbymime = $("#rptwebusage_destinationbymime").val();
		var timescale = $('#rptsearch_time option:selected').attr('value');
		var starttimescale = $('#rptcustom_start').val();
		var endtimescale = $('#rptcustom_end').val();
		var nbrrow = $('#rptwebsecurity_nbrofrow option:selected').val();
			
		var data = {
				'topic' : topic,
				'byuser': byuser,
				'byhost' : byhost,
				'bymime' : userbymime,
				'mimebyuser' : mimebyuser, 
				'destbymime' : destbymime,
				'timescale' : timescale,
				'starttimescale' : starttimescale,
				'endtimescale' : endtimescale,
				'nbrrow' : nbrrow
		}
		
		return data;
	}
	
	// *******************************************************************
	// Sort
	// 
	// 
	// *******************************************************************
	function rpt_sortdata(obj)
	{
		var colsort = $(obj).attr('temp');
		//var objsort = objtd.next().children();
		//var objsort = $(obj).next();
		
		
		objtd = $(obj).parent(); // td addClass(" ui-icon ui-icon-triangle-1-s"); 
		
		
		statussort = objtd.next().children().attr('class');
		status = "desc";
		
		if (statussort == "")
			status = "desc"; //max -> min
		
		else if(statussort == "ui-icon ui-icon-triangle-1-s")
			status = "asc";
		
		else 
			status = "desc";
		
				
		strsort = colsort + "_" + status;
		
		var data = get_dat_sort();
		
		data['sortfield'] = strsort;
		data['status'] = 0; 
		
		$.ajax({
			url : url_rt_list,
			data : data,
			type: 'GET',
			success :function(result, textStatus, jqXHR)
			{
				
				if (result.success)
				{
					if (result.lstobject) 
					{	
						$("#rpt_data_body").empty();
						$("#rpt_data_body").append(result.lstobject);
					}
				
					show_hide_rpt_nav(result);
				
					$("#rpt_nav_sort").val(result.sortfield);
				
					remove_class();
				
					// add name of class
					//objsort.addClass(status);
					
					objlst = $("#rpt_header_ls th table tr td span");
					$.each(objlst,function(){
						$(this).attr('class','');
					});
					//
					
					if (status == "")
						objtd.next().children().addClass("ui-icon ui-icon-triangle-1-n");
					else if(status == "desc")
						objtd.next().children().addClass("ui-icon ui-icon-triangle-1-s");
					else
						objtd.next().children().addClass("ui-icon ui-icon-triangle-1-n");
						
					$('#rpt_data_body tr:last').addClass('ui-widget-header');
					$('#rpt_data_body tr:last').find('td:eq(1)').removeAttr('onclick');
					$('#rpt_data_body tr:last').find('td:eq(1)').removeAttr('style');
				}
				
				else
				{
					alert(result.error);
				}
			}
		});
		
	}
	
	//this function will remove all class
	function remove_class()
	{
		var t = $("#rpt_topuser thead tr th span");
		$.each(t,function(index,obj){ $(obj).removeClass("asc desc"); });
		
	}
	
	function get_dat_sort()
	{
		var curpage = $("#rpt_nav_currentpage").val();
		var sizepage = $("#rpt_nav_page_size").val();
		var topic =  $("#rpt_nav_topic").val();
		var topicby = $("#rpt_nav_topic_by").val();
		var starttimescale = $("#rpt_nav_starttime").val();
		var endtimescale = $("#rpt_nav_endtime").val();
		var timescale = $("#rpt_nav_time").val();
		
		data = 
		{
			'currentpage' : curpage,
			'sizepage'    : sizepage,
			'topic'		  : topic,
			'topicby' 	  : topicby,	
			'timescale'   : timescale,
			'starttimescale' : starttimescale,
			'endtimescale' : endtimescale
		}
		
		return data;
	}
	
	
	// *******************************************************************
	// Export PDF
	// we can use this method to get data .
	// get_nav_rpt_data()
	// 
	// *******************************************************************
	
	function export_pdf()
	{
		data = get_dat_sort();
		var sortfield = $("#rpt_nav_sort").val();
		data["sortfield"] = sortfield;
			
		$.ajax({
			url : urlexportpdf,
			data : data,
			type : 'GET',
			success :function(result, textStatus, jqXHR)
			{
				if (result.success)
				{
					$("#rpt_dialog").dialog("open");
					$("#rpt_path_download").val(result.success);
				}
				
				else
				{
					alert(result.error);
				}
			}
		
		});
	}
	
	function export_csv()
	{
		data = get_dat_sort();
		var sortfield = $("#rpt_nav_sort").val();
		data["sortfield"] = sortfield;
		
			$.ajax({
			url : urlexportcsv,
			data : data,
			type : 'GET',
			success :function(result, textStatus, jqXHR)
			{
				if (result.success)
				{
					$("#rpt_dialog").dialog("open");
					$("#rpt_path_download").val(result.success);
				}
				
				else
				{
					alert(result.error);
				}
			}
		
		});
	}
	
	// *******************************************************************
	// Change Selected search at row.and call update
	// 
	// 
	// 
	// *******************************************************************
	
	//when user click topuser ,topmime , tophost, that will show menu.
	function show_search_panel(typesearch,obj,event)
	{
		
		var totalOffsetX = 0; 
		var totalOffsetY = 0;
		var canvasX = 0;
    	var canvasY = 0;
    	var currentElement = this;
		
		_xvar = event.clientX -10;
		_yvar = event.clientY -10;
		
		$('#rpt_search_panel').css('top',_yvar);
		$('#rpt_search_panel').css('left',_xvar);
		
		var nameuser = $(obj).text();
		$('#rpt_search_info').html(nameuser);
		
		if (typesearch == 'topbyuser')
		{
			$('.rpt_search_topuser').show();
			$('.rpt_search_topuser').attr('value', nameuser);
			
			$('.rpt_search_topmime').hide();
			$('.rpt_search_topmime').attr('value','');
		}
		
		if (typesearch == 'topbymime')
		{
			$('.rpt_search_topmime').show();
			$('.rpt_search_topmime').attr('value', nameuser);
			
			$('.rpt_search_topuser').hide();
			$('.rpt_search_topuser').attr('value', '');
		}
		
		$('#rpt_search_panel').show(); 
		
		 if (event.stopPropagation)
    	 {
        	event.stopPropagation();
         }
		
		else if(window.event)
		{
			window.event.cancelBubble=true;
		}
	}
	
	//When user click on specified row of user at topuser
	function searchtophostbyuser(obj)
	{
		$('#rptwebusage_type').val('tophostbyuser');
		var nameuser = $(obj).attr('value');
		nameuser = $.trim(nameuser);
		$('#rptwebusage_user').val(nameuser);
		$('#rptwebusage_user_row').show();
		
		rpt_update(1,'topuser,tophostbyuser',nameuser);
		$('#rpt_search_panel').hide();
	}
	
	//when ser click on specified row of host at tophost
	function searchtopuserbyhost(obj)
	{
		$('#rptwebusage_type').val('topusersbyhost');
		var namesite = $(obj).text();
		namesite = $.trim(namesite);
		$('#rptwebusage_host').val(namesite);
		
		$('#rptwebusage_host_row').show();
		rpt_update(1,'tophost,topusersbyhost',namesite);
	}
	
	function searchtopmimebyuser(obj)
	{
		$('#rptwebusage_type').val('topmimebyuser');
		var namesite = $(obj).attr('value');
		namesite = $.trim(namesite);
		$('#rptwebusage_mimebyuser').val(namesite);
		
		$('#rptwebusage_mimebyuser_row').show();
		$('#rptwebusage_userbymime_row').hide();
		
		rpt_update(1,'topuser,topmimebyuser',namesite);
		
		$('#rpt_search_panel').hide();
	}
	
	function searchtopuserbymime(obj)
	{
		$('#rptwebusage_type').val('topuserbymime');
		
		var namesite = $(obj).attr('value');
		namesite = $.trim(namesite);
		
		$('#rptwebusage_userbymime').val(namesite);
		$('#rptwebusage_userbymime_row').show();
		$('#rptwebusage_mimebyuser_row').hide();
		
		rpt_update(1,'topmime,topuserbymime',namesite);
		$('#rpt_search_panel').hide();
	}
	
	//search destination by mime
	function searchtopsitebymime(obj)
	{
		$('#rptwebusage_type').val('topdestinationbymime');	
		
		var namesite = $(obj).attr('value');
		namesite = $.trim(namesite);
		$('#rptwebusage_destinationbymime').val(namesite);
		
		$('#rptwebusage_destinationbymime_row').show();
		
		rpt_update(1,'topmime,topdestinationbymime',namesite);
		$('#rpt_search_panel').hide();
	}
	
	function downloadfile()
	{
		pathfile = $("#rpt_path_download").val(); 

		try
		{
			window.location.href = urldownload + "?path_file=" + pathfile ;
		}
		catch(err)
		{
			alert(err);
		}
		
	}
	
	// *******************************************************************
	// part of setting report for who is reciveed mail (daily,monthly,weekly,yearly) 
	// 
	// 
	// 
	// *******************************************************************
	
	function getdata_setting_rpt(timescale , emailaddress,active)
	{
		data = {
			'type' : timescale,
			'email' : emailaddress,
			'active' : active
		};
		
		return data;
	}
	
	//Enable red,green report.
	function enable_rpt()
	{
		
		objid = $(this).parent().attr('id');
		arrayobj= [];
		// the name will be seperated by _ for its function. 
		arrayobj =objid.split('_');
		
		data = getdata_setting_rpt(arrayobj[1],'','1');
		
		$.post(toggle_status_rpt, data,
				function(result)
				{
					if (result.success == "success")
					{
						enable_active_rpt(result.type);
					}
				});
	}
	
	function enable_active_rpt(type)
	{
		try
		{
			objon = "";
			objoff = "";
			
			if (type == 'days')
			{
				objon = "#rptenable_days > .sw-on";
				objoff = "#rptenable_days > .sw-off";
			}
			
			if (type == 'weeks')
			{
				objon = "#rptenable_weeks > .sw-on";
				objoff = "#rptenable_weeks > .sw-off";
			}
			
			if (type == 'months')
			{
				objon = "#rptenable_months > .sw-on";
				objoff = "#rptenable_months > .sw-off";
			}
			
			$(objoff).removeClass('redicon');
			$(objoff).addClass('greyicon');
			$(objon).removeClass('greyicon');
			$(objon).addClass('greenicon');
			
		}
		catch(error)
		{
			
		}
	}
	
	function disable_active_rpt(type)
	{
		try
		{
			objon = "";
			objoff = "";
			
			if (type == 'days')
			{
				objon = "#rptenable_days > .sw-on";
				objoff = "#rptenable_days > .sw-off";
			}
			
			if (type == 'weeks')
			{
				objon = "#rptenable_weeks > .sw-on";
				objoff = "#rptenable_weeks > .sw-off";
			} 
			
			if (type == 'months')
			{
				objon = "#rptenable_months > .sw-on";
				objoff = "#rptenable_months > .sw-off";
			}
			
			$(objon).removeClass('greenicon');
			$(objon).addClass('greyicon');
			$(objoff).removeClass('greyicon');
			$(objoff).addClass('redicon');
		}
		catch(error)
		{
		}
	}
	
	// disable red,green report.
    function disable_rpt()
	{
		objid = $(this).parent().attr('id');
		arrayobj= [];
		arrayobj =objid.split('_');
		
		data = getdata_setting_rpt(arrayobj[1],'','0');
		
		
		$.post(toggle_status_rpt, data,
				function(result)
				{
					if (result.success == "success")
					{
						disable_active_rpt(result.type);
					}
				});
	}
	
	//This function happen when the user click adding email for receiving report.
	function rpt_add_email()
	{
		$("#rpt_dialog_setting").dialog("open");
		idobj = $(this).attr('id');
		lsttype = [];
		idobj = idobj.split('_'); 
		$("#rpt_type").val(idobj[1]);
		
		$("#rpt_add_error").html("");
		$("#rpt_email_address").val("");
		
		savebtt =  $("#rpt_dialog_setting");
		$(savebtt).find(".save_button.save").unbind("click");
	    $(savebtt).find(".save_button.save").click(
	    	function ()
			{
				timescale = $("#rpt_type").val();
				emailaddress = $("#rpt_email_address").val();
				
				if ($.trim(emailaddress) == ""){
					$("#rpt_add_error").html("Please enter the email address.");
					return;
				}
				
				data = getdata_setting_rpt(timescale,emailaddress,'');
				
				$.post(urlsaveemail,data,
					function(result)
					{
						if(result.success == 'success')
						{
							
							id = result.id;
							iddiv = "rptdays_" + id;
							itemhtml = "<div id=\"" + iddiv + "\" class=\"list_item\" style=\"border-bottom:1px solid\">";
							itemhtml = itemhtml	+ "<div class=\"proxynow trashicon item_delete\"></div>";
							itemhtml = itemhtml	+ "<div>"+ result.email +"</div></div>";
							append_element(itemhtml,result.type);
							$("#" + iddiv).click(delete_rpt_email);
							$("#rpt_dialog_setting").dialog("close");
						}
						
						if(result.error != "") 
						{
							$("#rpt_add_error").html(result.error);
						}
					});
			});
	}
	
	//
	function add_host_email()
	{
		var fromemail =  $("#id_fromemail").val();
		var smtphost = $("#id_smtphost").val();
		var smtpport = $("#id_smtpport").val(); 
		var smtpuser = $("#id_smtpuser").val();
		var smtppass = $("#id_smtppass").val();
		var smtprepass = $("#id_smtprepass").val();
		var smtpsecure =  $("#id_smtpsecure option:selected").val();
		
		data = {'fromemail' : fromemail,
				'smtphost' : smtphost,
				'smtpport' : smtpport,
				'smtpuser' : smtpuser,
				'smtppass' : smtppass,
				'smtprepass' : smtprepass,
				'smtpsecure' : smtpsecure }
		
		$.post(report_save_host_mail,data,function(result)
		{
			if (result.success == 'success')
			{
				stat.show_status(0, "Mail server settings successfully saved.");
			}
			else if (result.invalid)
			{
				err = utils.get_errors(result.invalid);
				stat.show_status(1, err);
			}
			else if (result.error != "")
			{
				stat.show_status(1, result.error);
			}
		});
	}
	
	function delete_rpt_email()
	{
		valid = $(this).attr('id');
		lst = [];
		lst = valid.split('_');
		data = {'id' : lst[1]};
		
		$.post(urldeletemail,data,
			function(result)
			{
				if (result.success == 'success')
				{
					$("#" + valid).remove();
				}
				else
				{
					alert(result.error);
				}
			});
	}
	
	function append_element(itemhtml,type)
	{
		if (type == "days")
		{
			$('#rpt_rpt_days').append(itemhtml);
		}
		
		if (type == "weeks")
		{
			$('#rpt_rpt_weeks').append(itemhtml);
		}
		
		if (type == "months")
		{
			$('#rpt_rpt_months').append(itemhtml);
		}
	}
	
	// This method to support for proppgation event when user click to create menu.
	function stopBubble(arg)
	{
    	if (arg.stopPropagation)
    	{
        	arg.stopPropagation();
    	}
    	
    	else if(window.event)
    	{
        	var keycode;
        	keycode = window.event.keyCode;
        	window.event.cancelBubble=true;
            
        	if (keycode==13) 
        	{
            	this.focus();
        	}
    	}
    }
	
// Effective for menu.
	function rpt_menu_mouseout(obj)
	{
		$(obj).removeClass('ui-state-hover');
	}
	
	function rpt_menu_mouseover(obj)
	{
		$(obj).addClass('ui-state-hover');
	}
	
	function rpt_mainmenu_mouseover()
	{
		$('#rpt_search_panel').hide();
		
	}
	
	return {
		load:load,
		rpt_sortdata:rpt_sortdata,
		searchtophostbyuser:searchtophostbyuser,
		searchtopuserbyhost:searchtopuserbyhost,
		searchtopmimebyuser:searchtopmimebyuser,
		searchtopuserbymime:searchtopuserbymime,
		downloadfile :downloadfile,
		typeofrptinfo : typeofrptinfo,
		show_hide_rpt_nav : show_hide_rpt_nav,
		show_search_panel : show_search_panel,
		rpt_menu_mouseout : rpt_menu_mouseout,
		rpt_menu_mouseover : rpt_menu_mouseover,
		searchtopsitebymime : searchtopsitebymime,
		rpt_mainmenu_mouseover : rpt_mainmenu_mouseover,
		rpt_update : rpt_update,
		rpt_get_cache : rpt_get_cache
	};
	
}();
function step_report_store (in_rpt_cache_currentpage,in_rpt_cache_pagesize,in_rpt_cache_topic,in_rpt_cache_topicby,in_rpt_cache_time,in_rpt_cache_starttime,in_rpt_cache_endtime,in_rpt_nav_sort,in_rpt_item_display,in_rpt_cache_pre_button,in_rpt_cache_next_button){
	
	if (typeof in_rpt_cache_currentpage == 'undefined')
		this.currentpage = 1
	else
	{
		this.currentpage = in_rpt_cache_currentpage;
	}	
	
	if (typeof in_rpt_cache_pagesize == 'undefined')
		this.rpt_cache_pagesize = 20; //value default
	else
		this.rpt_cache_pagesize = in_rpt_cache_pagesize;
		
	//topic : topuser , tophost, topmime .......
	this.rpt_cache_topic = in_rpt_cache_topic;
	
	//topicby : filter .........
	if (typeof in_rpt_cache_topicby == 'undefined')
		this.rpt_cache_topicby = "";
	else	
		this.rpt_cache_topicby = in_rpt_cache_topicby;
	
	//topic time : daily,monthly,yearly,......
	this.rpt_cache_time = in_rpt_cache_time;
	// starttime endtime : from when to when
	this.rpt_cache_starttime = in_rpt_cache_starttime;
	this.rpt_cache_endtime = in_rpt_cache_endtime;
	
	// rpt sort
	if (typeof in_rpt_nav_sort == 'undefined')
		this.rpt_nav_sort = 'host';
	else
	{
		this.rpt_nav_sort = in_rpt_nav_sort;
	}
	
	//item dispaly
	this.item_msg = in_rpt_item_display;
	this.hasnext = in_rpt_cache_next_button;
	this.hasprev = in_rpt_cache_pre_button;	
};

var report_level = function()
{
	var linkhtml;
	
	// pathlink will be seperate by ,
	// Level : 0 
	
	function gettext(keytext)
	{
		
		if (keytext == 'topuser')
			return  "Top User";
		
		if (keytext == 'tophost')
			return "Top Site";
		
		if (keytext == 'topmime')
			return "Top Mime";
		
		if (keytext == 'tophostbyuser')
			return "Top Site By User";
		
		if (keytext == 'topdestinationbymime')
			return "Top Site By Mime";
		
		if (keytext == 'topusersbyhost')
			return "Top User By Site";
		
		if (keytext == 'topuserbymime')
			return "Top User By Mime";
		
		if (keytext == 'topmimebyuser')
			return "Top Mime By User";
			
	}
	
	//This one for default value.
	function init()
	{
		var currentpage = $('#rpt_nav_currentpage').val();
		var topic = $('#rpt_nav_topic').val();
		var topicby = $('#rpt_nav_topic_by').val();
		var pagesize = $('#rpt_nav_page_size').val();
		var nav_time = $('#rpt_nav_time').val();
		var start_time = $('#rpt_nav_starttime').val();
		var end_time = $('#rpt_nav_endtime').val();
		var sort = $('#rpt_nav_sort').val();
		var itemmsg = $('.item_display').val();
		var type1 = "data_0";
		
		var info = new step_report_store(currentpage,pagesize,topic,topicby,nav_time,start_time,end_time,sort,itemmsg,false,false);
		$("#rpt_cache").data(type1,info);
		$('#rpt_link').html('<b>Top User > <b/>');
	}
	
	function showlink(level,pathlink,info,namefilter)
	{
		var linkhtml = "";
		var arraypath = [];
		arraypath = pathlink.split(',');
		var i = 0; 
		
		for (i=0 ; i< arraypath.length;i++)
		{
			var valuetemp = i + "-" + pathlink + "-" + namefilter ;
			var txt;
			
			if (i == 0) 
				txt = gettext(arraypath[i]); 
			else
				txt = gettext(arraypath[i]) + "("+ namefilter +")";
			
//			if (level == 0)
//			{
//				linkhtml = linkhtml + "<b><span>" + txt + "</span></b> > ";
//				break;
//			}
//			
//			else
//			{	
//				if (level == i)
//				{
//					linkhtml = linkhtml + "<b><span>" + txt + "</span></b> > ";
//				}
//				else
//				{
//					linkhtml = linkhtml + "<b><span>" + "<a href='#' value='"+ valuetemp +"'" +" onclick='return report_level.getcache(this);'>" + txt + "</a>" + "</span> > </b>";
//				}
//			}
			
			if (i == arraypath.length -1)
				linkhtml = linkhtml + "<b><span>" + txt + "</span></b> > ";
			else
				linkhtml = linkhtml + "<b><span>" + "<a href='#' value='"+ valuetemp +"'" +" onclick='return report_level.getcache(this);'>" + txt + "</a>" + "</span> > </b>";
				
		}
		
		if ((level == 0) && (arraypath.length==1))
		{
			rpt_remove_cache();
		}
		
		savecache(level,info);
		return linkhtml;
	}
	
	//remove 
	function rpt_remove_cache()
	{
		type1 = "data_0";
		type2 = "data_1";
		
		$("#rpt_cache").removeData(type1);
		$("#rpt_cache").removeData(type2);
	}
	
	function get_level(topic)
	{
		if (topic == 'topuser') 
			return '0';
		if (topic == 'tophost')
			return '0';
		if (topic== 'topmime')
			return '0';
	
		return '1';
	}
	
	//
	function savecache(level,info)
	{
		type = "data_" + level;
		$("#rpt_cache").data(type,info);
	}
	
	//
	function getcache(obj)
	{
		
		lstobj = $(obj).attr('value');
		lstarray = [];
		
		aa = lstobj.split('-');
		
		level = aa[0];
		pathlink = aa[1];
		name1 = aa[2];
		
		level_type = "data_" + level;
	
		infosetting = $("#rpt_cache").data(level_type);
		
		data = getdata_from_cache(infosetting);
		
		console.log(data);
		report.rpt_get_cache(data,level,pathlink,name1);
		//update_control(infosetting);
		
		//report.typeofrptinfo();
		//report.rpt_update(level,pathlink,name1);
		
		//todo update level == -1 , here
	}
	
	function getdata_from_cache(infosetting)
	{
		// Note : the data to sent server will be included
			
		// topic var : value of what you want to search
		// Ex : Top_user,Top_host,Top_User_By_Host......
			
		// timescale : value of time that you want to search
		// Ex : Today, last 7 days , last 30 days ......
			
		// pagesize : value of item in a page that you want to display.
			
		// currentpage : 
			
		// sortfield : What kind of field you want to sort
		// EX : Top_User : you want to sort duration time , or request or byte........ 
		
		var curpage = infosetting.currentpage;
		var sizepage = infosetting.rpt_cache_pagesize ;
		var topic = infosetting.rpt_cache_topic;
		var topicby = infosetting.rpt_cache_topicby;
		var starttimescale = infosetting.rpt_cache_starttime;
		var endtimescale = infosetting.rpt_cache_endtime;
		var timescale = infosetting.rpt_cache_time;
		var sortfield = infosetting.rpt_nav_sort;
			
		data = 
		{
			'currentpage' : curpage,
			'sizepage'    : sizepage,
			'topic'		  : topic,
			'topicby' 	  : topicby,	
			'timescale'   : timescale,
			'starttimescale' : starttimescale,
			'endtimescale' : endtimescale,
			'sortfield'   : sortfield
		};
			
		return data;
	}
	
	//
	function update_control(infosetting)
	{
		try 
		{
			$("#rptwebusage_type").val(infosetting.rpt_cache_topic);
			$("#rptsearch_time").val(infosetting.rpt_cache_time);
			$("#rptcustom_start").val(infosetting.rpt_cache_starttime);
			$("#rptcustom_end").val(infosetting.rpt_cache_endtime);
			$("#rptwebsecurity_nbrofrow").val(infosetting.rpt_cache_pagesize);
			
			var topic = infosetting.rpt_cache_topic;
			
			if (topic == 'tophostbyuser')
				$('#rptwebusage_user').val(infosetting.rpt_cache_topicby);
			if (topic == 'topusersbyhost')
				$('#rptwebusage_host').val(infosetting.rpt_cache_topicby);
			if (topic == 'topuserbymime')
				$('#rptwebusage_userbymime').val(infosetting.rpt_cache_topicby);
			if (topic == 'topmimebyuser')
				$('#rptwebusage_mimebyuser').val(infosetting.rpt_cache_topicby);
			if (topic == 'topdestinationbymime')
				$('#rptwebusage_destinationbymime').val(infosetting.rpt_cache_topicby);
				
		}
		catch(err)
		{
			$("#rptwebusage_type").val('topuser');
			$("#rptsearch_time").val('today');
			$("#rptcustom_start").val('');
			$("#rptcustom_end").val('');
			$("#rptwebsecurity_nbrofrow").val('20');
			
			alert(error);
		}
	}
	
	return {
		showlink:showlink,
		getcache:getcache,
		get_level:get_level,
		savecache:savecache,
		init:init,
		gettext : gettext,
	}
	
}();



//var report_cache = function()
//{
//	rpt_cache_position = -1;
//	
//	function check_cache_back()
//	{
//		nbritem = get_cache_count_item();
//		if ((rpt_cache_position > 0) && (nbritem>=2))
//		{
//			$("#rpt_back_catch").show();
//		}
//		else
//		{
//			$("#rpt_back_catch").hide();
//		}
//	}
//	
//	function check_cache_next()
//	{
//		nbritem = get_cache_count_item();
//		
//		if (rpt_cache_position +1 < nbritem)
//		{
//			$("#rpt_next_catch").show();
//		}
//		else
//		{
//			$("#rpt_next_catch").hide();
//		}
//	}
//	
//	function get_cache_count_item()
//	{
//		var cache_data = $("#rpt_catch").data();
//		var nbr = 0 ;
//		
//		for (obj in cache_data) 
//			nbr = nbr + 1;
//		
//		return nbr;
//	}
//	
//	function add_cache_data(lstobj,infosetting)
//	{
//		var indexvar = rpt_cache_position + 1; 
//		var index_cache = "position" + indexvar;
//		var a = "tinh" + indexvar; 
//		
//		var lstArray = new Array();
//		lstArray[0] = lstobj;
//		lstArray[1] = infosetting;
//		
//		//var obj1 = new StepStore(a,a,a,a,a,a,a,a); 
//		$("#rpt_catch").data(index_cache,lstArray);
//		rpt_cache_position = rpt_cache_position + 1;
//	}
//	
//	function store_cache_data(lstobject,infosetting)
//	{
//		nbritem = get_cache_count_item() - 1;
//		
//		if (nbritem < 0)
//		{
//			rpt_cache_position= -1;
//			add_cache_data(lstobject,infosetting);
//			check_cache_back();
//			check_cache_next();
//			return;
//		}
//		
//		if (nbritem == rpt_cache_position)
//		{
//			add_cache_data(lstobject,infosetting);
//		}
//		
//		else if (rpt_cache_position > nbritem)
//		{
//			rpt_cache_position =nbritem;
//			add_cache_data(lstobject,infosetting);
//		}
//		
//		else if (rpt_cache_position < nbritem)
//		{
//			var indexrm = rpt_cache_position + 1;
//			
//			for (indexrm ; indexrm <= nbritem;indexrm ++)
//			{
//				var index_cache = "position" + indexrm;
//				$("#rpt_catch").removeData(index_cache);
//				
//			}
//			add_cache_data(lstobject,infosetting);
//		}
//		check_cache_back();
//		check_cache_next();	
//		
//	}
//	
//	function get_cache_data(status)
//	{
//		var indexvar;
//		
//		if (status == "back")
//		{
//			indexvar = rpt_cache_position - 1;
//			rpt_cache_position = rpt_cache_position - 1;
//		}
//		
//		if (status == "next")
//		{
//			indexvar = rpt_cache_position + 1;
//			rpt_cache_position = rpt_cache_position + 1;
//		}
//				
//		var index_cache = "position" + indexvar;
//		
//		var lstArray =  $("#rpt_catch").data(index_cache);
//		
//		lstobj = lstArray[0];
//		infosetting = lstArray[1];
//		
//		$("#rpt_list").empty();
//		$("#rpt_list").append(lstobj);
//		
//		update_control(infosetting);
//		
//		check_cache_back();
//		check_cache_next();
//	}
//	
//	function update_control(infosetting)
//	{
//		$("#rptwebusage_type").val(infosetting.rpt_cache_topic);
//		$("#rptsearch_time").val(infosetting.rpt_cache_time);
//		$("#rptcustom_start").val(infosetting.rpt_cache_starttime);
//		$("#rptcustom_end").val(infosetting.rpt_cache_endtime);
//		$("#rptwebsecurity_nbrofrow").val(infosetting.rpt_cache_pagesize);
//		
//		// This one update for hidden 
//		$('#rpt_nav_currentpage').val(infosetting.currentpage);
//		$('#rpt_nav_topic').val(infosetting.rpt_cache_topic);
//		$('#rpt_nav_topic_by').val(infosetting.rpt_cache_topicby);
//		$('#rpt_nav_page_size').val(infosetting.rpt_cache_pagesize);
//		$('#rpt_nav_time').val(infosetting.rpt_cache_time);
//		$('#rpt_nav_starttime').val(infosetting.rpt_cache_starttime);
//		$('#rpt_nav_endtime').val(infosetting.rpt_cache_endtime);
//		$('#rpt_nav_sort').val(infosetting.rpt_nav_sort);
//		
//		//this update for navigation.
//		report.show_hide_rpt_nav(infosetting);
//		
//		report.typeofrptinfo();
//	}
//	
//	
//	return{
//		store_cache_data : store_cache_data,
//		get_cache_data : get_cache_data
//	};
//	
//}();

var stat = (function()
{
	var info = "ui-state-highlight ui-corner-all";
	var info_icon = "ui-icon ui-icon-check";
	var error = "ui-state-error ui-corner-all";
	var error_icon = "ui-icon ui-icon-alert";

	function show_status(arg, msg)
	{
		var id = "#status-panel";
		var p = "#status_msg";
		var opt = {};
		if (arg == 0)
		{
			set_info_class(id);
			$(p).html(msg);
			$(id).show('blind', opt, 'fast',
					function()
					{
						setTimeout(function()
						{
							$(id).hide('slide', opt, 500, null);
						}, 5000);
					});
		}

		else
		{
			set_error_class(id);
			$(p).html(msg);
			$(id).show();
		}
	}

	function set_info_class(id)
	{
		var div = id + '_outer';
		var span = id + '_inner';
		remove_status_class(div, span);
		$(div).addClass(info);
		$(span).addClass(info_icon);
	}

	function set_error_class(id)
	{
		var div = id + '_outer';
		var span = id + '_inner';
		remove_status_class(div, span);
		$(div).addClass(error);
		$(span).addClass(error_icon);
	}

	function remove_status_class(div, span)
	{
		if ($(div).hasClass(info))
		{
			$(div).removeClass(info);
			$(span).removeClass(info_icon);
		}

		if ($(div).hasClass(error))
		{
			$(div).removeClass(error);
			$(span).removeClass(error_icon);
		}
	}

	return {
		show_status:show_status
	};
}());
var user = (function()
{
	var save_url = "/defuser/save/pwd/";
	
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
		var data = {
				password: $("#id_password").val()
		}
		
		return data;
	}
	
	function init()
	{
		$("#id_password").val("**********");
		$(".save_button.save").click(func_save);
		utils.bind_hover($(".save_button"));
	}
	
	function load()
	{
		return menu.get(save_url, init);
	}
	
	return {
		load:load
	}
}());
var utils = (function()
{
	var typing_timer;
	var done_typing_interval = 2000;
	var tooltip_timer;
	var tooltip_delay = 5000;
	var accesstype = {
			admin: 2,
			normal: 1
	};

	/**
	 * @public
	 * This function makes the selected id to appear as popup dialog to show alert message.
	 * @param id The element id.
	 */
	function init_alert_dialog(id)
	{
		$(id).dialog({
			autoOpen: false,
			modal: true,
	        buttons: {
	            OK: function() {
	                $(this).dialog("close");
	            }
	        }
	    });
	}

	/**
	 * @public
	 * This function monitor the progress of an ajax request by showing the progress Loading ...
	 */
	function init_progress()
	{
		$("#progress_status").ajaxSend(
				function(evt, jqXHR, ajaxOptions)
				{
					if (ajaxOptions.url.indexOf(log.run_url) == 0 ||
						ajaxOptions.url.indexOf(dashboard.data_url) == 0 ||
						ajaxOptions.url.indexOf(patchupgrade.upgrade_log_run_url) == 0 ||
						ajaxOptions.url.indexOf(patchupgrade.checkserver_url) == 0)
						return;
						
					$(this).show();
				});
		$("#progress_status").ajaxComplete(
				function()
				{
					$(this).hide();
				});
	}

	/**
	 * @public
	 * This function makes the element error-dialog to appear as popup dialog.
	 * It also attach the ajaxError event to monitor ajax error.
	 */
	function init_server_error_dialog()
	{
		$(document).ajaxError(
				function(evt, jqXHR, ajaxOptions, errorThrown)
				{
					if (ajaxOptions.url.indexOf(dashboard.data_url) == 0 ||
						ajaxOptions.url.indexOf(patchupgrade.checkserver_url) == 0)
						return;

					show_error_dialog(jqXHR.responseText);
				});
		$("#error-dialog").dialog({
			autoOpen: false,
			modal: true,
			width: 700,
			height: 500,
			buttons: {
				OK: function() {
					$(this).dialog("close");
				}
			}
		});
	}

	/**
	 * @public
	 * This function makes the selected id to appear as list panel which appears on the left, replacing the menu.
	 * @param id The element id.
	 * @param func_close the function to be called when it close.
	 */
	function init_list_panel(id, func_close)
	{
		var menu = get_menu_attr();
		var menu_pos = [menu.left, menu.top];
		$(id).dialog({
			autoOpen: false,
			width: menu.width - 3,
			resizable: false,
			draggable: true,
			modal: false,
			stack: false,
			zIndex: 1000,
			position: menu_pos,
			close: func_close
		});
	}

	/**
	 * @public
	 * This function makes the selected id to appear as popup dialog.
	 * @param id The element id.
	 */
	function init_confirm_delete(id)
	{
		$(id).dialog({
			autoOpen: false,
			modal: true
		});
	}
	
	/**
	 * @public
	 * This function makes the element panel_tooltip to appear as a popup tooltip.
	 * @param url The url to get the json data to be populated on the tooltip.
	 */
	function init_panel_tooltip(url)
	{
		$("#panel_body > .list_row").mouseout(function()
				{
					if (tooltip_timer)
						clearTimeout(tooltip_timer);
						
					tooltip_timer = setTimeout(function()
							{
								$("#panel_tooltip").hide();
							}, tooltip_delay);
				});
		$("#panel_body > .list_row").mouseenter(function(evt)
				{
					if (tooltip_timer)
						clearTimeout(tooltip_timer);
						
					var o = $(this);
					var menu = $("#menu");
					var id = o.attr('id');
					var pos = o.offset();
					var width = o.width();
					var left = menu.width() * 2 + 50;
					var top = pos.top + 10;
					
					$("#panel_tooltip_body").empty();
					
					$.getJSON(url, {id: id},
							function(result)
							{
								if (result.id == id)
								{
									$("#panel_tooltip_body").html(result.content);
									$("#panel_tooltip").position({
										my: 'center',
										at: 'left',
										of: $("body"),
										offset: left + ' ' + top
									});
									$("#panel_tooltip").show();
								}
							});
				});
		$("#panel_tooltip").mouseenter(function()
				{
					if (tooltip_timer)
						clearTimeout(tooltip_timer);
				});
		$("#panel_tooltip").mouseout(function()
				{
					if (tooltip_timer)
						clearTimeout(tooltip_timer);
						
					tooltip_timer = setTimeout(function()
							{
								$("#panel_tooltip").hide();
							}, tooltip_delay);
				});
	}

	/**
	 * @public
	 * This function checks whether an item already exist in an array.
	 * @param item The item to be checked.
	 * @param arr The array to be examined.
	 * @return true if the item exist, false otherwise.
	 */
	function item_exist(item, arr)
	{
		var i = $.inArray(item, arr);
	    return (i >= 0 ? true : false);
	}

	/**
	 * @public
	 * This function removes a dialog specified by the dialog id.
	 * @param id The dialog id.
	 */
	function remove_dialog(id)
	{
		$(id).dialog('destroy');
		$(id).remove();
	}

	/**
	 * @public
	 * This function removes all the dialogs from the DOM.
	 */
	function clear_dialogs()
	{
		remove_dialog("div[id^='dialog-message']");
		remove_dialog("div[id^='list-panel']");
		remove_dialog("div[id^='confirm']");
		remove_dialog("div[id^='dialog']");
	}

	/**
	 * @public
	 * This function closes the form that appears on the left side of a list page.
	 */
	function cancel_form()
	{
		$("#left_box").hide();
	}

	/**
	 * @public
	 * This function closes the popup dialog from the current form.
	 * @param level The current level of a dialog.
	 * @param dialog_id The dialog id.
	 */
	function cancel_dialog(level, dialog_id)
	{
		var i = level - 1;
		var prefix = (i < 1 ? '' : '_' + i);
		$(dialog_id + prefix).dialog('close');
	}

	/**
	 * @public
	 * This function shows a message in a popup dialog.
	 * @param arg The parameter to determine whether to show html (1) or plain text (2) message.
	 * @param msg The message.
	 */
	function show_dialog(arg, msg)
	{
		if (arg == 1)
			$("#dialog_msg").html(msg);

		else
			$("#dialog_msg").text(msg);

	    $("#dialog-message").dialog('open');
	}

	/**
	 * @public
	 * This function shows the error message in a popup dialog.
	 * @param msg The error message.
	 */
	function show_error_dialog(msg)
	{
		$("#error_dialog").html(msg);
		$("#error_dialog style").remove();
		$("#error-dialog").dialog('open');
	}

	/**
	 * @public
	 * This function binds the hover event to the selected object.
	 * @param selector The object selected using $
	 */
	function bind_hover(selector)
	{
		selector.hover(
				function()
				{
					$(this).toggleClass('ui-state-hover');
				},
				function()
				{
					$(this).toggleClass('ui-state-hover');
				});
	}
	
	/**
	 * @public
	 * This function makes a list of checkboxes to allow only 1 item to be selected.
	 * @param selector The list of checkboxes selected using $
	 */
	function set_mutual_exclusive(selector)
	{
		selector.click(
				function()
				{
					if (this.checked)
						selector.not(this).removeAttr('checked');
				});
	}

	/**
	 * @public
	 * This function returns the form level from a given form id.
	 * e.g if the form id is save-form-profile_2,
     * the form level will be 2
	 * @param id The form id.
	 * @return The form level.
	 */
	function get_form_level(id)
    {
        var i = id.indexOf('_');
        if (i < 0)
            return 0;

        var s = id.substr(i + 1);
        return parseInt(s, 10);
    }

    /**
     * @public
     * This function returns the form scope from a given form id.
     * e.g if the form id is save-form-profile_1,
     * the form scope will be profile
     * @param id The form id.
     * @return The form scope.
     */
    function get_form_scope(id)
    {
    	var i = id.lastIndexOf('-');
    	var j = id.lastIndexOf('_');
    	if (i < 5)
    		return '';

    	else if (id.indexOf('export-form') == 0 && i < 7)
    		return '';

    	else
    		return id.substring(i + 1, j);
    }

    /**
     * This function returns the previous form level from a given form id.
     * e.g if the form id is save-form-profile_2,
     * the previous form level will be 1
     * @param id The form id.
     * @return The previous form level.
     */
	function get_prev_form_level(id)
	{
		var i = get_form_level(id);
		return (i > 0 ? i - 1 : 0);
	}

	/**
	 * @public
	 * This function returns the next form level from a given form id.
	 * e.g if the form id is save-form,
	 * the next form level will be 1
	 * @param id The form id.
	 * @return The next form level.
	 */
    function get_next_form_level(id)
    {
    	var i = get_form_level(id);
    	return i + 1;
    }

    /**
     * @public
     * This function returns the prefix of a form id from a given form id.
     * e.g if the form id is save-form_1,
     * the prefix will be _1
     * @param id The form id.
     * @return The prefix of a form id.
     */
    function get_prefix(id)
    {
    	var p = get_form_level(id);
    	return (p == 0 ? '' : '_' + p);
    }

    /**
     * @public
     * This function sets the data associated with the object selected by jQuery.
     * @param selector The object selected using $
     * @param key The key associated with the data.
     * @param arr The object to be stored.
     */
	function set_data(selector, key, arr)
	{
		selector.removeData(key);
		selector.data(key, arr);
	}

	/**
	 * @public
	 * This function executes the specified function when the typing interval has elapsed.
	 * @param func The function to be executed.
	 */
	function countdown_filter(func)
	{
		stop_filter_timer();
		typing_timer = setTimeout(func, done_typing_interval);
	}

	/**
	 * @public
	 * This function stops the typing timer.
	 */
	function stop_filter_timer()
	{
		clearTimeout(typing_timer);
	}

	/**
	 * @public
	 * This function gets the parent object from a given selector and the level to be traversed.
	 * @param arg The jQuery selector.
	 * @param level The level to be traversed from the current selected object.
	 * @return The parent object.
	 */
	function get_parent(arg, level)
	{
		var o = $(arg);
		for (var i = 0; i < level; i++)
			o = o.parent();

		return o;
	}

	/**
	 * @public
	 * This function add dragging css class.
	 */
	function add_drag_css(evt, ui)
	{
		$(".ui-draggable-dragging").addClass("ui-state-hover");
	}

	/**
	 * @public
	 * This function remove dragging css class.
	 */
	function remove_drag_css(evt, ui)
	{
		$(".ui-draggable-dragging").removeClass("ui-state-hover");
	}

	/**
	 * @public
	 * This function makes a list of div elements to have alt row color.
	 * @param id The jQuery selector.
	 */
	function set_alt_css(id)
	{
		$(id + " > div").removeClass("ui-state-default");
		$(id + " > div").removeClass("ui-state-hover");
		$(id + " > div:odd").addClass("ui-state-default");
		$(id + " > div:even").addClass("ui-state-hover");
	}

	/**
	 * @public
	 * This function returns the id from a given element id.
	 * e.g if the element id is item_1,
	 * the id will be 1
	 * @param arg The element id.
	 * @return The id.
	 */
	function get_itemid(arg)
	{
		var i = arg.indexOf('_');
		if (i >= 0)
		{
			var s = arg.substr(i + 1);
			return parseInt(s, 10);
		}

		return -1;
	}

	/**
	 * @public
	 * This function returns the form errors in html after validation.
	 * @param errors The list of errors.
	 * @return The form errors in html.
	 */
	function get_errors(errors)
	{
		var data = {
				errors: errors
		};
		var h = new EJS({url: '/media/tpl/form_error.ejs'}).render(data);
		return h;
	}

	/**
	 * @public
	 * This function returns the cookie's value from a given cookie's name.
	 * @param name The cookie's name.
	 * @return The cookie's value.
	 */
	function get_cookie(name)
    {
        var cookieValue = null;
        if (document.cookie && document.cookie != '')
        {
            var cookies = document.cookie.split(';');
            for (var i = 0; i < cookies.length; i++)
            {
                var cookie = jQuery.trim(cookies[i]);
                // Does this cookie string begin with the name we want?
                if (cookie.substring(0, name.length + 1) == (name + '='))
                {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }

        return cookieValue;
    }

    /**
     * @public
     * This function returns the top position relative to the document's scroll top position.
     * @param v The object's offset.top
     * @return The relative top position.
     */
	function get_elm_top(v)
	{
		return v - $(document).scrollTop();
	}

	/**
	 * @private
	 * This function returns the left menu's attributes :
	 * width, left, top.
	 * @return The menu's attributes.
	 */
	function get_menu_attr()
	{
		var menu = $("#menu");
		
		var menu_width = menu.width();
		menu_width += 5;
		var menu_offset = menu.offset();
		var menu_left = menu_offset.left;
		var menu_top = menu_offset.top;
		menu_left -= 5;

		return {
			width: menu_width,
			left: menu_left,
			top: menu_top
		};
	}
	
	/**
	 * @public
	 * This function turns on the wizard.
	 * @param status
	 */
	function switch_wizard(status)
	{
		try
		{
			var url_profile_switch = "/wizard_profile_switch/";
			var data = {'status': status};
			
			$.post(url_profile_switch, data,
					function(result)
					{
						if (result.status == "success")
						{
							window.location.replace('/wizardReRun/');
						}
					
						if (result.status == "error")
						{
							alert(result.error_info);
						}
					});
		}
		
		catch (err)
		{
			alert(err.message);
		}
	}
	
	return {
		init_alert_dialog:init_alert_dialog,
		init_progress:init_progress,
		init_server_error_dialog:init_server_error_dialog,
		init_list_panel:init_list_panel,
		init_confirm_delete:init_confirm_delete,
		init_panel_tooltip:init_panel_tooltip,
		item_exist:item_exist,
		remove_dialog:remove_dialog,
		clear_dialogs:clear_dialogs,
		cancel_form:cancel_form,
		cancel_dialog:cancel_dialog,
		show_dialog:show_dialog,
		show_error_dialog:show_error_dialog,
		bind_hover:bind_hover,
		set_mutual_exclusive:set_mutual_exclusive,
		get_form_level:get_form_level,
		get_form_scope:get_form_scope,
		get_next_form_level:get_next_form_level,
		get_prefix:get_prefix,
		set_data:set_data,
		typing_timer:typing_timer,
		done_typing_interval:done_typing_interval,
		tooltip_timer:tooltip_timer,
		tooltip_delay:tooltip_delay,
		accesstype:accesstype,
		countdown_filter:countdown_filter,
		stop_filter_timer:stop_filter_timer,
		get_parent:get_parent,
		add_drag_css:add_drag_css,
		remove_drag_css:remove_drag_css,
		set_alt_css:set_alt_css,
		get_itemid:get_itemid,
		get_errors:get_errors,
		get_cookie:get_cookie,
		get_elm_top:get_elm_top,
		switch_wizard:switch_wizard
	};
}());

$.ajaxSetup({
	cache: false
});
/*
 * @include "wpprofile.js"
 * @include "defnet.js"
 * @include "wpcat.js"
 * 
 */

var wizard = (function(){
	/* region var */
	
	var url_next = "/wizard_setup_next/";
	var url_back = "/wizard_setup_back/";
	var url_skip = "/wizard_skip/";
	
	var url_import_setting = "/wizard_import_settings/";
	var url_test_import = "/wizard_import_test/";
	
	var url_check_IPRange = "/wizard_check_IPRange/";
	var url_open_add_group = "/wizard_open_add_group/";
	var url_open_edit_group = "/wizard_open_edit_group/";
	
	var url_save_new_group = "/wizard_save_group/"; 
	var url_save_new_user = "/wizard_save_user/";
	
	var url_wizard_delete_tempuser = "/wizard_delete_tempuser/";
	
	var url_get_listuser= "/wizard_getlistuser/";  
	
	var url_open_dialog_policy = "/wizard_open_dialog_policy/";
	
	//store the which policy is used
	var url_wizard_save_policy = "/wizard_save_policy/";
	
	var url_wizard_open_profile = "/wizard_open_profile/";
	
	var url_save_schedule = "/wizard_save_schedule/";
	var url_search_info_profile = "/wizard_search_profile/";
	
	var url_save_defnet = "/wizard_save_defnet/";
	var url_show_defnet_level2 = "/wizard_show_defnet_level2/"; 
	
	var url_profile_save = "/wizard_profile_save/";
	var url_profile_load = "/wizard_load_wpprofile/";
	var url_profile_create = "/wizard_create_profile/";
	
	var NotUsed = 'Notused';
	var header_Username = 'Username';
	var header_Typeaccess = 'Typeaccess';
	var header_Dispalyname = 'Dispalyname';
	var header_Pass = "Password";
	var header_Comment = 'Comment';
	var header_Group ='Group';
	
	var profile_schedules = 'schedules';
	var profile_defnet = 'defnet';
	var profile_users = 'defusers';
	
	var signal = "||*||*||*||";
	
	var is_finished = 0;
	
	var TITLE_SETTING_FIELDS = "Fields Setting"; 
	var TITLE_ERROR_INFO = 'Error Info';
	var TITLE_TEST_IMPORT = "Test Import Result";
	var TITLE_ADD_PROFILE = "Create New Profile";
	var TITLE_EDIT_PROFILE = "Edit Profile";
	var TITLE_LIST_PROFILE = "Profile List";
	
	/* endregion */
		
	/* region show error*/
	function init_dialog_error()
	{
		$("#wizard_error_info").dialog(
				{title: TITLE_ERROR_INFO,
					autoOpen: false ,
					modal: true,
					width:200});
	}
	
	function show_error_dialog(error_info)
	{
		$("#wizard_error_content_info").html("");
		$("#wizard_error_content_info").html(error_info);
		$("#wizard_error_info").dialog("open");
	}
	
	function close_dialog(name)
	{
		$("#" + name).dialog("close");
	}
	
	/* endregion */
		
	/* region  dialog*/
	
	function profile_dialog(type)
	{
		popup_dialog_opt = {
				autoOpen: false,
	       		modal: false,
	       		width:520,
	       		zIndex: 1000
			};
		
		if (type == "add")
		{
			popup_dialog_opt['title']  = TITLE_ADD_PROFILE;
		}
		else
		{
			popup_dialog_opt['title']  = TITLE_EDIT_PROFILE;
		}
			
		return popup_dialog_opt;
	}
	
	function list_search_dialog()
	{
		popup_dialog_opt = {
	       		autoOpen: false,
	       		modal: false,
	       		width:200,
	       		position:[0, 0]
	   		};
	   		
	   	return popup_dialog_opt;
	}
	
	function schedule_dialog()
	{
		popup_dialog_opt = {
				autoOpen: false,
				width: 340,
				resizable: false,
				draggable: true,
				modal: true,
				stack: false,
				zIndex: 10000
		};
		
		return popup_dialog_opt;
	}
	
	function host_dialog()
	{
		popup_dialog_opt = {
				autoOpen: false,
				width: 320,
				resizable: false,
				draggable: true,
				modal: true,
				stack: false,
				zIndex: 10000
		};
		
		return popup_dialog_opt;
	}
	
	function cat_dialog()
	{
		popup_dialog_opt = {
				autoOpen: false,
				width: 320,
				resizable: false,
				draggable: true,
				modal: true,
				stack: false,
				zIndex: 10000
		};
		
		return popup_dialog_opt;
	}
	
	function whitelist_dialog() 
	{
		popup_dialog_opt = {
				autoOpen: false,
				width: 320,
				resizable: false,
				draggable: true,
				modal: true,
				stack: false,
				zIndex: 10000
		};
		
		return popup_dialog_opt;
	}
	
	function backlist_dialog()
	{
		popup_dialog_opt = {
				autoOpen: false,
				width: 320,
				resizable: false,
				draggable: true,
				modal: true,
				stack: false,
				zIndex: 10000
		};
		
		return popup_dialog_opt;
	}
	
	function allow_ext()
	{
		popup_dialog_opt = {
				autoOpen: false,
				width: 320,
				resizable: false,
				draggable: true,
				modal: true,
				stack: false,
				zIndex: 10000
		};
		
		return popup_dialog_opt;
	}
	
	function blocked_ext()
	{
		popup_dialog_opt = {
				autoOpen: false,
				width: 320,
				resizable: false,
				draggable: true,
				modal: true,
				stack: false,
				zIndex: 10000
		};
		
		return popup_dialog_opt;
	}
	
	/* endregion */
		
	/* region getdata */
	
	function get_data_administrator_account()
	{
		var id_adpassword = $("#id_adpassword").val();
		var id_readpassword = $("#id_readpassword").val();
		var id_emailnotifier = $("#id_emailnotifier").val();
		var wizard_identification_form = $("#wizard_identification_form").val();
		var position_next = "0"; 
		
		data = {};
		
		data  = {
			"adpassword" : id_adpassword,
			"readpassword" : id_readpassword,
			"emailnotifier" : id_emailnotifier,
			"wizard_identification_form" : wizard_identification_form,
			"position_next" : position_next
		}
		
		return data;
	}
	
	//NetWork interface will include 3 form.
	//network_interfaces_definition.html
	//network_interfaces_definitiona.html
	//network_interfaces_definitionb.html
	function get_data_network_interfaces()
	{
		var position_next = $("input[name='options']:checked").val();
		var wizard_identification_form = $("#wizard_identification_form").val();
		
		data = {}
		
		data = {
			"position_next" : position_next,
			"wizard_identification_form":wizard_identification_form 
		}
		
		return data;
	}
	
	function get_data_network_interfaces_a()
	{
		var data= {};
		
		//Get data from internal interfaces.
		var id_ipaddresslocal_internal = $("#id_ipaddresslocal_internal").val();
		var id_netmaskaddresslocal_internal = $("#id_netmaskaddresslocal_internal").val(); 
		var id_hardware_internal = $("#id_hardware_internal option:selected").attr('value');
		
		//Get data from external interfaces.
		var id_ipaddresslocal_external = $("#id_ipaddresslocal_external").val();
		var id_netmaskaddresslocal_external = $("#id_netmaskaddresslocal_external").val();
		var id_defaultgateway_external = $("#id_defaultgateway_external").val();
		var id_hardware_external = $("#id_hardware_external option:selected").attr('value');
		
		//Get name of form .
		var wizard_identification_form = $("#wizard_identification_form").val();
		var position_next = "0"; 
		
		data = {
			'ipaddresslocal_internal' : id_ipaddresslocal_internal,
			'netmaskaddresslocal_internal':id_netmaskaddresslocal_internal,
			'hardware_internal' : id_hardware_internal,
			
			'ipaddresslocal_external' : id_ipaddresslocal_external,
			'netmaskaddresslocal_external': id_netmaskaddresslocal_external,
			'defaultgateway_external' : id_defaultgateway_external,
			'hardware_external': id_hardware_external,
			
			'wizard_identification_form': wizard_identification_form,
			'position_next':position_next
		};
		
		return data;
	}
	
	function get_data_network_interfaces_b()
	{
		var data = {};
		
		var id_ipaddresslocal_external = $("#id_ipaddresslocal").val();
		var id_netmaskaddresslocal_external = $("#id_netmaskaddresslocal").val();
		var id_defaultgateway_external = $("#id_defaultgateway").val();
		var id_hardware_external = $("#id_hardware option:selected").attr('value');
		
		//Get name of form .
		var wizard_identification_form = $("#wizard_identification_form").val();
		var position_next = "0"; 
		
		data = {
				'ipaddresslocal' : id_ipaddresslocal_external,
				'netmaskaddresslocal' : id_netmaskaddresslocal_external,
				'defaultgateway' : id_defaultgateway_external,
				'hardware' : id_hardware_external,
				'wizard_identification_form': wizard_identification_form,
				'position_next' :position_next
		};
		
		return data;
	}
	
	
	function get_data_dns()
	{
		var data ={};
		
		var wizard_primarydns = $("#wizard_primarydns").val();
		var wizard_seconddns = $("#wizard_seconddns").val();
		var wizard_thirddns = $("#wizard_thirddns").val();
		
		//Get name of form .
		var wizard_identification_form = $("#wizard_identification_form").val();
		var position_next = "0"; 
		
		data = {
				'wizard_primarydns' : wizard_primarydns,
				'wizard_seconddns'  : wizard_seconddns,
				'wizard_thirddns' : wizard_thirddns,
				
				'wizard_identification_form' : wizard_identification_form,
				'position_next' : position_next 
				
		};
		
		return data;
	}
	
	function get_data_user_authenticate()
	{
		var data = {};
		var position_next = $("input[name='wizard_user']:checked").val();
		var wizard_identification_form = $("#wizard_identification_form").val();
		
		data = {
				'wizard_identification_form' : wizard_identification_form,
				'position_next' : position_next
		};
		
		return data;
	}
	
	function get_data_user_authentication_a()
	{
		var data = {};
		
		var id_adserver = $("#id_adserver").val();
		var id_addomain = $("#id_addomain").val();
		var id_adusername = $("#id_adusername").val();
		var id_adpassword = $("#id_adpassword").val();
		var id_confirmadpassword = $("#id_confirmadpassword").val();
		var position_next = "0";
		var wizard_identification_form = $("#wizard_identification_form").val();
		
		data = {
				'adserver' : id_adserver,
				'addomain' : id_addomain,
				'adusername' : id_adusername,
				'adpassword' : id_adpassword,
				'confirmadpassword' : id_confirmadpassword,
				'wizard_identification_form' : wizard_identification_form,
				'position_next' : "0"
		};
		
		return data;
	}
	
	function get_data_user_authentication_b()
	{
		var data = {};
		
		var wizard_import_header = $("#wizard_import_header").val();
		var wizard_imported_content = $.trim($("#wizard_imported_content").val());
		var wizard_seperate_field = $("#wizard_seperate_field").val();
		var wizard_default_pass_authb = $("#wizard_default_pass_authb").val();
		
		var wizard_identification_form = $("#wizard_identification_form").val();
		position_next = "0";
		
		data =
			{
				'wizard_import_header' : wizard_import_header,
				'wizard_imported_content' : wizard_imported_content,
				'wizard_seperate_field' : wizard_seperate_field,
				'wizard_identification_form' : wizard_identification_form,
				'position_next' : position_next,
				'wizard_default_pass_authb' :wizard_default_pass_authb
			};
		
		return data;
	}
	
	function get_internal_policy()
	{
		var data = {};
		
		var wizard_identification_form = $("#wizard_identification_form").val();
		position_next = "0";
		var f= $("#wizard_list_group_internetusage");
		sss = "";
		
		o = $("#wizard_content_list_group input[id=wizard_check_groupmain]:checked");
		
		$.each(o,function(index){
			if (sss == "")
			{
				sss = $(o[index]).attr("value"); 
			}
			else
			{
				sss = sss + "," + $(o[index]).attr("value");
			}
		});
		
		data =
			{
				'wizard_identification_form' : wizard_identification_form,
				'insertdept' : sss,
				'position_next' : position_next
				
			};
		
		is_finished = is_finished + 1;
		data["is_finished"] = is_finished; 
		return data;
	}
	
	function get_data_internal_user()
	{
		
		var arr_id_ = [];
		
		var form = $("#exceptusers");
		lst_id = $(form.find("#id_exceptusers")).children();
		
		$(lst_id).each(function(){
			var lstid = $(this).attr('id');
			var lsttext = [];
			lsttext = lstid.split('_');
			arr_id_.push(lsttext[1]);
		});
		
		return arr_id_.join(",");
	}
	
	function def_getdata_profile(form , namegroup , namepolicy , savetype)
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
		//var userinternals = form.find("#id_users").data('userinternals');
		//var userexternals = form.find("#id_users").data('userexternals');
		var allowexts = form.find("#id_allowexts").data('allowexts');
		var blockexts = form.find("#id_blockexts").data('blockexts');
		var allowmimes = form.find("#id_allowmimes").data('allowmimes');
		var blockmimes = form.find("#id_blockmimes").data('blockmimes');
		var categories = form.find("#id_categories").data('categories');
		var whitelist = form.find("#id_whitelist").data('whitelist');
		var blacklist = form.find("#id_blacklist").data('blacklist');
		var contents = form.find("#id_contents").data('contents');
		
		//var nets = form.find("#id_nets").data('nets');
		var exceptnets = except.find("#id_exceptnets").data('exceptnets');
		var excepturls = except.find("#id_excepturls").data('excepturls');
		var exceptuserinternals = except.find("#id_exceptusers").data('exceptuserinternals');
		var exceptuserexternals = except.find("#id_exceptusers").data('exceptuserexternals');
		var arrschedules = schedules.join(',');
		//var arruserinternals = userinternals.join(',');
		//var arruserexternals = userexternals.join(',');
		var arrallowexts = allowexts.join(',');
		var arrblockexts = blockexts.join(',');
		var arrallowmimes = allowmimes.join(',');
		var arrblockmimes = blockmimes.join(',');
		var arrcategories = categories.join(',');
		var arrwhitelist = whitelist.join(',');
		var arrblacklist = blacklist.join(',');
		var arrcontents = contents.join(',');
		//var arrnets = nets.join(',');
		var arrexceptnets = exceptnets.join(',');
		var arrexcepturls = excepturls.join('||');
		var arrexceptuserinternals = get_data_internal_user(); //exceptuserinternals.join(',');
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
				//userinternals: arruserinternals,
				//userexternals: arruserexternals,
				allowexts: arrallowexts,
				blockexts: arrblockexts,
				allowmimes: arrallowmimes,
				blockmimes: arrblockmimes,
				cats: arrcategories,
				whitelist: arrwhitelist,
				blacklist: arrblacklist,
				contentfilters: arrcontents,
				//nets: arrnets,
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
				save_type: savetype
		}

		return data;
	}
	
	function get_data()
	{
		var typedata = $("#wizard_identification_form").val();
		data = {};
		
		//This part is used for user authentication
		if (typedata == "administratoraccount")
			data = get_data_administrator_account();
		
		//this part is used for interface definition
		if (typedata == "networkinterfacesdefinition")
			data = get_data_network_interfaces();
		if (typedata == "networkinterfacesdefinitionA")
			data = get_data_network_interfaces_a();
		if (typedata == "networkinterfacesdefinitionB")	
			data = get_data_network_interfaces_b(); 
		
		if (typedata =="trusted_network_range")
			//data = get_data_trusted_network_range();
			  data = get_item_netstructed();
			  
		if (typedata == "dns")
			data = get_data_dns();
		
		if (typedata == "userauthentication")
			data = get_data_user_authenticate();
		
		if (typedata == "userauthenticationA")
			data = get_data_user_authentication_a();
		
		if (typedata == "userauthenticationB")
			data = get_data_user_authentication_b();
		
		if (typedata == "internet_usage_policy")
			data = get_internal_policy();
		
		return data;
	}
	
	/* endregion */
	
	/*
	 * This method is support for init form.
	 */
	
	function init_specified_form()
	{
		var wizard_identification_form = $("#wizard_identification_form").val();
		
		if (wizard_identification_form == "trusted_network_range")
		{
			init();
		}
		
		// Delete the dialog , when system don't use anymore ,
		if(wizard_identification_form == "internet_usage_policy")
		{
			$("#wizard_dialog").remove();
			$("#wizard_dialog_test").remove();
		}
		
		if(wizard_identification_form == "dns")
		{
			$("#list-panel").remove();
			$("#dialog-add-netlist").remove();
			$("#dialog-edit-netlist").remove();
		}
		
		// Close all the dialog.
		if (wizard_identification_form == "finished")
		{
			$(".ui-dialog-content").dialog("close");
			
		}
	}
	
	/* region action_of_next_back_and_skip */
	
	/*
	 * When user click next button.
	 */
	function next_form()
	{
		
		$("#wizard_finished_button").unbind('click');
		
		var data =  get_data();
		
		$.post(url_next,data , function(result){
			
			if (result.status == "success")
			{
				$("#wizard_content").empty();
				$("#wizard_content").append(result.form);	
				    
				$("#wizard_content_iprange").hide();
				
				utils.bind_hover($(".save_button.save"));
				
				init_specified_form();
				
				$("#list-panel").dialog("close");
				
				namefrm_new = $("#wizard_identification_form").val();
				
				if (namefrm_new == "networkinterfacesdefinition")
				{
					var	position_next = result.position_next;
						
					$('input[type=radio]').each(function(){
					      $(this).attr('checked',false);  
					 });
					
					name_input = 'input[value=' + position_next + ']'; 
					$(name_input).attr('checked',true);
				}
				
				//This part is used for dns form
				if (namefrm_new == "dns")
				{
					var wizard_primarydns = result.wizard_primarydns;
					var wizard_seconddns = result.wizard_seconddns;
					var wizard_thirddns = result.wizard_thirddns;
					
					$("#wizard_primarydns").val(wizard_primarydns);
					$("#wizard_seconddns").val(wizard_seconddns);
					$("#wizard_thirddns").val(wizard_thirddns);
				}
				
				//This part used for userauthentication
				if (namefrm_new == "userauthentication")
				{
					var	position_next = result.position_next;
					
					$('input[type=radio]').each(function(){
					      $(this).attr('checked',false);  
					 });
					
					name_input = 'input[value=' + position_next + ']';
					$(name_input).attr('checked',true);
				}
				
			}
			
			if (result.status == "error")
			{
				$("#wizard_error_info").html(result.error_info);
			}
			
		});
	}
	
	/*
	 * When user click back button
	 */
	function back_form()
	{
		data = {};
		
		var wizard_identification_form = $("#wizard_identification_form").val();
		
//		data = {
//				'wizard_identification_form' : wizard_identification_form
//			   };
			   
//		if(wizard_identification_form == "trusted_network_range") 
//		{
		data = get_data()
//		}
		
		$.post(url_back,data,function(result){
			
			if (result.status == "success")
			{
				$("#wizard_content").empty();
				$("#wizard_content").append(result.form);	
				
				namefrm_new = $("#wizard_identification_form").val();
				
				$("#list-panel").dialog("close"); 
				
				//This part is used for networkinterfacesdefinition form.
				if (namefrm_new == "networkinterfacesdefinition")
				{
					var	position_next = result.position_next;
					
					if ((position_next != "0") && (position_next != "1")) 
						position_next = "0";
						
					$('input[type=radio]').each(function(){
					      $(this).attr('checked',false);  
					 });
					
					name_input = 'input[value=' + position_next + ']'; 
					$(name_input).attr('checked',true);
				}
				
				//This part is used for dns form
				if (namefrm_new == "dns")
				{
					var wizard_primarydns = result.wizard_primarydns;
					var wizard_seconddns = result.wizard_seconddns;
					var wizard_thirddns = result.wizard_thirddns;
					
					$("#wizard_primarydns").val(wizard_primarydns);
					$("#wizard_seconddns").val(wizard_seconddns);
					$("#wizard_thirddns").val(wizard_thirddns);
				}
				
				//This part used for userauthentication
				if (namefrm_new == "userauthentication")
				{
					var	position_next = result.position_next;
				
					//because we have got 3 options here so 3 condictions.
					if ((position_next != "0") && (position_next != "1") && (position_next != "2")) 
						position_next = "0";
					
					$('input[type=radio]').each(function(){
					      $(this).attr('checked',false);  
					 });
					
					name_input = 'input[value=' + position_next + ']';
					$(name_input).attr('checked',true);
				}
				
				if(namefrm_new == "userauthenticationB")
				{
					var wizard_import_header = "";
					var wizard_imported_content = "";
					var wizard_seperate_field = "";
					var wizard_default_pass_authb = "";
					
					wizard_import_header = result.wizard_import_header;
					wizard_imported_content = result.wizard_imported_content;
					wizard_seperate_field = result.wizard_seperate_field;
					wizard_default_pass_authb = result.wizard_default_pass_authb; 
					
					$("#wizard_import_header").val(wizard_import_header);
					$("#wizard_imported_content").val(wizard_imported_content);
					$("#wizard_seperate_field").val(wizard_seperate_field);
					$("#wizard_default_pass_authb").val(wizard_default_pass_authb);
					
				}
				
				if(namefrm_new == "trusted_network_range") 
				{
					utils.set_alt_css("#netlist");
				}
				
				init_specified_form();
				
				utils.bind_hover($(".save_button.save"));
				
				$("#wizard_add_group").dialog("close");
				$("#wizard_profile_search").dialog("close");
				$("#wizard_add_member").dialog("close");
				$("#wizard_list_panel_user").dialog("close");
				$("#wizard_list_panel_policy").dialog("close");
				$("#wizard_dialog_profile").dialog("close");
				$("#wizard_dialog_profile").dialog("close");
				
				$("#wizard_profile_list_search").html("");
				$("#wizard_list_panel_content_user").html("");
				$("#wizard_dialog_content_profile").html("");
				
				
			}
			
			if ( result.status == "error")
			{
				$("#wizard_error_info").html(result.error_info);
			}
			
		});
	}
	
	/*
	 *  When user click skip button
	 */
	function skip_form()
	{
		data = {};
		
		var wizard_identification_form = $("#wizard_identification_form").val();
		
		data = {
				'wizard_identification_form' : wizard_identification_form
			   };
		
		$.post(url_skip,data,function(result){
			
			if (result.status == "success")
			{
				$("#wizard_content").empty();
				$("#wizard_content").append(result.form);
				
				utils.bind_hover($(".save_button.save"));
				
				init_specified_form();
			}
			
			if ( result.status == "error")
			{
				$("#wizard_error_info").html(result.error_info);
			}
			
		});
	}
	
	/* endregion */

	/* region action_import fields_user_group  */
	
	/*
	 * When user click on button import settings.
	*  Form to select field UserName,Password,Comment,...
	*  Select the which fields by combobox
	*  */
	function import_setting_field()
	{
		try
		{
			init_dialog_error()
			
			$("#wizard_dialog").dialog({title: TITLE_SETTING_FIELDS ,autoOpen: false ,modal: true,width:520});
			
			$.get(url_import_setting,data,function(result)
				{
					if (result.status == "success")
					{
						$("#wizard_setting").html("");
						$("#wizard_setting").html(result.form);
						$("#wizard_field1 td select").val("1");
						$("#wizard_dialog").dialog("open");
	
					}
					
					if ( result.status == "error")
					{
						show_error_dialog(result.error_info);
					}
				});
		}
		catch (error)
		{
			show_error_dialog(error.message);
		}
	}
	
	/*
	 * When user click show error button
	 */
	function import_test()
	{
		try
		{
			init_dialog_error();
			
			var data = get_data_user_authentication_b();
			
			$("#wizard_dialog_test").dialog({title: TITLE_TEST_IMPORT,autoOpen: false ,modal: true,width:500});
			
			$.post(url_test_import,data,function(result)
				{
					if(result.status == "success")
					{			
						$("#wizard_setting_test").empty();
						$("#wizard_setting_test").html(result.form);
						$("#wizard_dialog_test").dialog("open");
					}
					
					if ( result.status == "error")
					{
						alert(result.error_info);
					}
				});
		}
		catch(error)
		{
			show_error_dialog(error.message);
		}
	}
	
	/*
	 * Map the field
	 */
	function get_the_list_fields()
	{
		//Support for user name
		var Username = $("#wizard_field1 td select option:selected").val();
		
		//Support for Typeaccess
		var Typeaccess = $("#wizard_field2 td select option:selected").val();
		
		//Support for Dispalyname
		var Dispalyname = $("#wizard_field3 td select option:selected").val();
		
		//Support for Password
		var Password = $("#wizard_field4 td select option:selected").val();
		
		//Support for Comment
		var Comment = $("#wizard_field5 td select option:selected").val();
		
		//Support for Group
		var Group = $("#wizard_field6 td select option:selected").val();
		
		var arr = new Array();
		
		arr[0] = Username;
		arr[1] = Typeaccess;
		arr[2] = Dispalyname;
		arr[3] = Password;
		arr[4] = Comment;
		arr[5] = Group;
		
		var len = arr.length;
		var i = 0;
		var j = 0;
		var samename = "";
		
		var is_same_name = false;
		var is_existed_Username = false;
		var errorinfo = "";
		var header = "";
		
		var seperate_field= $("#wizard_import_seperate").val()
		
		
		// This part to check the symbol of seperate filed
		if ($.trim(seperate_field) == "")
		{
			$("#wizard_error_import_setting").html("Field delimiter is required.");
			return;
		}
		
		if ($.trim(seperate_field) == "?" )
		{
			$("#wizard_error_import_setting").html("'?' is not a valid");
			return;
		}
		
		// This part to force user enter the user name field.
		if (Username == NotUsed)
		{
			$("#wizard_error_import_setting").html("User name is required.");
			return;
		}
		
		
		//This part to check can't be accept same field
		for (i;i<len-1;i++)
		{
			var val = arr[i];
			
			if (val != NotUsed)
			{
				for (j=i+1;j<len;j++)
				{
					if (val == arr[j])
					{
						is_same_name = true;
					}
				}
			}
		}
		
		if (is_same_name == true)
		{
			$("#wizard_error_import_setting").html("Invalid field position. Position already used by another field.");
			return;
		}
		
		
		//Append the list header
		var list_header = "";
		var arr = new Array();
		arr = ["?","?","?","?","?","?"];
		
		var index = parseInt(Username);
		arr[index-1] = header_Username;
		
		if (Typeaccess != NotUsed)
		{
			index = parseInt(Typeaccess);
			arr[index-1] =  header_Typeaccess;
		}
		
		if (Dispalyname != NotUsed)
		{
			index = parseInt(Dispalyname);
			arr[index-1] = header_Dispalyname;
		}
		
		if (Password != NotUsed)
		{
			index = parseInt(Password);
			arr[index-1] = header_Pass;
		}
		
		if (Comment != NotUsed)
		{
			index = parseInt(Comment);
			arr[index-1] = header_Comment;
		}
		
		if (Group != NotUsed)
		{
			index = parseInt(Group);
			arr[index-1] = header_Group;
		}

		//We will filter the ? at the end
		
		
		for (j = arr.length-1;j>0;j--)
		{
			if (arr[j] == "?")
				//delete arr[j];
				arr.splice(j,1);
			else
				break;
		}
		
		header = arr.join(seperate_field);
		
		//Setting field is successfull.
		var default_pass = $("#wizard_default_pass").val();
		$("#wizard_error_import_setting").html("");
		$("#wizard_import_header").val(header);
		$("#wizard_seperate_field").val(seperate_field);
		$("#wizard_default_pass_authb").val(default_pass);
		$("#wizard_content_seperate").html("Fields is seperated by " + seperate_field  +"<br/>" + " If you don't select filed Password then password will be : " + default_pass);
		$("#wizard_dialog").dialog("close");
		
	}
	
	/* endregion */
		
	/* region TRUSTED NETWORK RANGE. */
	
	/*
	 * Init the dialog and event for network range. 
	 */
	function init()
	{
		init_ui_opt();
		utils.init_alert_dialog("#dialog-message");
		utils.init_list_panel("#list-panel", hide_panel);
		$("#list-panel").dialog(list_search_dialog());
		
		$("#dialog-add-netlist").dialog(defnet.get_ui_opt().popup_dialog_opt);
		$("#dialog-edit-netlist").dialog(defnet.get_ui_opt().popup_dialog_opt);
		
		var fs1 = $("div.dns_box");
		fs1.find(".img_add").click(show_add1);
		fs1.find(".img_folder").bind('click', function(){show_panel1();});
		
//		$("#netlist").droppable({
//			hoverClass: 'ui-state-active',
//			scope: defnet.drop_scope,
//			drop: function(evt, ui)
//			{
//				var o = ui.draggable;
//				add_dragged_net(o);
//			}
//		});
//		utils.set_alt_css("#netlist");
		
	}
	
	/*
	 * When user click the add icon, it will show the new dialog,following these parameters.
	 */
	function show_add1()
	{
		var self = $(this);
		var data = {
				self: self,
				scope: 'netlist',
				level : 1,
				prefix : '',
				savetemp: 'inserttemp',
				url : defnet.save_temp_url,
				func_save: save_to_net,
				func_show_all: aaa,
				func_show_add: aaa
		};
		show_add_init_helper(data);
		return false;
	}
	
	/*
	 *  call the init_form_wizard from defnet
	 */
	function show_add_init_helper(data)
	{
		data['level'] = 1;
		data['prefix'] = '';
		defnet.init_form_wizard(data);
	}
	
	function show_add_helper(data)
	{
		var o = defnet.get_level_data(data.self);
		data['level'] = o.level;
		data['prefix'] = o.prefix;
		defnet.init_form_wizard(data);
	}
	
	/*
	 * When user click save , this method is called.
	 */
	function save_to_net()
	{
		var o = {
				level: 1,
				savetemp: 'inserttemp',
				url: defnet.save_temp_url,
				prefix: '',
				scope: 'netlist',
				func_add: add_net_
		};
		return defnet.save_inner_form(o);
	}
	
	/*
	 * Join the ID 
	 */
	function get_nettrusted_data(arr_id)
	{
		var arr = arr_id.join(',');
		var data = {
				data: arr
		};
		return data;
	}
	
	/*
	 * Adding the item to the list , when user save info successfully.
	 */
	function add_net_(id, name)
	{
		var id = [id];
		var name = [name];
		
		var form = $(".dns_box");
		add_nettrusted(form,id,name,'wizard.edit_allowext(this)');
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
				savetemp: 'updatetemp',
				url : defnet.save_temp_url,
				scope: 'netlist',
				func_update: update_net,
				func_show_all: aaa,
				func_show_add: aaa
		};
		
		defnet.init_edit_form_wizard(data);
		return false;
	}
	
	function update_net(id, name, self)
	{
		$(self).next().html(name);
		var isopen = $("#list-panel").dialog('isOpen');
		if (isopen)
			filter_list_net();
	}
	
	function show_panel1()
	{
		
		$("#list_body").load(defnet.list_temp.panel, null,
				function()
				{
					$(".add_button").click(add_net);
					//$(".drag_zone").draggable(drag_opt_1);
					//$("#id_filters").change(filter_list1);
					$("#id_filter_text").keypress(function(event)
							{
								if (event.keyCode == '13') 
								{
									filter_list_net();
								}
							});
					//$("#id_filter_text").keydown(utils.stop_filter_timer);
					utils.bind_hover($("#list_body").find(".add_button"));
					$("#id_filters").hide();
					$("#list-panel").dialog('open');
				});
		
		return false;
	}
	
	function filter_list_net()
	{
		var name = $("#id_filter_text").val();
		
		$("#panel_body").load(defnet.list_temp.select, null,
				function()
				{
					obj_div = $("#panel_body div").hide();
					obj = $("#panel_body div:contains('" + name + "')");
					obj.show();
					
					//$(".drag_zone").draggable(drag_opt_1);
				});
	}
	
	function is_inbox(isvalue)
	{
		var arr_id_ = [];
		
		var form = $(".dns_box");
		lst_id = $(form.find("#netlist")).children();
		
		$(lst_id).each(function(){
			var lstid = $(this).attr('id');
			var lsttext = [];
			lsttext = lstid.split('_');
			arr_id_.push(lsttext[1]);
		});
		
		if ($.inArray(isvalue,arr_id_) > -1)
			return true;
			
		return false;
	}
	
	function add_net()
	{
		var arr_id = [];
		var arr_name = [];
		var form = $(".dns_box");
		
		$("input[name=chklist]:checked").each(
				function()
				{
					var o = $(this);
					var id = o.parent().attr("id");
					var name = o.next().html();
					result = is_inbox(id);
					
					if (result == false)
					{
						add_nettrusted(form, id, name, "wizard.edit_net(this)")
					}
					
//					arr_id.push(parseInt(id, 10));
//					arr_name.push(name);
				});
				
		utils.set_alt_css("#netlist");
		//var data = get_nettrusted_data(arr_id);
		
		//ajax_add_nettrusted(nettrusted_net.save_url, data, arr_id, arr_name, add_netlist);	
	}
	
	/*
	 * Get the list id from the box
	 */
	function get_item_netstructed()
	{
		var form = $(".dns_box");
		var wizard_identification_form = $("#wizard_identification_form").val();
		var position_next = "0"; 
		var list_trustedIprange = "";
		var s = "";
		obj = form.find("#netlist").children();
		
		//get the list id of netstructed and send it to the server.
		$.each(obj,function(index){
			
			var obj_item = $(obj[index]);
			var item = obj_item.attr("id");
			var array = [];
			
			array = item.split('_');
			
			if (s == "")
				s = s + array[1];
			else 
				s = s + "," + array[1]; 
			
		});
		
		
		data = {};
		
		data = {
			'wizard_identification_form' : 	wizard_identification_form , 
			'position_next' : position_next,
			'list_trustedIprange': s
		};
		
		return data;
	}
	
	function add_nettrusted(form, id, name, argeditclick)
	{
		var _id = parseInt(id, 10);
		var editclick = 'wizard.edit_net(this)';
		var deleteclick = 'wizard.remove_net(this)';
		
		//Todo : Check the exissted code here.
		
			var data = {
					id_prefix: 'item_',
					id: _id,
					click: deleteclick,
					editclick: editclick,
					name: name
			};
			
			var h = new EJS({url: '/media/tpl/list_item.ejs'}).render(data);
			form.find("#netlist").append(h);
		
		utils.set_alt_css("#netlist");
		//utils.set_alt_css(form, "#netlist");
	}
	
	function remove_net(o)
	{
		var item = $(o);
		var id = item.parent().attr("id");
		var _id = utils.get_itemid(id);
		var form = utils.get_parent(item, 8);
		form.find("#" + id).remove();
		utils.set_alt_css("#netlist");
		return false;
	}

	/* endregion */
		
	/* region GROUP_USER */
	
	function open_group_adding()
	{
		try
		{
			init_dialog_error();
			
			data = {
					'type': '2'
					};
			
			$("#wizard_add_group").dialog({title: 'Add Group',autoOpen: false ,modal: false,width:350});
			
			$.get(url_open_add_group,data,function(result)
					{
						//alert(result.status);
						if (result.status == "success")
						{				
							$("#wizard_content_add_group").html("");
							$("#wizard_content_add_group").html(result.form);
							
							obj_group = $("#wizard_content_add_group");
							
							obj_type =  obj_group.find("#id_type");
							$(obj_type).val("2");
							$(obj_type).attr('disabled','disabled');
							
							bttsave = obj_group.find(".save_button.save");
							bttcancel = obj_group.find(".save_button.cancel");
							bttaddicon = obj_group.find(".img_add.proxynow.addicon"); 
							bttlistuser = obj_group.find(".img_folder.proxynow.foldericon");
							
							$(bttsave).click(function(){ save_form_group('add');});
							$(bttcancel).click(function(){ cancel_form_group();});
							$(bttaddicon).click(function(){ open_members_adding();})
							
							//$(bttlistuser).click(function(){wizard_open_listuser(); });
							$(bttlistuser).bind('click',function(){
								attach_search_list_panel_event("#wizard_list_panel_user", "#wizard_list_panel_content_user", profile_users, "0");
							});
							
							$("#wizard_add_group").dialog("open");				
						}
						if (result.status == "error")
						{
							show_error_dialog(result.error_info);
						}
					});
			
		}
		catch(error)
		{
			show_error_dialog(error.message);
		}
	}
	
	/*
	 * This method happens in case of clicking members buttons , for objective edit group,mebers
	 * Systgem action will show the dialog of group and members.
	 */
	function wizard_open_edit_group(obj)
	{
		try 
		{
			init_dialog_error();
			
			var data = {};
			
			name = $(obj).attr("value");
			data = {
				'name' : name	
			}; 
			
			$("#wizard_add_group").dialog({title: 'Edit Group',autoOpen: false ,modal: false,width:350});
			
			$.post(url_open_edit_group,data,function(result){
					
					if (result.status == "success")
					{
						obj_group = $("#wizard_content_add_group");
						
						$("#wizard_content_add_group").html("");
						$("#wizard_content_add_group").html(result.form);
						
						obj_members = $(obj_group).find("#members");
						
						bttaddicon = obj_group.find(".img_add.proxynow.addicon"); 
						bttsave = obj_group.find(".save_button.save");
						bttcancel = obj_group.find(".save_button.cancel");
						bttlistuser = obj_group.find(".img_folder.proxynow.foldericon");
						choosetype = obj_group.find("#id_type").children();
						$($(choosetype).get(0)).remove();
						
						$(obj_group.find("#id_name")).attr('readonly',"true");
						
						//append of list user , that is sent from server to client , \
						//bcos , we can not use id in this case.
						$(obj_members).append(result.members);
						
						$(bttaddicon).click(function(){ open_members_adding();})
						$(bttsave).click(function(){ save_form_group('edit');});
						$(bttcancel).click(function(){ cancel_form_group();});
						
						$(bttlistuser).bind('click',function(){
							attach_search_list_panel_event("#wizard_list_panel_user", "#wizard_list_panel_content_user", profile_users, "0");
						});
						
						alternative_row();
						
						$("#wizard_add_group").dialog("open");	
					}
					
					if (result.status == "error")
					{
						show_error_dialog(result.error_info);
					}
				});
		}
		catch(error)
		{
			show_error_dialog(error.message);
		}
	}
	
	/*
	 * this method happens in case of user click adding user,
	 * system will show dialog to adding user
	 */
	function open_members_adding()
	{
		try
		{
			init_dialog_error();
			
			data = {};
			
			data = {
					'type' : 1
					};
			
			$("#wizard_add_member").dialog({title: 'Add User',autoOpen: false ,modal: true,width:350});
			
			$.get(url_open_add_group,data,function(result){
				
				if (result.status == 'success')
				{
					
					$("#wizard_content_add_member").html("");
					$("#wizard_content_add_member").html(result.form);
					
					obj_user = $("#wizard_add_member");
					
					obj_type = obj_user.find("#id_type");
					$(obj_type).val("1");
					$(obj_type).attr('disabled','disabled');
					
					bttsave = obj_user.find(".save_button.save");
					bttcancel = obj_user.find(".save_button.cancel"); 
					
					$(bttsave).click(function(){ save_form_user(); });
					$(bttcancel).click(function(){ cancel_form_user();});
					
					$("#wizard_add_member").dialog("open");
				}
				
				if(result.status == "error")
				{
					show_error_dialog(result.error_info);
				}
			});
		}
		catch(error)
		{
			show_error_dialog(error.message);
		}
	}
	
	function cancel_form_group()
	{
		$("#wizard_add_group").dialog("close");
	}
	
	function cancel_form_user()
	{
		$("#wizard_add_member").dialog("close");
	}
	
	/*
	 * This action when user click button to save the user.
	 */
	function save_form_user()
	{
		try{
				
			init_dialog_error();
			
			obj_user = $("#wizard_add_member");
			var name = $(obj_user).find("#id_name").val();
			var accesstype = $(obj_user).find("#id_accesstype option:selected").val();
			var displayname = $(obj_user).find("#id_displayname").val();
			var password = $(obj_user).find("#id_password").val();
			var comment = $(obj_user).find("#id_comment").val();
			
			var data = {
					'name' : name,
					'accesstype' : accesstype,
					'displayname' : displayname,
					'password' : password,
					'comment' : comment
			};
			
			$.post(url_save_new_user,data,function(result){
				
				if(result.status == "success")
				{
					obj_group = $("#wizard_content_add_group");
					
					obj_members = $(obj_group).find("#members");
					
					$(obj_members).append(result.form);
					
					alternative_row();
					
					$("#wizard_add_member").dialog("close");
				}
				
				if(result.status == "error")
				{					
					show_error_dialog(result.error_info);
				}
			
			});
		}
		catch(error)
		{
			show_error_dialog(error.message);
		}
	}
	
	/*
	 * this method happens in case of saving groups
	 * user click saving group.
	 */
	function save_form_group(action)
	{
		try
		{
			init_dialog_error();
			form = $("#wizard_content_add_group");
			
			var name = $(form.find("#id_name")).val();
			var accesstype = $(form.find("#id_accesstype option:selected")).val();
			var comment = $(form.find("#id_comment")).val();
			var nameofuser = [];
			var struser = "";
			
			arr = $(form.find("#members"));
			nameofuser = $(arr).find('#wizard_name_user_ingroup');
			
			//concat string from list to single string.
			$.each(nameofuser,function(index){
				if (struser == "")
					struser = struser + $(nameofuser[index]).attr("value");
				else 
					struser = struser + signal + $(nameofuser[index]).attr("value"); 
			});
			
			data = {'name' : name,
					'accesstype' : accesstype,
					'comment' : comment,
					'action' : action,
					'members' : struser };
			
			$.post(url_save_new_group,data,function(result) 
			{
				if (result.status == "success")
				{
					//For the case of edit
					if (result.action == 'add')
					{
						$("#wizard_content_list_group tbody").append(result.form);
					}
					
					$("#wizard_add_group").dialog("close");
				}
				if (result.status == "error")
				{
					show_error_dialog(result.error_info);	
				}
			});
		}
		catch(error)
		{
			show_error_dialog(error.message);
		}
	}
	
	
	function wizard_delete_tempuser(obj)
	{
		value = $(obj).attr('value');
		
		data = {'name': value };
		
		$.post(url_wizard_delete_tempuser,data,function(result){
			
			if (result.status == "success")
			{
				$(obj).parent().remove();
				alternative_row();
			}
		});
	}
	
	function get_typeof_search(type_search,init)
	{
		//var name = search_info = $("#wizard_search_info").val();
		
		data={};
		
		data['init'] = init
			
		if (type_search == profile_users)
		{
			data['type'] = profile_users;
		}
		
		return data;
	}
	
	//adding schedules to profile
	function adding_type_to_profile()
	{
		try
		{
			
			init_dialog_error();
			var idadd = "";
			var lst_type_right = [];
			var lst_type_left = [];
			var obj_type_right = [];
			var oo ;
			var obj_type_right = [];
			
			var destination = $("#wizard_destination_adding").attr("value");
			
			var type = $("#wizard_search_type").val();
			
			idadd = "#" + destination;
			//Get the checked checkbox on left panel
			var obj = $("#panel_body_type div input[name=chklist]:checked");
			
			oo = $(idadd);
			
			obj_type_right = $(idadd).find("#wizard_name_user_ingroup");
			
			$.each(obj_type_right,function(index)
			{
				var name_right = $(obj_type_right[index]).attr("value"); 
				lst_type_right.push(name_right);
			});
			
			// add list user to the group .
			$.each(obj,function(index){
				var objname = obj[index];
				var name = $(objname).attr("value");
				var classify = $(objname).attr("classify");
				css = definecss(classify);
				//check the name has existed or not , if name has existed in the group then
				//we can add
				var result_search = -1; 
				result_search = $.inArray(name,lst_type_right);
				//if we can't find we don't add.
				if (result_search == -1)
				{	
					//nothing here is id of dialog
					add_item_client("editclick",name,idadd,"nothing",css,classify);
					
				}	
			});
		}
		catch(error)
		{
			show_error_dialog(error.message);
		}
	}
	
	
	//for showing dialog searing profile
	function attach_search_list_panel_event(dialogsearch,dialogsearchcontent,type_search,init)
	{
		try
		{
			init_dialog_error();
			var data = {};
			
			data = get_typeof_search(type_search,init);
			
			$(dialogsearch).dialog({
	       		autoOpen: false,
	       		modal: false,
	       		width:200,
	       		position:[0, 0]
	   		});
			
			$.post(url_search_info_profile,data,function(result)
					{
						if (result.status == "success")
						{
							close_remove_panel_search(dialogsearch);
							
							$(dialogsearchcontent).html("");
							$(dialogsearchcontent).html(result.form);
							$(dialogsearch).dialog("open");
							
						}
						
						if (result.status == "error")
						{
							show_error_dialog(result.error_info);
						}
					});
		}
		catch(error)
		{
			show_error_dialog(error.message);
		}
	}
	
	//for searching profile
	function searching_type_info(e)
	{
		try 
		{
			var code = (e.keyCode ? e.keyCode : e.which);
			
			init_dialog_error();
			
			if (code == 13)
			{	
				var type = $("#wizard_search_type").val();
				var name = $("#wizard_search_info").val();
				
				var data = get_typeof_search(type,'1');
				
				data['name'] = name;
				
				$.post(url_search_info_profile,data,function(result){
						
					if (result.status == "success")
						{
							$("#panel_body_type").html("");
							$("#panel_body_type").html(result.form);
							
							obj_div = $("#panel_body_type div").hide();
							obj = $("#panel_body_type div:contains('" + name + "')");
							obj.show();
						}
					if (result.status == "error")
					{
						show_error_dialog(result.error_info);
					}
				});
			}
		}
		catch(error)
		{
			show_error_dialog(error.message);
		}
	}
	
	/* endregion */
		
	/* region PROFILE */
	
	/*
	 *  this method happens when user click the edit text
	 *  then it will show the dialog with some names of profile 
	 *  for purpose to apply profile for which group ,
	 */
	function wizard_open_dialog_policy(obj)
	{
		try
		{
			init_dialog_error();
			
			var data = {};
			name = $(obj).attr("value");

			trimname = $.trim(name);
			var data = {
				'name': trimname 
				};
			
			$("#wizard_list_panel_policy").dialog({
	       		autoOpen: false,
	       		modal: false,
	       		width:320,
	       		title : TITLE_LIST_PROFILE
	   		});
			
			$.post(url_open_dialog_policy,data,function(result){
				
				if(result.status == "success")
				{
					$("#wizard_list_content_policy").html("");
					$("#wizard_list_content_policy").html(result.form);
					$("#wizard_list_panel_policy").dialog("open");
					
				}
				if(result.status == "error")
				{
					show_error_dialog(result.error_info);
				}
			});
			
		}
		catch(error)
		{
			show_error_dialog(error.message);
		}
	}
	
	function toggle_schedule()
	{
		if (this.checked)
			$(".wpprofileschd").hide();

		else
			$(".wpprofileschd").show();
	}
	
	/*
	 * it happens when clicking cumstomise button , 
	 * It will show dialog of profile for purpose of modifing profile
	 */
	function wizard_open_dialog_edit_policy(obj)
	{
		try
		{
			init_dialog_error();
			
			$("#list-panel").dialog(list_search_dialog());
			
			var self = $(obj);
			var id = $(obj).attr("value");
			data["id"] = id;
			
			cmd = init_form_profile(self);
			
			wpprofile.show_form_dialog(url_profile_load,data,cmd,self);
			
			$("#dialog-add-profile").dialog(profile_dialog("edit"));
			$("#dialog-add-profile").dialog("open");			
		}
		catch(error)
		{
			show_error_dialog(error.message);
		}
	}
	
	function update_profile(id,name)
	{
		var isopen = $("#wizard_list_panel_policy").dialog("isOpen");
		if (isopen)
		{
			var ooo = $("#wizard_table_list_policy tbody tr td span[value='" + id +"']");
			var td = $(ooo).parent();
			var tr = $(td).parent();
			b = $(tr).children().get(1);
			$(b).html(name);
		}	
	}
	
	/*
	 * It happens when user save the list of name profile that will be used for the group
	 * 
	 */
	function wizard_save_policy(o)
	{
		try
		{
			init_dialog_error();
			var data = {};
			var sss = "";
			namegroup = $("#wizard_group_name").attr("value");
			
			obj = $("#wizard_table_list_policy input[id=wizard_check_group]:checked");
			
			$.each(obj,function(index){
				if (sss == "")
				{
					sss = $(obj[index]).attr("value"); 
				}
				else
				{
					sss = sss + "," + $(obj[index]).attr("value");
				}
					
			});
			
			data= {
					'name' : namegroup,
					'checkedpolicy' : sss
			}
			
			$.post(url_wizard_save_policy,data,function(result)
					{
						if (result.status == "success")
						{
							ttt = $("#wizard_content_list_group span[id='" + namegroup + "']");
							$(ttt).html(result.form); 
							
						}
						
						if(result.status == "error")
						{
							show_error_dialog(result.error_info);
						}
					});
		}
		catch(error)
		{
			show_error_dialog(error.message);
		}
	}
	
	/*
	 * open a new dialog for new prfile.
	 */
	function wizard_create_profile(obj)
	{
		try
		{
			init_dialog_error();
			$("#list-panel").dialog(list_search_dialog());
			data = {};
			var self = $(obj);
			
			cmd = init_form_profile(self);
			
			z = wpprofile.show_form_dialog(url_profile_load,data,cmd,self);
			
			$("#dialog-add-profile").dialog(profile_dialog("add"));
			$("#dialog-add-profile").dialog("open");	
			
		}
		catch(error)
		{
			show_error_dialog(error.message);
		}
	}
	
	/*
	 *  Init the event for new profile.
	 */
	function init_form_profile(self)
	{
		var data = {
					self: self,
					scope: 'profile',
					level: 1,
					prefix: '',
					func_save: aaa,
					func_show_all1 : func_show_all1,
					func_show_add1 : func_show_add1,
//					func_show_all2 : show_all2,
//					show_add2 : show_add2,
					func_show_all3 : func_show_all3,
					func_show_add3 : func_show_add3,
					func_show_all4 : func_show_all4,
					func_show_add4 : func_show_add4,
					func_show_all5 : func_show_all5,
					func_show_add5 : func_show_add5,
					func_show_all6 : func_show_all6,
					func_show_add6 : func_show_add6,
					func_show_all7 : func_show_all7,
					func_show_add7 : func_show_add7,
					func_show_all8 : func_show_all8,
					func_show_add8 : func_show_add8,
					func_show_all9 : func_show_all9,
					func_show_add9 : func_show_add9,
					func_show_all10 : func_show_all10,
					func_show_add10 : func_show_add10,
					func_save_profile : func_save_profile,
					func_create_profile : func_create_profile,
					set_items_ : set_items_,
//					show_all11 : show_all11,
//					show_add11 : show_add11,
					func_show_allexcept1 : func_show_allexcept1,
					func_show_addexcept1 : func_show_addexcept1,
//					show_importexcept1 : show_importexcept1,
//					show_exportexcept1 : show_exportexcept1,
					func_show_allexcept2 : func_show_allexcept2
//					show_addexcept2 : show_addexcept2
			}; 
			return data;
	}
	
	/*
	 * This method will save the new profile
	 */
	function func_create_profile()
	{
		try
		{
			init_dialog_error();
			
			var form = $("#save-form-profile_1");
			data = def_getdata_profile(form,"","","inserttype");
			
			$.post(url_profile_save,data,function(result){
				
				if (result.status == "success") 
				{
					$("#wizard_table_list_policy").append(result.form);
					$("#dialog-add-profile").dialog("close");				
				}
				
				if (result.status == "error")
				{
					show_error_dialog(result.error_info);
				}
			});
		}
		catch(error)
		{
			show_error_dialog(error.message);
		}
	}
	
	function get_itemid(arg)
	{
		var i = arg.indexOf('_');
		s = "";
		if (i >= 0)
		{
			var s = arg.substr(i + 1);
		}

		return s;
	}
	
	function set_items_(form)
	{
		var except = $("#except");
		if (form.find("#id_scheduleon").attr("checked") == "checked")
			$(".wpprofileschd").hide();

		else
			$(".wpprofileschd").show();

		var arrschedules = [];
		//var arruserinternals = [];
		//var arruserexternals = [];
		var arrallowexts = [];
		var arrblockexts = []
		var arrallowmimes = [];
		var arrblockmimes = [];
		var arrcats = [];
		var arrwhitelist = [];
		var arrblacklist = [];
		var arrcontents = [];
		//var arrnets = [];
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
//		form.find("#id_users > div").each(
//				function()
//				{
//					var id = $(this).attr("id");
//					var _id = utils.get_itemid(id);
//					if (id.indexOf('userint') >= 0)
//					{
//						if (!utils.item_exist(_id, arruserinternals))
//						{
//							arruserinternals.push(_id);
//						}
//					}
//
//					else
//					{
//						if (!utils.item_exist(_id, arruserexternals))
//						{
//							arruserexternals.push(_id);
//						}
//					}
//				});
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
//		form.find("#id_nets > div").each(
//				function()
//				{
//					var id = $(this).attr("id");
//					var _id = utils.get_itemid(id);
//					if (!utils.item_exist(_id, arrnets))
//					{
//						arrnets.push(_id);
//					}
//				});
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
					var _id = get_itemid(id);
					if (id.indexOf('exceptuserint') >= 0)
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
//		utils.set_data(form.find("#id_users"), 'userinternals', arruserinternals);
//		utils.set_data(form.find("#id_users"), 'userexternals', arruserexternals);
		utils.set_data(form.find("#id_allowexts"), 'allowexts', arrallowexts);
		utils.set_data(form.find("#id_blockexts"), 'blockexts', arrblockexts);
		utils.set_data(form.find("#id_allowmimes"), 'allowmimes', arrallowmimes);
		utils.set_data(form.find("#id_blockmimes"), 'blockmimes', arrblockmimes);
		utils.set_data(form.find("#id_categories"), 'categories', arrcats);
		utils.set_data(form.find("#id_whitelist"), 'whitelist', arrwhitelist);
		utils.set_data(form.find("#id_blacklist"), 'blacklist', arrblacklist);
		utils.set_data(form.find("#id_contents"), 'contents', arrcontents);
//		utils.set_data(form.find("#id_nets"), 'nets', arrnets);
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
		wpprofile.set_alt_css(except, "#id_exceptnets");
		wpprofile.set_alt_css(except, "#id_excepturls");
		wpprofile.set_alt_css(except, "#id_exceptusers");
	}
	
	/*
	 * update profile
	 */
	function func_save_profile()
	{
		try
		{
			init_dialog_error();
			
			var form = $("#save-form-profile_1");
			name = $($(form).find("#id_name")).val();
			
			data = def_getdata_profile(form,"","","updatetype");
			id = $(form.find("#wpprofile_id")).attr("value");
			data["id"] = id;
			$.post(url_profile_save,data,function(result){
				
				if (result.status == "success")
				{
					$("#dialog-add-profile").dialog("close");
					update_profile(id,name);
				}
				
				if (result.status == "error")
				{
					show_error_dialog(result.error_info);
				}
			});
		}
		catch(error)
		{
			show_error_dialog(error.message);
		}
	}
	
	/* endregion */

	/* region CATEGORY IN PROFILE */ 
	
	/*
	 * When user click folder incon : NOT YET
	 */
	function func_show_all7()
	{
		
		$("#list_body").load(wpcat.list_temp.panel, null,
				function()
				{
					obj = $(".panel_header");
					$(obj).find(".add_button").click(add_cat_);
					//$(".drag_zone").draggable(wpprofile.get_ui_opt.drag_opt_7);
					//$("#id_filters").change(filter_list7);
					$("#id_filter_text").keypress(function(event)
							{
								if (event.keyCode == '13') 
								{
									filter_list_cat();
								}
								//utils.countdown_filter(filter_list7);
							});
					//$("#id_filter_text").keydown(utils.stop_filter_timer);
					utils.bind_hover($(".add_button"));
					$("#id_filters").hide();
					$("#list-panel").dialog('open');
				});
		return false;
	}
	
	/*
	 * When user click filter from list : NOT YET
	 */
	function filter_list_cat()
	{
		var name = $("#id_filter_text").val();
		
		$("#panel_body").load(wpcat.list_temp.select, null,
				function()
				{
					obj_div = $("#panel_body div").hide();
					obj = $("#panel_body div:contains('" + name + "')");
					obj.show();
					
					//$(".drag_zone").draggable(wpprofile.get_ui_opt.drag_opt_1);
				});
	}
	
	/*
	 * When user click add icon 
	 */
	function func_show_add7()
	{
		var self = this;
		var data = {
				self: self,
				scope: 'cat-profile',
				level: 2,
				prefix: '_1',
				func_save: save_to_cat,
				func_show_import: aaa,
				func_show_export: aaa
		};
		wpcat.init_form(data);
		return false;
	}
	
	/*
	 * save catetory to session
	 */
	function save_to_cat()
	{
		var o = {
				level: 2,
				scope: 'cat-profile',
				url : wpcat.save_temp_url,
				savetemp :'inserttemp',
				func_add: add_cat
		};
		return wpcat.save_inner_form(o);
	}
	
	function add_cat(id,name)
	{
		var form = $("#save-form-profile_1");
		wpprofile.add_cat(form, id, name, 'wizard.edit_cat(this)');
	}
	
	function add_cat_()
	{
		var panel_body = $("#panel_body");
		
		$(panel_body).find("input[name=chklist]:checked").each(
				function()
				{
					var o = $(this);
					var id = o.parent().attr("id");
					var name = o.next().html();
					add_cat(id, name);
				});
	}
	
	/*
	 *show edit category dialog
	 */
	function edit_cat(obj)
	{
		var item = $(obj);
		var id = item.parent().attr("id");
		var _id = utils.get_itemid(id);
		var self = item;
		var data = {
				self: self,
				id: _id,
				level: 2,
				prefix: '_1',
				scope: 'cat-profile',
				url: wpcat.save_temp_url,
				savetemp: 'updatetemp',
				func_update: update_cat,
				func_show_import: aaa,
				func_show_export: aaa
		};
		wpcat.init_edit_form(data);
		return false;
	}
	
	function update_cat(id, name, self)
	{
		$(self).next().html(name);
		var isopen = $("#list-panel").dialog('isOpen');
		if (isopen)
			filter_list_cat();
	}
	
	/* endregion */
		
	/* region WHITELIST IN PROFILE */
	
	function func_show_add8()
	{
		var self = this;
		var data = {
				self: self,
				scope: 'whitelist-profile',
				level: 2,
				prefix: '_1',
				func_save: save_to_whitelist,
				func_show_import: aaa,
				func_show_export: aaa
		};
		wpwhitelist.init_form(data);
		return false;
	}
	
	function save_to_whitelist()
	{
		var o = {
				level: 2,
				scope: 'whitelist-profile',
				url : wpwhitelist.save_temp_url,
				savetemp :'inserttemp',
				func_add: add_whitelist
		};
		return wpwhitelist.save_inner_form(o);
	}
	
	function add_whitelist_()
	{
		var panel_body = $("#panel_body");
		
		$(panel_body).find("input[name=chklist]:checked").each(
				function()
				{
					var o = $(this);
					var id = o.parent().attr("id");
					var name = o.next().html();
					add_whitelist(id, name);
				});
	}
	
	function add_whitelist(id,name)
	{
		var form = $("#save-form-profile_1");
		wpprofile.add_whitelist(form, id, name,'wizard.edit_whitelist(this)');
	}
	
	function func_show_all8()
	{
		$("#list_body").load(wpwhitelist.list_temp.panel, null,
				function()
				{
					obj = $(".panel_header");
					$(obj).find(".add_button").click(add_whitelist_);
					//$(".drag_zone").draggable(wpprofile.get_ui_opt.drag_opt_8);
					
					$("#id_filter_text").attr('size', '26');
					$("#id_filter_text").keypress(function(event)
							{
								//utils.countdown_filter(filter_list_schedule);
								if (event.keyCode == '13') 
								{
									filter_list_whitelist();
								}
								
								//utils.countdown_filter(filter_list8);
							});
					$("#id_filter_text").keydown(utils.stop_filter_timer);
					utils.bind_hover($(".add_button"));
					$("#id_filters").hide();
					$("#list-panel").dialog('open');
				});
		return false;
	}
	
	function filter_list_whitelist()
	{
		var name = $("#id_filter_text").val();
		
		
		$("#panel_body").load(wpwhitelist.list_temp.select , null,
				function()
				{
					obj_div = $("#panel_body div").hide();
					obj = $("#panel_body div:contains('" + name + "')");
					obj.show();
					
					//$(".drag_zone").draggable(drag_opt_8);
				});
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
				level: 2,
				prefix: '_1',
				scope: 'whitelist-profile',
				savetemp :'updatetemp',
				url : wpwhitelist.save_temp_url,
				func_update: update_whitelist,
				func_show_import: aaa,
				func_show_export: aaa
		};
		wpwhitelist.init_edit_form(data);
		return false;
	}
	
	function update_whitelist(id, name, self)
	{
		$(self).next().html(name);
		var isopen = $("#list-panel").dialog('isOpen');
		if (isopen)
			filter_list_whitelist();
	}
	
	/* endregion */
	
	/* region BALCKLIST IN PROFILE */
	
	function func_show_all9()
	{
		$("#list_body").load(wpblacklist.list_temp.panel, null,
				function()
				{
					obj = $(".panel_header");
					
					$(obj).find(".add_button").click(add_blacklist_);
					//$(".drag_zone").draggable(wpprofile.get_ui_opt.drag_opt_9);
					$("#id_filter_text").attr('size', '26');
					$("#id_filter_text").keypress(function(event)
							{
								if (event.keyCode == '13') 
								{
									filter_blacklist();
								} 
							});
					//$("#id_filter_text").keydown(utils.stop_filter_timer);
					utils.bind_hover($(".add_button"));
					$("#list-panel").dialog('open');
				});
		return false;
	}
	
	function add_blacklist_()
	{
		var panel_body = $("#panel_body");
		
		$(panel_body).find("input[name=chklist]:checked").each(
				function()
				{
					var o = $(this);
					var id = o.parent().attr("id");
					var name = o.next().html();
					add_blacklist(id, name);
				});
	}
	
	function filter_blacklist()
	{
		var name = $("#id_filter_text").val();
		
		$("#panel_body").load(wpblacklist.list_temp.select, null,
				function()
				{
					obj_div = $("#panel_body div").hide();
					obj = $("#panel_body div:contains('" + name + "')");
					obj.show();
					
					//$(".drag_zone").draggable(drag_opt_9);
				});
	}
	
	
	
	function func_show_add9()
	{
		var self = this;
		var data = {
				self: self,
				scope: 'blacklist-profile',
				level: 2,
				prefix: '_1',
				func_save: save_to_blacklist,
				func_show_import: aaa,
				func_show_export: aaa
		};
		wpblacklist.init_form(data);
		return false;
	}

	function save_to_blacklist()
	{
		var o = {
				level: 2,
				scope: 'blacklist-profile',
				url : wpblacklist.save_temp_url,
				savetemp :'inserttemp',
				func_add: add_blacklist
		};
		return wpblacklist.save_inner_form(o);
	}
	
	function add_blacklist(id, name)
	{
		var form = $("#save-form-profile_1");
		wpprofile.add_blacklist(form, id, name,'wizard.edit_blacklist(this)');
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
				level: 2,
				prefix: '_1',
				url : wpblacklist.save_temp_url,
				savetemp :'updatetemp',
				scope: 'blacklist-profile',
				func_update: update_blacklist,
				func_show_import: aaa,
				func_show_export: aaa
		};
		wpblacklist.init_edit_form(data);
		return false;
	}
	
	function update_blacklist(id, name, self)
	{
		$(self).next().html(name);
		var isopen = $("#list-panel").dialog('isOpen');
		if (isopen)
			filter_blacklist();
	}
	
	/* endregion */
		
	/* region SCHDEULES IN PROFILE. */
	
	function func_show_all1()
	{
		$("#list_body").load(defschedule.list_temp.panel, null,
				function()
				{
					obj = $(".panel_header");
					$(obj).find(".add_button").click(add_schedule_);
					// $(".drag_zone").draggable(wpprofile.get_ui_opt.drag_opt_1);
					// $("#id_filters").change(filter_list1);
					$(obj).find("#id_filter_text").keypress(function(event)
							{
								//utils.countdown_filter(filter_list_schedule);
								
								if (event.keyCode == '13') 
								{
									filter_list_schedule();
								}
							});
							
					utils.bind_hover($(".add_button"));
					$("#id_filters").hide();
					$(obj).find("#id_filter_text").hide();
					$("#list-panel").dialog('open');
				});
		return false;
	}
	
	function filter_list_schedule()
	{
		var name = $("#id_filter_text").val();
		//alert("chao em");
		$("#panel_body").load(defschedule.list_temp.select, null,
				function()
				{
					obj_div = $("#panel_body div").hide();
					obj = $("#panel_body div:contains('" + name + "')");
					obj.show();
					
					//$(".drag_zone").draggable(drag_opt_1);
				});
	}
	
	function func_show_add1()
	{
		var self = this;
		var data = {
				self: self,
				scope: 'schedule-profile',
				level: 2,
				prefix: '_1',
				func_save: save_to_schedule
		};
		defschedule.init_form(data);
		return false;
	}
	
	function save_to_schedule()
	{
		var o = {
				level: 2,
				scope: 'schedule-profile',
				url : defschedule.save_temp_url,
				savetemp :'inserttemp',
				func_add: add_schedule__
		};
		return defschedule.save_inner_form(o);
	}
	
	function add_schedule_()
	{
		var panel_body = $("#list_body");
		$(panel_body).find("input[name=chklist]:checked").each(
				function()
				{
					var o = $(this);
					var id = o.parent().attr("id");
					var name = o.next().html();
					add_schedule__(id, name);
				});
	}
	
	function add_schedule__(id,name)
	{
		var form = $("#save-form-profile_1");
		wpprofile.add_schedule_wizard(form,id,name);
	}
	
	function filter_list1()
	{
		var name = $("#id_filter_text").val();
		
		$("#list_body").load(defschedule.list_temp.select, null,
				function()
				{
					obj_div = $("#panel_body div").hide();
					obj = $("#panel_body div:contains('" + name + "')");
					obj.show();
					
					//$(".drag_zone").draggable(wpprofile.get_ui_opt.drag_opt_1);
				});
	} 
	
	function edit_schedule(obj)
	{
		var item = $(obj);
		var id = item.parent().attr("id");
		var _id = utils.get_itemid(id);
		var self = item;
		var data = {
				self: self,
				id: _id,
				level: 2,
				prefix: '_1',
				scope: 'schedule-profile',
				url : defschedule.edit_temp_url,
				savetemp :'updatetemp',
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
			filter_list_schedule();
	}
	
	/* endregion */
		
	/* region ALLOW EXCEPTION */ 
	
	function func_show_all3()
	{
		$("#list_body").load(wpext.list_temp.panel, null,
				function()
				{
					obj = $(".panel_header");
					
					$(obj).find(".add_button").click(add_allowext_);
					//$(".drag_zone").draggable(wpprofile.get_ui_opt.drag_opt_3);
					$("#id_filter_text").attr('size', '26');
					$("#id_filter_text").keypress(function(event)
							{
								if (event.keyCode == '13') 
								{
									filter_list_allowexcept();
								}
								//utils.countdown_filter(filter_list3);
							});
					//$("#id_filter_text").keydown(utils.stop_filter_timer);
					utils.bind_hover($(".add_button"));
					$("#id_filters").hide();
					$("#list-panel").dialog('open');
				});
		return false;
	}
	
	function add_allowext_()
	{
		
		var panel_body = $("#panel_body");
		
		$(panel_body).find("input[name=chklist]:checked").each(
				function()
				{
					var o = $(this);
					var id = o.parent().attr("id");
					var name = o.next().html();
					add_allowext(id, name);
				});
	}
	
	function func_show_add3()
	{
		var self = this;
		var data = {
				self: self,
				scope: 'allowext-profile',
				level: 2,
				prefix: '_1',
				func_save: save_to_allowext,
				func_show_import: aaa,
				func_show_export: aaa
		};
		wpext.init_form(data);
		return false;
	}
	
	function save_to_allowext()
	{
		var o = {
				level: 2,
				scope: 'allowext-profile',
				url : wpext.save_temp_url,
				savetemp :'inserttemp',
				func_add: add_allowext
		};
		return wpext.save_inner_form(o);
	}
	
	function add_allowext(id, name)
	{
		var form = $("#save-form-profile_1");
		wpprofile.add_allowext(form,id,name,'wizard.edit_allowext(this)');
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
				level: 2,
				prefix: '_1',
				savetemp :'updatetemp',
				url : wpext.save_temp_url,
				scope: 'allowext-profile',
				func_update: update_allowext,
				func_show_import: aaa,
				func_show_export: aaa
		};
		wpext.init_edit_form(data);
		return false;
	}
	
	function update_allowext(id, name, self)
	{
		$(self).next().html(name);
		var isopen = $("#list-panel").dialog('isOpen');
		if (isopen)
			filter_list_allowexcept();
	}
	
	function filter_list_allowexcept()
	{
		var name = $("#id_filter_text").val();
		
		$("#panel_body").load(wpext.list_temp.select, null,
				function()
				{
					obj_div = $("#panel_body div").hide();
					obj = $("#panel_body div:contains('" + name + "')");
					obj.show();
					
					//$(".drag_zone").draggable(drag_opt_3);
				});
	}
	
	
	/* endregion */
		
	/* region BLOCK EXTENSION IN PROFILE */
	
	function func_show_all4()
	{
		$("#list_body").load(wpext.list_temp.panel, null,
				function()
				{
					obj = $(".panel_header");
					
					$(obj).find(".add_button").click(add_blockext_);
					//$(".drag_zone").draggable(drag_opt_4);
					$("#id_filter_text").attr('size', '26');
					$("#id_filter_text").keypress(function(event)
							{
								if (event.keyCode == '13') 
								{
									filter_list_blockext();
								}
								//utils.countdown_filter(filter_list4);
							});
					$("#id_filter_text").keydown(utils.stop_filter_timer);
					utils.bind_hover($(".add_button"));
					$("#list-panel").dialog('open');
				});
		return false;
	}
	
	
	function add_blockext_()
	{
		var panel_body = $("#panel_body");
		
		$(panel_body).find("input[name=chklist]:checked").each(
				function()
				{
					var o = $(this);
					var id = o.parent().attr("id");
					var name = o.next().html();
					add_blockext(id, name);
				});
	}
	
	function func_show_add4()
	{
		var self = this;
		var data = {
				self: self,
				scope: 'blockext-profile',
				level: 2,
				prefix: '_1',
				func_save: save_to_blockext,
				func_show_import: aaa,
				func_show_export: aaa
		};
		wpext.init_form(data);
		return false;
	}
	
	function save_to_blockext()
	{
		var o = {
				level: 2,
				scope: 'blockext-profile',
				url : wpext.save_temp_url,
				savetemp :'inserttemp',
				func_add: add_blockext
		};
		return wpext.save_inner_form(o);
	}
	
	function add_blockext(id, name)
	{
		var form = $("#save-form-profile_1");
		wpprofile.add_blockext(form,id,name,'wizard.edit_blockext(this)');
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
				level: 2,
				prefix: '_1',
				savetemp :'updatetemp',
				url : wpext.save_temp_url,
				scope: 'blockext-profile',
				func_update: update_blockext,
				func_show_import: aaa,
				func_show_export: aaa
		};
		wpext.init_edit_form(data);
		return false;
	}
	
	function update_blockext(id, name, self)
	{
		$(self).next().html(name);
		var isopen = $("#list-panel").dialog('isOpen');
		if (isopen)
			filter_list_blockext();
	}
	
	function filter_list_blockext()
	{
		var name = $("#id_filter_text").val();

		$("#panel_body").load(wpext.list_temp.select , null,
				function()
				{
					obj_div = $("#panel_body div").hide();
					obj = $("#panel_body div:contains('" + name + "')");
					obj.show();
					
					//$(".drag_zone").draggable(drag_opt_4);
				});
	}
	
	/* endregion */
		
	/* region CONTENT IN PROFILE */
	
	function func_show_all10()
	{
		$("#list_body").load(wpcontent.list_temp.panel, null,
				function()
				{
					obj = $(".panel_header");
					
					$(obj).find(".add_button").click(add_content_);
					//$(".drag_zone").draggable(wpprofile.get_ui_opt.drag_opt_10);
					$("#id_filter_text").attr('size', '26');
					$("#id_filter_text").keypress(function(event)
							{
								if (event.keyCode == '13') 
								{
									filter_list10();
								}
								//utils.countdown_filter(filter_list10);
							});
					//$("#id_filter_text").keydown(utils.stop_filter_timer);
					utils.bind_hover($(".add_button"));
					$("#list-panel").dialog('open');
				});
		return false;
	}
	
	function add_content_()
	{
		var panel_body = $("#panel_body");
		
		$(panel_body).find("input[name=chklist]:checked").each(
				function()
				{
					var o = $(this);
					var id = o.parent().attr("id");
					var name = o.next().html();
					add_content(id, name);
				});
	}
	
	function func_show_add10()
	{
		var self = this;
		var data = {
				self: self,
				scope: 'content-profile',
				level: 2,
				prefix: '_1',
				func_save: save_to_content
		};
		wpcontent.init_form(data);
		return false;
	}
	
	function save_to_content()
	{
		var o = {
				level: 2,
				scope: 'content-profile',
				url : wpcontent.save_temp_url,
				savetemp :'inserttemp',
				func_add: add_content
		};
		return wpcontent.save_inner_form(o);
	}
	
	function add_content(id,name)
	{
		var form = $("#save-form-profile_1");
		wpprofile.add_content(form,id,name,"wizard.edit_content(this)");
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
				level: 2,
				prefix: '_1',
				url : wpcontent.save_temp_url,
				savetemp :'updatetemp',
				scope: 'content-profile',
				func_update: update_content,
				func_show_import: aaa,
				func_show_export: aaa
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
	
	function filter_list10()
	{
		var name = $("#id_filter_text").val();
		
		$("#panel_body").load(wpcontent.list_temp.select, null,
				function()
				{
					obj_div = $("#panel_body div").hide();
					obj = $("#panel_body div:contains('" + name + "')");
					obj.show();
					//$(".drag_zone").draggable(drag_opt_10);
				});
	}
	
	/* endregion */
		
	/* region ALLOW MIME IN PROFILE */
	
	function func_show_all5()
	{
		
		$("#list_body").load(wpmime.list_temp.panel, null,
				function()
				{
					obj = $(".panel_header");
					$(obj).find(".add_button").click(add_allowmime_);
					//$(".drag_zone").draggable(wpprofile.get_ui_opt.drag_opt_5);
					$("#id_filter_text").attr('size', '26');
					$("#id_filter_text").keypress(function(event)
							{
								if (event.keyCode == '13') 
								{
									filter_allowmime();
								}
								//utils.countdown_filter(filter_list5);
							});
					$("#id_filter_text").keydown(utils.stop_filter_timer);
					utils.bind_hover($(".add_button"));
					$("#list-panel").dialog('open');
				});
		return false;
	}
	
	function add_allowmime_()
	{
		var panel_body = $("#panel_body");
		
		$("#panel_body").find("input[name=chklist]:checked").each(
				function()
				{
					var o = $(this);
					var id = o.parent().attr("id");
					var name = o.next().html();
					add_allowmime(id, name);
				});
	}
	
	function func_show_add5()
	{
		var self = this;
		var data = {
				self: self,
				scope: 'allowmime-profile',
				level: 2,
				prefix: '_1',
				func_save: save_to_allowmime,
				func_show_import: aaa,
				func_show_export: aaa
		};
		wpmime.init_form(data);
		return false;
	}
	
	function save_to_allowmime()
	{
		var o = {
				level: 2,
				scope: 'allowmime-profile',
				url : wpmime.save_temp_url,
				savetemp : "inserttemp",
				func_add: add_allowmime
		};
		return wpmime.save_inner_form(o);
	}
	
	function add_allowmime(id ,name)
	{
		var form = $("#save-form-profile_1");
		wpprofile.add_allowmime(form,id,name,"wizard.edit_allowmime(this)");
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
				level: 2,
				prefix: '_1',
				scope: 'allowmime-profile',
				savetemp :'updatetemp',
				url : wpmime.save_temp_url,
				func_update: update_allowmime,
				func_show_import: aaa,
				func_show_export: aaa
		};
		wpmime.init_edit_form(data);
		return false;
	}
	
	function update_allowmime(id, name, self)
	{
		$(self).next().html(name);
		var isopen = $("#list-panel").dialog('isOpen');
		if (isopen)
			filter_allowmime();
	}
	
	function filter_allowmime()
	{
		var name = $("#id_filter_text").val();
		
		$("#panel_body").load(wpmime.list_temp.select, null,
				function()
				{
					obj_div = $("#panel_body div").hide();
					obj = $("#panel_body div:contains('" + name + "')");
					obj.show();
					//$(".drag_zone").draggable(drag_opt_5);
				});
	}
	
	/* endregion */
	
	/* region BLOCK MIME iN PROFILE. */
	
	function func_show_all6()
	{
		$("#list_body").load(wpmime.list_temp.panel, null,
				function()
				{
					obj = $(".panel_header");
					
					$(obj).find(".add_button").click(add_blockmime_);
					//$(".drag_zone").draggable(wpprofile.get_ui_opt.drag_opt_6);
					$("#id_filter_text").attr('size', '26');
					$("#id_filter_text").keyup(function()
							{
								if (event.keyCode == '13') 
								{
									filter_list6();
								}
								//utils.countdown_filter(filter_list6);
							});
					$("#id_filter_text").keydown(utils.stop_filter_timer);
					utils.bind_hover($(".add_button"));
					
					$("#list-panel").dialog('open');
				});
		return false;
	}
	
	function add_blockmime_()
	{
		var panel_body = $("#panel_body");
		
		$(panel_body).find("input[name=chklist]:checked").each(
				function()
				{
					var o = $(this);
					var id = o.parent().attr("id");
					var name = o.next().html();
					add_blockmime(id, name);
				});
	}
	
	function func_show_add6()
	{
		var self = this;
		var data = {
				self: self,
				scope: 'blockmime-profile',
				level: 2,
				prefix: '_1',
				func_save: save_to_blockmime,
				func_show_import: aaa,
				func_show_export: aaa
		}
		wpmime.init_form(data);
		return false;
	} 
	
	function save_to_blockmime()
	{
		var o = {
				level: 2,
				url : wpmime.save_temp_url,
				savetemp : "inserttemp",
				scope: 'blockmime-profile',
				func_add: add_blockmime
		};
		return wpmime.save_inner_form(o);
	}
	
	function add_blockmime(id, name)
	{
		var form = $("#save-form-profile_1");
		wpprofile.add_blockmime(form,id, name,'wizard.edit_blockmime(this)');
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
				level: 2,
				prefix: '_1',
				savetemp :'updatetemp',
				url : wpmime.save_temp_url,
				scope: 'blockmime-profile',
				func_update: update_blockmime,
				func_show_import: aaa,
				func_show_export: aaa
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
	
	function filter_list6()
	{
		var name = $("#id_filter_text").val();
		
		$("#panel_body").load(wpmime.list_temp.select , null,
				function()
				{
					obj_div = $("#panel_body div").hide();
					obj = $("#panel_body div:contains('" + name + "')");
					obj.show();
					
					//$(".drag_zone").draggable(drag_opt_6);
				});
	}
	
	/* endregion */
		
	/* region ExCEPTION IN PROFILE. */
	
	function func_show_allexcept1()
	{
		
		$("#list_body").load(defnet.list_temp.panel, null,
				function()
				{
					obj = $(".panel_header");
					
					$(obj).find(".add_button").click(add_exceptnet_);
					//$(".drag_zone").draggable(drag_opt_except_1);
					//$("#id_filters").change(filter_listexcept1);
					$("#id_filter_text").keypress(function(event)
							{
								if (event.keyCode == '13') 
								{
									filter_listexcept1();
								}
								//utils.countdown_filter(filter_listexcept1);
							});
							
					//$("#id_filter_text").keydown(utils.stop_filter_timer);
					utils.bind_hover($(".add_button"));
					$("#id_filters").hide();
					$("#list-panel").dialog('open');
				});
		return false;
	}
	
	
	function add_exceptnet_()
	{
		var panel_body = $("#panel_body");
		
		$(panel_body).find("input[name=chklist]:checked").each(
				function()
				{
					var o = $(this);
					var id = o.parent().attr("id");
					var name = o.next().html();
					add_exceptnet(id, name);
				});
	}
	
	//func_show_addexcept1
	function func_show_addexcept1()
	{
		var self = this;
		var data = {
				self: self,
				scope: 'exceptnet-profile',
				level : 2,
				prefix : "_1",
				savetemp: 'inserttemp',
				func_save: save_to_exceptnet,
				func_show_all: func_show_allexcept1,
				func_show_add: func_add_add
		};
		//defnet.init_form(data);
		defnet.init_form_wizard(data);
		return false;
	}
	
	function func_add_add()
	{	
		
		self = this;
		
		// get the level for next form.
		form_element = $(self).parent().parent().parent().parent();
		idform  = $(form_element).attr("id");
		
		var level = utils.get_next_form_level(idform);
		var prefix = utils.get_prefix(idform);
		
		var data = {};
		
		data = {
				self : self,
				level : level,
				prefix : prefix,	
				scope: 'exceptnet-profile',
				savetemp: 'inserttemp',
				func_save: save_to_exceptnet,
				func_show_add: func_add_add,
				func_show_all: func_show_allexcept1
		}
		
		defnet.init_form(data);
		return false;
	}
	
	function save_to_exceptnet()
	{
		var o = {
				level: 2,
				url : defnet.save_temp_url,
				savetemp :'inserttemp',
				scope: 'exceptnet-profile',
				func_add: add_exceptnet
		};
		
		return defnet.save_inner_form(o);
	}
	
	function add_exceptnet(id,name)
	{
		var form = $("#save-form-profile_1");
		wpprofile.add_exceptnet_wizard(form,id,name);
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
				level: 2,
				prefix: '_1',
				savetemp :'updatetemp',
				url : defnet.save_temp_url,
				scope: 'exceptnet-profile',
				func_update: update_exceptnet
		};
		
		defnet.init_edit_form_wizard(data);
		return false;
	}
	
	function update_exceptnet(id, name, self)
	{
		$(self).next().html(name);
		var isopen = $("#list-panel").dialog('isOpen');
		if (isopen)
			filter_listexcept1();
	}
	
	
	function filter_listexcept1()
	{
		var name = $("#id_filter_text").val();
		
		$("#panel_body").load(defnet.list_temp.select , null,
				function()
				{
					obj_div = $("#panel_body div").hide();
					obj = $("#panel_body div:contains('" + name + "')");
					obj.show();
					
					//$(".drag_zone").draggable(drag_opt_6);
				});
	}
	
	/* endregion */
	
	
	/* region add user */
	
	function func_show_allexcept2()
	{
	
		$("#list_body").load(defuser.list_temp.panel, null,
				function()
				{
					obj = $(".panel_header");
					
					$(obj).find(".add_button").click(add_exceptuser_);
					//$(".drag_zone").draggable(drag_opt_except_2);
					//$("#id_filters").change(filter_listexcept2);
					$("#id_filter_text").keypress(function()
							{
								if (event.keyCode == '13') 
								{
									filter_listexcept2();
								}
								//utils.countdown_filter(filter_listexcept2);
							});
					//$("#id_filter_text").keydown(utils.stop_filter_timer);
					utils.bind_hover($(".add_button"));
					$("#id_filters").hide();
					$("#list-panel").dialog('open');
				});
		return false;
	}
	
	function filter_listexcept2()
	{
		var name = "?find=" + $("#id_filters").val();
	
		$("#panel_body").load(defnet.list_temp.select, null,
				function()
				{
					obj_div = $("#panel_body div").hide();
					obj = $("#panel_body div:contains('" + name + "')");
					obj.show();
					
					//$(".drag_zone").draggable(drag_opt_except_2);
				});
	}
	
	function add_exceptuser_()
	{
		var panel_body = $("#list_body");
		$(panel_body).find("input[name=chklist]:checked").each(
				function()
				{
					var o = $(this);
					var id = o.parent().attr("id");
					a = $(o).attr("value");
					var name = o.next().html();
					//var _id = utils.get_itemid(id);			
					if (! is_excepteduser(id))
					{
						add_exceptuserinternal__(id, name);
					}
					
//					if (id.indexOf('userint') >= 0)
//						add_exceptuserinternal__(_id, name);
//
//					else
//						add_exceptuserexternal__(_id, name);
				});
	}
	
	function add_exceptuserinternal__(id, name)
	{
		var form = $("#save-form-profile_1"); 
		wpprofile.add_exceptuserinternal_wizard(form, id, name);
	}
	
	function add_exceptuserexternal__(id, name)
	{
		var form = $("#save-form-profile_1"); 
		wprofile.add_exceptuserinternal_wizard(form, name, name);
	}
	
	
	function is_excepteduser(isvalue)
	{
		var arr_id_ = [];
		
		var form = $("#exceptusers");
		lst_id = $(form.find("#id_exceptusers")).children();
		
		$(lst_id).each(function(){
			var lstid = $(this).attr('id');
			var lsttext = [];
			lsttext = lstid.split('_');
			arr_id_.push(lsttext[1]);
		});
		
		if ($.inArray(isvalue,arr_id_) > -1)
		{
			return true;
		}	
		return false;
	}
	/* endregion */
	
	
	/* region homepage */
	function homepage(obj)
	{
		var ooo = $(obj);
		ipaddress = $(ooo).attr("value");
		var search = "https://";
		var index = 0 ;
		
		x = window.location.href;
		
		index = x.indexOf(search)
		
		if (index == -1)
			ip = "http://" + ipaddress + ":" + "31280";
		else
			ip = "https://" + ipaddress + ":" + "31280";
			
		window.location = ip;
		
	}
	/* endregion*/
	
	
	
	
	
	
	
	
	
	

	
	
	
	
	
	
	
	
	
	
	
	
	
	
	//**************************************************************************************************
	
	/*
	 * This part is support parameter for dialog
	 */
	
	
	
	
	/*
	 *  alternative row
	 */
	function alternative_row()
	{
		obj_group = $("#wizard_content_add_group");
		
		obj_group.find("#members > div").removeClass("ui-state-default");
		obj_group.find("#members > div").removeClass("ui-state-hover");
		obj_group.find("#members > div:odd").addClass("ui-state-default");
		obj_group.find("#members > div:even").addClass("ui-state-hover");
	}
	
	
	/*
	 *  init when user click customise button
	 */

//	function init_list_cmd_profile()
//	{
//		$("#schedules .img_add").click(attach_schedule_event);
//		$("#schedules .img_folder").bind('click',function(){
//										attach_search_list_panel_event("#wizard_profile_search","#wizard_profile_list_search",profile_schedules,'0');
//										});
//		
//		$("#nets .img_add").click(attach_defnet_event); 
//		
//		$("#nets .img_folder").bind('click',function(){
//			attach_search_list_panel_event("#wizard_profile_search","#wizard_profile_list_search",profile_defnet,'0');
//		});
//		
//		$("#categories .img_add").click(attach_category_event);
//		
//		$("#whitelist .img_add").click(attach_whitelist_event);
//		
//		$("#blacklist .img_add").click(attach_blacklist_event);
//		
//		$("#allowexts .img_add").click(attach_allow_event);
//		
//		$("#blockexts .img_add").click(attach_block_event);
//		
//	}
//	
//	
//	function init_dialog_profile()
//	{
//		$("#dialog-add-schedule").dialog(schedule_dialog());
//		
//		$("#dialog-add-net").dialog(host_dialog());
//		
//		$("#dialog-add-cat").dialog(cat_dialog());
//		
//		$("#dialog-add-whitelist").dialog(whitelist_dialog());
//		
//		$("#dialog-add-blacklist").dialog(backlist_dialog());
//		
//		$("#dialog-add-allowext").dialog(allow_ext());
//		
//		$("#dialog-add-blockext").dialog(blocked_ext());
//	}
//	
	/*
	 * attach event
	 */
	
	//theses methods , it will attach event
	
	
	function attach_allow_event()
	{
		var self = this;
		var data = {
				self: self,
				scope: 'allowext',
				level: 1,
				prefix: '',
				func_save: aaa,
				func_show_import: aaa,
				func_show_export: aaa
		};
		wpext.init_form(data);
		return false;
	}
	
	function attach_block_event()
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
	
	function attach_schedule_event()
	{
		var self = this;
		//support one level only.
		var data = {
				self: self,
				scope: 'schedule',
				level: 1,
				prefix: '',
				func_save : save_to_schedule
		};
		
		defschedule.init_form(data);
		return false;
	}
	
	
	function show_add_netdialog()
	{
		var self = this;
		var data = {
				self: self,
				scope: 'net',
				func_save: save_to_defnet,
				func_show_all: show_all_2,
				func_show_add: show_add_netdialog,
				level : 1,
				prefix : ''
		};
		
		defnet.init_form(data);
	
		return false;
	}
	
	//
	function attach_defnet_event()
	{
		var self = this;
		
		var data = {
					self: self,
					scope: 'net',
					func_show_all : aaa,
					func_show_add : attach_defnet_event_level_2,
					level : 1,
					prefix :'',
					func_save : save_to_defnet
			};
			
		defnet.init_form(data);
		return false;
	}
	
	function attach_category_event()
	{
		var self = this;
		var data = {
				self: self,
				scope: 'cat',
				level: 1,
				prefix: '',
				func_save: save_to_cat,
				func_show_import: aaa,
				func_show_export: aaa,
				url : wpcat.save_temp_url
		};
		wpcat.init_form(data);
		return false;
	}
	
	function attach_whitelist_event()
	{
		var self = this;
		var data = {
				self: self,
				scope: 'whitelist',
				level: 1,
				prefix: '',
				func_save: aaa,
				func_show_import: aaa,
				func_show_export: aaa
		};
		wpwhitelist.init_form(data);
		return false;
	}
	
	function attach_blacklist_event()
	{
		var self = this;
		var data = {
				self: self,
				scope: 'blacklist',
				level: 1,
				prefix: '',
				func_save: aaa,
				func_show_import: aaa,
				func_show_export: aaa
		};
		wpblacklist.init_form(data);
		return false;
	}
	
	//show_all_11
	function aaa()
	{
		alert("aaa");
	}
	
	//show_add_netdialog
	function attach_defnet_event_level_2()
	{
		 
	}
	
	
	
	/*
	 * 
	 */
	function add_item_client(editclick,name,lstbox,dialog,css,classify)
	{
		
		var template_data = {
				'click' : "wizard.remove(this)",
				'editclick' : editclick,
				'css' : css,
				'name' : name,
				'classify' : classify
		};
		
		var h = new EJS({url: '/media/tpl/wizard_list_item_user.ejs'}).render(template_data);
		$(lstbox).append(h);
		
		$(dialog).dialog("close");
		
	}
	
	function remove(obj)
	{
		$(obj).parent().remove();
		return false;
	}
	
	/*
	 * 
	 */
	function save_to_defnet()
	{
		try
		{
			var data = {};
			var clstype = "";
			var css = "";
			
			init_dialog_error();
			
			form = $("#save-form-net_1");
			data = defnet.get_data(form,0,0);
			var type = data['type'];
			
			if (type == '1')
				clstype = "host"
			if (type == '2')
				clstype = "dns_host"
			if (type == '3')
				clstype = "network"
			if (type == '4')
				clstype = "network_group"
			
			css = definecss(clstype);
			
			$.post(url_save_defnet,data,function(result)
					{
						if (result.status == "success")
						{
							add_item_client("modify -- editlink",result.name,"#id_nets","#dialog-add-net",css,clstype);
						}
						
						if (result.status == "error")
						{
							show_error_dialog(result.error_info);
						}
					});
		}
		catch(error)
		{
			show_error_dialog(error.message);
		}
	}
	
	
//	function save_to_schedule()
//	{
//		try
//		{
//			var data = {};
//			var css = "";
//			
//			init_dialog_error();
//			
//			form = $("#save-form-schedule_1");
//			data = defschedule.get_data(form);
//			
//			css = definecss('schedules');
//			
//			$.post(url_save_schedule,data,function(result)
//			{
//				if (result.status == "success")
//				{
//					add_item_client("wpprofile.edit_schedule(this)",result.name,"#id_schedules","#dialog-add-schedule",css,'schedules');
//				}
//				if(result.status == "error")
//				{
//					show_error_dialog(result.error_info);
//				}
//				
//			});
//		}
//		catch(error) 
//		{
//			//console.log(error);
//			show_error_dialog(error.message);
//		}
//	}
	
	/*
	 *  defined css for profile.
	 */
	
	function definecss(classify)
	{
		if (classify  ==  'users')
			return "proxynow usericon spaceiconlist";
		if (classify == 'schedules')
			return "proxynow scheduleicon spaceiconlist";
		if (classify == "host")
			return "proxynow servericon spaceiconlist";
		if (classify == "dns_host")
			return "proxynow dnshosticon spaceiconlist";
		if (classify == "network")
			return "proxynow networkicon spaceiconlist";
		if (classify == "network_group")
			return "proxynow groupsicon spaceiconlist";
	}
	
	function close_remove_panel_search(currentdialog)
	{
		if (currentdialog == "#wizard_profile_search")
		{
			$("#wizard_list_panel_content_user").html("");
			$("#wizard_list_panel_user").dialog("close");
		}
		
		if (currentdialog == "#wizard_list_panel_user")
		{
			$("#wizard_profile_list_search").html("");
			$("#wizard_profile_search").dialog("close");
		}
	}
	
	
	
	function show_all_2()
	{
		alert("show all 2");
	}
	
	function show_add_2()
	{
		alert("show add 2");
	}
	

	
	
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
	}
	
	
	
	function hide_panel()
	{
		var isopen = $("#list-panel").dialog('isOpen');
		if (isopen)
			$("#list-panel").dialog('close');

		$("#leftcolumn").show();
	}
	
	

	return {
		next_form : next_form,
		back_form : back_form,
		skip_form : skip_form,
		import_setting_field : import_setting_field,
		get_the_list_fields : get_the_list_fields,
		import_test : import_test,
		
		
		
		close_dialog : close_dialog,
		open_group_adding : open_group_adding,
		wizard_open_edit_group : wizard_open_edit_group,
		wizard_delete_tempuser : wizard_delete_tempuser,
		wizard_open_dialog_policy : wizard_open_dialog_policy,
		wizard_save_policy :wizard_save_policy,
		wizard_open_dialog_edit_policy:wizard_open_dialog_edit_policy,
		wizard_create_profile:wizard_create_profile,
		searching_type_info:searching_type_info,
		adding_type_to_profile:adding_type_to_profile,
		remove : remove,
		edit_cat:edit_cat,
		edit_whitelist : edit_whitelist,
		edit_blacklist : edit_blacklist,
		edit_allowext : edit_allowext,
		edit_blockext : edit_blockext,
		edit_content : edit_content,
		edit_allowmime : edit_allowmime,
		edit_blockmime : edit_blockmime,
		edit_exceptnet : edit_exceptnet,
		init:init,
		save_to_net : save_to_net,
		show_add1:show_add1,
		edit_net : edit_net,
		remove_net:remove_net,
		edit_schedule:edit_schedule,
		homepage:homepage
	};

}());

var wp = (function()
{
	var save_url = "/wp/save/";

	function mode_change()
	{
		var val = $("#id_mode").val();
		if (val == '2')
		{
			$("#id_authentication > option[value=1]").attr("disabled", "disabled");
			var a = $("#id_authentication");
			if (a.val() == '1')
				a.val(['2']);
		}

		else
			$("#id_authentication > option[value=1]").removeAttr("disabled");
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

	function toggle_av()
	{
		if (this.checked)
			$("#id_avscansize").removeAttr("disabled");

		else
			$("#id_avscansize").attr("disabled", "disabled");
	}

	function get_data()
	{
		var av = ($("#id_av").attr("checked") == "checked" ? 1 : 0);
		var data = {
				av: av,
				avscansize: $("#id_avscansize").val(),
				mode: $("#id_mode").val(),
				authentication: $("#id_authentication").val(),
				safesearchon: $("#id_safesearchon").val(),
				id: "",
				save_type: ""
		}
		var id = $("#id_id").val();
		if (id != "")
		{
			data.id = id;
			data.save_type = "update";
		}

		return data;
	}

	function init()
	{
		$("#id_av").click(toggle_av);
		$("#id_mode").change(mode_change);
		$(".save_button.save").click(func_save);
		$(".save_button.save").css("margin-right", "0");
		mode_change();
		if ($("#id_id").val() != "")
		{
			if ($("#id_av").attr("checked") != "checked")
				$("#id_avscansize").attr("disabled", "disabled");
		}

		utils.bind_hover($(".save_button"));
	}

	function load()
	{
		return menu.get(save_url, init);
	}

	return {
		load:load
	};
}());
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
/*
 * @include "utils.js"
 */

var wpadvanceallow = (function()
{
	var save_url = "/wpadvanceallow/save/";
	var delete_url = "/wpadvanceallow/delete/";
	var save_port_url = "/wpadvanceallow/port/save/";
	var import_url = "/wpcat/import/";
	var export_url = "/wpcat/export/";

	function add_port_keypress(evt)
	{
		if (evt.keyCode == '13')
		{
			evt.preventDefault();
			evt.stopPropagation();
			add_port();
		}
	}

	function add_port()
	{
		var port = $("#id_port").val();
		if (port == '')
			return false;

		var arr = port.split(',');
		add_ports(arr, port);
		$("#id_port").val('');
		return false;
	}

	function add_ports(buff, ports)
	{
		var port = '';
		if (buff == null)
			return;

		else if (buff.length > 0)
		{
			if (ports == '')
				port = buff.join(',');

			else
				port = ports;

			var data = {
					data: port
			};
			$.post(save_url, data,
					function(result)
					{
						if (result == "success")
							func_add(buff);

						else if (result.error == 1)
						{
							var f = result.fail_list;
							for (var i = 0; i < f.length; i++)
							{
								var j = $.inArray(f[i], buff);
								if (j >= 0)
									buff.splice(j, 1);
							}

							func_add(buff);
						}

						else
						{
							wpadvanceskip.show_dialog(2, result);
						}
					});
		}
	}

	function func_add(arr)
	{
		var n = arr.length;
		var o = $("#wpadvanceallowlist");
		var data = null;
		var h = null;
		for (var i = 0; i < n; i++)
		{
			data = {
					id_prefix: 'port_',
					id: arr[i],
					click: 'wpadvanceallow.delete_port(this)',
					editclick: 'wpadvanceallow.edit_port(this)',
					name: arr[i]
			};
			h = new EJS({url: '/media/tpl/list_item.ejs'}).render(data);
			o.append(h);
		}

		utils.set_alt_css("#wpadvanceallowlist");
	}

	function delete_port(o)
	{
		var item = $(o);
		var id = item.parent().attr("id");
		var _id = utils.get_itemid(id);
		var data = {
				portid: _id
		};
		$.post(delete_url, data,
				function(result)
				{
					if (result == "success")
					{
						$("#wpadvanceallowlist").find("#" + id).remove();
						utils.set_alt_css("#wpadvanceallowlist");
					}

					else
					{
						wpadvanceskip.show_dialog(2, result);
					}
				});
	}

	function edit_port(obj)
	{
		var item = $(obj);
		var id = item.parent().attr("id");
		var _id = utils.get_itemid(id);
		var portvalue = item.next().html();
		var self = item;
		var data = {
				self: self,
				id: _id,
				portvalue: portvalue,
				level: 1,
				prefix: '',
				scope: ''
		};
		init_edit_port_form(data);
		return false;
	}

	function update_port(o)
	{
		var i = o.level - 1;
		var sep = (o.scope == '' ? '' : '-');
		var prefix = (o.level < 1 ? '' : '_' + o.level);
		var _prefix = (i < 1 ? '' : '_' + i);
		var currform = $("#save-portform" + sep + o.scope + prefix);
		var portvalue = currform.find("#id_port").val();
		if ($.trim(portvalue) == '')
			return;

		var data = {
				portid: o.id,
				newportid: portvalue
		};
		$.post(save_port_url, data,
				function(result)
				{
					if (result.success == 1)
					{
						$(o.self).next().html(result.port);
						$(o.self).parent().attr("id", "port_" + result.port);
						utils.cancel_dialog(o.level, "#dialog-edit-allowport" + sep + o.scope);
					}

					else
					{
						wpadvanceskip.show_dialog(2, result);
					}
				});
	}

	function show_import()
	{
		var self = this;
		var data = {
				self: self,
				level: 1,
				prefix: '',
				scope: ''
		};
		init_import_form(data);
		return false;
	}

	function show_export()
	{
		var self = this;
		var data = {
				self: self,
				level: 1,
				prefix: '',
				scope: ''
		}
		init_export_form(data);
		return false;
	}

	function init_edit_port_form(data)
	{
		var offset = $(data.self).offset();
		var position = [offset.left, utils.get_elm_top(offset.top)];
		var _prefix = '_' + data.level;
		var sep = (data.scope == '' ? '' : '-');
		var scopeq = (data.scope == '' ? '' : '&scope=' + data.scope);
		utils.remove_dialog("#dialog-edit-allowport" + sep + data.scope + _prefix);
		var url = (data.url == null ? save_port_url : data.url);
		$("#dialog-edit-allowport" + sep + data.scope + data.prefix).dialog('option', 'position', position);
		$("#dialog_edit_body-allowport" + sep + data.scope + data.prefix).load(url + "?level=" + data.level + scopeq, null,
				function()
				{
					var nextform = $("#save-portform" + sep + data.scope + _prefix);
					nextform.find("#id_port").val(data.portvalue);
					nextform.find(".save_button.save").click(function()
							{
								return update_port(data);
							});
					nextform.find(".save_button.cancel").click(function()
							{
								utils.cancel_dialog(data.level, "#dialog-edit-allowport" + sep + data.scope);
							});
					utils.bind_hover(nextform.find(".save_button"));
					$("#dialog-edit-allowport" + sep + data.scope + data.prefix).dialog('open');
				});
	}

	function init_import_form(data)
	{
		var offset = $(data.self).offset();
		var position = [offset.left, utils.get_elm_top(offset.top)];
		var _prefix = '_' + data.level;
		var sep = (data.scope == '' ? '' : '-');
		var scopeq = (data.scope == '' ? '' : '&scope=' + data.scope);
		$("#dialog-import-allowport" + sep + data.scope + data.prefix).dialog('option', 'position', position);
		$("#dialog_import_body-allowport" + sep + data.scope + data.prefix).load(import_url + "?level=" + data.level + scopeq, null,
				function()
				{
					var nextform = $("#import-form" + sep + data.scope + _prefix);
					nextform.find(".save_button.import").click(function()
							{
								return func_import(data);
							});
					nextform.find(".save_button.cancel").click(function()
							{
								utils.cancel_dialog(data.level, "#dialog-import-allowport" + sep + data.scope);
							});
					utils.bind_hover(nextform.find(".save_button"));
					$("#dialog-import-allowport" + sep + data.scope + data.prefix).dialog('open');
				});
	}

	function init_export_form(data)
	{
		var offset = $(data.self).offset();
		var position = [offset.left, utils.get_elm_top(offset.top)];
		var _prefix = '_' + data.level;
		var sep = (data.scope == '' ? '' : '-');
		var scopeq = (data.scope == '' ? '' : '&scope=' + data.scope);
		$("#dialog-export-allowport" + sep + data.scope + data.prefix).dialog('option', 'position', position);
		$("#dialog_export_body-allowport" + sep + data.scope + data.prefix).load(export_url + "?level=" + data.level + scopeq, null,
				function()
				{
					var nextform = $("#export-form" + sep + data.scope + _prefix);
					nextform.find(".save_button.cancel").click(function()
							{
								utils.cancel_dialog(data.level, "#dialog-export-allowport" + sep + data.scope);
							});
					nextform.find("#id_delimiter").change(set_export_delimiter);
					utils.bind_hover(nextform.find(".save_button"));
					init_export_data(nextform);
					$("#dialog-export-allowport" + sep + data.scope + data.prefix).dialog('open');
				});
	}

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

	function init_export_data(form)
	{
		set_export_text(form);
	}

	function set_export_delimiter()
	{
		var form = utils.get_parent(this, 2);
		set_export_text(form);
	}

	function set_export_text(currform)
	{
		var delimiter = get_delimiter(currform);
		var exporttxt = '';
		$("#wpadvanceallowlist > div").each(
				function()
				{
					var v = $(this).children().last().html();
					exporttxt += v + delimiter;
				});
		currform.find("#id_exporttext").val(exporttxt);
	}

	function func_import(o)
	{
		var sep = (o.scope == '' ? '' : '-');
		var prefix = (o.level < 1 ? '' : '_' + o.level);
		var currform = $("#import-form" + sep + o.scope + prefix);
		var txt = currform.find("#id_importtext").val();
		var arr = null;
		if ($.trim(txt) == '')
			return;

		var j = txt.indexOf('\n');
		if (j >= 0)
		{
			arr = txt.split('\n');
			add_ports(arr, '');
			utils.cancel_dialog(o.level, "#dialog-import-allowport" + sep + o.scope);
			return;
		}

		j = txt.indexOf(',');
		if (j >= 0)
		{
			arr = txt.split(',');
			add_ports(arr, '');
			utils.cancel_dialog(o.level, "#dialog-import-allowport" + sep + o.scope);
			return;
		}

		j = txt.indexOf(';');
		if (j >= 0)
		{
			arr = txt.split(';');
			add_ports(arr, '');
			utils.cancel_dialog(o.level, "#dialog-import-allowport" + sep + o.scope);
			return;
		}

		// only have 1 item
		arr = [txt];
		add_ports(arr, '');
		utils.cancel_dialog(o.level, "#dialog-import-allowport" + sep + o.scope);
	}

	function init()
	{
		$("#id_port").keypress(add_port_keypress);
		$("#port_input").find(".add_button").click(add_port);
		$(".img_import").click(show_import);
		$(".img_export").click(show_export);
		utils.bind_hover($("#port_input").find(".add_button"));
		utils.set_alt_css("#wpadvanceallowlist");
	}

	return {
		init:init,
		edit_port:edit_port,
		delete_port:delete_port
	}
}());
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
var wpblacklist = (function()
{
	var save_url = "/wpblacklist/save/";
	var delete_url = "/wpblacklist/delete/";
	var list_url = "/wpblacklist/list/";
	var list = {
			panel: '/wpblacklist/list/panel/',
			select: '/wpblacklist/list/select/'
	};
	
	var save_temp_url = "/wpblacklist/save/temp/";
	var list_temp = {
			panel: '/wpblacklist/list/panel/temp/',
			select: '/wpblacklist/list/select/temp/'
	}
	
	var save_url_url = "/wpcat/url/save/";
	var import_url = "/wpcat/import/";
	var export_url = "/wpcat/export/";
	var popup_dialog_opt = null;
	var popup_dialog_edit_url_opt = null;
	var popup_dialog_import_opt = null;
	var popup_dialog_export_opt = null;

	function init_ui_opt()
	{
		popup_dialog_opt = {
				autoOpen: false,
				width: 320,
				resizable: false,
				draggable: false,
				modal: false,
				stack: true,
				zIndex: 1001
		};
		popup_dialog_edit_url_opt = {
				autoOpen: false,
				width: 320,
				resizable: false,
				draggable: false,
				modal: false,
				stack: true,
				zIndex: 1002
		};
		popup_dialog_import_opt = {
				autoOpen: false,
				width: 350,
				resizable: false,
				draggable: false,
				modal: false,
				stack: true,
				zIndex: 1002
		};
		popup_dialog_export_opt = {
				autoOpen: false,
				width: 350,
				resizable: false,
				draggable: false,
				modal: false,
				stack: true,
				zIndex: 1002
		};
	}

	function get_ui_opt()
	{
		init_ui_opt();
		return {
			popup_dialog_opt: popup_dialog_opt,
			popup_dialog_edit_url_opt: popup_dialog_edit_url_opt,
			popup_dialog_import_opt: popup_dialog_import_opt,
			popup_dialog_export_opt: popup_dialog_export_opt
		}
	}

	function init_form(data)
	{
		var offset = $(data.self).offset();
		var position = [offset.left, utils.get_elm_top(offset.top)];
		var _prefix = '_' + data.level;
		var sep = (data.scope == '' ? '' : '-');
		var scopeq = (data.scope == '' ? '' : '&scope=' + data.scope);
		var wizq = (data.url == null ? '' : '&wiz=1');
		utils.remove_dialog("#dialog-add" + sep + data.scope + _prefix);
		$("#dialog_edit_body" + sep + data.scope + data.prefix).empty();
		$("#dialog-edit" + sep + data.scope + data.prefix).dialog('close');
		var url = (data.url == null ? save_url : data.url);
		$("#dialog-add" + sep + data.scope + data.prefix).dialog('option', 'position', position);
		$("#dialog_body" + sep + data.scope + data.prefix).load(url + "?level=" + data.level + scopeq + wizq, null,
				function()
				{
					var nextform = $("#save-form" + sep + data.scope + _prefix);
					utils.set_data(nextform.find("#url_list"), 'urls', []);
					nextform.find("#id_url").keypress(function(evt)
							{
								url_keypress(evt, nextform);
							});
					nextform.find(".wpblacklist_form1 .add_button").click(function()
							{
								return add_url(nextform);
							});
					nextform.find(".save_button.save").click(data.func_save);
					nextform.find(".save_button.cancel").click(function()
							{
								utils.cancel_dialog(data.level, "#dialog-add" + sep + data.scope);
							});
					nextform.find(".img_import").click(data.func_show_import);
					nextform.find(".img_export").click(data.func_show_export);
					$("#dialog-editurl" + sep + data.scope + _prefix).dialog(get_ui_opt().popup_dialog_edit_url_opt);
					$("#dialog-import" + sep + data.scope + _prefix).dialog(get_ui_opt().popup_dialog_import_opt);
					$("#dialog-export" + sep + data.scope + _prefix).dialog(get_ui_opt().popup_dialog_export_opt);
					utils.bind_hover(nextform.find(".save_button,.wpblacklist_form1 .add_button"));
					$("#dialog-add" + sep + data.scope + data.prefix).dialog('open');
				});
	}

	function init_edit_form(data)
	{
		var offset = $(data.self).offset();
		var position = [offset.left, utils.get_elm_top(offset.top)];
		var _prefix = '_' + data.level;
		var sep = (data.scope == '' ? '' : '-');
		var scopeq = (data.scope == '' ? '' : '&scope=' + data.scope);
		var wizq = (data.url == null ? '' : '&wiz=1');
		utils.remove_dialog("#dialog-edit" + sep + data.scope + _prefix);
		$("#dialog_body" + sep + data.scope + data.prefix).empty();
		$("#dialog-add" + sep + data.scope + data.prefix).dialog('close');
		var url = (data.url == null ? save_url : data.url);
		$("#dialog-edit" + sep + data.scope + data.prefix).dialog('option', 'position', position);
		$("#dialog_edit_body" + sep + data.scope + data.prefix).load(url + "?id=" + data.id + "&level=" + data.level + scopeq + wizq, null,
				function()
				{
					var nextform = $("#save-form" + sep + data.scope + _prefix);
					nextform.find("#id_url").keypress(function(evt)
							{
								url_keypress(evt, nextform);
							});
					nextform.find(".wpblacklist_form1 .add_button").click(function()
							{
								return add_url(nextform);
							});
					nextform.find(".save_button.save").click(function()
							{
								return update_inner_form(data);
							});
					nextform.find(".save_button.cancel").click(function()
							{
								utils.cancel_dialog(data.level, "#dialog-edit" + sep + data.scope);
							});
					nextform.find(".img_import").click(data.func_show_import);
					nextform.find(".img_export").click(data.func_show_export);
					$("#dialog-editurl" + sep + data.scope + _prefix).dialog(get_ui_opt().popup_dialog_edit_url_opt);
					$("#dialog-import" + sep + data.scope + _prefix).dialog(get_ui_opt().popup_dialog_import_opt);
					$("#dialog-export" + sep + data.scope + _prefix).dialog(get_ui_opt().popup_dialog_export_opt);
					set_items(nextform);
					utils.bind_hover(nextform.find(".save_button,.wpblacklist_form1 .add_button"));
					$("#dialog-edit" + sep + data.scope + data.prefix).dialog('open');
				});
	}

	function init_edit_url_form(data)
	{
		var offset = $(data.self).offset();
		var position = [offset.left, utils.get_elm_top(offset.top)];
		var _prefix = '_' + data.level;
		var sep = (data.scope == '' ? '' : '-');
		var scopeq = (data.scope == '' ? '' : '&scope=' + data.scope);
		utils.remove_dialog("#dialog-editurl" + sep + data.scope + _prefix);
		var url = (data.url == null ? save_url_url : data.url);
		$("#dialog-editurl" + sep + data.scope + data.prefix).dialog('option', 'position', position);
		$("#dialog_editurl_body" + sep + data.scope + data.prefix).load(url + "?level=" + data.level + scopeq, null,
				function()
				{
					var nextform = $("#save-urlform" + sep + data.scope + _prefix);
					nextform.find("#id_url").val(data.urlvalue);
					nextform.find(".save_button.save").click(function()
							{
								return update_url(data);
							});
					nextform.find(".save_button.cancel").click(function()
							{
								utils.cancel_dialog(data.level, "#dialog-editurl" + sep + data.scope);
							});
					utils.bind_hover(nextform.find(".save_button"));
					$("#dialog-editurl" + sep + data.scope + data.prefix).dialog('open');
				});
	}

	function init_import_form(data)
	{
		var offset = $(data.self).offset();
		var position = [offset.left, utils.get_elm_top(offset.top)];
		var _prefix = '_' + data.level;
		var sep = (data.scope == '' ? '' : '-');
		var scopeq = (data.scope == '' ? '' : '&scope=' + data.scope);
		$("#dialog-import" + sep + data.scope + data.prefix).dialog('option', 'position', position);
		$("#dialog_import_body" + sep + data.scope + data.prefix).load(import_url + "?level=" + data.level + scopeq, null,
				function()
				{
					var nextform = $("#import-form" + sep + data.scope + _prefix);
					nextform.find(".save_button.import").click(function()
							{
								return func_import(data);
							});
					nextform.find(".save_button.cancel").click(function()
							{
								utils.cancel_dialog(data.level, "#dialog-import" + sep + data.scope);
							});
					utils.bind_hover(nextform.find(".save_button"));
					$("#dialog-import" + sep + data.scope + data.prefix).dialog('open');
				});
	}

	function init_export_form(data)
	{
		var offset = $(data.self).offset();
		var position = [offset.left, utils.get_elm_top(offset.top)];
		var _prefix = '_' + data.level;
		var sep = (data.scope == '' ? '' : '-');
		var scopeq = (data.scope == '' ? '' : '&scope=' + data.scope);
		$("#dialog-export" + sep + data.scope + data.prefix).dialog('option', 'position', position);
		$("#dialog_export_body" + sep + data.scope + data.prefix).load(export_url + "?level=" + data.level + scopeq, null,
				function()
				{
					var nextform = $("#export-form" + sep + data.scope + _prefix);
					nextform.find(".save_button.cancel").click(function()
							{
								utils.cancel_dialog(data.level, "#dialog-export" + sep + data.scope);
							});
					nextform.find("#id_delimiter").change(set_export_delimiter);
					utils.bind_hover(nextform.find(".save_button"));
					init_export_data(data, nextform);
					$("#dialog-export" + sep + data.scope + data.prefix).dialog('open');
				});
	}



	function show_form()
	{
		$("#left_box").load(save_url, null,
				function()
				{
					var form = $("#save-form");
					utils.set_data(form.find("#url_list"), 'urls', []);
					$("#left_box").css('width', '300px');
					$("#id_url").keypress(function(evt)
							{
								url_keypress(evt, form);
							});
					$(".wpblacklist_form1 .add_button").click(function()
							{
								return add_url(form);
							});
					$(".save_button.save").click(func_save);
					$(".save_button.cancel,.form_title div.close").click(utils.cancel_form);
					$(".img_import").click(show_import);
					$(".img_export").click(show_export);
					$("#dialog-editurl").dialog(popup_dialog_edit_url_opt);
					$("#dialog-import").dialog(popup_dialog_import_opt);
					$("#dialog-export").dialog(popup_dialog_export_opt);
					utils.bind_hover($(".save_button,.form_title div.close,.wpblacklist_form1 .add_button"));
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
					var form = $("#save-form");
					$("#left_box").css('width', '300px');
					$("#id_url").keypress(function(evt)
							{
								url_keypress(evt, form);
							});
					$(".wpblacklist_form1 .add_button").click(function()
							{
								return add_url(form);
							});
					$(".save_button.save").click(
							function()
							{
								if (o.clone == null)
									return func_update(arg);

								else
									return func_save();
							});
					$(".save_button.cancel,.form_title div.close").click(utils.cancel_form);
					$(".img_import").click(show_import);
					$(".img_export").click(show_export);
					$("#dialog-editurl").dialog(popup_dialog_edit_url_opt);
					$("#dialog-import").dialog(popup_dialog_import_opt);
					$("#dialog-export").dialog(popup_dialog_export_opt);
					set_items(form);
					utils.bind_hover($(".save_button,.form_title div.close,.wpblacklist_form1 .add_button"));
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
				text: keyword,
				confirm: ''
		};
		ajax_delete(data, item);
	}

	function func_clone()
	{
		var self = this;
		edit_helper({self: self, clone: 1});
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

	function save_inner_form(o)
	{
		o['url'] = (o.url == null ? save_url : o.url);
		o['func_get_data'] = get_data;
		o['func_show_dialog'] = utils.show_dialog;
		return wpfilter.save(o);
	}

	function update_inner_form(o)
	{
		var i = o.level - 1;
		var sep = (o.scope == '' ? '' : '-');
		var prefix = (o.level < 1 ? '' : '_' + o.level);
		var _prefix = (i < 1 ? '' : '_' + i);
		var currform = $("#save-form" + sep + o.scope + prefix);
		var prevform = $("#save-form" + sep + o.scope + _prefix);
		var savetemp = (o.savetemp == null ? 'update' : o.savetemp);
		var data = get_data(currform, o.id, savetemp);
		data['level'] = o.level;
		var url = (o.url == null ? save_url : o.url);
		$.post(url, data,
				function(result)
				{
					if (result.success == 1)
					{
						o.func_update(result.id, result.name, o.self);
						utils.cancel_dialog(o.level, "#dialog-edit" + sep + o.scope);
					}

					else if (result.error == 1)
					{
						err = utils.get_errors(result.errors);
						utils.show_dialog(1, err);
					}

					else
					{
						utils.show_dialog(2, result);
					}
				});
	}

	function init_export_data(o, form)
	{
		var i = o.level - 1;
		var sep = (o.scope == '' ? '' : '-');
		var _prefix = (i < 1 ? '' : '_' + i);
		var prevform = $("#save-form" + sep + o.scope + _prefix);
		set_export_text(prevform, form);
	}

	function set_export_delimiter()
	{
		var form = utils.get_parent(this, 2);
		var formid = form.attr("id");
		var level = utils.get_form_level(formid);
		var scope = utils.get_form_scope(formid);
		var i = level - 1;
		var sep = (scope == '' ? '' : '-');
		var _prefix = (i < 1 ? '' : '_' + i);
		var prevform = $("#save-form" + sep + scope + _prefix);
		set_export_text(prevform, form);
	}

	function set_export_text(prevform, currform)
	{
		var delimiter = get_delimiter(currform);
		var arr = prevform.find("#url_list").data('urls');
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

	function show_import()
	{
		var o = get_level_data(this);
		var self = this;
		var data = {
				self: self,
				level: o.level,
				prefix: o.prefix,
				scope: ''
		};
		init_import_form(data);
		return false;
	}

	function show_export()
	{
		var o = get_level_data(this);
		var self = this;
		var data = {
				self: self,
				level: o.level,
				prefix: o.prefix,
				scope: ''
		}
		init_export_form(data);
		return false;
	}

	function url_keypress(evt, form)
	{
		if (evt.keyCode == '13')
		{
			evt.preventDefault();
			evt.stopPropagation();
			add_url(form);
		}
	}

	function add_url(form)
	{
		var v = form.find("#id_url").val();
		if (v == '')
			return false;

		var arr = [v];
		add_urls(form, arr);
		form.find("#id_url").val('');
		return false;
	}

	function add_urls(form, buff)
	{
		var l = form.find("#url_list");
		var arr = l.data('urls');
		var n = 0;
		if (buff == null)
			return;

		else if (buff.length > 0)
		{
			n = buff.length;
			for (var i = 0; i < n; i++)
			{
				var v = buff[i];
				if (v == '')
					continue;

				if (!utils.item_exist(v, arr))
				{
					arr.push(v);
					var data = {
							id_prefix: 'url_',
							id: 'item',
							click: 'wpblacklist.remove_url(this)',
							editclick: 'wpblacklist.edit_url(this)',
							name: v
					};
					var h = new EJS({url: '/media/tpl/list_item.ejs'}).render(data);
					l.append(h);
				}
			}

			utils.set_data(form.find("#url_list"), 'urls', arr);
			set_alt_css(form, "#url_list");
		}
	}

	function remove_url(o)
	{
		var item = $(o);
		var v = item.next().next().html();
		var form = utils.get_parent(item, 4);
		var arr = form.find("#url_list").data('urls');
		var i = $.inArray(v, arr);
		if (i >= 0)
		{
			arr.splice(i, 1)
			utils.set_data(form.find("#url_list"), 'urls', arr);
		}

		item.parent().remove();
		set_alt_css(form, "#url_list");
		return false;
	}

	function edit_url(obj)
	{
		var item = $(obj);
		var urlvalue = item.next().html();
		var form = utils.get_parent(item, 5);
		var form_id = form.attr("id");
		var scope = utils.get_form_scope(form_id);
		var arr = form.find("#url_list").data('urls');
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
			init_edit_url_form(data);
			return false;
		}

		return false;
	}

	function update_url(o)
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

		var arr = prevform.find("#url_list").data('urls');
		var j = $.inArray(o.urlvalue, arr);
		if (j >= 0)
		{
			arr[j] = urlvalue;
			$(o.self).next().html(urlvalue);
			utils.set_data(prevform.find("#url_list"), 'urls', arr);
			utils.cancel_dialog(o.level, "#dialog-editurl" + sep + o.scope);
		}
	}

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

	function func_import(o)
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
			add_urls(prevform, arr);
			utils.cancel_dialog(o.level, "#dialog-import" + sep + o.scope);
			return;
		}

		j = txt.indexOf(',');
		if (j >= 0)
		{
			arr = txt.split(',');
			add_urls(prevform, arr);
			utils.cancel_dialog(o.level, "#dialog-import" + sep + o.scope);
			return;
		}

		j = txt.indexOf(';');
		if (j >= 0)
		{
			arr = txt.split(';');
			add_urls(prevform, arr);
			utils.cancel_dialog(o.level, "#dialog-import" + sep + o.scope);
			return;
		}

		// only have 1 item
		arr = [txt];
		add_urls(prevform, arr);
		utils.cancel_dialog(o.level, "#dialog-import" + sep + o.scope);
	}

	function get_data(form, arg, savetype)
	{
		var arr = form.find("#url_list").data('urls');
		var data = {
				name: form.find("#id_name").val(),
				comment: form.find("#id_comment").val(),
				urls: arr.join('||'),
				id: arg,
				save_type: savetype
		}

		return data;
	}

	function get_level_data(self)
	{
		var currform = utils.get_parent(self, 4);
		return get_form_level_data(currform);
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

	function set_items(form)
	{
		var arr = [];
		form.find("#url_list > div").each(
				function()
				{
					var v = $(this).find(".item_edit").next().html();
					if (!utils.item_exist(v, arr))
					{
						arr.push(v);
					}
				});
		utils.set_data(form.find("#url_list"), 'urls', arr);
		set_alt_css(form, "#url_list");
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
		utils.init_alert_dialog("#dialog-message");
		utils.init_confirm_delete("#confirm-delete");
		utils.bind_hover($("#id_add,#id_find"));
		nav_list.config.list_url = list_url;
		nav_list.config.list_func = init_list;
		nav_list.init();
	}

	function load()
	{
		return menu.get('/wpblacklist/', init);
	}

	return {
		load:load,
		list:list,
		list_temp : list_temp,
		init:init,
		edit_url:edit_url,
		remove_url:remove_url,
		get_level_data:get_level_data,
		init_form:init_form,
		init_edit_form:init_edit_form,
		init_edit_url_form:init_edit_url_form,
		init_import_form:init_import_form,
		init_export_form:init_export_form,
		save_inner_form:save_inner_form,
		get_ui_opt: get_ui_opt,
		save_temp_url:save_temp_url
	};
}());
/*
 * @include "utils.js"
 */

var wpcat = (function()
{
	var save_url = "/wpcat/save/";
	var delete_url = "/wpcat/delete/";
	var list_url = "/wpcat/list/";
	var list = {
			panel: '/wpcat/list/panel/',
			select: '/wpcat/list/select/'
	};
	var save_temp_url = "/wpcat/save/temp/";
	var save_url_url = "/wpcat/url/save/";
	var import_url = "/wpcat/import/";
	var export_url = "/wpcat/export/";
	
	var list_temp = {
		panel : '/wpcat/list/panel/temp/',
		select : '/wpcat/list/select/temp/'
	};
	
	var popup_dialog_opt = null;
	var popup_dialog_edit_url_opt = null;
	var popup_dialog_import_opt = null;
	var popup_dialog_export_opt = null;

	function init_ui_opt()
	{
		popup_dialog_opt = {
				autoOpen: false,
				width: 320,
				resizable: false,
				draggable: false,
				modal: false,
				stack: true,
				zIndex: 1001
		};
		popup_dialog_edit_url_opt = {
				autoOpen: false,
				width: 320,
				resizable: false,
				draggable: false,
				modal: false,
				stack: true,
				zIndex: 1002
		};
		popup_dialog_import_opt = {
				autoOpen: false,
				width: 350,
				resizable: false,
				draggable: false,
				modal: false,
				stack: true,
				zIndex: 1002
		};
		popup_dialog_export_opt = {
				autoOpen: false,
				width: 350,
				resizable: false,
				draggable: false,
				modal: false,
				stack: true,
				zIndex: 1002
		};
	}

	function get_ui_opt()
	{
		init_ui_opt();
		return {
			popup_dialog_opt: popup_dialog_opt,
			popup_dialog_edit_url_opt: popup_dialog_edit_url_opt,
			popup_dialog_import_opt: popup_dialog_import_opt,
			popup_dialog_export_opt: popup_dialog_export_opt
		};
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
					var nextform = $("#save-form" + sep + data.scope + _prefix);
					utils.set_data(nextform.find("#url_list"), 'urls', []);
					nextform.find("#id_url").keypress(function(evt)
							{
								url_keypress(evt, nextform);
							});
					nextform.find(".wpcat_form1 .add_button").click(function()
							{
								return add_url(nextform);
							});
					nextform.find(".save_button.save").click(data.func_save);
					nextform.find(".save_button.cancel").click(function()
							{
								utils.cancel_dialog(data.level, "#dialog-add" + sep + data.scope);
							});
					nextform.find(".img_import").click(data.func_show_import);
					nextform.find(".img_export").click(data.func_show_export);
					$("#dialog-editurl" + sep + data.scope + _prefix).dialog(get_ui_opt().popup_dialog_edit_url_opt);
					$("#dialog-import" + sep + data.scope + _prefix).dialog(get_ui_opt().popup_dialog_import_opt);
					$("#dialog-export" + sep + data.scope + _prefix).dialog(get_ui_opt().popup_dialog_export_opt);
					utils.bind_hover(nextform.find(".save_button,.wpcat_form1 .add_button"));
					$("#dialog-add" + sep + data.scope + data.prefix).dialog('open');
				});
	}

	function init_edit_form(data)
	{
		var offset = $(data.self).offset();
		var position = [offset.left, utils.get_elm_top(offset.top)];
		var _prefix = '_' + data.level;
		var sep = (data.scope == '' ? '' : '-');
		var scopeq = (data.scope == '' ? '' : '&scope=' + data.scope);
		var wizq = (data.url == null ? '' : '&wiz=1');
		utils.remove_dialog("#dialog-edit" + sep + data.scope + _prefix);
		$("#dialog_body" + sep + data.scope + data.prefix).empty();
		$("#dialog-add" + sep + data.scope + data.prefix).dialog('close');
		var url = (data.url == null ? save_url : data.url);
		$("#dialog-edit" + sep + data.scope + data.prefix).dialog('option', 'position', position);
		$("#dialog_edit_body" + sep + data.scope + data.prefix).load(url + "?id=" + data.id + "&level=" + data.level + scopeq + wizq, null,
				function()
				{
					var nextform = $("#save-form" + sep + data.scope + _prefix);
					nextform.find("#id_url").keypress(function(evt)
							{
								url_keypress(evt, nextform);
							});
					nextform.find(".wpcat_form1 .add_button").click(function()
							{
								return add_url(nextform);
							});
					nextform.find(".save_button.save").click(function()
							{
								return update_inner_form(data);
							});
					nextform.find(".save_button.cancel").click(function()
							{
								utils.cancel_dialog(data.level, "#dialog-edit" + sep + data.scope);
							});
					nextform.find(".img_import").click(data.func_show_import);
					nextform.find(".img_export").click(data.func_show_export);
					$("#dialog-editurl" + sep + data.scope + _prefix).dialog(get_ui_opt().popup_dialog_edit_url_opt);
					$("#dialog-import" + sep + data.scope + _prefix).dialog(get_ui_opt().popup_dialog_import_opt);
					$("#dialog-export" + sep + data.scope + _prefix).dialog(get_ui_opt().popup_dialog_export_opt);
					set_items(nextform);
					utils.bind_hover(nextform.find(".save_button,.wpcat_form1 .add_button"));
					$("#dialog-edit" + sep + data.scope + data.prefix).dialog('open');
				});
	}

	function init_edit_url_form(data)
	{
		var offset = $(data.self).offset();
		var position = [offset.left, utils.get_elm_top(offset.top)];
		var _prefix = '_' + data.level;
		var sep = (data.scope == '' ? '' : '-');
		var scopeq = (data.scope == '' ? '' : '&scope=' + data.scope);
		utils.remove_dialog("#dialog-editurl" + sep + data.scope + _prefix);
		var url = (data.url == null ? save_url_url : data.url);
		$("#dialog-editurl" + sep + data.scope + data.prefix).dialog('option', 'position', position);
		$("#dialog_editurl_body" + sep + data.scope + data.prefix).load(url + "?level=" + data.level + scopeq, null,
				function()
				{
					var nextform = $("#save-urlform" + sep + data.scope + _prefix);
					nextform.find("#id_url").val(data.urlvalue);
					nextform.find(".save_button.save").click(function()
							{
								return update_url(data);
							});
					nextform.find(".save_button.cancel").click(function()
							{
								utils.cancel_dialog(data.level, "#dialog-editurl" + sep + data.scope);
							});
					utils.bind_hover(nextform.find(".save_button"));
					$("#dialog-editurl" + sep + data.scope + data.prefix).dialog('open');
				});
	}

	function init_import_form(data)
	{
		var offset = $(data.self).offset();
		var position = [offset.left, utils.get_elm_top(offset.top)];
		var _prefix = '_' + data.level;
		var sep = (data.scope == '' ? '' : '-');
		var scopeq = (data.scope == '' ? '' : '&scope=' + data.scope);
		$("#dialog-import" + sep + data.scope + data.prefix).dialog('option', 'position', position);
		$("#dialog_import_body" + sep + data.scope + data.prefix).load(import_url + "?level=" + data.level + scopeq, null,
				function()
				{
					var nextform = $("#import-form" + sep + data.scope + _prefix);
					nextform.find(".save_button.import").click(function()
							{
								return func_import(data);
							});
					nextform.find(".save_button.cancel").click(function()
							{
								utils.cancel_dialog(data.level, "#dialog-import" + sep + data.scope);
							});
					utils.bind_hover(nextform.find(".save_button"));
					$("#dialog-import" + sep + data.scope + data.prefix).dialog('open');
				});
	}

	function init_export_form(data)
	{
		var offset = $(data.self).offset();
		var position = [offset.left, utils.get_elm_top(offset.top)];
		var _prefix = '_' + data.level;
		var sep = (data.scope == '' ? '' : '-');
		var scopeq = (data.scope == '' ? '' : '&scope=' + data.scope);
		$("#dialog-export" + sep + data.scope + data.prefix).dialog('option', 'position', position);
		$("#dialog_export_body" + sep + data.scope + data.prefix).load(export_url + "?level=" + data.level + scopeq, null,
				function()
				{
					var nextform = $("#export-form" + sep + data.scope + _prefix);
					nextform.find(".save_button.cancel").click(function()
							{
								utils.cancel_dialog(data.level, "#dialog-export" + sep + data.scope);
							});
					nextform.find("#id_delimiter").change(set_export_delimiter);
					utils.bind_hover(nextform.find(".save_button"));
					init_export_data(data, nextform);
					$("#dialog-export" + sep + data.scope + data.prefix).dialog('open');
				});
	}

	function show_form()
	{
		$("#left_box").load(save_url, null,
				function()
				{
					var form = $("#save-form");
					utils.set_data(form.find("#url_list"), 'urls', []);
					$("#left_box").css('width', '300px');
					$("#id_url").keypress(function(evt)
							{
								url_keypress(evt, form);
							});
					$(".wpcat_form1 .add_button").click(function()
							{
								return add_url(form);
							});
					$(".save_button.save").click(func_save);
					$(".save_button.cancel,.form_title div.close").click(utils.cancel_form);
					$(".img_import").click(show_import);
					$(".img_export").click(show_export);
					$("#dialog-editurl").dialog(popup_dialog_edit_url_opt);
					$("#dialog-import").dialog(popup_dialog_import_opt);
					$("#dialog-export").dialog(popup_dialog_export_opt);
					utils.bind_hover($(".save_button,.form_title div.close,.wpcat_form1 .add_button"));
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
					var form = $("#save-form");
					$("#left_box").css('width', '300px');
					$("#id_url").keypress(function(evt)
							{
								url_keypress(evt, form);
							});
					$(".wpcat_form1 .add_button").click(function()
							{
								return add_url(form);
							});
					$(".save_button.save").click(
							function()
							{
								if (o.clone == null)
									return func_update(arg);

								else
									return func_save();
							});
					$(".save_button.cancel,.form_title div.close").click(utils.cancel_form);
					$(".img_import").click(show_import);
					$(".img_export").click(show_export);
					$("#dialog-editurl").dialog(popup_dialog_edit_url_opt);
					$("#dialog-import").dialog(popup_dialog_import_opt);
					$("#dialog-export").dialog(popup_dialog_export_opt);
					set_items(form);
					utils.bind_hover($(".save_button,.form_title div.close,.wpcat_form1 .add_button"));
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
				text: keyword,
				confirm: ''
		};
		ajax_delete(data, item);
	}

	function func_clone()
	{
		var self = this;
		edit_helper({self: self, clone: 1});
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

	function save_inner_form(o)
	{
		o['url'] = (o.url == null ? save_url : o.url);
		o['func_get_data'] = get_data;
		o['func_show_dialog'] = utils.show_dialog;
		return wpfilter.save(o);
	}

	function update_inner_form(o)
	{
		var i = o.level - 1;
		var sep = (o.scope == '' ? '' : '-');
		var prefix = (o.level < 1 ? '' : '_' + o.level);
		var _prefix = (i < 1 ? '' : '_' + i);
		var currform = $("#save-form" + sep + o.scope + prefix);
		var prevform = $("#save-form" + sep + o.scope + _prefix);
		var savetemp = (o.savetemp == null ? 'update' : o.savetemp);
		var data = get_data(currform, o.id, savetemp);
		data['level'] = o.level;
		var url = (o.url == null ? save_url : o.url);
		$.post(url, data,
				function(result)
				{
					if (result.success == 1)
					{
						o.func_update(result.id, result.name, o.self);
						utils.cancel_dialog(o.level, "#dialog-edit" + sep + o.scope);
					}

					else if (result.error == 1)
					{
						err = utils.get_errors(result.errors);
						utils.show_dialog(1, err);
					}

					else
					{
						utils.show_dialog(2, result);
					}
				});
	}

	function init_export_data(o, form)
	{
		var i = o.level - 1;
		var sep = (o.scope == '' ? '' : '-');
		var _prefix = (i < 1 ? '' : '_' + i);
		var prevform = $("#save-form" + sep + o.scope + _prefix);
		set_export_text(prevform, form);
	}

	function set_export_delimiter()
	{
		var form = utils.get_parent(this, 2);
		var formid = form.attr("id");
		var level = utils.get_form_level(formid);
		var scope = utils.get_form_scope(formid);
		var i = level - 1;
		var sep = (scope == '' ? '' : '-');
		var _prefix = (i < 1 ? '' : '_' + i);
		var prevform = $("#save-form" + sep + scope + _prefix);
		set_export_text(prevform, form);
	}

	function set_export_text(prevform, currform)
	{
		var delimiter = get_delimiter(currform);
		var arr = prevform.find("#url_list").data('urls');
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

	function show_import()
	{
		var o = get_level_data(this);
		var self = this;
		var data = {
				self: self,
				level: o.level,
				prefix: o.prefix,
				scope: ''
		};
		init_import_form(data);
		return false;
	}

	function show_export()
	{
		var o = get_level_data(this);
		var self = this;
		var data = {
				self: self,
				level: o.level,
				prefix: o.prefix,
				scope: ''
		}
		init_export_form(data);
		return false;
	}

	function url_keypress(evt, form)
	{
		if (evt.keyCode == '13')
		{
			evt.preventDefault();
			evt.stopPropagation();
			add_url(form);
		}
	}

	function add_url(form)
	{
		var v = form.find("#id_url").val();
		if (v == '')
			return false;

		var arr = [v];
		add_urls(form, arr);
		form.find("#id_url").val('');
		return false;
	}

	function add_urls(form, buff)
	{
		var l = form.find("#url_list");
		var arr = l.data('urls');
		var n = 0;
		if (buff == null)
			return;

		else if (buff.length > 0)
		{
			n = buff.length;
			for (var i = 0; i < n; i++)
			{
				var v = buff[i];
				if (v == '')
					continue;

				if (!utils.item_exist(v, arr))
				{
					arr.push(v);
					var data = {
							id_prefix: 'url_',
							id: 'item',
							click: 'wpcat.remove_url(this)',
							editclick: 'wpcat.edit_url(this)',
							name: v
					};
					var h = new EJS({url: '/media/tpl/list_item.ejs'}).render(data);
					l.append(h);
				}
			}

			utils.set_data(form.find("#url_list"), 'urls', arr);
			set_alt_css(form, "#url_list");
		}
	}

	function remove_url(o)
	{
		var item = $(o);
		var v = item.next().next().html();
		var form = utils.get_parent(item, 5);
		var arr = form.find("#url_list").data('urls');
		var i = $.inArray(v, arr);
		if (i >= 0)
		{
			arr.splice(i, 1)
			utils.set_data(form.find("#url_list"), 'urls', arr);
		}

		item.parent().remove();
		set_alt_css(form, "#url_list");
		return false;
	}

	function edit_url(obj)
	{
		var item = $(obj);
		var urlvalue = item.next().html();
		var form = utils.get_parent(item, 5);
		var form_id = form.attr("id");
		var scope = utils.get_form_scope(form_id);
		var arr = form.find("#url_list").data('urls');
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
			init_edit_url_form(data);
			return false;
		}

		return false;
	}

	function update_url(o)
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

		var arr = prevform.find("#url_list").data('urls');
		var j = $.inArray(o.urlvalue, arr);
		if (j >= 0)
		{
			arr[j] = urlvalue;
			$(o.self).next().html(urlvalue);
			utils.set_data(prevform.find("#url_list"), 'urls', arr);
			utils.cancel_dialog(o.level, "#dialog-editurl" + sep + o.scope);
		}
	}

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

	function func_import(o)
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
			add_urls(prevform, arr);
			utils.cancel_dialog(o.level, "#dialog-import" + sep + o.scope);
			return;
		}

		j = txt.indexOf(',');
		if (j >= 0)
		{
			arr = txt.split(',');
			add_urls(prevform, arr);
			utils.cancel_dialog(o.level, "#dialog-import" + sep + o.scope);
			return;
		}

		j = txt.indexOf(';');
		if (j >= 0)
		{
			arr = txt.split(';');
			add_urls(prevform, arr);
			utils.cancel_dialog(o.level, "#dialog-import" + sep + o.scope);
			return;
		}

		// only have 1 item
		arr = [txt];
		add_urls(prevform, arr);
		utils.cancel_dialog(o.level, "#dialog-import" + sep + o.scope);
	}

	function get_data(form, arg, savetype)
	{
		var arr = form.find("#url_list").data('urls');
		var data = {
				name: form.find("#id_name").val(),
				type: '2',
				comment: form.find("#id_comment").val(),
				urls: arr.join('||'),
				id: arg,
				save_type: savetype
		}

		return data;
	}

	function get_level_data(self)
	{
		var currform = utils.get_parent(self, 4);
		return get_form_level_data(currform);
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

	function set_items(form)
	{
		var arr = [];
		form.find("#url_list > div").each(
				function()
				{
					var v = $(this).find(".item_edit").next().html();
					if (!utils.item_exist(v, arr))
					{
						arr.push(v);
					}
				});
		utils.set_data(form.find("#url_list"), 'urls', arr);
		set_alt_css(form, "#url_list");
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
		utils.init_alert_dialog("#dialog-message");
		utils.init_confirm_delete("#confirm-delete");
		utils.bind_hover($("#id_add,#id_find"));
		nav_list.config.list_url = list_url;
		nav_list.config.list_func = init_list;
		nav_list.init();
	}

	function load()
	{
		return menu.get('/wpcat/', init);
	}

	return {
		load:load,
		list:list,
		list_temp:list_temp, 
		init:init,
		edit_url:edit_url,
		remove_url:remove_url,
		get_level_data:get_level_data,
		init_form:init_form,
		init_edit_form:init_edit_form,
		init_edit_url_form:init_edit_url_form,
		init_import_form:init_import_form,
		init_export_form:init_export_form,
		save_inner_form:save_inner_form,
		get_ui_opt: get_ui_opt,
		save_temp_url:save_temp_url
	};
}());
var wpcontent = (function()
{
	var save_url = "/wpcontent/save/";
	var delete_url = "/wpcontent/delete/";
	var list_url = "/wpcontent/list/";
	var list = {
			panel: '/wpcontent/list/panel/',
			select: '/wpcontent/list/select/'
	};
	var save_temp_url = "/wpcontent/save/temp/";
	var list_temp = {
			panel: '/wpcontent/list/panel/temp/',
			select: '/wpcontent/list/select/temp/'
	}
	
	var save_content_url = "/wpcontent/content/save/";
	var import_url = "/wpcat/import/";
	var export_url = "/wpcontent/export/";
	var popup_dialog_opt = null;
	var popup_dialog_edit_content_opt = null;
	var popup_dialog_import_opt = null;
	var popup_dialog_export_opt = null;

	function init_ui_opt()
	{
		popup_dialog_opt = {
				autoOpen: false,
				width: 320,
				resizable: false,
				draggable: false,
				modal: false,
				stack: true,
				zIndex: 1001
		};
		popup_dialog_edit_content_opt = {
				autoOpen: false,
				width: 320,
				resizable: false,
				draggable: false,
				modal: false,
				stack: true,
				zIndex: 1002
		};
		popup_dialog_import_opt = {
				autoOpen: false,
				width: 350,
				resizable: false,
				draggable: false,
				modal: false,
				stack: true,
				zIndex: 1002
		};
		popup_dialog_export_opt = {
				autoOpen: false,
				width: 350,
				resizable: false,
				draggable: false,
				modal: false,
				stack: true,
				zIndex: 1002
		};
	}

	function get_ui_opt()
	{
		init_ui_opt();
		return {
			popup_dialog_opt: popup_dialog_opt,
			popup_dialog_edit_content_opt: popup_dialog_edit_content_opt,
			popup_dialog_import_opt: popup_dialog_import_opt,
			popup_dialog_export_opt: popup_dialog_export_opt
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
					var nextform = $("#save-form" + sep + data.scope + _prefix);
					utils.set_data(nextform.find("#content_list"), 'keywords', []);
					utils.set_data(nextform.find("#content_list"), 'scores', []);
					nextform.find("#id_keyword,#id_score").keypress(function(evt)
							{
								content_keypress(evt, nextform);
							});
					nextform.find(".wpcontent_form1 .add_button").click(function()
							{
								return add_content(nextform);
							});
					nextform.find(".save_button.save").click(data.func_save);
					nextform.find(".save_button.cancel").click(function()
							{
								utils.cancel_dialog(data.level, "#dialog-add" + sep + data.scope);
							});
					nextform.find(".img_import").click(data.func_show_import);
					nextform.find(".img_export").click(data.func_show_export);
					$("#dialog-editext" + sep + data.scope + _prefix).dialog(get_ui_opt().popup_dialog_edit_content_opt);
					$("#dialog-import" + sep + data.scope + _prefix).dialog(get_ui_opt().popup_dialog_import_opt);
					$("#dialog-export" + sep + data.scope + _prefix).dialog(get_ui_opt().popup_dialog_export_opt);
					utils.bind_hover(nextform.find(".save_button,.wpcontent_form1 .add_button"));
					$("#dialog-add" + sep + data.scope + data.prefix).dialog('open');
				});
	}

	function init_edit_form(data)
	{
		var offset = $(data.self).offset();
		var position = [offset.left, utils.get_elm_top(offset.top)];
		var _prefix = '_' + data.level;
		var sep = (data.scope == '' ? '' : '-');
		var scopeq = (data.scope == '' ? '' : '&scope=' + data.scope);
		var wizq = (data.url == null ? '' : '&wiz=1');
		utils.remove_dialog("#dialog-edit" + sep + data.scope + _prefix);
		$("#dialog_body" + sep + data.scope + data.prefix).empty();
		$("#dialog-add" + sep + data.scope + data.prefix).dialog('close');
		var url = (data.url == null ? save_url : data.url);
		$("#dialog-edit" + sep + data.scope + data.prefix).dialog('option', 'position', position);
		$("#dialog_edit_body" + sep + data.scope + data.prefix).load(url + "?id=" + data.id + "&level=" + data.level + scopeq + wizq, null,
				function()
				{
					var nextform = $("#save-form" + sep + data.scope + _prefix);
					nextform.find("#id_keyword,#id_score").keypress(function(evt)
							{
								content_keypress(evt, nextform);
							});
					nextform.find(".wpcontent_form1 .add_button").click(function()
							{
								return add_content(nextform);
							});
					nextform.find(".save_button.save").click(function()
							{
								return update_inner_form(data);
							});
					nextform.find(".save_button.cancel").click(function()
							{
								utils.cancel_dialog(data.level, "#dialog-edit" + sep + data.scope);
							});
					nextform.find(".img_import").click(data.func_show_import);
					nextform.find(".img_export").click(data.func_show_export);
					$("#dialog-editcontent" + sep + data.scope + _prefix).dialog(get_ui_opt().popup_dialog_edit_content_opt);
					$("#dialog-import" + sep + data.scope + _prefix).dialog(get_ui_opt().popup_dialog_import_opt);
					$("#dialog-export" + sep + data.scope + _prefix).dialog(get_ui_opt().popup_dialog_export_opt);
					set_items(nextform);
					utils.bind_hover(nextform.find(".save_button,.wpcontent_form1 .add_button"));
					$("#dialog-edit" + sep + data.scope + data.prefix).dialog('open');
				});
	}

	function init_edit_content_form(data)
	{
		var offset = $(data.self).offset();
		var position = [offset.left, utils.get_elm_top(offset.top)];
		var _prefix = '_' + data.level;
		var sep = (data.scope == '' ? '' : '-');
		var scopeq = (data.scope == '' ? '' : '&scope=' + data.scope);
		utils.remove_dialog("#dialog-editcontent" + sep + data.scope + _prefix);
		var url = (data.url == null ? save_content_url : data.url);
		$("#dialog-editcontent" + sep + data.scope + data.prefix).dialog('option', 'position', position);
		$("#dialog_editcontent_body" + sep + data.scope + data.prefix).load(url + "?level=" + data.level + scopeq, null,
				function()
				{
					var nextform = $("#save-contentform" + sep + data.scope + _prefix);
					nextform.find("#id_keyword").val(data.keywordvalue);
					nextform.find("#id_score").val(data.scorevalue);
					nextform.find(".save_button.save").click(function()
							{
								return update_content(data);
							});
					nextform.find(".save_button.cancel").click(function()
							{
								utils.cancel_dialog(data.level, "#dialog-editcontent" + sep + data.scope);
							});
					utils.bind_hover(nextform.find(".save_button"));
					$("#dialog-editcontent" + sep + data.scope + data.prefix).dialog('open');
				});
	}

	function init_import_form(data)
	{
		var offset = $(data.self).offset();
		var position = [offset.left, utils.get_elm_top(offset.top)];
		var _prefix = '_' + data.level;
		var sep = (data.scope == '' ? '' : '-');
		var scopeq = (data.scope == '' ? '' : '&scope=' + data.scope);
		$("#dialog-import" + sep + data.scope + data.prefix).dialog('option', 'position', position);
		$("#dialog_import_body" + sep + data.scope + data.prefix).load(import_url + "?level=" + data.level + scopeq, null,
				function()
				{
					var nextform = $("#import-form" + sep + data.scope + _prefix);
					nextform.find(".save_button.import").click(function()
							{
								return func_import(data);
							});
					nextform.find(".save_button.cancel").click(function()
							{
								utils.cancel_dialog(data.level, "#dialog-import" + sep + data.scope);
							});
					utils.bind_hover(nextform.find(".save_button"));
					$("#dialog-import" + sep + data.scope + data.prefix).dialog('open');
				});
	}

	function init_export_form(data)
	{
		var offset = $(data.self).offset();
		var position = [offset.left, utils.get_elm_top(offset.top)];
		var _prefix = '_' + data.level;
		var sep = (data.scope == '' ? '' : '-');
		var scopeq = (data.scope == '' ? '' : '&scope=' + data.scope);
		$("#dialog-export" + sep + data.scope + data.prefix).dialog('option', 'position', position);
		$("#dialog_export_body" + sep + data.scope + data.prefix).load(export_url + "?level=" + data.level + scopeq, null,
				function()
				{
					var nextform = $("#export-form" + sep + data.scope + _prefix);
					nextform.find(".save_button.cancel").click(function()
							{
								utils.cancel_dialog(data.level, "#dialog-export" + sep + data.scope);
							});
					utils.bind_hover(nextform.find(".save_button"));
					init_export_data(data, nextform);
					$("#dialog-export" + sep + data.scope + data.prefix).dialog('open');
				});
	}

	function show_form()
	{
		$("#left_box").load(save_url, null,
				function()
				{
					var form = $("#save-form");
					utils.set_data($("#save-form").find("#content_list"), 'keywords', []);
					utils.set_data($("#save-form").find("#content_list"), 'scores', []);
					$("#left_box").css('width', '300px');
					$("#id_keyword,#id_score").keypress(function(evt)
							{
								content_keypress(evt, form);
							});
					$(".wpcontent_form1 .add_button").click(function()
							{
								return add_content(form);
							});
					$(".save_button.save").click(func_save);
					$(".save_button.cancel,.form_title div.close").click(utils.cancel_form);
					$(".img_import").click(show_import);
					$(".img_export").click(show_export);
					$("#dialog-editcontent").dialog(popup_dialog_edit_content_opt);
					$("#dialog-import").dialog(popup_dialog_import_opt);
					$("#dialog-export").dialog(popup_dialog_export_opt);
					utils.bind_hover($(".save_button,.form_title div.close,.wpcontent_form1 .add_button"));
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
					var form = $("#save-form");
					$("#left_box").css('width', '300px');
					$("#id_keyword,#id_score").keypress(function(evt)
							{
								content_keypress(evt, form);
							});
					$(".wpcontent_form1 .add_button").click(function()
							{
								return add_content(form);
							});
					$(".save_button.save").click(
							function()
							{
								if (o.clone == null)
									return func_update(arg);

								else
									return func_save();
							});
					$(".save_button.cancel,.form_title div.close").click(utils.cancel_form);
					$(".img_import").click(show_import);
					$(".img_export").click(show_export);
					$("#dialog-editcontent").dialog(popup_dialog_edit_content_opt);
					$("#dialog-import").dialog(popup_dialog_import_opt);
					$("#dialog-export").dialog(popup_dialog_export_opt);
					set_items(form);
					utils.bind_hover($(".save_button,.form_title div.close,.wpcontent_form1 .add_button"));
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
				text: keyword,
				confirm: ''
		};
		ajax_delete(data, item);
	}

	function func_clone()
	{
		var self = this;
		edit_helper({self: self, clone: 1});
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

	function save_inner_form(o)
	{
		o['url'] = (o.url == null ? save_url : o.url);
		o['func_get_data'] = get_data;
		o['func_show_dialog'] = utils.show_dialog;
		return wpfilter.save(o);
	}

	function update_inner_form(o)
	{
		var i = o.level - 1;
		var sep = (o.scope == '' ? '' : '-');
		var prefix = (o.level < 1 ? '' : '_' + o.level);
		var _prefix = (i < 1 ? '' : '_' + i);
		var currform = $("#save-form" + sep + o.scope + prefix);
		var prevform = $("#save-form" + sep + o.scope + _prefix);
		var savetemp = (o.savetemp == null ? 'update' : o.savetemp);
		var data = get_data(currform, o.id, savetemp);
		data['level'] = o.level;
		var url = (o.url == null ? save_url : o.url);
		$.post(url, data,
				function(result)
				{
					if (result.success == 1)
					{
						o.func_update(result.id, result.name, o.self);
						utils.cancel_dialog(o.level, "#dialog-edit" + sep + o.scope);
					}

					else if (result.error == 1)
					{
						err = utils.get_errors(result.errors);
						utils.show_dialog(1, err);
					}

					else
					{
						utils.show_dialog(2, result);
					}
				});
	}

	function init_export_data(o, form)
	{
		var i = o.level - 1;
		var sep = (o.scope == '' ? '' : '-');
		var _prefix = (i < 1 ? '' : '_' + i);
		var prevform = $("#save-form" + sep + o.scope + _prefix);
		set_export_text(prevform, form);
	}

	function set_export_text(prevform, currform)
	{
		var delimiter = '\n';
		var arr1 = prevform.find("#content_list").data('keywords');
		var arr2 = prevform.find("#content_list").data('scores');
		if (arr1 != null && arr2 != null)
		{
			var exporttxt = '';
			var n = arr1.length;
			for (var i = 0; i < n; i++)
			{
				if ($.trim(arr1[i]) == '')
					continue;

				if (i < n - 1)
					exporttxt += arr1[i] + ',' + arr2[i] + delimiter;

				else
					exporttxt += arr1[i] + ',' + arr2[i];
			}

			currform.find("#id_exporttext").val(exporttxt);
		}
	}

	function show_import()
	{
		var o = get_level_data(this);
		var self = this;
		var data = {
				self: self,
				level: o.level,
				prefix: o.prefix,
				scope: ''
		};
		init_import_form(data);
		return false;
	}

	function show_export()
	{
		var o = get_level_data(this);
		var self = this;
		var data = {
				self: self,
				level: o.level,
				prefix: o.prefix,
				scope: ''
		}
		init_export_form(data);
		return false;
	}

	function content_keypress(evt, form)
	{
		if (evt.keyCode == '13')
		{
			evt.preventDefault();
			evt.stopPropagation();
			add_content(form);
		}
	}

	function add_content(form)
	{
		var k = form.find("#id_keyword").val();
		var s = form.find("#id_score").val();
		if (k == '' || s == '')
			return false;

		if (!$.isNumeric(s - 0))
		{
			form.find("#id_score").val('');
			return false;
		}

		var arr1 = [k];
		var arr2 = [s];
		add_contents(form, arr1, arr2);
		form.find("#id_keyword,#id_score").val('');
		return false;
	}

	function add_contents(form, buff1, buff2)
	{
		var arr1 = form.find("#content_list").data('keywords');
		var arr2 = form.find("#content_list").data('scores');
		var n = 0;
		var l = null;
		if (buff1 == null || buff2 == null)
			return;

		else if (buff1.length > 0)
		{
			n = buff1.length;
			l = form.find("#content_list > table tbody");
			for (var i = 0; i < n; i++)
			{
				var k = buff1[i];
				var s = buff2[i];
				if (k == '' || s == '')
					continue;

				if (!$.isNumeric(s - 0))
					continue;

				if (!utils.item_exist(k, arr1))
				{
					arr1.push(k);
					arr2.push(s);
					var data = {
							click: 'wpcontent.remove_content(this)',
							editclick: 'wpcontent.edit_content(this)',
							keyword: k,
							score: s
					};
					var h = new EJS({url: '/media/tpl/contentfilter_item.ejs'}).render(data);
					l.append(h);
				}
			}

			utils.set_data(form.find("#content_list"), 'keywords', arr1);
			utils.set_data(form.find("#content_list"), 'scores', arr2);
			set_alt_css(form, "#content_list");
		}
	}

	function remove_content(o)
	{
		var item = $(o);
		var p = item.parent();
		var k = p.next().next().html();
		var s = p.next().next().next().html();
		var form = utils.get_parent(item, 7);
		var arr1 = form.find("#content_list").data('keywords');
		var arr2 = form.find("#content_list").data('scores');
		var i = $.inArray(k, arr1);
		if (i >= 0)
		{
			arr1.splice(i, 1);
			arr2.splice(i, 1);
			utils.set_data(form.find("#content_list"), 'keywords', arr1);
			utils.set_data(form.find("#content_list"), 'scores', arr2);
		}

		p.parent().remove();
		set_alt_css(form, "#content_list");
		return false;
	}

	function edit_content(obj)
	{
		var item = $(obj);
		var p = item.parent();
		var k = p.next().html();
		var s = p.next().next().html();
		var form = utils.get_parent(item, 8);
		var form_id = form.attr("id");
		var scope = utils.get_form_scope(form_id);
		var arr1 = form.find("#content_list").data('keywords');
		var arr2 = form.find("#content_list").data('scores');
		var i = $.inArray(k, arr1);
		if (i >= 0)
		{
			var o = get_form_level_data(form);
			var self = item;
			var data = {
					self: self,
					keywordvalue: k,
					scorevalue: s,
					level: o.level,
					prefix: o.prefix,
					scope: scope
			};
			init_edit_content_form(data);
			return false;
		}

		return false;
	}

	function update_content(o)
	{
		var i = o.level - 1;
		var sep = (o.scope == '' ? '' : '-');
		var prefix = (o.level < 1 ? '' : '_' + o.level);
		var _prefix = (i < 1 ? '' : '_' + i);
		var currform = $("#save-contentform" + sep + o.scope + prefix);
		var prevform = $("#save-form" + sep + o.scope + _prefix);
		var keywordvalue = currform.find("#id_keyword").val();
		var scorevalue = currform.find("#id_score").val();
		if ($.trim(keywordvalue) == '' || $.trim(scorevalue) == '')
			return;

		if (!$.isNumeric(scorevalue - 0))
			return;

		var arr1 = prevform.find("#content_list").data('keywords');
		var arr2 = prevform.find("#content_list").data('scores');
		var j = $.inArray(o.keywordvalue, arr1);
		if (j >= 0)
		{
			arr1[j] = keywordvalue;
			arr2[j] = scorevalue;
			$(o.self).parent().next().html(keywordvalue);
			$(o.self).parent().next().next().html(scorevalue);
			utils.set_data(prevform.find("#content_list"), 'keywords', arr1);
			utils.set_data(prevform.find("#content_list"), 'scores', arr2);
			utils.cancel_dialog(o.level, "#dialog-editcontent" + sep + o.scope);
		}
	}

	function func_import(o)
	{
		var i = o.level - 1;
		var sep = (o.scope == '' ? '' : '-');
		var prefix = (o.level < 1 ? '' : '_' + o.level);
		var _prefix = (i < 1 ? '' : '_' + i);
		var currform = $("#import-form" + sep + o.scope + prefix);
		var prevform = $("#save-form" + sep + o.scope + _prefix);
		var txt = currform.find("#id_importtext").val();
		var arr = null;
		var buf = null;
		if ($.trim(txt) == '')
			return;

		var j = txt.indexOf('\n');
		if (j >= 0)
		{
			arr = txt.split('\n');
			buf = get_contents(arr);
			add_contents(prevform, buf.keywords, buf.scores);
			utils.cancel_dialog(o.level, "#dialog-import" + sep + o.scope);
			return;
		}

		// only have 1 item
		arr = [txt];
		buf = get_contents(arr);
		add_contents(prevform, buf.keywords, buf.scores);
		utils.cancel_dialog(o.level, "#dialog-import" + sep + o.scope);
	}

	function get_contents(arr)
	{
		var n = arr.length;
		var buff1 = [];
		var buff2 = [];
		for (var i = 0; i < n; i++)
		{
			var o = arr[i].split(',');
			if (o == null)
				continue;

			if (o.length != 2)
				continue;

			if ($.trim(o[0]) == '' || $.trim(o[1]) == '')
				continue;

			if (!$.isNumeric(o[1]))
				continue;

			buff1.push(o[0]);
			buff2.push(o[1]);
		}

		return {
			keywords: buff1,
			scores: buff2
		};
	}

	function get_data(form, arg, savetype)
	{
		var arr1 = form.find("#content_list").data('keywords');
		var arr2 = form.find("#content_list").data('scores');
		var data = {
				name: form.find("#id_name").val(),
				comment: form.find("#id_comment").val(),
				keywords: arr1.join('||'),
				scores: arr2.join('||'),
				id: arg,
				save_type: savetype
		}

		return data;
	}

	function get_level_data(self)
	{
		var currform = utils.get_parent(self, 4);
		return get_form_level_data(currform);
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

	function set_items(form)
	{
		var arr1 = [];
		var arr2 = [];
		form.find("#content_list table tbody tr").each(
				function()
				{
					var p = $(this).children().next();
					var k = p.next().html();
					var s = p.next().next().html();
					if (!utils.item_exist(k, arr1))
					{
						arr1.push(k);
						arr2.push(s);
					}
				});
		utils.set_data(form.find("#content_list"), 'keywords', arr1);
		utils.set_data(form.find("#content_list"), 'scores', arr2);
		set_alt_css(form, "#content_list");
	}

	function set_alt_css(form, div)
	{
		form.find(div + " > table tbody tr").removeClass("ui-state-default");
		form.find(div + " > table tbody tr").removeClass("ui-state-hover");
		form.find(div + " > table tbody tr:odd").addClass("ui-state-default");
		form.find(div + " > table tbody tr:even").addClass("ui-state-hover");
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
		utils.init_alert_dialog("#dialog-message");
		utils.init_confirm_delete("#confirm-delete");
		utils.bind_hover($("#id_add,#id_find"));
		nav_list.config.list_url = list_url;
		nav_list.config.list_func = init_list;
		nav_list.init();
	}

	function load()
	{
		return menu.get('/wpcontent/', init);
	}

	return {
		load:load,
		list:list,
		list_temp:list_temp,
		init:init,
		edit_content:edit_content,
		remove_content:remove_content,
		get_level_data:get_level_data,
		init_form:init_form,
		init_edit_form:init_edit_form,
		init_edit_content_form:init_edit_content_form,
		init_import_form:init_import_form,
		init_export_form:init_export_form,
		save_inner_form:save_inner_form,
		get_ui_opt: get_ui_opt,
		save_temp_url:save_temp_url
	};
}());
var wpext = (function()
{
	var save_url = "/wpext/save/";
	var delete_url = "/wpext/delete/";
	var list_url = "/wpext/list/";
	var list = {
			panel: '/wpext/list/panel/',
			select: '/wpext/list/select/'
	};
	var save_temp_url = "/wpext/save/temp/";
	var list_temp = {
			panel: '/wpext/list/panel/temp/',
			select: '/wpext/list/select/temp/'
	}
	
	var save_ext_url = "/wpext/ext/save/";
	var import_url = "/wpcat/import/";
	var export_url = "/wpcat/export/";
	var popup_dialog_opt = null;
	var popup_dialog_edit_ext_opt = null;
	var popup_dialog_import_opt = null;
	var popup_dialog_export_opt = null;

	function init_ui_opt()
	{
		popup_dialog_opt = {
				autoOpen: false,
				width: 320,
				resizable: false,
				draggable: false,
				modal: false,
				stack: true,
				zIndex: 1001
		};
		popup_dialog_edit_ext_opt = {
				autoOpen: false,
				width: 320,
				resizable: false,
				draggable: false,
				modal: false,
				stack: true,
				zIndex: 1002
		};
		popup_dialog_import_opt = {
				autoOpen: false,
				width: 350,
				resizable: false,
				draggable: false,
				modal: false,
				stack: true,
				zIndex: 1002
		};
		popup_dialog_export_opt = {
				autoOpen: false,
				width: 350,
				resizable: false,
				draggable: false,
				modal: false,
				stack: true,
				zIndex: 1002
		};
	}

	function get_ui_opt()
	{
		init_ui_opt();
		return {
			popup_dialog_opt: popup_dialog_opt,
			popup_dialog_edit_ext_opt: popup_dialog_edit_ext_opt,
			popup_dialog_import_opt: popup_dialog_import_opt,
			popup_dialog_export_opt: popup_dialog_export_opt
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
					var nextform = $("#save-form" + sep + data.scope + _prefix);
					utils.set_data(nextform.find("#ext_list"), 'extensions', []);
					nextform.find("#id_ext").keypress(function(evt)
							{
								ext_keypress(evt, nextform);
							});
					nextform.find(".wpext_form1 .add_button").click(function()
							{
								return add_extension(nextform);
							});
					nextform.find(".save_button.save").click(data.func_save);
					nextform.find(".save_button.cancel").click(function()
							{
								utils.cancel_dialog(data.level, "#dialog-add" + sep + data.scope);
							});
					nextform.find(".img_import").click(data.func_show_import);
					nextform.find(".img_export").click(data.func_show_export);
					$("#dialog-editext" + sep + data.scope + _prefix).dialog(get_ui_opt().popup_dialog_edit_ext_opt);
					$("#dialog-import" + sep + data.scope + _prefix).dialog(get_ui_opt().popup_dialog_import_opt);
					$("#dialog-export" + sep + data.scope + _prefix).dialog(get_ui_opt().popup_dialog_export_opt);
					utils.bind_hover(nextform.find(".save_button,.wpext_form1 .add_button"));
					$("#dialog-add" + sep + data.scope + data.prefix).dialog('open');
				});
	}

	function init_edit_form(data)
	{
		var offset = $(data.self).offset();
		var position = [offset.left, utils.get_elm_top(offset.top)];
		var _prefix = '_' + data.level;
		var sep = (data.scope == '' ? '' : '-');
		var scopeq = (data.scope == '' ? '' : '&scope=' + data.scope);
		var wizq = (data.url == null ? '' : '&wiz=1');
		utils.remove_dialog("#dialog-edit" + data.edit + sep + data.scope + _prefix);
		$("#dialog_body" + sep + data.scope + data.prefix).empty();
		$("#dialog-add" + sep + data.scope + data.prefix).dialog('close');
		var url = (data.url == null ? save_url : data.url);
		$("#dialog-edit" + sep + data.scope + data.prefix).dialog('option', 'position', position);
		$("#dialog_edit_body" + sep + data.scope + data.prefix).load(url + "?id=" + data.id + "&level=" + data.level + scopeq + wizq, null,
				function()
				{
					var nextform = $("#save-form" + sep + data.scope + _prefix);
					nextform.find("#id_ext").keypress(function(evt)
							{
								ext_keypress(evt, nextform);
							});
					nextform.find(".wpext_form1 .add_button").click(function()
							{
								return add_extension(nextform);
							});
					nextform.find(".save_button.save").click(function()
							{
								return update_inner_form(data);
							});
					nextform.find(".save_button.cancel").click(function()
							{
								utils.cancel_dialog(data.level, "#dialog-edit" + sep + data.scope);
							});
					nextform.find(".img_import").click(data.func_show_import);
					nextform.find(".img_export").click(data.func_show_export);
					$("#dialog-editext" + sep + data.scope + _prefix).dialog(get_ui_opt().popup_dialog_edit_ext_opt);
					$("#dialog-import" + sep + data.scope + _prefix).dialog(get_ui_opt().popup_dialog_import_opt);
					$("#dialog-export" + sep + data.scope + _prefix).dialog(get_ui_opt().popup_dialog_export_opt);
					set_items(nextform);
					utils.bind_hover(nextform.find(".save_button,.wpext_form1 .add_button"));
					$("#dialog-edit" + sep + data.scope + data.prefix).dialog('open');
				});
	}

	function init_edit_ext_form(data)
	{
		var offset = $(data.self).offset();
		var position = [offset.left, utils.get_elm_top(offset.top)];
		var _prefix = '_' + data.level;
		var sep = (data.scope == '' ? '' : '-');
		var scopeq = (data.scope == '' ? '' : '&scope=' + data.scope);
		utils.remove_dialog("#dialog-editext" + sep + data.scope + _prefix);
		var url = (data.url == null ? save_ext_url : data.url);
		$("#dialog-editext" + sep + data.scope + data.prefix).dialog('option', 'position', position);
		$("#dialog_editext_body" + sep + data.scope + data.prefix).load(url + "?level=" + data.level + scopeq, null,
				function()
				{
					var nextform = $("#save-extform" + sep + data.scope + _prefix);
					nextform.find("#id_ext").val(data.extvalue);
					nextform.find(".save_button.save").click(function()
							{
								return update_extension(data);
							});
					nextform.find(".save_button.cancel").click(function()
							{
								utils.cancel_dialog(data.level, "#dialog-editext" + sep + data.scope);
							});
					utils.bind_hover(nextform.find(".save_button"));
					$("#dialog-editext" + sep + data.scope + data.prefix).dialog('open');
				});
	}

	function init_import_form(data)
	{
		var offset = $(data.self).offset();
		var position = [offset.left, utils.get_elm_top(offset.top)];
		var _prefix = '_' + data.level;
		var sep = (data.scope == '' ? '' : '-');
		var scopeq = (data.scope == '' ? '' : '&scope=' + data.scope);
		$("#dialog-import" + sep + data.scope + data.prefix).dialog('option', 'position', position);
		$("#dialog_import_body" + sep + data.scope + data.prefix).load(import_url + "?level=" + data.level + scopeq, null,
				function()
				{
					var nextform = $("#import-form" + sep + data.scope + _prefix);
					nextform.find(".save_button.import").click(function()
							{
								return func_import(data);
							});
					nextform.find(".save_button.cancel").click(function()
							{
								utils.cancel_dialog(data.level, "#dialog-import" + sep + data.scope);
							});
					utils.bind_hover(nextform.find(".save_button"));
					$("#dialog-import" + sep + data.scope + data.prefix).dialog('open');
				});
	}

	function init_export_form(data)
	{
		var offset = $(data.self).offset();
		var position = [offset.left, utils.get_elm_top(offset.top)];
		var _prefix = '_' + data.level;
		var sep = (data.scope == '' ? '' : '-');
		var scopeq = (data.scope == '' ? '' : '&scope=' + data.scope);
		$("#dialog-export" + sep + data.scope + data.prefix).dialog('option', 'position', position);
		$("#dialog_export_body" + sep + data.scope + data.prefix).load(export_url + "?level=" + data.level + scopeq, null,
				function()
				{
					var nextform = $("#export-form" + sep + data.scope + _prefix);
					nextform.find(".save_button.cancel").click(function()
							{
								utils.cancel_dialog(data.level, "#dialog-export" + sep + data.scope);
							});
					nextform.find("#id_delimiter").change(set_export_delimiter);
					utils.bind_hover(nextform.find(".save_button"));
					init_export_data(data, nextform);
					$("#dialog-export" + sep + data.scope + data.prefix).dialog('open');
				});
	}

	function show_form()
	{
		$("#left_box").load(save_url, null,
				function()
				{
					var form = $("#save-form");
					utils.set_data(form.find("#ext_list"), 'extensions', []);
					$("#left_box").css('width', '300px');
					$("#id_ext").keypress(function(evt)
							{
								ext_keypress(evt, form);
							});
					$(".wpext_form1 .add_button").click(function()
							{
								return add_extension(form);
							});
					$(".save_button.save").click(func_save);
					$(".save_button.cancel,.form_title div.close").click(utils.cancel_form);
					$(".img_import").click(show_import);
					$(".img_export").click(show_export);
					$("#dialog-editext").dialog(popup_dialog_edit_ext_opt);
					$("#dialog-import").dialog(popup_dialog_import_opt);
					$("#dialog-export").dialog(popup_dialog_export_opt);
					utils.bind_hover($(".save_button,.form_title div.close,.wpext_form1 .add_button"));
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
					var form = $("#save-form");
					$("#left_box").css('width', '300px');
					$("#id_ext").keypress(function(evt)
							{
								ext_keypress(evt, form);
							});
					$(".wpext_form1 .add_button").click(function()
							{
								return add_extension(form);
							});
					$(".save_button.save").click(
							function()
							{
								if (o.clone == null)
									return func_update(arg);

								else
									return func_save();
							});
					$(".save_button.cancel,.form_title div.close").click(utils.cancel_form);
					$(".img_import").click(show_import);
					$(".img_export").click(show_export);
					$("#dialog-editext").dialog(popup_dialog_edit_ext_opt);
					$("#dialog-import").dialog(popup_dialog_import_opt);
					$("#dialog-export").dialog(popup_dialog_export_opt);
					set_items(form);
					utils.bind_hover($(".save_button,.form_title div.close,.wpext_form1 .add_button"));
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
				text: keyword,
				confirm: ''
		};
		ajax_delete(data, item);
	}

	function func_clone()
	{
		var self = this;
		edit_helper({self: self, clone: 1});
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

	function save_inner_form(o)
	{
		o['url'] = (o.url == null ? save_url : o.url);
		o['func_get_data'] = get_data;
		o['func_show_dialog'] = utils.show_dialog;
		return wpfilter.save(o);
	}

	function update_inner_form(o)
	{
		var i = o.level - 1;
		var sep = (o.scope == '' ? '' : '-');
		var prefix = (o.level < 1 ? '' : '_' + o.level);
		var _prefix = (i < 1 ? '' : '_' + i);
		var currform = $("#save-form" + sep + o.scope + prefix);
		var prevform = $("#save-form" + sep + o.scope + _prefix);
		var savetemp = (o.savetemp == null ? 'update' : o.savetemp);
		var data = get_data(currform, o.id, savetemp);
		data['level'] = o.level;
		var url = (o.url == null ? save_url : o.url);
		$.post(url, data,
				function(result)
				{
					if (result.success == 1)
					{
						o.func_update(result.id, result.name, o.self);
						utils.cancel_dialog(o.level, "#dialog-edit" + sep + o.scope);
					}

					else if (result.error == 1)
					{
						err = utils.get_errors(result.errors);
						utils.show_dialog(1, err);
					}

					else
					{
						utils.show_dialog(2, result);
					}
				});
	}

	function init_export_data(o, form)
	{
		var i = o.level - 1;
		var sep = (o.scope == '' ? '' : '-');
		var _prefix = (i < 1 ? '' : '_' + i);
		var prevform = $("#save-form" + sep + o.scope + _prefix);
		set_export_text(prevform, form);
	}

	function set_export_delimiter()
	{
		var form = utils.get_parent(this, 2);
		var formid = form.attr("id");
		var level = utils.get_form_level(formid);
		var scope = utils.get_form_scope(formid);
		var i = level - 1;
		var sep = (scope == '' ? '' : '-');
		var _prefix = (i < 1 ? '' : '_' + i);
		var prevform = $("#save-form" + sep + scope + _prefix);
		set_export_text(prevform, form);
	}

	function set_export_text(prevform, currform)
	{
		var delimiter = get_delimiter(currform);
		var arr = prevform.find("#ext_list").data('extensions');
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

	function show_import()
	{
		var o = get_level_data(this);
		var self = this;
		var data = {
				self: self,
				level: o.level,
				prefix: o.prefix,
				scope: ''
		};
		init_import_form(data);
		return false;
	}

	function show_export()
	{
		var o = get_level_data(this);
		var self = this;
		var data = {
				self: self,
				level: o.level,
				prefix: o.prefix,
				scope: ''
		}
		init_export_form(data);
		return false;
	}

	function ext_keypress(evt, form)
	{
		if (evt.keyCode == '13')
		{
			evt.preventDefault();
			evt.stopPropagation();
			add_extension(form);
		}
	}

	function add_extension(form)
	{
		var v = form.find("#id_ext").val();
		if (v == '')
			return false;

		var arr = [v];
		add_extensions(form, arr);
		form.find("#id_ext").val('');
		return false;
	}

	function add_extensions(form, buff)
	{
		var l = form.find("#ext_list");
		var arr = l.data('extensions');
		var n = 0;
		if (buff == null)
			return;

		else if (buff.length > 0)
		{
			n = buff.length;
			for (var i = 0; i < n; i++)
			{
				var v = buff[i];
				if (v == '')
					continue;

				if (!utils.item_exist(v, arr))
				{
					arr.push(v);
					var data = {
							id_prefix: 'ext_',
							id: 'item',
							click: 'wpext.remove_ext(this)',
							editclick: 'wpext.edit_ext(this)',
							name: v
					};
					var h = new EJS({url: '/media/tpl/list_item.ejs'}).render(data);
					l.append(h);
				}
			}

			utils.set_data(form.find("#ext_list"), 'extensions', arr);
			set_alt_css(form, "#ext_list");
		}
	}

	function remove_ext(o)
	{
		var item = $(o);
		var v = item.next().next().html();
		var form = utils.get_parent(item, 4);
		var arr = form.find("#ext_list").data('extensions');
		var i = $.inArray(v, arr);
		if (i >= 0)
		{
			arr.splice(i, 1)
			utils.set_data(form.find("#ext_list"), 'extensions', arr);
		}

		item.parent().remove();
		set_alt_css(form, "#ext_list");
		return false;
	}

	function edit_ext(obj)
	{
		var item = $(obj);
		var extvalue = item.next().html();
		var form = utils.get_parent(item, 5);
		var form_id = form.attr("id");
		var scope = utils.get_form_scope(form_id);
		var arr = form.find("#ext_list").data('extensions');
		var i = $.inArray(extvalue, arr);
		if (i >= 0)
		{
			var o = get_form_level_data(form);
			var self = item;
			var data = {
					self: self,
					extvalue: extvalue,
					level: o.level,
					prefix: o.prefix,
					scope: scope
			};
			init_edit_ext_form(data);
			return false;
		}

		return false;
	}

	function update_extension(o)
	{
		var i = o.level - 1;
		var sep = (o.scope == '' ? '' : '-');
		var prefix = (o.level < 1 ? '' : '_' + o.level);
		var _prefix = (i < 1 ? '' : '_' + i);
		var currform = $("#save-extform" + sep + o.scope + prefix);
		var prevform = $("#save-form" + sep + o.scope + _prefix);
		var extvalue = currform.find("#id_ext").val();
		if ($.trim(extvalue) == '')
			return;

		var arr = prevform.find("#ext_list").data('extensions');
		var j = $.inArray(o.extvalue, arr);
		if (j >= 0)
		{
			arr[j] = extvalue;
			$(o.self).next().html(extvalue);
			utils.set_data(prevform.find("#ext_list"), 'extensions', arr);
			utils.cancel_dialog(o.level, "#dialog-editext" + sep + o.scope);
		}
	}

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

	function func_import(o)
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
			add_extensions(prevform, arr);
			utils.cancel_dialog(o.level, "#dialog-import" + sep + o.scope);
			return;
		}

		j = txt.indexOf(',');
		if (j >= 0)
		{
			arr = txt.split(',');
			add_extensions(prevform, arr);
			utils.cancel_dialog(o.level, "#dialog-import" + sep + o.scope);
			return;
		}

		j = txt.indexOf(';');
		if (j >= 0)
		{
			arr = txt.split(';');
			add_extensions(prevform, arr);
			utils.cancel_dialog(o.level, "#dialog-import" + sep + o.scope);
			return;
		}

		// only have 1 item
		arr = [txt];
		add_extensions(prevform, arr);
		utils.cancel_dialog(o.level, "#dialog-import" + sep + o.scope);
	}

	function get_data(form, arg, savetype)
	{
		var arr = form.find("#ext_list").data('extensions');
		var data = {
				name: form.find("#id_name").val(),
				comment: form.find("#id_comment").val(),
				extensions: arr.join('||'),
				id: arg,
				save_type: savetype
		}

		return data;
	}

	function get_level_data(self)
	{
		var currform = utils.get_parent(self, 4);
		return get_form_level_data(currform);
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

	function set_items(form)
	{
		var arr = [];
		form.find("#ext_list > div").each(
				function()
				{
					var v = $(this).find(".item_edit").next().html();
					if (!utils.item_exist(v, arr))
					{
						arr.push(v);
					}
				});
		utils.set_data(form.find("#ext_list"), 'extensions', arr);
		set_alt_css(form, "#ext_list");
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
		utils.init_alert_dialog("#dialog-message");
		utils.init_confirm_delete("#confirm-delete");
		utils.bind_hover($("#id_add,#id_find"));
		nav_list.config.list_url = list_url;
		nav_list.config.list_func = init_list;
		nav_list.init();
	}

	function load()
	{
		return menu.get('/wpext/', init);
	}

	return {
		load:load,
		list:list,
		list_temp : list_temp,
		init:init,
		edit_ext:edit_ext,
		remove_ext:remove_ext,
		get_level_data:get_level_data,
		init_form:init_form,
		init_edit_form:init_edit_form,
		init_edit_ext_form:init_edit_ext_form,
		init_import_form:init_import_form,
		init_export_form:init_export_form,
		save_inner_form:save_inner_form,
		get_ui_opt: get_ui_opt,
		save_temp_url:save_temp_url
	};
}());
var wpfilter = (function()
{
	var tab_opt = {
			select: clear_tabs,
			load: init_content
	};
	var modules = null;
	
	function clear_tabs(evt, ui)
	{
		$("#wpfilter_tabs > div[id^='wpfilter']").empty();
		utils.clear_dialogs();
	}
	
	function save(o)
	{
		var i = o.level - 1;
		var sep = (o.scope == '' ? '' :'-');
		var prefix = (o.level < 1 ? '' : '_' + o.level);
		var _prefix = (i < 1 ? '' : '_' + i);
		var currform = $("#save-form" + sep + o.scope + prefix);
		var prevform = $("#save-form" + sep + o.scope + _prefix);
		var savetemp = (o.savetemp == null ? '' : o.savetemp);
		var data = o.func_get_data(currform, "", savetemp);
		data['level'] = o.level;
		$.post(o.url, data,
				function(result)
				{
					if (result.success == 1)
					{
						o.func_add(result.id, result.name);
						utils.cancel_dialog(o.level, "#dialog-add" + sep + o.scope);
					}
		
					else if (result.error == 1)
					{
						err = utils.get_errors(result.errors);
						o.func_show_dialog(1, err);
					}
		
					else
					{
						o.func_show_dialog(2, result);
					}
				});
		return false;
	}

	function init_content(evt, ui)
	{
		var i = ui.index;
		modules[i]();
	}

	function init()
	{
		modules = [wpcat.init, wpwhitelist.init, wpblacklist.init, wpext.init, wpcontent.init, wpmime.init];
		$("#wpfilter_tabs").tabs(tab_opt);
	}

	function load()
	{
		$("#wpfilter_tabs").tabs('destroy');
		$("#wpfilter_tabs").remove();
		return menu.get('/wpfilter/', init);
	}

	return {
		load:load,
		save:save
	}
}());
var wpmime = (function()
{
	var save_url = "/wpmime/save/";
	var delete_url = "/wpmime/delete/";
	var list_url = "/wpmime/list/";
	var list = {
			panel: '/wpmime/list/panel/',
			select: '/wpmime/list/select/'
	};
	var save_temp_url = "/wpmime/save/temp/";
	var list_temp = {
			panel: '/wpmime/list/panel/temp/',
			select: '/wpmime/list/select/temp/'
	}
	var save_mime_url = "/wpmime/mime/save/";
	var import_url = "/wpcat/import/";
	var export_url = "/wpcat/export/";
	var popup_dialog_opt = null;
	var popup_dialog_edit_mime_opt = null;
	var popup_dialog_import_opt = null;
	var popup_dialog_export_opt = null;

	function init_ui_opt()
	{
		popup_dialog_opt = {
				autoOpen: false,
				width: 320,
				resizable: false,
				draggable: false,
				modal: false,
				stack: true,
				zIndex: 1001
		};
		popup_dialog_edit_mime_opt = {
				autoOpen: false,
				width: 320,
				resizable: false,
				draggable: false,
				modal: false,
				stack: true,
				zIndex: 1002
		};
		popup_dialog_import_opt = {
				autoOpen: false,
				width: 350,
				resizable: false,
				draggable: false,
				modal: false,
				stack: true,
				zIndex: 1002
		};
		popup_dialog_export_opt = {
				autoOpen: false,
				width: 350,
				resizable: false,
				draggable: false,
				modal: false,
				stack: true,
				zIndex: 1002
		};
	}

	function get_ui_opt()
	{
		init_ui_opt();
		return {
			popup_dialog_opt: popup_dialog_opt,
			popup_dialog_edit_mime_opt: popup_dialog_edit_mime_opt,
			popup_dialog_import_opt: popup_dialog_import_opt,
			popup_dialog_export_opt: popup_dialog_export_opt
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
					var nextform = $("#save-form" + sep + data.scope + _prefix);
					utils.set_data(nextform.find("#mime_list"), 'mimes', []);
					nextform.find("#id_mime").keypress(function(evt)
							{
								mime_keypress(evt, nextform);
							});
					nextform.find(".wpmime_form1 .add_button").click(function()
							{
								return add_mime(nextform);
							});
					nextform.find(".save_button.save").click(data.func_save);
					nextform.find(".save_button.cancel").click(function()
							{
								utils.cancel_dialog(data.level, "#dialog-add" + sep + data.scope);
							});
					nextform.find(".img_import").click(data.func_show_import);
					nextform.find(".img_export").click(data.func_show_export);
					$("#dialog-editmime" + sep + data.scope + _prefix).dialog(get_ui_opt().popup_dialog_edit_mime_opt);
					$("#dialog-import" + sep + data.scope + _prefix).dialog(get_ui_opt().popup_dialog_import_opt);
					$("#dialog-export" + sep + data.scope + _prefix).dialog(get_ui_opt().popup_dialog_export_opt);
					utils.bind_hover(nextform.find(".save_button,.wpmime_form1 .add_button"));
					$("#dialog-add" + sep + data.scope + data.prefix).dialog('open');
				});
	}

	function init_edit_form(data)
	{
		var offset = $(data.self).offset();
		var position = [offset.left, utils.get_elm_top(offset.top)];
		var _prefix = '_' + data.level;
		var sep = (data.scope == '' ? '' : '-');
		var scopeq = (data.scope == '' ? '' : '&scope=' + data.scope);
		var wizq = (data.url == null ? '' : '&wiz=1');
		utils.remove_dialog("#dialog-edit" + sep + data.scope + _prefix);
		$("#dialog_body" + sep + data.scope + data.prefix).empty();
		$("#dialog-add" + sep + data.scope + data.prefix).dialog('close');
		var url = (data.url == null ? save_url : data.url);
		$("#dialog-edit" + sep + data.scope + data.prefix).dialog('option', 'position', position);
		$("#dialog_edit_body" + sep + data.scope + data.prefix).load(url + "?id=" + data.id + "&level=" + data.level + scopeq + wizq, null,
				function()
				{
					var nextform = $("#save-form" + sep + data.scope + _prefix);
					nextform.find("#id_mime").keypress(function(evt)
							{
								mime_keypress(evt, nextform);
							});
					nextform.find(".wpmime_form1 .add_button").click(function()
							{
								return add_mime(nextform);
							});
					nextform.find(".save_button.save").click(function()
							{
								return update_inner_form(data);
							});
					nextform.find(".save_button.cancel").click(function()
							{
								utils.cancel_dialog(data.level, "#dialog-edit" + sep + data.scope);
							});
					nextform.find(".img_import").click(data.func_show_import);
					nextform.find(".img_export").click(data.func_show_export);
					$("#dialog-editmime" + sep + data.scope + _prefix).dialog(get_ui_opt().popup_dialog_edit_mime_opt);
					$("#dialog-import" + sep + data.scope + _prefix).dialog(get_ui_opt().popup_dialog_import_opt);
					$("#dialog-export" + sep + data.scope + _prefix).dialog(get_ui_opt().popup_dialog_export_opt);
					set_items(nextform);
					utils.bind_hover(nextform.find(".save_button,.wpmime_form1 .add_button"));
					$("#dialog-edit" + sep + data.scope + data.prefix).dialog('open');
				});
	}

	function init_edit_mime_form(data)
	{
		var offset = $(data.self).offset();
		var position = [offset.left, utils.get_elm_top(offset.top)];
		var _prefix = '_' + data.level;
		var sep = (data.scope == '' ? '' : '-');
		var scopeq = (data.scope == '' ? '' : '&scope=' + data.scope);
		utils.remove_dialog("#dialog-editmime" + sep + data.scope + _prefix);
		var url = (data.url == null ? save_mime_url : data.url);
		$("#dialog-editmime" + sep + data.scope + data.prefix).dialog('option', 'position', position);
		$("#dialog_editmime_body" + sep + data.scope + data.prefix).load(url + "?level=" + data.level + scopeq, null,
				function()
				{
					var nextform = $("#save-mimeform" + sep + data.scope + _prefix);
					nextform.find("#id_mime").val(data.mimevalue);
					nextform.find(".save_button.save").click(function()
							{
								return update_mime(data);
							});
					nextform.find(".save_button.cancel").click(function()
							{
								utils.cancel_dialog(data.level, "#dialog-editmime" + sep + data.scope);
							});
					utils.bind_hover(nextform.find(".save_button"));
					$("#dialog-editmime" + sep + data.scope + data.prefix).dialog('open');
				});
	}

	function init_import_form(data)
	{
		var offset = $(data.self).offset();
		var position = [offset.left, utils.get_elm_top(offset.top)];
		var _prefix = '_' + data.level;
		var sep = (data.scope == '' ? '' : '-');
		var scopeq = (data.scope == '' ? '' : '&scope=' + data.scope);
		$("#dialog-import" + sep + data.scope + data.prefix).dialog('option', 'position', position);
		$("#dialog_import_body" + sep + data.scope + data.prefix).load(import_url + "?level=" + data.level + scopeq, null,
				function()
				{
					var nextform = $("#import-form" + sep + data.scope + _prefix);
					nextform.find(".save_button.import").click(function()
							{
								return func_import(data);
							});
					nextform.find(".save_button.cancel").click(function()
							{
								utils.cancel_dialog(data.level, "#dialog-import" + sep + data.scope);
							});
					utils.bind_hover(nextform.find(".save_button"));
					$("#dialog-import" + sep + data.scope + data.prefix).dialog('open');
				});
	}

	function init_export_form(data)
	{
		var offset = $(data.self).offset();
		var position = [offset.left, utils.get_elm_top(offset.top)];
		var _prefix = '_' + data.level;
		var sep = (data.scope == '' ? '' : '-');
		var scopeq = (data.scope == '' ? '' : '&scope=' + data.scope);
		$("#dialog-export" + sep + data.scope + data.prefix).dialog('option', 'position', position);
		$("#dialog_export_body" + sep + data.scope + data.prefix).load(export_url + "?level=" + data.level + scopeq, null,
				function()
				{
					var nextform = $("#export-form" + sep + data.scope + _prefix);
					nextform.find(".save_button.cancel").click(function()
							{
								utils.cancel_dialog(data.level, "#dialog-export" + sep + data.scope);
							});
					nextform.find("#id_delimiter").change(set_export_delimiter);
					utils.bind_hover(nextform.find(".save_button"));
					init_export_data(data, nextform);
					$("#dialog-export" + sep + data.scope + data.prefix).dialog('open');
				});
	}

	function show_form()
	{
		$("#left_box").load(save_url, null,
				function()
				{
					var form = $("#save-form");
					utils.set_data(form.find("#mime_list"), 'mimes', []);
					$("#left_box").css('width', '300px');
					$("#id_mime").keypress(function(evt)
							{
								mime_keypress(evt, form);
							});
					$(".wpmime_form1 .add_button").click(function()
							{
								return add_mime(form);
							});
					$(".save_button.save").click(func_save);
					$(".save_button.cancel,.form_title div.close").click(utils.cancel_form);
					$(".img_import").click(show_import);
					$(".img_export").click(show_export);
					$("#dialog-editmime").dialog(popup_dialog_edit_mime_opt);
					$("#dialog-import").dialog(popup_dialog_import_opt);
					$("#dialog-export").dialog(popup_dialog_export_opt);
					utils.bind_hover($(".save_button,.form_title div.close,.wpmime_form1 .add_button"));
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
					var form = $("#save-form");
					$("#left_box").css('width', '300px');
					$("#id_mime").keypress(function(evt)
							{
								mime_keypress(evt, form);
							});
					$(".wpmime_form1 .add_button").click(function()
							{
								return add_mime(form);
							});
					$(".save_button.save").click(
							function()
							{
								if (o.clone == null)
									return func_update(arg);

								else
									return func_save();
							});
					$(".save_button.cancel,.form_title div.close").click(utils.cancel_form);
					$(".img_import").click(show_import);
					$(".img_export").click(show_export);
					$("#dialog-editmime").dialog(popup_dialog_edit_mime_opt);
					$("#dialog-import").dialog(popup_dialog_import_opt);
					$("#dialog-export").dialog(popup_dialog_export_opt);
					set_items(form);
					utils.bind_hover($(".save_button,.form_title div.close,.wpmime_form1 .add_button"));
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
				text: keyword,
				confirm: ''
		};
		ajax_delete(data, item);
	}

	function func_clone()
	{
		var self = this;
		edit_helper({self: self, clone: 1});
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

	function save_inner_form(o)
	{
		o['url'] = (o.url == null ? save_url : o.url);
		o['func_get_data'] = get_data;
		o['func_show_dialog'] = utils.show_dialog;
		return wpfilter.save(o);
	}

	function update_inner_form(o)
	{
		var i = o.level - 1;
		var sep = (o.scope == '' ? '' : '-');
		var prefix = (o.level < 1 ? '' : '_' + o.level);
		var _prefix = (i < 1 ? '' : '_' + i);
		var currform = $("#save-form" + sep + o.scope + prefix);
		var prevform = $("#save-form" + sep + o.scope + _prefix);
		var data = get_data(currform, o.id, "update");
		data['level'] = o.level;
		$.post(save_url, data,
				function(result)
				{
					if (result.success == 1)
					{
						if (o.level == 1 && o.scope != '')
							o.func_update(result.id, result.name, o.self);

						else
							update_mime(prevform, result.id, result.name, o.self)

						utils.cancel_dialog(o.level, "#dialog-edit" + sep + o.scope);
					}

					else if (result.error == 1)
					{
						err = utils.get_errors(result.errors);
						utils.show_dialog(1, err);
					}

					else
					{
						utils.show_dialog(2, result);
					}
				});
	}

	function update_inner_form(o)
	{
		var i = o.level - 1;
		var sep = (o.scope == '' ? '' : '-');
		var prefix = (o.level < 1 ? '' : '_' + o.level);
		var _prefix = (i < 1 ? '' : '_' + i);
		var currform = $("#save-form" + sep + o.scope + prefix);
		var prevform = $("#save-form" + sep + o.scope + _prefix);
		var savetemp = (o.savetemp == null ? 'update' : o.savetemp);
		var data = get_data(currform, o.id, savetemp);
		data['level'] = o.level;
		var url = (o.url == null ? save_url : o.url);
		$.post(url, data,
				function(result)
				{
					if (result.success == 1)
					{
						o.func_update(result.id, result.name, o.self);
						utils.cancel_dialog(o.level, "#dialog-edit" + sep + o.scope);
					}

					else if (result.error == 1)
					{
						err = utils.get_errors(result.errors);
						utils.show_dialog(1, err);
					}

					else
					{
						utils.show_dialog(2, result);
					}
				});
	}

	function init_export_data(o, form)
	{
		var i = o.level - 1;
		var sep = (o.scope == '' ? '' : '-');
		var _prefix = (i < 1 ? '' : '_' + i);
		var prevform = $("#save-form" + sep + o.scope + _prefix);
		set_export_text(prevform, form);
	}

	function set_export_delimiter()
	{
		var form = utils.get_parent(this, 2);
		var formid = form.attr("id");
		var level = utils.get_form_level(formid);
		var scope = utils.get_form_scope(formid);
		var i = level - 1;
		var sep = (scope == '' ? '' : '-');
		var _prefix = (i < 1 ? '' : '_' + i);
		var prevform = $("#save-form" + sep + scope + _prefix);
		set_export_text(prevform, form);
	}

	function set_export_text(prevform, currform)
	{
		var delimiter = get_delimiter(currform);
		var arr = prevform.find("#mime_list").data('mimes');
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

	function show_import()
	{
		var o = get_level_data(this);
		var self = this;
		var data = {
				self: self,
				level: o.level,
				prefix: o.prefix,
				scope: ''
		};
		init_import_form(data);
		return false;
	}

	function show_export()
	{
		var o = get_level_data(this);
		var self = this;
		var data = {
				self: self,
				level: o.level,
				prefix: o.prefix,
				scope: ''
		}
		init_export_form(data);
		return false;
	}

	function mime_keypress(evt, form)
	{
		if (evt.keyCode == '13')
		{
			evt.preventDefault();
			evt.stopPropagation();
			add_mime(form);
		}
	}

	function add_mime(form)
	{
		var v = form.find("#id_mime").val();
		if (v == '')
			return false;

		var arr = [v];
		add_mimes(form, arr);
		form.find("#id_mime").val('');
		return false;
	}

	function add_mimes(form, buff)
	{
		var l = form.find("#mime_list");
		var arr = l.data('mimes');
		var n = 0;
		if (buff == null)
			return;

		else if (buff.length > 0)
		{
			n = buff.length;
			for (var i = 0; i < n; i++)
			{
				var v = buff[i];
				if (v == '')
					continue;

				if (!utils.item_exist(v, arr))
				{
					arr.push(v);
					var data = {
							id_prefix: 'mime_',
							id: 'item',
							click: 'wpmime.remove_mime(this)',
							editclick: 'wpmime.edit_mime(this)',
							name: v
					};
					var h = new EJS({url: '/media/tpl/list_item.ejs'}).render(data);
					l.append(h);
				}
			}

			utils.set_data(form.find("#mime_list"), 'mimes', arr);
			set_alt_css(form, "#mime_list");
		}
	}

	function remove_mime(o)
	{
		var item = $(o);
		var v = item.next().next().html();
		var form = utils.get_parent(item, 4);
		var arr = form.find("#mime_list").data('mimes');
		var i = $.inArray(v, arr);
		if (i >= 0)
		{
			arr.splice(i, 1)
			utils.set_data(form.find("#mime_list"), 'mimes', arr);
		}

		item.parent().remove();
		set_alt_css(form, "#mime_list");
		return false;
	}

	function edit_mime(obj)
	{
		var item = $(obj);
		var mimevalue = item.next().html();
		var form = utils.get_parent(item, 5);
		var form_id = form.attr("id");
		var scope = utils.get_form_scope(form_id);
		var arr = form.find("#mime_list").data('mimes');
		var i = $.inArray(mimevalue, arr);
		if (i >= 0)
		{
			var o = get_form_level_data(form);
			var self = item;
			var data = {
					self: self,
					mimevalue: mimevalue,
					level: o.level,
					prefix: o.prefix,
					scope: scope
			};
			init_edit_mime_form(data);
			return false;
		}

		return false;
	}

	function update_mime(o)
	{
		var i = o.level - 1;
		var sep = (o.scope == '' ? '' : '-');
		var prefix = (o.level < 1 ? '' : '_' + o.level);
		var _prefix = (i < 1 ? '' : '_' + i);
		var currform = $("#save-mimeform" + sep + o.scope + prefix);
		var prevform = $("#save-form" + sep + o.scope + _prefix);
		var mimevalue = currform.find("#id_mime").val();
		if ($.trim(mimevalue) == '')
			return;

		var arr = prevform.find("#mime_list").data('mimes');
		var j = $.inArray(o.mimevalue, arr);
		if (j >= 0)
		{
			arr[j] = mimevalue;
			$(o.self).next().html(mimevalue);
			utils.set_data(prevform.find("#mime_list"), 'mimes', arr);
			utils.cancel_dialog(o.level, "#dialog-editmime" + sep + o.scope);
		}
	}

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

	function func_import(o)
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
			add_mimes(prevform, arr);
			utils.cancel_dialog(o.level, "#dialog-import" + sep + o.scope);
			return;
		}

		j = txt.indexOf(',');
		if (j >= 0)
		{
			arr = txt.split(',');
			add_mimes(prevform, arr);
			utils.cancel_dialog(o.level, "#dialog-import" + sep + o.scope);
			return;
		}

		j = txt.indexOf(';');
		if (j >= 0)
		{
			arr = txt.split(';');
			add_mimes(prevform, arr);
			utils.cancel_dialog(o.level, "#dialog-import" + sep + o.scope);
			return;
		}

		// only have 1 item
		arr = [txt];
		add_mimes(prevform, arr);
		utils.cancel_dialog(o.level, "#dialog-import" + sep + o.scope);
	}

	function get_data(form, arg, savetype)
	{
		var arr = form.find("#mime_list").data('mimes');
		var data = {
				name: form.find("#id_name").val(),
				comment: form.find("#id_comment").val(),
				mimes: arr.join('||'),
				id: arg,
				save_type: savetype
		}

		return data;
	}

	function get_level_data(self)
	{
		var currform = utils.get_parent(self, 4);
		return get_form_level_data(currform);
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

	function set_items(form)
	{
		var arr = [];
		form.find("#mime_list > div").each(
				function()
				{
					var v = $(this).find(".item_edit").next().html();
					if (!utils.item_exist(v, arr))
					{
						arr.push(v);
					}
				});
		utils.set_data(form.find("#mime_list"), 'mimes', arr);
		set_alt_css(form, "#mime_list");
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
		utils.init_alert_dialog("#dialog-message");
		utils.init_confirm_delete("#confirm-delete");
		utils.bind_hover($("#id_add,#id_find"));
		nav_list.config.list_url = list_url;
		nav_list.config.list_func = init_list;
		nav_list.init();
	}

	function load()
	{
		return menu.get('/wpmime/', init);
	}

	return {
		load:load,
		list:list,
		list_temp:list_temp,
		init:init,
		edit_mime:edit_mime,
		remove_mime:remove_mime,
		get_level_data:get_level_data,
		init_form:init_form,
		init_edit_form:init_edit_form,
		init_edit_mime_form:init_edit_mime_form,
		init_import_form:init_import_form,
		init_export_form:init_export_form,
		save_inner_form:save_inner_form,
		get_ui_opt: get_ui_opt,
		save_temp_url:save_temp_url
	};
}());
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
var wpwhitelist = (function()
{
	var save_url = "/wpwhitelist/save/";
	var delete_url = "/wpwhitelist/delete/";
	var list_url = "/wpwhitelist/list/";
	var list = {
			panel: '/wpwhitelist/list/panel/',
			select: '/wpwhitelist/list/select/'
	};
	
	var save_temp_url = "/wpwhitelist/save/temp/";
	var list_temp = {
			panel: '/wpwhitelist/list/panel/temp/',
			select: '/wpwhitelist/list/select/temp/'
	};
	
	var save_url_url = "/wpcat/url/save/";
	var import_url = "/wpcat/import/";
	var export_url = "/wpcat/export/";
	var popup_dialog_opt = null;
	var popup_dialog_edit_url_opt = null;
	var popup_dialog_import_opt = null;
	var popup_dialog_export_opt = null;

	function init_ui_opt()
	{
		popup_dialog_opt = {
				autoOpen: false,
				width: 320,
				resizable: false,
				draggable: false,
				modal: false,
				stack: true,
				zIndex: 1001
		};
		popup_dialog_edit_url_opt = {
				autoOpen: false,
				width: 320,
				resizable: false,
				draggable: false,
				modal: false,
				stack: true,
				zIndex: 1002
		};
		popup_dialog_import_opt = {
				autoOpen: false,
				width: 350,
				resizable: false,
				draggable: false,
				modal: false,
				stack: true,
				zIndex: 1002
		};
		popup_dialog_export_opt = {
				autoOpen: false,
				width: 350,
				resizable: false,
				draggable: false,
				modal: false,
				stack: true,
				zIndex: 1002
		};
	}

	function get_ui_opt()
	{
		init_ui_opt();
		return {
			popup_dialog_opt: popup_dialog_opt,
			popup_dialog_edit_url_opt: popup_dialog_edit_url_opt,
			popup_dialog_import_opt: popup_dialog_import_opt,
			popup_dialog_export_opt: popup_dialog_export_opt
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
					var nextform = $("#save-form" + sep + data.scope + _prefix);
					utils.set_data(nextform.find("#url_list"), 'urls', []);
					nextform.find("#id_url").keypress(function(evt)
							{
								url_keypress(evt, nextform);
							});
					nextform.find(".wpwhitelist_form1 .add_button").click(function()
							{
								return add_url(nextform);
							});
					nextform.find(".save_button.save").click(data.func_save);
					nextform.find(".save_button.cancel").click(function()
							{
								utils.cancel_dialog(data.level, "#dialog-add" + sep + data.scope);
							});
					nextform.find(".img_import").click(data.func_show_import);
					nextform.find(".img_export").click(data.func_show_export);
					$("#dialog-editurl" + sep + data.scope + _prefix).dialog(get_ui_opt().popup_dialog_edit_url_opt);
					$("#dialog-import" + sep + data.scope + _prefix).dialog(get_ui_opt().popup_dialog_import_opt);
					$("#dialog-export" + sep + data.scope + _prefix).dialog(get_ui_opt().popup_dialog_export_opt);
					utils.bind_hover(nextform.find(".save_button,.wpwhitelist_form1 .add_button"));
					$("#dialog-add" + sep + data.scope + data.prefix).dialog('open');
				});
	}

	function init_edit_form(data)
	{
		var offset = $(data.self).offset();
		var position = [offset.left, utils.get_elm_top(offset.top)];
		var _prefix = '_' + data.level;
		var sep = (data.scope == '' ? '' : '-');
		var scopeq = (data.scope == '' ? '' : '&scope=' + data.scope);
		var wizq = (data.url == null ? '' : '&wiz=1');
		utils.remove_dialog("#dialog-edit" + sep + data.scope + _prefix);
		$("#dialog_body" + sep + data.scope + data.prefix).empty();
		$("#dialog-add" + sep + data.scope + data.prefix).dialog('close');
		var url = (data.url == null ? save_url : data.url);
		$("#dialog-edit" + sep + data.scope + data.prefix).dialog('option', 'position', position);
		$("#dialog_edit_body" + sep + data.scope + data.prefix).load(url + "?id=" + data.id + "&level=" + data.level + scopeq + wizq, null,
				function()
				{
					var nextform = $("#save-form" + sep + data.scope + _prefix);
					nextform.find("#id_url").keypress(function(evt)
							{
								url_keypress(evt, nextform);
							});
					nextform.find(".wpwhitelist_form1 .add_button").click(function()
							{
								return add_url(nextform);
							});
					nextform.find(".save_button.save").click(function()
							{
								return update_inner_form(data);
							});
					nextform.find(".save_button.cancel").click(function()
							{
								utils.cancel_dialog(data.level, "#dialog-edit" + sep + data.scope);
							});
					nextform.find(".img_import").click(data.func_show_import);
					nextform.find(".img_export").click(data.func_show_export);
					$("#dialog-editurl" + sep + data.scope + _prefix).dialog(get_ui_opt().popup_dialog_edit_url_opt);
					$("#dialog-import" + sep + data.scope + _prefix).dialog(get_ui_opt().popup_dialog_import_opt);
					$("#dialog-export" + sep + data.scope + _prefix).dialog(get_ui_opt().popup_dialog_export_opt);
					set_items(nextform);
					utils.bind_hover(nextform.find(".save_button,.wpwhitelist_form1 .add_button"));
					$("#dialog-edit" + sep + data.scope + data.prefix).dialog('open');
				});
	}

	function init_edit_url_form(data)
	{
		var offset = $(data.self).offset();
		var position = [offset.left, utils.get_elm_top(offset.top)];
		var _prefix = '_' + data.level;
		var sep = (data.scope == '' ? '' : '-');
		var scopeq = (data.scope == '' ? '' : '&scope=' + data.scope);
		utils.remove_dialog("#dialog-editurl" + sep + data.scope + _prefix);
		var url = (data.url == null ? save_url_url : data.url);
		$("#dialog-editurl" + sep + data.scope + data.prefix).dialog('option', 'position', position);
		$("#dialog_editurl_body" + sep + data.scope + data.prefix).load(url + "?level=" + data.level + scopeq, null,
				function()
				{
					var nextform = $("#save-urlform" + sep + data.scope + _prefix);
					nextform.find("#id_url").val(data.urlvalue);
					nextform.find(".save_button.save").click(function()
							{
								return update_url(data);
							});
					nextform.find(".save_button.cancel").click(function()
							{
								utils.cancel_dialog(data.level, "#dialog-editurl" + sep + data.scope);
							});
					utils.bind_hover(nextform.find(".save_button"));
					$("#dialog-editurl" + sep + data.scope + data.prefix).dialog('open');
				});
	}

	function init_import_form(data)
	{
		var offset = $(data.self).offset();
		var position = [offset.left, utils.get_elm_top(offset.top)];
		var _prefix = '_' + data.level;
		var sep = (data.scope == '' ? '' : '-');
		var scopeq = (data.scope == '' ? '' : '&scope=' + data.scope);
		$("#dialog-import" + sep + data.scope + data.prefix).dialog('option', 'position', position);
		$("#dialog_import_body" + sep + data.scope + data.prefix).load(import_url + "?level=" + data.level + scopeq, null,
				function()
				{
					var nextform = $("#import-form" + sep + data.scope + _prefix);
					nextform.find(".save_button.import").click(function()
							{
								return func_import(data);
							});
					nextform.find(".save_button.cancel").click(function()
							{
								utils.cancel_dialog(data.level, "#dialog-import" + sep + data.scope);
							});
					utils.bind_hover(nextform.find(".save_button"));
					$("#dialog-import" + sep + data.scope + data.prefix).dialog('open');
				});
	}

	function init_export_form(data)
	{
		var offset = $(data.self).offset();
		var position = [offset.left, utils.get_elm_top(offset.top)];
		var _prefix = '_' + data.level;
		var sep = (data.scope == '' ? '' : '-');
		var scopeq = (data.scope == '' ? '' : '&scope=' + data.scope);
		$("#dialog-export" + sep + data.scope + data.prefix).dialog('option', 'position', position);
		$("#dialog_export_body" + sep + data.scope + data.prefix).load(export_url + "?level=" + data.level + scopeq, null,
				function()
				{
					var nextform = $("#export-form" + sep + data.scope + _prefix);
					nextform.find(".save_button.cancel").click(function()
							{
								utils.cancel_dialog(data.level, "#dialog-export" + sep + data.scope);
							});
					nextform.find("#id_delimiter").change(set_export_delimiter);
					utils.bind_hover(nextform.find(".save_button"));
					init_export_data(data, nextform);
					$("#dialog-export" + sep + data.scope + data.prefix).dialog('open');
				});
	}

	function show_form()
	{
		$("#left_box").load(save_url, null,
				function()
				{
					utils.set_data($("#save-form").find("#url_list"), 'urls', []);
					$("#left_box").css('width', '300px');
					$("#id_url").keypress(function(evt)
							{
								url_keypress(evt, $("#save-form"));
							});
					$(".wpwhitelist_form1 .add_button").click(function()
							{
								return add_url($("#save-form"));
							});
					$(".save_button.save").click(func_save);
					$(".save_button.cancel,.form_title div.close").click(utils.cancel_form);
					$(".img_import").click(show_import);
					$(".img_export").click(show_export);
					$("#dialog-editurl").dialog(popup_dialog_edit_url_opt);
					$("#dialog-import").dialog(popup_dialog_import_opt);
					$("#dialog-export").dialog(popup_dialog_export_opt);
					utils.bind_hover($(".save_button,.form_title div.close,.wpwhitelist_form1 .add_button"));
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
					var form = $("#save-form");
					$("#left_box").css('width', '300px');
					$("#id_url").keypress(function(evt)
							{
								url_keypress(evt, form);
							});
					$(".wpwhitelist_form1 .add_button").click(function()
							{
								return add_url(form);
							});
					$(".save_button.save").click(
							function()
							{
								if (o.clone == null)
									return func_update(arg);

								else
									return func_save();
							});
					$(".save_button.cancel,.form_title div.close").click(utils.cancel_form);
					$(".img_import").click(show_import);
					$(".img_export").click(show_export);
					$("#dialog-editurl").dialog(popup_dialog_edit_url_opt);
					$("#dialog-import").dialog(popup_dialog_import_opt);
					$("#dialog-export").dialog(popup_dialog_export_opt);
					set_items(form);
					utils.bind_hover($(".save_button,.form_title div.close,.wpwhitelist_form1 .add_button"));
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
				text: keyword,
				confirm: ''
		};
		ajax_delete(data, item);
	}

	function func_clone()
	{
		var self = this;
		edit_helper({self: self, clone: 1});
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

	function save_inner_form(o)
	{
		o['url'] = (o.url == null ? save_url : o.url);
		o['func_get_data'] = get_data;
		o['func_show_dialog'] = utils.show_dialog;
		return wpfilter.save(o);
	}

	function update_inner_form(o)
	{
		var i = o.level - 1;
		var sep = (o.scope == '' ? '' : '-');
		var prefix = (o.level < 1 ? '' : '_' + o.level);
		var _prefix = (i < 1 ? '' : '_' + i);
		var currform = $("#save-form" + sep + o.scope + prefix);
		var prevform = $("#save-form" + sep + o.scope + _prefix);
		var savetemp = (o.savetemp == null ? 'update' : o.savetemp);
		var data = get_data(currform, o.id, savetemp);
		data['level'] = o.level;
		var url = (o.url == null ? save_url : o.url);
		$.post(url, data,
				function(result)
				{
					if (result.success == 1)
					{
						o.func_update(result.id, result.name, o.self);
						utils.cancel_dialog(o.level, "#dialog-edit" + sep + o.scope);
					}

					else if (result.error == 1)
					{
						err = utils.get_errors(result.errors);
						utils.show_dialog(1, err);
					}

					else
					{
						utils.show_dialog(2, result);
					}
				});
	}

	function init_export_data(o, form)
	{
		var i = o.level - 1;
		var sep = (o.scope == '' ? '' : '-');
		var _prefix = (i < 1 ? '' : '_' + i);
		var prevform = $("#save-form" + sep + o.scope + _prefix);
		set_export_text(prevform, form);
	}

	function set_export_delimiter()
	{
		var form = utils.get_parent(this, 2);
		var formid = form.attr("id");
		var level = utils.get_form_level(formid);
		var scope = utils.get_form_scope(formid);
		var i = level - 1;
		var sep = (scope == '' ? '' : '-');
		var _prefix = (i < 1 ? '' : '_' + i);
		var prevform = $("#save-form" + sep + scope + _prefix);
		set_export_text(prevform, form);
	}

	function set_export_text(prevform, currform)
	{
		var delimiter = get_delimiter(currform);
		var arr = prevform.find("#url_list").data('urls');
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

	function show_import()
	{
		var o = get_level_data(this);
		var self = this;
		var data = {
				self: self,
				level: o.level,
				prefix: o.prefix,
				scope: ''
		};
		init_import_form(data);
		return false;
	}

	function show_export()
	{
		var o = get_level_data(this);
		var self = this;
		var data = {
				self: self,
				level: o.level,
				prefix: o.prefix,
				scope: ''
		}
		init_export_form(data);
		return false;
	}

	function url_keypress(evt, form)
	{
		if (evt.keyCode == '13')
		{
			evt.preventDefault();
			evt.stopPropagation();
			add_url(form);
		}
	}

	function add_url(form)
	{
		var v = form.find("#id_url").val();
		if (v == '')
			return false;

		var arr = [v];
		add_urls(form, arr);
		form.find("#id_url").val('');
		return false;
	}

	function add_urls(form, buff)
	{
		var l = form.find("#url_list");
		var arr = l.data('urls');
		var n = 0;
		if (buff == null)
			return;

		else if (buff.length > 0)
		{
			n = buff.length;
			for (var i = 0; i < n; i++)
			{
				var v = buff[i];
				if (v == '')
					continue;

				if (!utils.item_exist(v, arr))
				{
					arr.push(v);
					var data = {
							id_prefix: 'url_',
							id: 'item',
							click: 'wpwhitelist.remove_url(this)',
							editclick: 'wpwhitelist.edit_url(this)',
							name: v
					};
					var h = new EJS({url: '/media/tpl/list_item.ejs'}).render(data);
					l.append(h);
				}
			}

			utils.set_data(form.find("#url_list"), 'urls', arr);
			set_alt_css(form, "#url_list");
		}
	}

	function remove_url(o)
	{
		var item = $(o);
		var v = item.next().next().html();
		var form = utils.get_parent(item, 4);
		var arr = form.find("#url_list").data('urls');
		var i = $.inArray(v, arr);
		if (i >= 0)
		{
			arr.splice(i, 1)
			utils.set_data(form.find("#url_list"), 'urls', arr);
		}

		item.parent().remove();
		set_alt_css(form, "#url_list");
		return false;
	}

	function edit_url(obj)
	{
		var item = $(obj);
		var urlvalue = item.next().html();
		var form = utils.get_parent(item, 5);
		var form_id = form.attr("id");
		var scope = utils.get_form_scope(form_id);
		var arr = form.find("#url_list").data('urls');
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
			init_edit_url_form(data);
			return false;
		}

		return false;
	}

	function update_url(o)
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

		var arr = prevform.find("#url_list").data('urls');
		var j = $.inArray(o.urlvalue, arr);
		if (j >= 0)
		{
			arr[j] = urlvalue;
			$(o.self).next().html(urlvalue);
			utils.set_data(prevform.find("#url_list"), 'urls', arr);
			utils.cancel_dialog(o.level, "#dialog-editurl" + sep + o.scope);
		}
	}

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

	function func_import(o)
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
			add_urls(prevform, arr);
			utils.cancel_dialog(o.level, "#dialog-import" + sep + o.scope);
			return;
		}

		j = txt.indexOf(',');
		if (j >= 0)
		{
			arr = txt.split(',');
			add_urls(prevform, arr);
			utils.cancel_dialog(o.level, "#dialog-import" + sep + o.scope);
			return;
		}

		j = txt.indexOf(';');
		if (j >= 0)
		{
			arr = txt.split(';');
			add_urls(prevform, arr);
			utils.cancel_dialog(o.level, "#dialog-import" + sep + o.scope);
			return;
		}

		// only have 1 item
		arr = [txt];
		add_urls(prevform, arr);
		utils.cancel_dialog(o.level, "#dialog-import" + sep + o.scope);
	}

	function get_data(form, arg, savetype)
	{
		var arr = form.find("#url_list").data('urls');
		var data = {
				name: form.find("#id_name").val(),
				comment: form.find("#id_comment").val(),
				urls: arr.join('||'),
				id: arg,
				save_type: savetype
		}

		return data;
	}

	function get_level_data(self)
	{
		var currform = utils.get_parent(self, 4);
		return get_form_level_data(currform);
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

	function set_items(form)
	{
		var arr = [];
		form.find("#url_list > div").each(
				function()
				{
					var v = $(this).find(".item_edit").next().html();
					if (!utils.item_exist(v, arr))
					{
						arr.push(v);
					}
				});
		utils.set_data(form.find("#url_list"), 'urls', arr);
		set_alt_css(form, "#url_list");
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
		utils.init_alert_dialog("#dialog-message");
		utils.init_confirm_delete("#confirm-delete");
		utils.bind_hover($("#id_add,#id_find"));
		nav_list.config.list_url = list_url;
		nav_list.config.list_func = init_list;
		nav_list.init();
	}

	function load()
	{
		return menu.get('/wpwhitelist/', init);
	}

	return {
		load:load,
		list:list,
		list_temp : list_temp,
		init:init,
		edit_url:edit_url,
		remove_url:remove_url,
		get_level_data:get_level_data,
		init_form:init_form,
		init_edit_form:init_edit_form,
		init_edit_url_form:init_edit_url_form,
		init_import_form:init_import_form,
		init_export_form:init_export_form,
		save_inner_form:save_inner_form,
		get_ui_opt: get_ui_opt,
		save_temp_url:save_temp_url
	};
}());
