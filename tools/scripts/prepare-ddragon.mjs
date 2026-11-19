import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'

const root = process.cwd()
const locale = process.env.DDRAGON_LOCALE ?? 'pt_BR'

async function getLatestVersion() {
  const response = await fetch('https://ddragon.leagueoflegends.com/api/versions.json')

  if (!response.ok) {
    throw new Error(`Failed to retrieve Data Dragon versions: ${response.status}`)
  }

  const versions = await response.json()

  if (!Array.isArray(versions) || !versions[0]) {
    throw new Error('No Data Dragon version was returned.')
  }

  return versions[0]
}

async function main() {
  const version = process.env.DDRAGON_VERSION ?? (await getLatestVersion())

  const url = `https://ddragon.leagueoflegends.com/cdn/${version}/data/${locale}/championFull.json`

  console.log(`Downloading championFull.json (${version}, ${locale})...`)

  const response = await fetch(url)

  if (!response.ok) {
    throw new Error(`Failed to download championFull.json: ${response.status}`)
  }

  const content = await response.text()
  const data = JSON.parse(content)

  if (!data.data || typeof data.data !== 'object') {
    throw new Error('Invalid championFull.json format.')
  }

  const destination = path.join(root, 'apps/api/src/assets/ddragon/championFull.json')

  await mkdir(path.dirname(destination), { recursive: true })
  await writeFile(destination, content, 'utf8')

  console.log(`Data Dragon ${version} downloaded successfully.`)
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
