import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'

const root = process.cwd()
const locale = process.env.DDRAGON_LOCALE ?? 'pt_BR'

const assets = [
  { filename: 'championFull.json', expected: 'object' },
  { filename: 'item.json', expected: 'object' },
  { filename: 'runesReforged.json', expected: 'array' },
  { filename: 'summoner.json', expected: 'object' },
]

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

async function downloadAsset(filename, version) {
  const url = `https://ddragon.leagueoflegends.com/cdn/${version}/data/${locale}/${filename}`

  console.log(`Downloading ${filename}...`)

  const response = await fetch(url)

  if (!response.ok) {
    throw new Error(`Failed to download ${filename}: HTTP ${response.status} (${url})`)
  }

  const content = await response.text()
  const json = JSON.parse(content)

  const expected = assets.find((asset) => asset.filename === filename).expected

  if (expected === 'array' && !Array.isArray(json)) {
    throw new Error(`Invalid JSON structure for ${filename}: expected array.`)
  }

  if (expected === 'object' && (!json || typeof json !== 'object' || !json.data)) {
    throw new Error(`Invalid JSON structure for ${filename}: missing data.`)
  }

  return { filename, content }
}

async function main() {
  const version = process.env.DDRAGON_VERSION ?? (await getLatestVersion())

  const destination = path.join(root, 'apps/api/src/assets/ddragon')

  // Download everything before writing files.
  const downloadedAssets = await Promise.all(
    assets.map(({ filename }) => downloadAsset(filename, version)),
  )

  await mkdir(destination, { recursive: true })

  await Promise.all(
    downloadedAssets.map(({ filename, content }) =>
      writeFile(path.join(destination, filename), content, 'utf8'),
    ),
  )

  console.log(
    `Successfully prepared ${downloadedAssets.length} Data Dragon assets (${version}, ${locale}).`,
  )
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
