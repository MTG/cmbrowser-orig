var myPlaylist;
var section_height_ratio = 0.730;
var content_height_ratio = 0.512;
var collection = "carnatic";
var ajaxLoad = '<div id="loading"><img src="./media/img/ajax_loader_large.gif" height="80" /></div>';

function initializeJPlayer(){
        $("#jquery_jplayer_1").jPlayer({
                ready: function () {
                $(this).jPlayer("setMedia", {
                        mp3: "./media/audio/1-01_Ud_Taksim.mp3"
                });
                },
                swfPath: "./media/js",
                supplied: "mp3"
        });

        myPlaylist = new jPlayerPlaylist({
                jPlayer: "#jquery_jplayer_1",
                cssSelectorAncestor: "#jp_container_1"}, [], 
                {
                        playlistOptions: {
                                enableRemoveControls: true
                        },
                        swfPath: "./media/js",
                        supplied: "mp3",
                        wmode: "window"
        }); // End of playlist initialization.
}

function resize_window(){
        $("#all").height(Math.floor($(document).height()*0.940));
        $("#allcontent").height(Math.floor($(document).height()*section_height_ratio));
        $("#content_main").height(Math.floor($(document).height()*content_height_ratio));
        $("#dialog").dialog({
                bgiframe: true,
                autoOpen: false,
                height: Math.floor($(document).height()*0.850),
                width: Math.floor($(document).width()*0.700),
                modal: true,
                position: 'top'
        });
        $(".ui-widget-overlay").live("click", function () {
                $("#dialog").dialog( "close" );
        });
}

function initialize(coll){
        collection = coll;
        $('link#main_css').attr('href', './media/css/style_'+collection+'.css');
        $('link#ui_css').attr('href', './media/css/redmond1/jquery-ui-1.8.20.'+collection+'.css');
        $('link#jplayer_css').attr('href', './media/skin/jplayer.compmusic_'+collection+'.css');
        $("#"+collection).attr('selected', 'selected');
        $("#"+collection).css({'color': 'yellow'});
        $("#primary").html(ajaxLoad);
        $.get(
                "/filters/"+collection,
                function(responseText){
                        $("#primary").html(generateFields(responseText, collection));
                        $( "input:submit, a, button", ".filters" ).button();
                        $( "a", ".filters" ).click(function() { return false; });
                        $( "a", ".filters" ).css({'width': '86%', 'text-align': 'center', 'margin-left': '10px'});
                        $(".ui-button-text").addClass('grayButton');
                },
                "text"
        );
        $("#content_data").empty();
        $("#content_querybag").html('<div class="trash-ui trash" id="clear_filters"></div>');
        initializeContent();
        fillContent("/collection/"+collection, collection);
        enableSearchTable(3);
        $("#content_list").tablesorter({debug: true, widgets: ['reorganizeList'] });
        
}

