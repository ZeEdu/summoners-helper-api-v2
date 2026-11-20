# Summoner's Helper v2 — Docker local

Esta configuração é voltada ao **ambiente local de desenvolvimento** do monorepo Nx. Ela executa MongoDB, API NestJS, Admin Angular e Mobile Web (Expo exportado como site estático) em containers. O app Expo nativo (Android/iOS) continua sendo executado no host/emulador.

> Não é uma configuração de produção. O MongoDB é iniciado sem autenticação e as portas publicadas ficam vinculadas a `127.0.0.1`.

## Serviços

| Serviço | Container | Endereço no host |
|---|---|---|
| MongoDB 7 | `mongodb` | `127.0.0.1:27017` |
| NestJS API | `api` | `http://localhost:3000/api` |
| Angular Admin | `admin` | `http://localhost:4200` |
| Expo Mobile Web | `mobile-web` (Nginx) | `http://localhost:8081` |

Dentro da rede Docker, a API acessa o MongoDB pelo hostname `mongodb`, e não por `localhost`. O navegador acessa a API pela porta publicada no host (`localhost:3000`).

## 1. Preparar variáveis de ambiente

Na raiz do repositório, copie o exemplo:

```powershell
Copy-Item .env.example .env
```

Edite `.env` e informe:

- `RIOT_API_KEY`: chave da Riot API.
- `JWT_SECRET`: segredo forte para access tokens.
- `JWT_REFRESH_SECRET`: outro segredo forte, diferente do anterior.

`ACCESS_TOKEN_VALIDITY_DURATION_IN_SEC` vem com exemplo de 900 segundos. Ajuste conforme a política do projeto. Os valores de exemplo dos segredos não devem ser usados fora de um ambiente local descartável.

Para gerar dois segredos aleatórios no PowerShell, execute o bloco abaixo duas vezes e use valores diferentes:

```powershell
$bytes = New-Object byte[] 64
$rng = [System.Security.Cryptography.RandomNumberGenerator]::Create()
$rng.GetBytes($bytes)
[Convert]::ToBase64String($bytes)
$rng.Dispose()
```

As demais variáveis permitem alterar portas, origens CORS e a versão do Data Dragon. `CORS_ORIGIN` deve conter as origens do navegador separadas por vírgula. O padrão permite Admin (`4200`) e Mobile Web (`8081`). Se mudar `ADMIN_PORT` ou `MOBILE_WEB_PORT`, atualize também `CORS_ORIGIN` com as novas origens.

## 2. Iniciar os serviços

```powershell
.\docker.ps1 up
```

O comando constrói e inicia os quatro serviços. A API aguarda o health check do MongoDB. O Mobile Web é exportado durante o build do Docker e servido pelo Nginx; não há Metro/Expo dev server em execução dentro desse container.

Endereços locais:

- Mobile Web: `http://localhost:8081`
- Admin: `http://localhost:4200`
- API: `http://localhost:3000/api`
- MongoDB: `localhost:27017`

## 3. Rebuild do Mobile Web

O container `mobile-web` serve um **build estático** do Expo Web. Alterações no código-fonte não aparecem automaticamente. Para exportar novamente e recriar apenas esse serviço:

```powershell
.\docker.ps1 up -Services mobile-web
```

A exportação usa o comando oficial `npx expo export --platform web` e grava o resultado em `apps/mobile/dist` dentro do estágio de build. O estágio final contém somente Nginx e os arquivos exportados. O Nginx faz fallback para `index.html`, apropriado ao modo SPA atual do app.

O `apps/mobile/src/services/api/api.constants.ts` do snapshot utiliza `http://localhost:3000/api` para a plataforma web. Isso funciona quando o navegador está na mesma máquina que executa o Docker. Para acessar o Mobile Web por outro dispositivo ou por um hostname diferente, será necessário tornar a URL da API configurável via `EXPO_PUBLIC_API_URL`, reconstruir o bundle com o endereço público correto e atualizar o CORS da API. Não coloque segredos em variáveis `EXPO_PUBLIC_*`, pois elas são incorporadas ao bundle do navegador.

## 4. Comandos úteis

```powershell
.\docker.ps1 ps
.\docker.ps1 logs -Follow
.\docker.ps1 logs -Follow -Services api
.\docker.ps1 logs -Follow -Services mobile-web
.\docker.ps1 restart api
.\docker.ps1 shell-api
.\docker.ps1 shell-admin
.\docker.ps1 shell-mobile-web
.\docker.ps1 refresh-ddragon
.\docker.ps1 down
```

`down` remove os containers, mas preserva o banco, os módulos Node e os JSONs do Data Dragon nos volumes nomeados. O Mobile Web não usa volume persistente: os arquivos estáticos fazem parte da imagem e são recriados no build.

Para remover também os volumes — **incluindo os dados do MongoDB** — execute explicitamente:

```powershell
.\docker.ps1 down -RemoveVolumes
```

## 5. Data Dragon

A API importa estes arquivos durante a compilação/execução:

- `championFull.json`
- `item.json`
- `runesReforged.json`
- `summoner.json`

O projeto declara `npm run prepare:ddragon`. Esta configuração inclui `tools/scripts/prepare-ddragon.mjs`, que baixa os quatro JSONs da versão mais recente publicada, usando `pt_BR` por padrão.

Para fixar uma versão, defina `DDRAGON_VERSION` no `.env` antes de construir a imagem. Para atualizar os arquivos do volume em execução, use `docker.ps1 refresh-ddragon`.

Os arquivos são mantidos em um volume Docker separado porque `.:/workspace` monta o código do host sobre o workspace do container.

## 6. Expo nativo (Android/iOS)

Apenas o **Mobile Web** está no Docker. O build e a execução nativa Android/iOS continuam fora dos containers, usando Expo/EAS conforme o fluxo do projeto.

Para a aplicação nativa no emulador Android, `10.0.2.2` é o endereço do host visto pelo emulador. Para um dispositivo físico, a URL da API deve usar o IP LAN do computador e a porta publicada pelo Docker; isso exige ajustar a URL da API no app.

## 7. Observações sobre o estado do repositório analisado

- O ZIP analisado não continha um `package-lock.json` na raiz; continha apenas um lockfile dentro de `apps/mobile`. O Dockerfile usa `npm ci` se o lockfile raiz existir e `npm install` como fallback. Recomendo versionar o lockfile raiz para builds reproduzíveis.
- Não encontrei configuração ou dependência de migrations no conteúdo enviado. Esta configuração não executa migrations automaticamente.
- Os arquivos `.env` não são copiados para a imagem. As variáveis da API são injetadas pelo Docker Compose.
- A exportação Web não precisa da chave `RIOT_API_KEY`; ela é exigida somente pelo serviço da API.
- A configuração é para desenvolvimento local, não para publicar diretamente na internet. Para produção, use HTTPS, uma origem de API configurável, CORS restrito e gestão segura de segredos.
