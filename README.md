# Nine Half

Plataforma mobile para gerenciamento e compartilhamento de estoque de sneakers.

## Problema resolvido
Centraliza um fluxo hoje informal (WhatsApp/Instagram) em um app com vitrine, estoque global, reserva e finalizacao de venda com controle de status.

## Tecnologias
- React Native + Expo
- TypeScript
- Firebase Auth
- Firestore
- Firebase Storage
- React Navigation
- Expo Image Picker

## Custo
Projeto preparado para plano gratuito (Spark) e bibliotecas open source.
Nao usa Cloud Functions, API paga, gateway de pagamento, servico externo de busca ou notificacao paga.

## Instalacao
```bash
npm install
```

## Configuracao `.env`
Use `.env.example` como base:
```env
EXPO_PUBLIC_FIREBASE_API_KEY=...
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=...
EXPO_PUBLIC_FIREBASE_PROJECT_ID=...
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=...
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
EXPO_PUBLIC_FIREBASE_APP_ID=...
```

## Rodar o app
```bash
npx expo start -c
```

## Publicar regras Firestore
1. Firebase Console -> Firestore Database -> Rules
2. Colar conteudo de `firestore.rules`
3. Publish

## Publicar regras Storage
1. Firebase Console -> Storage -> Rules
2. Colar conteudo de `storage.rules`
3. Publish

## Criar indices Firestore
Seguir o arquivo `FIRESTORE_INDEXES.md` e os links sugeridos pelo erro de indice no Console.

## Fluxos principais
1. Cadastro/login/logout
2. Criacao/edicao de vitrine
3. CRUD de produtos com imagem
4. Estoque global com busca, filtros e paginacao
5. Reserva e cancelamento com `runTransaction`
6. Finalizacao de compra com `runTransaction`
7. Historico em Minhas Reservas e Minhas Transacoes

## Arquitetura
`Screen -> Hook -> Service -> Firebase`

Telas nao acessam SDK Firebase diretamente; regras de negocio ficam em services e estado de UI em hooks.

