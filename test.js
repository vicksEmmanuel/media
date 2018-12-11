const fluent_ffmpeg = require('fluent-ffmpeg');
const ffmpeg=__dirname+"/ffmpeg/bin/ffmpeg.exe";
const ffprobe=__dirname+"/ffmpeg/bin/ffprobe.exe";
const dirname=__dirname.replace(/\\/g,"/");
const fs=require("fs");
process.env.FFMPEG_PATH=ffmpeg;
var ffmetadata = require("ffmetadata");
var file_path=`C:/Users/vicksemmanuel/Desktop/Scorpion/Scorpion/1-05 Gods Plan.m4a`;
file_path=`C:/Users/vicksemmanuel/Music/04 Valentine.mp3`;
file_path=`C:/Users/vicksemmanuel/Desktop/Scorpion/Scorpion/1-05 Gods Plan.m4a`;
var artwork=`C:/Users/vicksemmanuel/Desktop/vicksemmanuel/`
artwork=`./uploads/vicksemmanuel58@gmail.com__vicksemmanuel__1530913377124/profile_image/1521125292745.jpg`;
//console.log(artwork);
/*
var data = {
		artist: "XXXTENTACION",
	};
	var options = {
		attachments: [artwork],
    "id3v2.3": true,
	};

  ffmetadata.write(file_path, data, options, function(err) {
    if(err) console.log(err);
    else console.log("done");
  });
	
const mysql=require("mysql");
const db=mysql.createConnection({
  host : "localhost",
  user : "root",
  password : "47767303hb",
  database : "app"
});
db.connect(function(err){
  if(err){
    console.log("err");
  }else{
    console.log("MySQL is connected");
  }
});


var x=fs.readFile("file.txt","utf8",function(err,data){
	var lego=data.split("\n");
	lego.forEach(function(c){
			c=c.replace("\r","");
			db.query(`insert into genres values (NULL, "${c}")`,function(error,results,fields){
				if(error) console.log("error");
				else{
					console.log("done!");
				}
			});
	})
})
*/
