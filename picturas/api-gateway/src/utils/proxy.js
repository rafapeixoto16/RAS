import * as url from 'node:url';
import * as https from 'node:https';
import * as http from 'node:http';

const ProxyRequest = (baseTarget) => {
    return (req, res) => {
        const parsedUrl = url.parse(baseTarget + req.path);
        const options = {
            hostname: parsedUrl.hostname,
            port:
                parsedUrl.port || (parsedUrl.protocol === 'https:' ? 443 : 80),
            path: parsedUrl.path,
            method: 'GET',
            headers: req.headers, // TODO auth should be sent??
        };
        const protocolModule = parsedUrl.protocol === 'https:' ? https : http;

        const apiReq = protocolModule
            .request(options, (apiRes) => {
                res.writeHead(apiRes.statusCode, apiRes.headers);
                apiRes.pipe(res, { end: true });
            })
            .on('error', (err) => {
                res.status(500).json({ error: err });
            });

        req.pipe(apiReq, { end: true });
    };
};

export default ProxyRequest;
