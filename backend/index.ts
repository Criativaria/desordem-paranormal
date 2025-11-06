import fastify from "fastify";
import fastifySwagger from "@fastify/swagger";
import { appRoutes } from "./src/routes/routes.js";
import { DataSetService } from "./src/services/data-set-service.js";
// import { WikiOp } from "./src/api/wiki-op.js";
import ScalarApiReference from "@scalar/fastify-api-reference";
import { appHost, appPort } from "./src/config.js";
import {
	jsonSchemaTransform,
	serializerCompiler,
	validatorCompiler,
	type ZodTypeProvider,
} from "fastify-type-provider-zod";

if(!appHost || !appPort){
  throw new Error("APP_HOST OR APP_PORT variable not defined, check your .env file")
}
const app = fastify({
   logger:true
}).withTypeProvider<ZodTypeProvider>();
app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);
app.register(fastifySwagger, {
	openapi: {
		info: {
			title: "desordem-paranormal",
			version: "1.0.0",
			description: "API wiki desordem-paranormal ",
		},
	},
	transform: jsonSchemaTransform,
});

app.register(ScalarApiReference, {
	routePrefix: "/api/docs",
	configuration: {
		theme: "purple",
	},
});
app.register(appRoutes,{
  prefix:"/api/v1/wikis"
})
app.ready()
app.listen({host:appHost,port:Number(appPort)},()=>{
  console.log(`a porta ${Number(appPort)} ta abrida !`)
})
DataSetService.GetPageConnections("Rascunho");
