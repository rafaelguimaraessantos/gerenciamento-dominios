# Use a imagem oficial do Node.js
FROM node:20

# Cria diretório de trabalho
WORKDIR /app

# Copia os arquivos de dependência e instala
COPY package*.json ./
RUN npm install

# Copia o restante dos arquivos da aplicação
COPY . .

# Expõe a porta padrão do Next.js
EXPOSE 3000

# Comando para rodar a aplicação
CMD ["npm", "run", "dev"]
