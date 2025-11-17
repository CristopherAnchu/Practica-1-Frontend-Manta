import { gql } from 'apollo-angular';

// ==================== QUERIES ====================

// Usuarios
export const GET_USUARIOS = gql`
  query GetUsuarios($filter: UsuarioFilterInput) {
    usuarios(filter: $filter) {
      id
      nombre
      correo
      tipo
      telefono
      cedula
      fechaRegistro
      activo
      rol {
        id
        nombre
        descripcion
      }
    }
  }
`;

export const GET_USUARIO = gql`
  query GetUsuario($id: Int!) {
    usuario(id: $id) {
      id
      nombre
      correo
      tipo
      telefono
      cedula
      fechaRegistro
      activo
      rol {
        id
        nombre
        descripcion
        permisos
      }
      reservas {
        id
        fecha
        estado
        calificacion
        rutina {
          nombre
          instructor
        }
      }
    }
  }
`;

export const GET_RESUMEN_USUARIO = gql`
  query GetResumenUsuario($usuarioId: Int!) {
    resumenUsuario(usuarioId: $usuarioId) {
      usuarioId
      nombre
      correo
      totalReservas
      reservasProximas
      reservasCompletadas
      calificacionPromedio
      ultimaReserva
    }
  }
`;

export const GET_USUARIOS_ACTIVOS = gql`
  query GetUsuariosActivos($limite: Int) {
    usuariosActivos(limite: $limite) {
      usuarioId
      nombreUsuario
      correo
      tipo
      totalReservas
      reservasCompletadas
      porcentajeAsistencia
    }
  }
`;

// Rutinas
export const GET_RUTINAS = gql`
  query GetRutinas($filter: RutinaFilterInput) {
    rutinas(filter: $filter) {
      id
      nombre
      descripcion
      cupoMaximo
      duracionMinutos
      instructor
      nivel
      calificacionPromedio
      activa
    }
  }
`;

export const GET_RUTINA = gql`
  query GetRutina($id: Int!) {
    rutina(id: $id) {
      id
      nombre
      descripcion
      cupoMaximo
      duracionMinutos
      instructor
      nivel
      calificacionPromedio
      activa
      reservas {
        id
        fecha
        estado
        usuario {
          nombre
        }
      }
    }
  }
`;

export const GET_RUTINAS_POPULARES = gql`
  query GetRutinasPopulares($limite: Int) {
    rutinasPopulares(limite: $limite) {
      rutinaId
      nombreRutina
      totalReservas
      cupoMaximo
      ocupacionPromedio
      calificacionPromedio
    }
  }
`;

// Reservas
export const GET_RESERVAS = gql`
  query GetReservas($filter: ReservaFilterInput) {
    reservas(filter: $filter) {
      id
      fecha
      fechaCreacion
      estado
      observaciones
      calificacion
      asistio
      usuario {
        id
        nombre
        correo
      }
      rutina {
        id
        nombre
        instructor
        nivel
      }
    }
  }
`;

export const GET_RESERVA = gql`
  query GetReserva($id: Int!) {
    reserva(id: $id) {
      id
      fecha
      fechaCreacion
      estado
      observaciones
      calificacion
      asistio
      usuario {
        id
        nombre
        correo
        telefono
      }
      rutina {
        id
        nombre
        descripcion
        instructor
        nivel
        cupoMaximo
      }
    }
  }
`;

// Reportes
export const GET_ESTADISTICAS_RESERVAS = gql`
  query GetEstadisticasReservas($fechaInicio: String, $fechaFin: String) {
    estadisticasReservas(fechaInicio: $fechaInicio, fechaFin: $fechaFin) {
      totalReservas
      reservasActivas
      reservasCanceladas
      reservasFinalizadas
      porcentajeAsistencia
      calificacionPromedio
    }
  }
`;

export const GET_TENDENCIAS_RESERVAS = gql`
  query GetTendenciasReservas($fechaInicio: String!, $fechaFin: String!) {
    tendenciasReservas(fechaInicio: $fechaInicio, fechaFin: $fechaFin) {
      fecha
      totalReservas
      reservasCreadas
      reservasCanceladas
      reservasCompletadas
    }
  }
`;

