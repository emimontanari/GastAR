# TODO - Lista de Tareas

## 📋 Features a Implementar

### 🏦 Vista de Cuentas (account_view)

#### 🎯 Alta Prioridad

- [X] **Cambiar botón "Agregar Cuenta" por ButtonGroup con icono a la izquierda**
  - Componente: `ButtonGroup` de shadcn/ui
  - Objetivo: Mejorar el diseño del botón de agregar cuenta
  - Requisito: El icono debe estar a la **izquierda** en lugar de a la derecha
  - Implementación:

  ```tsx
  import { IconPlus } from "@tabler/icons-react";
  import { Button } from "@/components/ui/button";
  import {
    ButtonGroup,
    ButtonGroupSeparator,
  } from "@/components/ui/button-group";

  export function AddAccountButton() {
    return (
      <ButtonGroup>
        <Button size="icon" variant="secondary">
          <IconPlus />
        </Button>
        <ButtonGroupSeparator />
        <Button variant="secondary">Agregar Cuenta</Button>
      </ButtonGroup>
    );
  }
  ```

- [X] **Implementar carrusel para las tarjetas de cuentas**
  - Componente: `Carousel` de shadcn/ui
  - Objetivo: Mejorar la navegación entre múltiples cuentas
  - Referencia de implementación:

  ```tsx
  import * as React from "react";
  import { Card, CardContent } from "@/components/ui/card";
  import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
  } from "@/components/ui/carousel";

  export function CarouselSize() {
    return (
      <Carousel
        opts={{
          align: "start",
        }}
        className="w-full max-w-sm"
      >
        <CarouselContent>
          {Array.from({ length: 5 }).map((_, index) => (
            <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
              <div className="p-1">
                <Card>
                  <CardContent className="flex aspect-square items-center justify-center p-6">
                    <span className="text-3xl font-semibold">{index + 1}</span>
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    );
  }
  ```

- [X] **Corregir visualización de categorías en tabla de cuentas**
  - Problema: Las categorías no se muestran correctamente en la tabla
  - Solución: Utilizar componente `Badge` para mostrar categorías
  - Implementación:

  ```tsx
  import { Badge } from "@/components/ui/badge";

  // En la celda de categoría:
  <Badge variant="secondary">{category}</Badge>;
  ```

#### 🔧 Mejoras de UX

- [X] **Implementar ScrollArea para selector de iconos de banco**
  - Problema: No se puede usar la rueda del mouse para hacer scroll en la selección de iconos
  - Solución: Envolver el selector de iconos en un `ScrollArea`
  - Referencia de implementación:

  ```tsx
  import * as React from "react";
  import Image from "next/image";
  import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

  export interface BankIcon {
    name: string;
    icon: string;
  }

  export const bankIcons: BankIcon[] = [
    {
      name: "Banco Galicia",
      icon: "https://example.com/icon1.png",
    },
    {
      name: "Banco Santander",
      icon: "https://example.com/icon2.png",
    },
    // ... más iconos
  ];

  export function BankIconSelector() {
    return (
      <ScrollArea className="w-96 rounded-md border whitespace-nowrap">
        <div className="flex w-max space-x-4 p-4">
          {bankIcons.map((bank) => (
            <figure key={bank.name} className="shrink-0">
              <div className="overflow-hidden rounded-md">
                <Image
                  src={bank.icon}
                  alt={`Icono de ${bank.name}`}
                  className="aspect-square h-16 w-16 object-cover"
                  width={64}
                  height={64}
                />
              </div>
              <figcaption className="text-muted-foreground pt-2 text-xs text-center">
                {bank.name}
              </figcaption>
            </figure>
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    );
  }
  ```

#### 🐛 Bugs a Corregir

- [X] **Corregir funcionalidad del DropdownMenu en account-card**
  - Problema: Las acciones "Editar" y "Eliminar" no funcionan
  - Pasos a seguir:
    1. Verificar que los handlers `onEdit` y `onDelete` estén correctamente conectados
    2. Asegurar que los eventos onClick se propaguen correctamente
    3. Revisar que el estado se actualice después de cada acción
  - Código de referencia:

  ```tsx
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button variant="ghost" size="icon">
        <MoreVertical className="h-4 w-4" />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end">
      <DropdownMenuItem onClick={() => handleEdit(account.id)}>
        Editar
      </DropdownMenuItem>
      <DropdownMenuItem
        onClick={() => handleDelete(account.id)}
        className="text-destructive"
      >
        Eliminar
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
  ```

