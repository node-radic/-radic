import globule = require('globule');
import { extname } from 'path';


let logs     = {
    atlassian: [],
    system   : [],
    server   : [],
    sonar    : []
}
let partials = {
    atlassian: [
        '/opt/atlassian/jira/logs/catalina.out',
        '/opt/atlassian/confluence/logs/catalina.out',
        '/var/atlassian/application-data/bitbucket/log/launcher.log',
        '/var/atlassian/application-data/bitbucket/log/atlassian-bitbucket.log',
        '/var/atlassian/application-data/bitbucket/log/atlassian-bitbucket-access.log',
        '/var/atlassian/application-data/jira/log/atlassian-greenhopper.log',
        '/var/atlassian/application-data/jira/log/atlassian-jira.log',
        '/var/atlassian/application-data/jira/log/atlassian-jira-security.log',
        '/var/atlassian/application-data/confluence/log/atlassian-confluence.log',
        '/var/atlassian/application-data/confluence/log/atlassian-synchrony.log'
    ],
    system   : [
        'mail',
        'auth',
        'kern',
        'dpkg',
        'fail2ban',
        'alternatives',
        'mintsystem',
        'boot',
        'bootstrap'
    ],
    server   : [
        'psa-horde/psa-horde',
        'bacula/bacula',
        'jenkins/jenkins',
        'plesk-php*-fpm/error',
        'postgresql/postgresql-*-main',
        'redis/rediss-server',
        'sw-cp-server/access',
        'sw-cp-server/sw-engine',
        'tomcat*/catalina.out',
        'nginx/error',
        'nginx/access',
        'apache2/access',
        'apache2/error',
        'apache2/suexec',
        'apache2/other_vhosts_access',
        'cups/access_log',
        'cups/error_log',
        'mysql/error.log'
    ],
    sonar    : [
        'access',
        'ce',
        'es',
        'web',
        'sonar'
    ]
};

export function mapper(names: string[], prefix = '/var/log/', postfix = '.log') {
    let paths = [];
    names.forEach(name => {
        let ext = postfix;
        if ( extname(name).length > 0 ) {
            ext = '.' + extname(name);
        }
        globule.find(`${prefix}${name}${postfix}`, `${prefix}${name}`).forEach(path => paths.push(path))
    })
    return paths
}

logs.atlassian = mapper(partials.atlassian, '','')
logs.system = mapper(partials.system)
logs.server = mapper(partials.server)
logs.sonar = mapper(partials.sonar, '/opt/sonar/logs')


export {logs}
// globule.find('/var/log/**/*.log', '/var/atlassian');
