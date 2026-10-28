# IEmergency

Web app (mobile-first) para registrar denúncias — incêndio, violência doméstica, assalto,
acidente de trânsito etc. — e acessar números de emergência.

**Stack:** Vue 3 (Composition API) · Pinia · Vue Router · vee-validate + yup · Supabase (Auth + Postgres com RLS) · Vite · Vercel

## Funcionalidades

- Cadastro e login com Supabase Auth; o estado de login vem da sessão do Supabase e as rotas privadas têm guard no router.
- Nova denúncia com preenchimento de endereço pelo CEP (ViaCEP) e até 3 imagens.
- Lista e detalhe das denúncias do usuário (cada usuário só vê as próprias, via RLS — ver `supabase/rls-policies.sql`).
- Tela de emergência com mapa (Google Maps) e lista de números úteis. O envio do "Chamar Ajuda" é uma **simulação**.

## Rodando localmente

Crie um `.env.local` com:

```
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
VITE_GOOGLE_MAPS_KEY=...
```

```sh
npm install
npm run dev
```

O workflow `.github/workflows/keep-supabase-alive.yml` faz uma leitura no banco 4x por dia para o projeto Supabase (plano Free) não ser pausado.

## Próximos passos

- Guardar as imagens no Supabase Storage em vez de base64 dentro da linha de `Reports`.
- Criar o perfil em `Users` por um trigger em `auth.users` (necessário se a confirmação de email for ligada).
- Envio real do pedido de ajuda.
- ESLint + Prettier.
