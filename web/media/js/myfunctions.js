var bodylist = []
var ajaxLoad = '<div id="loading"><img src="./media/img/ajax_loader_large.gif" height="80" /></div>';
/*
 * Generic functions
 */


function plural(word){
	return word+"s";
}

function wordToUpper(strSentence) {
	return strSentence.toLowerCase().replace(/\b[a-z]/g, convertToUpper);
	function convertToUpper() {
		return arguments[0].toUpperCase();
	}
}


/*
 * Functions needed for content panel.
 */

function initializeContent(){
	$("#content_main").html(ajaxLoad);
	/*$("#content_data").tabs("destroy");
	var htmlText = '<ul>\
		<li><a href="#content_recordings"><span>Recordings</span></a></li>\
		<li><a href="#content_details" ><span>Details</span></a></li>\
		<li><a href="#content_wikipedia" ><span>Wikipedia</span></a></li>\
	</ul>\
	<div class="content_part" id="content_recordings">\
	</div>\
	<div class="content_part" id="content_details">\
	</div>\
	<div class="content_part" id="content_wikipedia">\
	</div>';
	$("#content_data").html(htmlText);
	$("#content_data").tabs();*/
}

function getSpecificFields(collection){
	specific_fields = [];
	$.ajax({
		url: "/filters/"+collection,
		dataType: 'text',
		async: false,
		success: function(responseText){
		    fieldsData = JSON.parse(responseText);
		    for (field in fieldsData.specific) {
			specific_fields.push(fieldsData.specific[field]);
		    }
		},
	});
	return specific_fields;
}

function enableSearchTable(min_char){
	var theTable = $('table#content_list')

	theTable.find("tbody > tr").find("td:eq(1)").mousedown(function(){
		$(this).prev().find(":checkbox").click()
	});
      
	$("input#search_content").keyup(function() {
		if (min_char != null){
			if (this.value.length >= parseInt(min_char) || this.value.length == 0){
				$.uiTableFilter( theTable, this.value );
			}
		}else{
			$.uiTableFilter( theTable, this.value );
		}
	});
}

function enableFieldTable(min_char){
	var theTable = $('table#field_table')

	theTable.find("tbody > tr").find("td:eq(1)").mousedown(function(){
		$(this).prev().find(":checkbox").click()
	});
      
	$("input#search_field").keyup(function() {
		if (min_char != null){
			if (this.value.length >= parseInt(min_char) || this.value.length == 0){
				$.uiTableFilter( theTable, this.value );
			}
		}else{
			$.uiTableFilter( theTable, this.value );
		}
	});
}

function fetchInfo(url, field, collection){
	/*
	 * This function takes the "url" thats needs to be called, and further calls
	 * a function with the content received from the first call.
	 * The choice of functions is based on the "field" argument.
	 */
	$("#dialog").dialog("open");
	$("#dialog").html('<div id="loading"><img src="./media/img/ajax_loader_large.gif" height="80" /></div>'); 
	var ajaxLoad = "Loading...";
	//$("#content_querybag").html(ajaxLoad);
	//window.alert(url);
	$.get(
		url,
		function(responseText){
			if (field == "performer"){
				performerList(responseText, field, collection);
			}
			else if (field == "composer" || field == "lyricist")
			{
				composerList(responseText, field, collection);
			}
			else if (field == "instrument"){
				instrumentList(responseText, field, collection);
			}
			else if (field == "form"){
				formList(responseText, field, collection);
			}
			else if (field == "recording"){
				recordingList(responseText, field, collection);
			}
			else if (field == "oldrecording"){
				oldrecordingList(responseText, field, collection);
			}
			else if (field == "release"){
				releaseList(responseText, field, collection);
			}
			else if (field == "work"){
				workList(responseText, field, collection);
			}
			else if (field in {"raaga":1, "taala":1, "raga":1, "tala":1, "laya":1, "gharana":1, "makam":1, "usul":1}){
				tagList(responseText, field, collection);
			}
		},
		"text"
	);

}

