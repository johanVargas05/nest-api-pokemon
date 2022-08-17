<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

# Ejecutar en desarrollo
1. Clonar el repositorio
2. ejecutar
```CONSOLE
yarn install
```
3. Tener NEST JS CLI instalado en dado caso de no tenerlo ejecutar el siguiente comando: 
```CONSOLE
npm i -g @nestjs/cli
``` 
4. Levantar la base de datos 
```CONSOLE
docker-compose up -d
```

5.Reconstruir datos de prueba de la base de datos
```http

http://localhost:3000/api/v2/seed

```


## Stack usado
* MongoDB
* Nest js
