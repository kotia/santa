var express = require('express');
var router = express.Router();
var redis = require('redis');
var db = redis.createClient(6379, '127.0.0.1');

router.get('/', function(req, res) {
    var env = req.param('env') || process.env.NODE_ENV;

    res.render('index', { env: env });
});

router.post('/addSanta', function(req, resp){
        var params = req.body;

        db.SMEMBERS('santas', function(err, keys){
            var santaId = 0;
            if(params.id){
                santaId = params.id;
            } else {
                keys.forEach(function(key){

                    if(parseFloat(key) > parseFloat(santaId)){
                        santaId = parseFloat(key);
                    }
                });
                santaId++;
            }
            db.HMSET('anon_santa_'+santaId, {
                id: santaId,
                name: params.name,
                password: params.password,
                email: params.email,
                to_id: 'null'
            }, function(){
                db.SADD('santas', santaId, function(){
                    resp.end();
                });
            });

        });
    });

    router.post('/getSanta', function(req, resp){
        var params = req.body, found = false, respObj = {status: false, data: {}}, santasInfo = [], idsCount, toId, counter = 0;

        db.SMEMBERS('santas', function(err, keys){
            idsCount = keys.length;
            if(!idsCount){
                resp.json(respObj);
                resp.end();
            } else {
                keys.forEach(function(key){
                    db.HGETALL('anon_santa_'+key, function(err, keys){
                        counter++;
                        santasInfo.push(keys);
                        if(keys.email == params.email && keys.password == params.password){
                            found = true;
                            toId = keys.to_id;
                        }

                        if(idsCount == counter){
                            if(found){
                                respObj.status = true;
                                santasInfo.forEach(function(santa){
                                    if(santa.email == params.email){
                                        respObj.data.santaName = santa.name;
                                    }
                                    if(santa.id == toId){
                                        respObj.data.toName = santa.name;
                                    }
                                });
                            }
                            resp.json(respObj);
                            resp.end();
                        }
                    });
                });
            }

        });
    });

    router.post('/getIsMixed', function(req, res){
        db.get('santasMixed', function(err, isMixed){
            var mixed = (isMixed == 'true');
            res.json({'isMixed': mixed});
            res.end();
        });
    });

module.exports = router;
