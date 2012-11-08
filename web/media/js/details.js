
function wordToUpper(strSentence) { // Repeated function
	function convertToUpper() {
		return arguments[0].toUpperCase();
	}
	return strSentence.toLowerCase().replace(/\b[a-z]/g, convertToUpper);
}

function secondsToHms(d) {
	d = Number(d);
	var h = Math.floor(d / 3600);
	var m = Math.floor(d % 3600 / 60);
	var s = Math.floor(d % 3600 % 60);
	return ((h > 0 ? h + ":" : "") + (m > 0 ? (h > 0 && m < 10 ? "0" : "") + m + ":" : "0:") + (s < 10 ? "0" : "") + s);
}

if (typeof String.prototype.startsWith != 'function') {
  String.prototype.startsWith = function (str){
    return this.slice(0, str.length) == str;
  };
}

function getCountryCodes(){/*
	country_codes = new Array();
	$.ajax({url: "./media/js/country_codes.json", 
		dataType: 'json',
		async: false,
		success: function(data){
			for (key in data){
				country_codes[key] = data[key];
			}
		}
	});
	return country_codes;*/
	country_codes = new Array();
	country_codes["tr"] = "Turkey";
	country_codes["in"] = "India";
	return country_codes;
}

function wikipediaHTMLResult(data, container){
	htmlText = data.parse.text['*'];
	htmlText = htmlText.replace(new RegExp('<a ', 'g'), '<a target="_blank" ');
	htmlText = htmlText.replace(new RegExp('"\/\/', 'g'), '"http://');
	htmlText = htmlText.replace(new RegExp('"\/w\/', 'g'), '"http://en.wikipedia.org/w/');
	htmlText = htmlText.replace(new RegExp( '"\/wiki\/', 'g'), '"http://en.wikipedia.org/wiki/');
	window.alert(container);
	$("#"+container).html(htmlText);
}

function getWikipediaLink(field, fieldType){
	wiki_url = "";
	$.ajax({url: "./media/js/wikipedia_dictionary.json", 
		dataType: 'json',
		async: false,
		success: function(data){
			if (data[fieldType] != null && data[fieldType][field] != null){
				wiki_url = data[fieldType][field];
			}
		}
	});
	return wiki_url;
}

function getWikipediaPage(field, fieldType, container){
	$("#"+container).empty();
	wiki_url = "";
	wiki_base_url = "en.wikipedia.org";
	$.ajax({url: "./media/js/wikipedia_dictionary.json", 
		dataType: 'json',
		async: true,
		success: function(data){
			if (data[fieldType] != null && data[fieldType][field] != null){
				wiki_url = data[fieldType][field];
				if(wiki_url.length > 1){
					wiki_api_url = "http://en.wikipedia.org/w/api.php?action=parse&format=json&page="+wiki_url.substr(1)+"&prop=text&redirects&callback=?";
					if (wiki_url.startsWith("http://tr")){
						var last_slash=wiki_url.lastIndexOf("/");
						wiki_api_url  = "http://tr.wikipedia.org/w/api.php?action=parse&format=json&page="+wiki_url.substr(last_slash+1)+"&prop=text&redirects&callback=?";
						wiki_base_url = "tr.wikipedia.org";
					}
					$.ajax({url: wiki_api_url, 
						dataType: 'json',
						async: true,
						error: function(jqXHR, textStatus, errorThrown){
							window.alert(errorThrown);
						},
						beforeSend: function (data){
							$("#"+container).html('<div id="loading"><img src="./media/img/ajax_loader_large.gif" height="80" /></div>'); 
						},
						success: function(data){
							htmlText = data.parse.text['*'];
							htmlText = htmlText.replace(new RegExp('<a ', 'g'), '<a target="_blank" ');
							htmlText = htmlText.replace(new RegExp('"\/\/', 'g'), '"http://');
							htmlText = htmlText.replace(new RegExp('"\/w\/', 'g'), '"http://'+wiki_base_url+'/w/');
							htmlText = htmlText.replace(new RegExp( '"\/wiki\/', 'g'), '"http://'+wiki_base_url+'/wiki/');
							$("#"+container).html(htmlText);
						}
					});
				}else{
					$("#"+container).html('There is no wikipedia entry for '+field+'. Would you like to <a href="http://en.wikipedia.org/w/index.php?title='+field+'&action=edit">create it</a>?');
				}
			}
			else{
				$("#"+container).html('There is no wikipedia entry for '+field+'. Would you like to <a href="http://en.wikipedia.org/w/index.php?title='+field+'&action=edit">create it</a>?');
			}
			$("#"+container).css({'overflow-y': 'auto'});
		}
	});
}

