
/**
 * Module dependencies.
 */

var redis = require('redis');
var db = redis.createClient(6379, '127.0.0.1');

var found = false, santasInfo = [], idsCount, counter = 0;

db.SMEMBERS('santas', function(err, keys){
    idsCount = keys.length;
    if(!idsCount){
        console.log('have no santas');
    } else {
        keys.forEach(function(key){
            db.HGETALL('anon_santa_'+key, function(err, keys){
                counter++;
                santasInfo.push(keys);

                if(idsCount == counter){
                    console.log(santasInfo);
                }
            });
        });
    }
});
