# BonsLivros - Sistema de Gerenciamento de Livros

Um sistema web desenvolvido em Angular para gerenciamento de livros, onde autores podem cadastrar, editar e gerenciar seus próprios livros em uma plataforma intuitiva e moderna.

## 📚 Sobre o Projeto

O BonsLivros é uma aplicação front-end que permite aos autores:
- Criar uma conta e fazer login
- Adicionar novos livros à sua biblioteca pessoal
- Editar informações dos livros já cadastrados
- Visualizar todos os livros em uma tabela organizada
- Excluir livros quando necessário

## 🚀 Tecnologias Utilizadas

- **Angular 19.2.0** - Framework principal
- **Angular Material** - Componentes de UI
- **TypeScript 5.7.2** - Linguagem de programação
- **RxJS** - Programação reativa
- **Angular SSR** - Server-Side Rendering
- **Express.js** - Servidor para SSR

## 📋 Funcionalidades

### Autenticação
- **Cadastro de Usuário**: Registro com nome, email, senha e CPF
- **Login**: Autenticação usando email e senha
- **Logout**: Encerramento seguro da sessão

### Gerenciamento de Livros
- **Listagem**: Visualização de todos os livros em tabela com Angular Material
- **Adicionar**: Formulário para cadastro de novos livros
- **Editar**: Modificação inline dos dados do livro
- **Excluir**: Remoção com confirmação
- **Validação**: Formulários com validação em tempo real

### Interface
- **Design Responsivo**: Adaptável para diferentes tamanhos de tela
- **Material Design**: Interface moderna usando Angular Material
- **Feedback Visual**: Mensagens de sucesso, erro e carregamento
- **Navegação Intuitiva**: Roteamento entre páginas

## 🏗️ Estrutura do Projeto

```
src/
├── app/
│   ├── components/
│   │   └── pages/
│   │       ├── login/          # Página de login
│   │       ├── register/       # Página de cadastro
│   │       └── listarLivros/   # Página principal (CRUD de livros)
│   ├── services/
│   │   └── api.service.ts      # Serviço para comunicação com backend
│   ├── app.routes.ts           # Configuração de rotas
│   └── app.config.ts           # Configuração da aplicação
├── styles.css                  # Estilos globais
└── index.html                  # Página principal
```

## 🔧 Configuração e Instalação

### Pré-requisitos
- Node.js (versão 18 ou superior)
- npm ou yarn
- Angular CLI 19.2.12

### Instalação

1. **Clone o repositório**
```bash
git clone [url-do-repositorio]
cd bonslivros-front
```

2. **Instale as dependências**
```bash
npm install
```

3. **Configure o backend**
   - Certifique-se de que o backend esteja rodando em `http://localhost:8080`
   - O serviço API está configurado para se comunicar com o endpoint `/livraria`

### Executando o Projeto

**Servidor de desenvolvimento:**
```bash
ng serve
```
Acesse `http://localhost:4200/`

**Build para produção:**
```bash
ng build
```

**Executar testes:**
```bash
ng test
```

**Servidor SSR:**
```bash
npm run serve:ssr:front
```

## 🔌 API Integration

O projeto se comunica com um backend REST através do [`ApiService`](src/app/services/api.service.ts) que gerencia:

- **Autenticação**: POST `/autor` (registro) e `/login`
- **Livros**: GET, POST, PUT, DELETE em `/livraria`
- **Tratamento de Erros**: Interceptação e formatação de erros HTTP
- **Estado da Sessão**: Controle de login sem tokens (baseado em estado local)

### Endpoints utilizados:
- `POST /livraria/autor` - Cadastro de usuário
- `POST /livraria/login` - Login
- `GET /livraria` - Listar livros
- `POST /livraria` - Adicionar livro
- `PUT /livraria/{id}` - Atualizar livro
- `DELETE /livraria/{id}` - Excluir livro

## 📱 Páginas e Componentes

### 1. Login ([`login.components.ts`](src/app/components/pages/login/login.components.ts))
- Formulário de autenticação
- Validação de email e senha
- Redirecionamento após login bem-sucedido

### 2. Cadastro ([`register.component.ts`](src/app/components/pages/register/register.component.ts))
- Registro de novos usuários
- Validação de CPF (11 dígitos)
- Validação de email e senha

### 3. Gerenciamento de Livros ([`listarLivros.component.ts`](src/app/components/pages/listarLivros/listarLivros.component.ts))
- Tabela de livros com Angular Material
- Formulários de adição e edição
- Operações CRUD completas
- Interface responsiva com sidebar

## 🎨 Estilização

- **Material Theme**: Magenta-violet theme do Angular Material
- **Fontes**: Roboto e Inter para uma aparência moderna
- **Cores**: Paleta neutra com acentos em azul e verde
- **Responsividade**: Layout adaptável usando CSS Grid e Flexbox

## 🔐 Segurança

- Validação de formulários no frontend
- Sanitização de dados de entrada
- Controle de acesso baseado em estado de login
- Redirecionamento automático para login quando não autenticado

## 🚀 Scripts Disponíveis

```json
{
  "start": "ng serve",
  "build": "ng build",
  "test": "ng test",
  "serve:ssr:front": "node dist/front/server/server.mjs"
}
```

## 📄 Licença

Este projeto é privado e destinado para fins educacionais/demonstrativos.

## 👥 Contribuindo

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -am 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

## 📞 Suporte

Para dúvidas ou problemas, abra uma issue no repositório.

---

**Desenvolvido com ❤️ usando Angular e Angular Material**