function __fillRecordingReleaseInfo(release_id, collection){
	var release_items_order = new Array("artist", "title", "status", "date");
	recording_release_cover = "<div id='recording_release_cover'><img src='./media/img/"+collection+".jpg' width='70%'/></div>";
	release_metadata = "<table class='details'>\n<thead>\n<tr>\n<th colspan='2'>Release Information</th>\n</tr>\n</thead>\n<tbody>";
	var release_items = new Array();
	$.ajax({
		url: "/release/"+release_id,
		dataType: 'json',
		async: true,
		success: function(release){
			row_class = "even";
			for (key in release.release){
				value = "";
				if (release.release[key].hasOwnProperty('name')){
					value = release.release[key].name;
				}else{
					value = release.release[key];
				}
				release_items[key] = value;
			}
			for (i=0; i<release_items_order.length; i++){
				key = release_items_order[i];
				if (release_items.hasOwnProperty(key)){
					release_metadata += "<tr class='"+row_class+"'>\n<td class='rowheader'>"+wordToUpper(key)+"</td>\n<td>"+release_items[key]+"</td>\n</tr>\n";
					if (row_class == 'even')
						row_class = 'odd';
					else
						row_class = 'even';
				}
			}
			release_metadata += "</tbody>\n</table>";
			$("#recording_release_info").html(recording_release_cover + "\n" + release_metadata);
		}
	});
	
}


function __fillRecordingDetails(recording_id, collection){
	recording_metadata = "<table class='details recording_metadata'>\n<thead>\n<tr>\n<th colspan='2'>Editorial Metadata</th> \
        </tr>\n<thead>\n<tbody>";
	/*recording_tags = "";*/
	release_id = "";
	recording_performers = "";
	var recording_items = new Array();
	var recording_tags = new Array();
	var recording_items_order = new Array("artist", "title", "release", "length", "work");
	$.ajax({
		url: "/recording/"+recording_id,
		dataType: 'json',
		async: true,
		success: function(recording){
			row_class = "odd";
			artists_row_class = "even";
			for (key in recording.recording){
				if (key == 'tags'){
					for (tag in recording.recording[key]){
						if (! recording_tags.hasOwnProperty(recording.recording[key][tag].category)){
							recording_tags[recording.recording[key][tag].category] = [];
						}
						recording_tags[recording.recording[key][tag].category].push(recording.recording[key][tag].tag);
					}
					recording_tags[recording.recording[key][tag].category] = recording_tags[recording.recording[key][tag].category].join(', ');
				}else if (key == 'artists'){
					recording_performers = "<table class='details recording_performers'>\n<thead>\n<tr>\n<th>Performers</th>\n<th>Instrument</th> \
							<th>Gharana</th>\n<th>Guru</th>\n</tr>\n</thead>\n<tbody>";
					for (artist in recording.recording[key]){
						recording_performers += "<tr class='"+artists_row_class+"'>\n<td>"+recording.recording[key][artist].name+
						"</td>\n<td>"+recording.recording[key][artist].relation.attribute+"</td>\n<td>&nbsp;</td>\n<td>&nbsp;</td>\n</tr>";
						if (artists_row_class == 'even')
							artists_row_class = 'odd';
						else
							artists_row_class = 'even';
					}
					recording_performers += "</tbody>\n</table>";					
				}else{
					value = "";
					if (recording.recording[key].hasOwnProperty('title')){
						//window.alert(key+", "+recording.recording[key].title);
						value = recording.recording[key].title;
					}else if (recording.recording[key].hasOwnProperty('name')){
						value = recording.recording[key].name;
					}else{
						value = recording.recording[key];
					}
					recording_items[key] = value;
					if (key == "release"){
						release_id = recording.recording[key].uuid;
						__fillRecordingReleaseInfo(release_id, collection);
					}
					
				}
			}
			// FILL editorial metadata
			for (i=0; i<recording_items_order.length; i++){
				key = recording_items_order[i];
				if (recording_items.hasOwnProperty(key)){
					if (row_class == 'even')
						row_class = 'odd';
					else
						row_class = 'even';
					value = recording_items[key];
					if (key == 'length'){
						value = secondsToHms(parseFloat(value)/1000);
					}
					recording_metadata += "<tr class='"+row_class+"'>\n<td class='rowheader'>"+wordToUpper(key)+"</td>\n<td>"+value+"</td>\n</tr>\n";
				}
				
			}
			for (key in recording_tags){
				if (row_class == 'even')
					row_class = 'odd';
				else
					row_class = 'even';
				recording_metadata += "<tr class='"+row_class+"'>\n<td class='rowheader'>"+wordToUpper(key)+"</td>\n<td>"+recording_tags[key]+"</td>\n</tr>\n";
			}
			//window.alert(data);
			recording_metadata += "</tbody>\n</table>";
			$("#recording_info").html(recording_metadata + "\n" + recording_performers);
		}
	});
}


