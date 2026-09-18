# Adota Pet

Plataforma que conecta ONGs de proteção animal a adotantes, cobrindo todo o fluxo de adoção: cadastro de animais, solicitação, acompanhamento e conclusão da adoção.

A documentação visual do projeto (diagramas de casos de uso, classes e entidade-relacionamento) está publicada em:
**https://LuizCarnietto.github.io/AdotaPet/**

---

## 1. Funcionamento do sistema

O sistema tem três tipos de usuário:

- **ONG**: cadastra, edita e remove animais; cria e gerencia formulários de adoção; aprova ou recusa solicitações; lista adotantes; finaliza adoções concluídas.
- **Adotante**: cria conta, visualiza animais disponíveis, solicita adoção, acompanha o status do pedido e pode cancelar uma solicitação em andamento.
- **Administrador**: valida o cadastro de novas ONGs, modera usuários e denúncias, e supervisiona a plataforma.

Fluxo principal:

1. A ONG cadastra um animal (espécie, idade, porte, histórico de saúde, etc.), que fica com status `DISPONIVEL`.
2. O adotante visualiza os animais disponíveis e preenche um formulário de adoção para o animal escolhido.
3. A ONG responsável analisa o formulário e aprova ou recusa a solicitação.
4. Se aprovada, a adoção fica `APROVADA` e o animal muda para `EM_PROCESSO`; ao concluir, ambos passam para `CONCLUIDA` / `ADOTADO`.
5. O administrador acompanha o funcionamento geral, podendo validar ONGs, moderar usuários e remover animais denunciados.

---

## 2. Arquitetura e estrutura de pastas

```
AdotaPet/
├── AdotaPet-back-end/    # API Java + Spring Boot
├── AdotaPetFront-React-TS-Vite/   # Aplicação React + TypeScript (Vite)
├── docs/                  # Página estática do projeto (GitHub Pages) com os diagramas
└── README.md
```

- **Backend**: Java + Spring Boot, expõe a API REST na porta `8080`.
- **Frontend**: React + TypeScript, com Vite, rodando na porta `5173`.
- **Banco de dados**: MySQL. O schema (tabelas) é criado e atualizado automaticamente pelo Hibernate ao subir o backend.

---

## 3. Pré-requisitos

Antes de rodar o projeto, tenha instalado:

- Java JDK `26`
- Maven `3.9.14`
- Node.js `v24.15.0` e npm `11.12.1`
- MySQL `8.0.45`

---

## 4. Configurando o banco de dados

Não é necessário criar as tabelas manualmente — o backend usa Hibernate configurado para criar/atualizar o schema automaticamente ao rodar. Você só precisa criar o banco vazio:

```sql
CREATE DATABASE adotapet
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;
```

---

## 5. Configurando e executando o backend (Spring Boot)

1. Entre na pasta do backend:
   ```bash
   cd AdotaPet-back-end
   ```

2. Configure o acesso ao banco em `src/main/resources/application.yaml`:
```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/adotapet
    username: root
    password: sua_senha_aquiD
  jpa:
    hibernate:
      ddl-auto: update
```

3. Execute a aplicação. Você pode rodar de duas formas:

   **Pela IDE:** abra o arquivo `AdotaPet-back-end/src/main/java/com/extensao/adotapet/AdotapetApplication.java` e clique em "Run" no seu compilador.

   **Pelo terminal:**
```bash
   cd AdotaPet-back-end
   mvn spring-boot:run
```

4. A API estará disponível em `http://localhost:8080`.

---

## 6. Configurando e executando o frontend (React + Vite)

1. Entre na pasta do frontend:
   ```bash
   cd AdotaPetFront-React-TS-Vite
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

3. Execute o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```

4. A aplicação estará disponível em `http://localhost:5173`.

---

## 7. Diagramas do projeto

Os diagramas completos (casos de uso, classes e entidade-relacionamento) estão disponíveis na página do projeto:
**https://LuizCarnietto.github.io/AdotaPet/**

---

## 8. Tecnologias utilizadas

- **Backend**: Java, Spring Boot
- **Frontend**: React, TypeScript, Vite
- **Banco de dados**: MySQL

---

## 9. Autores

- Bruno Broietti Serenato
- Luiz Carnietto
- Luis Filipe Anklan
