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