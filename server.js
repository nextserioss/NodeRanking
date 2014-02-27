var http = require("http");
var redis = require('redis');
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
                var args = [ 'ranking', requestDataJson.score, requestDataJson.name ];
                client.zadd(args, function(err, reply){
                    if(err === null){
                        var resultData = {};
                        resultData.cmd = 0;
                        resultData.result = 0;
                        responce.writeHead(200, {'Content-Type': 'text/plain'});
                        responce.write(JSON.stringify(resultData));
                        responce.end();
                    }else{
                        console.log(err);
                        var errorResultData = {};
                        errorResultData.cmd = 0;
                        errorResultData.result = 1;
                        responce.writeHead(200, {'Content-Type': 'text/plain'});
                        responce.write(JSON.stringify(errorResultData));
                        responce.end();
                    }
                });
            }else if(requestDataJson.cmd == CMD_RANKING_INFO){
                var argsz = [ 'ranking', requestDataJson.start, requestDataJson.end, "WITHSCORES" ];
                client.zrevrange(argsz, function(err, reply){
                    if(err === null){
                        console.log(reply);
                        var resultData = {};
                        resultData.cmd = 1;
                        resultData.result = 0;
                        resultData.rankings = [];
                        var index = 0;
                        for(var i=0;i<reply.length;i+=2){
                            resultData.rankings[index] = {};
                            resultData.rankings[index].name = reply[i];
                            resultData.rankings[index].score = reply[i+1];
                            resultData.rankings[index].rank = index;
                            index++;
                        }
                        responce.writeHead(200, {'Content-Type': 'text/plain'});
                        responce.write(JSON.stringify(resultData));
                        responce.end();
                    }else{
                        console.log(err);
                        var errorResultData = {};
                        errorResultData.cmd = 1;
                        errorResultData.result = 1;
                        responce.writeHead(200, {'Content-Type': 'text/plain'});
                        responce.write(JSON.stringify(errorResultData));
                        responce.end();
                    }
                });
            }
        });
    }else{
        responce.writeHead(200, {"Content-Type": "text/plain"});
        responce.write("Hello World\r\n");
        responce.end();
    }
}).listen(8080);

console.log('Hello World');
