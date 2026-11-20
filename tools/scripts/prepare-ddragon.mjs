import { mkdir, rename, writeFile } from 'node:fs/promises'
import { join } from 'node:path'

const projectRoot = process.cwd()
const outputDirectory = join(projectRoot, 'apps', 'api', 'src', 'assets', 'ddragon')
const locale = process.env.DDRAGON_LOCALE || 'pt_BR'
const files = ['championFull.json', 'item.json', 'runesReforged.json', 'summoner.json']

async function getVersion() {
  if (process.env.DDRAGON_VERSION?.trim()) {
    return process.env.DDRAGON_VERSION.trim()
  }

  const response = await fetch('https://ddragon.leagueoflegends.com/api/versions.json', {
    signal: AbortSignal.timeout(30_000),
  })

  if (!response.ok) {
    throw new Error(`Unable to retrieve Data Dragon versions: HTTP ${response.status}`)
  }

  const versions = await response.json()
  const latestVersion = versions?.[0]

  if (typeof latestVersion !== 'string' || latestVersion.length === 0) {
    throw new Error('The Data Dragon versions endpoint returned an invalid response.')
  }

  return latestVersion
}

async function downloadJson(version, fileName) {
  const url = `https://ddragon.leagueoflegends.com/cdn/${version}/data/${locale}/${fileName}`
  const response = await fetch(url, { signal: AbortSignal.timeout(60_000) })

  if (!response.ok) {
    throw new Error(`Unable to download ${fileName}: HTTP ${response.status} (${url})`)
  }

  const content = await response.text()

  try {
    JSON.parse(content)
  } catch {
    throw new Error(`Data Dragon returned invalid JSON for ${fileName}.`)
  }

  const destination = join(outputDirectory, fileName)
  const temporaryDestination = `${destination}.tmp`

  await writeFile(temporaryDestination, content, 'utf8')
  await rename(temporaryDestination, destination)
  process.stdout.write(`Downloaded ${fileName}\n`)
}

async function main() {
  const version = await getVersion()
  await mkdir(outputDirectory, { recursive: true })

  process.stdout.write(`Preparing Data Dragon ${version} (${locale})\n`)
  await Promise.all(files.map((fileName) => downloadJson(version, fileName)))
  process.stdout.write(`Data Dragon assets saved to ${outputDirectory}\n`)
}

main().catch((error) => {
  process.stderr.write(`${error instanceof Error ? error.message : String(error)}\n`)
  process.exitCode = 1
})
