nMaxCanvas = 3;

downSamplingFactor = 4; //subsampling value
secondsToShow = 60; //number of seconds to show


nameCanvas[0] = "RMS";
nameCanvas[1] = "PITCH";
nameCanvas[2] = "ONSETS";
      
var plotDataV = new Array();
var mocapRenderer = new Array();
var notesData = new Array();
var audioMp3Url = new Array();
var audioOggUrl = new Array();
//var fileProps = new Array();

var maxTimeInSeconds = new Array();

var _audiotagnumber = -1;

var CompMusicID = "68ecc764-b0da-4919-affe-8a50d558cbbf";

document.write('<audio id="audiotag00" preload="auto"></audio>');


function initializeAudioAndData(recording_id){
    
    audioMp3Url = new Array();
    audioOggUrl = new Array();
    plotDataV = new Array();
    fileProps = new Array();
    maxTimeInSeconds = new Array();
    
    CompMusicID = recording_id;
    
    audioMp3Url.push(new String("http://"+window.location.host+"/CompMusicBrowser/media/audio/links/mp3/"+CompMusicID+".mp3"));
    audioOggUrl.push(new String("http://"+window.location.host+"/CompMusicBrowser/media/audio/links/ogg/"+CompMusicID+".ogg"));
    
    //$('body').append('<audio id="audiotag00" preload="auto"><source src="'+audioMp3Url[0]+'"/>\n  <source src="'+audioOggUrl[0]+'"/></audio>');
    $('#audiotag00').html('<source src="'+audioMp3Url[0]+'"/>\n  <source src="'+audioOggUrl[0]+'"/>');
    
    //document.write('<audio id="audiotag00" preload="auto"><source src="'+audioMp3Url[0]+'"/>\n  <source src="'+audioOggUrl[0]+'"/></audio>');
    
    document.getElementById("audiotag00").load();
    
    //(aNumSamples, aSamples, aStartTime, aSamplingRate, aFileID)
    plotDataV.push( new Data( 0,null,0,84.0,0 ) );//SpectralRms
    //ID, xmlID,minValue,maxValue,SamplingRate,FrameSize,path,numSmaples,nodeType,Category,Description,canvas,0,1,color,0,currentaudiotagnumber,currentvideotagnumber,moCap
    fileProps.push(new FileProps(0,CompMusicID,0,0.1,84.0,1,CompMusicID+".lowlevel.SpectralRms.wav",2679,"Data","AuDesc","essentia.lowlevel.SpectralRms","-1",0,1,/*color*/0,0,-1,-1,-1));
    
    plotDataV.push( new Data( 0,null,0,84.0,1 ) );//PitchFiltered
    fileProps.push(new FileProps(1,CompMusicID,-3600.0,3600.0,84.0,1,CompMusicID+".lowlevel.PitchFiltered.wav",2679,"Data","AuDesc","essentia.lowlevel.PitchFiltered","-1",0,1,/*color*/0,0,-1,-1,-1));
    
    plotDataV.push( new Data( 0,null,0,172.0,2 ) );//OnsetTimes
    fileProps.push(new FileProps(2,CompMusicID,-1,1,172.0,1,CompMusicID+".rhythm.OnsetTimes",5485,"Data","AuDesc","essentia.rhythm.OnsetTimes","-1",0,1,/*color*/0,0,-1,-1,-1));
    
    plotDataV.push( new Data( 0,null,0,8000.0,3 ) );//Audio Waveform
    fileProps.push(new FileProps(2,CompMusicID,-1,1,8000.0,1,CompMusicID+".wav",5485,"Data","Audio","Audio","-1",0,1,/*color*/0,0,0,-1,-1));
    
    fileProps[0].canvas = 0;
    fileProps[1].canvas = 1;
    fileProps[2].canvas = 2;
    fileProps[3].canvas = 0;
    
    fileProps[0].tabpos = 1;
    fileProps[1].tabpos = 1;
    fileProps[2].tabpos = 1;
    fileProps[3].tabpos = 2;
    
    //level of highlight
    fileProps[0].selected = 1;
    fileProps[1].selected = 1;
    fileProps[2].selected = 1;
    fileProps[3].selected = 1;
    
    //alert("duration:"+document.getElementById("audiotag00").duration);
    //secondsToShow = document.getElementById("audiotag00").duration;

    maxTimeInSeconds.push(secondsToShow);
          
    fileProps[3].numsamples = secondsToShow*fileProps[3].sr;
    
    
}

