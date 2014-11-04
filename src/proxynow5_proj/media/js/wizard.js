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
