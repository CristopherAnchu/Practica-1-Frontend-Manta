package models

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

// 🔥 Reserva unificada: Es el modelo de DB que coincide con reserva.model.ts
type Reserva struct {
	gorm.Model

	// ID: Debe coincidir con la interfaz de TS
	ID string `gorm:"type:uuid;primaryKey;not null;uniqueIndex" json:"id"`

	// Relaciones (Foreign Keys - Alineadas con el frontend)
	UsuarioID string  `gorm:"type:uuid;not null;column:usuarioId;not null" json:"usuarioId" validate:"required"`
	EquipoID  *string `gorm:"type:uuid;column:equipoId;" json:"equipoId,omitempty"`
	HorarioID *string `gorm:"type:uuid;column:horarioId;" json:"horarioId,omitempty"` // Coincide con reserva.model.ts

	// Campos de datos
	Fecha    time.Time `gorm:"type:date;not null" json:"fecha" validate:"required"` // Usamos time.Time para DB
	Hora     *string   `gorm:"type:varchar(5)" json:"hora,omitempty"`
	Duracion *int      `gorm:"type:integer" json:"duracion,omitempty"`
	Estado   *string   `gorm:"type:varchar(20);default:'PENDIENTE'" json:"estado,omitempty" validate:"omitempty,oneof=PENDIENTE CONFIRMADA CANCELADA"`

	// Relaciones (para GORM - Opcional, ayuda a cargar datos)
	Usuario User   `gorm:"foreignKey:UsuarioID"`
	Equipo  Equipo `gorm:"foreignKey:EquipoID"`
}

// Hook BeforeCreate para generar UUID automáticamente
func (r *Reserva) BeforeCreate(tx *gorm.DB) (err error) {
	// Si el campo ID está vacío, generamos un UUID
	if r.ID == "" {
		r.ID = uuid.New().String()
	}
	return
}
