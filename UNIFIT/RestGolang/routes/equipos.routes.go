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
//  GET ALL /equipos (Requiere Autenticación)
//
// =============================
func GetEquiposHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	// 1. OBTENER USUARIO AUTENTICADO (Solo se requiere estar logueado, todos pueden ver los equipos)
	if _, err := middleware.GetAuthUser(r); err != nil {
		w.WriteHeader(http.StatusUnauthorized)
		json.NewEncoder(w).Encode(map[string]string{"error": "Authentication required."})
		return
	}

	var equipos []models.Equipo
	result := db.DB.Find(&equipos)

	if result.Error != nil {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(map[string]string{"error": "Database error fetching all equipos"})
		return
	}
	json.NewEncoder(w).Encode(equipos)
}

// =============================
//
//  GET BY ID /equipos/{id} (Requiere Autenticación)
//
// =============================
func GetEquipoByIDHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	// 1. OBTENER USUARIO AUTENTICADO
	if _, err := middleware.GetAuthUser(r); err != nil {
		w.WriteHeader(http.StatusUnauthorized)
		json.NewEncoder(w).Encode(map[string]string{"error": "Authentication required."})
		return
	}

	params := mux.Vars(r)
	id := params["id"]

	var equipo models.Equipo
	result := db.DB.First(&equipo, "id = ?", id)

	if result.Error != nil {
		if errors.Is(result.Error, gorm.ErrRecordNotFound) {
			w.WriteHeader(http.StatusNotFound)
			json.NewEncoder(w).Encode(map[string]string{"error": "Equipo not found"})
			return
		}
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(map[string]string{"error": "Database error fetching equipo by ID"})
		return
	}
	json.NewEncoder(w).Encode(equipo)
}

// =============================
//
//  POST /equipos (Solo Administrador)
//
// =============================
func PostEquipoHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	// 1. OBTENER USUARIO AUTENTICADO
	authUser, err := middleware.GetAuthUser(r)
	if err != nil {
		w.WriteHeader(http.StatusUnauthorized)
		json.NewEncoder(w).Encode(map[string]string{"error": "Authentication required."})
		return
	}

	// 2. RESTRICCIÓN DE ROL: Solo Administradores
	if authUser.Rol != "ADMINISTRADOR" {
		w.WriteHeader(http.StatusForbidden)
		json.NewEncoder(w).Encode(map[string]string{"error": "Forbidden: Only Administrators can create equipment."})
		return
	}

	var newEquipo models.Equipo

	if err := json.NewDecoder(r.Body).Decode(&newEquipo); err != nil {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]string{"error": "Invalid request payload: " + err.Error()})
		return
	}

	// Lógica de Negocio: Si no se especifica el estado, asumimos DISPONIBLE
	if newEquipo.Estado == "" {
		newEquipo.Estado = "DISPONIBLE"
	}

	result := db.DB.Create(&newEquipo)

	if result.Error != nil {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(map[string]string{"error": "Database error creating equipo: " + result.Error.Error()})
		return
	}
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(newEquipo)
}

// =============================
//
//  UPDATE /equipos/{id} (Solo Administrador)
//
// =============================
func UpdateEquipoByIDHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	// 1. OBTENER USUARIO AUTENTICADO
	authUser, err := middleware.GetAuthUser(r)
	if err != nil {
		w.WriteHeader(http.StatusUnauthorized)
		json.NewEncoder(w).Encode(map[string]string{"error": "Authentication required."})
		return
	}

	// 2. RESTRICCIÓN DE ROL: Solo Administradores
	if authUser.Rol != "ADMINISTRADOR" {
		w.WriteHeader(http.StatusForbidden)
		json.NewEncoder(w).Encode(map[string]string{"error": "Forbidden: Only Administrators can update equipment."})
		return
	}

	params := mux.Vars(r)
	id := params["id"]

	var existingEquipo models.Equipo
	var updates map[string]interface{}

	if err := db.DB.First(&existingEquipo, "id = ?", id).Error; err != nil {
		w.WriteHeader(http.StatusNotFound)
		json.NewEncoder(w).Encode(map[string]string{"error": "Equipo not found"})
		return
	}

	if err := json.NewDecoder(r.Body).Decode(&updates); err != nil {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]string{"error": "Invalid request payload"})
		return
	}

	db.DB.Model(&existingEquipo).Updates(updates)
	json.NewEncoder(w).Encode(existingEquipo)
}

// =============================
//
//  DELETE /equipos/{id} (Solo Administrador)
//
// =============================
func DeleteEquipoByIDHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	// 1. OBTENER USUARIO AUTENTICADO
	authUser, err := middleware.GetAuthUser(r)
	if err != nil {
		w.WriteHeader(http.StatusUnauthorized)
		json.NewEncoder(w).Encode(map[string]string{"error": "Authentication required."})
		return
	}

	// 2. RESTRICCIÓN DE ROL: Solo Administradores
	if authUser.Rol != "ADMINISTRADOR" {
		w.WriteHeader(http.StatusForbidden)
		json.NewEncoder(w).Encode(map[string]string{"error": "Forbidden: Only Administrators can delete equipment."})
		return
	}

	params := mux.Vars(r)
	id := params["id"]

	var equipo models.Equipo

	if err := db.DB.First(&equipo, "id = ?", id).Error; err != nil {
		w.WriteHeader(http.StatusNotFound)
		json.NewEncoder(w).Encode(map[string]string{"error": "Equipo not found"})
		return
	}

	// GORM usa soft delete por defecto si el modelo tiene gorm.Model
	db.DB.Delete(&equipo)

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]string{"message": "Equipo deleted successfully"})
}
