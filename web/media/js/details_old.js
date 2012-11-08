
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

function __fillReleaseInfo(release_id, collection){
    release_cover = "<div id='release_cover'><img src='./media/img/"+collection+".jpg' width='70%'/></div>"
    release_metadata = "<table class='tablesorter'> \
        <thead> \
            <tr> \
                <th colspan='2'>Release Information</th> \
            </tr> \
        </thead> \
        <tbody> \
            <tr class='even'> \
                <td>Date</td> \
                <td>1995</td> \
            </tr> \
            <tr class='odd'> \
                <td>Country</td> \
                <td>India</td> \
            </tr> \
            <tr class='even'> \
                <td>Type</td> \
                <td>Live in Concert</td> \
            </tr> \
            <tr class='odd'> \
                <td>Format</td> \
                <td>Audio CD</td> \
            </tr> \
            <tr class='even'> \
                <td>Disk</td> \
                <td>2</td> \
            </tr> \
            <tr class='odd'> \
                <td>Label</td> \
                <td>Moment</td> \
            </tr> \
        </tbody> \
    </table>";
    $("#release_info").html(release_cover + "\n" + release_metadata);
}


function __fillRecordingDetails(recording_id, collection){
	recording_metadata = "<table class='tablesorter recording_metadata'>\n<thead>\n<tr>\n<th colspan='2'>Editorial Metadata</th> \
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
			row_class = "even";
			artists_row_class = "even";
			for (key in recording.recording){
				if (key == 'tags'){
					for (tag in recording.recording[key]){
						recording_tags[recording.recording[key][tag].category] = recording.recording[key][tag].tag;
					}
				}else if (key == 'artists'){
					recording_performers = "<table class='tablesorter recording_performers'>\n<thead>\n<tr>\n<th>Performers</th>\n<th>Instrument</th> \
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
				}else if (key != 'uuid'){
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
						__fillReleaseInfo(release_id, collection);
					}
					
				}
			}
			// FILL editorial metadata
			for (i=0; i<recording_items_order.length; i++){
				key = recording_items_order[i];
				if (recording_items.hasOwnProperty(key)){
					value = recording_items[key];
					if (key == 'length'){
						value = secondsToHms(parseFloat(value)/1000);
					}
					recording_metadata += "<tr class='"+row_class+"'>\n<td class='rowheader'>"+wordToUpper(key)+"</td>\n<td>"+value+"</td>\n</tr>\n";
				}
				if (row_class == 'even')
					row_class = 'odd';
				else
					row_class = 'even';
			}
			for (key in recording_tags){
				recording_metadata += "<tr class='"+row_class+"'>\n<td class='rowheader'>"+wordToUpper(key)+"</td>\n<td>"+recording_tags[key]+"</td>\n</tr>\n";
				if (row_class == 'even')
					row_class = 'odd';
				else
					row_class = 'even';
			}
			//window.alert(data);
			recording_metadata += "</tbody>\n</table>";
			$("#recording_info").html(recording_metadata + "\n" + recording_performers);
		}
	});
	

    /*recording_metadata = "<table class='tablesorter recording_metadata'> \
        <thead> \
        <tr> \
          <th colspan='2'>Editorial Metadata</th> \
        </tr> \
        <thead> \
        <tbody> \
        <tr class='even'> \
          <td class='rowheader'>Artist</td> \
          <td>Ravi Shankar</td> \
        </tr> \
        <tr class='odd'> \
          <td class='rowheader'>Concert</td> \
          <td>Concert for peace: Royal Albert hall</td> \
        </tr> \
        <tr class='even'> \
            <td class='rowheader'>Place </td> \
            <td>London</td> \
        </tr> \
        <tr class='odd'> \
            <td class='rowheader'>Year</td> \
            <td>1993</td> \
        </tr> \
        <tr class='even'> \
          <td class='rowheader'>Raga</td> \
          <td>Mishra Khamaj</td> \
        </tr> \
        <tr class='odd'> \
          <td class='rowheader'>Raga time</td> \
          <td>Evening</td> \
        </tr> \
        <tr class='even'> \
          <td class='rowheader'>Tala</td> \
          <td>Teental</td> \
        </tr> \
        <tr class='odd'> \
          <td class='rowheader'>Laya</td> \
          <td>Vilambit, Drut</td> \
        </tr> \
      </tbody> \
    </table>";
    
    var recording_performers = "<table class='tablesorter recording_performers'> \
        <thead> \
            <tr> \
                <th>Performers</th> \
                <th>Instrument</th> \
                <th>Gharana</th> \
                <th>Guru</th> \
            </tr> \
        </thead> \
        <tbody> \
            <tr class='even'> \
                <td>Ravi Shankar</td> \
                <td>Sitar</td> \
                <td>Maihar</td> \
                <td>Allaudin Khan</td> \
            </tr> \
            <tr class='odd'> \
                <td>Zakir Hussain</td> \
                <td>Tabla</td> \
                <td>Punjab</td> \
                <td>Alla Rakha</td> \
            </tr> \
            <tr class='even'> \
                <td>Partho Sarthy</td> \
                <td>Sarod</td> \
                <td>Maihar</td> \
                <td>Ravi Shankar</td> \
            </tr> \
        </tbody> \
    </table>";
    $("#recording_info").html(recording_metadata + "\n" + recording_performers);*/    
}

function fillRecordingDetails(recording_id, collection){
    htmlText = "<div id='recording_details'>\
               <div id='recording_info'></div>\
               <div id='release_info'></div>\
               </div>"
    $("#content_main").html(htmlText);
    __fillRecordingDetails(recording_id, collection);    
}