initializeAudioAndData(CompMusicID);




//--------------------------------------------------


function jumpToSegment(canvases, startTime) //canvases contains an string with the numbers for the canvases that are synchronized ex: "03" or "123" or "0123" if all canvases are in sync Maximum of 10 canvases!
{
  var noStartTime = true;

  if (startTime != -1)
    noStartTime = false;

  if (noStartTime)
    startTime = currentOffsetTimeInSeconds[fileProps[0].canvas];
  requestDataCompMusicForID_WebSockets(CompMusicID,secondsToShow,startTime);
}

var data = null;
var response = null;
//var worker = new AJAXWorker();
var nodesArray = null;


window.onload = onLoadCallback;
function onLoadCallback()
{
  document.body.style.overflow = 'hidden'; //TO HIDE SCROLLBARS!

  //window.history.replaceState('', 'RepoVizz Visualizer', '/SIEMPRERepository'); //with this then the ajax produces Failed to load resource

  for(var s=0;s<plotDataV.length;s++)
  {
    if ( fileProps[s].sr > 0 )
    {
      maxTimeInSeconds[s] = Math.floor(fileProps[s].numsamples/fileProps[s].sr);
      //break;
    }
  }
  redrawAll();
}


//--------------------------------------------------


function redrawAll()
{
    for (var c=0;c<nMaxCanvas;c++)
    {
        redrawCanvasMain(c);
        redrawCanvasHScrollbarMain(c);
        redrawCanvasVScrollbarMain(c);
        redrawCanvasLowMenuLeft(c);
        redrawCanvasTopMenuLeft(c);
        redrawCanvasTopMenuMain(c);
        updateCurrentCursorPos(c);
    }
}

function redrawAllHScrollbarMain()
{
    for (var c=0;c<nMaxCanvas;c++)
        redrawCanvasHScrollbarMain(c);
}


function showHideCanvas(canvas)
{
    if (isActiveCanvas[canvas])
        isActiveCanvas[canvas]=false;
    else
        isActiveCanvas[canvas]=true;

    $("#panel_"+canvas).animate({"height": "toggle"}, { duration: 250, complete:function(){redrawAll();redrawAll();} });
}

function ToogleSyncCanvas(canvas)
{
    if (isSyncCanvas[canvas])
        isSyncCanvas[canvas]=false;
    else
    {
        for (var i=0;i<nMaxCanvas;i++)
        {
            if (isSyncCanvas[i])
            {
                zoomFactorX[canvas] = zoomFactorX[i];
                offsetXNorm[canvas] = offsetXNorm[i];
                lastXPixel[canvas] = lastXPixel[i];
                cursorTime[canvas] = cursorTime[i];
                redrawCanvasMain(canvas);
          
                if (currentOffsetTimeInSeconds[canvas] != currentOffsetTimeInSeconds[i])
                {
                    currentOffsetTimeInSeconds[canvas] = currentOffsetTimeInSeconds[i];
                    jumpToSegment(canvas, currentOffsetTimeInSeconds[canvas]);
                }
                continue;
            }
        }
        isSyncCanvas[canvas]=true;
    }

  redrawAll();
}
      

//--------------------------------------------------

var canvasMain = new Array(nMaxCanvas);
var currentPosLine = new Array(nMaxCanvas);
var canvasHScrollbarMain = new Array(nMaxCanvas);
var canvasVScrollbarMain = new Array(nMaxCanvas);
var canvasLowMenuLeft = new Array(nMaxCanvas);
var canvasTopMenuLeft = new Array(nMaxCanvas);
var canvasTopMenuMain = new Array(nMaxCanvas);

var ctxMain = new Array(nMaxCanvas);
var ctxHScrollbarMain = new Array(nMaxCanvas);
var ctxVScrollbarMain = new Array(nMaxCanvas);
var ctxLowMenuLeft = new Array(nMaxCanvas);
var ctxTopMenuLeft = new Array(nMaxCanvas);
var ctxTopMenuMain = new Array(nMaxCanvas);

var isActiveCanvas = new Array(nMaxCanvas);
for (i=0;i<nMaxCanvas;i++) isActiveCanvas[i]=true; //the active canvas are the ones that are shown

