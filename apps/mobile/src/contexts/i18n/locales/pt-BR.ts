const profile = {
  header: {
    text: 'Perfil do Summoner\'s Helper'
  },
  personalInfo: {
    title: 'Informações pessoais',
    email: 'Email',
    username: 'Nome de usuário'
  },
  riotAccount: {
    title: 'Conta Riot',
    gameName: 'Nome no Jogo',
    tagLine: 'TagLine',
    server: 'servidor'
  },
  bindAccount: {
    title: 'Nenhuma conta vinculada',
    hint: 'Associe sua conta Riot para conectar seus dados de jogo ao perfil.',
    button: 'Vincular conta Riot'
  },
  toggleTheme: 'Trocar tema',
  logout: {
    button: 'Sair da conta',
    title: 'Você tem certeza?',
    content: 'Você tem certeza que quer deslogar?'
  },
  snackbar: 'Não foi possivel deslogar. Tente novamente'
}

const myGuides = {
  feedback: {
    loading: 'Carregando...',
    error: 'Um erro ocorreu',
    loadMore: 'Carregar mais',
    emptyList: 'Você não tem nenhuma build ainda',

  },
  filter: {
    buttons: {
      toggle: 'Filtros',
      clear: 'Limpar',
      submit: 'Buscar'
    },
    fields: {
      title: {
        label: 'Título',
        placeholder: 'Título'
      },
      champion: {
        title: 'Campeão',
        placeholder: 'Selecione um campeão'
      },
      role: {
        title: 'Selecione um role',
        placeholder: 'Selecione um role'
      }
    }
  }

}

const riot = {
  server: {
    br1: 'Brasil',
    eun1: 'Europa Nórdica e Oriental',
    euw1: 'Europa Ocidental',
    jp1: 'Japão',
    kr: 'Coreia',
    la1: 'América Latina Norte',
    la2: 'América Latina Sul',
    me1: 'Oriente Médio',
    na1: 'América do Norte',
    oc1: 'Oceania',
    ru: 'Rússia',
    sg2: 'Singapura, Malásia e Outros (SEA)',
    tr1: 'Turquia',
    tw2: 'Taiwan',
    vn2: 'Vietnã',
  }
}

const changeLanguage = {
  anchor: 'Trocar idioma',
  placeholder: 'Trocar idioma',
  title: 'Idioma',
  action: 'Selecionar idioma'
}

const general = {
  yes: 'sim',
  no: 'não'
}

const screens = {
  Profile: 'Perfil',
  MyGuides: 'Meus guias'
}

const ptBR = {
  changeLanguage,
  profile,
  riot,
  general,
  screens,
  myGuides
}

export default ptBR