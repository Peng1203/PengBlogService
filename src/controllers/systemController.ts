import os from 'os'
import path from 'path'
import { exec } from 'child_process'
import { Request, Response, NextFunction } from 'express'

class SystemController {
  public updateAdminWeb = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    const scriptPath = path.join(
      __dirname,
      '../',
      '/script/updateAdmin/index.bat'
    )
    const osVal = os.platform()
    console.log('osVal -----', scriptPath, osVal)
    exec(scriptPath, (error, stdout) => {
      if (error) console.log('error -----', error)
      else console.log('stdout -----', stdout)
    })
    res.send('更新admin服务')
  }
}

export default SystemController