var isSyncCanvas = new Array(nMaxCanvas);
for (i=0;i<nMaxCanvas;i++) isSyncCanvas[i]=false; 

var isActiveXMLTree = false;
leftMenuWidth = 0; //override value if leftMenu is not used

var isSyncCanvas = new Array(nMaxCanvas);
for (i=0;i<nMaxCanvas;i++) isSyncCanvas[i]=true; //the canvas that have sync active will move together

function numberOfActiveCanvas()
{
    var count = 0;
    for (var i=0;i<nMaxCanvas;i++)
    {
        if (isActiveCanvas[i])
            count++;
    }
    return count;
}

//var dragHOk = false;
var dragHOk = new Array(nMaxCanvas);
for (i=0;i<nMaxCanvas;i++) dragHOk[i]=false;

//  var dragVOk = false;
var dragVOk = new Array(nMaxCanvas);
for (i=0;i<nMaxCanvas;i++) dragVOk[i]=false;

var dragMainOk = false;
/*  var zoomInHPressed = false;
var zoomOutHPressed = false;
var zoomInVPressed = false;
var zoomOutVPressed = false;*/

var zoomInHPressed = new Array(nMaxCanvas);
for (i=0;i<nMaxCanvas;i++) zoomInHPressed[i]=false;

var zoomOutHPressed = new Array(nMaxCanvas);
for (i=0;i<nMaxCanvas;i++) zoomOutHPressed[i]=false;

var zoomInVPressed = new Array(nMaxCanvas);
for (i=0;i<nMaxCanvas;i++) zoomInVPressed[i]=false;

var zoomOutVPressed = new Array(nMaxCanvas);
for (i=0;i<nMaxCanvas;i++) zoomOutVPressed[i]=false;

var lastXPixel = new Array(nMaxCanvas);
for (i=0;i<nMaxCanvas;i++) lastXPixel[i]=-1;

var lastYPixel = new Array(nMaxCanvas);
for (i=0;i<nMaxCanvas;i++) lastYPixel[i]=-1;

//  var offsetX = new Array(nMaxCanvas);
//  for (i=0;i<nMaxCanvas;i++) offsetX[i]=0;

var offsetXNorm = new Array(nMaxCanvas);
for (i=0;i<nMaxCanvas;i++) offsetXNorm[i]=0;

var offsetIndex = new Array(nMaxCanvas);
for (i=0;i<nMaxCanvas;i++) offsetIndex[i]=0;

var offsetYNorm = new Array(nMaxCanvas);
for (i=0;i<nMaxCanvas;i++) offsetYNorm[i]=0.5;

var zoomFactorX = new Array(nMaxCanvas);
for (i=0;i<nMaxCanvas;i++) zoomFactorX[i]=1.0;

var zoomFactorY = new Array(nMaxCanvas);
for (i=0;i<nMaxCanvas;i++) zoomFactorY[i]=1.0;

var currentOffsetTimeInSeconds = new Array(nMaxCanvas);
for (i=0;i<nMaxCanvas;i++) currentOffsetTimeInSeconds[i]=0;

var scrollSamplingRate = new Array(nMaxCanvas);
for (i=0;i<nMaxCanvas;i++) scrollSamplingRate[i]=0;

var scrollOffsetNorm = new Array(nMaxCanvas);
for (i=0;i<nMaxCanvas;i++) scrollOffsetNorm[i]=0;

/*  var scrollOffsetIndex = new Array(nMaxCanvas);
for (i=0;i<nMaxCanvas;i++) scrollOffsetIndex[i]=0;*/

var scrollnSamples = new Array(nMaxCanvas);
for (i=0;i<nMaxCanvas;i++) scrollnSamples[i]=0;


var nSamples = 0;
var totalFileSamples = 0;
var samplesRatio = 0;

var bTime = new Array(nMaxCanvas)
for (i=0;i<nMaxCanvas;i++) bTime[i]=0;

var eTime = new Array(nMaxCanvas)
for (i=0;i<nMaxCanvas;i++) eTime[i]=0;

var cursorTime = new Array(nMaxCanvas)
for (i=0;i<nMaxCanvas;i++) cursorTime[i]=5;


var debugOn = 0;
var altPressed = 0;
var ctrlPressed = 0;
var shiftPressed = 0;

