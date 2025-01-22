# Quiz App em React Native

Este projeto é um aplicativo de Quiz desenvolvido com **React Native**. O aplicativo permite que os usuários:

- Criem e editem quizzes personalizados.
- Respondam quizzes e acompanhem seus resultados.
- Visualizem um histórico completo de resultados de quizzes realizados.

## Funcionalidades Principais

1. **Criação de Quizzes**
   - Os usuários podem criar quizzes com perguntas personalizadas e múltiplas opções de resposta.
   - As perguntas podem ter até quatro opções e uma resposta correta.

2. **Execução de Quizzes**
   - Permite responder quizzes criados com acompanhamento de tempo.
   - Apresenta estatísticas ao final, como pontuação e tempo total.

3. **Histórico de Resultados**
   - Tela dedicada para exibir todos os resultados dos quizzes já realizados.
   - Possibilidade de atualizar a lista de resultados com gesto de "pull to refresh".

4. **Gerenciamento de Quizzes**
   - Listagem de quizzes com opções de editar, deletar e iniciar.
   - Atualização da lista de quizzes em tempo real.

## Tecnologias Utilizadas

- **React Native**: Framework principal.
- **TypeScript**: Linguagem para tipagem estática.
- **SQLite**: Banco de dados local para armazenar quizzes, perguntas e resultados.
- **React Navigation**: Navegação entre telas do aplicativo.

## Estrutura do Projeto

```
quiz-app
├── android/        # Configuração e código nativo Android.
├── ios/            # Configuração e código nativo iOS.
├── src/
│   ├── screens/    # Telas principais do aplicativo.
│   │   ├── CreateQuizScreen.tsx
│   │   ├── EditQuizScreen.tsx
│   │   ├── ListQuizzesScreen.tsx
│   │   ├── StartQuizScreen.tsx
│   │   └── ResultsHistoryScreen.tsx
│   ├── App.tsx     # Componente principal.
├── package.json    # Dependências e scripts do projeto.
└── README.md       # Documentação do projeto.
```

## Instalação e Configuração

1. Clone o repositório:
   ```bash
   git clone https://github.com/FelipeGermano/quiz.git
   cd quiz-app
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

3. Execute o aplicativo no ambiente de desenvolvimento:
   - Android:
     ```bash
     npx react-native run-android
     ```
   - iOS:
     ```bash
     npx react-native run-ios
     ```

4. Certifique-se de que o ambiente de desenvolvimento está configurado corretamente:
   ```bash
   npx react-native doctor
   ```

## Como Usar

1. **Listar Quizzes**:
   - Acesse a tela inicial para visualizar todos os quizzes criados.

2. **Criar ou Editar Quizzes**:
   - Utilize os botões disponíveis para adicionar ou editar quizzes.

3. **Executar Quizzes**:
   - Inicie qualquer quiz disponível na lista e responda às perguntas.

4. **Histórico de Resultados**:
   - Acesse a tela "Histórico de Resultados" para ver todas as tentativas realizadas.

## Contribuindo

Sinta-se à vontade para abrir issues e enviar pull requests para melhorias.

1. Fork o repositório.
2. Crie sua branch de feature:
   ```bash
   git checkout -b minha-feature
   ```
3. Commit suas alterações:
   ```bash
   git commit -m 'Adicionei uma nova feature'
   ```
4. Envie para o branch principal:
   ```bash
   git push origin minha-feature
   ```
5. Abra um Pull Request.

![quiz](https://github.com/FelipeGermano/quiz/blob/main/src/assets/quiz.gif)
