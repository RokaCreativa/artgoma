# Usar la imagen base oficial de Node.js (versión 18)
FROM node:20-alpine

# Establecer el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copiar únicamente los archivos necesarios para instalar dependencias
COPY package.json package-lock.json ./

# Instalar solo las dependencias de producción
RUN npm install --only=production

# Instalar `prisma` si es necesario (puede requerirse en producción)
RUN npx prisma generate

# Copiar el resto del código fuente de la aplicación
COPY . .

# Construir la aplicación
RUN npm run build

# Exponer el puerto en el contenedor
EXPOSE 3000

# Comando por defecto para ejecutar la aplicación
CMD ["npm", "run", "start"]
