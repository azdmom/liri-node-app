require("dotenv").config();
var request = require("request");
var fs = require('fs');
var keys = require("./keys.js")
var Spotify = require('node-spotify-api');
var Twitter = require('twitter');
var moment = require('moment');



var writeToLog = function(data){
    fs.appendFile("log.txt", 'r/n/r/n', function(err){
        if(err){
            throw err;
    }
    });

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
        var data = []; //empty array to hold data
        for (var i = 0; i < tweets.length; i++) {
          data.push({
              'created at: ' : tweets[i].created_at,
              'Tweets: ' : tweets[i].text,
          });
        }
        console.log(data);
        writeToLog(data);
    }
      });
} 

var spotify = new Spotify(keys.spotify);

var artistNames = function(artist) {
    return artist.name;
}

var showMusic = function(song) {
    if (song === undefined){
        song = 'The Sign';
};

    spotify.search({type: 'track', query: song, limit: 5,}, 
        function(err, data) {
            if (err) {
                 console.log('Error occurred: ' + err);
                 return;
            }
    
    //var spotInfo = "Artist(s):" + songs[i].artist + "\NSong Name: :" + songs[i];
    var songs = data.tracks.items;
    var data = []; //array to store data
    
    for (var i = 0; i < songs.length; i++) {
        data.push({
            '\NArtist(s)': songs[i].artists.map(artistNames),
            '\NSong Name: ': songs[i].name,
            '\NAlbum: ': songs[i].album.name,
            '\NPreview Song: ': songs[i].preview_url,
        });
      }
      console.log(data);
      writeToLog(data);
    });
            
}


var showMovie = function(movieName){
    if (movieName === undefined){
        movieName = 'Mr%20Nobody';
    }

var omdb =  "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=trilogy";

request(omdb, function(error, response, body){
    if (!error && response.statusCode === 200){
       var data = [];
       var parseData = JSON.parse(body);

       data.push({
        '\NTitle: ' : parseData.Title,
        '\NYear: ' : parseData.Year,
        '\NIMDB Rating: ' : parseData.imdbRating,
        '\NRotten Tomatos Rating: ' : parseData.tomatoRating,
        '\NCountry: ' : parseData.Country,
        '\NLanguage: ' : parseData.Language,
        '\NPlot: ' : parseData.Plot,
        '\NActors: ' : parseData.Actors,
       });
       console.log(data);
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
          (dataArr[0], dataArr[1]);
        } else if (dataArr.length == 1) {
          (dataArr[0]);
        }
    
      });    
}

var pressPlay = function(keyword, secondThing) {
    if (keyword === 'my-tweets') {
      showTweets();
    } else if (keyword === 'spotify-this-song') {
      showMusic(secondThing);
    } else if (keyword === 'movie-this'){
      showMovie(secondThing);
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