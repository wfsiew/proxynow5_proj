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