function __fillRecordingAudioDetails(recording_id, collection){
	/*var content = '<div class="audio_feature" id="pitch_track"><div class="audio_feature_title">Pitch Track</div><div class="audio_feature_image"><img src="./media/img/'+collection+'_pitch_track.png" width="95%"></div></div>';
	content += '<div class="audio_feature" id="onset"><div class="audio_feature_title">Onset</div><div class="audio_feature_image"><img src="./media/img/'+collection+'_onset.png" width="95%"></div></div>';
	content += '<div class="audio_feature" id="amplitude"><div class="audio_feature_title">Amplitude</div><div class="audio_feature_image"><img src="./media/img/'+collection+'_amplitude.png" width="95%"></div></div>';*/
	
	var content = '<div id="repoVizzVisualizerDiv" style="position: absolute; top: 60px; left: 0px; right: 0px; bottom: 0px; background-color: black;">\
      <table border="0" cellpadding="0" cellspacing="0" style="vertical-align:top;" onselectstart="return false;" ondragstart="return false;">\
        <tr style="vertical-align:top;">\
          <td style="vertical-align:top;">\
            <table id="canvas-table" border="0" cellpadding="0" cellspacing="0" style="vertical-align:top;" onselectstart="return false;" ondragstart="return false;">\
            </table>\
          </td>\
        </tr>\
      </table>\
    </div>\n\
    <div id="General_Tooltip" style="position: absolute; top: 0px; left:0px; z-index:3; font-family:Arial; font-size:10px; line-height: 11px; text-align: left; padding: 5px" onselectstart="return false;" ondragstart="return false;">\
    </div>\n\
    <canvas id="general_tooltip_canvas" onselectstart="return false;" ondragstart="return false;"></canvas>\
    <style type="text/css">\
      #systemOut { position: fixed; bottom: 0px; left: 0px; height: 14px; background-color: grey; font-size:8px; }\
    </style>\
    <div id ="systemOut"> </div>';
	
	$("#recording_audio_details").html(content);
	$("#recording_audio_details").css({'overflow-y': 'auto', 'height': '100%'});
	readyCallbackRepoVizz(recording_id);
	redrawAll();
}

