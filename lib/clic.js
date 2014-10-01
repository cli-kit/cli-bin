
var prg = {
  'key': 'cli',
  'name': 'cli',
  'version': '0.1.0',
  'description': {
    'md': 'Command line interface compiler.',
    'txt': 'Command line interface compiler.'
  },
  'sections': {},
  'options': {
    'color': {
      'key': 'color',
      'name': '--[no]-color',
      'description': {
        'md': 'enable or disable terminal colors',
        'txt': 'enable or disable terminal colors'
      },
      'names': ['--[no]-color'],
      'extra': false,
      'optional': true,
      'multiple': false
    }
  }
};
var pkg = {
  'name': 'cli-bin',
  'version': '0.1.0',
  'description': 'Executables for the cli toolkit',
  'author': 'muji <noop@xpm.io>',
  'repository': {
    'type': 'git',
    'url': 'https://github.com/freeformsystems/cli-bin'
  },
  'bugs': {
    'url': 'https://github.com/freeformsystems/cli-bin/issues',
    'email': 'muji <noop@xpm.io>'
  },
  'licenses': [{
      'type': 'MIT',
      'url': 'https://github.com/freeformsystems/cli-bin/blob/master/LICENSE'
    }],
  'directories': {
    'bin': './bin',
    'man': './man'
  },
  'keywords': [
    'cli',
    'bin',
    'command',
    'compiler'
  ],
  'dependencies': {
    'cli-command': '^0.8.283',
    'cli-compiler': '^0.1.31',
    'cli-help': '0.0.12',
    'cli-interface': '^1.0.17',
    'cli-logger': '^0.5.31',
    'cli-mid-color': '^1.0.7',
    'cli-mid-logger': '^1.0.3',
    'cli-mid-manual': '^1.0.6',
    'ttycolor': '^0.8.13'
  },
  'devDependencies': {
    'chai': '^1.9.1',
    'istanbul': '^0.3.2',
    'mocha': '^1.21.4'
  },
  'engine': ['node >= 0.10.21'],
  'scripts': {
    'readme': 'mdp --force -v',
    'test': 'NODE_ENV=test istanbul cover _mocha -- -u bdd --recursive --bail --reporter list -A test/spec'
  },
  'mdp': {
    'title': 'Cli',
    'pedantic': true,
    'include': 'doc/readme',
    'require': 'lib',
    'links': 'links.md',
    'toc': 'Table of Contents',
    'base': 'https://github.com/freeformsystems/cli-bin',
    'partial': [
      {
        'inc': [
          'introduction.md',
          'install.md',
          'test.md'
        ]
      },
      { 'inc': ['license.md'] }
    ]
  }
};
function transformer(program, cb) {
  program.package(pkg);
  program.name(prg.name);
  program.version(prg.version);
  program.description(prg.description);
  program.detail(prg.detail);
  program.sections(prg.sections);
  program.options(prg.options);
  cb(null, program);
}
module.exports = transformer;