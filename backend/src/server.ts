import { config } from './config/env';
import { createApp } from './app';
import { prisma } from './shared/database/prisma';
import { logger } from './shared/logger/logger';

async function bootstrap() {
  try {
    console.log("=================================");
    console.log("🚀 Iniciando La Olla de Datos API");
    console.log("=================================");

    console.log("Conectando a PostgreSQL...");

    await prisma.$connect();

    console.log("✅ PostgreSQL conectado correctamente");

    const app = createApp();

    const server = app.listen(config.PORT, "0.0.0.0", () => {
      logger.info(`${config.APP_NAME} iniciado`, {
        port: config.PORT,
        environment: config.NODE_ENV,
      });

      console.log("=================================");
      console.log(`✅ Servidor escuchando en ${config.PORT}`);
      console.log("=================================");
    });

    const shutdown = async () => {
      console.log("Cerrando servidor...");

      server.close(async () => {
        await prisma.$disconnect();
        process.exit(0);
      });
    };

    process.on("SIGINT", shutdown);
    process.on("SIGTERM", shutdown);

  } catch (error) {
    console.error("=================================");
    console.error("❌ ERROR DURANTE EL ARRANQUE");
    console.error(error);
    console.error("=================================");
    process.exit(1);
  }
}

bootstrap();