
import { Language } from "@/store/slices/uiSlice";

// EJMP: obj: { es: "", en: "", br: "" },

export const t: Record<string, Record<string, string>> = {
  // Landing
  // ===== Header / Navegación =====
  nav_nosotros: { es: "Nosotros", en: "About us", br: "Sobre nós" },
  nav_como_funciona: { es: "Cómo funciona", en: "How it works", br: "Como funciona" },
  nav_empresas: { es: "Empresas", en: "Companies", br: "Empresas" },
  nav_testimonios: { es: "Testimonios", en: "Testimonials", br: "Depoimentos" },
  nav_preguntas: { es: "Preguntas", en: "Questions", br: "Perguntas" },
  nav_explorar_rifas: { es: "EXPLORAR RIFAS", en: "EXPLORE RAFFLES", br: "EXPLORAR RIFAS" },
  nav_abrir_menu: { es: "Abrir menú", en: "Open menu", br: "Abrir menu" },

  // ===== Hero =====
  hero_badge: { es: "LA PLATAFORMA DE LOS GRANDES SORTEOS", en: "THE PLATFORM FOR BIG GIVEAWAYS", br: "A PLATAFORMA DOS GRANDES SORTEIOS" },
  hero_title_part1: { es: "Tu suerte puede", en: "Your luck can", br: "A sua sorte pode" },
  hero_title_part2: { es: "cambiarlo todo.", en: "change everything.", br: "mudar tudo." },
  hero_subtitle: { es: "Descubre empresas de rifas verificadas, participa en sorteos increíbles y sigue cada resultado en un solo lugar.", en: "Discover verified raffle companies, join incredible giveaways and follow every result in one place.", br: "Descubra empresas de rifas verificadas, participe de sorteios incríveis e acompanhe cada resultado em um só lugar." },
  hero_cta_primary: { es: "VER RIFAS DISPONIBLES", en: "SEE AVAILABLE RAFFLES", br: "VER RIFAS DISPONÍVEIS" },
  hero_cta_secondary: { es: "CONOCE RIFAS PRO", en: "GET TO KNOW RIFAS PRO", br: "CONHEÇA A RIFAS PRO" },
  hero_feature_verified: { es: "EMPRESAS VERIFICADAS", en: "VERIFIED COMPANIES", br: "EMPRESAS VERIFICADAS" },
  hero_feature_secure: { es: "EXPERIENCIA SEGURA", en: "SECURE EXPERIENCE", br: "EXPERIÊNCIA SEGURA" },
  hero_img_alt: { es: "Automóvil deportivo, uno de los premios que puedes encontrar en Rifas Pro", en: "Sports car, one of the prizes you can find on Rifas Pro", br: "Carro esportivo, um dos prêmios que você pode encontrar na Rifas Pro" },

  // ===== Stats =====
  stat_companies: { es: "EMPRESAS ACTIVAS", en: "ACTIVE COMPANIES", br: "EMPRESAS ATIVAS" },
  stat_tickets: { es: "BOLETOS GESTIONADOS", en: "TICKETS MANAGED", br: "BILHETES GERENCIADOS" },
  stat_prizes: { es: "EN PREMIOS PUBLICADOS", en: "IN PUBLISHED PRIZES", br: "EM PRÊMIOS PUBLICADOS" },
  stat_uptime: { es: "DISPONIBILIDAD", en: "UPTIME", br: "DISPONIBILIDADE" },

  // ===== Nosotros =====
  about_img_alt: { es: "Plataforma Rifas Pro en distintos dispositivos", en: "Rifas Pro platform on different devices", br: "Plataforma Rifas Pro em diferentes dispositivos" },
  about_next_raffle: { es: "PRÓXIMO SORTEO", en: "NEXT GIVEAWAY", br: "PRÓXIMO SORTEIO" },
  about_toast_confirmed: { es: "Boleto confirmado", en: "Ticket confirmed", br: "Bilhete confirmado" },
  about_eyebrow: { es: "QUIÉNES SOMOS", en: "WHO WE ARE", br: "QUEM SOMOS" },
  about_title: { es: "La tecnología detrás de cada gran oportunidad.", en: "The technology behind every great opportunity.", br: "A tecnologia por trás de cada grande oportunidade." },
  about_p1: { es: "Rifas Pro nació para profesionalizar la industria de los sorteos. Conectamos a organizadores serios con miles de participantes a través de experiencias digitales claras, ágiles y confiables.", en: "Rifas Pro was born to professionalize the raffle industry. We connect serious organizers with thousands of participants through clear, agile and reliable digital experiences.", br: "A Rifas Pro nasceu para profissionalizar a indústria dos sorteios. Conectamos organizadores sérios a milhares de participantes por meio de experiências digitais claras, ágeis e confiáveis." },
  about_p2: { es: "No somos una rifa: somos la infraestructura que ayuda a cada empresa a gestionar sus boletos, pagos y resultados con transparencia.", en: "We are not a raffle: we are the infrastructure that helps each company manage its tickets, payments and results with transparency.", br: "Não somos uma rifa: somos a infraestrutura que ajuda cada empresa a gerenciar seus bilhetes, pagamentos e resultados com transparência." },
  about_val1_title: { es: "Transparencia primero", en: "Transparency first", br: "Transparência em primeiro lugar" },
  about_val1_desc: { es: "Información clara para que participes con confianza.", en: "Clear information so you can participate with confidence.", br: "Informações claras para você participar com confiança." },
  about_val2_title: { es: "Tecnología que responde", en: "Technology that responds", br: "Tecnologia que responde" },
  about_val2_desc: { es: "Una plataforma rápida, estable y disponible 24/7.", en: "A fast, stable platform available 24/7.", br: "Uma plataforma rápida, estável e disponível 24/7." },
  about_val3_title: { es: "Empresas con identidad", en: "Companies with identity", br: "Empresas com identidade" },
  about_val3_desc: { es: "Cada organizador conserva su marca y comunidad.", en: "Each organizer keeps their brand and community.", br: "Cada organizador mantém sua marca e comunidade." },
  about_val4_title: { es: "Soporte humano", en: "Human support", br: "Suporte humano" },
  about_val4_desc: { es: "Acompañamiento real detrás de cada experiencia.", en: "Real support behind every experience.", br: "Acompanhamento real por trás de cada experiência." },

  // ===== Cómo funciona =====
  how_eyebrow: { es: "PARTICIPAR ES MUY FÁCIL", en: "PARTICIPATING IS EASY", br: "PARTICIPAR É MUITO FÁCIL" },
  how_title: { es: "Tu próximo premio está a tres pasos.", en: "Your next prize is three steps away.", br: "Seu próximo prêmio está a três passos." },
  how_subtitle: { es: "Encuentra una empresa, elige el sorteo que más te guste y participa desde su sitio oficial.", en: "Find a company, choose the giveaway you like most and participate from its official site.", br: "Encontre uma empresa, escolha o sorteio que mais gostar e participe pelo site oficial dela." },
  how_step_label: { es: "PASO", en: "STEP", br: "PASSO" },
  how_step1_title: { es: "Explora", en: "Explore", br: "Explore" },
  how_step1_desc: { es: "Conoce las empresas que operan con Rifas Pro y descubre sus premios disponibles.", en: "Get to know the companies that operate with Rifas Pro and discover their available prizes.", br: "Conheça as empresas que operam com a Rifas Pro e descubra seus prêmios disponíveis." },
  how_step2_title: { es: "Elige tus números", en: "Choose your numbers", br: "Escolha seus números" },
  how_step2_desc: { es: "Entra al sitio oficial de la empresa y selecciona tus boletos de la suerte.", en: "Go to the company's official site and select your lucky tickets.", br: "Entre no site oficial da empresa e selecione seus bilhetes da sorte." },
  how_step3_title: { es: "Sigue el sorteo", en: "Follow the giveaway", br: "Acompanhe o sorteio" },
  how_step3_desc: { es: "Recibe tu confirmación y consulta resultados directamente con el organizador.", en: "Receive your confirmation and check results directly with the organizer.", br: "Receba sua confirmação e consulte os resultados diretamente com o organizador." },

  // ===== Empresas =====
  companies_eyebrow: { es: "COMUNIDAD RIFAS PRO", en: "RIFAS PRO COMMUNITY", br: "COMUNIDADE RIFAS PRO" },
  companies_title: { es: "Elige dónde empieza tu suerte.", en: "Choose where your luck begins.", br: "Escolha onde a sua sorte começa." },
  companies_subtitle: { es: "Explora empresas que confían en nuestra tecnología. Cada una cuenta con su propio catálogo, comunidad y sitio oficial.", en: "Explore companies that trust our technology. Each one has its own catalog, community and official site.", br: "Explore empresas que confiam na nossa tecnologia. Cada uma tem seu próprio catálogo, comunidade e site oficial." },
  no_companies_found: { es: "No se encontraron empresas.", en: "No companies found.", br: "Nenhuma empresa encontrada." },

  // ===== Testimonios =====
  testimonials_eyebrow: { es: "HISTORIAS DE LA COMUNIDAD", en: "COMMUNITY STORIES", br: "HISTÓRIAS DA COMUNIDADE" },
  testimonials_quote: { es: "“Pensé que era uno más de mis boletos de siempre. Cuando vi mi número en pantalla, no lo podía creer. Hoy esa camioneta está en mi cochera.”", en: "\"I thought it was just another one of my usual tickets. When I saw my number on screen, I couldn't believe it. Today that truck is in my garage.\"", br: "\"Pensei que era mais um dos meus bilhetes de sempre. Quando vi meu número na tela, não pude acreditar. Hoje essa caminhonete está na minha garagem.\"" },
  testimonials_winner_name: { es: "José Manuel R.", en: "José Manuel R.", br: "José Manuel R." },
  testimonials_winner_info: { es: "Ganador en Sorteos del Norte · Chihuahua", en: "Winner at Sorteos del Norte · Chihuahua", br: "Ganhador no Sorteos del Norte · Chihuahua" },

  // ===== Preguntas frecuentes =====
  faq_eyebrow: { es: "PREGUNTAS FRECUENTES", en: "FREQUENTLY ASKED QUESTIONS", br: "PERGUNTAS FREQUENTES" },
  faq_title: { es: "Todo claro antes de participar.", en: "Everything clear before participating.", br: "Tudo claro antes de participar." },
  faq_subtitle: { es: "Resolvemos las dudas más comunes para que tu única preocupación sea elegir tus números.", en: "We answer the most common questions so your only concern is choosing your numbers.", br: "Respondemos às dúvidas mais comuns para que sua única preocupação seja escolher seus números." },
  faq_contact_support: { es: "HABLAR CON SOPORTE", en: "TALK TO SUPPORT", br: "FALAR COM O SUPORTE" },

  faq_q1: { es: "¿Rifas Pro organiza los sorteos?", en: "Does Rifas Pro organize the giveaways?", br: "A Rifas Pro organiza os sorteios?" },
  faq_a1: { es: "No. Rifas Pro es la plataforma tecnológica; cada empresa organiza y opera su propio sorteo.", en: "No. Rifas Pro is the technology platform; each company organizes and operates its own giveaway.", br: "Não. A Rifas Pro é a plataforma tecnológica; cada empresa organiza e opera seu próprio sorteio." },
  faq_q2: { es: "¿Cómo sé que una empresa es confiable?", en: "How do I know a company is trustworthy?", br: "Como sei que uma empresa é confiável?" },
  faq_a2: { es: "Todas las empresas listadas pasan por un proceso de verificación antes de operar con nosotros.", en: "All listed companies go through a verification process before operating with us.", br: "Todas as empresas listadas passam por um processo de verificação antes de operar conosco." },
  faq_q3: { es: "¿Cómo participo en un sorteo?", en: "How do I participate in a giveaway?", br: "Como participo de um sorteio?" },
  faq_a3: { es: "Elige la empresa y el sorteo que te interese, entra a su sitio oficial y sigue las instrucciones para seleccionar tus boletos y completar el pago.", en: "Choose the company and giveaway you're interested in, go to its official site and follow the instructions to select your tickets and complete the payment.", br: "Escolha a empresa e o sorteio que lhe interessar, entre no site oficial dela e siga as instruções para selecionar seus bilhetes e concluir o pagamento." },
  faq_q4: { es: "¿Dónde puedo consultar los resultados?", en: "Where can I check the results?", br: "Onde posso consultar os resultados?" },
  faq_a4: { es: "Cada organizador publica los resultados en su sitio oficial y notifica directamente a los ganadores. Rifas Pro no opera los sorteos.", en: "Each organizer publishes the results on its official site and notifies the winners directly. Rifas Pro does not operate the giveaways.", br: "Cada organizador publica os resultados no site oficial e notifica diretamente os ganhadores. A Rifas Pro não opera os sorteios." },

  // ===== CTA final =====
  cta_eyebrow: { es: "¿LISTO PARA PROBAR TU SUERTE?", en: "READY TO TRY YOUR LUCK?", br: "PRONTO PARA TENTAR A SORTE?" },
  cta_title: { es: "Tu próximo gran momento puede empezar hoy.", en: "Your next big moment can start today.", br: "Seu próximo grande momento pode começar hoje." },
  cta_button: { es: "EXPLORAR EMPRESAS", en: "EXPLORE COMPANIES", br: "EXPLORAR EMPRESAS" },

  // ===== Footer =====
  footer_tagline: { es: "Tecnología que conecta grandes premios con personas que se atreven a probar su suerte.", en: "Technology that connects great prizes with people who dare to try their luck.", br: "Tecnologia que conecta grandes prêmios com pessoas que ousam tentar a sorte." },
  footer_explore: { es: "EXPLORA", en: "EXPLORE", br: "EXPLORE" },
  footer_about: { es: "Nosotros", en: "About us", br: "Sobre nós" },
  footer_companies: { es: "Empresas", en: "Companies", br: "Empresas" },
  footer_winners: { es: "Ganadores", en: "Winners", br: "Ganhadores" },
  footer_help: { es: "AYUDA", en: "HELP", br: "AJUDA" },
  footer_faq: { es: "Preguntas frecuentes", en: "Frequently asked questions", br: "Perguntas frequentes" },
  footer_contact: { es: "Contacto", en: "Contact", br: "Contato" },
  footer_privacy: { es: "Aviso de privacidad", en: "Privacy notice", br: "Aviso de privacidade" },
  footer_organizers_title: { es: "¿ORGANIZAS RIFAS?", en: "DO YOU ORGANIZE RAFFLES?", br: "VOCÊ ORGANIZA RIFAS?" },
  footer_organizers_desc: { es: "Lleva tu negocio al siguiente nivel con la plataforma líder.", en: "Take your business to the next level with the leading platform.", br: "Leve seu negócio para o próximo nível com a plataforma líder." },
  footer_platform_cta: { es: "CONOCER LA PLATAFORMA", en: "DISCOVER THE PLATFORM", br: "CONHECER A PLATAFORMA" },
  footer_copyright: { es: "© 2025 RIFAS PRO. TODOS LOS DERECHOS RESERVADOS.", en: "© 2025 RIFAS PRO. ALL RIGHTS RESERVED.", br: "© 2025 RIFAS PRO. TODOS OS DIREITOS RESERVADOS." },
  footer_disclaimer: { es: "RIFAS PRO NO ORGANIZA NI OPERA SORTEOS DIRECTAMENTE.", en: "RIFAS PRO DOES NOT ORGANIZE OR OPERATE GIVEAWAYS DIRECTLY.", br: "A RIFAS PRO NÃO ORGANIZA NEM OPERA SORTEIOS DIRETAMENTE." },

  // Auth
  welcome_back: { es: "¡Bienvenido de vuelta!", en: "Welcome back!", br: "Bem-vindo de volta!" },
  sign_in: { es: "Iniciar sesión", en: "Sign in", br: "Entrar" },
  email: { es: "Correo electrónico", en: "Email", br: "E-mail" },
  password: { es: "Contraseña", en: "Password", br: "Senha" },
  new_password: { es: "Nueva contraseña", en: "New password", br: "Nova senha" },
  confirm_password: { es: "Confirmar contraseña", en: "Confirm Password", br: "Confirmar senha" },
  remember_me: { es: "Recordarme", en: "Remember me", br: "Lembrar de mim" },
  forgot_password: { es: "¿Olvidaste tu contraseña?", en: "Forgot password?", br: "Esqueceu sua senha?" },
  signing_in: { es: "Iniciando sesión...", en: "Signing in...", br: "Entrando..." },
  select_company: { es: "Selecciona tu empresa", en: "Select your company", br: "Selecione sua empresa" },
  select_company_sub: { 
    es: "Eres miembro de varias empresas. ¿Con cuál deseas trabajar?", 
    en: "You belong to multiple companies. Which one would you like to work with?",
    br: "Você é membro de várias empresas. Com qual deseja trabalhar?"
  },
  enter: { es: "Ingresar", en: "Enter", br: "Entrar" },
  logout: { es: "Cerrar sesión", en: "Log out", br: "Sair" },
  my_profile: { es: "Mi perfil", en: "My profile", br: "Meu perfil" },

  // Nav
  dashboard: { es: "Dashboard", en: "Dashboard", br: "Painel" },
  companies: { es: "Empresas", en: "Companies", br: "Empresas" },
  raffles: { es: "Rifas", en: "Raffles", br: "Rifas" },
  number_board: { es: "Tablero", en: "Number Board", br: "Painel de números" },
  users: { es: "Usuarios", en: "Users", br: "Usuários" },
  logs: { es: "Bitácora", en: "Logs", br: "Registros" },
  settings: { es: "Configuración", en: "Settings", br: "Configurações" },

  // Dashboard
  active_raffles: { es: "Rifas activas", en: "Active raffles", br: "Rifas ativas" },
  sold_today: { es: "Vendidos hoy", en: "Sold today", br: "Vendidos hoje" },
  total_sold: { es: "Total vendidos", en: "Total sold", br: "Total vendidos" },
  estimated_revenue: { es: "Ingresos estimados", en: "Estimated revenue", br: "Receita estimada" },
  next_draw: { es: "Próximo sorteo", en: "Next draw", br: "Próximo sorteio" },
  day: { es: "Día", en: "Days", br: "Dia" },
  days: { es: "Días", en: "Days", br: "Dias" },
  hours: { es: "Horas", en: "Hours", br: "Horas" },
  mins: { es: "Min", en: "Min", br: "Min" },
  secs: { es: "Seg", en: "Sec", br: "Seg" },
  week: { es: "Semana", en: "Week", br: "Semana" },
  weeks: { es: "Semanas", en: "Weeks", br: "Semanas" },
  recent_raffles: { es: "Últimas rifas", en: "Recent raffles", br: "Rifas recentes" },
  raffle_name: { es: "Nombre", en: "Name", br: "Nome" },
  draw_date: { es: "Fecha sorteo", en: "Draw date", br: "Data do sorteio" },
  status: { es: "Estado", en: "Status", br: "Estado" },
  winner_num: { es: "N° ganador", en: "Winner #", br: "N° ganhador" },
  winner: { es: "Ganador", en: "Winner", br: "Vencedor" },
  new_raffle: { es: "Nueva rifa", en: "New raffle", br: "Nova rifa" },
  view_board: { es: "Ver tablero", en: "View board", br: "Ver painel" },

  // Status badges
  active: { es: "Activo", en: "Active", br: "Ativo" },
  inactive: { es: "Inactivo", en: "Inactive", br: "Inativo" },
  draft: { es: "Borrador", en: "Draft", br: "Rascunho" },
  completed: { es: "Completada", en: "Completed", br: "Concluída" },
  closed: { es: "Cerrada", en: "Closed", br: "Fechada" },

  // Raffle Editor
  no_raffles_found: { es: "No hay rifas registradas", en: "No raffles found", br: "Nenhuma rifa registrada" },
  create_raffle: { es: "Crear rifa", en: "Create raffle", br: "Criar rifa" },
  edit_raffle: { es: "Editar rifa", en: "Edit raffle", br: "Editar rifa" },
  step_data: { es: "Datos", en: "Data", br: "Dados" },
  step_numbers: { es: "Numeración", en: "Numbers", br: "Numeração" },
  step_design: { es: "Diseño", en: "Design", br: "Design" },
  raffle_name_label: { es: "Nombre de la Rifa", en: "Raffle Name", br: "Nome da Rifa" },
  description: { es: "Descripción", en: "Description", br: "Descrição" },
  draw_date_label: { es: "Fecha y Hora del Sorteo", en: "Draw Date & Time", br: "Data e Hora do Sorteio" },
  image: { es: "Imagen", en: "Image", br: "Imagem" },
  drag_drop: { es: "Arrastra o haz clic para subir imagen", en: "Drag or click to upload image", br: "Arraste ou clique para enviar imagem" },
  total_numbers: { es: "Cantidad de Números", en: "Total Numbers", br: "Quantidade de Números" },
  digits: { es: "Dígitos", en: "Digits", br: "Dígitos" },
  digits_preview: { es: "Previsualización", en: "Preview", br: "Pré-visualização" },
  price_per_number: { es: "Precio por Número", en: "Price per Number", br: "Preço por Número" },
  theme: { es: "Temática", en: "Theme", br: "Tema" },
  font: { es: "Fuente", en: "Font", br: "Fonte" },
  bg_color: { es: "Color de Fondo", en: "Background Color", br: "Cor de Fundo" },
  num_color: { es: "Color de Números", en: "Number Color", br: "Cor dos Números" },
  live_preview: { es: "Vista Previa en Vivo", en: "Live Preview", br: "Pré-visualização ao Vivo" },
  prev: { es: "Anterior", en: "Previous", br: "Anterior" },
  next: { es: "Siguiente", en: "Next", br: "Próximo" },
  save: { es: "Guardar", en: "Save", br: "Salvar" },
  cancel: { es: "Cancelar", en: "Cancel", br: "Cancelar" },
  saving: { es: "Guardando...", en: "Saving...", br: "Salvando..." },
  describe_prizes_and_conditions: { es: "Describe los premios y condiciones...", en: "Describe prizes and conditions...", br: "Descreva os prêmios e as condições..." },

  // Number Board
  available: { es: "Disponible", en: "Available", br: "Disponível" },
  reserved: { es: "Reservado", en: "Reserved", br: "Reservado" },
  sold: { es: "Vendido", en: "Sold", br: "Vendido" },
  sold_out: { es: "Agotado", en: "Sold Out", br: "Esgotado" },
  confirm_sale: { es: "Confirmar Venta", en: "Confirm Sale", br: "Confirmar Venda" },
  client_name: { es: "Nombre del Cliente", en: "Client Name", br: "Nome do Cliente" },
  phone: { es: "Teléfono", en: "Phone", br: "Telefone" },
  number_selected: { es: "Número(s) Seleccionado(s)", en: "Selected Number", br: "Número(s) Selecionado(s)" },
  confirm: { es: "Confirmar", en: "Confirm", br: "Confirmar" },
  sale_confirmed: { es: "¡Venta confirmada!", en: "Sale confirmed!", br: "Venda confirmada!" },
  proceed_to_payment : { es: "Ir a pagar", en: "Proceed to payment", br: "Ir para pagamento" },
  no_active_raffles: { es: "No hay rifas activas.", en: "No active raffles.", br: "Nenhuma rifa ativa." },

  // Users
  user_management: { es: "Gestión de Usuarios", en: "User Management", br: "Gestão de Usuários" },
  add_user: { es: "Agregar Usuario", en: "Add User", br: "Adicionar Usuário" },
  name: { es: "Nombre", en: "Name", br: "Nome" },
  role: { es: "Rol", en: "Role", br: "Função" },
  state: { es: "Estado", en: "State", br: "Estado" },
  actions: { es: "Acciones", en: "Actions", br: "Ações" },
  edit: { es: "Editar", en: "Edit", br: "Editar" },
  delete: { es: "Eliminar", en: "Delete", br: "Excluir" },
  superadmin: { es: "SuperAdmin", en: "SuperAdmin", br: "SuperAdmin" },
  admin: { es: "Administrador", en: "Admin", br: "Administrador" },
  seller: { es: "Vendedor", en: "Seller", br: "Vendedor" },
  viewer: { es: "Visualizador", en: "Viewer", br: "Visualizador" },
  save_changes: { es: "Guardar Cambios", en: "Save Changes", br: "Salvar Alterações" },
  registered_users: { es: "usuarios registrados", en: "registered users", br: "usuários registrados" },
  user_saved: { es: "Usuario guardado", en: "User saved", br: "Usuário salvo" },
  user_deleted: { es: "Usuario eliminado", en: "User deleted", br: "Usuário excluído" },
  status_updated_successfully: { es: "Estado actualizado", en: "Status updated", br: "Status atualizado" },

  // Logs
  audit_log: { es: "Bitácora de Auditoría", en: "Audit Log", br: "Registro de Auditoria" },
  datetime: { es: "Fecha/Hora", en: "Date/Time", br: "Data/Hora" },
  user: { es: "Usuario", en: "User", br: "Usuário" },
  action: { es: "Acción", en: "Action", br: "Ação" },
  table: { es: "Tabla", en: "Table", br: "Tabela" },
  detail: { es: "Detalle", en: "Detail", br: "Detalhe" },
  view_detail: { es: "Ver Detalle", en: "View Detail", br: "Ver Detalhe" },
  previous_value: { es: "Valor Anterior", en: "Previous Value", br: "Valor Anterior" },
  new_value: { es: "Valor Nuevo", en: "New Value", br: "Novo Valor" },
  close: { es: "Cerrar", en: "Close", br: "Fechar" },
  logs_found: { es: "Registros encontrados", en: "Logs found", br: "Registros encontrados" },

  // General
  search: { es: "Buscar...", en: "Search...", br: "Buscar..." },
  notifications: { es: "Notificaciones", en: "Notifications", br: "Notificações" },
  no_data: { es: "Sin datos", en: "No data", br: "Sem dados" },
  loading: { es: "Cargando...", en: "Loading...", br: "Carregando..." },
  success: { es: "Éxito", en: "Success", br: "Sucesso" },
  failure: { es: "Error", en: "Failure", br: "Erro" },
  page: { es: "Página", en: "Page", br: "Página" },
  of: { es: "de", en: "of", br: "de" },
  or: { es: "o", en: "or", br: "ou" },
  new: { es: "Nuevo", en: "New", br: "Novo" },
  date: { es: "Fecha", en: "Date", br: "Data" },
  all: { es: "Todo", en: "All", br: "Tudo" },
  username: { es: "Nombre de usuario", en: "Username", br: "Nome de usuário" },
  language_switch: { es: "Cambiar a ingles o portugues", en: "Switch to spanish or portuguese", br: "Mudar para espanhol ou inglês" },
  dark: { es: "Oscuro", en: "Dark", br: "Escuro" },
  light: { es: "Claro", en: "Light", br: "Claro" },
  switch_to_x: { es: "Cambiar a {x}", en: "Switch to {x}", br: "Mudar para {x}" },
  sought: { es: "Buscado", en: "Sought", br: "Buscado" },
  motive: { es: "Motivo", en: "Motive", br: "Motivo" },
  my_first_login: { es: "Mi primer ingreso", en: "My first login", br: "Meu primeiro acesso" },
  filters: { es: "Filtros", en: "Filters", br: "Filtros" },
  clear_filters: { es: "Limpiar filtros", en: "Clear filters", br: "Limpar filtros" },
  order_by: { es: "Ordenar por", en: "Order by", br: "Ordenar por" },
  most_relevants: { es: "Más relevantes", en: "Most relevants", br: "Mais relevantes" },
  most_recents_first: { es: "Más recientes primero", en: "Most recents first", br: "Mais recentes primeiro" },
  oldest_first: { es: "Antiguos primero", en: "Oldest first", br: "Mais antigos primeiro" },
  hour: { es: "hora", en: "hour", br: "hora" },
  ago_a_b: { es: "Hace {a} {b}", en: "{a} {b} ago", br: "Há {a} {b}" },
  ago_a_b_and_c_d: { es: "Hace {a} {b} y {c} {d}", en: "{a} {b} and {c} {d} ago", br: "Há {a} {b} e {c} {d}" },
  no_description: { es: "Sin descripción", en: "No description", br: "Sem descrição" },
  edit_mode: { es: "Modo de edición", en: "Edit mode", br: "Modo de edição" },
  to_locale_date_string: { es: "es-CO", en: "en-US", br: "pt-BR" },
  all_rights_reserved: { 
    es: "Todos los derechos reservados", 
    en: "All rights reserved", 
    br: "Todos os direitos reservados" 
  },
  login: { es: "Iniciar sesión", en: "Login", br: "Entrar" },
  back_to_x : { es: "Volver a {x}", en: "Back to {x}", br: "Voltar para {x}" },
  go_to_x : { es: "Ir a {x}", en: "Go to {x}", br: "Ir para {x}" },
  redirected_to_my_first_login: {
    "es": 'Redirigido a "Mi primer ingreso"',
    "en": 'Redirected to "My first login"',
    "br": 'Redirecionado para "Meu primeiro acesso"'
  },
  powered_by: { "es": "Desarrollado por", "en": "Powered by", "br": "Desenvolvido por" },

  // Companies
  new_company: { es: "Nueva Empresa", en: "New Company", br: "Nova Empresa" },
  edit_company: { es: "Editar Empresa", en: "Edit Company", br: "Editar Empresa" },
  companies_management: { es: "Gestión de Empresas", en: "Company management", br: "Gestão de Empresas" },
  add_company: { es: "Agregar Empresa", en: "Add Company", br: "Adicionar Empresa" },
  registered_companies: { es: "empresas registradas", en: "registered companies", br: "empresas registradas" },
  company_saved: { es: "Empresa guardada", en: "Company saved", br: "Empresa salva" },
  company_deleted: { es: "Empresa eliminada", en: "Company deleted", br: "Empresa excluída" },
  taxId: { es: "DNI", en: "TAX ID", br: "CNPJ/CPF" },
  website: { es: "Página Web", en: "Website", br: "Site" },
  periodicity: { es: "Peridiocidad", en: "Periodicity", br: "Periodicidade" },
  lastPayment: { es: "Último pago", en: "Last Payment", br: "Último pagamento" },
  expiratedDate: { es: "Fecha de expiración", en: "Expirated Date", br: "Data de expiração" },

  // Raffles
  raffle_saved_successfully: { es: "¡Rifa guardada exitosamente!", en: "Raffle saved successfully!", br: "Rifa salva com sucesso!" },
  total_raffles: { es: "rifa(s) en total", en: "total raffles", br: "rifa(s) no total" },
  draw: { es: "Sorteo", en: "Draw", br: "Sorteio" },
  numbers: { es: "Números", en: "Numbers", br: "Números" },
  price: { es: "Precio", en: "Price", br: "Preço" },
  raffle_photo: { es: "Foto de la rifa", en: "Raffle photo", br: "Foto da rifa" },

  // Sale
  sale_failed: { 
    es: "Ocurrio un error durante la compra, intentalo de nuevo..", 
    en: "An error occurred during the purchase, please try again..",
    br: "Ocorreu um erro durante a compra, tente novamente.."
  },
  sales_progress: { es: "Progreso de ventas", en: "Sales progress" , br: "Progresso de vendas" },

  // Payments
  payments: { es: "Pagos", en: "Payments", br: "Pagamentos" },
  history_payments: { es: "Historial de pagos", en: "History payments", br: "Histórico de pagamentos" },
  new_payment: { es: "Nuevo pago", en: "New payment", br: "Novo pagamento" },
  go_to_start: { es: "Ir al principio", en: "Go to start", br: "Ir para o início" },
  go_to_end: { es: "Ir al final", en: "Go to end", br: "Ir para o fim" },
  photo_voucher: { es: "Foto comprobante", en: "Photo voucher", br: "Foto do comprovante" },
  payment_method: { es: "Método de pago", en: "Payment method", br: "Método de pagamento" },
  voucher: { es: "Comprobante", en: "Voucher", br: "Comprovante" },
  total: { es: "Total", en: "Total", br: "Total" },
  save_payment: { es: "Guardar pago", en: "Save payment", br: "Salvar pagamento" },
  select_your_voucher: { es: "Seleccione su comprobante", en: "Select your voucher", br: "Selecione seu comprovante" },
  upload_file_icon: { es: "Icono de subir archivo", en: "Upload file icon", br: "Ícone de enviar arquivo" },
  select_payment_method: { es: "Seleccione un método de pago", en: "Select a payment method", br: "Selecione um método de pagamento" }, 
  cash: { es: "Efectivo", en: "Cash", br: "Dinheiro" }, 
  transfer: { es: "Transferencia", en: "Transfer", br: "Transferência" }, 
  debit_card: { es: "Tarjeta debito", en: "Debit card", br: "Cartão de débito" }, 
  credit_card: { es: "Tarjeta de credito", en: "Credit card", br: "Cartão de crédito" }, 
  payments_ok: { es: "Estas al día, no tienes pagos pendientes", en: "Payments up to date.", br: "Você está em dia, não tem pagamentos pendentes" },

  // users
  you_are_about_to_delete_user_x_please_provide_a_motive: { 
    es: "Está a punto de eliminar el usuario #{id}, <br /> por favor indique un motivo",
    en: "You are about to delete user #{id}, <br /> please provide a motive",
    br: "Você está prestes a excluir o usuário #{id}, <br /> por favor indique um motivo"
  },
  user_saved_successfully: { es: "Usuario guardado exitosamente", en: "User saved successfully", br: "Usuário salvo com sucesso" },
  user_updated_successfully: { es: "Usuario actualizado exitosamente", en: "User updated successfully", br: "Usuário atualizado com sucesso" },
  user_deleted_successfully: { es: "Usuario eliminado exitosamente.", en: "User deleted successfully", br: "Usuário excluído com sucesso" },
  this_user: { es: "este usuario", en: "this user", br: "este usuário" },

  // images
  remove_image: { es: "Quitar imagen", en: "Remove image", br: "Remover imagem" },

  // notifications
  this_notification: { es: "esta notificación", en: "this notification", br: "esta notificação" },
  delete_notification: { es: "Eliminar notificación", en: "Delete notification", br: "Excluir notificação" },
  notification_deleted_successfully: { es: "Notificación eliminada exitosamente", en: "Notification deleted successfully", br: "Notificação excluída com sucesso" },
  half_tickets_sold: { es: "Mitad de boletos vendidos", en: "Half tickets sold", br: "Metade dos bilhetes vendidos" },
  half_of_the_raffle_tickets_have_been_sold: { 
    es: "Se alcanzó la mitad de boletos vendidos de la rifa", 
    en: "Half of the raffle tickets have been sold",
    br: "Foi alcançada a metade dos bilhetes vendidos da rifa"
  },

  // empty
  no_notifications: { es: "No hay nofiticaciónes para mostrar", en: "No notifications", br: "Não há notificações para mostrar" },

  // alerts
  understood: { es: "Entendido", en: "Understood", br: "Entendido" },
  yes_delete: { es: "Si, eliminar", en: "Yes, delete", br: "Sim, excluir" },
  the_motive_is_required: { es: "El motivo es obligatorio", en: "The motive is required", br: "O motivo é obrigatório" },
  are_you_sure_you_want_to_delete_x: {
    es: "¿Estás seguro de eliminar {x}?",
    en: "¿Are you sure you want to delete {x}?",
    br: "Você tem certeza de que deseja excluir {x}?"
  },

  // errors
  user_inactive_please_contact_admin: { 
    es: "Usuario inactivo, por favor comuniquese con el administrador de", 
    en: "User inactive, please contact admin of",
    br: "Usuário inativo, por favor entre em contato com o administrador de"
  },
  error_saving_raffle: { es: "Error al crear la rifa", en: "Error saving raffle", br: "Erro ao criar a rifa" },
  please_write_something_for_search: { 
    es: "Por favor escribe alguna palabra para realizar la busqueda.", 
    en: "please_write_something_for_search",
    br: "Por favor escreva alguma palavra para realizar a busca."
  },
  failed_to_update_status: { es: "Error al actualizar el estado", en: "Failed to update status", br: "Erro ao atualizar o status" },
  failed_to_get_users: { es: "Error al obtener los usuarios", en: "Failed to get users", br: "Erro ao obter os usuários" },
  failed_to_save_user: { es: "Error al guardar el usuario", en: "Failed to save user", br: "Erro ao salvar o usuário" },
  failed_to_update_user: { es: "Error al actualizar el usuario", en: "Failed to update user", br: "Erro ao atualizar o usuário" },
  failed_to_delete_user: { es: "El usuario no pudo ser eliminado.", en: "Failed user deleted", br: "O usuário não pôde ser excluído." },
  passwords_are_differents: { es: "Las contraseñas son diferentes", en: "passwords_are_differents", br: "As senhas são diferentes" },
  failed_to_update_notification: { es: "Error al actualizar la notificación", en: "Failed to update notification", br: "Erro ao atualizar a notificação" },
  failed_to_delete_notification: { es: "Error al eliminar la notificación", en: "Failed to delete notification", br: "Erro ao excluir a notificação" },
  invalid_date: { es: "Fecha invalida", en: "Invalid date", br: "Data inválida" },
  invalid_hour: { es: "Hora invalida", en: "Invalid hour", br: "Hora inválida" },
  user_does_not_exist: { es: "El usuario no existe", en: "User does not exist", br: "O usuário não existe" },
  passwords_are_different: { es: "Las contraseñas son diferentes", en: "Passwords are different", br: "As senhas são diferentes" },
  this_user_has_already_login_previously: { 
    es: "Este usuario ya ha iniciado sesión previamente", 
    en: "This user has already login previously", 
    br: "Este usuário já fez login anteriormente" 
  },
  invalid_credentials: { es: "Credenciales inválidas", en: "Invalid credentials", br: "Credenciais inválidas" },
  user_alreadey_exist: { es: "El usuario ya existe", en: "User already exists", br: "O usuário já existe" },
  please_select_a_company: { es: "Por favor seleccione una empresa", en: "Please select a company", br: "Por favor, selecione uma empresa" },
  sorry_page_not_found: { "es": "Lo sentimos, página no encontrada", "en": "Sorry, page not found", "br": "Desculpe, página não encontrada" },
  page_not_found_sb: {
    es: "Quizás el enlace cambió o nunca estuvo aquí",
    en: "Perhaps the link changed or was never here",
    br: "Talvez o link mudou ou nunca esteve aqui"
  },
  page_not_found_msg: {
    es: "Vuelve al inicio y sigue participando con nosotros",
    en: "Go back to the home page and keep participating with us",
    br: "Volte ao início e continue participando com a gente"
  },
};

export function tr(key: string, lang: Language, params?: Record<string, any>): string {
  let text = t[key]?.[lang] ?? key;

  if (params) {
    Object.entries(params).forEach(([k, v]) => {
      text = text.replace(new RegExp(`\\{${k}\\}`, "g"), String(v));
    });
  }

  return text;
}
