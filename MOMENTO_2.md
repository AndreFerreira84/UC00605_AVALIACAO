# Momento 2 - API REST com MySQL e mysql2 (8 valores)

## Contexto

Neste momento vais criar uma API REST para gerir um catalogo de filmes e series.

No Momento 1 os dados estavam em memoria. Agora os dados devem ficar guardados numa base de dados MySQL, usando o pacote `mysql2`.

Os testes devem ser feitos com **Postman**, **Thunder Client** ou **Bruno**.

Nao e necessario criar frontend.

**Duracao:** 3 horas

---

## Objetivo

Implementar o ficheiro `server.js` do zero.

O ficheiro `server.js` fornecido tem apenas comentarios com a lista de rotas obrigatorias. A implementacao do servidor, da ligacao ao MySQL, da validacao e das rotas fica a teu cargo.

---

## Ficheiros fornecidos

| Ficheiro | Para que serve |
|----------|----------------|
| `server.js` | Ficheiro de trabalho onde vais implementar o servidor |
| `database.sql` | Cria a base de dados, cria a tabela e insere dados iniciais |
| `.env.example` | Exemplo de configuracao da ligacao ao MySQL |
| `package.json` | Dependencias e scripts do projeto |

---

## Tecnologia obrigatoria

Deves usar:

- Node.js
- Express
- MySQL
- `mysql2/promise`
- `dotenv`
- Postman, Thunder Client ou Bruno para testar

Nao deves usar Prisma neste momento.

Nao deves usar frontend neste momento.

---

## Setup inicial

Instalar dependencias:

```bash
npm install
```

Criar o ficheiro `.env` a partir do exemplo:

```bash
cp .env.example .env
```

Se o teu MySQL tiver password, abrir o `.env` e preencher:

```txt
DATABASE_PASSWORD=A_TUA_PASSWORD
```

---

## Criar base de dados, tabela e dados iniciais

No MySQL Workbench:

1. Abrir o ficheiro `database.sql`
2. Selecionar todo o conteudo do ficheiro
3. Executar o script completo
4. Confirmar que foi criada a base de dados `catalogo_filmes`
5. Confirmar que foi criada a tabela `filmes`
6. Confirmar que a tabela tem dados

Podes confirmar com:

```sql
USE catalogo_filmes;
SELECT * FROM filmes;
```

O ficheiro `database.sql` faz tudo:

- cria a base de dados;
- seleciona a base de dados;
- apaga a tabela antiga, se existir;
- cria a tabela `filmes`;
- insere dados iniciais.

---

## Configuracao esperada no `.env`

```txt
PORT=3000
DATABASE_HOST=localhost
DATABASE_PORT=3306
DATABASE_USER=root
DATABASE_PASSWORD=
DATABASE_NAME=catalogo_filmes
```

Se a tua password do MySQL nao estiver vazia, deves preencher `DATABASE_PASSWORD`.

---

## O que tens de implementar no `server.js`

O servidor deve ter:

- importacao do `dotenv`;
- importacao do `express`;
- importacao do `mysql2/promise`;
- criacao da app Express;
- `app.use(express.json())`;
- configuracao da pool de ligacao ao MySQL;
- validacao dos dados recebidos no body;
- rotas REST obrigatorias;
- arranque do servidor com `app.listen`.

---

## Rotas obrigatorias

| Metodo | Rota | Descricao | Status esperado |
|--------|------|-----------|-----------------|
| `GET` | `/api/estado` | Testar se a API esta ativa | `200` |
| `GET` | `/api/filmes` | Listar todos os filmes/series | `200` |
| `GET` | `/api/filmes/:id` | Obter um filme/serie por ID | `200` ou `404` |
| `POST` | `/api/filmes` | Criar um filme/serie | `201` ou `400` |
| `PUT` | `/api/filmes/:id` | Atualizar um filme/serie completo | `200`, `400` ou `404` |
| `PATCH` | `/api/filmes/:id/visto` | Alternar o estado `visto` | `200` ou `404` |
| `DELETE` | `/api/filmes/:id` | Apagar um filme/serie | `204` ou `404` |

---

## Modelo de dados

Cada filme/serie tem os seguintes campos:

| Campo | Tipo | Obrigatorio | Regra |
|-------|------|-------------|-------|
| `id` | numero | Sim | Criado automaticamente pela BD |
| `titulo` | texto | Sim | Minimo 2 caracteres |
| `realizador` | texto | Sim | Nao pode estar vazio |
| `genero` | texto | Sim | Um dos generos validos |
| `ano` | numero | Sim | Entre 1900 e o ano atual |
| `tipo` | texto | Sim | `filme` ou `serie` |
| `avaliacao` | numero/null | Nao | Entre 1 e 5, se existir |
| `visto` | boolean | Nao | `true` ou `false` |

Generos validos:

```txt
acao, comedia, drama, terror, ficcao, documentario, animacao, outro
```

---

## Regras de validacao

No `POST` e no `PUT`, validar:

