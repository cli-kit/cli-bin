$0
==

Command line interface compiler.

## Commands

* `compile, c`: Compile markdown to javascript.

## Options

* `-i, --input [file...]`: Markdown input files.
* `-o, --output [file]`: Output javascript file.
* `pkg: -k, --package [file]`: Use package descriptor.
* `nm: -n, --name [name]`: Set program name.
* `-v, --semver [semver]`: Set program version.
* `-d, --desc [desc]`: Set program description.
* `-p, --print`: Print compiled javascript.
* `-f, --force`: Force file overwrite.

## Files

If a `package.json` file exists in the current working directory and contains a `cli.compiler` object, configuration is read from the definition. Any options specified on the command line override the configuration:

"cli": {
  "compiler": {
    "input": [
      "./path/to/doc.md"
    ],
    "output": "./lib/compiled.js"
  }
}
