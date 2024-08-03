# Quick License

`quick-license` is a Node.js package that allows you to easily apply, check, and remove license headers from your JavaScript, CSS, and other specified files.

## Features

- Apply license headers to specified files.
- Check which files have the license header applied.
- Remove license headers from files.
- Configurable inclusion and exclusion patterns.
- Supports custom file extensions.

## Installation

Install the package globally using npm:

```bash
npm install -g quick-license
```

## Usage
### Command Line Interface
You can use `quick-license` through the command line with the following commands:

- `quick-license test`: Lists the files that will be affected based on your configuration.
- `quick-license license`: Applies the license header to the specified files.
- `quick-license unLicense`: Removes the license header from the specified files.
- `quick-license check: Checks` the license status of the specified files.
- `quick-license check -f <file>`: Checks the license status of a specific file or files (comma-separated).

Example usage:
```bash
quick-license test
quick-license license
quick-license unLicense
quick-license check
quick-license check -f path/to/file.js
quick-license check --file path/to/file1.js,path/to/file2.css
```

### Configuration

The configuration for `quick-license` can be specified in your `package.json` file under the `licenseScope` key, or in a separate `quickLicense.json` file in the root directory. If neither is found, a default configuration is used.

Example `package.json` configuration:

```json
{
  "licenseScope": {
    "include": ["www/**/*"],
    "exclude": ["www/**/test.js", "node_modules/"],
    "allowedExtensions": ["js", "css", "mjs", "ts"],
    "licenseFile": "license.txt"
  }
}
```
Example `quickLicense.json` configuration:
```json
{
  "licenseScope": {
    "include": ["www/**/*"],
    "exclude": ["www/**/test.js", "node_modules/"],
    "allowedExtensions": ["js", "css", "mjs", "ts"],
    "licenseFile": "license.txt"
  }
}
```

### License File

Create a `license.txt` file in your project root that contains the license text you want to apply. This text will be added between the predefined license start and end markers.

Example `license.txt`:

```txt
Your License Text Here
```

### Programmatic Usage

You can also use `quick-license` programmatically in your Node.js scripts:

```javascript

const QuickLicense = require('quick-license');

async function main() {
  const config = await QuickLicense.loadConfig();
  const quickLicense = new QuickLicense(config);

  await quickLicense.test();
  await quickLicense.license();
  await quickLicense.unLicense();
  await quickLicense.check();
  await quickLicense.check('path/to/file.js');
}

main().catch(err => console.error(err));` 
```
## Methods

### `test()`

Traverse and output the list of files that will be affected based on the configuration.

### `license()`

Applies the license header to the specified files.

### `unLicense()`

Removes the license header from the specified files.

### `check(filepath)`

Checks the license status of the specified files. If `filepath` is given, it returns the status of that file(s). If no parameter is given, it returns the status of all files.

### `isLicensed(file)`

Checks if the license is applied to the given file.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request on GitHub.

## License

This project is licensed under the MIT License.

