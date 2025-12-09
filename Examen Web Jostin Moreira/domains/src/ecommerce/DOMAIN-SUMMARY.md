# Dominio Simplificado - E-commerce

## ✅ Entidades Implementadas (6 entidades - Portable & Ligero)

### 1. **Product** (Producto)
- Productos base: camisetas, tazas, libretas
- Control de stock y precios
- Permite variaciones y personalizaciones
- Relaciones: Tiene Variaciones y Personalizaciones

### 2. **Variation** (Variación)
- Atributos del producto: tallas, colores
- Modificador de precio (+ o -)
- Stock independiente por variación
- Relación: Pertenece a un Producto

### 3. **Customization** (Personalización)
- Opciones de personalización: texto, imagen, logo
- Precio adicional por personalización
- Validaciones específicas (ej: maxCharacters)
- Relación: Pertenece a un Producto

### 4. **Cart** (Carrito)
- Agrupa items antes de la compra
- Cálculo automático de totales e impuestos
- Soporte para usuarios autenticados y sesiones anónimas
- `userId` como referencia externa (string) - sin relación de entidad
- Relación: Tiene Items (CartItem)

### 5. **CartItem** (Item de Carrito)
- Producto + Variación + Personalización en el carrito
- Snapshot de precios al agregar
- Cálculo automático de totales por item
- Relaciones: Pertenece a Carrito, referencia Producto y Variación

### 6. **Order** (Pedido - Simplificado)
- Resumen de compra finalizada
- **Items almacenados en JSON** (no entidad separada)
- **paymentMethod como string** (no entidad separada)
- `userId` como referencia externa (string)
- Estados: pending, confirmed, processing, shipped, delivered, cancelled
- Estado de pago: pending, paid, failed, refunded
- Número de orden único: ORD-YYYYMMDD-0001
- **Sin relaciones complejas** - Entidad completamente independiente
- Snapshot completo de datos de envío e items

---

## ❌ Entidades Eliminadas (Simplificación)

### **User** (Usuario)
- ❌ Removido del dominio
- ✅ Ahora manejado como `userId: string` (referencia externa)
- ✅ Permite microservicios independientes
- ✅ Reduce acoplamiento

### **PaymentMethod** (Método de Pago)
- ❌ Removido como entidad
- ✅ Simplificado a `paymentMethod: string`
- ✅ Valores: 'credit_card', 'paypal', 'bank_transfer', 'cash'
- ✅ Más flexible y portable

### **OrderItem** (Item de Pedido)
- ❌ Removido como entidad separada
- ✅ Integrado en Order como campo JSON
- ✅ Reduce complejidad de queries
- ✅ Mantiene snapshot inmutable en JSON

---

## 🔗 Diagrama de Relaciones

```
┌──────────┐
│ PRODUCT  │ (Producto base)
└────┬─────┘
     │
     ├───< (1:N) VARIATION (Tallas/Colores)
     │
     └───< (1:N) CUSTOMIZATION (Personalizaciones)

┌─────────┐
│  CART   │
│ userId: │ ← Referencia externa (string)
│ string  │
└────┬────┘
     │(1:N)
     ▼
┌──────────┐
│ CARTITEM │
└────┬─────┘
     │(N:1)
     └────> PRODUCT
            └────> VARIATION [opcional]

┌────────────────┐
│     ORDER      │
├────────────────┤
│ userId: string │ ← Referencia externa
│ paymentMethod: │
│   string       │ ← No es entidad
│ items: JSON[]  │ ← OrderItems en JSON
└────────────────┘
  (Entidad independiente)
```

---

## 📦 Estructura de Archivos

```
src/ecommerce/
├── entities/                    ← 6 entidades TypeORM
│   ├── product.entity.ts
│   ├── variation.entity.ts
│   ├── customization.entity.ts
│   ├── cart.entity.ts
│   ├── cart-item.entity.ts
│   ├── order.entity.ts         ← Items en JSON
│   └── index.ts
├── dtos/                        ← DTOs con validaciones
│   ├── product.dto.ts
│   ├── variation.dto.ts
│   ├── customization.dto.ts
│   ├── cart.dto.ts
│   ├── cart-item.dto.ts
│   ├── order.dto.ts
│   └── index.ts
├── ecommerce.module.ts          ← Solo exporta TypeOrmModule
├── README.md
└── DOMAIN-SUMMARY.md
```

---

## 🔄 Flujo Completo de Negocio

### 1. Navegación y Selección
```
Cliente → Ve productos disponibles
        → Selecciona variación (talla/color)
        → Elige opciones de personalización
```

### 2. Agregar al Carrito
```
Sistema → Valida stock del producto
        → Valida stock de la variación
        → Valida personalizaciones
        → Calcula precios (base + variación + personalizaciones)
        → Crea CartItem con snapshot de configuración
        → Recalcula totales del carrito
```

