package routes

import (
	"encoding/json"
	"errors"
	"net/http"

	"github.com/CrisF35/RestGolang/db"
	"github.com/CrisF35/RestGolang/models"
	"github.com/CrisF35/RestGolang/utils"
	"github.com/gorilla/mux"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

// =============================
//
//	GET ALL
//
// =============================
func GetUsersHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	var users []models.User
	result := db.DB.Find(&users)

	if result.Error != nil {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(map[string]string{
			"error": "Database error",
		})
		return
	}

	// 🔥 MEJORA DE SEGURIDAD: Asegurar que el password no se envía NUNCA
	// incluso si el tag 'omitempty' falla o el modelo es alterado.
	for i := range users {
		users[i].Password = nil
	}

	json.NewEncoder(w).Encode(users)
}

// =============================
//
//	GET BY ID
//
// =============================
func GetUserbyID(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	var user models.User
	params := mux.Vars(r)
	id := params["id"]

	// Buscar por ID
	result := db.DB.First(&user, "id = ?", id)

	// Si no existe el usuario
	if result.Error != nil {
		if errors.Is(result.Error, gorm.ErrRecordNotFound) {
			w.WriteHeader(http.StatusNotFound)
			json.NewEncoder(w).Encode(map[string]string{
				"error": "User not found",
			})
			return
		}

		// Otros errores (conexion, sintaxis, etc)
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(map[string]string{
			"error": "Database error",
		})
		return
	}

	// Esto asegura que el campo 'password' no se envíe al cliente,
	// incluso si el tag 'json:"password,omitempty"' en el modelo fallara.
	user.Password = nil

	// Todo OK
	json.NewEncoder(w).Encode(&user)
}

// =============================
//
//  POST /users (REGISTRO)
//
// =============================
func PostUserHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	var newUser models.User

	if err := json.NewDecoder(r.Body).Decode(&newUser); err != nil {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]string{"error": "Invalid request payload: " + err.Error()})
		return
	}

	// 🔥🔥🔥 LÓGICA DE HASHING 🔥🔥🔥
	if newUser.Password == nil {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]string{"error": "Password is required"})
		return
	}

	hashedPassword, err := utils.HashPassword(*newUser.Password) // USAR utils.HashPassword
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(map[string]string{"error": "Error hashing password"})
		return
	}

	// Sobreescribir la contraseña de texto plano con el hash
	newUser.Password = &hashedPassword
	// --------------------------------------------------------

	// Lógica de negocio: Asignar valores por defecto (ej. Rol y Tipo)
	rol := "CLIENTE" // Asumimos que el registro público es para CLIENTES
	tipo := "REGULAR"
	if newUser.Rol == nil {
		newUser.Rol = &rol
	}
	if newUser.Tipo == nil {
		newUser.Tipo = &tipo
	}

	result := db.DB.Create(&newUser)

	if result.Error != nil {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(map[string]string{"error": "Database error creating user: " + result.Error.Error()})
		return
	}

	// 🔥 Ocultar el hash de la contraseña antes de responder
	newUser.Password = nil

	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(newUser)
}

// =============================
//
//	DELETE /users/{id}
//
// =============================
func DeleteUserbyID(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	params := mux.Vars(r)
	id := params["id"]

	// Eliminar usuario directamente
	result := db.DB.Delete(&models.User{}, "id = ?", id)

	if result.Error != nil {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(map[string]string{"error": "Error deleting user"})
		return
	}

	// Si no se afectó ninguna fila, es porque no se encontró el usuario
	if result.RowsAffected == 0 {
		w.WriteHeader(http.StatusNotFound)
		json.NewEncoder(w).Encode(map[string]string{"error": "User not found"})
		return
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]string{"message": "User deleted successfully"})
}

// =============================
//
//	UPDATE /users/{id}
//
// =============================
func UpdateUserByID(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	params := mux.Vars(r)
	id := params["id"]

	var existingUser models.User
	var updates map[string]interface{} // Usamos map[string]interface{} para manejar la contraseña

	// 1. Verificar que el usuario exista y obtener sus datos actuales
	result := db.DB.First(&existingUser, "id = ?", id)
	if result.Error != nil {
		if errors.Is(result.Error, gorm.ErrRecordNotFound) {
			w.WriteHeader(http.StatusNotFound)
			json.NewEncoder(w).Encode(map[string]string{"error": "User not found"})
			return
		}
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(map[string]string{"error": "Database error"})
		return
	}

	// 2. Decodificar el JSON recibido en un map (para manejar la contraseña)
	if err := json.NewDecoder(r.Body).Decode(&updates); err != nil {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]string{"error": "Invalid JSON format"})
		return
	}

	// 3. 🔥 CRÍTICO: HASHEAR LA CONTRASEÑA SI VIENE EN LA SOLICITUD
	if password, ok := updates["password"]; ok && password != "" {
		passwordStr, isString := password.(string)
		if isString {
			hashedPassword, err := bcrypt.GenerateFromPassword([]byte(passwordStr), bcrypt.DefaultCost)
			if err != nil {
				w.WriteHeader(http.StatusInternalServerError)
				json.NewEncoder(w).Encode(map[string]string{"error": "Error hashing password"})
				return
			}
			// Reemplazar la contraseña de texto plano con el hash
			updates["password"] = string(hashedPassword)
		}
	}

	// 4. Aplicar las actualizaciones a la base de datos
	// El uso de `Model` y `Updates` es correcto.
	if err := db.DB.Model(&existingUser).Updates(updates).Error; err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(map[string]string{"error": "Error updating user"})
		return
	}

	// 5. 🔥 CRÍTICO: Recargar el usuario completo para devolver la respuesta actualizada
	// (Por si GORM no actualizó el struct con todos los cambios)
	db.DB.First(&existingUser, "id = ?", id)

	// 6. Ocultar la contraseña antes de responder
	existingUser.Password = nil

	// 7. Retornar el usuario actualizado
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(&existingUser)
}
