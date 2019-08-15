import * as path from 'path'
const toolDir = path.join(
  __dirname,
  'runner',
  path.join(
    Math.random()
      .toString(36)
      .substring(7)
  ),
  'tools'
);
const tempDir = path.join(
  __dirname,
  'runner',
  path.join(
    Math.random()
      .toString(36)
      .substring(7)
  ),
  'temp'
);
//process.env['RUNNER_TOOL_CACHE'] = toolDir;
//process.env['RUNNER_TEMP'] = tempDir;

import { run, getDroneVersion } from '../src/main'

describe('Setup And Install Drone', () => {
  beforeEach(async () => {
    jest.setTimeout(10000)
  })

  it('Will download and check drone-cli', async () => {
    jest.setTimeout(10000)
    const version = '1.1.4'
    await run(version)
    const installedVersion = await getDroneVersion()
    expect(installedVersion).toEqual(version)
  }, 10000);

});