function readyCallbackCompMusic() {
        resize_window();
        initializeJPlayer();
        initialize(collection);
        
        $( "#tabs" ).tabs({
                ajaxOptions: {
                        error: function( xhr, status, index, anchor ) {
                                $( anchor.hash ).html(
                                        "Couldn't load this tab. We'll try to fix this as soon as possible. " +
                                        "If this wouldn't be a demo." );
                        }
                }
        });
        $( "input:submit, a, button", "#playlists" ).button();
        $( "input:submit, a, button", "#content_search").button();
        $(".ui-button-text").addClass('grayButton');
        $(".ui-button").addClass('grayButton');
        $( "a", "#playlists" ).click(function() { return false; });
        $( "input:submit", "#content_search" ).click(function() { return false; });
        $( "a", "#playlists" ).css({'width': '86%', 'text-align': 'center'});
        
        
        
        $(window).resize(function () {
                resize_window();
                redrawAll();
        });
        
        $(".collection_link").live("hover", function() {
                $(this).css({'cursor': 'pointer', 'color': '#6da6d1'});
        });
        $(".collection_link").live("mouseout", function() {
                if ($(this).attr('selected') == undefined){
                        $(this).css('color', 'white');
                }else{
                        $(this).css('color', 'yellow');
                }
        });
        $(".collection_link").live("click", function() {
                var cur = $(this);
                $(".collection_link").each(function (i) {
                        $(this).removeAttr('selected');
                        $(this).css('color', 'white');
                });
                
                initialize(cur.attr('value'));
        });
        
        $("#toggle_playlist").hover(function() {
                $(this).css('cursor', 'pointer');
        });

        $("#toggle_playlist").click(function() {
                //img = '<img src="./media/img/toggle_up.png" height="15"/>';
                htmlText = "Hide playlist";
                $(".jp-playlist").css('margin-top', '-'+($(".jp-playlist").height()+1)+'px');
                if ($(".jp-playlist").is(":visible")){
                        //img = '<img src="./media/img/toggle_down.png" height="15"/>';
                        htmlText = "Show playlist";
                        $(".jp-playlist").hide();
                }else{
                        $(".jp-playlist").show();
                }
                $(this).html(htmlText);
        });
        
        /*$(".jp-playlist-item-remove").live("click", function() {
                window.alert($(".jp-playlist").height());
                $(".jp-playlist").css('margin-top', '-28px');
                $(".jp-playlist").show();
        });*/
        
        $(".add_to_playlist").live("hover", function() {
                $(this).css('cursor', 'pointer');
        });

        $(".add_to_playlist").live("click", function() {
                //window.alert("./media/audio/links/mp3/"+$(this).attr("id")+".mp3");
                myPlaylist.add({
                        title:$(this).attr("title"),
                        artist:$(this).attr("name"),
                        mp3:"./media/audio/links/mp3/"+$(this).attr("id")+".mp3"
                });
                $(".jp-playlist").hide();
                $('#toggle_playlist').trigger('click');
                //$("#toggle_playlist").html('<img src="./media/img/toggle_up.png" height="15"/>');
        });
        
        $("#clear_filters").live("hover", function() {
                $(this).css('cursor', 'pointer');
        });
        $("#clear_filters").live("click", function() {
                //$("#content_main").empty();
                $("#content_main").html(ajaxLoad);
                $("#content_querybag").html('<div class="trash-ui trash" id="clear_filters"></div>');
                //initializeContent();
                $("input#search_content").val("");
                fillContent("/collection/"+collection, collection);
                enableSearchTable(3);
                $("#content_list").tablesorter({debug: true, widgets: ['reorganizeList'] });
        });
        
        /*$(".filter_name").live("hover", function() {
                $(this).css('cursor', 'pointer');
                $(this).addClass("filter_hover");
        });
        $(".filter_name").live("mouseout", function() {
                $(this).removeClass("filter_hover");
        });*/
        
        $(".filter_label table tr td").live("hover", function() {
                $(this).css('cursor', 'pointer');
                $(this).addClass("filter_option_hover");
        });
        
        $(".filter_label table tr td").live("mouseout", function() {
                $(this).removeClass("filter_option_hover");
        });
        
        $(".filter_label table tr td").live("click", function() {
                parents = $(this).parents();
                //window.alert($(this).attr("value"));
                filter_id = $(parents[3]).attr("id");
                $("#"+filter_id).attr("value", $(this).attr("value"));
                $(this).siblings().removeClass("filter_option_checked");
                $(this).addClass("filter_option_checked");
                updateFilters(collection); //TODO: check
        });
        
        $("#back_href").live("hover", function() {
                $(this).css({'cursor':'pointer', 'font-weight': 'bolder'});
        });
        $("#back_href").live("click", function() {
                $("#content").html('<div id="content_search">'+
                                '<input type="text" id="search_content" name="search_content"></input>'+
                                '</div>'+
                                '<div id="content_main"></div>'+
                                '<div id="content_querybag"></div>');
                $("#content_querybag").html($("#hidden_content").html());
                $("#hidden_content").empty();
                updateFilters(collection);
        });
        
        $(".remove_filter").live("hover", function() {
                $(this).css('cursor', 'pointer');
        });
        $(".remove_filter").live("click", function() {
                filter_id = $(this).attr("id");
                filter_id = filter_id.substr(filter_id.indexOf("_")+1);
                //window.alert(filter_id + ":" + $("#"+filter_id))
                $("#"+filter_id).remove();
                updateFilters(collection); //TODO: check
        });
        
        
        
        //$('#content_list').tableScroll({height: 500});
        //window.alert(Math.floor($(document).height()*content_height_ratio));
        
}