var compiler = require('cli-compiler')
  , async = require('async')
  , fs = require('fs')
  , path = require('path')
  , fsutil = require('cli-fs')
  , resolve = fsutil.resolve
  , utils = require('cli-util')
  , merge = utils.merge;

// check output exists and --force
function exists(req, cb) {
  var output = req.opts.output
    , force = this.force
    , errors = this.errors
    , wrap = this.wrap;
  fs.exists(output, function(exists) {
    if(exists && !force) {
      return cb(wrap(errors.EFORCE, [output]));
    }
    cb();
  });
}

// gather package information
function pkg(req, cb) {
  var opts = req.opts;
  if(opts.pkg) {
    try {
      req.pkg = require(opts.pkg);
    }catch(e) {
      return cb(e);
    }
    cb();
  }else{
    var file = path.join(process.cwd(), 'package.json');
    fs.exists(file, function(exists) {
      if(exists) {
        try {
          req.pkg = require(file);
        }catch(e) {
          return cb(e);
        }
      }
      cb();
    });
  }
}

function resolver(opts) {
  opts.input = opts.input.map(function(f) {
    return resolve(f);
  })
  if(opts.output) {
    opts.output = resolve(opts.output);
  }
  if(opts.pkg && typeof opts.pkg === 'string') {
    opts.pkg = resolve(opts.pkg);
  }
}

module.exports = function compile(info, req, next) {
  var opts = {
    name: this.nm,
    version: this.semver,
    description: this.desc,
    input: this.input,
    output: this.output,
    print: this.print,
    pkg: this.pkg,
    cache: false
  }

  resolver(opts);

  var scope = this
    , request = {req: req, info: info, opts: opts}
    , funcs = [
      exists
    ];

  pkg(request, function(err) {
    if(err) return next(err);

    opts.pkg = request.pkg;
    if(opts.pkg && typeof opts.pkg === 'object'
      && opts.pkg.cli && opts.pkg.cli.compiler) {
      var popts = opts.pkg.cli.compiler;
      //console.dir(popts);
      popts.name = opts.name || opts.pkg.name;
      popts.version = opts.version || opts.pkg.version;
      popts.description = opts.description || opts.pkg.description;
      popts.output = opts.output || popts.output;
      poptsinput = opts.input && opts.input.length
        ? opts.input :  popts.input || [];
      //popts.input = input
      resolver(popts);
      request.opts = opts = popts;
    }

    async.concatSeries(funcs, function(func, cb) {
      func.call(scope, request, cb);
    }, function(err, result) {
      if(err) return next(err);
      //console.dir(opts);

      compiler(opts, function(err, req) {
        if(err) return next(err);
        next();
      })
    })
  });
}
