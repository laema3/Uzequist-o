import { ProjectProfile, ProjectVideo, TeamMember, Topic } from '../types';

export const INITIAL_PROJECT_PROFILE: ProjectProfile = {
  name: 'As Belezas do Uzbequistão - Feira das Nações 2026',
  subtitle: 'Feira Cultural Gastronômica — Copa do Mundo 2026',
  turma: '8° B',
  country: 'Uzbequistão',
  event: 'Feira das Nações 2026',
  logoUrl: '/assets/uzbek_flag.svg',
  standDescription:
    'Nosso grupo do 8° B irá representar as belezas e tradições do Uzbequistão na Feira das Nações. Apresentamos a sociedade, os monumentos milenares e a deliciosa gastronomia do país, com destaque para a degustação de Samsa e o artesanato tradicional.',
  characteristics: [
    'Degustação da tradicional Samsa assada em embalagens individuais para os visitantes',
    'QR Code interativo na bancada com acesso imediato à receita e modo de preparo',
    'Exposição de pratos decorativos de papelão inspirados na tradicional cerâmica Lagans',
    'Decoração temática da bancada com a bandeira do Uzbequistão e roupas típicas',
    'Banner cultural informativo destacando sociedade, economia e monumentos da Rota da Seda',
    'Homenagem especial à pioneira médica Dra. Zulfiya Umidova e ao escritor Abdulla Qodiriy',
    'Apresentação multimídia com dança folclórica Lazgi e músicas patrimônio imaterial da UNESCO'
  ],
  sources: [
    'Portugal Exporta',
    'Brasil Escola',
    'Eurasia Travel',
    'Wikipedia',
    'UNESCO'
  ],
  contactEmail: 'turma8b.uzbequistao@feiradasnacoes.edu'
};

export const INITIAL_TEAM_MEMBERS: TeamMember[] = [
  {
    id: 'm1',
    name: 'Bárbara Maria Said',
    role: 'Pesquisa Histórica e Apresentação do Banner',
    turma: '8° B',
    photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    bio: 'Responsável pelo estudo das figuras históricas uzbeques e síntese visual do banner informativo.'
  },
  {
    id: 'm2',
    name: 'Isabella Borges',
    role: 'Coordenação Gastronômica & Receita da Samsa',
    turma: '8° B',
    photoUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80',
    bio: 'Responsável pela preparação das porções individuais de Samsa e guia dos ingredientes tradicionais.'
  },
  {
    id: 'm3',
    name: 'Laura Teixeira',
    role: 'Cultura, Músicas Folclóricas & Dança Lazgi',
    turma: '8° B',
    photoUrl: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=400&q=80',
    bio: 'Pesquisa sobre as manifestações imateriais da UNESCO como Lazgi, Shashmaqom e o festival Navruz.'
  },
  {
    id: 'm4',
    name: 'Luana Gonçalves',
    role: 'Artesanato & Confecção dos Pratos Lagans',
    turma: '8° B',
    photoUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80',
    bio: 'Confeccionou à mão as réplicas em papelão dos pratos de cerâmica típicos com padrões florais e geométricos.'
  },
  {
    id: 'm5',
    name: 'Maria Clara Ferreira',
    role: 'Decoração da Bancada & Vestimentas Típicas',
    turma: '8° B',
    photoUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
    bio: 'Criou a ambientação visual do estande com pintura da bandeira e elementos decorativos centro-asiáticos.'
  },
  {
    id: 'm6',
    name: 'Rafaela Borges',
    role: 'Interação com Visitantes & Recepção do Estande',
    turma: '8° B',
    photoUrl: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=400&q=80',
    bio: 'Apresenta a hospitalidade marcante do Uzbequistão e orienta o público através dos QR Codes interativos.'
  },
  {
    id: 'm7',
    name: 'Sara Menezes',
    role: 'Pesquisa Socioeconômica & Geopolítica',
    turma: '8° B',
    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    bio: 'Estruturou os dados sobre o PIB uzbeque, exportações minerais, contraste urbano-rural e o modelo econômico.'
  },
  {
    id: 'm8',
    name: 'Sofia Miranda',
    role: 'Coordenação Geral & Painel Multimídia',
    turma: '8° B',
    photoUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&q=80',
    bio: 'Supervisionou o cronograma da turma 8° B, integração de vídeos do YouTube e o suporte aos visitantes.'
  }
];

