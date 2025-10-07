import { ReservasRepository } from "./reservas-repository"

async function main() {
  console.log("🏋️ Sistema de Reservas - Gimnasio Universitario 🏋️\n")

  const repo = new ReservasRepository()

  try {
    // 1. Listar reservas existentes
    console.log("📋 Reservas existentes:")
    const todas = await repo.listarTodas()
    todas.forEach((r) => {
      console.log(`  - ${r.nombreEstudiante}: ${r.fecha} de ${r.horaInicio} a ${r.horaFin} [${r.estado}]`)
    })

    // 2. Crear una nueva reserva
    console.log("\n✅ Creando nueva reserva...")
    const nueva = await repo.crear({
      estudianteId: "EST003",
      nombreEstudiante: "Carlos Rodríguez",
      fecha: "2025-02-10",
      horaInicio: "14:00",
      horaFin: "15:30",
    })
    console.log(`  Reserva creada: ID ${nueva.id}`)

    // 3. Listar reservas por fecha
    console.log("\n📅 Reservas para el 2025-02-10:")
    const porFecha = await repo.listarPorFecha("2025-02-10")
    porFecha.forEach((r) => {
      console.log(`  - ${r.horaInicio}-${r.horaFin}: ${r.nombreEstudiante}`)
    })

    // 4. Listar reservas de un estudiante
    console.log("\n👤 Reservas de Juan Pérez (EST001):")
    const porEstudiante = await repo.listarPorEstudiante("EST001")
    porEstudiante.forEach((r) => {
      console.log(`  - ${r.fecha}: ${r.horaInicio}-${r.horaFin}`)
    })

    // 5. Cancelar una reserva
    console.log("\n❌ Cancelando reserva ID 2...")
    await repo.cancelar("2")
    console.log("  Reserva cancelada")

    // 6. Intentar crear reserva con conflicto
    console.log("\n⚠️ Intentando crear reserva en horario ocupado...")
    try {
      await repo.crear({
        estudianteId: "EST004",
        nombreEstudiante: "Ana López",
        fecha: "2025-02-10",
        horaInicio: "08:30",
        horaFin: "09:30",
      })
    } catch (error) {
      console.log(`  Error esperado: ${(error as Error).message}`)
    }

    // 7. Estado final
    console.log("\n📊 Estado final de reservas activas:")
    const activas = (await repo.listarTodas()).filter((r) => r.estado === "activa")
    console.log(`  Total: ${activas.length} reservas activas`)
  } catch (error) {
    console.error("Error:", (error as Error).message)
  }
}

main()