var timer = 0; //timer for drawing every 50 ms when playing sound


//$(document).ready(readyCallbackRepovizz);
function readyCallbackRepoVizz(recording_id) {
    
    fillCanvasTable();
    
    document.addEventListener('mousemove', onMouseMoveDocument, 1); //event capturing, not bubbling: http://www.quirksmode.org/js/events_order.html
    document.addEventListener('mouseup', onMouseUpDocument, 1);
    
    for (var i=0;i<nMaxCanvas;i++)
    {
        //var canvasId = "main_canvas_"+i;
        //canvasMain[i] = $(canvasId).get(0);
        //canvasMain[i] = document.getElementById(canvasId);
        console.log($('#main_canvas_'+i));
        canvasMain[i] = $('#main_canvas_'+i).get(0);
        currentPosLine[i] = $('#Current_Pos_Line_'+i).get(0);
        canvasHScrollbarMain[i] = $('#hscrollbar_main_canvas_'+i).get(0);
        canvasVScrollbarMain[i] = $('#vscrollbar_main_canvas_'+i).get(0);
        canvasLowMenuLeft[i] = $('#lowmenu_left_canvas_'+i).get(0);//
        canvasTopMenuLeft[i] = $('#topmenu_left_canvas_'+i).get(0);//
        canvasTopMenuMain[i] = $('#topmenu_main_canvas_'+i).get(0);//
      
        
        $('#main_canvas_'+i).get(0);
        ctxMain[i] = canvasMain[i].getContext('2d');
        ctxHScrollbarMain[i] = canvasHScrollbarMain[i].getContext('2d');
        ctxVScrollbarMain[i] = canvasVScrollbarMain[i].getContext('2d');
        ctxLowMenuLeft[i] = canvasLowMenuLeft[i].getContext('2d');
        ctxTopMenuLeft[i] = canvasTopMenuLeft[i].getContext('2d');
        ctxTopMenuMain[i] = canvasTopMenuMain[i].getContext('2d');
        //var current_i=i; //var ii = 0; //let ii = i;
      
        //canvasMain[i].addEventListener('mousemove', function(e){onMouseMoveCanvasMain(e,i);}, 0);
        canvasMain[i].addEventListener('mousemove', new Function("e", "onMouseMoveCanvasMain(e," + i + ");"), 0);
        //canvasMain[i].addEventListener('mousedown', onMouseDownCanvasMain, 0);
        canvasMain[i].addEventListener('mousedown', new Function("e", "onMouseDownCanvasMain(e," + i + ");"), 0);
        //canvasMain[i].addEventListener('mouseup', onMouseUpCanvasMain, 0);
        canvasMain[i].addEventListener('mouseup', new Function("e", "onMouseUpCanvasMain(e," + i + ");"), 0);
        canvasMain[i].addEventListener('mouseout', onMouseOutCanvasMain, 0);
      
        canvasMain[i].addEventListener('mousewheel', new Function("e", "onMouseWheelCanvasMain(e," + i + ");"), 0);
        canvasMain[i].addEventListener('DOMMouseScroll', new Function("e", "onMouseWheelCanvasMain(e," + i + ");"), 0);
      
        currentPosLine[i].addEventListener('mousewheel', new Function("e", "onMouseWheelCanvasMain(e," + i + ");"), 0);
        currentPosLine[i].addEventListener('DOMMouseScroll', new Function("e", "onMouseWheelCanvasMain(e," + i + ");"), 0);
      
        //canvasHScrollbarMain[i].addEventListener('mousemove', onMouseMoveCanvasHScrollbarMain, 0);
        canvasHScrollbarMain[i].addEventListener('mousemove', new Function("e", "onMouseMoveCanvasHScrollbarMain(e," + i + ");"), 0);
        //canvasHScrollbarMain[i].addEventListener('mousedown', onMouseDownCanvasHScrollbarMain, 0);
        canvasHScrollbarMain[i].addEventListener('mousedown', new Function("e", "onMouseDownCanvasHScrollbarMain(e," + i + ");"), 0);
        //canvasHScrollbarMain[i].addEventListener('mouseup', onMouseUpCanvasHScrollbarMain, 0);
        canvasHScrollbarMain[i].addEventListener('mouseup', new Function("e", "onMouseUpCanvasHScrollbarMain(e," + i + ");"), 0);
        canvasHScrollbarMain[i].addEventListener('mouseout', onMouseOutCanvasHScrollbarMain, 0);
      
        //canvasVScrollbarMain[i].addEventListener('mousemove', onMouseMoveCanvasVScrollbarMain, 0);
        canvasVScrollbarMain[i].addEventListener('mousemove', new Function("e", "onMouseMoveCanvasVScrollbarMain(e," + i + ");"), 0);
        //canvasVScrollbarMain[i].addEventListener('mousedown', onMouseDownCanvasVScrollbarMain, 0);
        canvasVScrollbarMain[i].addEventListener('mousedown', new Function("e", "onMouseDownCanvasVScrollbarMain(e," + i + ");"), 0);
        canvasVScrollbarMain[i].addEventListener('mouseout', onMouseOutCanvasVScrollbarMain, 0);
        //canvasVScrollbarMain[i].addEventListener('mouseup', onMouseUpCanvasVScrollbarMain, 0);
        canvasVScrollbarMain[i].addEventListener('mouseup', new Function("e", "onMouseUpCanvasVScrollbarMain(e," + i + ");"), 0);
      
        canvasLowMenuLeft[i].addEventListener('mousedown', new Function("e", "onMouseDownCanvasLowMenuLeft(e," + i + ");"), 0);
      
        canvasTopMenuLeft[i].addEventListener('mousedown', new Function("e", "onMouseDownCanvasTopMenuLeft(e," + i + ");"), 0);
      
        canvasTopMenuMain[i].addEventListener('mousemove', new Function("e", "onMouseMoveCanvasTopMenuMain(e," + i + ");"), 0);
        canvasTopMenuMain[i].addEventListener('mousedown', new Function("e", "onMouseDownCanvasTopMenuMain(e," + i + ");"), 0);
        canvasTopMenuMain[i].addEventListener('mouseout', onMouseOutCanvasTopMenuMain, 0);
    }
    
    //For touching and gesturing in the iphone...
    //http://www.sitepen.com/blog/2008/07/10/touching-and-gesturing-on-the-iphone/
    
    canvasGeneralTooltip = $('#general_tooltip_canvas').get(0);
    ctxGeneralTooltip = canvasGeneralTooltip.getContext('2d');
    canvasGeneralTooltip.addEventListener('mousemove', onMouseMoveCanvasGeneralTooltip, 0);
    canvasGeneralTooltip.addEventListener('mousedown', onMouseDownCanvasGeneralTooltip, 0);
    canvasGeneralTooltip.addEventListener('mouseout', onMouseOutCanvasGeneralTooltip, 0);
    canvasGeneralTooltip.addEventListener('mouseup', onMouseUpCanvasGeneralTooltip, 0);
    
    
    
    for (var i=0;i<audioOggUrl.length;i++)
    {
        var audio = document.getElementById('audiotag0'+i);
        audio.load();
      
        audio.addEventListener('ended', new Function("stop_sound(" + i + ");"), 0);
    }
    
    
    initializeAudioAndData(recording_id);
    
    onLoadCallback();
    
    
    requestDataCompMusicForID_WebSockets(CompMusicID,secondsToShow,0);
    //redrawAll();
    
}