export const INITIAL_TOPICS: Topic[] = [
  {
    id: 'cultura-artesanato',
    title: 'Cultura, Tradições e Artesanato (Lagans)',
    shortSummary: 'A cerâmica artesanal Lagans, pratos decorados à mão, hospitalidade calorosa e a dança Lazgi.',
    category: 'cultura',
    iconName: 'Palette',
    highlightTag: 'Artesanato Típico',
    image: '/assets/uzbek_lagan.jpg',
    keyFacts: [
      'Ponto nevrálgico da milenar Rota da Seda entre o Oriente e o Ocidente',
      'Arquitetura monumental marcada por azulejos azul-turquesa e mosaicos celestes',
      'Lagans: Pratos de cerâmica artesanais pintados à mão com flores e geometrias',
      'Lazgi: Dança tradicional enérgica de Khorezm, reconhecida pela UNESCO',
      'Música folclórica Shashmaqom e Katta Ashula, e o festival da primavera Navruz'
    ],
    content: `A cultura uzbeque é uma confluência fascinante da Rota da Seda, tradições islâmicas refinadas, herança nômade turcomana e memórias do século XX. O país é famoso em todo o planeta pela sua arquitetura monumental em tons de azul-turquesa e pelo caloroso senso de acolhimento oferecido aos viajantes.

Um dos símbolos mais expressivos do artesanato são os Lagans — pratos de cerâmica ricamente pintados com desenhos botânicos e geométricos intrincados. Transmitidos de pai para filho por séculos, os Lagans não servem apenas para compartilhar refeições festivas, mas são itens de honra nas paredes e mesas das casas.

No campo das artes performáticas, destaca-se o Lazgi (dança vibrante de Khorezm repleta de gestos expressivos), além do Shashmaqom e Katta Ashula, gêneros musicais reconhecidos pela UNESCO como Patrimônio Cultural Imaterial da Humanidade. O início da primavera é consagrado pelo Navruz, um dos festivais mais alegres da nação.`
  },
  {
    id: 'socioeconomia',
    title: 'Aspectos Socioeconômicos e Políticos',
    shortSummary: 'PIB de US$ 72,76 bilhões, a 2ª maior economia da Ásia Central, recursos minerais e transição de mercado.',
    category: 'socioeconomia',
    iconName: 'TrendingUp',
    highlightTag: 'Economia & Sociedade',
    image: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&w=800&q=80',
    keyFacts: [
      '2ª maior economia de toda a Ásia Central',
      'PIB de aproximadamente 72,76 bilhões de dólares (dados do FMI)',
      'Estrutura econômica: Setor terciário (~48%), Indústria (33,7%) e Agropecuária (18%)',
      'Grandes riquezas minerais: ouro, petróleo, gás natural, carvão e algodão',
      'População jovem e forte papel das remessas financeiras enviadas do exterior'
    ],
    content: `O Uzbequistão foi uma das poucas economias da Europa e da Ásia Central que evidenciou um crescimento econômico positivo mesmo durante os desafios mundiais recentes. É a segunda maior economia da região, onde o Estado ainda preserva forte papel orientador, integrando gradualmente modelos modernos de livre mercado.

O PIB uzbeque é sustentado pelo setor terciário, seguido pela indústria (33,7%) e agropecuária (18%). Destaca-se globalmente pela extração e exportação de ouro, gás natural, carvão, hidrocarbonetos e algodão.

A sociedade é jovem e estruturada em fortes laços de respeito familiar. Há um contraste visual marcante entre a capital Tashkent — metrópole com metrô monumental e arranha-céus modernos — e as zonas rurais do interior. O país mantém relações diplomáticas ativas com seus vizinhos da Ásia Central e fronteira com o Afeganistão, priorizando estabilidade e desenvolvimento de infraestrutura.`
  },
  {
    id: 'cultura-artesanato',
    title: 'Cultura, Tradições e Artesanato (Lagans)',
    shortSummary: 'A magia da Rota da Seda: arquitetura turquesa, hospitalidade calorosa, dança Lazgi e cerâmica artesanal.',
    category: 'cultura',
    iconName: 'Palette',
    highlightTag: 'Patrimônio UNESCO',
    image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80',
    keyFacts: [
      'Ponto nevrálgico da milenar Rota da Seda entre o Oriente e o Ocidente',
      'Arquitetura monumental marcada por azulejos azul-turquesa e mosaicos celestes',
      'Lagans: Pratos de cerâmica artesanais pintados à mão com flores e geometrias',
      'Lazgi: Dança tradicional enérgica de Khorezm, reconhecida pela UNESCO',
      'Música folclórica Shashmaqom e Katta Ashula, e o festival da primavera Navruz'
    ],
    content: `A cultura uzbeque é uma confluência fascinante da Rota da Seda, tradições islâmicas refinadas, herança nômade turcomana e memórias do século XX. O país é famoso em todo o planeta pela sua arquitetura monumental em tons de azul-turquesa e pelo caloroso senso de acolhimento oferecido aos viajantes.

Um dos símbolos mais expressivos do artesanato são os Lagans — pratos de cerâmica ricamente pintados com desenhos botânicos e geométricos intrincados. Transmitidos de pai para filho por séculos, os Lagans não servem apenas para compartilhar refeições festivas, mas são itens de honra nas paredes e mesas das casas.

No campo das artes performáticas, destaca-se o Lazgi (dança vibrante de Khorezm repleta de gestos expressivos), além do Shashmaqom e Katta Ashula, gêneros musicais reconhecidos pela UNESCO como Patrimônio Cultural Imaterial da Humanidade. O início da primavera é consagrado pelo Navruz, um dos festivais mais alegres da nação.`
  },
  {
    id: 'religiao',
    title: 'Religião e Diversidade Espiritual',
    shortSummary: '97% da população pratica o Islão, convivendo em um Estado constitucionalmente laico com minorias históricas.',
    category: 'religiao',
    iconName: 'Compass',
    highlightTag: 'Estado Laico',
    image: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=800&q=80',
    keyFacts: [
      'Aproximadamente 97% da população segue o islamismo sunita',
      'Presença histórica de comunidades cristãs ortodoxas russas (3% a 5%)',
      'Centros históricos preservam pequenas comunidades judaicas milenares (Bukharian)',
      'A Constituição do Uzbequistão consagra expressamente o Estado como laico',
      'Forte valorização da tolerância inter-religiosa e convivência harmoniosa'
    ],
    content: `A religião predominante no Uzbequistão é o islamismo, estimado pelo Ministério das Relações Exteriores em cerca de 97% dos habitantes. O país possui papel de relevância histórica no pensamento islâmico, tendo sido berço de célebres teólogos, matemáticos e astrônomos de renome universal.

Paralelamente, o território abriga respeitadas minorias religiosas, como os cristãos ortodoxos russos (entre 3% e 5%) e antiquíssimas comunidades judaicas, especialmente na cidade de Bukhara.

Apesar da forte presença espiritual muçulmana na identidade e no cotidiano, a Constituição do Uzbequistão define o país como um Estado laico, mantendo controle e vigilância sobre a separação entre instituições civis e práticas religiosas para assegurar paz social.`
  },
  {
    id: 'monumentos',
    title: 'Principais Monumentos da Rota da Seda',
    shortSummary: 'Tesouros da humanidade: Praça Registan, Itchan Kala em Khiva, Complexo Poi Kalyan e o Mausoléu de Amir Timur.',
    category: 'monumentos',
    iconName: 'Landmark',
    highlightTag: 'Maravilhas do Mundo',
    image: 'https://images.unsplash.com/photo-1596484552834-6a58f850e0a1?auto=format&fit=crop&w=800&q=80',
    keyFacts: [
      'Praça Registan (Samarcanda - séc. XV a XVII): Três monumentais madraças ornadas com azulejos',
      'Itchan Kala (Khiva - séc. X a XIX): Cidadela fortificada no deserto da Rota da Seda',
      'Complexo Poi Kalyan (Bukhara - séc. XII a XVI): Minarete de 45m de altura e madraça Miri-Arab',
      'Mausoléu Gur-e-Amir (Samarcanda - séc. XV): Cúpula canelada turquesa onde jaz Amir Timur (Tamerlão)'
    ],
    content: `Viajar pelo Uzbequistão é caminhar diretamente dentro dos contos das Mil e Uma Noites. As cidades de Samarcanda, Bukhara e Khiva guardam alguns dos sítios históricos mais deslumbrantes da Terra:

1. Praça Registan (Samarcanda): O coração monumental do país. Composta por três gigantescas madraças (Ulugh Beg, Sher-Dor e Tilya-Kori) cujas fachadas brilham com mosaicos dourados e azuis.
2. Itchan Kala (Khiva): Verdadeiro museu a céu aberto cercado por muralhas de barro maciço de até 10 metros de altura, outrora parada vital das caravanas de camelos que cruzavam os desertos da Ásia.
3. Complexo Poi Kalyan (Bukhara): Conjunto arquitetônico sublime composto pela Mesquita Kalyan, o monumental Minarete Kalyan (que sobreviveu até às invasões de Gengis Khan) e a Madraça Miri-Arab.
4. Mausoléu Gur-e-Amir (Samarcanda): Panteão régio do imperador Amir Timur, famoso por sua monumental cúpula de 64 gomos azul-turquesa e abóbada interna folheada a ouro.`
  },
  {
    id: 'figuras-historicas',
    title: 'Figuras Históricas: Literatura e Ciência',
    shortSummary: 'O escritor Abdulla Qodiriy, pioneiro do romance uzbeque, e a Dra. Zulfiya Umidova, pioneira da medicina feminina.',
    category: 'figuras',
    iconName: 'Users',
    highlightTag: 'Legado e Coragem',
    image: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=800&q=80',
    keyFacts: [
      'Abdulla Qodiriy (1894–1938): Poeta, dramaturgo e criador do romance histórico uzbeque',
      'Obras célebres: "O‘tgan kunlar" (Dias Passados) e "Mehrobdan chayon" (Escorpião no Púlpito)',
      'Dra. Zulfiya Umidova (1897–1961): Médica e cientista pioneira em saúde pública e cardiologia',
      'Quebrou barreiras de gênero ao liderar pesquisas clínicas e formação de novos médicos',
      'Ambos são símbolos duradouros de resiliência intelectual e orgulho nacional uzbeque'
    ],
    content: `A história do Uzbequistão foi forjada por pensadores, pesquisadores e artistas que devotaram suas vidas ao desenvolvimento humanitário de seu povo:

Abdulla Qodiriy (1894–1938): Considerado o pai da prosa uzbeque moderna. Em 1922 publicou 'O‘tgan kunlar' (Dias Passados), o primeiro grande romance moderno em língua uzbeque, abordando os dilemas amorosos e políticos do século XIX. Vítima da repressão política soviética em 1938, foi reabilitado postumamente e reverenciado como herói literário da nação.

Dra. Zulfiya Umidova (1897–1961): Em um período histórico no qual pouquíssimas mulheres tinham oportunidade de frequentar o ensino superior, Zulfiya destacou-se como médica brilhante, cientista e professora. Dedicou décadas à medicina preventiva, saúde materno-infantil e atendimento clínico na Ásia Central, inspirando gerações de jovens garotas a ingressarem nas carreiras científicas.`
  },
  {
    id: 'culinaria',
    title: 'Culinária Tradicional: Samsa e Shashlik',
    shortSummary: 'Receitas milenares da Rota da Seda: a famosa Samsa com massa folhada e recheio suculento, e o Shashlik marinado.',
    category: 'culinaria',
    iconName: 'UtensilsCrossed',
    highlightTag: 'Degustação na Bancada',
    image: 'https://images.unsplash.com/photo-1541518763669-27fef04b14ea?auto=format&fit=crop&w=800&q=80',
    keyFacts: [
      'Samsa: Pastel assado triangular típico que alimentava os caravaneiros da Rota da Seda',
      'Massa delicadamente aberta com nós dos dedos e dobrada para criar camadas crocantes',
      'Recheio generoso com carne bovina em cubos finos, bastante cebola, cominho e pimenta',
      'Shashlik: Espetinhos de carne assados na brasa com o segredo da marinada com água com gás',
      'Palov: Prato nacional uzbeque à base de arroz temperado, legumes dourados e especiarias'
    ],
    recipeDetails: {
      prepTime: '50 minutos + 20 min descanso',
      yields: '12 a 16 unidades triangulares',
      doughIngredients: [
        '1 xícara e meia de água morna',
        '1 colher de sopa de sal',
        '4 xícaras de farinha de trigo (+ ½ xícara se necessário para sovar)',
        '1 colher de chá de fermento biológico seco ativo',
        '½ colher de chá de açúcar',
        '1 xícara de manteiga derretida para folhear',
        '1 gema de ovo batida com um pingo de água para pincelar',
        'Sementes de gergelim preto e branco para salpicar por cima'
      ],
      fillingIngredients: [
        '1,5 libras (~700g) de carne bovina picada em cubinhos bem pequenos',
        '3 cebolas médias cortadas transversalmente em fatias finíssimas',
        '1 colher de sopa de sal (ou a gosto)',
        '1 colher e meia de sopa de sementes de cominho levemente trituradas',
        '½ colher de sopa de pimenta-do-reino moída na hora'
      ],
      steps: [
        'Na tigela com água morna, dissolva o fermento, açúcar e 1 colher de sal. Adicione a farinha aos poucos e sove até obter uma massa lisa que não grude nas mãos. Cubra e deixe descansar por 20 minutos.',
        'Em outra tigela, junte a carne picadinha. Coloque as fatias de cebola por cima, polvilhe o sal, o cominho triturado e a pimenta. Aperte a cebola com as mãos para liberar o suco e misture tudo muito bem com a carne.',
        'Usando os nós dos dedos, abra a massa descansada em círculos sobre superfície enfarinhada. Use o rolo de massa em movimentos uniformes de vai e vem, e puxe delicadamente as bordas com as mãos para esticar a massa.',
        'Coloque uma colher generosa de recheio de carne e cebola na borda. Dobre a massa formando triângulos perfeitos, selando bem as extremidades para reter os sucos.',
        'Disponha as samsas em assadeira com papel manteiga. Pincele com a gema de ovo, salpique gergelim e asse em forno pré-aquecido a 190°C (375°F) até dourar intensamente (cerca de 30 a 35 minutos).'
      ],
      tips: 'O grande segredo do recheio da Samsa tradicional uzbeque é não economizar na cebola finamente fatiada e no cominho triturado: ao assar, a cebola derrete e cria um caldo suculento dentro da casquinha crocante!'
    },
    content: `A gastronomia do Uzbequistão é um dos pilares mais festejados de sua identidade. Durante nossa participação na Feira das Nações, os visitantes terão a oportunidade de experimentar a autêntica Samsa uzbeque!

A Samsa é uma iguaria com mais de mil anos de história. Popularizada nas antigas rotas de comércio do deserto, servia como refeição resistente, muito saborosa e substanciosa. Diferente de salgados fritos convencionais, a Samsa é tradicionalmente assada em fornos tandyr de barro (ou fornos caseiros), gerando uma massa dourada e estaladiça recheada de carne nobre, cebolas aromáticas e o inconfundível perfume do cominho.

Outro prato reverenciado é o Shashlik, espetos de carne nobre com gordura grelhados no carvão. O segredo uzbeque consiste em marinar a carne com cebola e água com gás, cujo gás carbônico age quebrando as fibras musculares, deixando a carne incrivelmente macia e suculenta.`
  }
];

