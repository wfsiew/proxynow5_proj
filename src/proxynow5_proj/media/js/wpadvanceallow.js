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