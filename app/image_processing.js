const exec=require("child-process-promise").spawn;
const fluent_ffmpeg = require('fluent-ffmpeg');
var dirname=__dirname.replace(/\\/g,"/");
dirname=dirname.substr(0,dirname.length-4);
const ffmpeg=dirname+"/ffmpeg/bin/ffmpeg.exe";
const fs=require("fs");
const path=require("path");
const ffprobe=dirname+"/ffmpeg/bin/ffprobe.exe";
class ImageProcessing{
  static _convertVideoToImages(file){
    return new Promise(function(resolve,reject){
      file=dirname+file;
      fs.mkdir(path.dirname(file)+"/image",function(err){
        if(err) {
          console.log("Already exist", err);
          Promise.reject(err);
        }
        var promise=exec(`${ffmpeg}`,[`-i`,`${file}`,`-vf`,`fps=1`,`${path.dirname(file)+"/image/"+path.basename(file,path.extname(file))}%d.png`], { capture: [ 'stdout', 'stderr' ]});
        promise.then(function(result){
            var _file=path.dirname(file)+"/image/"+path.basename(file,path.extname(file));
            var origin=path.dirname(file)+"/"+path.basename(file,path.extname(file));
            var _path=path.dirname(file)+"/image/";
            resolve(ImageProcessing._convertImagesToImage(_file,origin,_path));
        }).catch(function(err){
            reject(err);
        });
      });
    });
  }
  static _convertImagesToImage(file,origin,path){
        return new Promise(function(resolve,reject){
          fs.readdir(path,function(err,files){
              var count=files.length;
              var promise=exec(`${ffmpeg}`,[`-i`,`${file}%d.png`,`-filter_complex`,`scale=120:-1,tile=1x${count}`,`${origin}.png`], { capture: [ 'stdout', 'stderr' ]});
                  promise.then(function(result){
                      resolve(ImageProcessing._deleteFilesAndFolder(file,count,path,origin));
                  }).catch(function(err){
                      reject(err);
                  });
          });

        });
  }
  static _deleteFilesAndFolder(files,count,path,origin){
    for(let i=1;i<count;i++){
      var file=files+""+i+".png";
      fs.unlink(file,function(err){
        console.log("Can't delete file ",err);
      });
    }
  }
}
module.exports=ImageProcessing;
