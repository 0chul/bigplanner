const https = require('https');

https.get('https://html.duckduckgo.com/html/?q=빅플래너파트너스', (res) => {
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  res.on('end', () => {
    console.log(data.substring(0, 2000));
    // Extract links
    const regex = /<a class="result__url" href="([^"]+)">([^<]+)<\/a>/g;
    let match;
    while ((match = regex.exec(data)) !== null) {
      console.log(match[1], match[2]);
    }
  });
}).on('error', (err) => {
  console.log('Error: ' + err.message);
});
