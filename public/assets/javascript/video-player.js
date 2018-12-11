class VideoPlayer{
  static init(video_id){
    const video=document.getElementById(video_id);
    if(!video){
      console.log("No video here");
      return;
    }
    var video_element=new VideoPlayer(video);
    video_element.load();
  }
  load(){
    document.addEventListener("DOMDOMContentLoaded", this._initApp());
  }
  constructor(video){
    const title=video.attributes.title.nodeValue;
    const video_id=video.attributes.id.nodeValue;
    const src=video.attributes.loc.nodeValue;
    const manifestUri=video.attributes.dash.nodeValue;
    const hlsUri=video.attributes.hls.nodeValue;
    const poster=video.attributes.poster.nodeValue;
    const user=video.attributes.user.nodeValue;
    const album=video.attributes.album.nodeValue;
    const artwork=video.attributes.artworkPath.nodeValue;

    if(!manifestUri){
      console.log("Bailing! No video DASH manifest");
      return;
    }
    if(!hlsUri){
      console.log("Bailing! No video HLS manifest");
      return;
    }
    if(!poster){
      console.log("Bailing! No video poster");
      return;
    }
    this._src=src;
    this._thumbnailHeight=undefined;
    this._thumbnailImageInnerContent=undefined;
    this._artwork=artwork;
    this._album=album;
    this._user=user;
    this._manifestUri=manifestUri;
    this._hlsUri=hlsUri;
    this._poster=poster;
    this._title=title;
    this._video=video;
    this._video_id=video_id;
    this._videoContainer=this._video.parentNode;
    this._jvideoContainer=$("#media_video_box");
    this._jvideo=$("#video");
    this._jexitFullScreen=$("#video-exit-fullscreen");
    this._jfullScreen=$("#video-fullscreen");
    this._jvideoControls=$("#video_controls");
    this._playOnSeekFinished=false;
    this._player=null;
    this._previousDeviceOrientation = undefined;
    this._currentDeviceOrientation = undefined;
    this._fsLocked = false;
    this._downloadButton=$("#"+this._video_id+"-download-button");
    this._playPauseButton=$("#"+this._video_id+"-play-pause-button");
    this._pauseButton=$("#"+this._video_id+"-play-pop-butt")
    this._seekSlider=document.querySelector("#"+this._video_id+"-seek-slider");
    this._currentTime=document.querySelector("#"+this._video_id+"-current-time");
    this._durationTime=document.querySelector("#"+this._video_id+"-duration-time");
    this._offlineSupported=false;
    this._fullscreen=document.querySelector("#"+this._video_id+"-fullscreen");
    this._exitOnFullScreen=document.querySelector("#"+this._video_id+"-exit-fullscreen");
    this._bw30=document.querySelector("#"+this._video_id+"-bw30");
    this._fw30=document.querySelector("#"+this._video_id+"-fw30");
    this._updown=$("#"+this._video_id+"-up-video");
    this._downup=$("#"+this._video_id+"-down-video");
    //Change later
    //this._muteButton=document.querySelector("#"+this._video_id+"-mute-button");
    this._volumeToogle=document.querySelector("#"+this._video_id+"-volume-slider");

    //Handlers
    /*
    this._onKeyDown=this._onKeyDown.bind(this);

    this._onPlay=this._onPlay.bind(this);
    this._onCLose=this._onClose.bind(this);
    this._onReplay=this._onReplay.bind(this);
    this._onBack30=this._onBack30.bind(this);
    this._onFwd30=this._onFwd30.bind(this);
    this._onToggleFullScreen=this._onToggleFullScreen.bind(this);
    this._onChromecast=this._onChromecast.bind(this);
    this._onVolumeToggle=this._onVolumeToggle.bind(this);
    this._onVideoEnd=this._onVideoEnd.bind(this);
    this._onSeek=this._onSeek.bind(this);
    this._stopTimeTracking=this._stopTimeTracking.bind(this);
    this._startTimeTracking=this._startTimeTracking.bind(this);
    this._onFullScreenChanged=this._onFullScreenChanged.bind(this);
    this._onTimeUpdate=this._onTimeUpdate.bind(this);
    */
    this._onFullScreenToggle=this._onFullScreenToggle.bind(this);
    this._onBackward30=this._onBackward30.bind(this);
    this._onFoward30=this._onFoward30.bind(this);
    this._listContent=this._listContent.bind(this);
    this._onErrorEvent=this._onErrorEvent.bind(this);
    this._selectTracks=this._selectTracks.bind(this);
    this._setDownloadProgress=this._setDownloadProgress.bind(this);
    this._downloadContent=this._downloadContent.bind(this);
    this._onError=this._onError.bind(this);
    this._getOfflineContent=this._getOfflineContent.bind(this);
    this._onDownloadClick=this._onDownloadClick.bind(this);
    this._onBufferEvent=this._onBufferEvent.bind(this);
    this._onPause=this._onPause.bind(this);
    this._onPlay=this._onPlay.bind(this);
    this._onPlayPause=this._onPlayPause.bind(this);
    this._onSeekEvent=this._onSeekEvent.bind(this);
    this._onTimeUpdate=this._onTimeUpdate.bind(this);
    this._onVolumeToggle=this._onVolumeToggle.bind(this);
    //this._onMuteEvent=this._onMuteEvent.bind(this);
  }
  _initApp(){
      shaka.polyfill.installAll();
    if (shaka.Player.isBrowserSupported()) {
          this._initPlayer();
      } else {
      console.error('Browser not supported!');
    }
  }
  _initPlayer(){
    this._player = new shaka.Player(this._video);
    this._player.addEventListener('error', this._onErrorEvent);
    this._initStorage(this._player);
    this._downloadButton.click(this._onDownloadClick);
    this._playPauseButton.click(this._onPlay);
    this._pauseButton.click(this._onPause);
    this._seekSlider.addEventListener("input",this._onSeekEvent);
    this._volumeToogle.addEventListener("input",this._onVolumeToggle);
    this._fullscreen.addEventListener("click",this._onFullScreenToggle);
    this._exitOnFullScreen.addEventListener("click",this._onFullScreenToggle);
    this._addFullscreenEventListeners();
    this._addOrientationEventListeners();
    this._bw30.addEventListener("click",this._onBackward30);
    this._fw30.addEventListener("click",this._onFoward30);
    //this._muteButton.addEventListener("click",this._onMuteEvent);
    this._video.addEventListener("timeupdate",this._onTimeUpdate);
    this._player.addEventListener("buffering",this._onBufferEvent);
    this._load(this._player);
    this._setMediaSessionData();
  }
  _initStorage(player){
    window.storage = new shaka.offline.Storage(player);
    window.storage.configure({
      progressCallback: this._setDownloadProgress,
      trackSelectionCallback: this._selectTracks
    });
  }
  _selectTracks(tracks){
    var found = tracks
        .filter(function(track) { return track.type == 'variant'; })
        .sort(function(a, b) { return a.bandwidth > b.bandwidth; })
        .pop();
    console.log('Offline Track: ' + found);
    return [ found ];
  }
  _onErrorEvent(event){
      this._onError(event.detail);
  }
  _onError(error) {
    console.log('Error code', error.code, 'object', error);
  }
  _listContent() {
    return window.storage.list();
  }
  _removeContent(content) {
    return window.storage.remove(content.offlineUri);
  }
  _load(player){
    var lead=this;
    this._listContent()
      .then(function(content) {
        var offlineContent={};
        var check=false;
          for(let i=0; i<content.length;i++){
            if(content[i].originalManifestUri==lead._manifestUri){
              offlineContent=content[i];
              check=true;
              break;
            }
          }
        lead._getOfflineContent(check,player,offlineContent);
      });
  }
  _getOfflineContent(check,player,offlineContent){
    window.player = this._player;
    if(check){
      console.log("Offline mode activated");
      window.player.load(offlineContent.offlineUri);
    }else{
      this._switchToHLS(player);
    }
  }
  _switchToHLS(player){
    var lead=this;
    player.load(this._hlsUri).then(function() {
      // This runs if the asynchronous load is successful.
      console.log('The video has now been loaded!');
    }).catch(function(err){
        console.log("Failed to load HLS");
        player.unload().then(lead._switchToDash(player));
    });
  }
  _switchToDash(player){
    var lead=this;
    player.load(this._manifestUri).then(function() {
      // This runs if the asynchronous load is successful.
      console.log('The video has now been loaded!');
    }).catch(function(err){
        console.log("Failed to load Dash");
        player.unload().then(lead._switchToDefault(player));
    });
  }
  _switchToDefault(player){
    var lead=this;
    player.unload()
    .then(function(){
      lead._video.src=lead._src;
      lead._downloadButton.hide();
      lead._video.load();
    }).catch(function(err){
        player.unload().then(lead._switchToHLS(player));
    });
  }
  _onBufferEvent(event){
    console.log("Buffering ",event);
  }
  _setDownloadProgress(content, progress) {
    var target=this._video_id+"-download-progress";
    DownloadProgress.update(target,progress);
  }
  _onDownloadClick(){
    this._downloadButton.disabled = true;
    this._setDownloadProgress(null, 0);
    var _manifestUrl=this._manifestUri;
    var _title=this._title;
    this._updown.show(200);
    this._downup.hide();
    // Download the content and then re-enable the download button so
    // that more content can be downloaded.
    const CACHE_NAME="MediaCloud --v1";
    var lead=this;
    this._downloadContent(_manifestUrl,_title)
      .then(function() {
        caches.open(CACHE_NAME).then(function(cache) {
            fetch("/shaka").then(function(response) {
              console.log("[ServiceWorker] fetching ",response);
              return response;
            }).then(function(urls) {
              var url=[
                urls.url,
                lead._poster
              ]
              cache.addAll(url);
            });
          });
        return  lead._listContent();
      })
      .then(function(content) {
        lead._setDownloadProgress(null, 1);
        lead._downloadButton.disabled = false;
      })
      .catch(function(error) {
        // In the case of an error, re-enable the download button so
        // that the user can try to download another item.
        lead._downloadButton.disabled = false;
        lead._onError(error);
      });
  }
  _downloadContent(manifestUri,title) {
    // Construct a metadata object to be stored along side the content.
    // This can hold any information the app wants to be stored with the
    // content.
    var metadata = {
      'title': title,
      'downloaded': Date(),
      'expiration': 348484938
    };
    return window.storage.store(manifestUri, metadata);
  }
  _onPlayPause(){
    if(!this._video.paused){
        this._onPause();
        return;
    }
    this._onPlay();
  }
  _onPlay(){
    var lead=this;
    document.querySelectorAll("video").forEach(function(video){
        video.pause();
    });
    this._video.play()
      .then(function(){
            lead._playPauseButton.hide();
            lead._pauseButton.show();
      })
      .catch(function(error){
        console.log("Error",error);
      });
  }
  _onPause(){
    var lead=this;
    this._video.pause();
    lead._playPauseButton.show();
    lead._pauseButton.hide();
  }
  _onSeekEvent(){
      var seekTo=this._video.duration*(this._seekSlider.value/100);
      this._video.currentTime=seekTo;
      var normalizedTime=this._video.currentTime/this._video.duration;
      this._setThumbnailImagePosition(normalizedTime);
  }
  _onTimeUpdate(){
    var updatedTime=this._video.currentTime*(100/this._video.duration);
    this._seekSlider.value=updatedTime;

    var currentMins=Math.floor(this._video.currentTime/60);
    var currentSecs=Math.floor(this._video.currentTime-currentMins*60);
    var durationMins=Math.floor(this._video.duration/60);
    var durationSecs=Math.floor(this._video.duration-durationMins*60);
        if(currentSecs<10)   currentSecs="0"+currentSecs;
        if(durationSecs<10) durationSecs="0"+durationSecs;
        if(currentMins<10)   currentMins="0"+currentMins;
        if(durationMins<10) durationMins="0"+durationMins;
        this._currentTime.innerHTML=currentMins+":"+currentSecs;
        this._durationTime.innerHTML=durationMins+":"+durationSecs;
  }
  _onVolumeToggle(){
    var volumeValue=this._volumeToogle.value/100;
    this._video.volume=volumeValue;
  }
  _onMuteEvent(){
      if(this._video.muted){
        this._video.muted=false;
      }else{
        this._video.muted=true;
      }
  }
  _enterFullScreen(){
    if (this._videoContainer.requestFullscreen) {
      this._jfullScreen.hide();
      this._jexitFullScreen.show(200);
      this._jvideoContainer.css({"width":"100%"});
      this._jvideo.css({"width":"100%","height": "100%"});
      this._jvideoControls.css({"width":"100%", "position":"absolute", "top":"85%"});
      return this._videoContainer.requestFullscreen();
    }
    if (this._videoContainer.webkitRequestFullscreen) {
      this._jfullScreen.hide();
      this._jexitFullScreen.show(200);
      this._jvideoContainer.css({"width":"100%"});
      this._jvideo.css({"width":"100%","height": "100%"});
      this._jvideoControls.css({"width":"100%", "position":"absolute", "top":"85%"});
      return this._videoContainer.webkitRequestFullscreen();
    }
    this._video.webkitEnterFullscreen();
  }
  _onBackward30(){
    //skips to 10
    this._video.currentTime =
        Math.max(this._video.currentTime - 10, 0);
  }
  _onFoward30(){
    if (this._video.ended) {
      return;
    }
    this._video.currentTime =
        Math.min(this._video.currentTime + 30, this._video.duration);
  }
  _addFullscreenEventListeners () {
    window.addEventListener('fullscreenchange', this._onFullScreenChanged);
    window.addEventListener('webkitfullscreenchange',
        this._onFullScreenChanged);
  }
  _addOrientationEventListeners () {
    if (!VideoPlayer.SUPPORTS_ORIENTATION) {
      return;
    }

    window.screen.orientation.addEventListener('change',
          this._onOrientationChanged);
  }
  _onFullScreenChanged () {
    if (!VideoPlayer.SUPPORTS_ORIENTATION_LOCK) {
      return;
    }

    if (this._isFullScreen) {
      return window.screen.orientation.lock('landscape').then(_ => {
        // Listen for the device going back to portrait in order to unlock it.
        window.addEventListener('deviceorientation',
            this._onDeviceOrientationChange);
      }).catch(_ => {
        // Silently swallow errors from attempting to lock the orientation.
        // This only works in the case of web apps added to home screens, but
        // we want to call it anyway.
      });
    }

    return window.screen.orientation.unlock();
  }
  get _isFullScreen () {
    return !!(document.isFullScreen ||
        document.webkitIsFullScreen);
  }
  _onOrientationChanged () {
    const isLandscape = window.screen.orientation.type.startsWith('landscape');
    if (isLandscape) {
      // Don't go FS when not playing the video.
      if (this._video.paused) {
        return;
      }

      this._enterFullScreen();
      return;
    }

    if (this._fsLocked) {
      return;
    }

    this._exitFullScreen();
  }
  _onDeviceOrientationChange (evt) {
    if (!VideoPlayer.SUPPORTS_ORIENTATION_LOCK) {
      return;
    }

    // event.beta represents a front to back motion of the device and
    // event.gamma a left to right motion.
    if (Math.abs(evt.gamma) > 10 || Math.abs(evt.beta) < 10) {
      this._previousDeviceOrientation = this._currentDeviceOrientation;
      this._currentDeviceOrientation = 'landscape';
      return;
    }

    if (Math.abs(evt.gamma) < 10 || Math.abs(evt.beta) > 10) {
      this._previousDeviceOrientation = this._currentDeviceOrientation;
      // When device is rotated back to portrait, unlock the screen orientation.
      if (this._previousDeviceOrientation == 'landscape' && !this._fsLocked) {
        screen.orientation.unlock();
        window.removeEventListener('deviceorientation',
          this._onDeviceOrientationChange);
      }
    }
  }
  _exitFullScreen(){
    if (document.exitFullscreen) {
      this._jfullScreen.show(200);
      this._jexitFullScreen.hide();
      this._jvideoContainer.css({"width":"60%"});
      this._jvideo.css({"width":"640px","height": "360px"});
      this._jvideoControls.css({"width":"640px", "position":"relative", "top":"0px"});
        return document.exitFullscreen();
    }
    if (document.webkitExitFullscreen) {
        this._jfullScreen.show(200);
        this._jexitFullScreen.hide();
        this._jvideoContainer.css({"width":"60%"});
        this._jvideo.css({"width":"640px","height": "360px"});
        this._jvideoControls.css({"width":"640px", "position":"relative", "top":"0px"});
        return  document.webkitExitFullscreen();
    }
    this._video.webkitExitFullscreen();
  }
  _onFullScreenToggle () {
    if (this._isFullScreen) {
      this._fsLocked = false;
      this._exitFullScreen();
      return;
    }

    this._fsLocked = true;
    this._enterFullScreen();
  }
  _setMediaSessionData(){
    if(VideoPlayer.SUPPORTS_MEDIA_SESSION){
      navigator.mediaSession.metadata=new MediaMetadata({
          title: this._title,
          artist: this._user,
          album: this._album,
          artwork:[
              {src:this._artwork+"/node_img/stretched-1366-768-909589.jpg",  sizes:"512x512" , type:"image/jpg"},
              {src:this._artwork+"/node_img/859672.png",  sizes:"256x256" , type:"image/png"}
          ],
      });

      navigator.mediaSession.setActionHandler('play', this._onPlay);
      navigator.mediaSession.setActionHandler('pause', this._onPause);
      navigator.mediaSession.setActionHandler('seekbackward', this._onBackward30);
      navigator.mediaSession.setActionHandler('seekforward', this._onFoward30);
      // navigator.mediaSession.setActionHandler('previoustrack', function() { /* Code excerpted. */ });
      //navigator.mediaSession.setActionHandler('nexttrack', function() { /* Code excerpted. */ });
    }else{
      console.log("No Media Session Support");
      return;
    }
  }
  _setThumbnailImagePosition (normalizedPosition) {
      if(!this._thumbnailImageInnerContent){
        this._thumbnailImageInnerContent=document.querySelector("#video-range-badge");
      }
      if(!this._thumbnailImageInnerContent){
        return;
      }
      if(!this._thumbnailHeight){
        this._thumbnailHeight=this._thumbnailImageInnerContent.offsetHeight;
      }
      const availableHeight=this._thumbnailHeight-VideoPlayer.THUMBNAIL_HEIGHT;
      const index=Math.floor((normalizedPosition * availableHeight))/VideoPlayer.THUMBNAIL_HEIGHT;
      const offset = index * VideoPlayer.THUMBNAIL_HEIGHT;
      this._thumbnailImageInnerContent.style.transform=`translateY(-${offset}px)`;
  }
  static get THUMBNAIL_HEIGHT () {
    return 70;
  }
  static get SUPPORTS_ORIENTATION_LOCK () {
    if (!VideoPlayer.SUPPORTS_ORIENTATION) {
      return false;
    }

    if (!('lock' in window.screen.orientation)) {
      return false;
    }

    return true;
  }
  static get SUPPORTS_ORIENTATION () {
    return ('orientation' in window.screen);
  }
  static get SUPPORTS_MEDIA_SESSION () {
    return ('mediaSession' in navigator);
  }
}

class DownloadProgress{
  static get DEFAULT_RADIUS(){
    return 12;
  }
  static update(target,percentage=0){
    const START=Math.PI*0.5;
    const TAU=Math.PI*2;
    const path=document.querySelector("#"+target);
    console.log(path);
    if(!path){
      return;
    }
    const radius=(path.dataset.radius || DownloadProgress.DEFAULT_RADIUS);
    const targetX=radius-Math.cos(START+(percentage*TAU))*radius;
    const targetY=radius-Math.sin(START-percentage*TAU)*radius;
    const largeArcFlag=percentage>0.5?1:0;

    const points=[
      `M ${radius} 0`,
      `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${targetX} ${targetY}`,
      `L ${radius} ${radius}`
    ];
    path.setAttribute("d",points.join(" "));
    if(percentage==1){
      $("#video-up-video").hide();
      $("#video-down-video").show(200);
    }
  }
}
