require("dotenv").config();
var request = require("request");
var keys = require("./keys.js");
var Spotify = require("node-spotify-api");
var moment = require("moment");
var fs = require("fs");
var spotify = new Spotify(keys.spotify);

var query = process.argv[2].toLocaleLowerCase();
var term = process.argv.splice(3).join(" ").toLowerCase();


liriBot(query, term);

function liriBot(query, term){
    if (query === "concert-this") {
        concertSearch(term);
    
    } else if (query === "spotify-this-song") {
        if (term === "") {
            term = "The Sign ace of base";
        }
        spotSearch(term);
    
    } else if (query === "movie-this") {
        if(term === ""){
            term = "Mr. Nobody";
        }
        movieSearch(term);
    
    } else if (query === "do-what-it-says") {
        fs.readFile("random.txt", "utf8", function(error, data){
            if(error){
                return console.log(error);
            }
            console.log(data);
            var dataArray = data.split(",");
            query = dataArray[0];
            term = dataArray[1];
            liriBot(query, term);
        });
    }
}

function spotSearch(term){

    spotify.search({ type: "track", query: term, limit: 1 }, function (error, data) {
        if (error) {
            return console.log(error);
        } else {
            //    console.log(data.tracks.items[0].artists);
            var output = (`
            Artist(s): ${data.tracks.items[0].artists.map(artist => artist.name).join(", ")}
            Song Name: ${data.tracks.items[0].name}
            Preview: ${data.tracks.items[0].preview_url}
            Album: ${data.tracks.items[0].album.name}
            `);
            console.log(output);
            logFile(output);
        }

    });
}

function movieSearch(term){
    var URL = "http://www.omdbapi.com/?apikey=trilogy&t=" + term;
    request(URL, function (error, response, data) {
        if (!error && response.statusCode === 200) {
            var jsonDATA = JSON.parse(data);
            // console.log(jsonDATA.Ratings[0].Source === "Internet Movie Database");

            var ratingArray = jsonDATA.Ratings;
        
            var imdbRating = "not available";
            var rtRating = "not available";
            for (var i = 0; i < ratingArray.length; i++) {
                if (ratingArray[i].Source === "Internet Movie Database") {
                    imdbRating = ratingArray[i].Value;
                } else if (ratingArray[i].Source === "Rotten Tomatoes") {
                    rtRating = ratingArray[i].Value;
                }
            }

            var output = (`
            Title: ${jsonDATA.Title}
            Year: ${jsonDATA.Year}
            IMDB Rating: ${imdbRating}
            Rotten Tomatoes Rating: ${rtRating}
            Country: ${jsonDATA.Country}
            Language: ${jsonDATA.Language}
            Plot Summary: ${jsonDATA.Plot}
            Actors: ${jsonDATA.Actors}
            `);
            logFile(output);
            console.log(output);
        }
    })
}

function concertSearch(term){
    var URL = "https://rest.bandsintown.com/artists/" + term + "/events?app_id=codingbootcamp";
    request(URL, function(error, response, data){
        if (!error && response.statusCode === 200){
            var jsonDATA = JSON.parse(data);
            //console.log(jsonDATA);
            for(var i = 0; i < jsonDATA.length; i++){
                var output = (`===============
                               ${jsonDATA[i].venue.name}
                               ${moment(jsonDATA[i].datetime).format("MM/DD/YY")}
                               ===============`);
               console.log(output);
               logFile(output);
            }
        }
    });
}

function logFile(text){
    text = "\n" + "====================" + query + text + "\n" + "====================";
    fs.appendFile("log.txt", text, function(error){
        if(error){
            return console.log(error);
        }
        else {
            console.log("Content Added");
        }
    })
}