# Módulo E-commerce - Dominio Completo

## Justificación del Dominio

Este módulo de e-commerce está diseñado como un **dominio compartido ligero y portable** para un negocio de venta de productos personalizables (camisetas, tazas y libretas). El dominio ha sido simplificado para:

1. **Gestión de productos con variaciones**: Los productos pueden tener múltiples opciones (tallas, colores) que afectan al precio final.

2. **Sistema de personalización flexible**: Permite ofrecer servicios de personalización (texto, imágenes, logos) con costos adicionales según la complejidad.

3. **Carrito de compras inteligente**: Calcula automáticamente precios, aplica personalizaciones y gestiona el stock disponible.

4. **Sistema de pedidos simplificado**: Order como entidad ligera con items y datos en JSON, sin dependencias complejas.

El diseño prioriza la **portabilidad**, **simplicidad** y **reutilización**, siendo ideal para importarse en múltiples proyectos (REST, GraphQL, WebSockets) sin acoplamientos innecesarios.

---

## Entidades del Dominio

### 1. **Product** (Producto)

Representa los productos base disponibles en la tienda.

**Propiedades:**
- `id` (UUID): Identificador único
- `name` (string): Nombre del producto
- `description` (text): Descripción detallada
- `basePrice` (decimal): Precio base sin modificadores
- `category` (string): Categoría del producto (camiseta, taza, libreta)
- `imageUrl` (string): URL de la imagen principal
- `stock` (int): Cantidad disponible en inventario
- `isActive` (boolean): Estado de disponibilidad
- `allowsCustomization` (boolean): Indica si acepta personalización
- `createdAt` / `updatedAt`: Auditoría temporal

**Propósito:**
Actúa como el núcleo del catálogo de productos. Define las características básicas y precio inicial antes de aplicar modificadores por variaciones o personalizaciones.

---

### 2. **Variation** (Variación)

Representa las opciones configurables de un producto (tallas, colores).

**Propiedades:**
- `id` (UUID): Identificador único
- `productId` (UUID): Referencia al producto padre
- `type` (string): Tipo de variación (talla, color)
- `value` (string): Valor específico (S, M, L, XL, Rojo, Azul, etc.)
- `priceModifier` (decimal): Modificador de precio (positivo o negativo)
- `stock` (int): Stock específico de esta variación
- `isAvailable` (boolean): Disponibilidad de la variación
- `createdAt` / `updatedAt`: Auditoría temporal

**Propósito:**
Permite ofrecer múltiples configuraciones del mismo producto base con precios diferenciados. Por ejemplo, una camiseta XL puede tener un costo adicional sobre el precio base.

---

### 3. **Customization** (Personalización)

Define las opciones de personalización disponibles para cada producto.

**Propiedades:**
- `id` (UUID): Identificador único
- `productId` (UUID): Referencia al producto
- `name` (string): Nombre de la opción (ej: "Texto personalizado")
- `description` (text): Descripción detallada
- `type` (string): Tipo (text, image, logo)
- `additionalPrice` (decimal): Costo adicional por aplicar la personalización
- `maxCharacters` (int): Límite de caracteres para tipo texto
- `isActive` (boolean): Estado de disponibilidad
- `createdAt` / `updatedAt`: Auditoría temporal

**Propósito:**
Define las capacidades de personalización que un producto puede ofrecer. Cada personalización tiene un costo asociado que se suma al precio final.

---

### 4. **Cart** (Carrito)

Representa el carrito de compras de un cliente.

**Propiedades:**
- `id` (UUID): Identificador único
- `userId` (UUID): ID del usuario autenticado (opcional)
- `sessionId` (string): ID de sesión para usuarios anónimos (opcional)
- `subtotal` (decimal): Suma de precios de items sin impuestos
- `tax` (decimal): Impuestos calculados
- `total` (decimal): Total final (subtotal + impuestos)
- `status` (string): Estado del carrito (active, abandoned, converted)
- `createdAt` / `updatedAt`: Auditoría temporal

**Propósito:**
Centraliza la información de compra del cliente y mantiene el estado financiero actualizado. Soporta tanto usuarios registrados como visitantes anónimos.

---

### 5. **CartItem** (Item del Carrito)

Representa un producto específico dentro del carrito con sus configuraciones.

**Propiedades:**
- `id` (UUID): Identificador único
- `cartId` (UUID): Referencia al carrito padre
- `productId` (UUID): Referencia al producto
- `variationId` (UUID): Variación seleccionada (opcional)
- `quantity` (int): Cantidad de unidades
- `unitPrice` (decimal): Precio base + modificador de variación
- `customizationData` (JSON): Array con datos de personalizaciones aplicadas
- `customizationTotal` (decimal): Suma de costos de personalización
- `itemTotal` (decimal): Precio total del item `(unitPrice + customizationTotal) × quantity`
- `createdAt` / `updatedAt`: Auditoría temporal

**Propósito:**
Materializa la selección concreta del cliente con todas sus opciones configuradas. Almacena el snapshot de precios al momento de agregar al carrito.

---

