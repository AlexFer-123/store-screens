# Sistema de Gestão de Produtos e Clientes

Uma aplicação Vue.js 3 moderna e responsiva para gerenciar produtos e clientes, desenvolvida com TypeScript, Pinia, Vue Router e shadcn/vue.

## 🚀 Tecnologias Utilizadas

- **Vue.js 3** - Framework JavaScript progressivo
- **TypeScript** - Tipagem estática com Options API
- **Pinia** - Gerenciamento de estado moderno para Vue
- **Vue Router** - Roteamento oficial do Vue.js
- **shadcn/vue** - Componentes de UI modernos e acessíveis
- **Tailwind CSS** - Framework CSS utilitário
- **Axios** - Cliente HTTP para consumo da API
- **Vite** - Build tool rápido e moderno

## 📋 Funcionalidades

### Gestão de Produtos
- ✅ Listagem de produtos com busca e paginação
- ✅ Cadastro de novos produtos
- ✅ Visualização detalhada de produtos
- ✅ Campos: nome, descrição, preço, categoria, estoque

### Gestão de Clientes
- ✅ Listagem de clientes com busca e paginação
- ✅ Cadastro de novos clientes
- ✅ Visualização detalhada de clientes
- ✅ Campos: nome, email, telefone, endereço

### Interface
- ✅ Design moderno e responsivo
- ✅ Navegação intuitiva
- ✅ Estados de loading e error
- ✅ Validação de formulários
- ✅ Feedback visual para ações do usuário

## 🌐 API Backend

A aplicação consome a API REST disponível em:
```
https://store-api-mle0.onrender.com/api
```

### Endpoints utilizados:
- `GET /api/produtos` - Listar produtos (com paginação e busca)
- `GET /api/produtos/:id` - Buscar produto por ID
- `POST /api/produtos` - Cadastrar produto
- `GET /api/clientes` - Listar clientes (com paginação e busca)
- `GET /api/clientes/:id` - Buscar cliente por ID
- `POST /api/clientes` - Cadastrar cliente

## 🛠️ Instalação e Execução

### Pré-requisitos
- Node.js 16+ 
- npm ou yarn

### Instalação
```bash
# Clone o repositório
git clone <url-do-repositorio>

# Entre no diretório
cd products-frontend-application

# Instale as dependências
npm install
```

### Execução em Desenvolvimento
```bash
npm run dev
```
A aplicação estará disponível em `http://localhost:5173`

### Build para Produção
```bash
npm run build
```

### Preview da Build
```bash
npm run preview
```

## 📁 Estrutura do Projeto

```
src/
├── components/          # Componentes reutilizáveis
│   └── ui/             # Componentes do shadcn/vue
├── stores/             # Stores do Pinia
│   ├── produtos.ts     # Gerenciamento de estado dos produtos
│   └── clientes.ts     # Gerenciamento de estado dos clientes
├── services/           # Serviços da API
│   └── api.ts          # Configuração e métodos da API
├── types/              # Definições de tipos TypeScript
│   └── index.ts        # Interfaces e tipos
├── views/              # Páginas da aplicação
│   ├── HomeView.vue
│   ├── ProdutosView.vue
│   ├── ProdutosCadastrarView.vue
│   ├── ProdutoDetalhesView.vue
│   ├── ClientesView.vue
│   ├── ClientesCadastrarView.vue
│   └── ClienteDetalhesView.vue
├── router/             # Configuração das rotas
└── assets/             # Recursos estáticos
```

## 🎨 Design System

A aplicação utiliza o shadcn/vue que fornece:
- Componentes acessíveis e semânticos
- Design consistente e moderno
- Temas personalizáveis
- Responsividade nativa
- Suporte a dark mode (configurável)

## 📱 Responsividade

A interface foi desenvolvida com foco em responsividade:
- ✅ Desktop (1024px+)
- ✅ Tablet (768px - 1023px)
- ✅ Mobile (até 767px)

## 🔧 Scripts Disponíveis

```bash
npm run dev          # Servidor de desenvolvimento
npm run build        # Build para produção
npm run preview      # Preview da build
npm run lint         # Verificação de código
npm run format       # Formatação de código
```

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 👨‍💻 Desenvolvedor

Desenvolvido com ❤️ usando Vue.js 3, TypeScript e shadcn/vue.