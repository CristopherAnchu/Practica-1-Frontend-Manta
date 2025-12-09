# Módulo E-commerce - Dominio Simplificado y Portable

## Justificación del Dominio

Este módulo de e-commerce está diseñado como un **dominio compartido ligero y portable** para un negocio de venta de productos personalizables (camisetas, tazas y libretas). El dominio ha sido simplificado para:

1. **Gestión de productos con variaciones**: Los productos pueden tener múltiples opciones (tallas, colores) que afectan al precio final.

2. **Sistema de personalización flexible**: Permite ofrecer servicios de personalización (texto, imágenes, logos) con costos adicionales según la complejidad.

3. **Carrito de compras inteligente**: Calcula automáticamente precios, aplica personalizaciones y gestiona el stock disponible.

4. **Sistema de pedidos simplificado**: Order como entidad ligera con items y datos en JSON, sin dependencias complejas.

El diseño prioriza la **portabilidad**, **simplicidad** y **reutilización**, siendo ideal para importarse en múltiples proyectos (REST, GraphQL, WebSockets) sin acoplamientos innecesarios.

---

## Entidades del Dominio (6 entidades)

### ✅ Entidades Implementadas

1. **Product** - Productos base (camisetas, tazas, libretas)
2. **Variation** - Variaciones de productos (tallas, colores)
3. **Customization** - Opciones de personalización
4. **Cart** - Carrito de compras
5. **CartItem** - Items dentro del carrito
6. **Order** - Pedidos simplificados con items en JSON

### ❌ Entidades Removidas (para portabilidad)

- **User** → Ahora `userId: string` (referencia externa)
- **PaymentMethod** → Ahora `paymentMethod: string`
- **OrderItem** → Integrado en Order como JSON array

---

## Descripción Detallada de Entidades

### 1. **Product** (Producto)

Representa los productos base disponibles en la tienda.

**Propiedades:**
- `id` (UUID): Identificador único
- `name` (string): Nombre del producto
- `description` (text): Descripción detallada
- `basePrice` (decimal): Precio base sin modificadores
- `category` (string): Categoría (camiseta, taza, libreta)
- `imageUrl` (string): URL de la imagen
- `stock` (int): Cantidad disponible
- `isActive` (boolean): Estado de disponibilidad
- `allowsCustomization` (boolean): Si acepta personalización
- `createdAt` / `updatedAt`: Auditoría temporal

---

### 2. **Variation** (Variación)

Representa las opciones configurables de un producto.

**Propiedades:**
- `id` (UUID): Identificador único
- `productId` (UUID): Referencia al producto
- `type` (string): Tipo (talla, color)
- `value` (string): Valor (S, M, L, XL, Rojo, Azul, etc.)
- `priceModifier` (decimal): Modificador de precio
- `stock` (int): Stock específico
- `isAvailable` (boolean): Disponibilidad
- `createdAt` / `updatedAt`: Auditoría temporal

---

### 3. **Customization** (Personalización)

Define las opciones de personalización para productos.

**Propiedades:**
- `id` (UUID): Identificador único
- `productId` (UUID): Referencia al producto
- `name` (string): Nombre de la opción
- `description` (text): Descripción
- `type` (string): Tipo (text, image, logo)
- `additionalPrice` (decimal): Costo adicional
- `maxCharacters` (int): Límite de caracteres (para tipo text)
- `isActive` (boolean): Estado
- `createdAt` / `updatedAt`: Auditoría temporal

---

### 4. **Cart** (Carrito)

Representa el carrito de compras.

**Propiedades:**
- `id` (UUID): Identificador único
- `userId` (UUID): **Referencia externa al usuario** (string, no relación)
- `sessionId` (string): ID de sesión para usuarios anónimos
- `subtotal` (decimal): Suma de items
- `tax` (decimal): Impuestos
- `total` (decimal): Total final
- `status` (string): Estado (active, abandoned, converted)
- `createdAt` / `updatedAt`: Auditoría temporal

---

### 5. **CartItem** (Item del Carrito)

Representa un producto específico dentro del carrito.

