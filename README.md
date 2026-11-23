# Summoner's Helper v2

Aplicação full-stack para criação, consulta e gerenciamento de guias de League of Legends. O projeto reúne um aplicativo multiplataforma, um painel administrativo e uma API, organizados em um monorepo Nx.

## Visão geral

O Summoner's Helper permite que jogadores consultem guias, criem suas próprias builds e acompanhem informações relacionadas à conta do League of Legends. A plataforma também possui recursos de interação e denúncia de conteúdo, com um painel administrativo para moderação.

### Aplicações

| Aplicação  | Tecnologia                              | Responsabilidade                                                                                         |
| ---------- | --------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| **Mobile** | Expo, React Native e React Native Paper | Aplicativo para Android e Web, com navegação, autenticação, pesquisa e criação de guias.                 |
| **Admin**  | Angular e Angular Material              | Painel restrito a administradores do sistema para acompanhar e moderar denúncias.                        |
| **API**    | NestJS, Mongoose e MongoDB              | Autenticação, usuários, guias, comentários, denúncias, integração com a Riot API e dados do Data Dragon. |

### Funcionalidades implementadas

**Aplicativo Mobile / Web**

- Cadastro, login e gerenciamento de sessão.
- Consulta de guias recentes e pesquisa avançada.
- Criação, visualização e gerenciamento dos próprios guias.
- Configuração de runas, feitiços, itens, progressão de habilidades, bônus e ameaças.
- Associação de conta do League of Legends.
- TODO: Consulta de informações da conta, como maestrias, ranque e partidas recentes.
- Comentários, curtidas e denúncias.
- Seleção de idioma entre português e inglês.

**Painel Admin**

- Dashboard administrativo.
- Consulta e revisão de denúncias de guias.
- Consulta e revisão de denúncias de comentários.
- Ações de moderação, como arquivamento e bloqueio de conteúdo.
- Acesso protegido por autenticação e verificação de administrador do sistema.

**API**

- Autenticação para clientes Web, Mobile e administradores.
- Access token JWT e renovação de sessão por refresh token.
- Persistência de usuários, guias, comentários e denúncias no MongoDB.
- Integração com a Riot API para consultar dados de jogadores.
- Consulta de campeões, itens, runas e feitiços por meio dos dados do Data Dragon.
- Mensagens e validações internacionalizadas em português e inglês.

## Tecnologias

- **Monorepo:** Nx 23
- **Backend:** NestJS 11, Node.js 22, Mongoose 9 e MongoDB 7
- **Web administrativo:** Angular 21 e Angular Material
- **Aplicativo:** Expo SDK 55, React Native 0.83 e React Native Paper
- **Navegação Mobile:** React Navigation 7
- **Validação e contratos:** Zod 4 e TypeScript
- **Autenticação:** Passport, JWT e Argon2
- **Testes:** Jest e ferramentas de teste do Angular/React Native
- **Containers locais:** Docker Compose e Nginx para servir o Mobile Web exportado

## Estrutura do repositório

```text
.
├── apps/
│   ├── api/          # API NestJS
│   ├── admin/        # Painel administrativo Angular
│   └── mobile/       # Aplicativo Expo / React Native / Web
├── libs/
│   ├── contracts/    # DTOs, interfaces, enums e schemas Zod compartilhados
│   └── ui/           # Componentes de interface compartilhados
├── tools/
│   └── scripts/      # Scripts auxiliares do workspace
├── compose.yaml      # Serviços do ambiente Docker local
├── Dockerfile        # Imagens usadas pelo ambiente Docker
├── docker.ps1        # Atalhos Docker para PowerShell
├── nx.json
├── package.json
└── tsconfig.base.json
```

## Pré-requisitos

Para desenvolvimento local sem Docker:

- Node.js 22.x e npm.
- MongoDB 7 acessível pela máquina de desenvolvimento.
- Chave de desenvolvedor da Riot Games para os recursos que consultam a Riot API.
- Android Studio e Android SDK para executar o aplicativo em um emulador Android.

Para utilizar o ambiente containerizado, instale também o Docker Desktop com Docker Compose.

## Configuração inicial

### 1. Instalar as dependências

Na raiz do monorepo:

```bash
npm install
```

O workspace utiliza dependências instaladas na raiz e projetos Nx em `apps/` e `libs/`.

### 2. Configurar as variáveis de ambiente

A API carrega variáveis de `.env.development` e, como alternativa, `.env`, a partir do diretório de execução. Para desenvolvimento local, crie um arquivo `.env` na raiz com os valores correspondentes ao seu ambiente:

