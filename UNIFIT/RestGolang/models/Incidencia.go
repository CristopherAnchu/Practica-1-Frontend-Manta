package models

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type Incidencia struct {
	gorm.Model
	ID        string `gorm:"type:uuid;primaryKey;not null;uniqueIndex" json:"id"`
	UsuarioID string `gorm:"type:uuid;column:usuarioId;not null" json:"usuarioId" validate:"required"`
	// Relaciones con GORM
	Usuario User `gorm:"foreignKey:UsuarioID"`

	Asunto      string    `gorm:"type:varchar(255)" json:"asunto" validate:"required"`
	Descripcion string    `gorm:"type:text" json:"descripcion" validate:"required"`
	Prioridad   string    `gorm:"type:varchar(10)" json:"prioridad" validate:"required,oneof=BAJA MEDIA ALTA"`
	Estado      *string   `gorm:"type:varchar(20)" json:"estado,omitempty" validate:"omitempty,oneof=PENDIENTE EN_PROCESO RESUELTA"`
	Fecha       time.Time `gorm:"type:date" json:"fecha" validate:"required"`
}

func (i *Incidencia) BeforeCreate(tx *gorm.DB) (err error) {
	// Generar UUID solo si el ID está vacío
	if i.ID == "" {
		i.ID = uuid.New().String()
	}
	return
}
