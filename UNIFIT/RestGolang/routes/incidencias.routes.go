package routes

import (
	"encoding/json"
	"errors"
	"net/http"
	"time"

	"github.com/CrisF35/RestGolang/db"
	"github.com/CrisF35/RestGolang/middleware" // 🔥 Importar el middleware
	"github.com/CrisF35/RestGolang/models"
	"github.com/gorilla/mux"
	"gorm.io/gorm"
)

// =============================
//
//  GET ALL /incidencias (Filtrado por Rol)
//
// =============================
func GetIncidenciasHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	// 1. OBTENER USUARIO AUTENTICADO
	authUser, err := middleware.GetAuthUser(r)
	if err != nil {
		w.WriteHeader(http.StatusUnauthorized)
		json.NewEncoder(w).Encode(map[string]string{"error": "Authentication required."})
		return
	}

	var incidencias []models.Incidencia
	query := db.DB // Inicializar el constructor de consultas

	// 2. LÓGICA DE AUTORIZACIÓN: Filtrar por Rol
	if authUser.Rol == "CLIENTE" {
		// Un cliente solo puede ver sus propias incidencias
		query = query.Where("usuario_id = ?", authUser.ID)
	}
	// Los Administradores (o cualquier otro rol) ven todas las incidencias.

	// 3. Ejecutar consulta SELECT * FROM incidencias (con o sin filtro)
	result := query.Find(&incidencias)

	if result.Error != nil {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(map[string]string{"error": "Database error fetching all incidencias"})
		return
	}
	json.NewEncoder(w).Encode(incidencias)
}

// =============================
//
//  GET BY ID /incidencias/{id} (Control de propiedad)
//
// =============================
func GetIncidenciaByIDHandler(w http.ResponseWriter, r *http.Request) {
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

	var incidencia models.Incidencia
	result := db.DB.First(&incidencia, "id = ?", id)

	if result.Error != nil {
		if errors.Is(result.Error, gorm.ErrRecordNotFound) {
			w.WriteHeader(http.StatusNotFound)
			json.NewEncoder(w).Encode(map[string]string{"error": "Incidencia not found"})
			return
		}
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(map[string]string{"error": "Database error fetching incidencia by ID"})
		return
	}

	// 2. LÓGICA DE AUTORIZACIÓN: El cliente solo puede ver su propia incidencia
	if authUser.Rol == "CLIENTE" && incidencia.UsuarioID != authUser.ID {
		w.WriteHeader(http.StatusForbidden) // 403 Forbidden
		json.NewEncoder(w).Encode(map[string]string{"error": "Forbidden: You can only view your own incidents."})
		return
	}

	json.NewEncoder(w).Encode(incidencia)
}

// =============================
//
//  POST /incidencias (Inyectando UsuarioID del contexto)
//
// =============================
func PostIncidenciaHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	// 1. OBTENER USUARIO AUTENTICADO
	authUser, err := middleware.GetAuthUser(r)
	if err != nil {
		w.WriteHeader(http.StatusUnauthorized)
		json.NewEncoder(w).Encode(map[string]string{"error": "Authentication required."})
		return
	}

	var newIncidencia models.Incidencia

	if err := json.NewDecoder(r.Body).Decode(&newIncidencia); err != nil {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]string{"error": "Invalid request payload: " + err.Error()})
		return
	}

	// 🔥 2. INYECTAR/SOBREESCRIBIR el UsuarioID con el ID autenticado.
	// Esto previene que un usuario cree una incidencia a nombre de otro.
	newIncidencia.UsuarioID = authUser.ID

	// 3. Lógica de Negocio: Establecer valores por defecto si no se reciben
	if newIncidencia.Estado == nil {
		estado := "PENDIENTE"
		newIncidencia.Estado = &estado
	}
	// Asegurar que la fecha sea la actual si no se proporciona
	if newIncidencia.Fecha.IsZero() {
		newIncidencia.Fecha = time.Now()
	}

	// 4. Crear el registro
	result := db.DB.Create(&newIncidencia)

	if result.Error != nil {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(map[string]string{"error": "Database error creating incidencia: " + result.Error.Error()})
		return
	}
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(newIncidencia)
}

// =============================
//
//  UPDATE /incidencias/{id} (Control de propiedad y Rol)
//
// =============================
func UpdateIncidenciaByIDHandler(w http.ResponseWriter, r *http.Request) {
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

	var existingIncidencia models.Incidencia
	var updates map[string]interface{}

	// 2. Verificar si la incidencia existe y obtener el UsuarioID
	if err := db.DB.First(&existingIncidencia, "id = ?", id).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			w.WriteHeader(http.StatusNotFound)
			json.NewEncoder(w).Encode(map[string]string{"error": "Incidencia not found"})
			return
		}
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(map[string]string{"error": "Database error"})
		return
	}

	// 3. LÓGICA DE AUTORIZACIÓN: Solo el propietario o un ADMIN puede actualizar
	isOwner := existingIncidencia.UsuarioID == authUser.ID
	isAdmin := authUser.Rol == "ADMINISTRADOR"

	if !isOwner && !isAdmin {
		w.WriteHeader(http.StatusForbidden)
		json.NewEncoder(w).Encode(map[string]string{"error": "Forbidden: You can only update your own incidents."})
		return
	}

	// 4. Decodificar el JSON de actualización
	if err := json.NewDecoder(r.Body).Decode(&updates); err != nil {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]string{"error": "Invalid request payload"})
		return
	}

	// 5. Aplicar actualizaciones
	// Si el cliente intenta cambiar el UsuarioID, GORM lo ignora si no se incluye el campo.
	db.DB.Model(&existingIncidencia).Updates(updates)
	json.NewEncoder(w).Encode(existingIncidencia)
}

// =============================
//
//  DELETE /incidencias/{id} (Control de propiedad y Rol)
//
// =============================
func DeleteIncidenciaByIDHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	params := mux.Vars(r)
	id := params["id"]

	// 1. OBTENER USUARIO AUTENTICADO
	authUser, err := middleware.GetAuthUser(r)
	if err != nil {
		w.WriteHeader(http.StatusUnauthorized)
		json.NewEncoder(w).Encode(map[string]string{"error": "Authentication required."})
		return
	}

	// 2. Verificar la propiedad antes de intentar eliminar
	var incidencia models.Incidencia
	findResult := db.DB.Select("usuario_id").First(&incidencia, "id = ?", id)

	if findResult.Error != nil {
		if errors.Is(findResult.Error, gorm.ErrRecordNotFound) {
			w.WriteHeader(http.StatusNotFound)
			json.NewEncoder(w).Encode(map[string]string{"error": "Incidencia not found"})
			return
		}
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(map[string]string{"error": "Database error checking incident ownership"})
		return
	}

	// 3. LÓGICA DE AUTORIZACIÓN: Solo el propietario o un ADMIN puede eliminar
	isOwner := incidencia.UsuarioID == authUser.ID
	isAdmin := authUser.Rol == "ADMINISTRADOR"

	if !isOwner && !isAdmin {
		w.WriteHeader(http.StatusForbidden)
		json.NewEncoder(w).Encode(map[string]string{"error": "Forbidden: You can only delete your own incidents."})
		return
	}

	// 4. Intentar eliminar la incidencia
	db.DB.Delete(&incidencia)

	// 5. Devolver mensaje de éxito
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]string{"message": "Incidencia deleted successfully"})
}
