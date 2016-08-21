
/**
 * Module dependencies.
 */
var redis = require('redis');
var db = redis.createClient(6379, '127.0.0.1');
var _ = require('underscore');

function mix(array) {
    var returnArray = [];
    array.forEach(function(el){
        returnArray.push({id: el, to: "", marked: false});
    });

    function chooseRandomEl(randarray, number){
        var result = false, areNotFilled = false;
        randarray.forEach(function(el){
            if(!el.marked){
                areNotFilled = true;
            }
        });
        if(!areNotFilled){
            return false;
        }
        function randomIndex(array2){
            var index = Math.floor(Math.random() * array2.length);
            console.log(index, returnArray[index]);
            if(returnArray[index].marked || returnArray[index].id == number){
                console.log('wrong shot');
                randomIndex(array2);
            } else {
                console.log('ok');
                result = index;
                returnArray[index].marked = true;
            }
            return result;
        }
        return randomIndex(randarray);
    }

    returnArray.forEach(function(el){
        var index = chooseRandomEl(array, el.id);
        el.to = array[index];
    });

    return returnArray;
}

var found = false, santasInfo = [], idsCount, mixed, counter = 0;

db.SMEMBERS('santas', function(err, keys){
    var idsCount = keys.length;
    var mixed = mix(keys);
    console.log(mixed);
    if(idsCount<2){
        console.log('have no santas or only one santa');
    } else {
        keys.forEach(function(key){
            var to_id = _.findWhere(mixed, {id: key}).to;
            db.HSET('anon_santa_'+key, 'to_id', to_id, function(err, keys){
                counter++;

                if(idsCount == counter){
                    db.SET('santasMixed', 'true', function(){
                        console.log('santas succesfully mixed');
                    });
                }
            });
        });
    }
});




