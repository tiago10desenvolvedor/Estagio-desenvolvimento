# 🍽️ Home Chef – API + App Mobile
Cardapio digital com API REST, desenvolvido em Node.js e o aplicativo mobile feito em React Native + Expo
  Tecnologias Utilizadas:
 Backend (API)
Node.js
Express
LowDB (banco de dados em JSON)
JWT (autenticação)
UUID (IDs únicos)
Dotenv

Mobile (App)
React Native com Expo
React Navigation
AsyncStorage
TypeScript

Como rodar o projeto localmente

Pré-requisitos

Node.js instalado (versão 18 ou superior recomendada)
*NPM ou Yarn
Expo CLI instalado globalmente:  
  *npm install -g expo-cli

Rodando a API (Backend)
npm install
Crie o arquivo .env
PORT=3000
JWT_SECRET=sua_chave_secreta
inicie a API
  * npm start

A API estará disponível em: http://localhost:3000

-Rodando o App Mobile
  * npm install

    export const API_URL = 'http://192.168.0.X:3000'; = Substitua pelo IP da sua máquina
Exemplos de IP:
Ambiente	URL:
Android (emulador)	http://10.0.2.2:3000
iOS (emulador)	http://localhost:3000
Dispositivo real	http://192.168.X.X:3000

Imiciar app
 * npm start