### 3. Finalizar Compra (Checkout)
```
Cliente → Confirma carrito
        → Selecciona método de pago (string)
        → Completa datos de envío
        
Sistema → Genera número de orden único
        → Crea snapshot JSON de todos los items
        → Calcula totales: subtotal + tax + shipping + processing
        → Crea Order con todos los datos
        → Marca carrito como 'converted'
```

### 4. Procesamiento
```
Admin/Sistema → Actualiza estado de pago: paid
              → Actualiza estado: confirmed → processing → shipped → delivered
```

---

## 💡 Características Clave

### ✅ Portabilidad
- Sin dependencias de User (gestión externa)
- Order sin relaciones complejas
- Fácil de importar en múltiples proyectos
- Dominio compartido entre REST, GraphQL, WebSockets

### ✅ Simplicidad
- 33% menos entidades (6 vs 9)
- Menos joins en queries
- Código más mantenible
- Estructura clara y directa
- **Servicios con lógica mínima de repositorio** (solo CRUD)

### ✅ Escalabilidad
- Soporte para usuarios autenticados y sesiones anónimas
- Stock independiente por producto y variación
- Métodos de pago flexibles sin cambios de esquema
- **Lógica de negocio implementable en capa de aplicación**

### ✅ Flexibilidad
- Personalizaciones en JSON para múltiples configuraciones
- Sistema de estados para pedidos y pagos
- User puede estar en microservicio separado
- **Sin validaciones acopladas** - cada proyecto define sus reglas

### ✅ Integridad de Datos
- Relaciones bien definidas con TypeORM
- Cascade deletes apropiados
- Validaciones en DTOs con class-validator
- Snapshots inmutables en pedidos

### ✅ Performance
- Menos tablas = queries más rápidas
- Order como entidad única = 1 query completo
- Eager loading en relaciones frecuentes
- JSON fields para evitar joins innecesarios

### ✅ Desacoplamiento
- Servicios sin lógica de negocio compleja
- Validaciones y cálculos en capa de aplicación
- Cada proyecto implementa su propia lógica
- Dominio portable sin dependencias innecesarias

---

## 🚀 Cómo Usar en Otros Proyectos

### Opción 1: Importar Solo Entidades y DTOs (Recomendado)

```typescript
import { 
  Product, 
  Variation, 
  Customization, 
  Cart, 
  CartItem, 
  Order 
} from '../domains/src/ecommerce/entities';

import { CreateProductDto, ProductResponseDto } from '../domains/src/ecommerce/dtos';

// En tu módulo
TypeOrmModule.forFeature([Product, Variation, Customization, Cart, CartItem, Order])
```

### Opción 2: Importar Módulo Completo con Servicios

```typescript
import { EcommerceModule } from '../domains/src/ecommerce/ecommerce.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({...}),
    EcommerceModule,
  ],
})
export class AppModule {}
```

---

## 🎯 Casos de Uso Ideales

### ✅ Perfecto para:
- Proyectos REST que necesiten el dominio completo
- Proyectos GraphQL con resolvers compartidos
- WebSockets para notificaciones en tiempo real
- Arquitecturas de microservicios
- Proyectos que separan User en otro servicio
- E-commerce con productos personalizables

### ⚠️ No recomendado para:
- Tiendas con miles de SKUs diferentes
- Marketplaces multi-vendor complejos
- Sistemas con workflow de aprobación complejo
- E-commerce B2B con cotizaciones

---

## 📊 Comparación: Antes vs Después

| Aspecto | Antes (v1.0) | Después (v2.0) |
|---------|--------------|----------------|
| **Entidades** | 9 | 6 (-33%) |
| **Relaciones TypeORM** | 10 | 5 (-50%) |
| **User** | Entidad completa | Referencia externa |
| **PaymentMethod** | Entidad separada | String simple |
| **OrderItem** | Entidad separada | JSON en Order |
| **Queries típicas** | Múltiples joins | Consultas simples |
| **Portabilidad** | Media | Alta ✅ |
| **Complejidad** | Alta | Baja ✅ |

---

## 🚀 Próximos Pasos

El dominio está completo y listo para:

1. ✅ **Importar en proyecto REST** - Controladores HTTP
2. ✅ **Importar en proyecto GraphQL** - Resolvers
3. ✅ **Importar en proyecto WebSockets** - Eventos en tiempo real
4. 🔄 **Implementar User Service** - Microservicio separado
5. 🔄 **Integración con pasarelas de pago** (Stripe, PayPal)
6. 🔄 **Sistema de notificaciones** (emails, SMS)
7. 🔄 **Webhooks** para integraciones externas
8. 🔄 **Panel de administración**

---

**Versión**: 4.0.0 (Dominio Puro)  
**Fecha**: Noviembre 2025  
**Stack**: NestJS + TypeORM + PostgreSQL  
**Entidades**: 6  
**Servicios**: 0 (dominio puro sin lógica)  
**Dependencias**: TypeORM, class-validator, class-transformer  
**Filosofía**: Solo estructura de datos (entidades + DTOs), cero lógica de negocio  
**Ideal para**: Compartir entre proyectos REST, GraphQL, WebSockets con total libertad de implementación
