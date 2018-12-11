const events=require("events");
var mediaAppEvent=new events.EventEmitter();
mediaAppEvent.on("peakGenerator",function(stoee){
  request(`http://localhost:3030/getPeaks?data=${stoee.audio_path}&folder=${stoee.peak_path}`, function (error, response, body) {
        if(!error && response.statusCode==200) {
          console.log(body);
        }
  });
});
const exec=require("child-process-promise").exec;
const request = require('request');
var conversion=require("./app/video_backened");
const ImageProcessing=require("./app/image_processing.js");
const fluent_ffmpeg = require('fluent-ffmpeg');
const ffmpeg=__dirname+"/ffmpeg/bin/ffmpeg.exe";
const ffprobe=__dirname+"/ffmpeg/bin/ffprobe.exe";
const dirname=__dirname.replace(/\\/g,"/");
process.env.FFMPEG_PATH=ffmpeg;
const ffmetadata = require("ffmetadata");
const shakaPackager=dirname+"/shaka_packager/packager-win.exe";
const express=require("express");
const async=require("async");
const fs=require("fs");
const ID3Writer = require('browser-id3-writer');
const Swatch=require("./app/swatch.js");
const bodyParser=require("body-parser");
const path=require("path");
const favicon=require("serve-favicon");
const logger=require("morgan");
const cookieParser=require("cookie-parser");
const session=require("express-session");
const passport=require("passport");
const LocalStrategy=require("passport-local").Strategy;
const multer=require("multer");
const flash=require("connect-flash");
const expressValidator=require("express-validator");
const bcrypt = require('bcryptjs');
const mysql=require("mysql");
const urlencoded=bodyParser.urlencoded({ extended: false });
const { check, validationResult } = require('express-validator/check');
const { matchedData, sanitize } = require('express-validator/filter');
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

const geopictures=mysql.createConnection({
  host : "localhost",
  user : "root",
  password : "47767303hb",
  database : "geopictures"
});
geopictures.connect(function(err){
  if(err){
    console.log("err");
  }else{
    console.log("MySQL is connected");
  }
});


