

## Docker struktur:
### to containere koordinert av docker-compose: 
- api-containeren kjører Node.js med Express, bcrypt/JWT og Prisma, 
- db-containeren kjører PostgreSQL med et montert volum for datapersistering. 
- Prisma snakker med databasen via DATABASE_URL i .env.
