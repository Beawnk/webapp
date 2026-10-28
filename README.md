# IEmergency

Web app (mobile-first) para registrar denúncias — incêndio, violência doméstica, assalto,
acidente de trânsito etc. — e pedir ajuda em uma emergência.

**Stack:** Vue 3 (Composition API) · Pinia · Vue Router · vee-validate + yup · Supabase (Auth + Postgres com RLS + Storage) · Vite · Vercel

## Funcionalidades

- Cadastro e login com Supabase Auth; o estado de login vem da sessão do Supabase e as rotas privadas têm guard no router. Recuperação de senha por email.
- Nova denúncia com preenchimento de endereço pelo CEP (ViaCEP) e até 3 imagens, guardadas num bucket privado do Supabase Storage.
- Lista e detalhe das denúncias do usuário (cada usuário só vê as próprias, via RLS).
- Pedido de ajuda: registra localização (Google Maps), mensagem e serviços escolhidos, e mostra os botões para ligar para 190/192/193. O app **não aciona** os serviços sozinho — a ligação é o envio de verdade.

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

Outros scripts: `npm run lint` (ESLint) e `npm run format` (Prettier).

## Supabase

Os scripts em `supabase/` rodam no SQL Editor, **antes** de publicar o front-end que depende deles:

1. `rls-policies.sql` — RLS de `Users` e `Reports`.
2. `signup-profile-trigger.sql` — cria o perfil em `Users` no cadastro (o front não insere mais).
3. `report-images-storage.sql` — bucket privado `report-images` e as policies.
4. `emergencies.sql` — tabela dos pedidos de ajuda.

Em **Authentication → URL Configuration**, adicione `<url do site>/reset-password` (e `http://localhost:5173/reset-password` para desenvolvimento) em *Redirect URLs*, senão o link de recuperação de senha não volta para o app.

O workflow `.github/workflows/keep-supabase-alive.yml` faz uma leitura no banco 4x por dia para o projeto Supabase (plano Free) não ser pausado.

## Próximos passos

- Contatos de emergência do usuário (cadastro + compartilhar o pedido com eles).
- Histórico dos pedidos de ajuda na interface.
- Migrar as imagens antigas (base64 em `Reports.Images`) para o Storage.
- Testes automatizados.
