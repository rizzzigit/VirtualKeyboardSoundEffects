import FS from 'fs'
import Path from 'path'
import ChildProcess from 'child_process'

const inputPath = '/dev/input/by-path'

async function listInputs () {
  return (await FS.promises.readdir(inputPath)).map((inputFile) => Path.join(inputPath, inputFile))
}

async function findKeyboardPath () {
  return (await listInputs()).find((inputFile) => inputFile.endsWith('kbd'))
}

async function findMousePath () {
  return '/dev/input/mice'
}

function getMouseSoundFile (action: 'down' | 'up') {
  return Path.join(process.cwd(), `res/mouse/${action}.wav`)
}

async function mouseData (data: Buffer) {
  const dataHex = data.toString('hex')

  if (['080000', '090000', '0a0000'].includes(dataHex)) {
    ChildProcess.exec(`aplay ${getMouseSoundFile(dataHex === '080000' ? 'up' : 'down')}`)
  }
}

function getKeyboardSoundFile (index: number, action: 'down' | 'up') {
  return Path.join(process.cwd(), `res/keyboard/variant${
    [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 203, 200, 208, 205, 11, 12, 13, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 87, 88, 210, 211].includes(index)
      ? 1
      : index === 57
        ? 2
        : [28].includes(index)
          ? 3
          : 4
  }/key${action}.wav`)
}

async function keyboardData (data: Buffer) {
  const action = data[44]
  const key = data[20]

  if ([1, 0].includes(action)) {
    ChildProcess.exec(`aplay ${getKeyboardSoundFile(key, !action ? 'down' : 'up')}`, (error) => error && console.log(error))
  }
}

async function run () {
  const keyboardPath = await findKeyboardPath()
  const mousePath = await findMousePath()

  if (mousePath) {
    const mouseStream = FS.createReadStream(mousePath)

    mouseStream.on('data', mouseData)
  }

  if (keyboardPath) {
    const keyboardStream = FS.createReadStream(keyboardPath)

    keyboardStream.on('data', keyboardData)
  }
}

run()
