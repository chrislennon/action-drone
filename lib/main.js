"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const core = __importStar(require("@actions/core"));
const tc = __importStar(require("@actions/tool-cache"));
const os = __importStar(require("os"));
const path = __importStar(require("path"));
const util_1 = require("util");
const child_process_1 = require("child_process");
const execP = util_1.promisify(child_process_1.exec);
const osPlat = os.platform();
const osArch = os.arch();
function run(version) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let toolPath;
            toolPath = tc.find('drone', version);
            if (!toolPath) {
                const filename = createFilename();
                const downloadUrl = `https://github.com/drone/drone-cli/releases/download/v${version}/${filename}`;
                const downloadPath = yield tc.downloadTool(downloadUrl);
                const extPath = yield tc.extractTar(downloadPath);
                const cachedPath = yield tc.cacheDir(extPath, 'drone', version);
                if (osPlat != 'win32') {
                    toolPath = path.join(toolPath, 'bin');
                }
                core.addPath(cachedPath);
            }
        }
        catch (err) {
            console.error(err);
        }
    });
}
exports.run = run;
function getDroneVersion() {
    return __awaiter(this, void 0, void 0, function* () {
        const toolPath = yield tc.find('drone', '*');
        const output = yield execP(`${toolPath}/drone -v`);
        const droneVer = output.stdout;
        const regex = /(\d+\.)(\d+\.)(\d)/g;
        const cliVersion = droneVer.match(regex);
        if (cliVersion !== null) {
            if (cliVersion.length > 0)
                return cliVersion[0];
        }
        return '0.0.0';
    });
}
exports.getDroneVersion = getDroneVersion;
function createFilename() {
    let filename = 'drone';
    switch (osPlat) {
        case 'linux':
            filename += '_linux_amd64';
            break;
        case 'darwin':
            filename += '_darwin_amd64';
            break;
        case 'win32':
            filename += '_windows_amd64';
            break;
        default:
            throw new Error(`Unexpected OS '${osPlat}'`);
    }
    filename += '.tar.gz';
    return filename;
}
const version = (core.getInput('version')) ? core.getInput('version') : false;
if (version)
    run(version);