function fillRecordingDetails(recording_id, recording_title, collection){
	var goback = '<div id="back"><a href="#" id="back_href"><img src="./media/img/arrow_left.png" width="24"/><br/><span>Back</span></a></div>';
	$("#hidden_content").html($("#content_querybag").html());
	$("#hidden_content").hide();
	$("#content").html('<div id="content_details">'+goback+'<div id="item_details"></div></div>');
	var ul ='<ul>\
		<li><a href="#recording_details">Details</a></li>\
		<li><a href="#recording_audio_details" id="link_recording_audio_details">Audio analysis</a></li>\
		<li><a href="#recording_similar_recordings">Discover</a></li>\
		</ul>';
	htmlText = "<div id='recording_details'>\n<div id='recording_info'></div>\n<div id='recording_release_info'></div>\n</div>\
		<div id='recording_audio_details'></div>\
		<div id='recording_similar_recordings'>Discover similar recordings ordered by similarity distance</div>";
	
	$("#item_details").html(ul + "\n" + htmlText);
	$("#item_details").tabs();
	
	__fillRecordingDetails(recording_id, collection);
	__fillRecordingAudioDetails(recording_id, collection);
	$('#link_recording_audio_details').bind("click", function(){
                //window.alert("audio_details");
                redrawAll();
        });
}

function __fillPerformerArtistInfo(collection){
	$("#performer_cover").html("<img src='./media/img/"+collection+"_artist.jpg' width='100%'>");
}

function __fillPerformerDetails(artist_id, collection){
	performer_metadata = "<table class='details recording_metadata'>\n<thead>\n<tr>\n<th colspan='2'>Editorial Metadata</th> \
        </tr>\n<thead>\n<tbody>";
	performer_releases_metadata = "<table class='details performer_releases'>\n<thead>\n<tr>\n<th>Release</th>\n<th>Artist</th> \
				<th>Date</th>\n</thead>\n<tbody>";
	var performer_items = new Array();
	var performer_releases = [];
	var performer_items_order = new Array("name", "birthdate", "gender", "country");
	var performer_releases_order = new Array("title", "artist", "date");
	$.ajax({
		url: "/performer/"+artist_id,
		dataType: 'json',
		async: true,
		success: function(performer){

			for (key in performer.performer){
				if (key == 'releases'){
					for (i=0; i<performer.performer[key].length; i++){
						release = new Array();
						for (j=0; j<performer_releases_order.length; j++){ //TODO: improve code
							key2 = performer_releases_order[j];
							value2 = "";
							if (performer.performer[key][i].hasOwnProperty(key2)){
								if (key2 == "artist"){
									value2 = performer.performer[key][i][key2].name;
								}else{
									value2 = performer.performer[key][i][key2];
								}
								release[key2] = value2;
							}
						}
						if (performer.performer[key][i].hasOwnProperty('uuid')){
							release['uuid'] = performer.performer[key][i]['uuid'];
						}
						performer_releases.push(release);
					}
				}else if (key == 'aliases'){
					value = performer.performer[key].join(", ");
					//window.alert("Aliases: "+value);
					performer_items[key] = value;
				}else if (key == 'instruments'){
					value = performer.performer[key].join(", ");
					performer_items[key] = value;
					//window.alert("Instruments: "+value);
					/*
					for (i=0; i<performer.performer[key].length; i++){
						performer.performer[key]
					}*/
				}else{
					value = performer.performer[key];
					if (key == 'country'){
						//window.alert(performer.performer[key].toString());
						var str = performer.performer[key].toString();
						country_codes = getCountryCodes();
						value = country_codes[str.toLowerCase()];
					}
					performer_items[key] = value;
					
				}
			}
			//window.alert("Name: "+performer_items['name']);
			// FILL editorial metadata
			row_class = "odd";
			releases_row_class = "odd";
			for (i=0; i<performer_items_order.length; i++){
				key = performer_items_order[i];
				if (performer_items.hasOwnProperty(key)){
					if (row_class == 'even')
						row_class = 'odd';
					else
						row_class = 'even';
					value = performer_items[key];
					if (key == 'name'){
						performer_metadata += "<tr class='"+row_class+"'>\n<td class='rowheader'>"+wordToUpper(key)+"</td>\n<td>"+value+
						" <a href='http://musicbrainz.org/artist/"+performer_items['uuid']+"'><img src='./media/img/musicbrainz.png' height='14'/></a></td>\n</tr>\n";
					}else{
						performer_metadata += "<tr class='"+row_class+"'>\n<td class='rowheader'>"+wordToUpper(key)+"</td>\n<td>"+value+"</td>\n</tr>\n";
					}
				}
			}
			for (i=0; i<performer_releases.length; i++){
				performer_releases_metadata += "<tr class='"+releases_row_class+"'>\n";
				for(j=0; j<performer_releases_order.length; j++){
					key = performer_releases_order[j];
					if (performer_releases[i].hasOwnProperty(key)){
						if (releases_row_class == 'even')
							releases_row_class = 'odd';
						else
							releases_row_class = 'even';
						if (key == 'title'){
							performer_releases_metadata += "\n<td>"+performer_releases[i][key]+" <a href='http://musicbrainz.org/release/"+
								performer_releases[i]['uuid']+"'><img src='./media/img/musicbrainz.png' height='14'/></a></td>\n"
						}else{
							performer_releases_metadata += "\n<td>"+performer_releases[i][key]+"</td>\n";
						}
					}else{
						performer_releases_metadata += "\n<td>&nbsp;</td>\n";
					}
				}
				performer_releases_metadata += "</tr>\n";
			}
			performer_releases_metadata += "</tbody>\n</table>";
			performer_metadata += "</tbody>\n</table>";
			//window.alert(performer_metadata);
			$("#performer_info").html(performer_metadata);
			$("#performer_release_info").html(performer_releases_metadata);
			$("#performer_details").css({'height': '85%'});
			$("#performer_release_info").css({'overflow-y': 'auto', 'height': '60%'});
		}
	});
}

