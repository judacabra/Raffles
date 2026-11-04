
import { Language } from "@/store/slices/uiSlice";

// EJMP: obj: { es: "", en: "", br: "" },

export const t: Record<string, Record<string, string>> = {
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
  language_switch: { es: "Cambiar a ingles", en: "Switch to spanish", br: "Mudar para espanhol" },
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
  redirected_to_my_first_login: {
    "es": 'Redirigido a "Mi primer ingreso"',
    "en": 'Redirected to "My first login"',
    "br": 'Redirecionado para "Meu primeiro acesso"'
  },

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
  please_select_a_company: { es: "Por favor seleccione una empresa", en: "Please select a company", br: "Por favor, selecione uma empresa" }
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
