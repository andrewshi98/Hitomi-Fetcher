"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const path = require("path");
const request = require("request");
var IDIndex;
(function (IDIndex) {
    IDIndex[IDIndex["All"] = 0] = "All";
    IDIndex[IDIndex["Popular"] = 1] = "Popular";
    IDIndex[IDIndex["Tag"] = 2] = "Tag";
    IDIndex[IDIndex["Language"] = 3] = "Language";
})(IDIndex || (IDIndex = {}));
exports.IDIndex = IDIndex;
let _config;
let _basePath;
let configPath;
let domain = "ltn.hitomi.la";
let configLocation = "./hfconfig.json";
let updateStatus = false;
let updatePercentage = 0;
class HitomiFetcher {
    constructor(basePath) {
        _basePath = basePath;
        configPath = path.join(_basePath, configLocation);
        this.loadConfig();
    }
    get state() {
        return {
            updateStatus: updateStatus,
            updatePercentage: updatePercentage
        };
    }
    get config() { return _config; }
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
            };
            fs.writeFileSync(configPath, JSON.stringify(config));
        }
        _config = JSON.parse(fs.readFileSync(configPath, "utf8"));
    }
    saveConfigSync() {
        fs.writeFileSync(configPath, JSON.stringify(_config));
    }
    updateGlobalData() {
        return __awaiter(this, void 0, void 0, function* () {
            this.state["update"];
            yield this.updateTagVersion(this);
        });
    }
    updateTagVersion(obj) {
        return __awaiter(this, void 0, void 0, function* () {
            let timestamp = new Date().getTime();
            let [tagIndexID, galleriesIndexID] = yield Promise.all([
                this.getTagVersion(this, "tagindex", timestamp),
                this.getTagVersion(this, "galleriesindex", timestamp)
            ]);
            console.log("Loaded Versions - " + (new Date().getTime() - timestamp).toString() + "ms");
            obj.config["tagIndexVersion"] = tagIndexID;
            obj.config["galleriesIndexVersion"] = galleriesIndexID;
            obj.saveConfigSync();
        });
    }
    // Language, tag, all, or popular.
    getIDIndex(type, arg) {
        return __awaiter(this, void 0, void 0, function* () {
        });
    }
    updateIDIndex(type, arg) {
        return __awaiter(this, void 0, void 0, function* () {
        });
    }
    getLanguageIDIndex(language) {
        //nozomi_address = '//'+[domain, compressed_nozomi_prefix, area, [tag, language].join('-')].join('/')+nozomiextension;
    }
    updateLanguageIDIndex(language) {
        return __awaiter(this, void 0, void 0, function* () {
        });
    }
    getTagIDIndex(tag) {
    }
    updateTagIDIndex(tag) {
        return __awaiter(this, void 0, void 0, function* () {
            //var nozomi_address = '//'+[domain, compressed_nozomi_prefix, [tag, language].join('-')].join('/')+nozomiextension;
        });
    }
    getAllIDIndex() {
    }
    updateAllIDIndex() {
        return __awaiter(this, void 0, void 0, function* () {
        });
    }
    getPopularIDIndex() {
    }
    updatePopularIDIndex() {
        return __awaiter(this, void 0, void 0, function* () {
        });
    }
    // All/Global/Female/Male/Series/Etc.
    // Includes the only two way to get the .index file, which is hint helper.
    updateFieldIndex(field) {
        return __awaiter(this, void 0, void 0, function* () {
        });
    }
    // Area is for searching different areas of dojinshi: "Tag", "Character", "artist".
    // Area could only be empty when it is asking for only language, all area.
    getDataName(area, tag, language) {
    }
    getUpdateStatus() {
        return updateStatus;
    }
    tagVersionToURL(field, tag, version) {
        if (tag === 'galleriesindex') {
            return "http://" + domain + '/' + tag + '/galleries.' + version + '.index';
        }
        return "http://" + domain + "/" + tag + "/" + field + "." + version + ".index";
    }
    getIndexURLFromField(obj, field) {
        if (field === "all") {
            this.tagVersionToURL(null, "galleriesindex", obj.config["galleriesIndexVersion"]);
        }
        else {
            this.tagVersionToURL(field, "tagindex", obj.config["tagIndexVersion"]);
        }
    }
    getTagVersion(obj, name, timestamp) {
        return new Promise((resolve, reject) => {
            request("http://" + domain + "/" + name + "/version?_=" + timestamp, function (error, response, body) {
                if (error) {
                    console.error("Bad response getting IndexVersion");
                    reject(error);
                }
                else {
                    resolve(body);
                }
            });
        });
    }
}
exports.HitomiFetcher = HitomiFetcher;
//# sourceMappingURL=hitomi-fetcher.js.map