function drawCurrentPosLine(k)
{
    var c = globalSelectedCanvas;
    ctxMain[c].shadowOffsetX = 0;
    ctxMain[c].shadowOffsetY = 0;
    ctxMain[c].shadowBlur= 0;
    var nLineSegments = 35;
    ctxMain[c].strokeStyle="rgba(200,200,200,0.9)";
    ctxMain[c].lineWidth = 2;
    ctxMain[c].beginPath();
    for (var i=0;i<nLineSegments;i++)
    {
        if ((i % 2) == 1) continue;
        ctxMain[c].moveTo(xCurrentPos,i*(getCanvasHeight(c)/nLineSegments));
        ctxMain[c].lineTo(xCurrentPos,(i+1)*(getCanvasHeight(c)/nLineSegments));
    }
    ctxMain[c].stroke();
    ctxMain[c].closePath();
}


      
function onMouseMoveDocument(e)
{
    var cH = -1; var cV = -1;
    for (var i=0;i<nMaxCanvas;i++)
    {
        if (dragHOk[i]) cH=i;
        if (dragVOk[i]) cV=i;
    }
    
    if (cH > -1)
        onMouseMoveCanvasHScrollbarMain(e,cH);
    
    if (cV > -1)
        onMouseMoveCanvasVScrollbarMain(e,cV);
}