## Relaciones entre Entidades

### Diagrama de Relaciones (Textual)

```
User (1) ──< (N) Cart
User (1) ──< (N) Order

Product (1) ──< (N) Variation
Product (1) ──< (N) Customization

Cart (1) ──< (N) CartItem
CartItem (N) ──> (1) Product
CartItem (N) ──> (1) Variation [opcional]

PaymentMethod (1) ──< (N) Order

Order (1) ──< (N) OrderItem
OrderItem (N) ──> (1) Product
```

### Descripción de Relaciones

1. **Product → Variation** (1:N)
   - Un producto puede tener múltiples variaciones
   - Las variaciones pertenecen a un único producto
   - Tipo: Composición (cascade delete)

2. **Product → Customization** (1:N)
   - Un producto puede tener múltiples opciones de personalización
   - Las personalizaciones pertenecen a un único producto
   - Tipo: Composición (cascade delete)

3. **User → Cart** (1:N)
   - Un usuario puede tener múltiples carritos (historial)
   - Cada carrito pertenece a un usuario (opcional para sesiones anónimas)
   - Tipo: Asociación

4. **User → Order** (1:N)
   - Un usuario puede tener múltiples pedidos
   - Cada pedido pertenece a un único usuario
   - Tipo: Asociación

5. **Cart → CartItem** (1:N)
   - Un carrito contiene múltiples items
   - Cada item pertenece a un único carrito
   - Tipo: Composición (cascade delete)

6. **CartItem → Product** (N:1)
   - Cada item del carrito referencia a un producto
   - Tipo: Asociación (eager loading para mostrar detalles)

7. **CartItem → Variation** (N:1 opcional)
   - Un item puede tener una variación seleccionada
   - La variación es opcional (productos sin variaciones)
   - Tipo: Asociación (eager loading)

8. **PaymentMethod → Order** (1:N)
   - Un método de pago puede usarse en múltiples pedidos
   - Cada pedido usa un único método de pago
   - Tipo: Asociación

9. **Order → OrderItem** (1:N)
   - Un pedido contiene múltiples items
   - Cada item pertenece a un único pedido
   - Tipo: Composición (cascade delete)

10. **OrderItem → Product** (N:1)
    - Cada item del pedido referencia al producto original
    - Tipo: Asociación (eager loading)

---

## Reglas de Negocio Implementadas

### 1. **Gestión de Productos**

- ✅ Las categorías permitidas son exclusivamente: `camiseta`, `taza`, `libreta`
- ✅ El precio base debe ser siempre mayor a 0
- ✅ Solo productos activos (`isActive: true`) pueden ser vendidos
- ✅ El stock se valida antes de permitir agregar al carrito

### 2. **Variaciones**

- ✅ Los tipos válidos son: `talla`, `color`
- ✅ No puede existir duplicación de variaciones (mismo tipo y valor) para un producto
- ✅ Las variaciones pueden modificar el precio (incremento o descuento)
- ✅ Cada variación tiene su propio control de stock independiente

### 3. **Personalizaciones**

- ✅ Solo productos con `allowsCustomization: true` aceptan personalización
- ✅ Los tipos válidos son: `text`, `image`, `logo`
- ✅ Las personalizaciones tipo `text` deben especificar `maxCharacters`
- ✅ Se valida que el texto no exceda el límite de caracteres
- ✅ Cada personalización tiene un costo adicional independiente

### 4. **Carrito de Compras**

#### Validaciones al agregar items:
- ✅ El producto debe existir y estar activo
- ✅ Debe haber stock suficiente del producto base
- ✅ Si se selecciona variación, debe pertenecer al producto
- ✅ Si se selecciona variación, debe tener stock disponible
- ✅ Las personalizaciones deben pertenecer al producto
- ✅ Las personalizaciones deben cumplir las validaciones específicas (ej: maxCharacters)

#### Cálculo de Precios:
```
Precio Unitario = Precio Base + Modificador de Variación

Costo de Personalización = Σ(Precio de cada personalización aplicada)

Total del Item = (Precio Unitario + Costo de Personalización) × Cantidad

Subtotal del Carrito = Σ(Total de cada Item)

Impuestos = Subtotal × 0.16 (16% configurable)

Total del Carrito = Subtotal + Impuestos
```

#### Gestión de Estado:
- ✅ Estados permitidos: `active`, `abandoned`, `converted`
- ✅ Los carritos pueden ser de usuarios autenticados (`userId`) o sesiones anónimas (`sessionId`)
- ✅ Los totales se recalculan automáticamente al modificar items

### 5. **Control de Stock**

- ✅ Se verifica disponibilidad antes de agregar/actualizar cantidades
- ✅ Se pueden reducir stocks mediante métodos específicos (preparación para checkout)
- ✅ Stock de variaciones es independiente del stock del producto base

### 6. **Flujo de Checkout**

- ✅ El carrito debe tener al menos un item para proceder
- ✅ Se genera un resumen detallado con:
  - Información de cada item (producto, variación, personalizaciones)
  - Cantidades y precios unitarios
  - Subtotal, impuestos y total
  - Conteo de items y cantidad total de productos