function generateList(head, bodylist)
{
	/*
	 * This funtion generates a html list of given content.
	 * The list looks like a playlist.
	 *
	 * It expects the "head" argument to contain the values to be filled in
	 * the first row of the table. the "bodylist" argument should contain a set of
	 * arrays each of same length, having values for each row in the table.
	 */

	htmlText = "<table id='content_list' class='tablesorter' cellspacing='0px' cellpadding='5px'>\n<thead>\n<tr>\n";
	/*col_width = Math.floor(100.0/head.length);
	window.alert(col_width);*/
	for (i=0 ; i<head.length ;i++){
		htmlText = htmlText + '<th>'+head[i]+"</th>\n";
	}
	htmlText = htmlText + "</tr>\n</thead>\n<tbody>\n";
	
	for (i=0 ; i<bodylist.length ;i++){
		if (i%2 == 0){
			htmlText = htmlText + "<tr class='even'>\n";
		}else{
			htmlText = htmlText + "<tr class='odd'>\n";
		}
		for (j=0 ; j<bodylist[i].length ; j++){
			htmlText = htmlText + "<td>"+bodylist[i][j]+"</td>\n";
		}
		htmlText = htmlText + "</tr>\n";
	}
	htmlText = htmlText + "</tbody>\n</table>\n";
	return htmlText;
}

function generateTable(head, bodylist){
	/*
	 * This funtion generates a html list of given content.
	 * The list looks like a playlist.
	 *
	 * It expects the "head" argument to contain the values to be filled in
	 * the first row of the table. the "bodylist" argument should contain a set of
	 * arrays each of same length, having values for each row in the table.
	 */
	
	htmlText = '<div id="field_search">\n\t\t<input type="text" id="search_field" name="search_field"></input></div>\n';

	htmlText = htmlText + "<table id='field_table' class='tablesorter' cellspacing='0px' cellpadding='5px'>\n<thead>\n<tr>\n";
	for (i=0 ; i<head.length ;i++){
		htmlText = htmlText + "<th>"+head[i]+"</th>\n";
	}
	htmlText = htmlText + "</tr>\n</thead>\n<tbody>\n";

	for (i=0 ; i<bodylist.length ;i++){
		if (i%2 == 0){
			htmlText = htmlText + "<tr class='even rowhover'>\n";
		}else{
			htmlText = htmlText + "<tr class='odd rowhover'>\n";
		}
		for (j=0 ; j<bodylist[i].length ; j++){
			htmlText = htmlText + "<td>"+bodylist[i][j]+"</td>\n";
		}
		htmlText = htmlText + "</tr>\n";
	}
	htmlText = htmlText + "</tbody>\n</table>\n";
	return htmlText;
}

function generateTiles(head, bodylist, field, uuids, collection){
	/*
	 * This function generates html content that replaces the content_info div.
	 * head = ["artist", "recordings", "releases", "instruments"]
	 * bodylist = [["M S Subbulakshmi", 219, 20, "vocal"], ["Malladi Brothers", 121, 10, "vocal"]]
	 * The main element (eg: artist name in case of artist-list) should be the first
	 * element.
	 */
	
	/*
	htmlText = "<table class='tiles'><thead><tr>"
	it = Iterator(head)
	for ([i, value] in it){
		htmlText = htmlText + "<th>"+value+"</th>"
		}
	htmlText = htmlText + "</tr></thead><tbody>"
	*/
	htmlText = "<table class='tiles' cellspacing='0px' cellpadding='5px' width=100%>";
	td_class = ["even", "odd"];
	callFunc = "performerInfo";
	if (field == "composer" || field == "lyricist"){
		callFunc = "composerInfo";
	}
	else if (field == "instrument" || field == "release" || field == "recording"){
		callFunc = field+"Info";
	}
	else if (field in {"raaga":1, "taala":1, "raga":1, "tala":1, "laya":1, "gharana":1, "makam":1, "usul":1}){
		callFunc = "tagInfo";
	}
	callFunc = "fillFilters"
	for (i=0 ; i<bodylist.length ;i++){
		if (i%3 == 0){
			htmlText = htmlText + "</tr><tr><td class='"+td_class[i%2]+"'>";
		}else{
			htmlText = htmlText + "</td><td class='"+td_class[i%2]+"'>";
		}
		for (j=0 ; j<bodylist[i].length ; j++){
			if (j == 0){
				//htmlText = htmlText + "<br /><h3><a href='#' onclick='"+callFunc+"(\""+uuids[i]+"\", \""+field+"\");'>" + head[j] + bodylist[i][j] + "</h3></a>";
				htmlText = htmlText + "<br /><h3><a href='#' onclick='"+callFunc+"(\""+uuids[i]+"\", \""+bodylist[i][j]+"\", \""+field+"\", \""+collection+"\");'>" + 
					head[j] + bodylist[i][j] + "</h3></a>";
				
			}else {
				htmlText = htmlText + "<br />" + head[j] + bodylist[i][j];
			}
		}
	}
	htmlText = htmlText + "</table>";
	return htmlText
}