```dotenv
NODE_ENV=development
PORT=3000
API_PREFIX=api
CORS_ORIGIN=http://localhost:4200,http://localhost:8081

MONGODB_URI=mongodb://127.0.0.1:27017/summoners_helper
RIOT_API_KEY=coloque-sua-chave-da-riot
JWT_SECRET=gere-um-segredo-aleatorio
JWT_REFRESH_SECRET=gere-outro-segredo-aleatorio
ACCESS_TOKEN_VALIDITY_DURATION_IN_SEC=900

# Opcional: fixa a versão do Data Dragon. Vazio utiliza a versão mais recente.
DDRAGON_VERSION=
```

`JWT_SECRET` e `JWT_REFRESH_SECRET` devem ser valores aleatórios, fortes e diferentes entre si. Não reutilize os exemplos acima como segredos reais e não versione arquivos `.env`.

É possível gerar cada segredo com Node.js. Execute o comando duas vezes para obter valores diferentes:

```bash
node -e "console.log(require('node:crypto').randomBytes(64).toString('hex'))"
```

A variável `RIOT_API_KEY` é carregada pela API na inicialização. Configure uma chave válida mesmo quando estiver trabalhando em funcionalidades que não fazem chamadas diretas à Riot API.

### 3. Preparar os dados do Data Dragon

A API utiliza os seguintes arquivos JSON do Data Dragon:

- `championFull.json`
- `item.json`
- `runesReforged.json`
- `summoner.json`

Prepare os arquivos antes de iniciar a API:

```bash
npm run prepare:ddragon
```

O script salva os arquivos em `apps/api/src/assets/ddragon/`. Por padrão, utiliza a versão mais recente publicada e o idioma `pt_BR`. Para fixar uma versão, defina `DDRAGON_VERSION` no ambiente antes de executar o script.

### 4. Iniciar o MongoDB

Inicie uma instância MongoDB 7 e confira se a URI definida em `MONGODB_URI` aponta para ela. O exemplo anterior utiliza `127.0.0.1:27017`.

## Executar as aplicações

Os comandos abaixo devem ser executados na raiz do monorepo.

### Mobile + API

```bash
npm start
```

Executa os targets `serve` dos projetos `mobile` e `api` em paralelo.

### Admin + API

```bash
npm run start:admin
```

Executa os targets `serve` dos projetos `admin` e `api` em paralelo.

### Aplicativo Android

Com a API em execução e um emulador Android iniciado:

```bash
npm run start-android
```

O endereço base da API utilizado pelo aplicativo está definido em `apps/mobile/src/services/api/api.constants.ts`. Quando `EXPO_PUBLIC_API_URL` está definido, ele sobrescreve o endereço local e é incorporado ao bundle do Expo durante o build. Sem essa variável, o código utiliza `10.0.2.2` no emulador Android e `localhost` na Web. Para dispositivos físicos ou outros ambientes, configure o endereço apropriado.

### Endereços locais padrão

| Serviço                       | Endereço                                               |
| ----------------------------- | ------------------------------------------------------ |
| API                           | `http://localhost:3000/api`                            |
| Admin                         | `http://localhost:4200`                                |
| Mobile Web em desenvolvimento | Servido pelo Expo/Metro iniciado pelo projeto `mobile` |

O endereço base da API do Admin também está definido em `apps/admin/src/app/endpoint.constants.ts`. Ao mudar a porta ou o host da API, atualize os endpoints dos clientes e as origens permitidas em `CORS_ORIGIN`.

## Executar com Docker

O repositório inclui uma configuração Docker voltada ao desenvolvimento local. Ela executa MongoDB, API, Admin e Mobile Web em containers. O aplicativo nativo Android/iOS continua sendo executado pelo Expo fora do Docker.

### 1. Preparar o `.env`

Na raiz do projeto, copie o exemplo e configure os valores obrigatórios:

```powershell
Copy-Item .env.example .env
```

Preencha `RIOT_API_KEY`, `JWT_SECRET` e `JWT_REFRESH_SECRET` com valores próprios. O Compose define a URI interna do MongoDB para a API como `mongodb://mongodb:27017/summoners_helper`.

Se você já possui MongoDB local utilizando a porta `27017`, configure no `.env`:

```dotenv
MONGO_PORT=27018
```

A porta publicada no Windows será `27018`, enquanto o MongoDB continua escutando em `27017` dentro da rede Docker. A API deve continuar utilizando o hostname `mongodb` e a porta interna `27017`.

### 2. Iniciar os serviços

