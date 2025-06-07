## Sobre o Projeto

Este é um sistema de gerenciamento de *domains* desenvolvido com Next.js no front-end e Laravel 12 (PHP 8.4) no back-end. A aplicação permite a criação, edição e exclusão de registros por meio de uma interface web moderna, com integração completa via rotas de API.

## Funcionalidades

- Criar um novo domínio  
- Editar domínios existentes  
- Excluir domínios  
- Autenticação (em desenvolvimento)  

## Como Usar

1. Clone o repositório  
2. Suba os containers com Docker Compose:  
   bash
   docker-compose up --build
3. Instale as dependências com: npm install
4. Inicie o servidor com: npm run dev
5. Acesse http://localhost:3000/login

Testando a API
A collection do Postman para teste da API está disponível na pasta raiz do projeto chamada testeApi.

Para usar a collection:
1. Abra o Postman
2. Importe o arquivo JSON presente na pasta testeApi
3. Utilize os endpoints para testar as operações de criação, edição, exclusão e listagem de domains via API (http://localhost:8000/api/domains)