**Propiedades:**
- `id` (UUID): Identificador único
- `cartId` (UUID): Referencia al carrito
- `productId` (UUID): Referencia al producto
- `variationId` (UUID): Variación seleccionada (opcional)
- `quantity` (int): Cantidad
- `unitPrice` (decimal): Precio base + modificador
- `customizationData` (JSON): Array con personalizaciones
- `customizationTotal` (decimal): Suma de personalizaciones
- `itemTotal` (decimal): Total del item
- `createdAt` / `updatedAt`: Auditoría temporal

---

### 6. **Order** (Pedido - Simplificado)

Representa un pedido finalizado con todos los datos en una entidad.

**Propiedades:**
- `id` (UUID): Identificador único
- `orderNumber` (string): Número único (ORD-20250125-0001)
- `userId` (UUID): **Referencia externa** (string, no relación)
- `items` (JSON): **Array completo con snapshot de items**
- `subtotal`, `tax`, `shippingCost`, `processingFee`, `total` (decimal)
- `paymentMethod` (string): **Método de pago** ('credit_card', 'paypal', 'bank_transfer', 'cash')
- `status` (string): Estado del pedido
- `paymentStatus` (string): Estado del pago
- `shippingName`, `shippingEmail`, `shippingPhone`, `shippingAddress`, `shippingCity`, `shippingCountry`, `shippingPostalCode`
- `notes`, `adminNotes` (text)
- `createdAt`, `updatedAt`, `confirmedAt`, `shippedAt`, `deliveredAt`

**Estructura del campo `items` (JSON):**
```typescript
items: [
  {
    productId: string,
    productName: string,
    productCategory: string,
    productImage?: string,
    variationData?: {
      type: string,
      value: string,
      priceModifier: number
    },
    quantity: number,
    unitPrice: number,
    customizationData?: [{
      customizationId: string,
      name: string,
      type: string,
      value: string,
      additionalPrice: number
    }],
    customizationTotal: number,
    itemTotal: number
  }
]
```

---

## Relaciones entre Entidades

### Diagrama Simplificado

```
Product (1) ──< (N) Variation
Product (1) ──< (N) Customization

Cart (1) ──< (N) CartItem
  └── userId: string (externa)

CartItem (N) ──> (1) Product
CartItem (N) ──> (1) Variation [opcional]

Order (entidad independiente)
  ├── userId: string (externa)
  ├── items: JSON[] (snapshot)
  └── paymentMethod: string
```

### Descripción de Relaciones

1. **Product → Variation** (1:N)
   - Composición con cascade delete

2. **Product → Customization** (1:N)
   - Composición con cascade delete

3. **Cart → CartItem** (1:N)
   - Composición con cascade delete
   - Cart tiene `userId` como string (sin relación de entidad)

4. **CartItem → Product** (N:1)
   - Asociación con eager loading

5. **CartItem → Variation** (N:1 opcional)
   - Asociación con eager loading

6. **Order** (entidad independiente)
   - Sin relaciones TypeORM
   - `userId` como referencia externa
   - Items almacenados en JSON

---

## Reglas de Negocio

### Productos
- ✅ Categorías válidas: camiseta, taza, libreta
- ✅ Precio base > 0
- ✅ Solo productos activos son vendibles
- ✅ Validación de stock

### Variaciones
- ✅ Tipos válidos: talla, color
- ✅ No duplicación de variaciones
- ✅ Stock independiente por variación

### Personalizaciones
- ✅ Solo productos con `allowsCustomization: true`
- ✅ Tipos válidos: text, image, logo
- ✅ Validación de maxCharacters para tipo text

### Carrito
- ✅ Validación de stock al agregar items
- ✅ Cálculo automático: `Total = (Precio Base + Variación + Personalización) × Cantidad`
- ✅ Recálculo automático de totales (subtotal + tax)

### Pedidos
- ✅ Generación automática de número de orden
- ✅ Snapshot inmutable de todos los datos
- ✅ Estados válidos: pending, confirmed, processing, shipped, delivered, cancelled
- ✅ Métodos de pago: credit_card, paypal, bank_transfer, cash

---

## Estructura del Módulo

