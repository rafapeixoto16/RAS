import proxy from 'express-http-proxy';

export default function proxyAuthRequest(endpoint) {
    return proxy(endpoint, {
        proxyReqOptDecorator: function(proxyReqOpts, srcReq) {
            delete proxyReqOpts.headers.authorization;

            if (srcReq.user) {
                proxyReqOpts.headers.authorization = JSON.stringify(srcReq.user);
            }

            return proxyReqOpts;
        }
    });
}
