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