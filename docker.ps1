[CmdletBinding()]
param(
  [ValidateSet('up', 'down', 'stop', 'restart', 'build', 'logs', 'ps', 'refresh-ddragon', 'shell-api', 'shell-admin', 'shell-mobile-web', 'help')]
  [string]$Action = 'up',

  [string[]]$Services = @(),

  [switch]$Follow,
  [switch]$RemoveVolumes
)

$ErrorActionPreference = 'Stop'
$projectDirectory = $PSScriptRoot
$composeFile = Join-Path $projectDirectory 'compose.yaml'
$envFile = Join-Path $projectDirectory '.env'

if ($Action -ne 'help' -and -not (Get-Command docker -ErrorAction SilentlyContinue)) {
  Write-Error 'Docker CLI não foi encontrado. Instale/inicie o Docker Desktop e tente novamente.'
  exit 1
}

if (-not (Test-Path $composeFile)) {
  Write-Error "Arquivo compose.yaml não encontrado em: $projectDirectory"
  exit 1
}

if ($Action -ne 'help' -and -not (Test-Path $envFile)) {
  Write-Error 'Arquivo .env não encontrado. Copie .env.example para .env e configure as variáveis obrigatórias.'
  exit 1
}

$dockerArgs = @(
  'compose',
  '--project-directory', $projectDirectory,
  '-f', $composeFile
)

switch ($Action) {
  'up' {
    $dockerArgs += @('up', '--detach', '--build')
    if ($Services.Count -gt 0) { $dockerArgs += $Services }
  }
  'down' {
    $dockerArgs += @('down', '--remove-orphans')
    if ($RemoveVolumes) { $dockerArgs += '--volumes' }
  }
  'stop' {
    $dockerArgs += @('stop')
    if ($Services.Count -gt 0) { $dockerArgs += $Services }
  }
  'restart' {
    $dockerArgs += @('restart')
    if ($Services.Count -gt 0) { $dockerArgs += $Services }
  }
  'build' {
    $dockerArgs += @('build')
    if ($Services.Count -gt 0) { $dockerArgs += $Services }
  }
  'logs' {
    $dockerArgs += @('logs')
    if ($Follow) { $dockerArgs += '--follow' }
    if ($Services.Count -gt 0) { $dockerArgs += $Services }
  }
  'ps' {
    $dockerArgs += 'ps'
  }
  'refresh-ddragon' {
    $dockerArgs += @('exec', 'api', 'npm', 'run', 'prepare:ddragon')
  }
  'shell-api' {
    $dockerArgs += @('exec', 'api', 'sh')
  }
  'shell-admin' {
    $dockerArgs += @('exec', 'admin', 'sh')
  }
  'shell-mobile-web' {
    $dockerArgs += @('exec', 'mobile-web', 'sh')
  }
  'help' {
    Write-Host @'
Uso: .\docker.ps1 [ação] [-Services api,admin,mobile-web,mongodb] [-Follow] [-RemoveVolumes]

Ações:
  up                 Constrói e inicia MongoDB, API e Admin.
  down               Para e remove containers, preservando volumes.
  down -RemoveVolumes Remove também os volumes (APAGA os dados locais).
  stop               Para os containers sem removê-los.
  restart            Reinicia todos ou os serviços informados.
  build              Constrói as imagens.
  logs -Follow       Exibe logs; use -Services api para filtrar.
  ps                 Mostra o estado dos containers.
  refresh-ddragon    Atualiza os JSONs do Data Dragon no volume da API.
  shell-api          Abre um shell no container da API.
  shell-admin        Abre um shell no container do Admin.
'@
    exit 0
  }
}

& docker @dockerArgs
if ($LASTEXITCODE -ne 0) {
  exit $LASTEXITCODE
}
