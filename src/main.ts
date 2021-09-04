/* eslint-disable @typescript-eslint/no-var-requires */
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
const AWS = require("aws-sdk");
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  await app.listen(3000);
  AWS.config.update({
    region: "us-east-1",
    endpoint: "http://localhost:8000",
  });
}

bootstrap();
