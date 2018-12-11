const exec=require("child-process-promise").exec;
var dirname=__dirname.replace(/\\/g,"/");
dirname=dirname.substr(0,dirname.length-4);
const fluent_ffmpeg = require('fluent-ffmpeg');
const ffmpeg=dirname+"/ffmpeg/bin/ffmpeg.exe";
const fs=require("fs");
const path=require("path");
const ffprobe=dirname+"/ffmpeg/bin/ffprobe.exe";
const shakaPackager=dirname+"/shaka_packager/packager-win.exe";
var _360,_540,_720;


class MasterPlaylist{
  static _variables(metadata){
    var size=metadata.tracks[0].size+metadata.tracks[1].size;
    var duration=(metadata.duration/1000)/60;
    var calc_bandwidth=(size/(duration*.0075))/1000;
    var avg360=calc_bandwidth-(calc_bandwidth*(10.9363/100));
    var avg540=calc_bandwidth-(calc_bandwidth*(9.57765/100));
    var avg720=calc_bandwidth-(calc_bandwidth*(8.4154/100));
    console.log(metadata.tracks[0].bitrate.toFixed()+" "+metadata.tracks[0].track_width+"x"+metadata.tracks[0].track_height);
    return {
      codec_name:metadata.tracks[1].codec+", "+metadata.tracks[0].codec,
      bit_rate:metadata.tracks[0].bitrate,
      size:metadata.tracks[0].size+metadata.tracks[1].size,
      time:metadata.tracks[1].duration/1000,
      resolution: metadata.tracks[0].track_width+"x"+metadata.tracks[0].track_height,
      _bandwidth:calc_bandwidth.toFixed(),//bandwidth calculation
      _360_avg_bandwidth:(avg360).toFixed(),//Average bandwidth calculation for 360p
      _540_avg_bandwidth:(avg540).toFixed(),//Average bandwidth calculation for 360p
      _720_avg_bandwidth:(avg720).toFixed(),//Average bandwidth calculation for 360p
    }
  }
  static _m3box(file_name){
    var MP4Box = require('mp4box');
    var mp4boxfile = new MP4Box.MP4Box();
    var arrayBuffer = new Uint8Array(fs.readFileSync(file_name)).buffer;
    arrayBuffer.fileStart = 0;
    mp4boxfile.appendBuffer(arrayBuffer);
    mp4boxfile.flush();
    return mp4boxfile.getInfo();
  }
  static master_playlist_creator(video_path,_360bandwidth,_360_avg_bandwidth,_360codecs,_360resolution,_540bandwidth,_540_avg_bandwidth,_540codecs,_540resolution,_720bandwidth,_720_avg_bandwidth,_720codecs,_720resolution){
    const folder=path.dirname(video_path).replace(/\\/g,"/")+"/"+path.basename(video_path,path.extname(video_path))+`_hsl`;
    var _360m3u8_file=folder+"/360/360.m3u8";
    var _540m3u8_file=folder+"/540/540.m3u8";
    var _720m3u8_file=folder+"/720/720.m3u8";
    var master_playlist_file=folder+"/all.m3u8";
    var master_playlist=`#EXTM3U
#EXT-X-STREAM-INF:PROGRAM-ID=1,BANDWIDTH=${_360bandwidth},AVERAGE-BANDWIDTH=${_360_avg_bandwidth},CODECS="${_360codecs}",RESOLUTION=${_360resolution},FRAME-RATE=24.000,CLOSED-CAPTIONS=NONE
${_360m3u8_file}
#EXT-X-STREAM-INF:PROGRAM-ID=1,BANDWIDTH=${_540bandwidth},AVERAGE-BANDWIDTH=${_540_avg_bandwidth},CODECS="${_540codecs}",RESOLUTION=${_540resolution},FRAME-RATE=24.000,CLOSED-CAPTIONS=NONE
${_540m3u8_file}
#EXT-X-STREAM-INF:PROGRAM-ID=1,BANDWIDTH=${_720bandwidth},AVERAGE-BANDWIDTH=${_720_avg_bandwidth},CODECS="${_720codecs}",RESOLUTION=${_720resolution},FRAME-RATE=24.000,CLOSED-CAPTIONS=NONE
${_720m3u8_file}
    `;
    fs.writeFile(master_playlist_file,master_playlist,"utf8",function(err){
      if(err) Promise.reject(err);
    });
  }
  static multi_rendition(file_path){
    var _360Video=path.dirname(file_path)+"/"+path.basename(file_path,path.extname(file_path))+"360.mp4";
    var _540Video=path.dirname(file_path)+"/"+path.basename(file_path,path.extname(file_path))+"540.mp4";
    var _720Video=path.dirname(file_path)+"/"+path.basename(file_path,path.extname(file_path))+"720.mp4";
    _360=MasterPlaylist._variables(MasterPlaylist._m3box(_360Video));
    _540=MasterPlaylist._variables(MasterPlaylist._m3box(_540Video));
    _720=MasterPlaylist._variables(MasterPlaylist._m3box(_720Video));

MasterPlaylist.master_playlist_creator(file_path,_360._bandwidth,_360._360_avg_bandwidth,_360.codec_name,_360.resolution,
                            _540._bandwidth,_540._540_avg_bandwidth,_540.codec_name,_540.resolution,
                            _720._bandwidth,_720._720_avg_bandwidth,_720.codec_name,_720.resolution
                          );

  }

}
module.exports=MasterPlaylist;
