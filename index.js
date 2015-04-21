var assert = require('assert')
var child_process = require('child_process')
var ExitError = require('exit-error')

module.exports = function run(cmd, options, cb) {
  if (typeof options === 'function') {
    cb = options
    options = undefined
  }

  var opts = options || {}
  var runner = opts.runner || child_process

  if (options.sudo)
    cmd = 'sudo ' + cmd

  console.log('running:', cmd)

  var child = runner.spawn('/bin/sh', ['-c', cmd], options)

  // TODO: make this output something fancier
  if (child.stdout) child.stdout.pipe(process.stdout)
  if (child.stderr) child.stderr.pipe(process.stderr)

  child.on('close', function(code, signal) {
    cb(ExitError(cmd, code, signal))
  });

  return child
}
