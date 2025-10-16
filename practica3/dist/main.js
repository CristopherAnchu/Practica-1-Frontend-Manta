"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const data_source_1 = require("./data-source");
const UsuarioService_1 = require("./services/UsuarioService");
const RutinaService_1 = require("./services/RutinaService");
const ReservaService_1 = require("./services/ReservaService");
const RolService_1 = require("./services/RolService");
async function main() {
    await data_source_1.AppDataSource.initialize();
    const rolService = new RolService_1.RolService();
    const usuarioService = new UsuarioService_1.UsuarioService();
    const rutinaservice = new RutinaService_1.RutinaService();
    const reservaService = new ReservaService_1.ReservaService();
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
