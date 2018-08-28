const fs = require('fs')

function hello() {
  console.log('hello');
}

setTimeout({
  console.log('hello');
}, 4000);
