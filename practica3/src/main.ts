import { AppDataSource } from "./data-source";
import { UsuarioService } from "./services/UsuarioService";
import { RutinaService } from "./services/RutinaService";
import { ReservaService } from "./services/ReservaService";
import { RolService } from "./services/RolService";

async function main() {
  await AppDataSource.initialize();

  const rolService = new RolService();
  const usuarioService = new UsuarioService();
  const rutinaservice = new RutinaService();
  const reservaService = new ReservaService();

  // Seed roles
  const rolEstudiante = await rolService.create({ nombre: "Estudiante", descripcion: "Miembro estudiante" });
  const rolProfesor = await rolService.create({ nombre: "Docente", descripcion: "Miembro docente" });

  // Seed usuarios
  const usuario1 = await usuarioService.create({ nombre: "Ana", correo: "ana@uni.edu", tipo: "estudiante", rol: rolEstudiante });
  const usuario2 = await usuarioService.create({ nombre: "Luis", correo: "luis@uni.edu", tipo: "docente", rol: rolProfesor });

  // Seed actividades
  const Rutina1 = await rutinaservice.create({ nombre: "Yoga", descripcion: "Clase de Yoga", cupoMaximo: 20 });
  
  // Seed reservas
  const reserva1 = await reservaService.create({ fecha: new Date(), estado: "activa", usuario: usuario1, rutina: Rutina1 });

  // Pruebas de CRUD
  console.log(await usuarioService.findAll());
  console.log(await usuarioService.findOne(usuario1.id));
  await usuarioService.update(usuario2.id, { nombre: "Luis Actualizado" });
  await usuarioService.remove(usuario1.id);
}
main();