- [X] **Agregar iconos a las acciones del DropdownMenu en account-card**
  - Objetivo: Mejorar la UX agregando iconos visuales junto a cada acción
  - Implementación:

  ```tsx
  import { Edit, Trash2, Eye, Copy } from "lucide-react";

  <DropdownMenuContent align="end">
    <DropdownMenuItem onClick={() => handleView(account.id)}>
      <Eye className="mr-2 h-4 w-4" />
      Ver detalles
    </DropdownMenuItem>
    <DropdownMenuItem onClick={() => handleEdit(account.id)}>
      <Edit className="mr-2 h-4 w-4" />
      Editar
    </DropdownMenuItem>
    <DropdownMenuItem onClick={() => handleDuplicate(account.id)}>
      <Copy className="mr-2 h-4 w-4" />
      Duplicar
    </DropdownMenuItem>
    <DropdownMenuSeparator />
    <DropdownMenuItem
      onClick={() => handleDelete(account.id)}
      className="text-destructive"
    >
      <Trash2 className="mr-2 h-4 w-4" />
      Eliminar
    </DropdownMenuItem>
  </DropdownMenuContent>;
  ```

---

## 📝 Notas de Desarrollo

### Componentes de shadcn/ui utilizados

- `Carousel` - Para navegación de tarjetas
- `Badge` - Para etiquetas de categorías
- `ScrollArea` - Para áreas con scroll personalizado
- `DropdownMenu` - Para menús contextuales

### Iconos de Lucide React

- `Edit` - Acción de editar
- `Trash2` - Acción de eliminar
- `Eye` - Ver detalles
- `Copy` - Duplicar
- `MoreVertical` - Menú de opciones

---

## 🎯 Próximos Pasos

1. Implementar carrusel de cuentas
2. Corregir visualización de categorías
3. Arreglar funcionalidad del DropdownMenu
4. Agregar iconos a las acciones
5. Implementar ScrollArea para iconos de banco

---

**Última actualización:** 02/01/2026

# TODO - Proyecto Gasti Dashboard

> **Última actualización:** 02/01/2026  
> **Estado del proyecto:** En desarrollo activo

---

## 📑 Índice

