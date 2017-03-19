module.exports = function(app, fs)
{
    // 키보드
	app.get('/keyboard', function(req, res){
        fs.readFile( __dirname + "/../data/" + "keyboard.json", 'utf8', function (err, data) {
           console.log( data );
           res.end( data );
        });
    });
}