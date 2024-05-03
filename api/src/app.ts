import express, { Application } from 'express';
import * as config from '@/config/config';
import routes from '@/routes';
import httpLogger from '@/config/http-logger';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import cors from 'cors';
import { errorHandler } from '@/commons/middlewares/errorHandler.middleware';

const app: Application = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(httpLogger.successHandler);
app.use(httpLogger.warningHandler);
app.use(httpLogger.errorHandler);

app.use(config.API_PREFIX_PATH, routes);

let openapiYaml = YAML.load('openapi.yaml');
if(config.API_PUBLISH_HOST && config.API_PUBLISH_PORT)
  openapiYaml.servers = [
    { url: config.API_PUBLISH_PROTOCOL + '://' + config.API_PUBLISH_HOST + ':' + config.API_PUBLISH_PORT, description: 'CURRENT' }
  ];
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openapiYaml));

app.use(errorHandler);

export default app;