1. [Componentes Extraídos](#componentes-extraídos)
2. [Features Implementados](#features-implementados)
3. [Features Pendientes](#features-pendientes)
4. [Bugs a Corregir](#bugs-a-corregir)
5. [Mejoras de UX](#mejoras-de-ux)
6. [Estructura de Archivos](#estructura-de-archivos)
7. [Próximos Pasos](#próximos-pasos)

---

## 🎯 Componentes Extraídos

### ✅ AccountCard - `account-card.tsx`

**Estado:** Completado y funcional

Componente de tarjeta para mostrar información de cuentas bancarias con las siguientes características:

#### Funcionalidades Implementadas:
- ✅ Display de nombre de cuenta y balance
- ✅ Icono personalizable con colores
- ✅ DropdownMenu completamente funcional
- ✅ Acciones: Ver, Editar, Duplicar, Eliminar
- ✅ Iconos en todas las acciones del menú (Edit, Trash2, Eye, Copy)
- ✅ Separador visual antes de acción destructiva
- ✅ Formato de moneda con `toLocaleString()`
- ✅ Props totalmente tipadas con TypeScript

#### Props Disponibles:
```typescript
interface AccountCardProps {
  accountName: string
  balance: number
  currency?: string
  icon?: React.ReactNode
  iconColor?: string
  onEdit?: () => void
  onDelete?: () => void
  onView?: () => void
  onDuplicate?: () => void
}
```

#### Ejemplo de Uso:
```tsx
<AccountCard
  accountName="Banco Hipotecario"
  balance={125000.50}
  currency="ARS"
  icon={<Building2 className="h-5 w-5 text-white" />}
  iconColor="bg-orange-500"
  onEdit={() => handleEdit()}
  onDelete={() => handleDelete()}
  onView={() => handleView()}
  onDuplicate={() => handleDuplicate()}
/>
```

---

### ✅ TransactionTable - `transaction-table.tsx`

**Estado:** Completado y funcional

Tabla completa con paginación para mostrar historial de transacciones.

#### Funcionalidades Implementadas:
- ✅ Display de transacciones en formato tabla
- ✅ Paginación completa (primera, anterior, siguiente, última)
- ✅ Ordenamiento clickeable por columnas
- ✅ Formato de montos con colores semánticos (verde/rojo)
- ✅ Badges para categorías con iconos
- ✅ Indicador de origen (manual/automático)
- ✅ Estado vacío con mensaje amigable
- ✅ Contador de transacciones totales
- ✅ Botones de paginación con estados disabled correctos

#### Tipo de Datos:
```typescript
interface Transaction {
  id: string
  date: string
  description: string
  amount: number
  currency: string
  category: {
    name: string
    icon: string
  }
  account: {
    name: string
    icon?: React.ReactNode
    iconColor?: string
  }
  origin: "manual" | "automatic"
}
```

#### Props Disponibles:
```typescript
interface TransactionTableProps {
  transactions: Transaction[]
  currentPage?: number
  totalPages?: number
  totalTransactions?: number
  onPageChange?: (page: number) => void
  onSort?: (column: string) => void
}
```

---

## ✅ Features Implementados

### 1. ✅ DropdownMenu Funcional en AccountCard
- **Problema resuelto:** Las funciones Editar y Eliminar no funcionaban
- **Solución:** Implementados handlers correctamente con onClick
- **Mejoras adicionales:** 
  - Iconos agregados a cada acción
  - Separador antes de acción destructiva
  - Estilos mejorados con hover states
  - Color rojo para acción de eliminar

### 2. ✅ Iconos en Acciones del DropdownMenu
- **Implementación:** Lucide React icons
- **Iconos usados:**
  - `Eye` - Ver detalles
  - `Edit` - Editar
  - `Copy` - Duplicar
  - `Trash2` - Eliminar
- **Espaciado:** `mr-2` para separar icono del texto

### 3. ✅ Formato de Moneda Mejorado
- **Método:** `toLocaleString("es-AR")`
- **Características:**
  - Separadores de miles
  - 2 decimales fijos
  - Colores semánticos (verde/rojo)

---

## 📋 Features Pendientes

### 🏦 Vista de Cuentas (account_view)

#### 🎯 Alta Prioridad

- [X] **Cambiar botón "Agregar Cuenta" por ButtonGroup con icono a la izquierda**
  - Componente: `ButtonGroup` de shadcn/ui
  - Objetivo: Mejorar el diseño del botón de agregar cuenta
  - Requisito: El icono debe estar a la **izquierda** en lugar de a la derecha
  - Implementación:
  
  ```tsx
  import { IconPlus } from "@tabler/icons-react"
  import { Button } from "@/components/ui/button"
  import {
    ButtonGroup,
    ButtonGroupSeparator,
  } from "@/components/ui/button-group"
  
  export function AddAccountButton() {
    return (
      <ButtonGroup>
        <Button size="icon" variant="secondary">
          <IconPlus />
        </Button>
        <ButtonGroupSeparator />
        <Button variant="secondary">Agregar Cuenta</Button>
      </ButtonGroup>
    )
  }
  ```

- [X] **Implementar carrusel para las tarjetas de cuentas**
  - Componente: `Carousel` de shadcn/ui
  - Objetivo: Mejorar la navegación entre múltiples cuentas
  - Archivos a modificar: `account_view.tsx` o dashboard principal
  - Referencia de implementación:
  
  ```tsx
  import * as React from "react"
  import { Card, CardContent } from "@/components/ui/card"
  import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
  } from "@/components/ui/carousel"
  import { AccountCard } from "@/components/account-card"
  
  export function AccountCarousel({ accounts }) {
    return (
      <Carousel
        opts={{
          align: "start",
        }}
        className="w-full max-w-5xl"
      >
        <CarouselContent>
          {accounts.map((account, index) => (
            <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
              <div className="p-1">
                <AccountCard
                  accountName={account.name}
                  balance={account.balance}
                  currency={account.currency}
                  icon={account.icon}
                  iconColor={account.iconColor}
                  onEdit={() => handleEdit(account.id)}
                  onDelete={() => handleDelete(account.id)}
                  onView={() => handleView(account.id)}
                  onDuplicate={() => handleDuplicate(account.id)}
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    )
  }
  ```

- [X] **Corregir visualización de categorías en tabla de cuentas**
  - Problema: Las categorías no se muestran correctamente en la tabla
  - Solución: Utilizar componente `Badge` para mostrar categorías
  - Ubicación: Tabla de cuentas (no TransactionTable)
  - Implementación:
  
  ```tsx
  import { Badge } from "@/components/ui/badge"
  
  // En la celda de categoría de la tabla de cuentas:
  <TableCell>
    <Badge variant="secondary" className="bg-gray-700 text-gray-200">
      {category}
    </Badge>
  </TableCell>
  ```

---

## 🔧 Mejoras de UX

### Prioridad Media

- [X] **Implementar ScrollArea para selector de iconos de banco**
  - Problema: No se puede usar la rueda del mouse para hacer scroll en la selección de iconos
  - Solución: Envolver el selector de iconos en un `ScrollArea`
  - Ubicación: Modal/Dialog de creación/edición de cuenta
  - Referencia de implementación:
  
  ```tsx
  import * as React from "react"
  import Image from "next/image"
  import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
  
  export interface BankIcon {
    name: string
    icon: string
  }
  
  export const bankIcons: BankIcon[] = [
    {
      name: "Banco Galicia",
      icon: "https://example.com/icon1.png",
    },
    {
      name: "Banco Santander",
      icon: "https://example.com/icon2.png",
    },
    {
      name: "Banco Hipotecario",
      icon: "https://example.com/icon3.png",
    },
    {
      name: "Banco BBVA",
      icon: "https://example.com/icon4.png",
    },
    {
      name: "Banco Macro",
      icon: "https://example.com/icon5.png",
    },
    // ... más iconos
  ]
  
  export function BankIconSelector({ onSelect, selectedIcon }) {
    return (
      <ScrollArea className="w-full max-w-md rounded-md border border-gray-700 whitespace-nowrap">
        <div className="flex w-max space-x-4 p-4">
          {bankIcons.map((bank) => (
            <button
              key={bank.name}
              onClick={() => onSelect(bank)}
              className={`shrink-0 transition-all hover:scale-105 ${
                selectedIcon === bank.icon ? 'ring-2 ring-green-500' : ''
              }`}
            >
              <div className="overflow-hidden rounded-md">
                <Image
                  src={bank.icon}
                  alt={`Icono de ${bank.name}`}
                  className="aspect-square h-16 w-16 object-cover"
                  width={64}
                  height={64}
                />
              </div>
              <figcaption className="text-muted-foreground pt-2 text-xs text-center">
                {bank.name}
              </figcaption>
            </button>
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    )
  }
  ```

- [ ] **Agregar animaciones de transición**
  - Transiciones suaves al cambiar de página en tabla
  - Animación al abrir/cerrar DropdownMenu
  - Hover effects mejorados
  - Loading states

- [ ] **Implementar dark/light mode toggle**
  - Actualmente solo modo oscuro
  - Agregar switch en navbar
  - Persistir preferencia en localStorage

- [X] **Agregar búsqueda y filtros en TransactionTable**
  - Búsqueda por descripción
  - Filtro por categoría
  - Filtro por cuenta
  - Filtro por rango de fechas
  - Filtro por rango de montos

---

## 🐛 Bugs a Corregir

### ✅ RESUELTO - Funcionalidad del DropdownMenu en account-card
- ~~Problema: Las acciones "Editar" y "Eliminar" no funcionaban~~
- **Estado:** ✅ Corregido
- **Solución aplicada:**
  - Handlers `onEdit` y `onDelete` correctamente conectados
  - Eventos onClick propagándose correctamente
  - Props opcionales para flexibilidad

### Bugs Pendientes

- [X] **Validación de formularios**
  - Agregar validación en formulario de nueva cuenta
  - Validación de montos (no negativos para balance inicial)
  - Validación de nombres duplicados

- [X] **Manejo de errores**
  - Toast notifications para acciones exitosas/fallidas
  - Error boundaries para componentes
  - Retry logic para operaciones fallidas

- [ ] **Performance**
  - Optimizar re-renders con React.memo
  - Lazy loading de componentes pesados
  - Virtualización para listas largas

---

## 📁 Estructura de Archivos

```
project/
├── components/
│   ├── ui/                          # shadcn/ui components
│   │   ├── button.tsx
│   │   ├── button-group.tsx
│   │   ├── badge.tsx
│   │   ├── table.tsx
│   │   ├── dropdown-menu.tsx
│   │   ├── carousel.tsx
│   │   └── scroll-area.tsx
│   │
│   ├── account-card.tsx             # ✅ Componente extraído
│   ├── transaction-table.tsx        # ✅ Componente extraído
│   ├── components-example.tsx       # ✅ Ejemplos de uso
│   └── gasti-dashboard.tsx          # Dashboard original
│
├── docs/
│   ├── TODO.md                      # 📄 Este archivo
│   └── README-COMPONENTS.md         # ✅ Documentación de componentes
│
└── lib/
    └── utils.ts                     # Utilidades
```

---

## 📝 Notas de Desarrollo

### Componentes de shadcn/ui Utilizados
- ✅ `Button` - Botones de acción
- ✅ `Badge` - Etiquetas de categorías
- ✅ `Table` - Tabla de transacciones
- ✅ `DropdownMenu` - Menús contextuales
- ✅ `Carousel` - Navegación de tarjetas
- ✅ `ScrollArea` - Áreas con scroll
- ✅ `ButtonGroup` - Grupo de botones

### Iconos de Lucide React
- ✅ `Edit` - Acción de editar
- ✅ `Trash2` - Acción de eliminar
- ✅ `Eye` - Ver detalles
- ✅ `Copy` - Duplicar
- ✅ `MoreVertical` - Menú de opciones
- ✅ `Building2` - Icono de banco
- ✅ `Calendar` - Origen manual
- ✅ `ArrowDown` - Indicador de orden
- ✅ `ChevronLeft/Right` - Navegación
- ✅ `ChevronsLeft/Right` - Primera/última página

### Iconos de Tabler Icons
- ✅ `IconPlus` - Agregar cuenta (usado en ButtonGroup)

---

## 🎯 Próximos Pasos

### Semana 1 (Prioridad Alta)
1. [X] Implementar ButtonGroup para botón "Agregar Cuenta"
2. [X] Implementar carrusel de cuentas
3. [X] Corregir visualización de categorías en tabla de cuentas
4. [ ] Testing de componentes extraídos

### Semana 2 (Prioridad Media)
5. [X] Implementar ScrollArea para iconos de banco
6. [ ] Agregar validación de formularios
7. [ ] Implementar toast notifications
8. [ ] Agregar loading states

### Semana 3 (Mejoras)
9. [ ] Agregar búsqueda y filtros avanzados
10. [ ] Implementar dark/light mode
11. [ ] Optimizaciones de performance
12. [ ] Documentación completa de API

---

## 📊 Progreso General

### Completado: 70%
- ✅ AccountCard extraído y funcional
- ✅ TransactionTable extraído y funcional
- ✅ DropdownMenu corregido
- ✅ Iconos agregados a acciones
- ✅ Formato de moneda implementado
- ✅ Carrusel de cuentas implementado
- ✅ ButtonGroup para agregar cuenta
- ✅ ScrollArea para iconos
- ✅ Categorías con Badge en tabla

### Pendiente: 30%
- ⏳ Validaciones
- ⏳ Filtros y búsqueda
- ⏳ Dark/light mode
- ⏳ Testing completo
- ⏳ Toast notifications
- ⏳ Animaciones de transición

---

## 🔗 Enlaces Útiles

- [shadcn/ui Documentation](https://ui.shadcn.com/)
- [Lucide React Icons](https://lucide.dev/)
- [Tabler Icons React](https://tabler-icons.io/)
- [Tailwind CSS](https://tailwindcss.com/)

---

## 📌 Recordatorios

- Siempre usar TypeScript para type safety
- Mantener componentes pequeños y reutilizables
- Documentar props y funciones complejas
- Escribir tests para componentes críticos
- Usar `toLocaleString` para formateo de números
- Mantener consistencia en estilos (tema oscuro)
- Usar iconos de Lucide para consistencia visual

---

**Desarrollado con ❤️ para Gasti**

_Última revisión: 02/01/2026_