/*
 * All the following *List functions take the server response and
 * extract necessary information that needs to filled in the content panel.
 */

function fillDialog(field, htmlText){
	//$("#dialog").dialog("open");
	$("#dialog").html(""); 
	$("#dialog").css("border", "none");
	$("#dialog").data("title.dialog", field); 
	$("#dialog").dialog("option", "title", field);
	$("#dialog").html(htmlText);
	//$("#content_recordings").html("");
}

function performerList(responseText, artistType, collection){
	/*This function handles the person type entities like performer, composer and lyricist. */
 	
	artistsData = JSON.parse(responseText);
	head = ["Artist", "Born", "Gender", "Releases", "Instruments"];
	bodylist = [];
	uuids = [];
	
	data = artistsData.performers;
	for (point in data){
		row = [];
		//row.push(data[point].name);
		row.push("<a class='content_link' href='#' onclick='fillFilters(\""+data[point].uuid+"\", \""+data[point].name+"\", \"performer\", \""+collection+"\");'>" + 
					data[point].name+"</a>");
		row.push(data[point].birthdate);
		row.push(data[point].gender);
		row.push("<i>"+data[point].releases+"</i>");
		if (data[point].instruments == 0){
			row.push("<i>None</i>");
		}else {
			inst = wordToUpper(data[point].instruments[0].attribute);
			for (i=1 ; i<data[point].instruments.length ; i++){
				inst = inst+", "+wordToUpper(data[point].instruments[i].attribute);
			}
			row.push("<i>"+inst+"</i>");
		}
		//row.push("<a href='#'><img src='./media/img/filter.png' height=16px /></a>");
		bodylist.push(row);
		uuids.push(data[point].uuid);
	}
	
	//htmlText = generateTiles(head, bodylist, artistType, uuids, collection);
	htmlText = generateTable(head, bodylist);
	//$("#content_querybag").html(htmlText);
	//$("#content_recordings").html("");
	fillDialog("Performers", htmlText);
	enableFieldTable();
	$("#field_table").tablesorter({debug: true, widgets: ['reorganizeList'] });
}

function composerList(responseText, artistType, collection){
	/*This function handles the person type entities like performer, composer and lyricist. */
	artistsData = JSON.parse(responseText);
	head = [wordToUpper(artistType), "Born", "Gender", "Works"];
	bodylist = [];
	uuids = [];
	data = "";
	if (artistType == "composer"){
		data = artistsData.composers;
	}
	else if (artistType == "lyricist"){
		data = artistsData.lyricists;
	}
	
	for (point in data){
		row = [];
		//row.push(data[point].name);
		row.push("<a class='content_link' href='#' onclick='fillFilters(\""+data[point].uuid+"\", \""+data[point].name+"\", \""+artistType+"\", \""+collection+"\");'>" + 
					data[point].name+"</a>");
		row.push(data[point].birthdate);
		row.push(data[point].gender);
		row.push("<i>"+data[point].works.length+"</i>");
		//row.push("<a href='#'><img src='./media/img/filter.png' height=16px /></a>");
		bodylist.push(row);
		uuids.push(data[point].uuid);
	}
	//htmlText = generateTiles(head, bodylist, artistType, uuids, collection);
	htmlText = generateTable(head, bodylist);
// 	$("#content_querybag").html(htmlText);
	//$("#content_recordings").html("");
	fillDialog(plural(wordToUpper(artistType)), htmlText);
	enableFieldTable();
	$("#field_table").tablesorter({debug: true, widgets: ['reorganizeList'] });
}

