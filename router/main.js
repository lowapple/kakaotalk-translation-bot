module.exports = function(app, fs)
{
    // 키보드
	app.get('/keyboard', function(req, res){
        fs.readFile( __dirname + "/../data/" + "keyboard.json", 'utf8', function (err, data) {
           console.log( data );
           res.end( data );
        });
    });

    // 메시지
	app.post('/message', function(req, res){
		var result = {  };
		
        if(!req.body["user_key"] || !req.body["type"] || !req.body["content"]){
            result["success"] = 0;
            result["error"] = "invalid request";
			res.json(result);
            return;
        }
		
		if(req.body["content"] == "도움말" || req.body["content"] == "만든이")
        {
			fs.readFile( __dirname + "/../data/message.json", 'utf8',  function(err, data)
            {
				var messages = JSON.parse(data);

				if(req.body["content"] == "도움말")
                {
					messages["message"] = {"text" : "영어단어를 입력하시면 뜻이 표시됩니다. 반대로 한글을 입력하면 영어단어가 표시됩니다."};
				}
                else
                {
					messages["message"] = {"text" : "Fliplope가 개발하였습니다."};
				}
                
				fs.writeFile(__dirname + "/../data/message.json",
					JSON.stringify(messages, null, '\t'), "utf8", function(err, data) {
				})

				fs.readFile( __dirname + "/../data/message.json", 'utf8', function (err, data) {
					console.log("Request_user_key : " + req.body["user_key"]);
					console.log("Request_type : keyboard - " + req.body["content"]);
					res.end(data);
					return;
				})
			})
		}
		else 
		{
			
		}
    });
}