var http = require("http");
var redis = require('redis');
var rankingConnect = require('./rankingconnect');

//클라이언트 객체 생성
var client = redis.createClient(16379, "127.12.202.1");
//----error----//
client.on('error', function(err) {
	console.log('error'+err);
});
//------------//

var CMD_RANKING_REGISTRATION    = 0;
var CMD_RANKING_INFO            = 1;

http.createServer(function(request, responce) {
    if  (request.method == 'POST') {
        request.on("data", function (requestData) {
            console.log('requestData = '+requestData);
            var requestDataJson = JSON.parse(requestData);            
            if(requestDataJson.cmd == CMD_RANKING_REGISTRATION){
                rankingConnect.addRanking(client, requestDataJson, responce);
            }else if(requestDataJson.cmd == CMD_RANKING_INFO){
                rankingConnect.rankingList(client, requestDataJson, responce);
            }
        });
    }else{
        responce.writeHead(200, {"Content-Type": "text/plain"});
        responce.write("Error Get Method\r\n");
        responce.end();
    }
}).listen(8080);

console.log('Server Start 8080');