function workList(responseText, workType, collection){
	/*This function handles the works. */
	worksData = JSON.parse(responseText);
	head = ["Work", "Composer", "Lyricist"];
	bodylist = [];
	uuids = [];
	for (point in worksData.works){
		row = [];
		//row.push(worksData.works[point].title);
		row.push("<a class='content_link' href='#' onclick='fillFilters(\""+worksData.works[point].uuid+"\", \""+worksData.works[point].title+"\", \"work\", \""+collection+"\");'>" + 
					worksData.works[point].title+"</a>");
		composer = "";
		lyricist = "";
		for (artist in worksData.works[point].artists){
			//row.push(worksData.works[point].artists[artist].relation+": "+worksData.works[point].artists[artist].name);
			//row.push(worksData.works[point].artists[artist].relation+": "+worksData.works[point].artists[artist].name);
			if (worksData.works[point].artists[artist].relation == "composer"){
				composer = worksData.works[point].artists[artist].name;
			}else if (worksData.works[point].artists[artist].relation == "lyricist"){
				lyricist = worksData.works[point].artists[artist].name;
			}
			//window.alert(row);
		}
		row.push(composer);
		row.push(lyricist);
		//window.alert(yemal);
		uuids.push(worksData.works[point].uuid);
		bodylist.push(row);
	}
	//htmlText = generateTiles(head, bodylist, "work", uuids, collection);
	htmlText = generateTable(head, bodylist);
	//$("#content_querybag").html(htmlText);
	//$("#content_recordings").html("");
	fillDialog("Works", htmlText);
	enableFieldTable();
	$("#field_table").tablesorter({debug: true, widgets: ['reorganizeList'] });
	
}

function instrumentList(responseText, instrumentType, collection){
	/*This function handles the instruments. */
	instrumentsData = JSON.parse(responseText);
	head = ["Instrument", ""];
	bodylist = [];
	var instruments = [];
	for (point in instrumentsData.instruments){
		row = [];
		row.push("<a class='content_link' href='#' onclick='fillFilters(\""+instrumentsData.instruments[point].name+"\", \""+instrumentsData.instruments[point].name+"\", \"instrument\", \""+collection+"\");'>"+
			 '<img src="./media/img/instruments/'+collection+'/'+instrumentsData.instruments[point].name+'.png" height="100"/>'+"</a>");
		row.push("<a class='content_link' href='#' onclick='fillFilters(\""+instrumentsData.instruments[point].name+"\", \""+instrumentsData.instruments[point].name+"\", \"instrument\", \""+collection+"\");'>"+
			 instrumentsData.instruments[point].name+"</a>");
		instruments.push(instrumentsData.instruments[point].name);
		//row.push("<a href='#'><img src='#' height=32px /></a>");
		bodylist.push(row);
	}
	//htmlText = generateTiles(head, bodylist, "instrument", instruments, collection);
	htmlText = generateTable(head, bodylist);
	//$("#content_querybag").html(htmlText);
	//$("#content_recordings").html("");
	fillDialog("Instruments", htmlText);
	enableFieldTable();
	$("#field_table").tablesorter({debug: true, widgets: ['reorganizeList'] });
	
}

function formList(responseText){
	// Future work
	return
}

function recordingList(responseText, recordingType, collection){
	/*This function handles the recordings list. */
	recordingsData = JSON.parse(responseText);
	head = ["", "Title", "Artist", "Release"];
	uuids = [];
	bodylist = [];
	for (point in recordingsData.recordings){
		row = [];
		row.push("<a href='#' onclick='fillFilters(\""+recordingsData.recordings[point].uuid+
		"\", \""+recordingsData.recordings[point].title+"\", \"recording\");'><img src='./media/img/greensearch1.png' height='24'/></a>");
		row.push(recordingsData.recordings[point].title);
		row.push(recordingsData.recordings[point].artist.name);
		row.push(recordingsData.recordings[point].release.title);
		uuids.push(recordingsData.recordings[point].uuid);
		bodylist.push(row);
	}
	//initializeContent();
	htmlText = generateList(head, bodylist, "recording", uuids);
	//$("#content_querybag").empty();
	//$("#content_recordings").html(htmlText);
	fillDialog("Recording", htmlText);
}