//const forceSsl = require('express-force-ssl');
const app=express();
//app.use(forceSsl);
app.set("view engine","ejs");
app.use(express.static("public/assets"));
app.use(express.static("uploads"));
app.use(express.static("sw"));
app.use(express.static("node_modules/bcryptjs"))
app.use(logger("dev"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
  secret:"47767303hb",
  saveUninitialized :  true,
  resave : true
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(expressValidator({
  errorFormatter: function(param, msg, value){
    var namespace=param.split("."),
    root =namespace.shift(),
    formParam= root;
    while (namespace.length) {
      formParam+="["+namespace.split()+"]";
    }
    return{
      param : formParam,
      msg : msg,
      value : value
    }
  }
}));
app.use(expressValidator({
  customValidators: {
    doesEmailExists(email){
      return new Promise(function(resolve,reject){
        db.query(`select * from user where email='${email}'`,function(error,results,fields){
            if(error){
              reject(error);
            }else{
              if(results.length>0){
                reject();
              }
              else resolve();
            }
        });
      });
    },
    doesUserExists(username){
      return new Promise(function(resolve,reject){
        db.query(`select * from user where username='${username}'`,function(error,results,fields){
            if(error){
              reject(error);
            }else{
              if(results.length>0){
                reject();
              }
              else resolve();
            }
        });
      });
    },
    emailCheck(email){
      return new Promise(function(resolve,reject){
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if( re.test(String(email).toLowerCase())){
          resolve();
        }else{
          reject();
        }
      });
    },
    checkUserandPassword(user){
      return new Promise(function(resolve,reject){
        var re = /^[A-Za-z0-9_]{4,20}$/;
        if( re.test(String(user).toLowerCase())){
          resolve();
        }else{
          reject();
        }
      });
    },
    checkUploadText(text){
      return new Promise(function(resolve,reject){
        var re = /^[A-Za-z0-9_\-\.\$\!\=\(\) ]{2,200}$/;
        if(re.test(String(text).toLowerCase())) resolve();
        else reject();
      });
    },
    checkUploadGenres(genres){
      return new Promise(function(resolve,reject){
        if(genres=="ChooseGener") reject();
        else resolve();
      });
    }
  }
}));
app.use(flash());
app.use(function(req,res,next){
  res.locals.messages=require("express-messages")(req,res);
  next();
});
app.get("*",function(req,res,next){
  res.locals.user = req.user || null;
  next();
});
app.use(function(req,res,next){
  res.locals.messages=require("express-messages")(req,res);
  next();
});
app.get("/media",function(req,res){
    res.render("../views/index.ejs");
});
app.get("/",function(req,res){
    res.redirect("/media");
});
app.get("/upload",function(req,res){
  if(String(req.query).length>0){
    var data=req.query.data;
    if(data==="audio" || data==="video"){
        res.render("../views/upload.ejs",{
          data: data
        });
    }
  }
});
app.get("/email-validator",function(req,res){
  db.query(`select * from user where email='${req.query.email}'`,function(error,results,fields){
      if(!error){
        if(results.length>0) res.send("false");
        else res.send("true");
      }
  });
});
app.get("/user-validator",function(req,res){
  db.query(`select * from user where username='${req.query.username}'`,function(error,results,fields){
      if(!error){
        if(results.length>0) res.send("false");
        else res.send("true");
      }
  });
});
app.get("/404",function(req,res){
  res.send("");
})
app.get("/login-user-validator",function(req,res){
  if(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(String(req.query.username).toLowerCase())){
    db.query(`select * from user where email='${req.query.username}'`,function(error,results,fields){
        if(!error){
          if(results.length===1){
              res.send(results[0].profile_image);
          }else res.send("false");
        }
    });
  }else if(/^[A-Za-z0-9_]{4,20}$/.test(String(req.query.username).toLowerCase())){
    db.query(`select * from user where username='${req.query.username}'`,function(error,results,fields){
        if(!error){
          if(results.length===1){
              res.send(results[0].profile_image);
          }else res.send("false");
        }
    });
  }else{
      res.send("false");
  }
});
app.get("/home",ensureAuthenticated,function(req,res){
  res.render("../views/home.ejs");
});
app.get("/sign-out",function(req,res){
  req.logout();
  res.redirect("/home");
});
app.get("/genres",function(req,res){
  db.query(`select genres from genres order by genres ASC `,function(error,results,fields){
                                          if(error){
                                                        res.send(`{error : ${error}}`);
                                            }else{
                                                      //res.send(results[0].image_path);
                                                    res.send(results);
                                          }
                                });
});
app.get("/get-albums-of-users",function(req,res){
  if(req.user){
    db.query(`select album_name, album_artwork_path, album_path, year(date_created) as date_created, genres, privacy, description, artist_name from albums where user_id=${req.user.id}`,function(error,results,fields){
      if(error) Promise.reject(error);
      else res.send(results);
    });
  }else{
    res.send("404!");
  }
});
app.get("/user-playlist",function(req,res){
  if(req.user){
    db.query(`select id, user_id, playlist_name from playlist where user_id=${req.user.id}`,function(error,results,fields){
      if(error) Promise.reject(error);
      else res.send(results);
    });
  }else{
    res.send("404!");
  }
});
app.get("/user-create-playlist",function(req,res){
  if(req.user){
      if(String(req.query).length>0){
        db.query(`select id, user_id, playlist_name from playlist where user_id=${req.user.id} and playlist_name="${req.query.data}"`,function(error,results,fields){
          if(error) Promise.reject(error);
          else{
            if(results.length>0) res.send("Error");
            else{
              db.query(`insert into playlist values (NULL, "${req.user.id}", "${req.query.data}", CURRENT_TIMESTAMP, "public")`,function(error,results,fields){
                if(error) Promise.reject(error);
                else{
                  db.query(`select id, user_id, playlist_name from playlist where user_id=${req.user.id} and playlist_name="${req.query.data}"`,function(error,results,fields){
                    if(error) Promise.reject(error);
                    else{
                        res.send(results);
                    }
                  });
                }
              });
            }
          }
        });
      }else{
        res.send("404!");
      }
  }else{
    res.send("404!");
  }
});
app.get("/video-category",function(req,res){
  db.query(`select id, category from video_category order by category ASC`,function(error,results,fields){
    if(error) Promise.reject(error);
    else res.send(results);
  });
});
app.get("/upload-tell",function(req,res){
  if(req.user){
    var temp=req.user.user_dir+"/video";
    var temp_2=temp+"/"+req.query.data.replace(".","_");
    var ext=req.query.data.slice((Math.max(0, req.query.data.lastIndexOf(".")) || Infinity) + 1);
    var file_name=temp_2+"/"+req.query.data.replace(".","_")+"."+ext;
    db.query(`INSERT INTO image_processing_talk VALUES (NULL, "${req.query.data}", "${file_name}", ${req.user.id}, CURRENT_TIMESTAMP)`,function(error,results,fields){
      if(error) Promise.reject(error);
      else Promise.resolve();
    });
    db.query(`INSERT INTO talk VALUES (NULL, "${req.query.data}", "${file_name}", ${req.user.id}, CURRENT_TIMESTAMP)`,function(error,results,fields){
      if(error) Promise.reject(error);
      else Promise.resolve();
    });
    var db_file_name=file_name;
    file_name=file_name.substr(1);

      fs.mkdir(temp_2+"/image",function(err){
        if(err) {
          console.log("Already exist", err);
          Promise.reject(err);
        }
        exec(`${ffmpeg} -i ${dirname+file_name} -vframes 1 -an -ss 0.5 ${dirname+path.dirname(file_name)}/image/thumbnailArt.png`)
        .then(function(result){
          Promise.resolve();
          res.send(temp_2);
        }).catch(function(err){
            Promise.reject(err);
        });
      });

      request(`http://localhost:3030/upload-image-conversion?data=${req.query.data}&user_id=${req.user.id}&file_dir=${dirname+file_name}&db_file_name=${db_file_name}&file_name=${file_name}`, function (error, response, body) {
            if(!error && response.statusCode==200) {
              console.log(body);
            }
      });

      request(`http://localhost:3030/upload-conversion?data=${req.query.data}&user_id=${req.user.id}&file_dir=${dirname+file_name}&db_file_name=${db_file_name}`, function (error, response, body) {
            if(!error && response.statusCode==200) {
              console.log(body);
            }
      });

  }else{
    res.send("404!");
  }
});
app.get("/upload-image-conversion", function(req,res){
  if(req.query.data.length>0){
    ImageProcessing._convertVideoToImages(req.query.file_name)
      .then(function(){
        var query=`DELETE FROM image_processing_talk WHERE file_name="${req.query.data}" and file_path="${req.query.db_file_name}" and user_id=${req.query.user_id}`;
         db.query(query,function(error,results,fields){
           if(error) Promise.reject(error);
           else{
             Promise.resolve();
               console.log("Done processing Image");
           }
         });
      })
      .catch(function(){
          console.log("no Image process");
      });
      res.send(req.query.data);
  }
});
app.get("/upload-conversion", function(req,res){
  if(req.query.data.length>0){
      conversion._getFileResolutionAndLoad(req.query.file_dir)
        .then(function(){
          var query=`DELETE FROM talk WHERE file_name="${req.query.data}" and file_path="${req.query.db_file_name}" and user_id=${req.query.user_id}`;
          db.query(query,function(error,results,fields){
            if(error) Promise.reject(error);
            else{
              Promise.resolve();
              console.log("Done Processing!");
            }
          });
        })
        .catch(function(err){
          console.log("Not processed");
        });
      res.send(req.query.data);
  }
});
app.get("/get-album_artwork",function(req,res){
    db.query(`select album_artwork_path from albums where album_name="${req.query.data}" and user_id=${req.query.user}`,function(errors,results,fields){
        if(errors) Promise.reject(errors);
        else{
          res.json(results[0].album_artwork_path.replace("./uploads",""));
        }
    });
});
app.get("/get-all-happening",function(req,res){
  db.query(`select * from media order by date_created desc limit 10`,function(errors,results,fields){
      if(errors) Promise.reject(errors);
      else{
          res.json(results);
      }
  });
});
app.get("/get-current-music",function(req,res){
  var data=[];
  db.query(`select * from audios limit 5`,function(errors,results,fields){
      if(errors) Promise.reject(errors);
      else{
        results.forEach(function(result){
          result.album_artwork_path=result.album_artwork_path.replace("./uploads","");
          result.pcm=result.pcm.replace("./uploads","");
          result.audio_path=result.audio_path.replace("./uploads","");
          data.push(result);
        });
        res.json(data);
      }
  });
});
app.get("/get-all-audios",function(req,res){
  var data=[];
  db.query(`select * from audios where user_id=${req.query.user} and id=${req.query.id} and privacy="public"`,function(errors,results,fields){
      if(errors) Promise.reject(errors);
      else{
          db.query(`select username from user where id=${req.query.user}`,function(errors,user_result,fields){
              if(errors) Promise.reject(errors);
              else{
                  results.forEach(function(result){
                    result.album_artwork_path=result.album_artwork_path.replace("./uploads","");
                    result.pcm=result.pcm.replace("./uploads","");
                    result.audio_path=result.audio_path.replace("./uploads","");
                    data.push(result);
                    data.push(user_result[0].username);
                  });
                  res.json(data);
              }
          });
      }
  });
});
app.get("/get-all-videos",function(req,res){
  var data=[];
  db.query(`select title,thubnail_path, year(date_created) as year_created from video where user_id=${req.query.user} and id=${req.query.id} and privacy="public"`,function(errors,results,fields){
      if(errors) Promise.reject(errors);
      else{
          db.query(`select username from user where id=${req.query.user}`,function(errors,user_result,fields){
              if(errors) Promise.reject(errors);
              else{
                  results.forEach(function(result){
                    data.push(result.title);
                    data.push(result.thubnail_path.replace("./uploads",""));
                    data.push(result.year_created);
                    data.push(user_result[0].username);
                  });
                  res.json(data);
              }
          });
      }
  });

});
app.get("/all-link",function(req,res){
  if(req.query.user){
    var data=[];
    var sort=function(array, key) {
        return array.sort(function(a, b) {
            var x = a[key]; var y = b[key];
            return ((x < y) ? -1 : ((x > y) ? 1 : 0));
        });
    }
    var audio_query=`select audios.id, audios.artist_name, audios.user_id, audios.album_name, audios.year_created, audios.privacy, audios.pcm, audios.audio_name,audios.description, audios.genres, audios.album_artwork_path, media.date_created, audios.audio_path from audios,media where audios.user_id=${req.query.user} and audios.privacy!="Private" and audios.id=media.id_media and media.type="audio"
        order by date_created;`;
    var album_query=`select id, album_name, date_created, privacy, genres, artist_name, description, user_id, album_artwork_path, album_path from albums where user_id=${req.query.user}`;
    var playlist_query=`select id, playlist_name, user_id, date_created, privacy from playlist where user_id=${req.query.user}`;
    var video_query=`select video.id, video.user_id, video.playlist_id,video.category, video.date_created, video.description as video_description, video.title as video_title, video.thubnail_path, video.privacy as video_privacy, video.video_path from video where video.user_id=${req.query.user} and video.privacy!="Private" order by video.date_created`;
    db.query(audio_query,function(errors,results,field){
        if(errors) Promise.reject(errors);
        else{
          results.forEach(function(result){
              result.type="audio";
              result.album_artwork_path=result.album_artwork_path.replace("./uploads","");
              result.audio_path=result.audio_path.replace("./uploads","");
              result.pcm=result.pcm.replace("./uploads","");
              data.push(result);
          });
          db.query(video_query,function(errors,results,field){
            if(errors) Promise.reject(errors);
            else{
              results.forEach(function(result){
                  result.type="video";
                  result.thubnail_path=result.thubnail_path.replace("./uploads","");
                  result.video_path=result.video_path.replace("./uploads","");
                  data.push(result);
              });
              db.query(album_query,function(errors,results,field){
                if(errors) Promise.reject(errors);
                else{
                  results.forEach(function(result){
                      result.type="album";
                      result.album_artwork_path=result.album_artwork_path.replace("./uploads","");
                      result.album_path=result.album_path.replace("./uploads","");
                      data.push(result);
                  });
                  db.query(playlist_query,function(errors,results,field){
                    if(errors) Promise.reject(errors);
                    else{
                      results.forEach(function(result){
                          result.type="playlist";
                          data.push(result);
                      });
                      if(data.length>0){
                        data=sort(data, 'date_created');
                        res.json(data);
                      }else{
                        res.send(data);
                      }
                    }
                  });
                }
              });
            }
          });
        }
    });
  }else{
    res.send("404!");
  }
});
app.get("/all-link-get",function(req,res){
  var query=`select id, email, user_dir, profile_image, username, company_format, phone_num, address from user where username="${req.query.data}"`;
  db.query(query,function(errors,results,fields){
    if(errors) Promise.reject(errors);
    else{
      if(results.length>0 && results.length==1){
        var data={
            id: results[0].id,
            edit: results[0].profile_image.replace("./uploads",""),
            email: results[0].email,
            username: results[0].username,
            user_dir: results[0].user_dir,
            phone_num: results[0].phone_num,
            address: results[0].address,
            video_num: 0,
            audio_num: 0,
            following: 0,
            followers: 0,
            biograf: "",
            website: results[0].email,
            cover_image: "",
            country: "",
            dtyuhsgdyujshd: results[0].profile_image
        };
        //cover_image: "https://i1.sndcdn.com/visuals-000338493990-36xBJN-t1240x260.jpg",
        if(data.dtyuhsgdyujshd=="header/images/user.svg"){
            data.dtyuhsgdyujshd="./public/assets/header/images/check.png";
        }
        //https://i1.sndcdn.com/visuals-000338493990-36xBJN-t1240x260.jpg
        query=`select count(*) as video_num from media where user_id="${data.id}" and type="video"`;
        db.query(query,function(errors,results,fields){
          if(errors)Promise.reject(error);
          else{
            data.video_num=results[0].video_num;
            query=`select count(*) as audio_num from media where user_id="${data.id}" and type="audio"`;
            db.query(query,function(errors,results,fields){
              if(errors)Promise.reject(error);
              else{
                data.audio_num=results[0].audio_num;
                res.render("../views/wave.ejs",{data: data});
              }
            });
          }
        });
      }
    }
  });
});
app.get("/profile",function(req,res){
  if(req.user){
    res.redirect("/"+req.user.username);
  }
});
var user_path,profile_path;
var storage=multer.diskStorage({
    destination : function(req,file,callback){
        callback(null,"./tmp");
      },
    filename : function(req,file,callback){
      callback(null,"user_artwork_"+Date.now()+"_"+file.originalname);
    }
});
var upload=multer({storage: storage});
app.post('/sign-up', upload.any(),function(req, res) {
  req.checkBody("email","Email already exist").doesEmailExists();
  req.checkBody("username","Username already exist").doesUserExists();
  req.checkBody("username","Username requires correct data").checkUserandPassword();
  req.checkBody("password","Password requires correct data").checkUserandPassword();
  req.checkBody("email","Email requires correct data").emailCheck();

  req.asyncValidationErrors()
    .then(function(){
      var fileArray=req.files;
      var email=req.body.email;
      var username=req.body.username;
      var password=req.body.password;
      var writePath="./uploads/"+email+"__"+username+"__"+Date.now();
      var profile_path=writePath+"/profile_image/";
      var company_format= "individual" in req.body? "individual" : "business";
      fs.mkdir(writePath);
      fs.mkdir(profile_path);
      if(fileArray.length>0){
          var profile_pic=profile_path+fileArray[0].originalname;
          async.each(fileArray,function(file,eachcallback){
            async.waterfall([
              function(callback){
                fs.readFile(file.path,function(err,data){
                  if(err){
                    var data=[];
                    data.push("An error occured. Please try again later");
                    res.send(data);
                  }else{
                      fs.unlink(file.path);
                      callback(null,data);
                  }
                });
              },
              function(data,callback){
                  fs.writeFile(profile_path+file.originalname, data, function(err){
                      if(err){
                        var data=[];
                        data.push("An error occured. Please try again later");
                        res.send(data);
                      }else{
                        callback(null,"done");
                      }
                  });
              }
            ], function(err,result){
                eachcallback();
            });
          }, function(err){
            if(err){
              var data=[];
              data.push("An error occured. Please try again later");
              res.send(data);
            }else{
                bcrypt.genSalt(10, function(err, salt) {
                    bcrypt.hash(password, salt, function(err, hash) {
                        password=hash;
                        db.query(`insert into user (id, email, password, user_dir, profile_image, username, date_created, company_format, authenticated) values(
                                                           NULL,
                                                          "${email}",
                                                          "${password}",
                                                          "${writePath}",
                                                          "${profile_pic}",
                                                          "${username}",
                                                          now(),
                                                          "${company_format}",
                                                          "false"
                                                        );`,function(error,results,fields){
                                                                if(error){
                                                                    var data=[];
                                                                    data.push("An error occured. Please try again later");
                                                                    res.send(data);
                                                                  }else{
                                                                    var data=[];
                                                                    data.push("Done!");
                                                                    res.send(data);
                                                                }
                                                      });
                    });
                });
            }
          });
      }else{
        var profile_pic="header/images/user.svg";
        bcrypt.genSalt(10, function(err, salt) {
            bcrypt.hash(password, salt, function(err, hash) {
                password=hash;
                db.query(`insert into user (id, email, password, user_dir, profile_image, username, date_created, company_format, authenticated) values(
                                                   NULL,
                                                  "${email}",
                                                  "${password}",
                                                  "${writePath}",
                                                  "${profile_pic}",
                                                  "${username}",
                                                  now(),
                                                  "${company_format}",
                                                  "false"
                                                );`,function(error,results,fields){
                                                        if(error){
                                                            var data=[];
                                                            data.push("An error occured. Please try again later");
                                                            res.send(data);
                                                          }else{
                                                            var data=[];
                                                            data.push("Done!");
                                                            res.send(data);
                                                        }
                                              });
            });
        });
      }

    }).catch(function(error){
      var data=[];
      error.forEach(function(mssg){
          data.push(mssg.msg);
      });
      res.send(data);
    });
});
app.post("/geolocation",function(req,res){
  geopictures.query(`select image_path from ${req.body.countryName} where id=${req.body.picMath}`,function(error,results,fields){
                                          if(error){
                                                        res.send(`{error : ${error}}`);
                                            }else{
                                                      res.send(results[0].image_path);
                                          }
                                });
});
app.post("/abstract",function(req,res){
  geopictures.query(`select image_path from abstract where id=${req.body.picMath}`,function(error,results,fields){
                                          if(error){
                                                        res.send(`{error : ${error}}`);
                                            }else{
                                                      res.send(results[0].image_path);
                                          }
                                });
});
function ensureAuthenticated(req,res,next){
  if(req.isAuthenticated()){
    return next();
  }else{
    res.redirect("/media");
  }
}
function  getUserById(id,callback){
  db.query(`select id, email, user_dir, profile_image, username, date_created, company_format, authenticated, phone_num, address from user where id=${id}`,callback);
}
function getUserByUsername(username,callback){
  db.query(`select * from user where username='${username}'`,callback);
}
function getUserByEmail(username,callback){
  db.query(`select * from user where email='${username}'`,callback);
}
function comparePassword(candidatePassword,hash,callback){
      bcrypt.compare(candidatePassword, hash, function(err, res) {
            callback(null,res);
      });
}
passport.serializeUser(function(user, done) {
    done(null, user.id);
});
passport.deserializeUser(function(id, done) {
  getUserById(id, function(error,results,fields) {
      if(error){
          done(error);
      }else{
          done(error, results[0]);
      }
    });
});
passport.use(new LocalStrategy({
          usernameField: "login-username",
          passwordField: "login-password"
        },function(username,password,done){
           if(/^[A-Za-z0-9_]{4,20}$/.test(String(password).toLowerCase())){
                 if(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(String(username).toLowerCase())){
                       getUserByEmail(username,  function(error,results,fields){
                             if(error){
                                  return done(error);
                             }
                             if(!results[0]){
                               return done(null,false,{message : "Unknown User"});
                             }
                             comparePassword(password, results[0].password,function(err,isMatch){
                                   if(err) return done(err);
                                   if(isMatch){
                                     return done(null,results[0]);
                                   }else{
                                     return done(null,false,{message : "Invalid Password"});
                                   }
                               });
                             });
                 }else if(/^[A-Za-z0-9_]{4,20}$/.test(String(username).toLowerCase())){
                     getUserByUsername(username,  function(error,results,fields){
                           if(error){
                                return done(error);
                           }
                           if(!results[0]){
                             return done(null,false,{message : "Unknown User"});
                           }
                           comparePassword(password, results[0].password,function(err,isMatch){
                                 if(err) return done(err);
                                 if(isMatch){
                                   return done(null,results[0]);
                                 }else{
                                   return done(null,false,{message : "Invalid Password"});
                                 }
                             });
                           });
                 }else{
                     return done(null,false,{message : "Unknown User"});
                 }
           }
           else{
                return done(null,false,{message : "Error in Password"});
           }
}));

app.post('/sign-in', function(req,res,next){
  passport.authenticate("local", function(err,user,params){
    if(err) return next(err);
    if(!user) return  res.send("error");
    req.logIn(user, function(err){
      if(err) return next(err);
      else{
            //res.redirect("/media");
            res.send("Done!");
      }
    });

  })(req,res,next);
});
app.post("/swatch-color",upload.any(),function(req,res){
    const image=req.files[0].path;
    Swatch.load(image)
      .then(function(pixels){
          Swatch.getQuantized(pixels)
          .then(function(buckets){
              Swatch.getOrderByLuminance(buckets)
              .then(function(swatch){
                  const fs=require("fs");
                  const path=require("path");
                  fs.unlink(image,function(err){
                    if(err) console.log(err);
                    else console.log("No err");
                  });
                  res.send(swatch);
              });
          });
      });
});
app.get("/swatch-color",function(req,res){
  if(req.query.path.length>0){
    const image=req.query.path;
    var func=function(){
      return new Promise(function(resolve,reject){
        Swatch.load(image)
          .then(function(pixels){
              Swatch.getQuantized(pixels)
              .then(function(buckets){
                  Swatch.getOrderByLuminance(buckets)
                  .then(function(swatch){
                      resolve(swatch);
                  });
              });
          })
      });
    }
    func().then(function(swatch){
      res.send(swatch);
    })
  }
});
var upload_storage=multer.diskStorage({
    destination : function(req,file,callback){
        callback(null,"./tmp");
      },
    filename : function(req,file,callback){
      callback(null,"mediaBox"+Date.now()+file.originalname);
    }
});
var upload_storage_upload=multer({storage: upload_storage});
function validateUploadFiles(req,res){
  return new Promise(function(resolve,reject){
    var fileArray=req.files.length;
    if(fileArray>=1){
      resolve();
    }else{
      reject(new Error());
    }
  });
}
function getEdittedName(xxx){
  xxx=xxx.replace(".mp3","");
  xxx=xxx.replace(".aa","");
  xxx=xxx.replace(".aac","");
  xxx=xxx.replace(".aax","");
  xxx=xxx.replace(".act","");
  xxx=xxx.replace(".aiff","");
  xxx=xxx.replace(".amr","");
  xxx=xxx.replace(".ape","");
  xxx=xxx.replace(".au","");
  xxx=xxx.replace(".awb","");
  xxx=xxx.replace(".dct","");
  xxx=xxx.replace(".dss","");
  xxx=xxx.replace(".dvf","");
  xxx=xxx.replace(".flac","");
  xxx=xxx.replace(".gsm","");
  xxx=xxx.replace(".iklax","");
  xxx=xxx.replace(".ivs","");
  xxx=xxx.replace(".m4a","");
  xxx=xxx.replace(".m4b","");
  xxx=xxx.replace(".m4p","");
  xxx=xxx.replace(".mmf","");
  xxx=xxx.replace(".mp3","");
  xxx=xxx.replace(".ogg","");
  xxx=xxx.replace(".oga","");
  xxx=xxx.replace(".mogg","");
  xxx=xxx.replace(".opus","");
  xxx=xxx.replace(".ra","");
  xxx=xxx.replace(".rm","");
  xxx=xxx.replace(".raw","");
  xxx=xxx.replace("sln","");
  xxx=xxx.replace(".tta","");
  xxx=xxx.replace(".vox","");
  xxx=xxx.replace(".wav","");
  xxx=xxx.replace(".wma","");
  xxx=xxx.replace(".wv","");
  xxx=xxx.replace(".webm","");
  xxx=xxx.replace(".8svx","");
  return xxx;
}
function reAddMissedProcess(item,artworkProcess,location){
    return new Promise(function(resolve,reject){
      fs.writeFile(location+item.filename,item.buffer, function(err){
            if(err){
                 var data=[];
                data.push("An error occured. Please try again later");
                reject();
           }else{
             var xxx=getEdittedName(item.filename);
             var  dataMode = {
               artist: item.albumName,
               album: item.albumTitle,
               title: xxx,
               genres: item.genres,
               date: new Date().getFullYear(),
               comment: item.soundDescription
             };
             var artworkMode={
               attachments: [artworkProcess],
             }
             ffmetadata.write(location+item.filename, dataMode, function(err) {
                 if (err) console.error("Error writing metadata", err);
                 else{
                   ffmetadata.write(location+item.filename, dataMode, artworkMode, function(err) {
                       if (err) console.error("Error writing metadata");
                       resolve();
                   });
                 }
             });
          }
      });
    });
}
function   storeAudioData(stoee,req,res){
    return new Promise(function(resolve,reject){
        db.query(`
                          INSERT INTO audios (id, album_name, year_created, audio_name, artist_name, privacy, description, user_id, genres, album_artwork_path, audio_path, pcm) VALUES (NULL, "${stoee.album_name}", ${stoee.year_created}, "${stoee.audio_name}", "${stoee.artist_name}", "${stoee.privacy}", "${stoee.description}", ${stoee.user_id}, "${stoee.genres}", "${stoee.album_artwork_path}", "${stoee.audio_path}", "${stoee.peak_path}");
                        `,function(error,results,fields){
                          if(error) reject(error);
                          else{
                              var query=`select id, privacy from audios where
                              album_name="${stoee.album_name}" and
                              year_created=${stoee.year_created} and
                              audio_name="${stoee.audio_name}" and
                              artist_name="${stoee.artist_name}" and
                               privacy="${stoee.privacy}" and
                               description="${stoee.description}" and
                               user_id=${stoee.user_id} and
                               genres="${stoee.genres}" and
                               album_artwork_path="${stoee.album_artwork_path}" and
                               audio_path="${stoee.audio_path}"`;
                                  db.query(query,function(error,results,fields){
                                                    if(error) reject(error);
                                                    else{
                                                        results.forEach(function(result){
                                                          var query_2=`INSERT INTO media (id, type, privacy, id_media,date_created, user_id) VALUES (NULL, 'audio', '${result.privacy}', ${result.id}, CURRENT_TIMESTAMP, ${req.user.id});`;
                                                          db.query(query_2,function(error,results,fields){
                                                                            if(error) reject(error);
                                                                            else{
                                                                              resolve();
                                                                            }
                                                          });
                                                        });
                                                    }
                                  });
                          }
        });
    });
}
function getPeaks(audioBuffer, length) {
     var buffer = audioBuffer;
     var sampleSize = buffer.length / length;
     var sampleStep = ~~(sampleSize / 10) || 1;
     var channels = buffer.numberOfChannels;
     var peaks = new Float32Array(length);

     for (var c = 0; c < channels; c++) {
         var chan = buffer.getChannelData(c);
         for (var i = 0; i < length; i++) {
             var start = ~~(i * sampleSize);
             var end = ~~(start + sampleSize);
             var max = 0;
             for (var j = start; j < end; j += sampleStep) {
                 var value = chan[j];
                 if (value > max) {
                     max = value;
                 // faster than Math.abs
                 } else if (-value > max) {
                     max = -value;
                 }
             }
             if (c == 0 || max > peaks[i]) {
                 peaks[i] = max;
             }
         }
     }

     return peaks;
 }
app.get("/getPeaks",function(req,res){
  var audio_path=req.query.data;
  var peak_folder=req.query.folder;
  var link="http://localhost:3030"+audio_path.replace("./uploads","");
  var ffprobe = require('ffprobe'),
    ffprobeStatic = require('ffprobe-static');
    ffprobe(audio_path, { path: ffprobeStatic.path }, function (err, info) {
      if (err){
         return done(err);
      }
      const ffmpegPeaks = require('ffmpeg-peaks');//width:1640
      const ffpeaks = new ffmpegPeaks({
        width: 1640,
        precision: 1,
        numOfChannels: info.streams[0].channels,
        sampleRate: info.streams[0].sample_rate
      });
      ffpeaks.getPeaks(ffmpeg,audio_path, peak_folder, (err, peaks) => {
        if (err) return console.error(err);
        fs.writeFile(peak_folder,peaks,"utf8",function(err){
            if(err) Promise.reject(err);
            else Promise.resolve();
        });
      });
    });
  res.send("done");
});
app.post("/upload-all-audio-forms",upload_storage_upload.any(),function(req,res){
    if(req.user){
        validateUploadFiles(req,res)
          .then(function(){
                req.checkBody("albumName","Who's the Artist, Dj, or Tutor").checkUploadText();
                if(req.body.soundDescription.length>0){
                  req.checkBody("soundDescription","Describe your Sound").checkUploadText();
                }
                req.checkBody("albumTitle","Give your Album a Title").checkUploadText();
                req.checkBody("genres","Invalid Genres").checkUploadText();
                req.checkBody("genres","Invalid Genres").checkUploadGenres();
                req.asyncValidationErrors()
                .then(function(){
                    var artistName=req.body.albumName;
                    var albumTitle=req.body.albumTitle;
                    var soundDescription=req.body.soundDescription;
                    var genres=req.body.genres;
                    var albumPath=req.user.user_dir+"/Album";
                    var album_path=albumPath+"/"+albumTitle+"/";
                    var album_artwork_path=album_path+"/album_artwork/";
                    var album_json=album_path+"/album_json";
                    var privacy=req.body.privacy;
                    var artworkPatternPath="";
                    var fileArray=req.files;

                    Promise.all([
                      fs.mkdir(albumPath,function(err){
                            if(err){
                                console.log("Already Exist");
                            }
                      }),
                      fs.mkdir(album_path,function(err){
                            if(err){
                                Promise.reject(err);
                              }
                      }),
                      fs.mkdir(album_artwork_path,function(err){
                            if(err){
                                Promise.reject(err);
                            }
                      }),
                      fs.mkdir(album_json,function(err){
                        if(err)Promise.reject(err);
                      })
                    ]).then(function(){
                      var artworkProcess=0;
                      var audioData=[];
                      var isAlbumArt=false;
                      fileArray.forEach(function(file){
                          if("albumArt"==file.fieldname){
                            isAlbumArt=true;
                          }
                      });
                      if(isAlbumArt){
                            async.each(fileArray,function(file,eachcallback){
                              async.waterfall([
                                function(callback){
                                  fs.readFile(file.path,function(err,data){
                                    if(err){
                                      var data=[];
                                      data.push("An error occured. Please try again later");
                                      res.send(data);
                                    }else{
                                        fs.unlink(file.path);
                                        callback(null,data);
                                    }
                                  });
                                },
                                function(data,callback){
                                  if(file.fieldname=="albumArt"){
                                          if (/^image/.test(file.mimetype) ) {
                                                artworkProcess=album_artwork_path+file.originalname//data;
                                                artworkPatternPath=album_artwork_path+file.originalname;
                                                fs.writeFile(album_artwork_path+file.originalname, data, function(err){
                                                    if(err){
                                                      var data=[];
                                                      data.push("An error occured. Please try again later");
                                                      res.send(data);
                                                    }else{
                                                      callback(null,"done");
                                                    }
                                                });
                                          }else{
                                            var data=[];
                                            data.push("Invalid file format");
                                            res.send(data);
                                          }
                                  }else{
                                          if(/^audio/.test(file.mimetype)){
                                                if(artworkProcess==0){
                                                     audioData.push({ "albumName": artistName,"soundDescription": soundDescription,"genres": genres,"albumTitle": albumTitle, "buffer": data, "filename": file.originalname});
                                                     callback(null,"done");
                                                }else{
                                                  fs.writeFile(album_path+file.originalname,data, function(err){
                                                      if(err){
                                                        var data=[];
                                                        data.push("An error occured. Please try again later");
                                                        res.send(data);
                                                      }else{
                                                        var xxx=getEdittedName(file.originalname);
                                                        var  dataMode = {
                                                          artist: artistName,
                                                          album: albumTitle,
                                                          title: xxx,
                                                          genres: genres,
                                                          date: new Date().getFullYear(),
                                                          comment: soundDescription
                                                        };
                                                        var artworkMode={
                                                          attachments: [artworkProcess]
                                                        }
                                                        ffmetadata.write(album_path+file.originalname, dataMode, function(err) {
                                                            if (err) console.error("Error writing metadata", err);
                                                            else{
                                                              ffmetadata.write(album_path+file.originalname, dataMode, artworkMode, function(err) {
                                                                  if (err) console.error("Error writing metadata");
                                                                  //Database
                                                                  var stoee={"album_name": albumTitle, "year_created": new Date().getFullYear(), "audio_name": xxx, "artist_name": artistName, "privacy": privacy, "description": soundDescription, "user_id": req.user.id, "genres": genres, "album_artwork_path": artworkPatternPath, "audio_path": album_path+file.originalname, "pcm": album_json, "lyrics": "none", "peak_path": ""};
                                                                  var slash_pos=stoee.audio_path.lastIndexOf("/"), dot_pos=stoee.audio_path.lastIndexOf("."),name=stoee.audio_path.substr(slash_pos,dot_pos);
                                                                  name=name.substr(0,name.lastIndexOf("."));
                                                                  stoee.peak_path=stoee.pcm+"/"+name+".json";
                                                                  mediaAppEvent.emit("peakGenerator",stoee);
                                                                  storeAudioData(stoee,req,res);
                                                                  callback(null,"done");
                                                              });
                                                            }
                                                        });
                                                      }
                                                  });
                                                }
                                          }else{
                                            var data=[];
                                            data.push("Invalid file format");
                                            res.send(data);
                                          }
                                  }
                                }
                              ], function(err,result){
                                  eachcallback();
                              });
                            }, function(err){
                              if(err){
                                var data=[];
                                data.push("An error occured. Please try again later");
                                res.send(data);
                              }else{
                                  audioData.forEach(function(item){
                                      reAddMissedProcess(item,artworkProcess,album_path).then(function(){
                                        //Database audio
                                        var stoee={"album_name": item.albumTitle, "year_created": new Date().getFullYear(), "audio_name": getEdittedName(item.filename), "artist_name": item.albumName, "privacy": privacy, "description": item.soundDescription, "user_id": req.user.id, "genres": item.genres, "album_artwork_path": artworkPatternPath, "audio_path": album_path+item.filename, "lyrics": "none", "pcm": album_json, "peak_path": ""};
                                        var slash_pos=stoee.audio_path.lastIndexOf("/"), dot_pos=stoee.audio_path.lastIndexOf("."),name=stoee.audio_path.substr(slash_pos,dot_pos);
                                        name=name.substr(0,name.lastIndexOf("."));
                                        stoee.peak_path=stoee.pcm+"/"+name+".json";
                                        mediaAppEvent.emit("peakGenerator",stoee);
                                        storeAudioData(stoee,req,res);
                                      });
                                  });
                                  var albumQueue=`select * from albums where user_id=${req.user.id} and album_name="${albumTitle}"`;
                                  db.query(albumQueue,function(error,results,fields){
                                      if(error){
                                        Promise.reject(error);
                                      }else{
                                        if(results.length<1){
                                          var album_query=`INSERT INTO albums (id, album_name, date_created, privacy, genres, artist_name, description, user_id, album_artwork_path, album_path)
                                                                          VALUES (NULL, "${albumTitle}", CURRENT_TIMESTAMP, "${privacy}", "${genres}", "${artistName}", "${soundDescription}", ${req.user.id}, "${artworkPatternPath}", "${album_path}");`;
                                                                          db.query(album_query,function(error,results,fields){
                                                                                            if(error){
                                                                                              console.log("Store Error !",error);
                                                                                              res.send("Store Error!");
                                                                                            }
                                                                                            else{
                                                                                                res.send("You're done!");
                                                                                            }
                                                                          });
                                        }else{
                                          res.send("You're done!");
                                        }
                                      }
                                  });
                              }
                            });
                      }else{
                            if(req.user.profile_image=='header/images/user.svg') {
                              artworkPatternPath="./uploads/default_artwork/hp_image-6155d6b.jpg";
                              artworkProcess="./uploads/default_artwork/hp_image-6155d6b.jpg"//fs.readFileSync(artworkPatternPath);
                            } else{
                              artworkPatternPath=req.user.profile_image;
                              artworkProcess="./uploads/default_artwork/hp_image-6155d6b.jpg"//fs.readFileSync(artworkPatternPath);
                            }
                            async.each(fileArray,function(file,eachcallback){
                                async.waterfall([
                                  function(callback){
                                    fs.readFile(file.path,function(err,data){
                                      if(err){
                                        var data=[];
                                        data.push("An error occured. Please try again later");
                                        res.send(data);
                                      }else{
                                          fs.unlink(file.path);
                                          callback(null,data);
                                      }
                                    });
                                  },
                                  function(data,callback){
                                    if(/^audio/.test(file.mimetype)){
                                      fs.writeFile(album_path+file.originalname,data, function(err){
                                          if(err){
                                            var data=[];
                                            data.push("An error occured. Please try again later");
                                            res.send(data);
                                          }else{
                                            var xxx=getEdittedName(file.originalname);
                                            var  dataMode = {
                                              artist: artistName,
                                              album: albumTitle,
                                              genres: genres,
                                              title: xxx,
                                              date: new Date().getFullYear(),
                                              comment: soundDescription
                                            };
                                            var artworkMode={
                                              attachments: [artworkProcess],
                                            }
                                            ffmetadata.write(album_path+file.originalname, dataMode, function(err) {
                                                if (err) console.error("Error writing metadata", err);
                                                else{
                                                  ffmetadata.write(album_path+file.originalname, dataMode, artworkMode, function(err) {
                                                      if (err) console.error("Error writing metadata");
                                                      //Database
                                                      var stoee={"album_name": albumTitle, "year_created": new Date().getFullYear(), "audio_name": xxx, "artist_name": artistName, "privacy": privacy, "description": soundDescription, "user_id": req.user.id, "genres": genres, "album_artwork_path": artworkPatternPath, "audio_path": album_path+file.originalname, "lyrics": "none", "pcm": album_json, "peak_path": ""};
                                                      var slash_pos=stoee.audio_path.lastIndexOf("/"), dot_pos=stoee.audio_path.lastIndexOf("."),name=stoee.audio_path.substr(slash_pos,dot_pos);
                                                      name=name.substr(0,name.lastIndexOf("."));
                                                      stoee.peak_path=stoee.pcm+"/"+name+".json";
                                                      mediaAppEvent.emit("peakGenerator",stoee);
                                                      storeAudioData(stoee,req,res);
                                                      callback(null,"done");
                                                  });
                                                }
                                            });
                                          }
                                      });
                                    }else{
                                      var data=[];
                                      data.push("Invalid file format");
                                      res.send(data);
                                    }
                                  }//end of function
                                ], function(err,result){
                                    eachcallback();
                                });
                              }, function(err){
                                if(err){
                                  var data=[];
                                  data.push("An error occured. Please try again later");
                                  res.send(data);
                                }else{
                                    var albumQueue=`select * from albums where user_id=${req.user.id} and album_name="${albumTitle}"`;
                                    db.query(albumQueue,function(error,results,fields){
                                        if(error){
                                          Promise.reject(error);
                                        }else{
                                          if(results.length<1){
                                            var album_query=`INSERT INTO albums (id, album_name, date_created, privacy, genres, artist_name, description, user_id, album_artwork_path, album_path)
                                                                            VALUES (NULL, "${albumTitle}", CURRENT_TIMESTAMP, "${privacy}", "${genres}", "${artistName}", "${soundDescription}", ${req.user.id}, "${artworkPatternPath}", "${album_path}");`;
                                                                            db.query(album_query,function(error,results,fields){
                                                                                              if(error){
                                                                                                console.log("Store Error !",error);
                                                                                                res.send("Store Error!");
                                                                                              }
                                                                                              else{
                                                                                                  res.send("You're done!");
                                                                                              }
                                                                            });
                                          }else{
                                            res.send("You're done!");
                                          }
                                        }
                                    });
                                }
                              });//async ends here

                      }//Ends here
                    });
                })
                .catch(function(error){
                  var data=[];
                  for(var i=0; i<error.length;i++){
                    data.push(error[i].msg);
                  }
                  res.send(data);
                });
          })
          .catch(function(error){
              var data=[];
              data.push("Error in files");
              res.send(data);
          });
    }else{
      var data=[];
      data.push("404!");
      res.send(data);
    }
});
function storeVideoData(req,res,description,thumbnail,temp){
  var selQue=`select id, privacy from video where user_id=${req.user.id} and category="${req.body.category}" and description="${description}" and title="${req.body.videoTitle}" and privacy="${req.body.privacy}" and  thubnail_path="${thumbnail}" and  video_path="${temp+"/"+req.body.video_file_name.replace(".","_")}"`;
  db.query(selQue,function(error,results,fields){
      if(error){
        Promise.reject(error);
        console.log(error);
      }else{
        results.forEach(function(result){
          var query_2=`INSERT INTO media (id, type, privacy, id_media,date_created, user_id) VALUES (NULL, 'video', '${result.privacy}', ${result.id}, CURRENT_TIMESTAMP, ${req.user.id});`;
          db.query(query_2,function(error,results,fields){
                            if(error) Promise.reject(error);
                            else{
                                Promise.resolve();
                            }
          });
        });

      }
  });
}
app.post("/upload-all-video-forms",upload_storage_upload.any(),function(req,res){
    if(req.user){
          req.checkBody("videoTitle","Incorrect title").checkUploadText();
          if(req.body.videoDescription.length>0){
            req.checkBody("videoDescription","Incorrect Description").checkUploadText();
          }
          req.asyncValidationErrors()
          .then(function(){
            var thumbnail="";
            var temp=req.user.user_dir+"/video";
            var temp_2=temp+"/"+req.body.video_file_name.replace(".","_")+"/image/";
            if(req.files.length>0){
                var ext=req.files[0].originalname.slice((Math.max(0, req.files[0].originalname.lastIndexOf(".")) || Infinity) + 1);
                fs.unlink(temp_2+"thumbnailArt.png",function(err){
                  if(err) Promise.reject(err);
                });
                fs.readFile(req.files[0].path,function(err,data){
                  if(err) Promise.reject(err);
                  else{
                    fs.writeFile(temp_2+"thumbnail."+ext,data,function(err){
                        if(err) Promise.reject(err);
                        else{
                              thumbnail=temp_2+"thumbnail."+ext;
                              fs.unlink(req.files[0].path,function(err){
                                if(err)Promise.reject(err);
                              });
                              var description="";
                              if(req.body.videoDescription.length>0){
                                description=req.body.videoDescription;
                              }
                              if(req.body.playlist =='Add to playlist'){
                                var video_query=`INSERT INTO video (id,user_id,category, date_created, description, title, privacy, thubnail_path, video_path) VALUES (NULL, ${req.user.id}, ${req.body.category}, CURRENT_TIMESTAMP, "${description}", "${req.body.videoTitle}",  "${req.body.privacy}", "${thumbnail}", "${temp+"/"+req.body.video_file_name.replace(".","_")}")`;
                                db.query(video_query,function(error,results,fields){
                                  if(error) Promise.reject(error);
                                  else{
                                    Promise.resolve();
                                    storeVideoData(req,res,description,thumbnail,temp);
                                    res.send("Done!");
                                  }
                                });
                              }else{
                                var video_query=`INSERT INTO video (id,user_id,playlist_id,category, date_created, description, title, privacy, thubnail_path, video_path) VALUES (NULL, ${req.user.id}, ${req.body.playlist}, ${req.body.category}, CURRENT_TIMESTAMP, "${description}", "${req.body.videoTitle}",  "${req.body.privacy}", "${thumbnail}", "${temp+"/"+req.body.video_file_name.replace(".","_")}")`;
                                db.query(video_query,function(error,results,fields){
                                  if(error) Promise.reject(error);
                                  else{
                                    Promise.resolve();
                                    storeVideoData(req,res,description,thumbnail,temp);
                                    res.send("Done!");
                                  }
                                });
                              }
                        }
                    });
                  }
                });
            }else{
                thumbnail=temp_2+"thumbnailArt.png";
                var description="";
                if(req.body.videoDescription.length>0){
                  description=req.body.videoDescription;
                }
                if(req.body.playlist =='Add to playlist'){
                  var video_query=`INSERT INTO video (id,user_id,category, date_created, description, title, privacy, thubnail_path, video_path) VALUES (NULL, ${req.user.id}, ${req.body.category}, CURRENT_TIMESTAMP, "${description}", "${req.body.videoTitle}",  "${req.body.privacy}", "${thumbnail}", "${temp+"/"+req.body.video_file_name.replace(".","_")}")`;
                  db.query(video_query,function(error,results,fields){
                    if(error) Promise.reject(error);
                    else{
                      Promise.resolve();
                      storeVideoData(req,res,description,thumbnail,temp);
                      res.send("Done!");
                    }
                  });
                }else{
                  var video_query=`INSERT INTO video (id,user_id,playlist_id,category, date_created, description, title, privacy, thubnail_path, video_path) VALUES (NULL, ${req.user.id}, ${req.body.playlist}, ${req.body.category}, CURRENT_TIMESTAMP, "${description}", "${req.body.videoTitle}",  "${req.body.privacy}", "${thumbnail}", "${temp+"/"+req.body.video_file_name.replace(".","_")}")`;
                  db.query(video_query,function(error,results,fields){
                    if(error) Promise.reject(error);
                    else{
                      Promise.resolve();
                      storeVideoData(req,res,description,thumbnail,temp);
                      res.send("Done!");
                    }
                  });
                }
            }
          })
          .catch(function(error){
            console.log(error+"found");
            var data=[];
            for(var i=0; i<error.length;i++){
              data.push(error[i].msg);
            }
            res.send(data);
          });
    }
});
app.post("/upload-chunk",function(req,res){
    var temp=req.user.user_dir+"/video";
    var temp_2=temp+"/"+req.body.file_name.replace(".","_");
    fs.mkdir(temp,function(err){
        if(err) Promise.reject(err);
        fs.mkdir(temp_2,function(err){
            if(err) Promise.reject(err);
                    var ext=req.body.file_name.slice((Math.max(0, req.body.file_name.lastIndexOf(".")) || Infinity) + 1);
                    var file_name=temp_2+"/"+req.body.file_name.replace(".","_")+"."+ext;
                    fs.appendFile(file_name,req.body.file, {encoding:"binary"}, function(err){
                        if(err){
                          Promise.reject(err);
                          res.sendStatus("404");
                        }else{
                          res.sendStatus("200");
                        }
                      });
        });
    });
});
app.get("/:username",function(req,res){
  var query=`select id, email, user_dir, profile_image, username, company_format, phone_num, address from user where username="${req.params.username}"`;
  db.query(query,function(errors,results,fields){
    if(errors) Promise.reject(errors);
    else{
      if(results.length>0 && results.length==1){
        var data={
            id: results[0].id,
            edit: results[0].profile_image.replace("./uploads",""),
            email: results[0].email,
            username: results[0].username,
            user_dir: results[0].user_dir,
            phone_num: results[0].phone_num,
            address: results[0].address,
            video_num: 0,
            audio_num: 0,
            following: 0,
            followers: 0,
            biograf: "",
            website: results[0].email,
            cover_image: "",
            country: "",
            dtyuhsgdyujshd: results[0].profile_image
        };
        if(Object.keys(req.query).length==2){
              if((req.query.listen.length>0) && (req.query.dxzy.length>0)){
                    var query=`select * from audios where user_id=${data.id} and id=${req.query.dxzy}`;
                    db.query(query,function(errors,results,fields){
                      if(errors)Promise.reject(errors);
                      else{
                            var data2=results[0];
                            data2.album_artwork_path=data2.album_artwork_path.replace("./uploads","");
                            data2.audio_path=data2.audio_path.replace("./uploads","");
                            res.render("../views/single.ejs",{data: `Listening to ${req.params.username} ${req.query.listen} @Media`,data2:data2, where: "single"});
                      }
                   });
              }
        }else{
          //cover_image: "https://i1.sndcdn.com/visuals-000338493990-36xBJN-t1240x260.jpg",
          if(data.dtyuhsgdyujshd=="header/images/user.svg"){
              data.dtyuhsgdyujshd="./public/assets/header/images/check.png";
          }
          //https://i1.sndcdn.com/visuals-000338493990-36xBJN-t1240x260.jpg
          query=`select count(*) as video_num from media where user_id="${data.id}" and type="video"`;
          db.query(query,function(errors,results,fields){
            if(errors)Promise.reject(errors);
            else{
              data.video_num=results[0].video_num;
              query=`select count(*) as audio_num from media where user_id="${data.id}" and type="audio"`;
              db.query(query,function(errors,results,fields){
                if(errors)Promise.reject(errors);
                else{
                  data.audio_num=results[0].audio_num;
                  res.render("../views/profile.ejs",{data: data, title:req.params.username, where: "profile"});
                }
              });
            }
          });
        }
      }else{
          res.render("../views/profile.ejs",{data: "invalid"});
      }
    }
  });
});
app.listen(3030,function(err){
  if(err) console.log(err);
  else console.log("Listening to port 3000");
});
