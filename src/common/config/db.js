'use strict';
/**
 * db config
 * @type {Object}
 */
export default {
    type: 'mongo',
    log_sql: true,
    log_connect: true,
    adapter: {
        mysql: {
            host: '127.0.0.1',
            port: '',
            database: '',
            user: '',
            password: '',
            prefix: '',
            encoding: 'utf8'
        },
        mongo: {
            host: '120.25.98.104',
            port: '27017',
            database: 'schools',
            user: 'admin',
            password: 'mypass',
            prefix: '',
            encoding: 'utf8'
        }
    }
};