function __fillPerformerWikipediaDetails(artist_name){
	getWikipediaPage(artist_name, 'performer', 'performer_wiki');
}

function fillArtistDetails(artist_id, artist_name, collection){
	var goback = '<div id="back"><a href="#" id="back_href"><img src="./media/img/arrow_left.png" width="24"/><br/><span>Back</span></a></div>';
	$("#hidden_content").html($("#content_querybag").html());
	$("#hidden_content").hide();
	$("#content").html('<div id="content_details">'+goback+'<div id="item_details"></div></div>');
	var ul ='<ul>\
		<li><a href="#performer_details">Details</a></li>\
		<li><a href="#performer_wiki">Wikipedia</a></li>\
		</ul>';
	
	htmlText = "<div id='performer_details'>\n\
			<div id='performer_info_cover'>\n\
				<div id='performer_info'></div>\
				<div id='performer_cover'></div>\n\
			</div>\n\
			<div id='performer_release_info'></div>\n\
		</div>\
		<div id='performer_wiki'></div>";
	
	$("#item_details").html(ul + "\n" + htmlText);
	$("#item_details").tabs();
	__fillPerformerDetails(artist_id, collection);
	__fillPerformerArtistInfo(collection);
	__fillPerformerWikipediaDetails(artist_name);
}

