#!/usr/bin/env node

const path = require('path');
const QuickLicense = require('../lib/quickLicense');
const { program } = require('commander');

program
  .version('1.0.0')
  .option('-f, --file <file>', 'Check the license of a specific file or files (comma-separated)')
  .arguments('<command>')
  .action(async (command, options) => {
    const config = await QuickLicense.loadConfig();
    const quickLicense = new QuickLicense(config);

    console.log(`Current working directory: ${process.cwd()}`);

    try {
      switch (command) {
        case 'test':
          await quickLicense.test();
          break;
        case 'license':
          await quickLicense.license();
          break;
        case 'unLicense':
          await quickLicense.unLicense();
          break;
        case 'check':
          if (options.file) {
            const files = options.file.split(',');
            await quickLicense.check(files);
          } else {
            await quickLicense.check();
          }
          break;
        default:
          console.log(`Unknown command: ${command}`);
          program.help();
      }
    } catch (err) {
      console.error(`Error executing command: ${err.message}`);
    }
  });

program.parse(process.argv);
