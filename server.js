const https = require('https');
const fs = require('fs');
const next = require('next');

const app = next({ dev: false });
const handle = app.getRequestHandler();

const httpsOptions = {
    key: fs.readFileSync('./certs/194.88.244.251-key.pem'),
    cert: fs.readFileSync('./certs/194.88.244.251.pem')
};

app.prepare().then(() => {
    https
        .createServer(httpsOptions, (req, res) => {
            handle(req, res);
        })
        .listen(3000, () => {
            console.log('> Ready on https://194.88.244.251:3000');
        });
});