function onMouseUpDocument()
{
    for (var i=0;i<nMaxCanvas;i++)
    {
        lastXPixel[i] = -1;
        lastYPixel[i] = -1;
        dragHOk[i] = false;
        dragVOk[i] = false;
        zoomInHPressed[i] = false;
        zoomOutHPressed[i] = false;
        zoomInVPressed[i] = false;
        zoomOutVPressed[i] = false;
    }
}
      
function fillCanvasTable(){
    var tableCanvasStr = "";
    for(var i=0; i < nMaxCanvas; i++) 
    {
        tableCanvasStr+='<tr style="width:0px;">';
          tableCanvasStr+='<td style="vertical-align:top;">';
            tableCanvasStr+='<div id="topmenu_'+i+'" style="display:block; left: 0px; top:0px; height: '+topMenuHeight+'px;">'; //topMenuHeight = 18
            tableCanvasStr+='<table border="0" cellpadding="0" cellspacing="0" style="vertical-align:top;" onselectstart="return false;" ondragstart="return false;">';
      
              tableCanvasStr+='<tr style="height: 0px;">'; //This is the topMenu
                tableCanvasStr+='<td style="">';
                  tableCanvasStr+='<canvas id="topmenu_left_canvas_'+i+'" style="position: relative; left: 0px; vertical-align:top;"></canvas>';
                tableCanvasStr+='<td style="">';
                  tableCanvasStr+='<canvas id="topmenu_main_canvas_'+i+'" style="position: relative; left: 0px; vertical-align:top;"></canvas>';
                tableCanvasStr+='</td>';
              tableCanvasStr+='</tr>';
      
            tableCanvasStr+='</table>';
            tableCanvasStr+='</div>';
      
            tableCanvasStr+='<div id="panel_'+i+'" style="display:block;">';
              tableCanvasStr+='<table border="0" cellpadding="0" cellspacing="0" style="vertical-align:top;" onselectstart="return false;" ondragstart="return false;">';
      
                tableCanvasStr+='<tr style="">';  //This is the Canvas with associated vertical scrollbar
                  tableCanvasStr+='<td style="width: 0px;">';
                    tableCanvasStr+='<canvas id="vscrollbar_main_canvas_'+i+'" style="position: relative; left: 0px; vertical-align:top;"></canvas>';
                  tableCanvasStr+='</td>';
                  tableCanvasStr+='<td style="">';
                    tableCanvasStr+='<div id="main_canvas_div_'+i+'" style="display:block;">';
                      tableCanvasStr+='<div class="cursor_line" id="Current_Pos_Line_'+i+'" style="width: 2px; height: 100%; background-color: white; opacity: 0.8; position: absolute; left:10px; z-index:3; pointer-events: none;" onselectstart="return false;" ondragstart="return false;"></div>';
                      tableCanvasStr+='<canvas id="main_canvas_'+i+'" style="position: relative; left: 0px; vertical-align:top;">Your Browser does not support canvas, we recommend to install chrome</canvas>';
                    tableCanvasStr+='</div>';
                  tableCanvasStr+='</td>';
                tableCanvasStr+='</tr>';
      
                tableCanvasStr+='<tr style="height: 0px;">';
                  tableCanvasStr+='<td style="">'; //This is the synchronize button in the low left side
                    tableCanvasStr+='<canvas id="lowmenu_left_canvas_'+i+'" style="position: relative; left: 0px; vertical-align:top;"></canvas>';
                  tableCanvasStr+='</td>';
                  tableCanvasStr+='<td style="">'; // This is the horizontal scrollbar
                    tableCanvasStr+='<canvas id="hscrollbar_main_canvas_'+i+'" style="position: relative; left: 0px; vertical-align:top;"></canvas>';
                  tableCanvasStr+='</td>';
                tableCanvasStr+='</tr>';
      
              tableCanvasStr+='</table>';
            tableCanvasStr+='</div>';
          tableCanvasStr+='</td>';
        tableCanvasStr+='</tr>';
    }
    
    $('#canvas-table').html(tableCanvasStr);
    console.log($('#canvas-table'));
}

      /*(window).resize(function()
      {
        redrawAll();
      });*/
