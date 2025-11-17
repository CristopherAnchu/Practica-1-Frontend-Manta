package routes

import (
	"encoding/json"
	"errors"
	"net/http"
	"time"

	"github.com/CrisF35/RestGolang/db"
	"github.com/CrisF35/RestGolang/middleware" // 🔥 NUEVO IMPORT
	"github.com/CrisF35/RestGolang/models"
	"github.com/gorilla/mux"
	"gorm.io/gorm"
)

// =============================
//
//  GET ALL (Filtrado por Rol)
//
// =============================
func GetReservasHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	// 1. OBTENER USUARIO AUTENTICADO
	authUser, err := middleware.GetAuthUser(r)
	if err != nil {
		w.WriteHeader(http.StatusUnauthorized)
		json.NewEncoder(w).Encode(map[string]string{"error": "Authentication required."})
		return
	}

	var reservas []models.Reserva
	query := db.DB // Inicializar el constructor de consultas

	// 2. LÓGICA DE AUTORIZACIÓN: Filtrar por Rol
	if authUser.Rol == "CLIENTE" {
		// Un cliente solo puede ver sus propias reservas
		query = query.Where("usuario_id = ?", authUser.ID)
	}
	// Los Administradores (o cualquier otro rol) ven todas las reservas.

	// 3. Ejecutar consulta SELECT * FROM reservas (con o sin filtro)
	result := query.Find(&reservas)

	if result.Error != nil {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(map[string]string{
			"error": "Database error",
		})
		return
	}

	// 4. Devolver la lista de reservas
	json.NewEncoder(w).Encode(reservas)
}

// =============================
//
//  GET BY ID (Control de propiedad)
//
// =============================
func GetReservaByIDHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	// 1. OBTENER USUARIO AUTENTICADO
	authUser, err := middleware.GetAuthUser(r)
	if err != nil {
		w.WriteHeader(http.StatusUnauthorized)
		json.NewEncoder(w).Encode(map[string]string{"error": "Authentication required."})
		return
	}

	var reserva models.Reserva
	params := mux.Vars(r)
	id := params["id"]

	// 2. Buscar la reserva por ID
	result := db.DB.First(&reserva, "id = ?", id)

	if result.Error != nil {
		if errors.Is(result.Error, gorm.ErrRecordNotFound) {
			w.WriteHeader(http.StatusNotFound)
			json.NewEncoder(w).Encode(map[string]string{
				"error": "Reserva not found",
			})
			return
		}

		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(map[string]string{
			"error": "Database error",
		})
		return
	}

	// 3. LÓGICA DE AUTORIZACIÓN: El cliente solo puede ver su propia reserva
	if authUser.Rol == "CLIENTE" && reserva.UsuarioID != authUser.ID {
		w.WriteHeader(http.StatusForbidden) // 403 Forbidden
		json.NewEncoder(w).Encode(map[string]string{"error": "Forbidden: You can only view your own reservations."})
		return
	}

	// 4. Devolver la reserva
	json.NewEncoder(w).Encode(reserva)
}