function releaseList(responseText, releaseType, collection){
	/*This function handles the recordings list. */
	releasesData = JSON.parse(responseText);
	head = ["Release", "Artist"];
	uuids = [];
	bodylist = [];
	for (point in releasesData.releases){
		row = [];
		//row.push(releasesData.releases[point].title);
		row.push("<a class='content_link' href='#' onclick='fillFilters(\""+releasesData.releases[point].uuid+"\", \""+releasesData.releases[point].title+"\", \"release\", \""+collection+"\");'>" + 
					releasesData.releases[point].title+"</a>");
		row.push(releasesData.releases[point].artist.name);
		uuids.push(releasesData.releases[point].uuid);
		bodylist.push(row);
	}
	//htmlText = generateTiles(head, bodylist, "release", uuids, collection);
	htmlText = generateTable(head, bodylist);
	//$("#content_querybag").html(htmlText);
	//$("#content_recordings").html("");
	fillDialog("Releases", htmlText);
	enableFieldTable();
	$("#field_table").tablesorter({debug: true, widgets: ['reorganizeList'] });
	
}

function tagList(responseText, tagType, collection){
	/*This function handles the recordings list. */
	tagsData = JSON.parse(responseText);
	key = Object.keys(tagsData)[0];
	tagids = [];
	var keys = new Array();
	head = [tagType];
	if (typeof tagsData[key] == "object"){ // check that json file is not giving an empty result
		bodylist = [];
		for (point in tagsData[key]){
			row = [];
			if (!keys[tagsData[key][point].tag]){
				//row.push(tagsData[key][point].tag);
				keys[tagsData[key][point].tag] = 1;
				tagids.push(tagsData[key][point].tag);
				row.push("<a class='content_link' href='#' onclick='fillFilters(\""+tagsData[key][point].tag+"\", \""+tagsData[key][point].tag+"\", \""+tagType+"\", \""+collection+"\");'>" + 
					tagsData[key][point].tag+"</a>");
				bodylist.push(row);
			}
			
			//row.push(tagsData[key][point].tag);
			
		}
		//htmlText = generateTiles(head, bodylist, tagType, tagids, collection);
		htmlText = generateTable(head, bodylist);
		//$("#content_querybag").html(htmlText);
		//$("#content_recordings").html("");
		fillDialog(wordToUpper(key), htmlText);
		enableFieldTable();
		$("#field_table").tablesorter({debug: true, widgets: ['reorganizeList'] });
	}
}


/*
 * Functions for left panel.
 */

function generateFields(responseText, collection) {
	fieldsData = JSON.parse(responseText);
	//htmlText = "<div class='spanning_title'>Fields</div>";
	//htmlText = htmlText+"<div id='slider_"+collection+"'></div>";
	//htmlText = htmlText+"<table class='filters_menu'>";
	htmlText = '<div class="filters">';
	//$("#slider_"+collection).slider();

	count = 1
	for (field in fieldsData.common) {
		url = "/"+plural(fieldsData.common[field])+"/collection/"+collection;
		htmlText = htmlText+"<a href='#' onclick=\"fetchInfo('"+url+"', '"+fieldsData.common[field]+"', '"+collection+"')\">";
		htmlText = htmlText+wordToUpper(fieldsData.common[field])+"</a>";
		if (count >= 2) {
			count = 1;
			htmlText = htmlText+"<br/>";
			continue
		}
		count += 1
	}
	//htmlText = htmlText+"</tr></table>";
	htmlText = htmlText+"</div>";
	//htmlText = htmlText+"<div class='spanning_title'>Specific fields</div>";
	htmlText = htmlText+'<div class="filters">';;
	count = 1
	for (field in fieldsData.specific) {
		url = "/" + fieldsData.specific[field];
		//window.alert(url);
		htmlText = htmlText+"<a href='#' onclick=\"fetchInfo('"+url+"', '"+fieldsData.specific[field]+"', '"+collection+"')\">";
		htmlText = htmlText+wordToUpper(fieldsData.specific[field])+"</a>";
		//  htmlText = htmlText+"<td class='myButton'><a href='#'>"+wordToUpper(fieldsData.specific[field])+"</a></td>";
		if (count >= 2) {
			count = 1;
			htmlText = htmlText+"<br/>";
			continue
		}
		count += 1;
	}
	htmlText = htmlText + "</div>";
	//window.alert(htmlText);
	return htmlText;
}

