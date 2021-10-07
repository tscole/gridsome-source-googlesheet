const { google } = require("googleapis");
const file = require("./file.js");
const get = require("async-get-file");
class GoogleSheetSource {
  static defaultOptions() {
    return {
      sheetId: "",
      apiKey: "",
      type: "googleSheet",
      imageFields: [],
      imageDirectory: "googlesheet-images",
    };
  }
  constructor(api, options = GoogleSheetSource.defaultOptions()) {
    this.options = options;
    let range = "A1:ZZ10000";
    if (this.options.imageFields.length > 0) {
      file.createDirectory(this.options.imageDirectory);
    }
    if (this.options.tab) {
      range = this.options.tab + "!A1:ZZ10000";
    }
    api.loadSource(async (store) => {
      const contentType = store.addCollection({
        typeName: this.options.type,
      });
      const sheets = google.sheets({
        version: "v4",
        auth: this.options.apiKey,
      });
      let response = await sheets.spreadsheets.values.get({
        spreadsheetId: this.options.sheetId,
        range: range,
      });
      const data = response.data.values;
      const titles = data.shift();
      const nodes = await data.map((value) => {
        return titles.reduce(
          (title, key, index) => ({ ...title, [key]: value[index] }),
          {}
        );
      });
      if (this.options.imageFields) {
        for (let i = 0; i < this.options.imageFields.length; i++) {
          let field = this.options.imageFields[i];
          for (let index = 0; index < nodes.length; index++) {
            let node = nodes[index];
            console.log(field + " " + node[field]);
            if (node[field] && node[field].length > 4) {
              let url = node[field];
              let filename = file.getFilename(node[field]);
              let filepath = this.options.imageDirectory + "/" + filename;
              if (!file.exists(filepath)) {
                console.log("Downloading " + node[field]);
                var options = {
                  directory: this.options.imageDirectory,
                  filename: filename,
                };
                await get(node[field], options);
              } else {
                console.log("Skipping " + node[field] + " file already exists");
              }
              const id = store.makeUid(filename);
              const finalpath = file.getFullPath(
                this.options.imageDirectory,
                filename
              );
              node[field] = finalpath;
            } else {
              node[field] = null;
            }
          }
        }
      }
      nodes.map((value, key, title) => {
        contentType.addNode(value);
      });
    });
  }
}
module.exports = GoogleSheetSource;
