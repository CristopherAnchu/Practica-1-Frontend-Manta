package models

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type Asistencia struct {
	gorm.Model
	ID        string `gorm:"type:uuid;primaryKey;not null;uniqueIndex" json:"id"`
	ReservaID string `gorm:"type:uuid;column:reservaId;not null" json:"reservaId" validate:"required"`
	UsuarioID string `gorm:"type:uuid;column:usuarioId;not null" json:"usuarioId" validate:"required"`

	//Relaciones con GORM
	Reserva Reserva `gorm:"foreignKey:ReservaID"`
	Usuario User    `gorm:"foreignKey:UsuarioID"`

	Fecha         time.Time `gorm:"type:date" json:"fecha" validate:"required"`
	Asistio       bool      `gorm:"type:boolean" json:"asistio"`
	Observaciones *string   `gorm:"type:text" json:"observaciones,omitempty"`
}

func (a *Asistencia) BeforeCreate(tx *gorm.DB) (err error) {
	// Generar el UUID solo si no viene desde el frontend
	if a.ID == "" {
		a.ID = uuid.New().String()
	}
	return
}
