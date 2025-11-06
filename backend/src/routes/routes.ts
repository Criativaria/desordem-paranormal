import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { dataSetController } from "../controller/data-set-controller.js";


export async function appRoutes(api: FastifyInstance) {
	api.withTypeProvider<ZodTypeProvider>().get("/", {
		schema: {
			tags: ["Wiki"],
			summary: "list wiki",
			description: "list wiki",
		},
		handler: dataSetController.list,
	});
}