No PowerShell:

```powershell
.\docker.ps1 up
```

Serviços e endereços padrão:

| Serviço                                          | Endereço no host                            |
| ------------------------------------------------ | ------------------------------------------- |
| Mobile Web (Expo exportado e servido pelo Nginx) | `http://localhost:8081`                     |
| Admin (Angular)                                  | `http://localhost:4200`                     |
| API (NestJS)                                     | `http://localhost:3000/api`                 |
| MongoDB                                          | `localhost:27018` quando `MONGO_PORT=27018` |

O Mobile Web é exportado como site estático durante o build da imagem e servido pelo Nginx. Alterações no código do Mobile Web exigem reconstruir o serviço:

```powershell
.\docker.ps1 up -Services mobile-web
```

### 3. Comandos Docker úteis

```powershell
.\docker.ps1 ps
.\docker.ps1 logs -Follow
.\docker.ps1 logs -Follow -Services api
.\docker.ps1 restart api
.\docker.ps1 shell-api
.\docker.ps1 shell-admin
.\docker.ps1 down
```

`down` remove os containers, mas preserva os volumes nomeados. Para remover também os volumes — incluindo os dados do MongoDB — execute:

```powershell
.\docker.ps1 down -RemoveVolumes
```

> **Importante:** essa configuração Docker é destinada ao desenvolvimento local. O MongoDB do Compose é iniciado sem autenticação e as portas são publicadas em `127.0.0.1`. Não exponha essa configuração diretamente à Internet nem a utilize como configuração de produção.

### Build targets do Dockerfile

O `Dockerfile` utiliza múltiplos stages. O Compose de desenvolvimento usa o ambiente `workspace-dev` para executar os projetos com Nx; os targets de produção geram imagens menores e específicas para cada serviço.

| Build target           | Finalidade                                                                  | Porta do container |
| ---------------------- | --------------------------------------------------------------------------- | -----------------: |
| `workspace-dev`        | Ambiente Node.js para desenvolvimento da API e do Admin com Nx.             |    `3000` e `4200` |
| `api-build`            | Compila a API para produção e prepara os arquivos do Data Dragon.           |                  — |
| `api-production`       | Imagem de runtime da API NestJS, sem o Admin.                               |             `3000` |
| `admin-build`          | Compila o painel Angular para produção.                                     |                  — |
| `admin-production`     | Imagem independente do Admin servido pelo Nginx.                            |               `80` |
| `api-admin-production` | Imagem combinada usada no Northflank: API NestJS e build estático do Admin. |             `3000` |
| `mobile-web-build`     | Exporta o Mobile Web com `npx expo export --platform web`.                  |                  — |
| `mobile-web`           | Imagem final do Mobile Web, servido pelo Nginx.                             |               `80` |

Para gerar localmente as imagens de produção, selecione explicitamente o target desejado. Exemplos:

```powershell
# API + Admin na mesma imagem
docker build --target api-admin-production -t summoners-helper-api-admin:production .

# Mobile Web; a URL pública da API é incorporada ao bundle do Expo
docker build `
  --target mobile-web `
  --build-arg EXPO_PUBLIC_API_URL=https://api.summoners-helper.com.br/api `
  -t summoners-helper-mobile-web:production .
