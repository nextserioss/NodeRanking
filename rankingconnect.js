//랭킹 추가
function addRanking(client, requestDataJson, responce) {
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
}
//랭킹 리스트
function rankingList(client, requestDataJson, responce) {
    var args = [ 'ranking', requestDataJson.start, requestDataJson.end, "WITHSCORES" ];
    client.zrevrange(args, function(err, reply){
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

exports.addRanking = addRanking;
exports.rankingList = rankingList;