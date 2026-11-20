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

O endereço da API utilizado pelo aplicativo está definido em `apps/mobile/src/services/api/api.constants.ts`. Atualmente, o código utiliza `10.0.2.2` para plataformas nativas e `localhost` para Web. Em dispositivos físicos ou em ambientes com outro endereço de API, ajuste essa configuração.

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

- A API e os clientes utilizam `http://localhost:3000/api` como endereço base configurado no código atual.
- Para acessar a aplicação a partir de outro dispositivo ou hostname, configure o endereço da API nos clientes e ajuste `CORS_ORIGIN` conforme necessário.
- Variáveis `EXPO_PUBLIC_*`, caso sejam introduzidas para configurar o Mobile Web, serão incorporadas ao bundle do cliente e não devem conter segredos.
- Para builds e instalações reproduzíveis, mantenha o lockfile do gerenciador de pacotes versionado na raiz do monorepo.
