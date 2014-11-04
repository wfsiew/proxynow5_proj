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