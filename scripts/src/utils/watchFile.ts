import { createHash } from "crypto"
import { watch as watchFileCore, createReadStream } from "fs"

async function hashFile(filename: string) {
  const hash = createHash("sha512")
  try {
    await new Promise<void>((resolve, reject) => {
      createReadStream(filename)
        .on("error", reject)
        .on("close", () => resolve())
        .pipe(hash)
    })
  } catch (ex: any) {
    if (ex.code !== "ENOENT") {
      throw ex
    }
    return ""
  }
  return hash.digest(`hex`)
}

/**
 * Watch a file but only call `onChange` if the actual contents change
 */
export default function watchFile(
  filename: string,
  options: {
    persistent?: boolean | undefined
  },
  onChange: () => void
) {
  let lastHash = hashFile(filename).catch(() => ``)
  let timeout: any
  return watchFileCore(filename, options, () => {
    if (timeout) {
      clearTimeout(timeout)
    }
    timeout = setTimeout(() => {
      const oldHash = lastHash
      const newHash = hashFile(filename)
      lastHash = newHash
      Promise.all([oldHash, newHash])
        .then(([oldH, newH]) => {
          if (oldH !== newH) {
            // console.info(`Detected change to ${filename}`)
            onChange()
          } else {
            // console.info(
            //   `Ignoring change to ${filename} because the contents still have the same hash`
            // )
          }
        })
        .catch(ex => {
          console.warn(`Error watching: ${filename}\n\n${ex.stack}`)
        })
    }, 200)
  })
}
