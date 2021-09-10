const Hapi = require('hapi');
const Routes = require('./routes');
const HapiSwagger = require('hapi-swagger');
const Good = require('good');
const Vision = require('vision');
const Inert = require('inert');
const port = process.env.PORT || 3000;
let routes = Routes;

const server = new Hapi.Server({
    port: port,
    host: 'localhost'
});

 server.route(routes);

const start = async () => {
    try {
        await server.register(Inert);
        await server.register(Vision);
        await server.register({
            plugin: HapiSwagger,
            options: {
                info: {
                    title: 'Documentation',
                    version: '1.0.0',
                    description: 'API documentation'
                }
            }
        });
        await server.register({
            plugin: Good,
            options: {
                reporters: {
                    consoleReporters: [
                        {
                            module: 'good-console',
                            args: [{ log: '*', response: '*' }]
                        }
                    ]
                }
            }
        });
        await server.start();
        console.log('Server started at port: ' + port);
    } catch (err) {
        console.log(err);
        throw err;
    }
};

start();

module.exports = server;