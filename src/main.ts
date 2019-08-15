import * as core from '@actions/core'
import * as tc from '@actions/tool-cache'
import * as os from 'os'
import * as path from 'path'
import { promisify } from 'util'
import { exec } from 'child_process'

const execP = promisify(exec)
const osPlat: string = os.platform()
const osArch: string = os.arch()

export async function run(version): Promise<void> {
    try {
      let toolPath: string
      toolPath = tc.find('drone', version)

      if (!toolPath) {
        const filename = createFilename()
        const downloadUrl = 'https://github.com/drone/drone-cli/releases/download/v' + version + '/' + filename
        console.log(downloadUrl)
        const downloadPath = await tc.downloadTool(downloadUrl)
        const extPath = await tc.extractTar(downloadPath)
        const cachedPath = await tc.cacheDir(extPath, 'drone', version)

        if (osPlat != 'win32') {
          toolPath = path.join(toolPath, 'bin')
        }
        core.addPath(cachedPath)
      }

    } catch (err) {
      console.error(err)
    }
}

export async function getDroneVersion(): Promise<string> {
  const toolPath = await tc.find('drone','*')
  const output = await execP(`${toolPath}/drone -v`)
  const droneVer = output.stdout
  const regex = /(\d+\.)(\d+\.)(\d)/g
  const cliVersion = droneVer.match(regex)

  if (cliVersion !== null){
    if (cliVersion.length > 0 ) return cliVersion[0]
  }
  return '0.0.0'
}

function createFilename() {
  let filename:string = 'drone'
  switch (osPlat) {
    case 'linux':
      filename += '_linux_' + osArch
      break;
    case 'darwin':
      filename += '_darwin_amd64'
      break;
    case 'win32':
      filename += '_windows_' + osArch
      break;
    default:
      throw new Error(`Unexpected OS '${osPlat}'`)
  }
  filename += '.tar.gz'
  return filename
}

const version = (core.getInput('version')) ? core.getInput('version') : false
if (version) run(version)

