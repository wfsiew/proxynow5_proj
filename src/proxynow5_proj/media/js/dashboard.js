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