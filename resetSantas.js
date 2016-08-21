
/**
 * Module dependencies.
 */
var redis = require('redis');
var db = redis.createClient(6379, '127.0.0.1');


    var idsCount, counter = 0;

    db.SET('santasMixed', 'false', function(){
        console.log('mix canceled');
    });

    db.SMEMBERS('santas', function(err, keys){
        idsCount = keys.length;
        if(!idsCount){
            console.log('have no santas');
        } else {
            keys.forEach(function(key){

                db.DEL('anon_santa_'+key, function(){
                    counter++;
                    if(idsCount == counter){
                        db.DEL('santas', function(){
                            db.SET('santasMixed', 'false', function(){
                                console.log('all santas are removed');
                            });

                        });
                    }
                });
            });
        }
    });

