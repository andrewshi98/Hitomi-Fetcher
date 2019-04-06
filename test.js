path = require('path');

const HitomiFetcher = require("./lib/hitomi-fetcher");

async function testFun() {
  var test = new HitomiFetcher.HitomiFetcher(path.resolve(__dirname));
  console.log(test.config);
  test.state = null;
  console.log(test.state);
}

testFun();