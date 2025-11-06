import type { FastifyRequest, FastifyReply as FastifyResponse } from "fastify";


class DataSetController {
  public async list(req: FastifyRequest, res: FastifyResponse){
    return res.status(200).send("uai sô");
  }
}
export const dataSetController = new DataSetController()

