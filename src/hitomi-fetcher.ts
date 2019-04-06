import * as fs from 'fs';
import * as path from 'path';
import * as request from 'request';
import * as progress from 'request-progress';

interface StateObject {
  updateStatus : boolean;
  updatePercentage : number;
}

enum IDIndex {
  All,
  Popular,
  Tag,
  Language,
}

let _config : any;
let _basePath : string;
let configPath : string;
let domain : string = "ltn.hitomi.la";
let configLocation : string = "./hfconfig.json"
let updateStatus = false;
let updatePercentage = 0;

class HitomiFetcher {

  constructor(basePath : string) {
    _basePath = basePath;
    configPath = path.join(_basePath, configLocation);
    this.loadConfig();
  }

  get state() : StateObject { return {
      updateStatus : updateStatus,
      updatePercentage : updatePercentage
    };
  }
  
  get config() : any { return _config; }

  loadConfig() {
    if (!fs.existsSync(configPath)) {
      // First time running or use deleted file.
      let config = {
        tagIndexVersion: undefined,
        galleriesIndexVersion: undefined,
        tagIndexFields: {},
        languageIDIndexes: {},
        tagIDIndexes: {},
        indexAll: false
      }
      fs.writeFileSync(configPath, JSON.stringify(config));
    }
    _config = JSON.parse(fs.readFileSync(configPath, "utf8"));
  }

  saveConfigSync() {
    fs.writeFileSync(configPath, JSON.stringify(_config));
  }

  async updateGlobalData() {
    this.state["update"]
    await this.updateTagVersion(this);
  }

  private async updateTagVersion(obj) {
    let timestamp = new Date().getTime();
    let [tagIndexID, galleriesIndexID] = await Promise.all([
      this.getTagVersion(this, "tagindex", timestamp),
      this.getTagVersion(this, "galleriesindex", timestamp)
    ]);
    console.log("Loaded Versions - "+(new Date().getTime() - timestamp).toString()+"ms");
    obj.config["tagIndexVersion"] = tagIndexID;
    obj.config["galleriesIndexVersion"] = galleriesIndexID;
    obj.saveConfigSync();
  }

  // Language, tag, all, or popular.
  async getIDIndex(type : IDIndex, arg) {

  }

  async updateIDIndex(type : IDIndex, arg) {

  }

  private getLanguageIDIndex(language : string) {
    //nozomi_address = '//'+[domain, compressed_nozomi_prefix, area, [tag, language].join('-')].join('/')+nozomiextension;
  }

  private async updateLanguageIDIndex(language : string) {

  }

  private getTagIDIndex(tag : string) {

  }

  private async updateTagIDIndex(tag : string) {
    //var nozomi_address = '//'+[domain, compressed_nozomi_prefix, [tag, language].join('-')].join('/')+nozomiextension;
  }

  private getAllIDIndex() {

  }

  private async updateAllIDIndex() {

  }

  private getPopularIDIndex() {

  }

  private async updatePopularIDIndex() {

  }

  // All/Global/Female/Male/Series/Etc.
  // Includes the only two way to get the .index file, which is hint helper.
  async updateFieldIndex(field) {

  }

  // Area is for searching different areas of dojinshi: "Tag", "Character", "artist".
  // Area could only be empty when it is asking for only language, all area.
  getDataName(area, tag, language) {

  }

  private getUpdateStatus() {
    return updateStatus;
  }

  private tagVersionToURL(field, tag, version) {
    if (tag === 'galleriesindex') {
      return "http://"+domain+'/'+ tag +'/galleries.' + version + '.index';
    }
    return "http://"+domain+"/"+tag+"/"+field+"."+version+".index";
  }

  private getIndexURLFromField(obj, field) {
    if (field === "all") {
      this.tagVersionToURL(null, "galleriesindex", obj.config["galleriesIndexVersion"]);
    } else {
      this.tagVersionToURL(field, "tagindex", obj.config["tagIndexVersion"]);
    }
  }

  private getTagVersion(obj, name, timestamp) {
    return new Promise((resolve, reject) => {
      request(
        "http://" + domain + "/" + name + "/version?_=" + timestamp,
        function(error, response, body) {
          if (error) {
            console.error("Bad response getting IndexVersion");
            reject(error);
          } else {
            resolve(body);
          }
        }
      );
    });
  }

}

export {
  IDIndex,
  HitomiFetcher,
}