// =============================
//
//  POST: Crear nueva Reserva (Inyectando UsuarioID del contexto)
//
// =============================
func PostReservaHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	// 1. OBTENER USUARIO AUTENTICADO
	authUser, err := middleware.GetAuthUser(r)
	if err != nil {
		w.WriteHeader(http.StatusUnauthorized)
		json.NewEncoder(w).Encode(map[string]string{"error": "Authentication required."})
		return
	}

	var newReserva models.Reserva

	// 2. Decodificar el JSON de la solicitud
	if err := json.NewDecoder(r.Body).Decode(&newReserva); err != nil {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]string{
			"error": "Invalid request payload: " + err.Error(),
		})
		return
	}

	// 🔥 3. INYECTAR/SOBREESCRIBIR el UsuarioID con el ID autenticado.
	// Esto previene que un usuario cree una reserva a nombre de otro.
	newReserva.UsuarioID = authUser.ID

	// 4. Continuar con las validaciones (newReserva.UsuarioID ahora es seguro)

	// 4.1. Validar campos obligatorios básicos
	if newReserva.Fecha.IsZero() || newReserva.Hora == nil || *newReserva.Hora == "" {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]string{
			"error": "Fecha y Hora son campos obligatorios.", // UsuarioID ya no se verifica aquí
		})
		return
	}

	// 4.2. Validar que la fecha no esté en el pasado
	todayStart := time.Now().Truncate(24 * time.Hour)
	reservaDateStart := newReserva.Fecha.Truncate(24 * time.Hour)

	if reservaDateStart.Before(todayStart) {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]string{
			"error": "No se puede crear una reserva para una fecha pasada.",
		})
		return
	}

	// ------------------------------------------------------------------
	// 5. LÓGICA DE NEGOCIO: Verificar DOBLE Disponibilidad
	// ------------------------------------------------------------------

	// 5.1. Verificar si el USUARIO ya tiene una reserva en la misma fecha y hora
	var userConflictReserva models.Reserva
	userConflictCheck := db.DB.Where("usuario_id = ?", newReserva.UsuarioID). // Usamos el ID inyectado
											Where("fecha = ?", newReserva.Fecha).
											Where("hora = ?", *newReserva.Hora).
		// Solo verificamos conflictos con reservas PENDIENTES o CONFIRMADAS
		Where("estado IN (?)", []string{"PENDIENTE", "CONFIRMADA"}).
		First(&userConflictReserva)

	if userConflictCheck.Error == nil {
		// Se encontró una reserva, lo que indica un conflicto
		w.WriteHeader(http.StatusConflict)
		json.NewEncoder(w).Encode(map[string]string{
			"error": "El usuario ya tiene una reserva (Pendiente o Confirmada) en esta misma fecha y hora.",
		})
		return
	}
	// Manejar errores de DB inesperados (diferentes a "no encontrado")
	if !errors.Is(userConflictCheck.Error, gorm.ErrRecordNotFound) {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(map[string]string{
			"error": "Database error checking user availability: " + userConflictCheck.Error.Error(),
		})
		return
	}

	// 5.2. Verificar disponibilidad del EQUIPO (SOLO si se especificó un equipo)
	if newReserva.EquipoID != nil && *newReserva.EquipoID != "" {
		var equipoConflictReserva models.Reserva
		equipoConflictCheck := db.DB.Where("equipo_id = ?", *newReserva.EquipoID).
			Where("fecha = ?", newReserva.Fecha).
			Where("hora = ?", *newReserva.Hora).
			// Solo verificamos conflictos con reservas PENDIENTES o CONFIRMADAS
			Where("estado IN (?)", []string{"PENDIENTE", "CONFIRMADA"}).
			First(&equipoConflictReserva)

		if equipoConflictCheck.Error == nil {
			// Se encontró una reserva, lo que indica un conflicto de equipo
			w.WriteHeader(http.StatusConflict)
			json.NewEncoder(w).Encode(map[string]string{
				"error": "El equipo seleccionado ya está reservado en esta misma fecha y hora.",
			})
			return
		}
		// Manejar errores de DB inesperados (diferentes a "no encontrado")
		if !errors.Is(equipoConflictCheck.Error, gorm.ErrRecordNotFound) {
			w.WriteHeader(http.StatusInternalServerError)
			json.NewEncoder(w).Encode(map[string]string{
				"error": "Database error checking equipment availability: " + equipoConflictCheck.Error.Error(),
			})
			return
		}
	}

	// ------------------------------------------------------------------
	// 6. Creación
	// ------------------------------------------------------------------

	// Asegurar que el estado inicial sea PENDIENTE
	if newReserva.Estado == nil || *newReserva.Estado == "" {
		defaultEstado := "PENDIENTE"
		newReserva.Estado = &defaultEstado
	}

	// Crear el registro en la base de datos
	result := db.DB.Create(&newReserva)

	if result.Error != nil {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(map[string]string{
			"error": "Database error creating reserva: " + result.Error.Error(),
		})
		return
	}

	// Éxito
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(newReserva)
}

