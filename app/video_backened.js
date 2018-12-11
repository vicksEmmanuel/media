const exec=require("child-process-promise").spawn;
var dirname=__dirname.replace(/\\/g,"/");
dirname=dirname.substr(0,dirname.length-4);
const fluent_ffmpeg = require('fluent-ffmpeg');
const ffmpeg=dirname+"/ffmpeg/bin/ffmpeg.exe";
const fs=require("fs");
const path=require("path");
const ffprobe=dirname+"/ffmpeg/bin/ffprobe.exe";
const shakaPackager=dirname+"/shaka_packager/packager-win.exe";
var _360,_540,_720;
const MasterPlaylist=require("./multi_rendition");
class Video_Backened{
  static _convertTo720(file){
    return new Promise(function(resolve,reject){
      console.log("720p");
      var promise= exec(`${ffmpeg}`,[`-y`,`-i`,`${file}`,`-c:a`,`aac`,`-ac`,`2`,`-ab`,`256k`,`-ar`,`48000`,`-c:v`,`libx264`,`-x264opts`,`${"keyint=24:min-keyint=24:no-scenecut"}`,`-b:v`,`1500k`,`-maxrate`,`1500k`,`-bufsize`,`1000k`,`-vf`,`${"scale=-2:720"}`,`-threads`,`0`,`${path.dirname(file)+"/"+path.basename(file,path.extname(file))+"720.mp4"}`], { capture: [ 'stdout', 'stderr' ]});
      promise.then(function(result){
          resolve(Video_Backened.done(result));
      }).catch(function(err){
          reject(err);
      });
    });
  }
  static done(result){
    return result.stdout+"\n Done!";
  }
  static _convertTo540(file){
    return new Promise(function(resolve,reject){
      console.log("520p");
      var promise=exec(`${ffmpeg}`,[`-y`,`-i`,`${file}`,`-c:a`,`aac`,`-ac`,`2`,`-ab`,`256k`,`-ar`,`44100`,`-c:v`,`libx264`,`-x264opts`,`${"keyint=24:min-keyint=24:no-scenecut"}`,`-b:v`,`800k`,`-maxrate`,`800k`,`-bufsize`,`500k`,`-vf`,`${"scale=-2:540"}`,`-threads`,`0`,`${path.dirname(file)+"/"+path.basename(file,path.extname(file))+"540.mp4"}`], { capture: [ 'stdout', 'stderr' ]});
      var childProcess = promise.childProcess;
      console.log('[spawn] childProcess.pid: ', childProcess.pid);
      childProcess.stdout.on('data', function (data) {
          console.log('[spawn] stdout: ', data.toString());
      });
      childProcess.stderr.on('data', function (data) {
          console.log('[spawn] stderr: ', data.toString());
      });
      promise.then(function(result){
          resolve(Video_Backened.done(result));
      }).catch(function(err){
          reject(err);
      });
    });
  }
  static _convertTo360(file){
    return new Promise(function(resolve,reject){
      console.log("360p");
      var promise=exec(`${ffmpeg}`,[`-y`,`-i`,`${file}`,`-c:a`,`aac`,`-ac`,`2`,`-ab`,`64k`,`-ar`,`22050`,`-c:v`,`libx264`,`-x264opts`,`${"keyint=24:min-keyint=24:no-scenecut"}`,`-b:v`,`400k`,`-maxrate`,`400k`,`-bufsize`,`400k`,`-vf`,`${"scale=-2:360"}`,`-threads`,`0`,`${path.dirname(file)+"/"+path.basename(file,path.extname(file))+"360.mp4"}`], { capture: [ 'stdout', 'stderr' ]});
      promise.then(function(result){
        resolve(Video_Backened.done(result));
      }).catch(function(err){
          reject(err);
      });
    });
  }
  static _createDash(os="win",file,res=1080){
    return new Promise(function(resolve,reject){
        if(os=="win"){
            console.log("Dash Processing!");
            resolve(Video_Backened._createManifest(res,file));
        }else{
          //Other operaing system configuration goes here
          resolve(Video_Backened.done());
        }
    });
  }
  static _createManifest(res,file){
    fs.mkdir(path.dirname(file)+"/"+path.basename(file,path.extname(file))+"_dash",function(err){if(err)Promise.reject(err)});
    var input_file_path=path.dirname(file).replace(/\\/g,"/")+"/"+path.basename(file);
    var input_files_path=path.dirname(file).replace(/\\/g,"/")+"/"+path.basename(file,path.extname(file));
    var output_file_path=`${path.dirname(file).replace(/\\/g,"/")+"/"+path.basename(file,path.extname(file))+"_dash/"+path.basename(file,path.extname(file))}`;
    if(res==1080){
      var promise=exec(`${shakaPackager}`,[`input=${input_file_path},stream=audio,output=${output_file_path+"_audio.mp4"}`,`input=${input_file_path},stream=video,output=${output_file_path+"_video.mp4"}`,`input=${input_files_path+"720.mp4"},stream=audio,output=${output_file_path+"720_audio.mp4"}`,`input=${input_files_path+"720.mp4"},stream=video,output=${output_file_path+"720_video.mp4"}`,`input=${input_files_path+"540.mp4"},stream=audio,output=${output_file_path+"540_audio.mp4"}`,`input=${input_files_path+"540.mp4"},stream=video,output=${output_file_path+"540_video.mp4"}`,`input=${input_files_path+"360.mp4"},stream=audio,output=${output_file_path+"360_audio.mp4"}`,`input=${input_files_path+"360.mp4"},stream=video,output=${output_file_path+"360_video.mp4"}`,`--profile`,`on-demand`,`--mpd_output`,`${output_file_path+"_Full.mpd"}`,`--min_buffer_time`,`3`,`--segment_duration`,`3`], { capture: [ 'stdout', 'stderr' ]});
      promise.then(function(result){
          console.log(result.stdout);
      })
      .catch(function(err){
        console.log(err);
      });
    }else if(res==720){
      var promise=exec(`${shakaPackager}`,[`input=${input_file_path},stream=audio,output=${output_file_path+"_audio.mp4"}`,` input=${input_file_path},stream=video,output=${output_file_path+"_video.mp4"}`,`input=${input_files_path+"540.mp4"},stream=audio,output=${output_file_path+"540_audio.mp4"}`,`input=${input_files_path+"540.mp4"},stream=video,output=${output_file_path+"540_video.mp4"}`,`input=${input_files_path+"360.mp4"},stream=audio,output=${output_file_path+"360_audio.mp4"}`,`input=${input_files_path+"360.mp4"},stream=video,output=${output_file_path+"360_video.mp4"}`,`--profile`,`on-demand`,`--mpd_output`,`${output_file_path+"_Full.mpd"}`,`--min_buffer_time`,`3`,`--segment_duration`,`3`], { capture: [ 'stdout', 'stderr' ]});
      var childProcess = promise.childProcess;
      console.log('[spawn] childProcess.pid: ', childProcess.pid);
      childProcess.stdout.on('data', function (data) {
          console.log('[spawn] stdout: ', data.toString());
      });
      childProcess.stderr.on('data', function (data) {
          console.log('[spawn] stderr: ', data.toString());
      });
      promise.then(function(result){
              console.log(result.stdout);
          })
      .catch(function(err){
            console.log(err);
          });
    }else if(res==480){
      var promise=exec(`${shakaPackager}`,[`input=${input_file_path},stream=audio,output=${output_file_path+"_audio.mp4"}`,`input=${input_file_path},stream=video,output=${output_file_path+"_video.mp4"}`,`input=${input_files_path+"360.mp4"},stream=audio,output=${output_file_path+"360_audio.mp4"}`,`input=${input_files_path+"360.mp4"},stream=video,output=${output_file_path+"360_video.mp4"}`,`--profile`,`on-demand`,`--mpd_output`,`${output_file_path+"_Full.mpd"}`,`--min_buffer_time`,`3`,`--segment_duration`,`3`], { capture: [ 'stdout', 'stderr' ]});
      promise.then(function(result){
        console.log(result.stdout);
      })
      .catch(function(err){
        console.log(err);
      });
    }else if(res==0){
      var promise=exec(`${shakaPackager}`,[`input=${input_file_path},stream=audio,output=${output_file_path+"_audio.mp4"}`,`input=${input_file_path},stream=video,output=${output_file_path+"_video.mp4"}`,`--profile`,`on-demand`,`--mpd_output`,`${output_file_path+"_Full.mpd"}`,`--min_buffer_time`,`3`,`--segment_duration`,`3`], { capture: [ 'stdout', 'stderr' ]});
      promise.then(function(result){
        console.log(result.stdout);
      })
      .catch(function(err){
        console.log(err);
      });
    }
  }
  static _getFileResolutionAndLoad(file){
    return new Promise(function(resolve,reject){
      fluent_ffmpeg.setFfprobePath(ffprobe);
      fluent_ffmpeg.ffprobe(file, function(err, metadata) {
          if (err) {
              //console.error(err);
              reject(err);
          } else {
              var resolution=metadata.streams[0].width+"x"+metadata.streams[0].height;
              fs.mkdir(path.dirname(file)+"/"+path.basename(file,path.extname(file))+`_hsl`, function(err){
                if(err) reject(err);
              });
              Video_Backened._convertTo720(file)
                .then(function(x){
                    Video_Backened._getm3u8Files(file,720);
                    Video_Backened._convertTo540(file)
                      .then(function(y){
                          Video_Backened._getm3u8Files(file,540);
                          Video_Backened._convertTo360(file)
                            .then(function(q){
                                Video_Backened._getm3u8Files(file,360);
                                Video_Backened._createDash("win",file,1080);
                                MasterPlaylist.multi_rendition(file);
                                resolve();
                            });
                      });
                });
          }
      });
    });
  }
  static _getm3u8Files(file,resolution){
    return new Promise(function(resolve,reject){
      resolve(Video_Backened.m3u8(file,resolution));
    });
  }
  static m3u8(file,resolution){
    const video=path.dirname(file).replace(/\\/g,"/")+"/"+path.basename(file,path.extname(file))+`${resolution}.mp4`;
    const folder=path.dirname(file).replace(/\\/g,"/")+"/"+path.basename(file,path.extname(file))+`_hsl`;
    const dir=folder+`/${resolution}`;
    const files=dir+"/fileSequence";
    fs.mkdir(dir,function(err){
      if(err) Promise.reject(err);
    });
    var promise=exec(`${ffmpeg}`,[`-y`,`-i`,`${video}`,`-hls_time`,`9`,`-hls_segment_filename`,`${files}%d.ts`,`-hls_playlist_type`,`vod`,`${dir+`/`+resolution+`.m3u8`}`], { capture: [ 'stdout', 'stderr' ]});
    promise.then(function(result){
        console.log(result.stdout);
    })
    .catch(function(err){
      console.log(err);
    });
  }
}

module.exports=Video_Backened;