export const INITIAL_VIDEOS: ProjectVideo[] = [
  {
    id: 'v1',
    title: 'Samarcanda: A Joia Encantada da Rota da Seda',
    youtubeUrl: 'https://www.youtube.com/watch?v=0hY8-K0uHqA',
    topicId: 'monumentos',
    description: 'Imagens aéreas e detalhes dos mosaicos turquesa da Praça Registan e do mausoléu Gur-e-Amir.',
    duration: '6:45'
  },
  {
    id: 'v2',
    title: 'Como Fazer a Verdadeira Samsa Uzbeque Passo a Passo',
    youtubeUrl: 'https://www.youtube.com/watch?v=p1Jt_N9w-oU',
    topicId: 'culinaria',
    description: 'Abertura da massa folhada, preparo do recheio de carne com cominho e o ponto correto de cozimento.',
    duration: '8:20'
  },
  {
    id: 'v3',
    title: 'Dança Tradicional Lazgi: Patrimônio Imaterial da UNESCO',
    youtubeUrl: 'https://www.youtube.com/watch?v=vV_XUkmf8kQ',
    topicId: 'cultura-artesanato',
    description: 'Apresentação coreografada com trajes típicos bordados em ouro e a contagiante percussão uzbeque.',
    duration: '4:15'
  },
  {
    id: 'v4',
    title: 'Cultura, Sociedade e o Cotidiano no Uzbequistão',
    youtubeUrl: 'https://www.youtube.com/watch?v=kYJvM9O3gXU',
    topicId: 'socioeconomia',
    description: 'Um panorama sobre Tashkent moderna, mercados de especiarias e as reformas econômicas.',
    duration: '10:10'
  }
];
