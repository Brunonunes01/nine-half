# Resumo TCC - Nine Half

## 1. O que e o Nine Half
Aplicativo mobile para organizar e compartilhar estoque de sneakers entre lojistas, revendedores e colecionadores.

## 2. Problema que resolve
Substitui um processo informal e descentralizado (redes sociais e mensagens) por uma plataforma com dados estruturados, status de produto e regras de acesso.

## 3. Perfis de usuario
- Admin (futuro uso ampliado)
- Lojista
- Usuario comum

## 4. Funcionalidades principais
- Cadastro/login/perfil
- Vitrine publica/privada
- Cadastro e edicao de produtos
- Upload de imagem no Firebase Storage
- Estoque global com busca, filtros e paginacao
- Reserva, cancelamento e finalizacao de compra com transacoes atomicas
- Historico em reservas e transacoes

## 5. Tecnologias utilizadas
- React Native + Expo
- TypeScript
- Firebase Auth
- Firestore
- Firebase Storage
- React Navigation
- Expo Image Picker

## 6. Arquitetura
Padrao em camadas:
`Screen -> Hook -> Service -> Firebase`

Isso separa UI, estado de tela e regra de negocio, facilitando manutencao e expansao.

## 7. Banco de dados (Firestore)
Colecoes principais:
- users
- showcases
- products
- reservations
- transactions

Foi adotada denormalizacao leve em reservas/transacoes para reduzir leituras.

## 8. Seguranca
- Regras Firestore por ownership e contexto de negociacao
- Regras Storage por pasta do usuario
- Validacoes de status e permissao no cliente e nas rules
- Fluxos criticos com `runTransaction`

## 9. Limitacoes atuais
- Sem pagamento real
- Sem chat
- Sem notificacoes push
- Sem painel admin avancado
- Sem busca full-text externa

## 10. Melhorias futuras
- Filtros avancados e UX refinada
- Telemetria e observabilidade
- Hardening adicional de regras
- Material de apresentacao e demonstracao final

