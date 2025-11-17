package routes

import (
	"encoding/json"
	"net/http"

	"github.com/CrisF35/RestGolang/db"
	"github.com/CrisF35/RestGolang/models"
	"github.com/CrisF35/RestGolang/utils" // Usar utilidades
)

// Estructuras para la solicitud y respuesta de Login
type LoginRequest struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

type LoginResponse struct {
	User  models.User `json:"user"`
	Token string      `json:"token"`
}

// =============================
//
//  POST /login
//
// =============================
func LoginHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	var loginData LoginRequest
	if err := json.NewDecoder(r.Body).Decode(&loginData); err != nil {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]string{"error": "Invalid request payload"})
		return
	}

	var user models.User
	// 1. Buscar usuario por email
	result := db.DB.Where("email = ?", loginData.Email).First(&user)
	if result.Error != nil {
		// No dar detalles, solo "Credenciales inválidas"
		w.WriteHeader(http.StatusUnauthorized)
		json.NewEncoder(w).Encode(map[string]string{"error": "Invalid credentials"})
		return
	}

	// Asegurarse de que el hash existe
	if user.Password == nil {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(map[string]string{"error": "User data integrity error: no stored password hash"})
		return
	}

	// 2. Verificar la contraseña
	if !utils.CheckPasswordHash(loginData.Password, *user.Password) {
		w.WriteHeader(http.StatusUnauthorized)
		json.NewEncoder(w).Encode(map[string]string{"error": "Invalid credentials"})
		return
	}

	// 3. Generar el JWT
	tokenString, err := utils.GenerateToken(user.ID, *user.Rol)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(map[string]string{"error": "Could not generate token"})
		return
	}

	// 🔥 4. Ocultar el hash de la contraseña antes de responder
	user.Password = nil

	// 5. Responder con el token y los datos del usuario (Rol y Tipo son claves para el frontend)
	response := LoginResponse{
		User:  user,
		Token: tokenString,
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(response)
}
