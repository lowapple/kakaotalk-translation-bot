module.exports = function (app, fs) {
	// 키보드
	app.get('/keyboard', function (req, res) {
		fs.readFile(__dirname + "/../data/" + "keyboard.json", 'utf8', function (err, data) {
			console.log(data);
			res.end(data);
		});
	});

	// 메시지
	app.post('/message', function (req, res) {
		var result = {};

		//if (!req.body["user_key"] || !req.body["type"] || !req.body["content"]) {
		//	result["success"] = 0;
		//	result["error"] = "invalid request";
	//		res.json(result);
	//		return;
		}

		if (req.body["content"] == "도움말" || req.body["content"] == "만든이") {
			fs.readFile(__dirname + "/../data/message.json", 'utf8', function (err, data) {
				var messages = JSON.parse(data);

				if (req.body["content"] == "도움말")
					messages["message"] = {
						"text": "영어단어를 입력하시면 뜻이 표시됩니다.\n반대로 한글을 입력하면 영어단어가 표시됩니다."
					};
				else
					messages["message"] = {
						"text": "Fliplope가 개발하였습니다."
					};

				fs.writeFile(__dirname + "/../data/message.json",
					JSON.stringify(messages, null, '\t'), "utf8",
					function (err, data) {})

				fs.readFile(__dirname + "/../data/message.json", 'utf8', function (err, data) {
					// console.log("Request_user_key : " + req.body["user_key"]);
					// console.log("Request_type : keyboard - " + req.body["content"]);
					res.end(data);
					return;
				})
			})
		} else {
			// 단어 파싱
			var request = require('request');
			var cheerio = require("cheerio");
			var url = 'http://alldic.daum.net/search.do?q=' + req.body["content"];
			var messages = JSON.parse(data);

			request(url, function (error, response, body) {
				if (error) throw error;
				var $ = cheerio.load(body);
				var wordpage = $("#mArticle div.cleanword_type.kuek_type").first();
				var word = wordpage.find("div.search_cleanword strong a").text();
				var means = $("ul.list_search").first();
				var meaning = $(means).find("li").text();
				// --------------
				console.log(word);
				console.log(meaning);
				messages["message"] = {
						"text": word + "\n" + meaning
				};

				fs.writeFile(__dirname + "/../data/message.json",
					JSON.stringify(messages, null, '\t'), "utf8",
					function (err, data) {})

				fs.readFile(__dirname + "/../data/message.json", 'utf8', function (err, data) {
					res.end(data);
					return;
				})
			});
		}
	});

	// 친구추가
	app.post('/friend', function (req, res) {
		var result = {};

		// 요청 param 체크
		if (!req.body["user_key"]) {
			result["success"] = 0;
			result["error"] = "invalid request";
			res.json(result);
			return;
		}

		// 파일 입출력
		fs.readFile(__dirname + "/../data/friend.json", 'utf8', function (err, data) {
			var users = JSON.parse(data);
			// 이미 존재하는 친구일 경우
			if (users[req.body["user_key"]]) {
				result["success"] = 0;
				result["error"] = "duplicate";
				res.json(result);
				return;
			}

			// 친구추가
			users[req.body["user_key"]] = req.body;
			fs.writeFile(__dirname + "/../data/friend.json",
				JSON.stringify(users, null, '\t'), "utf8",
				function (err, data) {
					result = 200;
					res.json(result);
					return;
				})
		})
	});

	// 친구삭제(차단)
	app.delete('/friend/:user_key', function (req, res) {
		var result = {};

		// 파일 입출력
		fs.readFile(__dirname + "/../data/friend.json", "utf8", function (err, data) {
			var users = JSON.parse(data);

			// 존재하지 않는 친구일 경우
			if (!users[req.params.user_key]) {
				result["success"] = 0;
				result["error"] = "not found";
				res.json(result);
				return;
			}
			// 친구 삭제
			delete users[req.params.user_key];
			fs.writeFile(__dirname + "/../data/friend.json",
				JSON.stringify(users, null, '\t'), "utf8",
				function (err, data) {
					result = 200;
					res.json(result);
					return;
				})
		})
	})

	// 채팅방 나가기
	app.delete('/chat_room/:user_key', function (req, res) {
		var result = {};
		result = 200;
		res.json(result);
		return;
	})
}