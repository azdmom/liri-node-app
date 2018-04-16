require("dotenv").config();
var request = require("request");
var fs = require('fs');
var keys = require("./keys.js")
var Spotify = require('node-spotify-api');
var Twitter = require('twitter');
var moment = require('moment');



var writeToLog = function(data){
    fs.appendFile("log.txt", JSON.stringify(data), function(err){
        if (err){
            console.log('error');
        } else{
            console.log("Updated log.txt!")
        }
});
}

var showTweets = function(){
    var client = new Twitter(keys.twitter);
    var params = {screen_name: 'DritaDee', count: 20};
    client.get('statuses/user_timeline', params, function(error, tweets, response) {
      if (!error) {
        console.log(tweets);
      }  else {
            //console.log(JSON.stringify(data));
          console.log(tweets + "\r\n" + "Created: " + "\r\n" + moment(tweets.date).format("MMM Do YY"));
        }
      });
} 
var showMusic = function(song) {
    var spotify = new Spotify(keys.spotify);

    spotify.search({type: 'track', query: song, limit: 1,}, 
        function(err, data) {
            if (err) {
                 console.log('Error occurred: ' + err);
                 return console.log('Spotify couldnt find.');
            }

    if (song === undefined){
                song = "The%20Sign%20Ace%20of%20Base"
    };
    
    var songs = data.tracks.items;
    var data = []; //array to store data
    
    for (var i = 0; i < data.length; i++) {
        data.push({
            '\NArtist(s)': songs[i].artist,
            '\NSong Name: ': songs[i],
            '\NAlbum: ': songs[i].album,
            '\NPreview Song: ': songs[i].preview_url,
        });
      }
      //console.log(data);
      writeToLog(data);
    });
            
}


var showMovie = function(movie){
    if (movie === undefined){
        movie = "Mr Nobody";
    }

var omdb =  "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=trilogy";

request(omdb, function(error, response, body){
    if (!error && response.statusCode === 200){
       var data = [];

       data.push({
        '\NTitle: ' : JSON.parse(Title),
        '\NYear: ' : JSON.parse(Year),
        '\NIMDB Rating: ' : JSON.parse(imdbRating),
        '\NRotten Tomatos Rating: ' : JSON.parse(tomatoRating),
        '\NCountry: ' : JSON.parse(Country),
        '\NLanguage: ' : JSON.parse(Language),
        '\NPlot: ' : JSON.parse(Plot),
        '\NActors: ' : JSON.parse(Actors),
       });
       //console.log(data);
       writeToLog(data);
    }
});
}

var doWhatItSays = function(){
    fs.readFile("random.txt", "utf8", function(error, data) {
        console.log(data);
        writeToLog(data);
        var dataArr = data.split(',')
    
        if (dataArr.length == 2) {
          pick(dataArr[0], dataArr[1]);
        } else if (dataArr.length == 1) {
          pick(dataArr[0]);
        }
    
      });    
}

var pressPlay = function(keyword, secondThing) {
    if (keyword === 'my-tweets') {
      showTweets();
    } else if (keyword === 'spotify-this-song') {
      showMusic();
    } else if (keyword === 'movie-this'){
      showMovie();
    } else if (keyword === 'do-what-it-says') {
      doWhatItSays();
    } else {
      // acts as our "default"
     console.log("Please try again!");
    }
  }

// var argv = function(arg1, arg2){
//     pressPlay(arg1, arg2);
// }

pressPlay(process.argv[2], process.argv[3]);