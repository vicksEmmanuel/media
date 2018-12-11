class Audio{
  static init(){
    var audio=new Audio();
    return audio;
  }
  constructor(){
    this.SSPECTRUM={};
    this.differentiator="media";
    this.holder=undefined;
    this.url="/get-current-music";
    this.container="#default-container";
    //controls
    var lead=this;
    $("document").ready(function(){
      lead.volume=$("#volumeslider_itself2");
      lead.volume.on("change",function(){
        var diff=lead._getDifferentiator();
        var holder=lead._getHolder();
         lead._getSpectrumChild(diff)[holder].spectrum.setVolume($(this).val());
         var array=Object.keys(lead._getSpectrumChild(diff));
         for(var fun=0;fun<array.length;fun++){
           holder=array[fun];
           lead._getSpectrumChild(diff)[holder].spectrum.setVolume($(this).val());
         }
      });
      lead.pause=$("#pause_init");
      lead.pause.on("click",function(){
        var diff=lead._getDifferentiator();
        var holder=lead._getHolder();
        lead._getSpectrumChild(diff)[holder].spectrum.pause();
      });
      lead.play=$("#play_init");
      lead.play.on("click",function(){
          var diff=lead._getDifferentiator();
          var holder=lead._getHolder();
          lead._getSpectrumChild(diff)[holder].spectrum.play();
      });
      lead.repeat=$("#repeat");
      lead.repeat.on("click",function(){

      });
      lead.volumeButton=$("#volume_butt");
      lead.next=$("#next");
      lead.next.on("click",function(){
          var diff=lead._getDifferentiator();
          var holder=lead._getHolder();
          //lead._getSpectrumChild(diff)[holder].spectrum.isPlaying()
          lead._onStop();
          var array=Object.keys(lead._getSpectrumChild(diff));
          var lastSong=false;
          for(var fun=0;fun<array.length;fun++){
            if(array[fun]==holder){
              ++fun;
                if(fun>(array.length-1)){
                    fun=0;
                    lastSong=true;
                }
                break;
            }
          }
          if(lastSong){
              var recentPlaylist=Object.keys(lead._getSpectrum());
              for(var tip=0; tip< recentPlaylist.length; tip++){
                if(recentPlaylist[tip]==lead._getDifferentiator()){
                  ++tip;
                  if(tip>(recentPlaylist.length-1)) tip=0;
                  break;
                }
              }
              lead._setDifferentiator(recentPlaylist[tip]);
              diff=lead._getDifferentiator();
              array=Object.keys(lead._getSpectrumChild(diff));
              holder=array[fun];
          }else{
              holder=array[fun];
          }
          lead._setHolder(holder);
          lead._getPlayButton().trigger("click");
      });
      lead.prev=$("#prev");
      lead.prev.on("click",function(){
        var diff=lead._getDifferentiator();
        var holder=lead._getHolder();
        lead._onStop();
         var array=Object.keys(lead._getSpectrumChild(diff));
         for(var fun=0;fun<array.length;fun++){
           if(array[fun]==holder){
             --fun;
               if(fun<0) fun=array.length-1;
               break;
           }
         }
         holder=array[fun];
         lead._setHolder(holder);
         lead.play.trigger("click");
      })
      lead.slider=$("#slider_itself");
      lead.slider.on("input",function(){
        var diff=lead._getDifferentiator();
        var holder=lead._getHolder();
         lead._getSpectrumChild(diff)[holder].spectrum.seekTo($(this).val());
      });
      lead.volumeButton.popover();
    });
    this.context;
    this.contextClass = (window.AudioContext ||
      window.webkitAudioContext ||
      window.mozAudioContext ||
      window.oAudioContext ||
      window.msAudioContext);
       if (this.contextClass) {
            this.context = new this.contextClass();
        } else {
            console.log("Web Audio API is not available. Ask the user to use a supported browser");
       }
    this._default();
  }
  _default(){
    var lead=this;
    var getCurrentMusic=new XMLHttpRequest();
    getCurrentMusic.open("GET", this.url, true);
    getCurrentMusic.onload = function() {
        var xxxp=function(){
          return new Promise(function(resolve, reject) {
              var diff=lead._getDifferentiator();
              lead._createObj(diff);
              var i=0;
              JSON.parse(getCurrentMusic.response).forEach(function(obj){
              var conquer={title: obj.audio_name, artist: obj.artist_name, album: obj.album_name, artworks:[
                {src: obj.album_artwork_path,  sizes:"512x512" , type:"image/jpg"},
                {src: obj.album_artwork_path,  sizes:"256x256" , type:"image/png"}
              ]};
              var tempSpectrum=lead._createSpectrum(obj.audio_path,lead.container, [], obj);
              var holder=Date.now()+Math.floor(Math.random() * 1000) + Math.floor(Math.random() * 1000) +1;
              if(i++==0){
                lead._setHolder(holder);
              }
              lead._addToSpectrum(diff,tempSpectrum,holder);
              lead._addSpectrumFuncDefaultly(diff,holder,conquer);
              resolve();
            })
          });
        }
        Promise.all([
            xxxp()
        ]);
    }
    getCurrentMusic.onerror = function() {
        console.log('BufferLoader: XHR error');
    }
    getCurrentMusic.send();
  }
  _bagTwerk(id,music_cover,can,type){
      return new Promise(function(resolve,reject){
        var canvas=document.createElement("canvas");
        canvas.id="candle";
        var imager=document.getElementById(music_cover);
        canvas.width=imager.width;
        canvas.height=imager.height;
        document.getElementById(can).appendChild(canvas);
        var ctx=document.getElementById("candle").getContext("2d");
        ctx.drawImage(imager,0,0,canvas.width,canvas.height);
        var top_x=0;
        var top_y=0;
        var width=canvas.width;
        var height=canvas.height;
        var radius=0;
        if(type=="profile") radius=0.1;
        else if(type=="single")  radius=40;
        stackBlurCanvasRGB( canvas.id, top_x, top_y, width, height, radius );
        var bg_image=new Image();
        bg_image.src=canvas.toDataURL();
        $(id).css({"background-image":"url("+bg_image.src+")","background-size": "cover"});
        $("#"+can).remove();
        $("#"+music_cover).remove();
        resolve();
      })
  }
  _getDefaultContainer(){
    return this.container;
  }
  _addSpectrumFuncDefaultly(diff,holder,conquer){
      var lead=this;
      this._getSpectrumChild(diff)[holder].spectrum.unAll();
      this._getSpectrumChild(diff)[holder].spectrum.on("audioprocess",function(){
        lead._getSpectrumChild(diff)[holder].spectrum.setVolume(lead._getVolumeButton().val());
        lead._getSliderButton().val(lead._getSpectrumChild(diff)[holder].spectrum.getCurrentTime()/  lead._getSpectrumChild(diff)[holder].spectrum.getDuration());
      });
      this._getSpectrumChild(diff)[holder].spectrum.on("play",function(){
        //$("#closemedia_vbox").trigger("click");
        lead._setMediaSessionData(conquer.title,conquer.artist,conquer.album,conquer.artworks);
        lead._getPauseButton().show();
        lead._getPlayButton().hide();
      });
      this._getSpectrumChild(diff)[holder].spectrum.on("pause",function(){
        lead._getPauseButton().hide();
        lead._getPlayButton().show();
      });
      this._getSpectrumChild(diff)[holder].spectrum.on("finish",function(){
        lead._getPauseButton().hide();
        lead._getPlayButton().show();
        lead._getPrevButton().trigger("click");
      });
  }
  _setVolumeButton(vol){
    this.volume=vol;
  }
  _getVolumeButton(){
    return this.volume;
  }
  _setNextButton(next){
    this.next=next;
  }
  _getNextButton(){
    return this.next;
  }
  _setPrevButton(prev){
    this.prev=prev;
  }
  _getPrevButton(){
    return this.prev;
  }
  _getRepeatButton(){
    return this.repeat;
  }
  _setRepeatButton(repeat){
    this.repeat=repeat;
  }
  _setPlayButton(play){
    this.play=play;
  }
  _getPlayButton(){
    return this.play;
  }
  _getSliderButton(){
    return this.slider;
  }
  _setSliderButton(slide){
    this.slider=slide;
  }
  _setPauseButton(pause){
    this.pause=pause;
  }
  _getPauseButton(){
    return this.pause;
  }
  _getHolder(){
    return this.holder;
  }
  _setHolder(hold){
    this.holder=hold;
  }
  _createObj(temp){
      this._getSpectrum()[temp]={};
  }
  _getDifferentiator(){
    return this.differentiator;
  }
  _createSpectrum(src,id,peak,data){
    var audio=document.createElement("audio");
    audio.src=src;
    audio.preload="none";
    var source=this.context.createMediaElementSource(audio);
    var gainNode=this.context.createGain();
    source.connect(gainNode);
    gainNode.connect(this.context.destination);
    var Spectrum = WaveSurfer.create({
          container: id,
          progressColor: "#E8DAEF",
          backend:"MediaElement",
          height: 30,
          minPxPerSec: 5,
          hideScrollbar: true,
          audioContext:this.context
    });
    //#00FF00
    //#DAF7A6
    //#F1C40F
    //#F5B7B1
    //#E8DAEF
    //#FCF3CF
    Spectrum.load(audio,peak, "auto");
    return {
          data: data,
          spectrum:Spectrum,
          audio:audio,
          gainNode:gainNode
    };
  }
  _setDifferentiator(newDiff){
    this.differentiator=newDiff;
  }
  _addToSpectrum(diff,createdSpectrum,attr){
      this._getSpectrum()[diff][attr]=createdSpectrum;
    }
  _getSpectrum(){
    return this.SSPECTRUM;
  }
  _getSpectrumChild(child){
    return this._getSpectrum()[child];
  }
  _onPlay(){
    this._getPlayButton().trigger("click");
  }
  _onPause(){
    this._getPauseButton().trigger("click");
  }
  _onStop(){
    this._getSpectrumChild(this._getDifferentiator())[this._getHolder()].spectrum.stop();
  }
  _onPrev(){
    this._getPrevButton().trigger("click");
  }
  _onNext(){
    this._getNextButton().trigger("click");
  }
  static get SUPPORTS_MEDIA_SESSION () {
    return ('mediaSession' in navigator);
  }
  _setMediaSessionData(title,artist,album,artworks){
    var lead=this;
    if(Audio.SUPPORTS_MEDIA_SESSION){
      navigator.mediaSession.metadata=new MediaMetadata({
          title: title,
          artist: artist,
          album: album,
          artwork: artworks
      });
      navigator.mediaSession.setActionHandler('play', function(){
            lead._onPlay();
      });
      navigator.mediaSession.setActionHandler('pause',  function(){
            lead._onPause();
      });
      navigator.mediaSession.setActionHandler('seekbackward',  function(){
            lead._onPrev();
      });
      navigator.mediaSession.setActionHandler('seekforward',  function(){
            lead._onNext();
      });
      // navigator.mediaSession.setActionHandler('previoustrack', function() { /* Code excerpted. */ });
      //navigator.mediaSession.setActionHandler('nexttrack', function() { /* Code excerpted. */ });
    }else{
      return;
    }
  }
}
if(window.Audio instanceof Audio){
    console.log(window.Audio);
}else{
  window.Audio=Audio.init();
}