function __fillReleaseRecordingDetails(release_id, collection){
	var recording_metadata = "<table class='details release_recordings'>\n<thead>\n<tr>\n<th>Artist</th>\n<th>Title</th> \
				<th>Length</th>\n<th>Work</th>\n</thead>\n<tbody>";
	var recording_items_order = new Array("artist", "title", "length", "work");
	var recording_items = []
	$.ajax({
		url: "/release/"+release_id+"/recordings",
		dataType: 'json',
		async: true,
		success: function(recordings){
			
			
			for (key in recordings.recordings){
				var recording = new Array();
				for (key2 in recordings.recordings[key]){
					value = "";
					if (recordings.recordings[key][key2].hasOwnProperty('title')){
						//window.alert(key+", "+recordings.recordings[key].title);
						value = recordings.recordings[key][key2].title;
					}else if (recordings.recordings[key][key2].hasOwnProperty('name')){
						value = recordings.recordings[key][key2].name;
					}else{
						value = recordings.recordings[key][key2];
					}
					recording[key2] = value;
				}
				recording_items.push(recording);
			}
			row_class = "odd";
			for (i=0; i<recording_items.length; i++){
				if (row_class == 'even')
					row_class = 'odd';
				else
					row_class = 'even';
				recording_metadata += "<tr class='"+row_class+"'>\n";
				for(j=0; j<recording_items_order.length; j++){
					key = recording_items_order[j];
					if (recording_items[i].hasOwnProperty(key)){
						if (key == 'title'){
							recording_metadata += "\n<td>"+recording_items[i][key]+" <a href='http://musicbrainz.org/recording/"+
								recording_items[i]['uuid']+"'><img src='./media/img/musicbrainz.png' height='14'/></a></td>\n";
						}else{
							value = recording_items[i][key];
							if (key == 'length')
								value = secondsToHms(parseFloat(value)/1000);
							recording_metadata += "\n<td>"+value+"</td>\n";
						}
					}else{
						recording_metadata += "\n<td>&nbsp;</td>\n";
					}
				}
				recording_metadata += "</tr>\n";
			}
			recording_metadata += "</tbody>\n</table>";
			$("#release_recording_info").html(recording_metadata);
			$("#release_details").css({'height': '85%'});
			$("#release_recording_info").css({'overflow-y': 'auto', 'height': '60%'});
		}
	});
}

function __fillReleaseDetails(release_id, collection){//TODO: release artits musicbrainz id does not work
	var release_items_order = new Array("artist", "title", "status", "date");
	release_metadata = "<table class='details'>\n<thead>\n<tr>\n<th colspan='2'>Release Information</th>\n</tr>\n</thead>\n<tbody>";
	var release_items = new Array();
	$.ajax({
		url: "/release/"+release_id,
		dataType: 'json',
		async: true,
		success: function(release){
			row_class = "even";
			for (key in release.release){
				value = "";
				if (release.release[key].hasOwnProperty('name')){
					value = release.release[key].name;
				}else{
					value = release.release[key];
				}
				release_items[key] = value;
			}
			for (i=0; i<release_items_order.length; i++){
				key = release_items_order[i];
				if (release_items.hasOwnProperty(key)){
					if (key == 'artist')
						release_metadata += "<tr class='"+row_class+"'>\n<td class='rowheader'>"+wordToUpper(key)+"</td>\n<td>"+release_items[key]+
							" <a href='http://musicbrainz.org/perfomer/"+release_items[key]['uuid']+"'><img src='./media/img/musicbrainz.png' height='14'/></a></td>\n</tr>\n";
					else
						release_metadata += "<tr class='"+row_class+"'>\n<td class='rowheader'>"+wordToUpper(key)+"</td>\n<td>"+release_items[key]+"</td>\n</tr>\n";
					if (row_class == 'even')
						row_class = 'odd';
					else
						row_class = 'even';
				}
			}
			release_metadata += "</tbody>\n</table>";
			$("#release_info").html(release_metadata);
			$("#release_cover").html("<img src='./media/img/"+collection+".jpg' width='70%'/>");
			__fillReleaseRecordingDetails(release_id, collection);
		}
	});
}

function fillReleaseDetails(release_id, release_title, collection){
	var goback = '<div id="back"><a href="#" id="back_href"><img src="./media/img/arrow_left.png" width="24"/><br/><span>Back</span></a></div>';
	$("#hidden_content").html($("#content_querybag").html());
	$("#hidden_content").hide();
	$("#content").html('<div id="content_details">'+goback+'<div id="item_details"></div></div>');
	var ul ='<ul>\
		<li><a href="#release_details">Details</a></li>\
		<li><a href="#release_more_info">More info</a></li>\
		</ul>';
	htmlText = "<div id='release_details'>\n\
			<div id='release_info_cover'>\n\
				<div id='release_info'></div>\
				<div id='release_cover'></div>\n\
			</div>\n\
			<div id='release_recording_info'></div>\n\
		</div>\
		<div id='release_more_info'>More info, think about what can be here</div>";
	
	$("#item_details").html(ul + "\n" + htmlText);
	$("#item_details").tabs();
	__fillReleaseDetails(release_id, collection);
}