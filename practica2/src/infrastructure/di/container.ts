import { ReservaRepositoryInMemory } from "../repositories"
import {
  CrearReservaUseCase,
  ListarReservasActivasUseCase,
  ListarReservasPorEstudianteUseCase,
  ListarReservasPorFechaUseCase,
  ObtenerReservaPorIdUseCase,
  ActualizarReservaUseCase,
  CancelarReservaUseCase,
  VerificarDisponibilidadUseCase,
} from "../../application/use-cases"
import { ReservaService } from "../../application/services"
import { ReservaController } from "../../presentation/controllers"

export class Container {
  private static instance: Container
  private _reservaController: ReservaController | null = null

  private constructor() {}

  static getInstance(): Container {
    if (!Container.instance) {
      Container.instance = new Container()
    }
    return Container.instance
  }

  get reservaController(): ReservaController {
    if (!this._reservaController) {
      // Infrastructure layer
      const reservaRepository = new ReservaRepositoryInMemory()

      // Application layer - Use Cases
      const crearReservaUseCase = new CrearReservaUseCase(reservaRepository)
      const listarReservasActivasUseCase = new ListarReservasActivasUseCase(reservaRepository)
      const listarReservasPorEstudianteUseCase = new ListarReservasPorEstudianteUseCase(reservaRepository)
      const listarReservasPorFechaUseCase = new ListarReservasPorFechaUseCase(reservaRepository)
      const obtenerReservaPorIdUseCase = new ObtenerReservaPorIdUseCase(reservaRepository)
      const actualizarReservaUseCase = new ActualizarReservaUseCase(reservaRepository)
      const cancelarReservaUseCase = new CancelarReservaUseCase(reservaRepository)
      const verificarDisponibilidadUseCase = new VerificarDisponibilidadUseCase(reservaRepository)

      // Application layer - Service
      const reservaService = new ReservaService(
        crearReservaUseCase,
        listarReservasActivasUseCase,
        listarReservasPorEstudianteUseCase,
        listarReservasPorFechaUseCase,
        obtenerReservaPorIdUseCase,
        actualizarReservaUseCase,
        cancelarReservaUseCase,
        verificarDisponibilidadUseCase,
      )

      // Presentation layer
      this._reservaController = new ReservaController(reservaService)
    }

    return this._reservaController
  }
}
