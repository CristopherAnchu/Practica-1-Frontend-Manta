package models

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type Asistencia struct {
	ID        string `gorm:"type:uuid;primaryKey;not null" json:"id"`
	ReservaID string `gorm:"type:uuid;column:reservaId;not null" json:"reservaId" validate:"required"`
	UsuarioID string `gorm:"type:uuid;column:usuarioId;not null" json:"usuarioId" validate:"required"`

	//Relaciones con GORM - Commented out to avoid preload issues
	// Reserva Reserva `gorm:"foreignKey:ReservaID"`
	// Usuario User    `gorm:"foreignKey:UsuarioID"`

	Fecha         time.Time `gorm:"type:date" json:"fecha" validate:"required"`
	Asistio       bool      `gorm:"type:boolean" json:"asistio"`
	Observaciones *string   `gorm:"type:text" json:"observaciones,omitempty"`

	// Timestamps
	CreatedAt time.Time      `gorm:"autoCreateTime" json:"createdAt,omitempty"`
	UpdatedAt time.Time      `gorm:"autoUpdateTime" json:"updatedAt,omitempty"`
	DeletedAt gorm.DeletedAt `gorm:"index" json:"deletedAt,omitempty"`
}

func (a *Asistencia) BeforeCreate(tx *gorm.DB) (err error) {
	// Generar el UUID solo si no viene desde el frontend
	if a.ID == "" {
		a.ID = uuid.New().String()
	}
	return
}
