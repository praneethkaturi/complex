const redis = require('redis')
const keys = require('./config');

const redisClient = redis.createClient({
    host: keys.redisHost,
    port: keys.redisPort,
    retry_strategy: () => 1000
  });

const subscriber = redisClient.duplicate()

const fib = (index) => {
    if(index < 2) return 1
    return fib(index-1) + fib(index - 2)
}

subscriber.subscribe('insert')
subscriber.on('message', (channel, message) => {
    console.log("In worker module!");
    try{
        redisClient.hset('values', message, fib(parseInt(message)))
    }
    catch (e){
        console.log(e);
    }
})
