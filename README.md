# Desordem Paranormal

Projeto feito para estudo, com o objetivo de visualizar como a história de [Ordem Paranormal](https://ordemparanormal.fandom.com/wiki/Ordem_Paranormal_Wiki) se conecta.

## Funcionalidades

- [Grafo](https://www.google.com/search?q=grafo&sca_esv=8c6b6505ed11823e&sxsrf=AE3TifN36-Z_oc0eycuPFnvk4iWCmtuRFQ%3A1766004876607&ei=jBhDaezjJOHE1sQPuZzLkQM&ved=0ahUKEwjs2d3qwMWRAxVhopUCHTnOMjIQ4dUDCBE&uact=5&oq=grafo&gs_lp=Egxnd3Mtd2l6LXNlcnAiBWdyYWZvMggQABiABBixAzIIEAAYgAQYsQMyCBAAGIAEGLEDMgUQABiABDIFEAAYgAQyChAAGIAEGEMYigUyBRAAGIAEMgUQABiABDIFEAAYgAQyBRAAGIAESNUPUABYjwtwAXgBkAEAmAGqAaABqgWqAQMwLjW4AQPIAQD4AQGYAgagAsUFqAIUwgIHECMYJxjqAsICChAjGPAFGCcY6gLCAhYQABiABBhDGLQCGOcGGIoFGOoC2AEBwgIKECMYgAQYJxiKBcICChAuGIAEGCcYigXCAhEQLhiABBixAxjRAxiDARjHAcICCxAAGIAEGLEDGIMBwgIKEC4YgAQYQxiKBcICDhAAGIAEGLEDGIMBGIoFwgILEC4YgAQYsQMYgwHCAggQLhiABBixA8ICCxAAGIAEGJIDGIoFwgIFEC4YgATCAg0QABiABBixAxhDGIoFwgIIEAAYgAQYyQOYAwfxBdDGZhV-BCuSugYGCAEQARgBkgcDMS41oAfiR7IHAzAuNbgHvgXCBwUwLjIuNMgHFoAIAA&sclient=gws-wiz-serp) interativo que representa a conexão entre as páginas da wiki;
- [Pesquisa por algoritimo deterministico](https://www.google.com/search?q=pesquisa+semantica&oq=Pesquisa+seman&gs_lcrp=EgRlZGdlKgoIABAAGIAEGPkHMgoIABAAGIAEGPkHMgcIARAAGIAEMgYIAhBFGDkyBwgDEAAYgAQyCAgEEAAYFhgeMggIBRAAGBYYHjIICAYQABgWGB4yCAgHEAAYFhgeMgYICBBFGDzSAQg2NDQxajBqMagCALACAQ&sourceid=chrome&ie=UTF-8);
- Filtragem de páginas por categoria;

## Tecnologias Utilizadas

### Backend

| Tecnologia                                                         | Categoria                              |
| ------------------------------------------------------------------ | -------------------------------------- |
| Typescript                                                         | Linguagem Principal                    |
| Express                                                            | Framework Backend                      |
| Drizzle                                                            | ORM                                    |
| Node.js                                                            | Ambiente de execução javascript        |
| Postgress / Supabase                                               | Banco de dados                         |
| Axios                                                              | Requisições HTTP                       |
| Cherrio                                                            | Tratamento de dados                    |
| [Wikijs](https://dijs.github.io/wiki/)                             | Buscar dados da Wiki do projeto        |
| [String Similarity](https://github.com/aceakash/string-similarity) | faz a busca por similaridade de string |

### Frontend

| Tecnologia | Categoria                   |
| ---------- | --------------------------- |
| Typescript | Linguagem principal         |
| React      | Biblioteca Javascript       |
| Typescript | Linguagem principal         |
| D3.js      | Simula física no javascript |

---

## Documentação do código

### Backend

#### Rotas

```
backend\src\routes\routes.ts
```

| Método | Endpoint          | Descrição                                                                        |
| ------ | ----------------- | -------------------------------------------------------------------------------- |
| Get    | /pages?           | Retorna todas as Páginas                                                         |
| Get    | /pages?name="pag" | Retorna somente a/as página(s) mais parecida(s) com o que foi colocado no "name" |
| Post   | /connections      | Retorna as conexões                                                              |

#### Controller

```
backend\src\controller\get-wiki-controller.ts
```

| Função         | objetivo                                                               |
| -------------- | ---------------------------------------------------------------------- |
| getPages       | envia para a service a pesquisa dessa rota ou retorna todas as páginas |
| getConnections | busca as conexões da service e retorna elas para a rota                |

#### Wiki Service

```
backend\src\services\wiki-service.ts
```

##### getPages

- busca as páginas
- manda para o [FormatPages](#formatpage)
- guarda essas páginas em um array
- coloca essas páginas no banco
- retorna o array de páginas formatadas
- retorna no console o progresso do processamento das páginas

##### formatPage

- formata as páginas na interface Page

##### updatePageConnections

- busca as conexões de cada uma das páginas
- evita a duplicidade de conexões
- retorna no console o progresso do processamento de conexões

##### getWikiPages

- recebe o pedido da rota
- busca as páginas no repositório
- retorna para a rota

##### getWikiConnections

- recebe o pedido da rota
- busca as conexões no repositório
- retorna para a rota

##### getFilteredPages

- recebe o pedido da rota
- busca a/as página(s) mais parecidas com a pesquisa que veio na rota
- retorna para a rota

#### WikiDataManipulationService

```
backend\src\services\wiki-data-manipulation-service.ts
```

##### getPages

- busca o nome de todas páginas na [API](#wikiop);
- remove os nomes repetidos ou nomes diferentes que referenciam a mesma página
- retorna um array de chave e valor com o nome e link de cada página.

##### getPageLinks

- busca todos os links do html de uma pag
- transforma em elemento de chave e valor com o nome e o link para remover possíveis conexões duplicadas
- retorna um array com as conexões de chave e valor de cada pag

#### WikiOP

| função      | objetivo                                                                |
| ----------- | ----------------------------------------------------------------------- |
| pageNames   | retorna o nome de todas as pags da wiki                                 |
| getPage     | retorna as informações de uma pag específica                            |
| getWikiText | busca o conteúdo puro de uma pag, em wikitext que é um tipo de markdown |
