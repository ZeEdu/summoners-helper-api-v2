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

const recentGuides = {
  title: 'Guias Recentes'
}

const quickSearchbar = {
  searchbarPlaceholder: 'Busque por um guia',
  advancedSearchButton: 'Busca avançada',
  emptyText: 'Nenhum resultado encontrado'
}

const recentGuidesList = {
  reload: 'Ops! Um erro ocorreu... Clique para tentar novamente!',
  loadMore: 'Carregar mais',
  error: 'Erro ao buscar builds'
}

const advancedSearch = {
  form: {
    fields: {
      champion: {
        title: 'Campeão',
        placeholder: 'Selecione um campeão'
      },
      title: {
        label: 'Busque pelo título',
        placeholder: 'Busque pelo título'
      },
      role: {
        title: 'Role do campeão',
        placeholder: 'Busque de acordo com a role do campeão'
      },
      createdBy: {
        title: 'Criador do guia',
        placeholder: 'Busquem por quem criou o guia'
      },
      deprecatedPatch: {
        label: 'Buscar guias desatualizados'
      }
    },
    actions: {
      clear: 'Limpar',
      submit: 'Buscar'
    },
  },
  feedback: {
    loading: 'Carregando...',
    error: 'Um erro ocorreu...',
  },
  listEmpty: {
    empty: 'Atualize o filtro para encontrar um guia',
    fromSearch: 'Nenhum guia encontrado'
  },
  loadMore: 'Carregar mais',
  error: 'Erro ao buscar builds'
}

const guideListItem = {
  view: 'Visualizar',
  edit: 'Editar guia'
}

const createGuide = {
  error: 'Salvamento falhou. Tente novamente.',
  saveButton: {
    loading: 'Salvando...',
    text: 'Salvar'
  },
  steppers: {
    intro: 'Introdução',
    spells: 'Magias',
    primaryRunes: 'Runas Principais',
    secondaryRunes: 'Runas Secondárias',
    bonus: 'Bonus',
    items: 'Itens',
    progression: 'Progressão de Habilidades',
    threats: 'Ameaças',
    review: 'Revisão'
  },
  snack: {
    close: 'Fechar',
    success: 'Salvo com sucesso!'
  }
}

const stepper = {
  error: 'Deve passar mais de um elemento',
  footer: {
    next: 'Próximo passo',
    previous: 'Passo anterior'
  },
  contextError: 'StepperContext deve ser utilizado dentro de StepperProvider'
}

const userPicker = {
  title: 'Selecione o usuário',
  searchbar: 'Busque pelo usuário aqui',
  cancel: 'Cancelar'
}

const displayUserList = {
  idle: 'Busque por um usuário',
  notFound: 'Nenhum usuário encontrado'
}

const commentSection = {
  loadMore: 'Carregar mais',
  empty: 'Nenhum comentário foi feito. Seja o primeiro!'
}

const replies = {
  empty: {
    text: 'Esse comentário não tem nenhuma resposta',
    button: 'Responder'
  }
}

const postComment = {
  error: 'Não foi possivel criar o comentário',
  button: 'Comentar',
  replyTo: 'Responder',
  title: 'Novo Comentário',
  placeholder: 'Escreva a seu comentário...'
}

const replyCard = {
  replyTo: 'Respondendo a'
}

const comment = {
  reply: 'Responder',
  replies: 'Respostas'
}

const sideMenu = {
  report: 'Denunciar comentário'
}

const error = {
  text: 'Ops! Um erro ocorreu... Tente novamente mais tarde!'
}

const introForm = {
  title: {
    label: 'Titulo',
    placeholder: 'Titulo'
  },
  intro: {
    label: 'Introdução',
    placeholder: 'Introdução'
  },
  champion: {
    title: 'Selecione um campeão',
    placeholder: 'Selecione um campeão'
  },
  role: {
    title: 'Selecione um role',
    placeholder: 'Selecione um role'
  }
}

const progressionForm = {
  description: {
    label: 'Progressão das abilidades',
    placeholder: 'Descrição da Progressão das abilidades'
  },
  noChampionData: 'Nenhum campeão selecionado'
}

const bonusForm = {
  description: {
    label: 'Progressão das abilidades',
    placeholder: 'Descrição da Progressão das abilidades'
  },
  slotOne: {
    title: 'Selecione um bonus',
    placeholder: 'Selecione um bonus'
  },
  slotTwo: {
    title: 'Selecione um segundo bonus',
    placeholder: 'Selecione um segundo bonus'
  },
  slotThree: {
    title: 'Selecione um terceiro bonus',
    placeholder: 'Selecione um terceiro bonus'
  }
}

const slotBonus = {
  ADAPTIVE_FORCE: 'Força Adaptativa',
  ADAPTIVE_FORCE_SCALING: 'Força Adaptativa por nível',
  ARMOR: 'Armadura',
  ATTACK_SPEED: 'Velocidade de Ataque',
  CDR_SCALING: 'Aceleração de Habilidade por nível',
  HEALTH: 'Vida',
  HEALTH_SCALING: 'Vida por nível',
  HASTE: 'Aceleração de Habilidade',
  MOVEMENT_SPEED: 'Velocidade de Movimento',
  TENACITY: 'Tenacidade',
}

const slotBonusDescription = {
  ADAPTIVE_FORCE: 'Aumenta o dano de ataque ou o poder de habilidade.',
  ADAPTIVE_FORCE_SCALING: 'Aumenta a força adaptativa por nível.',
  ARMOR: 'Reduz o dano físico recebido.',
  ATTACK_SPEED: 'Aumenta a velocidade de ataque.',
  CDR_SCALING: 'Reduz o tempo de recarga das habilidades.',
  HEALTH: 'Aumenta a vida máxima.',
  HEALTH_SCALING: 'Aumenta a vida por nível.',
  HASTE: 'Permite usar habilidades com mais frequência.',
  MOVEMENT_SPEED: 'Aumenta a velocidade de movimento.',
  TENACITY: 'Reduz a duração dos efeitos de controle.',
}

const bonusLabelShards = {
  ADAPTIVE_FORCE: 'DANO / PODER',
  ADAPTIVE_FORCE_SCALING: 'DANO / PODER',
  ARMOR: 'ARMADURA',
  ATTACK_SPEED: 'VEL. ATAQUE',
  CDR_SCALING: 'ACEL. HAB.',
  HEALTH: 'VIDA',
  HEALTH_SCALING: 'VIDA',
  HASTE: 'ACEL. HAB.',
  MOVEMENT_SPEED: 'VEL. MOV.',
  TENACITY: 'TENACIDADE',
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
  myGuides,
  recentGuides,
  quickSearchbar,
  recentGuidesList,
  advancedSearch,
  guideListItem,
  createGuide,
  stepper,
  error,
  userPicker,
  displayUserList,
  commentSection,
  replies,
  postComment,
  replyCard,
  comment,
  sideMenu,
  introForm,
  progressionForm,
  bonusForm,
  slotBonus,
  slotBonusDescription,
  bonusLabelShards
}

export default ptBR