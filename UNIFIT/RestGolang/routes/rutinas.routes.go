package routes

import (
	"encoding/json"
	"errors"
	"net/http"

	"github.com/CrisF35/RestGolang/db"
	"github.com/CrisF35/RestGolang/models"
	"github.com/gorilla/mux"
	"gorm.io/gorm"
)

// =============================
//
//	GET ALL /rutinas
//
// =============================
func GetRutinasHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	var rutinas []models.RutinaUsuario
	result := db.DB.Find(&rutinas)

	if result.Error != nil {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(map[string]string{
			"error": "Database error fetching all rutinas",
		})
		return
	}

	json.NewEncoder(w).Encode(rutinas)
}

// =============================
//
//	GET BY ID /rutinas/{id}
//
// =============================
func GetRutinaByIDHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	params := mux.Vars(r)
	id := params["id"]

	var rutina models.RutinaUsuario
	result := db.DB.First(&rutina, "id = ?", id)

	if result.Error != nil {
		if errors.Is(result.Error, gorm.ErrRecordNotFound) {
			w.WriteHeader(http.StatusNotFound)
			json.NewEncoder(w).Encode(map[string]string{"error": "Rutina not found"})
			return
		}
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(map[string]string{"error": "Database error fetching rutina by ID"})
		return
	}

	json.NewEncoder(w).Encode(rutina)
}

// =============================
//
//	POST /rutinas
//
// =============================
func PostRutinaHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	var newRutina models.RutinaUsuario

	if err := json.NewDecoder(r.Body).Decode(&newRutina); err != nil {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]string{"error": "Invalid request payload"})
		return
	}

	// Crear el registro
	result := db.DB.Create(&newRutina)

	if result.Error != nil {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(map[string]string{"error": "Database error creating rutina"})
		return
	}

	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(newRutina)
}

// =============================
// UPDATE /rutinas/{id}
// =============================
func UpdateRutinaByIDHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	params := mux.Vars(r)
	id := params["id"]

	var existingRutina models.RutinaUsuario
	var updates models.RutinaUsuario

	// 1. Verificar existencia
	if err := db.DB.First(&existingRutina, "id = ?", id).Error; err != nil {
		w.WriteHeader(http.StatusNotFound)
		json.NewEncoder(w).Encode(map[string]string{"error": "Rutina not found"})
		return
	}

	// 2. Decodificar payload
	if err := json.NewDecoder(r.Body).Decode(&updates); err != nil {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]string{"error": "Invalid request payload"})
		return
	}

	// 3. Actualizar
	result := db.DB.Model(&existingRutina).Updates(updates)
	if result.Error != nil {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(map[string]string{"error": "Database error updating rutina"})
		return
	}

	// Respuesta final
	json.NewEncoder(w).Encode(existingRutina)
}

// =============================
// DELETE /rutinas/{id}
// =============================
func DeleteRutinaByIDHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	params := mux.Vars(r)
	id := params["id"]

	var rutina models.RutinaUsuario

	// 1. Verificar existencia
	if err := db.DB.First(&rutina, "id = ?", id).Error; err != nil {
		w.WriteHeader(http.StatusNotFound)
		json.NewEncoder(w).Encode(map[string]string{"error": "Rutina not found"})
		return
	}

	// 2. Eliminar
	result := db.DB.Delete(&rutina)
	if result.Error != nil {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(map[string]string{"error": "Database error deleting rutina"})
		return
	}

	// 3. Respuesta de éxito
	json.NewEncoder(w).Encode(map[string]string{
		"message": "Rutina deleted successfully",
	})
}
