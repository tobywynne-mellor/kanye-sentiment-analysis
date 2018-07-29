//implement Giphy API

console.log("Kanye Analysis Bot Starting");

var Twit = require('twit');

var T = new Twit({
	consumer_key:         '0pRxuaafyDwv0ncaw8kFgwVsk',
	consumer_secret:      'fNYlXlJtsGkPVcpxkAd3Nxfl3KZsPisaLFkNDPBDh67Uli0Ep3',
	access_token:         '993617028773793792-SknMBrdSwwkZCn6sfAX6R0rSxy0f9jX',
	access_token_secret:  'XNX8LrG2iYAVBFyua1Pwb2uztxlH9MbhqQLxR2wGz25DD',
});

var userID = '169686021';

var stream = T.stream('statuses/filter', { follow: ( userID ) });  
stream.on('tweet', function (tweet) {
	if(tweet.user.id == userID)
	{
		var text = tweet.text;
		var params = {
			'tone_input': { 'text': text },
			'content_type': 'application/json'
		};

		var ToneAnalyzerV3 = require('watson-developer-cloud/tone-analyzer/v3');

		var toneAnalyzerV3 = new ToneAnalyzerV3({
			version: '2017-09-21',
			username: 'b0644147-6ba5-40d4-8cb9-5cf25ee548b7',
			password: 'PQo6BkJ60dDz'
		});

		toneAnalyzerV3.tone(params, function (error, response) 
		{
			if (error)
				console.log('error:', error);
			else 
			{
				var output = text; 
				var tones = response.document_tone.tones;
				tones.forEach(function(element)
				{
					output = output + '\n' + Math.round(element.score*100) + "% " + element.tone_name + ".";
				});

				if(tones.length == 0)
				{
					output = output + "\nTweet had no tone.";
				}

				output = "@kanyewest " + output; 
 				
				console.log(output);
				tweetIt(output);
			}
		});
	}
});

function tweetIt(txt){

	var tweet = {
		status : txt 
	}

	T.post('statuses/update',tweet,tweeted);
}

function tweeted(err, data, response) {
	if (err){ 
		console.log("something went wrong!");
	}else{
		console.log("Tweeted!");

	}
}

