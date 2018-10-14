require("dotenv").config();
var request = require("request");
var keys = require("./keys.js");
var Spotify = require("node-spotify-api");
var spotify = new Spotify(keys.spotify);

var query = process.argv[2];
var term = toLowerCase(process.argv.splice(3).join(" "));

if (query === "concert-this") {

    var URL = "https://rest.bandsintown.com/artists/" + term + "/events?app_id=codingbootcamp";
    request(URL, function(error, response, data){
        if (!error && response.statusCode === 200){
            var jsonDATA = JSON.parse(data);
            console.log(jsonDATA);
        }
    });


} else if (query === "spotify-this-song") {
    if (term === "") {
        term = "The Sign ace of base";
    }
    spotify.search({ type: "track", query: term, limit: 1 }, function (error, data) {
        if (error) {
            return console.log(error);
        } else {
            //    console.log(data.tracks.items[0].artists);
            console.log(`
            Artist(s): ${data.tracks.items[0].artists.map(artist => artist.name).join(", ")}
            Song Name: ${data.tracks.items[0].name}
            Preview: ${data.tracks.items[0].preview_url}
            Album: ${data.tracks.items[0].album.name}
            `);
        }

    });

} else if (query === "movie-this") {
    if(term === ""){
        term = "Mr. Nobody";
    }
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

            console.log(`
            Title: ${jsonDATA.Title}
            Year: ${jsonDATA.Year}
            IMDB Rating: ${imdbRating}
            Rotten Tomatoes Rating: ${rtRating}
            Country: ${jsonDATA.Country}
            Language: ${jsonDATA.Language}
            Plot Summary: ${jsonDATA.Plot}
            Actors: ${jsonDATA.Actors}
            `)
        }
    })

} else if (query === "do-what-it-says") {

}