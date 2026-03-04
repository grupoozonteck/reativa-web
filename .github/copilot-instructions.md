# Reativa App - AI Coding Agent Instructions
## Idioma / Language
**Sempre responda em português do Brasil no chat.** Este é um projeto brasileiro e toda comunicação com o usuário, comentários de código e documentação devem ser em PT-BR.
**Mensagens de commit devem ser em inglês.**


## Project Overview
Sales reactivation CRM built with React 19 + TypeScript + Vite. Role-based dashboard for managing inactive customers, team performance, and reactivation campaigns.

## Tech Stack
- **Frontend**: React 19, React Router v7, TypeScript
- **State**: Context API (Auth, Theme), TanStack Query for server state
- **Styling**: Tailwind CSS + shadcn/ui components, Framer Motion, Lucide icons
- **API**: Axios with interceptors, API base URL: `import.meta.env.VITE_API_URL`

## Architecture Patterns

### Authentication & Authorization
- Auth state managed via `AuthContext` ([src/contexts/AuthContext.tsx](src/contexts/AuthContext.tsx))
- Token stored in `localStorage`, injected via axios interceptor ([src/services/api.ts](src/services/api.ts))
- 401 responses trigger automatic redirect to `/login`
- User data includes nested `attendants` object with `type` field (1=Gerente, 2=Supervisor, 3=Atendente)

### Permission System
- Role hierarchy: Gerente (1) > Supervisor (2) > Atendente (3)
- Route access controlled via `canAccessRoute()` in [src/config/permissions.ts](src/config/permissions.ts)
- Protected routes use `RoleGuard` wrapper component in [src/App.tsx](src/App.tsx)
- Example: `/equipe` route restricted to Gerente and Supervisor only

### Service Layer Pattern
Services abstract API calls and type definitions:
- [src/services/auth.service.ts](src/services/auth.service.ts) - login, logout, getUser
- [src/services/customer.service.ts](src/services/customer.service.ts) - customer/reengagement APIs
- Always export TypeScript interfaces alongside service methods

### Routing Structure
```
/login              → Public (GuestRoute redirects authenticated users)
/                   → Dashboard (ProtectedApp wrapper)
/ranking            → Leaderboard/gamification
/clientes           → Customer list
/clientes/:id       → Customer detail with orders/interactions
/meus-atendimentos  → Current user's assigned customers
/equipe             → Team management (Gerente/Supervisor only)
/notificacoes       → Sale notifications
```

## Code Conventions

### Component Organization
- **Pages**: [src/pages/](src/pages/) - route-level components
- **Components**: [src/components/](src/components/) - reusable UI (organized by feature/ui)
- **Layouts**: [src/layouts/](src/layouts/) - page wrappers (AppLayout with sidebar)
- **UI Components**: [src/components/ui/](src/components/ui/) - shadcn/ui primitives

### Styling Utilities
- Always use `cn()` from [src/lib/utils.ts](src/lib/utils.ts) for conditional classes
- Example: `cn('base-class', condition && 'conditional-class', className)`
- Tailwind config includes animations via `tailwindcss-animate`

### Data Safety Patterns
⚠️ **Critical**: Always handle undefined/null values from API responses
- Example from [src/lib/client-utils.ts](src/lib/client-utils.ts):
  ```ts
  export function formatCurrency(value: string | number | null | undefined): string {
    if (value === null || value === undefined) return 'R$ 0,00';
    const num = typeof value === 'string' ? parseFloat(value) : value;
    if (isNaN(num)) return 'R$ 0,00';
    return num.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }
  ```
- Use optional chaining: `order.value || 0`, `user?.attendants?.type`

### Custom Hooks
- `useAuth()` - access auth state (user, token, attendant, userType, loginFunction, logoutFunction)
- `useTheme()` - theme toggle (theme, toggleTheme)
- `useCountUp()` - animated number counters
- `useDebounce()` - debounced search inputs
- `use-mobile()` - responsive breakpoint detection

### Environment Variables
- Use `import.meta.env.VITE_*` for env vars (Vite convention)
- API URL configured via `VITE_API_URL` in `.env` file

## Development Workflows

### Starting Development
```bash
npm run dev          # Start Vite dev server (HMR enabled)
npm run build        # TypeScript check + production build
npm run lint         # ESLint validation
```

### Adding New Routes
1. Create page component in `src/pages/[Feature]/`
2. Add route in [src/App.tsx](src/App.tsx) within `<ProtectedApp>` or as public route
3. If restricted by role, wrap with `<RoleGuard route="/path">`
4. Add navigation item to [src/config/navItems.ts](src/config/navItems.ts) (optional)

### Adding shadcn/ui Components
Components already configured in [components.json](components.json). New components go in [src/components/ui/](src/components/ui/).

### API Integration
1. Define TypeScript interfaces in service file (e.g., `export interface Customer {...}`)
2. Create service methods using `api` instance from [src/services/api.ts](src/services/api.ts)
3. Handle errors - 401 automatically handled, catch other errors explicitly
4. Use TanStack Query for caching/loading states when needed

## Common Pitfalls
- **Don't** call API directly without `api` axios instance (token injection required)
- **Don't** access `user.attendants.type` without optional chaining
- **Don't** forget null/undefined checks for numeric values before formatting
- **Don't** hardcode role checks - use `canAccessRoute()` or `hasMinimumLevel()`
- **Don't** store sensitive data in localStorage beyond token/user (already implemented)

## Testing Guidance
- Mock data available in [src/data/mock.ts](src/data/mock.ts) for development
- Auth requires valid token - use `authService.login()` with real credentials
- Test role-based access by checking `userType` values: 1 (Gerente), 2 (Supervisor), 3 (Atendente)