export const GET_REPORTE_OCUPACION = gql`
  query GetReporteOcupacion($fecha: String) {
    reporteOcupacion(fecha: $fecha) {
      rutinaId
      nombreRutina
      fecha
      reservasActivas
      cupoMaximo
      porcentajeOcupacion
      cuposDisponibles
    }
  }
`;

export const GET_DASHBOARD_COMPLETO = gql`
  query GetDashboardCompleto {
    estadisticas: estadisticasReservas {
      totalReservas
      reservasActivas
      porcentajeAsistencia
      calificacionPromedio
    }
    
    topRutinas: rutinasPopulares(limite: 5) {
      nombreRutina
      totalReservas
      calificacionPromedio
      ocupacionPromedio
    }
    
    topUsuarios: usuariosActivos(limite: 5) {
      nombreUsuario
      totalReservas
      porcentajeAsistencia
    }
    
    ocupacion: reporteOcupacion {
      nombreRutina
      porcentajeOcupacion
      cuposDisponibles
    }
  }
`;

// Roles
export const GET_ROLES = gql`
  query GetRoles {
    roles {
      id
      nombre
      descripcion
      permisos
    }
  }
`;

export const GET_ROL = gql`
  query GetRol($id: Int!) {
    rol(id: $id) {
      id
      nombre
      descripcion
      permisos
      usuarios {
        id
        nombre
        correo
      }
    }
  }
`;

// ==================== MUTATIONS ====================

// Usuario Mutations
export const CREAR_USUARIO = gql`
  mutation CrearUsuario($input: CreateUsuarioInput!) {
    crearUsuario(input: $input) {
      id
      nombre
      correo
      tipo
      rol {
        nombre
      }
    }
  }
`;

export const ACTUALIZAR_USUARIO = gql`
  mutation ActualizarUsuario($id: Int!, $input: UpdateUsuarioInput!) {
    actualizarUsuario(id: $id, input: $input) {
      id
      nombre
      correo
      tipo
      telefono
      activo
    }
  }
`;

export const ELIMINAR_USUARIO = gql`
  mutation EliminarUsuario($id: Int!) {
    eliminarUsuario(id: $id)
  }
`;

// Rutina Mutations
export const CREAR_RUTINA = gql`
  mutation CrearRutina($input: CreateRutinaInput!) {
    crearRutina(input: $input) {
      id
      nombre
      descripcion
      instructor
      cupoMaximo
    }
  }
`;

export const ACTUALIZAR_RUTINA = gql`
  mutation ActualizarRutina($id: Int!, $input: UpdateRutinaInput!) {
    actualizarRutina(id: $id, input: $input) {
      id
      nombre
      descripcion
      instructor
      cupoMaximo
      activa
    }
  }
`;

export const ELIMINAR_RUTINA = gql`
  mutation EliminarRutina($id: Int!) {
    eliminarRutina(id: $id)
  }
`;

// Reserva Mutations
export const CREAR_RESERVA = gql`
  mutation CrearReserva($input: CreateReservaInput!) {
    crearReserva(input: $input) {
      id
      fecha
      estado
      usuario {
        nombre
      }
      rutina {
        nombre
      }
    }
  }
`;

export const ACTUALIZAR_RESERVA = gql`
  mutation ActualizarReserva($id: Int!, $input: UpdateReservaInput!) {
    actualizarReserva(id: $id, input: $input) {
      id
      fecha
      estado
      calificacion
      asistio
      observaciones
    }
  }
`;

export const ELIMINAR_RESERVA = gql`
  mutation EliminarReserva($id: Int!) {
    eliminarReserva(id: $id)
  }
`;

// Rol Mutations
export const CREAR_ROL = gql`
  mutation CrearRol($input: CreateRolInput!) {
    crearRol(input: $input) {
      id
      nombre
      descripcion
      permisos
    }
  }
`;

export const ACTUALIZAR_ROL = gql`
  mutation ActualizarRol($id: Int!, $input: UpdateRolInput!) {
    actualizarRol(id: $id, input: $input) {
      id
      nombre
      descripcion
      permisos
    }
  }
`;

export const ELIMINAR_ROL = gql`
  mutation EliminarRol($id: Int!) {
    eliminarRol(id: $id)
  }
`;
