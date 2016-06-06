var fs = require('fs');
var path = require("path")
var config = require("../../../../config.json");
var moment = require("moment");
var colors = require('colors');
var Canvas = require('canvas');

module.exports = function(engine){
  var env = {};
  var canvas = undefined;
  var context = undefined;
  var artworkPath = undefined;

  env.save = function(){
    var filename = config.name + "_" + moment().format("YYYYMMDDHHmmss") + ".jpg";
    artworkPath = path.resolve(__dirname, '..', '..', '..', '..', 'print') + '/'+filename
    var out = fs.createWriteStream(artworkPath);
    var stream = canvas.jpegStream({quality: 100});

    stream.on('data', function(chunk){
      out.write(chunk);
    });

    console.log("– Artwork saved at ".green + artworkPath.toString().green)
  }

  env.done = function() {
    engine.stop()
    env.save()
    updateReadme()
  }

  env.createContext = function(){
    canvas = new Canvas(parseInt(config.width), parseInt(config.height));
    ctx = canvas.getContext('2d');
    return ctx;
  }
  
  function updateReadme(){
    var filename = path.resolve(__dirname, '..', '..', '..', '..', 'README.md');
    fs.readFile(filename, 'utf8', function (err,data) {
      if (err) {
        return console.log(err);
      }
      var result = data.replace(/:NAME:/g, config.name);
      result = result.replace(/:FILEPATH:/g, artworkPath)
      fs.writeFile(filename, result, 'utf8', function (err) {
         if (err) return console.log(err);
      });
    });
  }

  return env;
};