```

O target `api-admin-production` utiliza `NODE_ENV=production`, expõe a API na porta `3000` e copia os arquivos do Angular para `/app/admin`. O NestJS serve esses arquivos na raiz (`/`) e mantém as rotas da API sob `/api`. O target `mobile-web` gera os arquivos estáticos do Expo durante o build e os publica pelo Nginx na porta `80`.

No Northflank, configure o target correspondente em cada Service: `api-admin-production` para `api-admin-production` e `mobile-web` para `mobile-web`. Não use `workspace-dev` como target de produção.

## Deploy em produção (Northflank)

A aplicação é publicada no Northflank utilizando duas Services e um MongoDB Add-on. API e Admin compartilham a mesma imagem/Service; o Mobile Web é publicado separadamente como site estático servido pelo Nginx.

### Arquitetura de produção

| Recurso Northflank     | Docker build target    | Porta do container | Responsabilidade                                  |
| ---------------------- | ---------------------- | -----------------: | ------------------------------------------------- |
| `api-admin-production` | `api-admin-production` |             `3000` | API NestJS e arquivos estáticos do Admin Angular. |
| `mobile-web`           | `mobile-web`           |               `80` | Export Web do Expo servido pelo Nginx.            |
| MongoDB Add-on         | —                      |                  — | Banco de dados utilizado pela API.                |

O target `api-admin-production` parte da imagem de produção da API e copia o build Angular para `/app/admin`. Em produção, o NestJS serve o Admin na raiz (`/`) e mantém as rotas da API sob o prefixo `/api`. Por isso, acessar a raiz de `api.summoners-helper.com.br` também pode retornar o HTML do Admin; os endpoints da API ficam em `/api`.

### Domínios e roteamento

Os domínios são registrados no Registro.br, mas a zona DNS é gerenciada pela Cloudflare. Os registros DNS devem ser criados na Cloudflare, mantendo os nameservers da Cloudflare configurados no Registro.br.

| Domínio                         | Service                |  Porta | Uso                        |
| ------------------------------- | ---------------------- | -----: | -------------------------- |
| `summoners-helper.com.br`       | `mobile-web`           |   `80` | Mobile Web (domínio raiz). |
| `www.summoners-helper.com.br`   | `mobile-web`           |   `80` | Mobile Web.                |
| `admin.summoners-helper.com.br` | `api-admin-production` | `3000` | Painel administrativo.     |
| `api.summoners-helper.com.br`   | `api-admin-production` | `3000` | API NestJS.                |

Para configurar um domínio novo:

1. Em **Team → Platform → Domains** no Northflank, adicione/verifique o domínio raiz e depois cadastre os subdomínios necessários.
2. Para a verificação do domínio raiz, publique na Cloudflare o registro TXT fornecido pelo Northflank.
3. Para direcionar o domínio raiz (`@`), configure o registro ALIAS/ANAME ou CNAME Flattening solicitado pelo Northflank. Na Cloudflare, o CNAME Flattening permite usar o destino informado pelo Northflank no domínio raiz.
4. Para cada subdomínio, crie na Cloudflare o CNAME com o nome e o destino exatos apresentados pelo Northflank.
5. Mantenha os registros como **DNS only** durante a configuração, verifique os domínios no Northflank e associe-os à Service e à porta correspondentes na seção de Networking.

Os destinos CNAME e os valores de verificação devem sempre ser copiados da interface do Northflank. Eles podem ser específicos da configuração e não devem ser presumidos ou reutilizados entre subdomínios.

### Configuração da Service `api-admin-production`

Configure o Dockerfile do repositório e selecione o build target `api-admin-production`. A porta pública do container é `3000`.

Defina as variáveis de ambiente de runtime na Service. Os valores entre `<...>` são fornecidos pelo ambiente ou devem ser substituídos pelos valores reais:

```dotenv
NODE_ENV=production
PORT=3000
API_PREFIX=api
MONGODB_URI=<connection string do MongoDB Add-on>
RIOT_API_KEY=<Riot API key>
JWT_SECRET=<secret forte e aleatório>
JWT_REFRESH_SECRET=<outro secret forte e aleatório>
ACCESS_TOKEN_VALIDITY_DURATION_IN_SEC=900
CORS_ORIGIN=https://www.summoners-helper.com.br,https://summoners-helper.com.br,https://admin.summoners-helper.com.br
```

`CORS_ORIGIN` deve conter as origens dos clientes Web que fazem chamadas cross-origin à API, sem barra no final e sem o caminho `/api`. Ajuste a lista conforme os domínios efetivamente utilizados e a forma como `main.ts` interpreta essa variável. Se o domínio raiz não for utilizado para acessar o Mobile, ele pode ser removido da lista.

Utilize a URI interna fornecida pelo MongoDB Add-on em `MONGODB_URI`; não utilize `localhost` para conectar a API ao banco gerenciado. Nunca coloque chaves ou secrets no README, no código-fonte ou em variáveis `EXPO_PUBLIC_*`.

Como Build Arguments opcionais do target `api-admin-production`, podem ser definidos `DDRAGON_VERSION` e `DDRAGON_LOCALE` para controlar a versão e o idioma dos dados do Data Dragon preparados durante o build.

### Configuração da Service `mobile-web`

Configure o mesmo repositório e Dockerfile, mas selecione o build target `mobile-web`. A porta pública do container é `80`.

Defina a seguinte variável como **Build Argument** (não apenas como variável de runtime):

```dotenv
EXPO_PUBLIC_API_URL=https://api.summoners-helper.com.br/api
```

O Expo incorpora variáveis `EXPO_PUBLIC_*` ao bundle no momento de `expo export`. Portanto, sempre que o endereço da API mudar, atualize o Build Argument e execute **Builds → Rebuild** na Service `mobile-web`. Reiniciar apenas o container não atualiza o bundle já compilado.

### Endpoint do Admin

Confira `apps/admin/src/app/endpoint.constants.ts` antes de publicar alterações no Admin. O endereço base utilizado pelo painel deve apontar para a API de produção:

```text
https://api.summoners-helper.com.br/api
```

Como o Admin é compilado durante o build do target `api-admin-production`, alterações no endpoint exigem um novo build e deploy dessa Service.

### Processo de publicação

1. Envie as alterações do repositório para a branch conectada ao Northflank.
2. Confira as variáveis de runtime da Service `api-admin-production`, incluindo `NODE_ENV=production`, `MONGODB_URI`, credenciais da Riot/JWT e `CORS_ORIGIN`. Aplique as alterações por meio de um novo deployment/restart da Service.
3. Se houve alterações na API ou no Admin, execute um novo build do target `api-admin-production` e publique a nova imagem.
4. Confira `EXPO_PUBLIC_API_URL` nos Build Arguments da Service `mobile-web` e execute **Builds → Rebuild** para gerar novamente o bundle Web.
5. Aguarde os deployments e os certificados HTTPS dos domínios ficarem ativos.
6. Valide o Mobile, o login/cadastro, a persistência e renovação da sessão, o carregamento do Data Dragon e o acesso às funcionalidades do Admin.

### Verificações básicas

A raiz do domínio da API pode servir o HTML do Admin. Para verificar a API, utilize uma rota com o prefixo `/api`:

```powershell
curl.exe -i https://api.summoners-helper.com.br/api
curl.exe -i https://api.summoners-helper.com.br/api/data-dragon/assets
```

No navegador, use as ferramentas de desenvolvimento (Network) para confirmar que as requisições do Mobile são enviadas para `https://api.summoners-helper.com.br/api/...` e que as respostas incluem os cabeçalhos CORS esperados para a origem do frontend.

