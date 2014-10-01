var path = require('path')
  , util = require('util')
  , glue = require('cli-interface')
  , cli = require('cli-command')
  , help = require('cli-help')
  , logger = require('cli-logger')
  , base = path.normalize(path.join(__dirname, '..'));

var CliCompiler = function() {
  glue.apply(this, arguments);
}

util.inherits(CliCompiler, glue);

CliCompiler.prototype.configure = function() {
  var file = path.join(__dirname, this.name() + '.md');
  var options = {
    commands: {},
    options: {}
  }
  var conf = {
    start: {
      time: new Date(),
      cwd: process.cwd()
    },
    stdin: true,
    trace: process.env.NODE_ENV === 'devel',
    compiler: {
      input: [file],
      output: path.join(__dirname, this.name() + 'c.js'),
      definition: options,
      cache: process.env.NODE_ENV !== 'devel'
    },
    command: {
      dir: path.join(__dirname, 'command'),
      //required: true,
      delimiter: /[\/:]/,
      //before: before
    },
    manual: {
      dir: path.join(base, 'doc', 'man'),
      dynamic: process.env.NODE_ENV === 'devel'
    },
    help: {
      width: 26
    },
    //boot: boot,
    //ready: ready,
  };
  this
    .configure(conf)
    .usage();
}

CliCompiler.prototype.use = function() {
  var opts = {level: logger.INFO, json: true};
  this
    .use(require('cli-mid-color'))
    .use(require('cli-mid-logger'), opts)
}

CliCompiler.prototype.on = function() {
  var scope = this
    , conf = this.configure();
  this
    .once('load', function(req) {
      this
        .use(require('cli-mid-manual'))
        .help('--help')
        .version(null, null, 'Print version and exit');
    })
    .on('help:trailers', function ontrailers(doc, data, stream) {
      var i, cmd, col, conf = this.configure();
      var cmds = [
        {
          name: util.format('%s --help <cmd>', data.name),
          message: 'quick help on <cmd>'
        },
        {
          name: util.format('%s help <cmd>', data.name),
          message: 'documentation for <cmd>'
        },
      ];

      if(doc.style === 'cmd') {
        doc.print(stream);
        for(i = 0;i < cmds.length;i++) {
          cmd = cmds[i];
          col = doc.toColumns.call(doc, cmd.name, cmd.message);
          doc.print(stream, col.left + col.right);
        }
      }

      if(doc.style !== 'man') {
        // overall footer
        doc.print(stream);
        doc.print(stream,
          util.format('%s@%s %s',
            data.name, data.version, path.dirname(__dirname)));
      }
    })
    .on('empty', function(help, version, req, next) {
      var conf = this.configure();
      help.call(this, 'cmd', req, next);
    })
    .once('complete', function(req) {
      // standard end of execution
      if(process.env.NODE_ENV !== 'test') {
        process.exit(0);
      }
    })
}

module.exports = function(pkg, name, description) {
  return new CliCompiler(pkg, name, description);
}