```
src/ecommerce/
├── entities/              ← 6 entidades TypeORM
│   ├── product.entity.ts
│   ├── variation.entity.ts
│   ├── customization.entity.ts
│   ├── cart.entity.ts
│   ├── cart-item.entity.ts
│   ├── order.entity.ts
│   └── index.ts
├── dtos/                  ← DTOs con validaciones
│   ├── product.dto.ts
│   ├── variation.dto.ts
│   ├── customization.dto.ts
│   ├── cart.dto.ts
│   ├── cart-item.dto.ts
│   ├── order.dto.ts
│   └── index.ts
├── ecommerce.module.ts    ← Solo exporta TypeOrmModule
├── README.md
└── DOMAIN-SUMMARY.md
```

---

## Servicios

**Este dominio NO incluye servicios.** Solo expone entidades y DTOs para máxima flexibilidad.

### ¿Por qué sin servicios?

1. **Dominio puro** - Solo define estructura de datos
2. **Acceso directo** - Usa repositorios TypeORM en tu proyecto
3. **Cero acoplamiento** - Sin lógica de negocio impuesta
4. **Máxima flexibilidad** - Implementa tu propia lógica

### Cómo usar este dominio en tu proyecto

```typescript
// En tu proyecto REST/GraphQL/WebSockets
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product, Cart, Order } from '../domains/ecommerce/entities';
import { CreateProductDto } from '../domains/ecommerce/dtos';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private productRepo: Repository<Product>,
  ) {}

  // Implementa tu propia lógica de negocio
  async createProduct(dto: CreateProductDto) {
    const product = this.productRepo.create(dto);
    return this.productRepo.save(product);
  }
  
  async getActiveProducts() {
    return this.productRepo.find({ 
      where: { isActive: true },
      relations: ['variations', 'customizations']
    });
  }
}
```

> **Filosofía:** Un dominio compartido solo define estructura (entidades + DTOs). La lógica de negocio se implementa en cada proyecto según sus necesidades.

---

## Cómo Importar en Otros Proyectos

### 1. Importar solo entidades y DTOs (recomendado)

```typescript
// En tu proyecto REST/GraphQL/WebSockets
import { 
  Product, 
  Variation, 
  Customization, 
  Cart, 
  CartItem, 
  Order 
} from '../domains/src/ecommerce/entities';

import { 
  CreateProductDto, 
  ProductResponseDto,
  // ... otros DTOs
} from '../domains/src/ecommerce/dtos';

// Usar en TypeOrmModule
TypeOrmModule.forFeature([Product, Variation, Customization, Cart, CartItem, Order])
```

### 2. Importar el módulo completo

```typescript
// En tu app.module.ts
import { EcommerceModule } from '../domains/src/ecommerce/ecommerce.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({...}),
    EcommerceModule, // Importar módulo completo con servicios
  ],
})
export class AppModule {}
```

---

## Ventajas de Este Diseño

### ✅ Portabilidad
- Sin dependencias de User (gestionado externamente)
- Order sin relaciones complejas
- Fácil de importar en múltiples proyectos

### ✅ Simplicidad
- 33% menos entidades (6 vs 9)
- Menos joins en queries
- Código más mantenible

### ✅ Flexibilidad
- User puede estar en microservicio separado
- PaymentMethod adaptable sin cambiar esquema
- Items en JSON para máxima flexibilidad

### ✅ Performance
- Menos tablas = queries más rápidas
- Order como entidad única = 1 query vs múltiples
- Snapshots en JSON evitan joins innecesarios

---

## Próximos Pasos de Integración

1. ✅ **Importar en proyecto REST** - Usar entidades y DTOs en controladores
2. ✅ **Importar en proyecto GraphQL** - Usar entidades en resolvers
3. ✅ **Importar en proyecto WebSockets** - Notificaciones en tiempo real
4. 🔄 **Gestión de Usuarios** - Implementar en servicio externo
5. 🔄 **Sistema de Pagos** - Integración con pasarelas
6. 🔄 **Webhooks** - Integración con sistemas externos
7. 🔄 **Notificaciones** - Emails y SMS para pedidos

---

**Versión**: 2.0.0 (Dominio Simplificado y Portable)  
**Fecha**: Noviembre 2025  
**Módulo**: E-commerce Domain Module (Shared)  
**Framework**: NestJS + TypeORM  
**Entidades**: 6 (reducido 33% para máxima portabilidad)  
**Ideal para**: Proyectos REST, GraphQL, WebSockets que necesiten compartir el mismo dominio
