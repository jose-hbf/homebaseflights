# Production Checklist - HomebaseFlights

Last updated: January 2026

## ✅ Completado

### Security Headers
- [x] `X-DNS-Prefetch-Control`
- [x] `Strict-Transport-Security` (HSTS)
- [x] `X-Content-Type-Options`
- [x] `X-Frame-Options`
- [x] `X-XSS-Protection`
- [x] `Referrer-Policy`
- [x] `Permissions-Policy`

**Archivo:** `next.config.js`

---

### SEO
- [x] `robots.txt` → `/public/robots.txt`
- [x] `sitemap.xml` → `/src/app/sitemap.ts` (dinámico)
- [x] Meta tags (title, description, OG) → `layout.tsx` + páginas
- [x] Schema.org JSON-LD → Páginas de ciudad

---

### Validación de Forms
- [x] Zod schemas → `/src/lib/validations.ts`
- [x] Validación server-side en API routes
- [x] Validación client-side en checkout
- [x] Mensajes de error claros

**Paquete:** `zod`

---

### Error Boundaries
- [x] Error page global → `/src/app/error.tsx`
- [x] Global error (layout) → `/src/app/global-error.tsx`
- [x] 404 page → `/src/app/not-found.tsx`

---

### Email Service (Resend)
- [x] Cliente configurado → `/src/lib/resend.ts`
- [x] Welcome email template → `/src/emails/WelcomeEmail.tsx`
- [x] API route → `/src/app/api/send-welcome-email/route.ts`
- [x] Integrado en checkout

**Paquete:** `resend`

**Para activar:** Añadir `RESEND_API_KEY` en `.env.local`

---

### Base de Datos (Supabase)
- [x] Cliente configurado → `/src/lib/supabase.ts`
- [x] Schema SQL → `/supabase/schema.sql`
- [x] API route subscribers → `/src/app/api/subscribers/route.ts`
- [x] Integrado en checkout

**Paquete:** `@supabase/supabase-js`

**Para activar:**
1. Crear proyecto en Supabase
2. Ejecutar `schema.sql` en SQL Editor
3. Añadir variables en `.env.local`:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

---

### Accessibility
- [x] Skip to main content link → `layout.tsx`
- [x] `id="main-content"` on all pages
- [x] ARIA attributes in AirportSelector (combobox pattern)
- [x] Focus-visible states in Button component
- [x] Proper heading hierarchy
- [x] Alt text for images

---

### Performance
- [x] `next/image` for optimized images
- [x] Remote patterns configured in `next.config.js`
- [x] Google fonts with `display: swap`
- [x] Minimal client-side JS (most components are server-rendered)

---

### Legal Pages
- [x] Privacy Policy → `/privacy`
- [x] Terms of Service → `/terms`

---

## ❌ Pendiente

### Stripe Payments
- [ ] Instalar `stripe` y `@stripe/stripe-js`
- [ ] Crear API route `/api/create-checkout-session`
- [ ] Crear webhook `/api/webhooks/stripe`
- [ ] Integrar en checkout page
- [ ] Configurar productos en Stripe Dashboard

**Variables necesarias:**
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`

---

### Analytics
- [ ] Google Analytics (GA4) o alternativa
- [ ] Event tracking (signups, conversions)
- [ ] Pageview tracking

---

### CI/CD
- [ ] GitHub Actions para build/test
- [ ] Deploy automático a Vercel
- [ ] Tests automatizados

---

### Testing
- [ ] Jest o Vitest setup
- [ ] Tests unitarios
- [ ] Tests de integración
- [ ] E2E tests (Playwright/Cypress)

---

## Variables de Entorno Requeridas

```env
# Resend (email)
RESEND_API_KEY=re_xxxxxxxxxxxx

# Supabase (database)
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxxx

# Stripe (payments) - PENDIENTE
STRIPE_SECRET_KEY=sk_xxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxx
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_xxxx

# Site
NEXT_PUBLIC_BASE_URL=https://homebaseflights.com
```

Ver `.env.example` para referencia.

---

## Comandos Útiles

```bash
# Desarrollo
npm run dev

# Build producción
npm run build

# Actualizar deals
npm run update-deals

# Lint
npm run lint
```

---

## Estructura de API Routes

```
/api
├── send-welcome-email/route.ts   ✅ Enviar email de bienvenida
├── subscribers/route.ts          ✅ CRUD de suscriptores
├── create-checkout-session/      ❌ Pendiente (Stripe)
└── webhooks/
    └── stripe/                   ❌ Pendiente (Stripe webhooks)
```

---

## Pre-Launch Checklist

- [ ] Configurar dominio en Vercel
- [ ] Configurar variables de entorno en Vercel
- [ ] Verificar dominio en Resend
- [ ] Crear productos en Stripe
- [ ] Configurar webhook de Stripe
- [ ] Ejecutar schema en Supabase producción
- [ ] Test completo del flujo de checkout
- [ ] Test de emails
- [ ] Verificar sitemap en Google Search Console