- `titulo` obrigatorio, com pelo menos 2 caracteres;
- `realizador` obrigatorio;
- `genero` obrigatorio e dentro da lista de generos validos;
- `ano` obrigatorio, numero entre 1900 e o ano atual;
- `tipo` obrigatorio, apenas `filme` ou `serie`;
- `avaliacao` opcional, mas se existir deve estar entre 1 e 5.

Se os dados forem invalidos, devolver:

```json
{
  "erro": "mensagem do erro"
}
```

Com status `400`.

---

## Regras dos endpoints

### GET `/api/estado`

Deve devolver uma resposta simples para confirmar que a API esta ativa.

Exemplo:

```json
{
  "mensagem": "API ativa"
}
```

### GET `/api/filmes`

Deve devolver todos os registos da tabela `filmes`.

### GET `/api/filmes/:id`

Deve:

1. Procurar o filme pelo `id`
2. Se existir, devolver o registo com status `200`
3. Se nao existir, devolver `404`

### POST `/api/filmes`

Deve:

1. Validar os dados recebidos no body
2. Se forem invalidos, devolver `400`
3. Inserir o novo registo na base de dados
4. Devolver o registo criado com status `201`

### PUT `/api/filmes/:id`

Deve:

1. Verificar se o filme existe na base de dados
2. Se nao existir, devolver `404`
3. Validar os dados recebidos no body
4. Se forem invalidos, devolver `400`
5. Atualizar o registo na base de dados
6. Devolver o filme atualizado com `200`

### PATCH `/api/filmes/:id/visto`

Deve:

1. Verificar se o filme existe na base de dados
2. Se nao existir, devolver `404`
3. Alternar o campo `visto`
4. Se estava `true`, passa a `false`
5. Se estava `false`, passa a `true`
6. Devolver o filme atualizado com `200`

Este endpoint nao precisa de body.

### DELETE `/api/filmes/:id`

Deve:

1. Verificar se o filme existe na base de dados
2. Se nao existir, devolver `404`
3. Apagar o registo
4. Devolver `204` sem body

---

## Exemplos de body para testar

### POST ou PUT valido

```json
{
  "titulo": "Interstellar",
  "realizador": "Christopher Nolan",
  "genero": "ficcao",
  "ano": 2014,
  "tipo": "filme",
  "avaliacao": 5
}
```

### POST ou PUT invalido

```json
{
  "titulo": "",
  "realizador": "",
  "genero": "romance",
  "ano": 1800,
  "tipo": "curta",
  "avaliacao": 10
}
```

---

## Testes obrigatorios no Postman

Deves testar:

| Teste | Metodo | URL |
|-------|--------|-----|
| Estado da API | `GET` | `http://localhost:3000/api/estado` |
| Listar filmes | `GET` | `http://localhost:3000/api/filmes` |
| Obter um filme | `GET` | `http://localhost:3000/api/filmes/1` |
| Obter ID inexistente | `GET` | `http://localhost:3000/api/filmes/9999` |
| Criar filme valido | `POST` | `http://localhost:3000/api/filmes` |
| Criar filme invalido | `POST` | `http://localhost:3000/api/filmes` |
| Atualizar filme valido | `PUT` | `http://localhost:3000/api/filmes/1` |
| Atualizar ID inexistente | `PUT` | `http://localhost:3000/api/filmes/9999` |
| Alternar visto | `PATCH` | `http://localhost:3000/api/filmes/1/visto` |
| Apagar filme | `DELETE` | `http://localhost:3000/api/filmes/1` |
| Apagar ID inexistente | `DELETE` | `http://localhost:3000/api/filmes/9999` |

No `POST` e no `PUT`, usar body em formato JSON e o header:

```txt
Content-Type: application/json
```

---

## Arrancar o servidor

Depois de implementares o `server.js`, correr:

```bash
npm start
```

Ou, durante o desenvolvimento:

```bash
npm run dev
```

---

## Criterios de avaliacao

| # | Criterio | Valores |
|---|----------|---------|
| 1 | Configuracao correta do Express, dotenv e mysql2 | 1 |
| 2 | Base de dados criada corretamente a partir do `database.sql` | 1 |
| 3 | `GET /api/estado`, `GET /api/filmes` e `GET /api/filmes/:id` funcionam | 1.5 |
| 4 | `POST /api/filmes` cria com validacao correta | 1.5 |
| 5 | `PUT /api/filmes/:id` atualiza com validacao correta | 1.5 |
| 6 | `PATCH /api/filmes/:id/visto` alterna corretamente o estado | 0.75 |
| 7 | `DELETE /api/filmes/:id` remove e devolve `204` | 0.75 |
| 8 | Tratamento correto de erros `400`, `404` e `500` | 0.75 |
| 9 | Testes feitos no Postman/Thunder Client/Bruno | 0.25 |
| | **Total** | **8** |

---

## Entrega

Entregar a pasta completa com:

- `server.js`
- `package.json`
- `package-lock.json`
- `.env.example`
- `database.sql`

Nao entregar:

- `node_modules`
- ficheiro `.env` com password pessoal