---

## Estructura del Módulo

```
src/ecommerce/
├── entities/
│   ├── product.entity.ts
│   ├── variation.entity.ts
│   ├── customization.entity.ts
│   ├── cart.entity.ts
│   ├── cart-item.entity.ts
│   └── index.ts
├── dtos/
│   ├── product.dto.ts
│   ├── variation.dto.ts
│   ├── customization.dto.ts
│   ├── cart.dto.ts
│   ├── cart-item.dto.ts
│   └── index.ts
├── services/
│   ├── product.service.ts
│   ├── variation.service.ts
│   ├── customization.service.ts
│   ├── cart.service.ts
│   └── index.ts
├── ecommerce.module.ts
└── README.md
```

### Servicios Implementados

#### **ProductService**
- `create()`: Crear productos con validaciones de categoría y precio
- `findAll()`: Listar productos activos con relaciones
- `findOne()`: Obtener producto específico
- `update()`: Actualizar producto
- `remove()`: Desactivar producto (soft delete)
- `checkStock()`: Verificar disponibilidad
- `reduceStock()`: Reducir stock tras compra

#### **VariationService**
- `create()`: Crear variaciones con validación de duplicados
- `findByProduct()`: Listar variaciones de un producto
- `findOne()`: Obtener variación específica
- `update()`: Actualizar variación
- `remove()`: Desactivar variación
- `checkStock()`: Verificar stock de variación
- `reduceStock()`: Reducir stock tras compra

#### **CustomizationService**
- `create()`: Crear opciones de personalización
- `findByProduct()`: Listar personalizaciones de un producto
- `findOne()`: Obtener personalización específica
- `update()`: Actualizar personalización
- `remove()`: Desactivar personalización
- `validateCustomizationData()`: Validar datos de personalización aplicada

#### **CartService**
- `create()`: Crear nuevo carrito (usuario o sesión)
- `findOne()`: Obtener carrito con todos sus items
- `addItem()`: Agregar producto con validaciones completas
- `updateItem()`: Modificar cantidad o personalizaciones
- `removeItem()`: Eliminar item del carrito
- `clearCart()`: Vaciar carrito completamente
- `updateStatus()`: Cambiar estado del carrito
- `getCheckoutSummary()`: Obtener resumen para finalizar compra
- `recalculateTotals()`: Recalcular subtotal, impuestos y total

---

## Flujo de Negocio Típico

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

### 3. Gestión del Carrito
```
Cliente → Modifica cantidades
        → Agrega más productos
        → Elimina items
        
Sistema → Recalcula totales en cada operación
        → Valida stock en cada modificación
```

### 4. Finalizar Compra
```
Sistema → Genera resumen del carrito
        → Muestra subtotal, impuestos y total
        → Prepara datos para integración con método de pago
```

---

## Consideraciones de Diseño

### Snapshot de Precios
Los items del carrito almacenan los precios al momento de agregar el producto. Esto evita que cambios posteriores en precios afecten carritos existentes.

### Stock Independiente
Las variaciones tienen control de stock independiente del producto base, permitiendo gestión granular del inventario.

### Flexibilidad de Personalización
El campo `customizationData` en JSON permite almacenar múltiples personalizaciones con diferentes estructuras sin modificar el esquema.

### Soporte Multi-Tenencia
El carrito soporta tanto usuarios autenticados (`userId`) como sesiones anónimas (`sessionId`), facilitando la conversión de visitantes en clientes.

### Auditoría Completa
Todas las entidades tienen `createdAt` y `updatedAt` para trazabilidad de operaciones.

---

## Próximos Pasos (No Implementados)

Este módulo define el dominio completo. Los siguientes pasos típicos serían:

1. **Controladores REST**: Exponer endpoints HTTP para cada servicio
2. **Integración con GraphQL**: Resolvers y esquemas para consultas complejas
3. **WebSockets**: Notificaciones en tiempo real de cambios de stock
4. **Webhooks**: Integración con sistemas de pago y envíos
5. **Sistema de Pedidos**: Entidad Order para materializar compras finalizadas
6. **Autenticación**: Integración con sistema de usuarios
7. **Sistema de Pagos**: Integración con pasarelas de pago
8. **Gestión de Inventario**: Sincronización de stock con proveedores

---

## Notas Técnicas

- **TypeORM**: Utilizado para ORM y definición de entidades
- **Class-validator**: Validaciones automáticas en DTOs
- **Class-transformer**: Transformación de datos en DTOs
- **NestJS**: Framework estructural del módulo
- **Decimal**: Uso de tipo `decimal(10,2)` para precisión en precios
- **UUID**: Identificadores únicos seguros para todas las entidades
- **Cascade Operations**: Eliminación en cascada para relaciones de composición
- **Eager Loading**: Carga automática de relaciones frecuentes

---

## Autor y Versión

**Versión**: 1.0.0  
**Fecha**: Noviembre 2025  
**Módulo**: E-commerce Domain Module  
**Framework**: NestJS + TypeORM
