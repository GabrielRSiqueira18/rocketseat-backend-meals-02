# Aplicação Backed Nodejs Meals

## RF
- [x] Deve ser possível registrar um usuário <br>
- [x] Deve ser possível o usuárioo logar <br>
- [x] Deve ser possível criar uma refeição <br>
- [x] Deve ser possível editar uma refeição <br>
- [x] Deve ser possível excluir uma refeição <br>

## RN
- [x] Refeições só podem ser criadas/editadas/excluidas apenas pelos usuários logados
- [x] Deve ser possível indentificar o usuário entre as requisições

## Detalhes da aplicação

# Bibliotecas usadas: <br>
Fastify: micro-framework para melhorar a criar um servidor http e usar requisões como um todo. <br>
Knex: queryBuilder para usar banco de dados como mais facilidades <br>
zod: validar dados da aplicação <br>

# Cookie 
Foi usado cookie para ter acesso ao usuário entre as requições, uando a biblioteca do próprio fastify @fastify/cookie, para usar esta ferramente.

# Teste
Foi usado apenas teste de e2e (end-to-end), que consiste em testar a aplicação como um todo, como testes que verifica quando o usuário irá registrar colocando passo a passo de que como o usuário irá relizar o login. <br>
Fazendo iso em todos os casos, registro do usuário, login, criar refeição, editar refeição, e excluir refeição.

#Rodar aplicação
npm install -> Instalar todas as dependencias da aplicação <br>
npm run dev -> Inicar o servidor <br>
npm run knex -- (comandos do próprio knex, [clique aqui para ir no site](https://knexjs.org/) -> Comando que irá manusear o banco de dados da aplicação (sqlite) <br>
npm run test -> Para testar todos os testes realizados para visualizar se todas as rotas estão funcionando 
