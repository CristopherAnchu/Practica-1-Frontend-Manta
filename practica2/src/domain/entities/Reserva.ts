export class Reserva {
  constructor(
    public readonly id: string,
    public estudianteId: string,
    public nombreEstudiante: string,
    public emailEstudiante: string,
    public fecha: Date,
    public horaInicio: string,
    public horaFin: string,
    public estado: "activa" | "cancelada" | "completada",
    public capacidadUtilizada = 1,
    public notas?: string,
    public readonly creadoEn: Date = new Date(),
    public actualizadoEn: Date = new Date(),
  ) {
    this.validar()
  }

  private validar(): void {
    if (!this.estudianteId || this.estudianteId.trim() === "") {
      throw new Error("El ID del estudiante es requerido")
    }

    if (!this.nombreEstudiante || this.nombreEstudiante.trim() === "") {
      throw new Error("El nombre del estudiante es requerido")
    }

    if (!this.emailEstudiante || !this.validarEmail(this.emailEstudiante)) {
      throw new Error("El email del estudiante es inválido")
    }

    if (!this.fecha) {
      throw new Error("La fecha es requerida")
    }

    if (this.fecha < new Date(new Date().setHours(0, 0, 0, 0))) {
      throw new Error("No se pueden hacer reservas en fechas pasadas")
    }

    if (!this.horaInicio || !this.validarFormatoHora(this.horaInicio)) {
      throw new Error("La hora de inicio es inválida (formato: HH:MM)")
    }

    if (!this.horaFin || !this.validarFormatoHora(this.horaFin)) {
      throw new Error("La hora de fin es inválida (formato: HH:MM)")
    }

    if (this.horaInicio >= this.horaFin) {
      throw new Error("La hora de inicio debe ser anterior a la hora de fin")
    }

    const duracion = this.calcularDuracionEnMinutos()
    if (duracion < 30) {
      throw new Error("La reserva debe ser de al menos 30 minutos")
    }

    if (duracion > 180) {
      throw new Error("La reserva no puede exceder 3 horas")
    }

    if (this.capacidadUtilizada < 1) {
      throw new Error("La capacidad utilizada debe ser al menos 1")
    }
  }

  private validarEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  private validarFormatoHora(hora: string): boolean {
    const horaRegex = /^([0-1][0-9]|2[0-3]):[0-5][0-9]$/
    return horaRegex.test(hora)
  }

  private calcularDuracionEnMinutos(): number {
    const [horaInicioH, horaInicioM] = this.horaInicio.split(":").map(Number)
    const [horaFinH, horaFinM] = this.horaFin.split(":").map(Number)

    const minutosInicio = horaInicioH * 60 + horaInicioM
    const minutosFin = horaFinH * 60 + horaFinM

    return minutosFin - minutosInicio
  }

  public actualizarEstado(nuevoEstado: "activa" | "cancelada" | "completada"): void {
    this.estado = nuevoEstado
    this.actualizadoEn = new Date()
  }

  public actualizarHorario(horaInicio: string, horaFin: string): void {
    this.horaInicio = horaInicio
    this.horaFin = horaFin
    this.validar()
    this.actualizadoEn = new Date()
  }

  public actualizarNotas(notas: string): void {
    this.notas = notas
    this.actualizadoEn = new Date()
  }

  public cancelar(): void {
    if (this.estado === "cancelada") {
      throw new Error("La reserva ya está cancelada")
    }
    if (this.estado === "completada") {
      throw new Error("No se puede cancelar una reserva completada")
    }
    this.actualizarEstado("cancelada")
  }

  public completar(): void {
    if (this.estado === "completada") {
      throw new Error("La reserva ya está completada")
    }
    if (this.estado === "cancelada") {
      throw new Error("No se puede completar una reserva cancelada")
    }
    this.actualizarEstado("completada")
  }

  public getDuracionEnMinutos(): number {
    return this.calcularDuracionEnMinutos()
  }

  public estaActiva(): boolean {
    return this.estado === "activa"
  }
}
