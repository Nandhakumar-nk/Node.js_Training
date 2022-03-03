
const fs = require('fs');

const readStream = fs.createReadStream('./readme3.txt', {highWaterMark: 16});
const data = [];

readStream.on('data', (chunk) => {
    data.push(chunk);
    console.log('data :', chunk, chunk.length);
    // data : <Buffer 49 20 61 6d 20 74 72 61 6e 73 66 65 72 72 69 6e> 16
    // data : <Buffer 67 20 69 6e 20 62 79 74 65 73 20 62 79 20 62 79> 16
    // data : <Buffer 74 65 73 20 63 61 6c 6c 65 64 20 63 68 75 6e 6b> 16
});

readStream.on('end', () => {
    console.log('end :', Buffer.concat(data).toString());
    // end : I am transferring in bytes by bytes called chunk
})

readStream.on('error', (err) => {
    console.log('error :', err)
})