function createTips(collection){
	$(".element").each(function(){
		var str_func = "";
		if ($(this).attr('elem') == "recording")
			str_func = "fillRecordingDetails";
		else if ($(this).attr('elem') == "performer")
			str_func = "fillArtistDetails";
		else if ($(this).attr('elem') == "release")
			str_func = "fillReleaseDetails";
		var str_content = "<a href='#' onclick='"+str_func+"(\""+$(this).attr('valueid')+"\", \""+$(this).attr('value')+
			"\", \""+collection+"\");'>Info</a> |" +
			" <a href='#' onclick='fillFilters(\""+$(this).attr('valueid')+"\", \""+$(this).attr('value')+
			"\", \""+$(this).attr('elem')+"\", \""+collection+"\");'> Query</a>"
		$(this).qtip({
			content: str_content, // Give it some content
			position: 'center', // Set its position
			show: {
				when: {event: 'click'},
				delay: 10
			},
			hide: {
				fixed: true // Make it fixed so it can be hovered over
			},
			style: {
				padding: '5px 15px', // Give it some extra padding
				name: 'light' // And style it with the preset dark theme
			}
		});
	});
}


function fillContent(url, collection){
	//window.alert("/recordings"+url);
	var specific_fields = getSpecificFields(collection);
	//window.alert(specific_fields[0]);
	specific_fields_content = new Array();
	$.ajax({
		url: "/recordings"+url,
		dataType: 'text',
		async: false,
		success: function(responseText){
			//$("#content_querybag").html("");
			$("#content_main").html(ajaxLoad);
			recordings = JSON.parse(responseText);
			head = ["Title", "Artist", "Release", wordToUpper(specific_fields[0]), wordToUpper(specific_fields[1])];
			bodylist = [];
			
			for (point in recordings.recordings){
				row = [];
				/*row.push("<span class='add_to_playlist' id='"+recordings.recordings[point].uuid+
				"' name='"+recordings.recordings[point].artist.name+
				"' title='"+recordings.recordings[point].title+
				"'><img src='./media/img/add_to_playlist.png' height=12px /></span> "+"<a class='content_link' href='#' onclick='fillFilters(\""+recordings.recordings[point].uuid+"\", \""+recordings.recordings[point].title+"\", \"recording\", \""+collection+"\");'>" + 
					recordings.recordings[point].title+"</a>");*/
				row.push("<span class='add_to_playlist' id='"+recordings.recordings[point].uuid+
				"' name='"+recordings.recordings[point].artist.name+
				"' title='"+recordings.recordings[point].title+
				"'><img src='./media/img/add_to_playlist.png' height='12' title='Add to playlist'/></span>"+
				" <span class='element' elem='recording' valueid='"+recordings.recordings[point].uuid+
				"' value='"+recordings.recordings[point].title+"'>"+recordings.recordings[point].title+"</span>");
				/*" <a class='content_link' href='#' onclick='fillRecordingDetails(\""+recordings.recordings[point].uuid+"\", \""+recordings.recordings[point].title+"\", \""+collection+"\");'>"+
				"<img src='./media/img/info.png' width='14' title='Info'/>"+"</a>"+
				" <a class='content_link' href='#' onclick='fillFilters(\""+recordings.recordings[point].uuid+"\", \""+recordings.recordings[point].title+"\", \"recording\", \""+collection+"\");'>"+
				"<img src='./media/img/search.png' width='14' title='Add to query'/>"+"</a>"+
				" ");*/
				
				row.push("<span class='element' elem='performer' valueid='"+recordings.recordings[point].artist.uuid+
				"' value='"+recordings.recordings[point].artist.name+"'>"+recordings.recordings[point].artist.name+"</span>");
				/*row.push(recordings.recordings[point].artist.name +
					" <a class='content_link' href='#' onclick='fillArtistDetails(\""+recordings.recordings[point].artist.uuid+"\",\
					\""+recordings.recordings[point].artist.name+"\", \""+collection+"\");'>"+
					"<img src='./media/img/info.png' width='14' title='Info'/></a>" +
					" <a class='content_link' href='#' onclick='fillFilters(\""+recordings.recordings[point].artist.uuid+"\", \""+
					recordings.recordings[point].artist.name+"\", \"performer\", \""+collection+"\");'>" +
					"<img src='./media/img/search.png' width='14' title='Add to query'/></a>");*/
				row.push("<span class='element' elem='release' valueid='"+recordings.recordings[point].release.uuid+
				"' value='"+recordings.recordings[point].release.title+"'>"+recordings.recordings[point].release.title+"</span>");
				/*
				row.push(recordings.recordings[point].release.title +
					" <a class='content_link' href='#' onclick='fillReleaseDetails(\""+recordings.recordings[point].release.uuid+"\",\
					\""+recordings.recordings[point].release.title+"\", \""+collection+"\");'>"+
					"<img src='./media/img/info.png' width='14' title='Info'/></a>" +
					" <a class='content_link' href='#' onclick='fillFilters(\""+recordings.recordings[point].release.uuid+"\", \""+recordings.recordings[point].release.title+"\", \"release\", \""+collection+"\");'>" + 
					"<img src='./media/img/search.png' width='14' title='Add to query'/></a>");*/
				for (i=0; i<2; i++){
					specific_fields_content[specific_fields[i]] = [];
				}
				if (typeof recordings.recordings[point].tags != 'undefined'){
					for (tag in recordings.recordings[point].tags){
						if (recordings.recordings[point].tags[tag].category in specific_fields_content){
							//window.alert(recordings.recordings[point].tags[tag].category);
							specific_fields_content[recordings.recordings[point].tags[tag].category].push(recordings.recordings[point].tags[tag].tag);
						}
					} 
				}
				// process specific fields
				for (i=0; i<2; i++){
					str_content = "";
					var items = specific_fields_content[specific_fields[i]];
					for (j=0; j<items.length; j++){
						str_content += "<a class='content_link' href='#' onclick='fillFilters(\""+items[j]+"\", \""+items[j]+"\", \""+specific_fields[i]+"\", \""+collection+"\");'>" + 
						items[j] + "</a>,"
					}
					row.push(str_content);
					//if (str_content != ""){window.alert(str_content);}
				}
				
				bodylist.push(row);
			}
			htmlText = generateList(head, bodylist);
			//window.alert(htmlText);
			$("#content_main").html(htmlText);
			$("#content_main").css({'overflow-y': 'auto', 'height': '66%'});
			createTips(collection);
		},
	});
	
}


