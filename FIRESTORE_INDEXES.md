# Firestore Indexes - Nine Half

As consultas do Estoque Global usam filtros e ordenação com paginação. No Firebase Console, crie os índices compostos abaixo conforme necessário (o próprio erro do Firestore também fornece link direto para criação):

## Coleção `products`

1. `status` (ASC), `showcaseVisible` (ASC), `createdAt` (DESC)
- Uso: listagem padrão "mais recentes".

2. `status` (ASC), `showcaseVisible` (ASC), `precoNumber` (ASC)
- Uso: ordenação por menor preço.

3. `status` (ASC), `showcaseVisible` (ASC), `precoNumber` (DESC)
- Uso: ordenação por maior preço.

4. `status` (ASC), `showcaseVisible` (ASC), `origem` (ASC), `createdAt` (DESC)
- Uso: filtro de origem + recentes.

5. `status` (ASC), `showcaseVisible` (ASC), `numeracao` (ASC), `createdAt` (DESC)
- Uso: filtro de numeração + recentes.

6. `status` (ASC), `showcaseVisible` (ASC), `marcaLower` (ASC), `createdAt` (DESC)
- Uso: filtro de marca + recentes.

7. `status` (ASC), `showcaseVisible` (ASC), `searchKeywords` (ARRAY), `createdAt` (DESC)
- Uso: busca por palavra-chave + recentes.

8. `status` (ASC), `showcaseVisible` (ASC), `searchKeywords` (ARRAY), `precoNumber` (ASC)
- Uso: busca + menor preço.

9. `status` (ASC), `showcaseVisible` (ASC), `searchKeywords` (ARRAY), `precoNumber` (DESC)
- Uso: busca + maior preço.

10. `status` (ASC), `showcaseVisible` (ASC), `marcaLower` (ASC), `origem` (ASC), `createdAt` (DESC)
- Uso: marca + origem + recentes.

11. `status` (ASC), `showcaseVisible` (ASC), `marcaLower` (ASC), `numeracao` (ASC), `createdAt` (DESC)
- Uso: marca + numeracao + recentes.

12. `status` (ASC), `showcaseVisible` (ASC), `searchKeywords` (ARRAY), `origem` (ASC), `precoNumber` (ASC)
- Uso: busca + origem + faixa de preço/menor preço.

## Observações
- Combinações com `minPrice/maxPrice` usam `precoNumber` com operadores de faixa e podem exigir índices adicionais conforme combinação de filtros.
- Ao combinar vários filtros de igualdade (`marcaLower`, `numeracao`, `origem`) com busca e ordenação, o Firestore pode pedir índice composto específico. Use o link de criação automática do erro para gerar o índice exato necessário.
- Para reduzir custo no plano gratuito, mantenha `limit()` em todas as consultas e paginação por cursor (`startAfter`).
