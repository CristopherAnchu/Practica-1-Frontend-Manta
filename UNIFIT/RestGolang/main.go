package main

import (
	"log"
	"net/http"

	"github.com/CrisF35/RestGolang/db"
	"github.com/CrisF35/RestGolang/middleware" // ✅ Asegúrate de tener este import
	"github.com/CrisF35/RestGolang/models"
	"github.com/CrisF35/RestGolang/routes"

	"github.com/gorilla/mux"
	"github.com/rs/cors"
)

func main() {

	database := db.ConnectToDatabase()

	// ----------------------------------------------------
	// 1. MIGRACIÓN COMPLETA DE TODOS LOS MODELOS
	// ----------------------------------------------------
	err := database.AutoMigrate(
		&models.User{},
		&models.Reserva{},
		&models.RutinaUsuario{},
		&models.Equipo{},
		&models.Incidencia{},
		&models.Asistencia{},
	)
	if err != nil {
		log.Fatalf("Error al migrar la base de datos: %v", err)
	}
	log.Println("Migración de base de datos completa.")
	// ----------------------------------------------------

	// 2. Registrar TODOS los Endpoints
	r := mux.NewRouter()

	// Endpoints de Autenticación y Usuarios
	// ----------------------------------------------------

	// 🔥 RUTA DE LOGIN (SIN PROTECCIÓN) 🔥
	r.HandleFunc("/login", routes.LoginHandler).Methods("POST")

	// Check email availability (SIN PROTECCIÓN - needed for registration)
	r.HandleFunc("/users/check-email", routes.CheckEmailAvailabilityHandler).Methods("GET")

	// POST (Registro/Creación: SIN protección)12
	r.HandleFunc("/users", routes.PostUserHandler).Methods("POST")

	// GET ALL (Protegido: Requiere Auth + Rol ADMINISTRADOR)
	r.HandleFunc("/users", middleware.AuthMiddleware(middleware.CheckAdminRole(routes.GetUsersHandler))).Methods("GET")

	// GET BY ID (Protegido: Solo Auth. Lógica de Admin/Owner DENTRO del handler)
	r.HandleFunc("/users/{id}", middleware.AuthMiddleware(routes.GetUserbyID)).Methods("GET")

	// DELETE (Protegido: Requiere Auth + Rol ADMINISTRADOR)
	r.HandleFunc("/users/{id}", middleware.AuthMiddleware(middleware.CheckAdminRole(routes.DeleteUserbyID))).Methods("DELETE")

	// UPDATE (Protegido: Solo Auth. Lógica de Admin/Owner DENTRO del handler)
	r.HandleFunc("/users/{id}", middleware.AuthMiddleware(routes.UpdateUserByID)).Methods("PUT")

	// Endpoints de Reservas (Requieren Autenticación)
	// ----------------------------------------------------
	r.HandleFunc("/reservas", middleware.AuthMiddleware(routes.GetReservasHandler)).Methods("GET")
	r.HandleFunc("/reservas/{id}", middleware.AuthMiddleware(routes.GetReservaByIDHandler)).Methods("GET")
	r.HandleFunc("/reservas", middleware.AuthMiddleware(routes.PostReservaHandler)).Methods("POST")
	r.HandleFunc("/reservas/{id}", middleware.AuthMiddleware(routes.UpdateReservaByIDHandler)).Methods("PUT")
	r.HandleFunc("/reservas/{id}", middleware.AuthMiddleware(routes.DeleteReservaByIDHandler)).Methods("DELETE")

	// Endpoints de Rutinas (Requieren Autenticación)
	// ----------------------------------------------------
	r.HandleFunc("/rutinas", middleware.AuthMiddleware(routes.GetRutinasHandler)).Methods("GET")
	r.HandleFunc("/rutinas/{id}", middleware.AuthMiddleware(routes.GetRutinaByIDHandler)).Methods("GET")
	r.HandleFunc("/rutinas", middleware.AuthMiddleware(routes.PostRutinaHandler)).Methods("POST")
	r.HandleFunc("/rutinas/{id}", middleware.AuthMiddleware(routes.DeleteRutinaByIDHandler)).Methods("DELETE")
	r.HandleFunc("/rutinas/{id}", middleware.AuthMiddleware(routes.UpdateRutinaByIDHandler)).Methods("PUT")

	// Endpoints de Equipos (Requieren Autenticación)
	// ----------------------------------------------------
	r.HandleFunc("/equipos", middleware.AuthMiddleware(routes.GetEquiposHandler)).Methods("GET")
	r.HandleFunc("/equipos/{id}", middleware.AuthMiddleware(routes.GetEquipoByIDHandler)).Methods("GET")
	r.HandleFunc("/equipos", middleware.AuthMiddleware(routes.PostEquipoHandler)).Methods("POST")
	r.HandleFunc("/equipos/{id}", middleware.AuthMiddleware(routes.DeleteEquipoByIDHandler)).Methods("DELETE")
	r.HandleFunc("/equipos/{id}", middleware.AuthMiddleware(routes.UpdateEquipoByIDHandler)).Methods("PUT")

	// Endpoints de Incidencias (Requieren Autenticación)
	// ----------------------------------------------------
	r.HandleFunc("/incidencias", middleware.AuthMiddleware(routes.GetIncidenciasHandler)).Methods("GET")
	r.HandleFunc("/incidencias/{id}", middleware.AuthMiddleware(routes.GetIncidenciaByIDHandler)).Methods("GET")
	r.HandleFunc("/incidencias", middleware.AuthMiddleware(routes.PostIncidenciaHandler)).Methods("POST")
	r.HandleFunc("/incidencias/{id}", middleware.AuthMiddleware(routes.DeleteIncidenciaByIDHandler)).Methods("DELETE")
	r.HandleFunc("/incidencias/{id}", middleware.AuthMiddleware(routes.UpdateIncidenciaByIDHandler)).Methods("PUT")

	// Endpoints de Asistencias (Requieren Autenticación)
	// ----------------------------------------------------
	r.HandleFunc("/asistencias", middleware.AuthMiddleware(routes.GetAsistenciasHandler)).Methods("GET")
	r.HandleFunc("/asistencias/{id}", middleware.AuthMiddleware(routes.GetAsistenciaByIDHandler)).Methods("GET")
	r.HandleFunc("/asistencias", middleware.AuthMiddleware(routes.PostAsistenciaHandler)).Methods("POST")
	r.HandleFunc("/asistencias/{id}", middleware.AuthMiddleware(routes.DeleteAsistenciaByIDHandler)).Methods("DELETE")
	r.HandleFunc("/asistencias/{id}", middleware.AuthMiddleware(routes.UpdateAsistenciaByIDHandler)).Methods("PUT")

	// ----------------------------------------------------
	// 3. CONFIGURACIÓN DE CORS Y SERVIDOR
	// ----------------------------------------------------
	c := cors.New(cors.Options{
		AllowedOrigins:   []string{"*"}, // Permite cualquier origen (Angular)
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"},
		AllowedHeaders:   []string{"Authorization", "Content-Type"}, // Autoriza headers de JWT
		AllowCredentials: true,
	})

	handler := c.Handler(r)

	log.Println("Servidor iniciado en el puerto :3000")
	// Usamos el handler de CORS para envolver el router
	http.ListenAndServe(":3000", handler)
}
