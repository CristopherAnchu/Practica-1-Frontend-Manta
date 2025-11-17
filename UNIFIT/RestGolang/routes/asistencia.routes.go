package routes

import (
	"encoding/json"
	"errors"
	"net/http"

	"github.com/CrisF35/RestGolang/db"
	"github.com/CrisF35/RestGolang/middleware" // 🔥 Importar el middleware
	"github.com/CrisF35/RestGolang/models"
	"github.com/gorilla/mux"
	"gorm.io/gorm"
)

// =============================
//
//  GET ALL /asistencias (Filtrado por Rol)
//
// =============================
func GetAsistenciasHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	// 1. OBTENER USUARIO AUTENTICADO
	authUser, err := middleware.GetAuthUser(r)
	if err != nil {
		w.WriteHeader(http.StatusUnauthorized)
		json.NewEncoder(w).Encode(map[string]string{"error": "Authentication required."})
		return
	}

	var asistencias []models.Asistencia
	query := db.DB // Inicializar el constructor de consultas

	// 2. LÓGICA DE AUTORIZACIÓN: Filtrar por Rol
	if authUser.Rol == "CLIENTE" {
		// Un cliente solo puede ver sus propias asistencias
		query = query.Where("usuario_id = ?", authUser.ID)
	}
	// Los Administradores (o cualquier otro rol) ven todas las asistencias.

	// 3. Ejecutar consulta SELECT * FROM asistencias (con o sin filtro)
	result := query.Find(&asistencias)

	if result.Error != nil {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(map[string]string{"error": "Database error fetching all asistencias"})
		return
	}
	json.NewEncoder(w).Encode(asistencias)
}

// =============================
//
//  GET BY ID /asistencias/{id} (Control de propiedad)
//
// =============================
func GetAsistenciaByIDHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	// 1. OBTENER USUARIO AUTENTICADO
	authUser, err := middleware.GetAuthUser(r)
	if err != nil {
		w.WriteHeader(http.StatusUnauthorized)
		json.NewEncoder(w).Encode(map[string]string{"error": "Authentication required."})
		return
	}

	params := mux.Vars(r)
	id := params["id"]

	var asistencia models.Asistencia
	result := db.DB.First(&asistencia, "id = ?", id)

	if result.Error != nil {
		if errors.Is(result.Error, gorm.ErrRecordNotFound) {
			w.WriteHeader(http.StatusNotFound)
			json.NewEncoder(w).Encode(map[string]string{"error": "Asistencia not found"})
			return
		}
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(map[string]string{"error": "Database error fetching asistencia by ID"})
		return
	}

	// 2. LÓGICA DE AUTORIZACIÓN: El cliente solo puede ver su propio registro de asistencia
	if authUser.Rol == "CLIENTE" && asistencia.UsuarioID != authUser.ID {
		w.WriteHeader(http.StatusForbidden) // 403 Forbidden
		json.NewEncoder(w).Encode(map[string]string{"error": "Forbidden: You can only view your own attendance records."})
		return
	}

	json.NewEncoder(w).Encode(asistencia)
}

// =============================
//
//  POST /asistencias (Solo Administrador)
//
// =============================
func PostAsistenciaHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	// 1. OBTENER USUARIO AUTENTICADO
	authUser, err := middleware.GetAuthUser(r)
	if err != nil {
		w.WriteHeader(http.StatusUnauthorized)
		json.NewEncoder(w).Encode(map[string]string{"error": "Authentication required."})
		return
	}

	// 2. RESTRICCIÓN DE ROL: Solo Administradores pueden crear registros de asistencia
	if authUser.Rol != "ADMINISTRADOR" {
		w.WriteHeader(http.StatusForbidden)
		json.NewEncoder(w).Encode(map[string]string{"error": "Forbidden: Only Administrators can create attendance records."})
		return
	}

	var newAsistencia models.Asistencia

	if err := json.NewDecoder(r.Body).Decode(&newAsistencia); err != nil {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]string{"error": "Invalid request payload: " + err.Error()})
		return
	}

	// El admin debe proporcionar el UsuarioID, no se sobreescribe con el ID del admin.

	result := db.DB.Create(&newAsistencia)

	if result.Error != nil {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(map[string]string{"error": "Database error creating asistencia: " + result.Error.Error()})
		return
	}
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(newAsistencia)
}

// =============================
//
//  UPDATE /asistencias/{id} (Solo Administrador)
//
// =============================
func UpdateAsistenciaByIDHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	// 1. OBTENER USUARIO AUTENTICADO
	authUser, err := middleware.GetAuthUser(r)
	if err != nil {
		w.WriteHeader(http.StatusUnauthorized)
		json.NewEncoder(w).Encode(map[string]string{"error": "Authentication required."})
		return
	}

	// 2. RESTRICCIÓN DE ROL: Solo Administradores pueden actualizar
	if authUser.Rol != "ADMINISTRADOR" {
		w.WriteHeader(http.StatusForbidden)
		json.NewEncoder(w).Encode(map[string]string{"error": "Forbidden: Only Administrators can update attendance records."})
		return
	}

	params := mux.Vars(r)
	id := params["id"]

	var existingAsistencia models.Asistencia
	var updates map[string]interface{}

	if err := db.DB.First(&existingAsistencia, "id = ?", id).Error; err != nil {
		w.WriteHeader(http.StatusNotFound)
		json.NewEncoder(w).Encode(map[string]string{"error": "Asistencia not found"})
		return
	}

	if err := json.NewDecoder(r.Body).Decode(&updates); err != nil {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]string{"error": "Invalid request payload"})
		return
	}

	db.DB.Model(&existingAsistencia).Updates(updates)
	json.NewEncoder(w).Encode(existingAsistencia)
}

// =============================
//
//  DELETE /asistencias/{id} (Solo Administrador)
//
// =============================
func DeleteAsistenciaByIDHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	// 1. OBTENER USUARIO AUTENTICADO
	authUser, err := middleware.GetAuthUser(r)
	if err != nil {
		w.WriteHeader(http.StatusUnauthorized)
		json.NewEncoder(w).Encode(map[string]string{"error": "Authentication required."})
		return
	}

	// 2. RESTRICCIÓN DE ROL: Solo Administradores pueden eliminar
	if authUser.Rol != "ADMINISTRADOR" {
		w.WriteHeader(http.StatusForbidden)
		json.NewEncoder(w).Encode(map[string]string{"error": "Forbidden: Only Administrators can delete attendance records."})
		return
	}

	params := mux.Vars(r)
	id := params["id"]

	var asistencia models.Asistencia

	if err := db.DB.First(&asistencia, "id = ?", id).Error; err != nil {
		w.WriteHeader(http.StatusNotFound)
		json.NewEncoder(w).Encode(map[string]string{"error": "Asistencia not found"})
		return
	}

	db.DB.Delete(&asistencia)

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]string{"message": "Asistencia deleted successfully"})
}
