import type { CrearReservaDto, ActualizarReservaDto, ReservaResponseDto } from "../dtos"
import { ReservaMapper } from "../mappers"
import type {
  CrearReservaUseCase,
  ListarReservasActivasUseCase,
  ListarReservasPorEstudianteUseCase,
  ListarReservasPorFechaUseCase,
  ObtenerReservaPorIdUseCase,
  ActualizarReservaUseCase,
  CancelarReservaUseCase,
  VerificarDisponibilidadUseCase,
} from "../use-cases"

export class ReservaService {
  constructor(
    private readonly crearReservaUseCase: CrearReservaUseCase,
    private readonly listarReservasActivasUseCase: ListarReservasActivasUseCase,
    private readonly listarReservasPorEstudianteUseCase: ListarReservasPorEstudianteUseCase,
    private readonly listarReservasPorFechaUseCase: ListarReservasPorFechaUseCase,
    private readonly obtenerReservaPorIdUseCase: ObtenerReservaPorIdUseCase,
    private readonly actualizarReservaUseCase: ActualizarReservaUseCase,
    private readonly cancelarReservaUseCase: CancelarReservaUseCase,
    private readonly verificarDisponibilidadUseCase: VerificarDisponibilidadUseCase,
  ) {}

  async crearReserva(dto: CrearReservaDto): Promise<ReservaResponseDto> {
    const reserva = await this.crearReservaUseCase.ejecutar(dto)
    return ReservaMapper.toResponseDto(reserva)
  }

  async listarReservasActivas(): Promise<ReservaResponseDto[]> {
    const reservas = await this.listarReservasActivasUseCase.ejecutar()
    return reservas.map((reserva: any) => ReservaMapper.toResponseDto(reserva))
  }

  async listarReservasPorEstudiante(estudianteId: string): Promise<ReservaResponseDto[]> {
    const reservas = await this.listarReservasPorEstudianteUseCase.ejecutar(estudianteId)
    return reservas.map((reserva: any) => ReservaMapper.toResponseDto(reserva))
  }

  async listarReservasPorFecha(fecha: Date): Promise<ReservaResponseDto[]> {
    const reservas = await this.listarReservasPorFechaUseCase.ejecutar(fecha)
    return reservas.map((reserva: any) => ReservaMapper.toResponseDto(reserva))
  }

  async obtenerReservaPorId(id: string): Promise<ReservaResponseDto> {
    const reserva = await this.obtenerReservaPorIdUseCase.ejecutar(id)
    return ReservaMapper.toResponseDto(reserva)
  }

  async actualizarReserva(id: string, dto: ActualizarReservaDto): Promise<ReservaResponseDto> {
    const reserva = await this.actualizarReservaUseCase.ejecutar(id, dto)
    return ReservaMapper.toResponseDto(reserva)
  }

  async cancelarReserva(id: string): Promise<ReservaResponseDto> {
    const reserva = await this.cancelarReservaUseCase.ejecutar(id)
    return ReservaMapper.toResponseDto(reserva)
  }

  async verificarDisponibilidad(fecha: Date, horaInicio: string, horaFin: string): Promise<boolean> {
    return await this.verificarDisponibilidadUseCase.ejecutar(fecha, horaInicio, horaFin)
  }
}