## Testes, validação e build

### Testes da API

```bash
npm run test-api
```

O script executa os testes da API em série (`--runInBand`), com diagnóstico de handles abertos. Os testes E2E dependem de uma instância MongoDB acessível e das variáveis de ambiente necessárias à inicialização do `AppModule`.

### Testes do Admin e Mobile

```bash
npx nx test admin
npx nx test mobile
```

### Validação do workspace

```bash
npm run validate
```

O script executa lint, testes e typecheck dos projetos e, em seguida, builds dos projetos exceto `mobile`.

### Builds individuais

```bash
npx nx build api
npx nx build admin
```

Para exportar o Mobile Web manualmente:

```bash
cd apps/mobile
npx expo export --platform web
```

## Bibliotecas compartilhadas

- **`@org/contracts`**: concentra contratos compartilhados entre os clientes e a API, incluindo DTOs, interfaces, enums, schemas de validação Zod e tipos.
- **`@org/ui`**: disponibiliza componentes de interface reutilizáveis, atualmente baseados em React Native e React Native Paper.

Os projetos importam essas bibliotecas pelos aliases `@org/contracts` e `@org/ui` definidos na configuração TypeScript do workspace.

## Internacionalização

O projeto possui suporte a português (`pt`) e inglês (`en`) nos contratos e na aplicação Mobile. A API utiliza `nestjs-i18n`, com resolução do idioma por query string (`lang`), cabeçalho `x-lang` e `Accept-Language`, utilizando português como idioma de fallback.

## Integrações externas

- **Riot Games API:** fornece dados relacionados à conta e às partidas do jogador. Requer uma `RIOT_API_KEY` válida.
- **Data Dragon:** fornece os dados estáticos de campeões, itens, runas e feitiços. Os JSONs são preparados pelo script `prepare:ddragon`.

As chaves e credenciais dessas integrações devem permanecer fora do código-fonte e do controle de versão.

## Observações de desenvolvimento

- Em desenvolvimento local, a API utiliza `http://localhost:3000/api` como endereço padrão. Em produção, o Mobile Web utiliza `EXPO_PUBLIC_API_URL` e o Admin deve apontar para o endpoint público da API.
- Para acessar a aplicação a partir de outro dispositivo ou hostname, configure o endereço da API nos clientes e ajuste `CORS_ORIGIN` conforme necessário.
- Variáveis `EXPO_PUBLIC_*` são incorporadas ao bundle do cliente durante o build e podem ser visualizadas no navegador. Utilize-as somente para configurações públicas; nunca inclua tokens, senhas ou chaves privadas.
- Para builds e instalações reproduzíveis, mantenha o lockfile do gerenciador de pacotes versionado na raiz do monorepo.
