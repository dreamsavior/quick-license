const fs = require('fs').promises;
const path = require('path');
const glob = require('glob');

class QuickLicense {
  constructor(config) {
    this.config ||= {};
    this.config.include = config.include || [];
    this.config.exclude = config.exclude || [];
    this.config.allowedExtensions = config.allowedExtensions || ['js', 'css', 'mjs', 'ts'];
    this.config.licenseFile = config.licenseFile || 'license.txt';

    this.LICENSE_FILE = path.resolve(process.cwd(), this.config.licenseFile);
    this.LICENSE_START = '/**=====LICENSE STATEMENT START=====';
    this.LICENSE_END = '=====LICENSE STATEMENT END=====*/';
  }

  async loadLicense() {
    this.LICENSE_CONTENT = `${this.LICENSE_START}\n${await fs.readFile(this.LICENSE_FILE, 'utf8')}\n${this.LICENSE_END}\n`;
  }

  isInList(file, patterns) {
    return patterns.some(pattern => glob.sync(pattern, { nodir: true, cwd: process.cwd() }).includes(file));
  }

  filterByExtension(files) {
    const allowedExtensions = this.config.allowedExtensions.map(ext => `.${ext}`);
    return files.filter(file => allowedExtensions.includes(path.extname(file)));
  }

  async getFiles() {
    let files = [];
    this.config.include.forEach(pattern => {
      console.log("Handling pattern:", pattern);
      files = files.concat(glob.sync(pattern, { nodir: true, cwd: process.cwd() }));
    });
    files = files.filter(file => !this.isInList(file, this.config.exclude));
    files = this.filterByExtension(files);
    return [...new Set(files)]; // Remove duplicates
  }

  async isLicensed(file) {
    const content = await fs.readFile(file, 'utf8');
    return content.includes(this.LICENSE_START) && content.includes(this.LICENSE_END);
  }

  async test() {
    const files = await this.getFiles();
    console.log('Files affected:', files);
  }

  async license() {
    const files = await this.getFiles();
    await this.loadLicense();
    for (const file of files) {
      if (!await this.isLicensed(file)) {
        const content = await fs.readFile(file, 'utf8');
        await fs.writeFile(file, this.LICENSE_CONTENT + content, 'utf8');
        console.log(`License applied to ${file}`);
      }
    }
  }

  async unLicense() {
    const files = await this.getFiles();
    await this.loadLicense();
    const licenseRegex = new RegExp(
      this.LICENSE_START.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') +
      '[\\s\\S]*?' +
      this.LICENSE_END.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') +
      '\\n'
    );
    for (const file of files) {
      const content = await fs.readFile(file, 'utf8');
      if (await this.isLicensed(file)) {
        const newContent = content.replace(licenseRegex, '');
        await fs.writeFile(file, newContent, 'utf8');
        console.log(`License removed from ${file}`);
      }
    }
  }

  async check(filepath) {
    let files = [];
    if (filepath) {
      if (Array.isArray(filepath)) {
        files = filepath;
      } else {
        files = [filepath];
      }
    } else {
      files = await this.getFiles();
    }

    for (const file of files) {
      if (await this.isLicensed(file)) {
        console.log(`Licensed: ${file}`);
      } else {
        console.log(`Unlicensed: ${file}`);
      }
    }
  }
}

QuickLicense.loadConfig = async function() {
  const cwd = process.cwd();
  try {
    console.log("Loading config from ./package.json");
    const packageConfigPath = path.resolve(cwd, 'package.json');
    const packageConfig = JSON.parse(await fs.readFile(packageConfigPath, 'utf8')).licenseScope;
    if (!packageConfig) throw new Error('quickLicense config not found in package.json');
    return packageConfig;
  } catch (error) {
    try {
      const fileConfigPath = path.resolve(cwd, 'quickLicense.json');
      console.log("Loading config from ", fileConfigPath);
      const fileConfig = JSON.parse(await fs.readFile(fileConfigPath, 'utf8'));
      return fileConfig;
    } catch (error) {
      return {
        include: [],
        exclude: [],
        allowedExtensions: ['js', 'css', 'mjs', 'ts']
      };
    }
  }
}

module.exports = QuickLicense;
