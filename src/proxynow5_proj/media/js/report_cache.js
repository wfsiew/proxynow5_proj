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
