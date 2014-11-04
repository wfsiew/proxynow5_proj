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