function fillFilters(uuid, field, fieldType, collection){
	//window.alert(uuid+": "+field+": "+fieldType+": "+collection);
	$("input#search_content").val("");
	filter_uuid = uuid.replace(" ", "__--__"); // problems with spaces in element ids
	htmlText = "<div class='filter_label' type='"+fieldType+"' id='filter_"+filter_uuid+"' name='"+field+"' value='and'>\
	<div class='ui-icon ui-icon-close remove_filter' id='remove_filter_"+filter_uuid+"'></div>\
	<span class='filter_name'>"+fieldType+":<br/>"+field+"</span><br/>\
	<table class='testable'><tr>\
	<td name='filter_option' value='and' class='filter_option_checked'>And</td>\
	<td name='filter_option' value='or'>Or</td>\
	<td name='filter_option' value='not'>Not</td>\
	</tr></table></div>";
	$("#content_querybag").append(htmlText);
	url = "";
	$(".filter_label").removeClass("filter_focus");
	$(".filter_label").each(function (i) {
		filter_id = $(this).attr("id");
		filter_id = filter_id.substr(filter_id.indexOf("_")+1);
		url_filter_id = filter_id.replace("__--__", " ");
		url += "/" + $(this).attr("type") + "/" + url_filter_id + "/filter=" + $(this).attr("value"); 
		//window.alert(url);
	});
	url += "/collection/"+collection;
	initializeContent();
	$("#dialog").dialog("close");
	fillContent(url, collection);
	enableSearchTable();
	$("#content_list").tablesorter({debug: true, widgets: ['reorganizeList'] });
}

function updateFilters(collection){
	url = "";
	$(".filter_label").each(function (i) {
		filter_id = $(this).attr("id");
		filter_id = filter_id.substr(filter_id.indexOf("_")+1);
		filter_type = $(this).attr("type");
		url_filter_id = filter_id.replace("__--__", " ");
		filter_name = $(this).attr("name");
		url += "/" + filter_type + "/" + url_filter_id + "/filter=" + $(this).attr("value"); 
		//window.alert(url);
	});
	url += "/collection/"+collection;
	initializeContent();
	$("#dialog").dialog("close");
	fillContent(url, collection);
	$("#content_list").tablesorter({debug: true, widgets: ['reorganizeList'] }); 
}

function removeFilterFocus(){
	$(".filter_label").each(function (i) {
		filtid = $(this).attr("id");
		filtid = filter_id.substr(filter_id.indexOf("_")+1);
		$("#filter_"+filtid).removeClass("filter_focus");
	});
}


/*
 * These following functions handle the calls form the second
 * level clicks.
 */