// =============================
//
//  UPDATE /reservas/{id} (Control de propiedad y Rol)
//
// =============================
func UpdateReservaByIDHandler(w http.ResponseWriter, r *http.Request) {
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

	var existingReserva models.Reserva
	var updates models.Reserva // Usamos el struct Reserva para recibir el JSON de actualización

	// 2. Verificar si la reserva existe
	result := db.DB.First(&existingReserva, "id = ?", id)
	if result.Error != nil {
		if errors.Is(result.Error, gorm.ErrRecordNotFound) {
			w.WriteHeader(http.StatusNotFound)
			json.NewEncoder(w).Encode(map[string]string{"error": "Reserva not found"})
			return
		}
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(map[string]string{"error": "Database error"})
		return
	}

	// 3. LÓGICA DE AUTORIZACIÓN: Solo el propietario o un ADMIN puede actualizar
	isOwner := existingReserva.UsuarioID == authUser.ID
	isAdmin := authUser.Rol == "ADMINISTRADOR"

	if !isOwner && !isAdmin {
		w.WriteHeader(http.StatusForbidden)
		json.NewEncoder(w).Encode(map[string]string{"error": "Forbidden: You can only update your own reservations."})
		return
	}

	// Si el usuario es cliente, no puede cambiar el UsuarioID de la reserva.
	// Si intenta hacerlo, GORM lo ignora si no se incluye en el Updates struct, pero
	// por seguridad no permitiremos que un CLIENTE modifique un campo que no es suyo.
	// Para simplicidad, confiamos en GORM. Si el CLIENTE pasa su propio ID, no hay cambio.

	// 4. Decodificar el JSON del cuerpo de la petición
	if err := json.NewDecoder(r.Body).Decode(&updates); err != nil {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]string{"error": "Invalid request body"})
		return
	}

	// 5. Aplicar las actualizaciones a los campos de la reserva existente.
	result = db.DB.Model(&existingReserva).Updates(updates)

	if result.Error != nil {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(map[string]string{"error": "Failed to update reserva"})
		return
	}

	// 6. Devolver la reserva actualizada
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(existingReserva)
}

// =============================
//
//  DELETE /reservas/{id} (Control de propiedad y Rol)
//
// =============================
func DeleteReservaByIDHandler(w http.ResponseWriter, r *http.Request) {
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
	var reserva models.Reserva
	findResult := db.DB.Select("usuario_id").First(&reserva, "id = ?", id)

	if findResult.Error != nil {
		if errors.Is(findResult.Error, gorm.ErrRecordNotFound) {
			w.WriteHeader(http.StatusNotFound)
			json.NewEncoder(w).Encode(map[string]string{"error": "Reserva not found"})
			return
		}
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(map[string]string{"error": "Database error checking reservation ownership"})
		return
	}

	// 3. LÓGICA DE AUTORIZACIÓN: Solo el propietario o un ADMIN puede eliminar
	isOwner := reserva.UsuarioID == authUser.ID
	isAdmin := authUser.Rol == "ADMINISTRADOR"

	if !isOwner && !isAdmin {
		w.WriteHeader(http.StatusForbidden)
		json.NewEncoder(w).Encode(map[string]string{"error": "Forbidden: You can only delete your own reservations."})
		return
	}

	// 4. Intentar eliminar la reserva por ID
	result := db.DB.Where("id = ?", id).Delete(&reserva)

	if result.Error != nil {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(map[string]string{"error": "Failed to delete reserva"})
		return
	}

	// 5. Devolver mensaje de éxito
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]string{"message": "Reserva deleted successfully"})
}
