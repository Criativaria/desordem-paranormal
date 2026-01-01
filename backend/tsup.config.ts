import { defineConfig } from "tsup";

//passando de ts para js
export default defineConfig({
  entry: ["index.ts"],
  format: "esm", //format para qual ele vai transpilar o codigo, pq é o format que o node suporta
  clean: true, // garantindo que nao sobre residuos da build anterior
  minify: true, //comprimir o código, para ficar menor e poder entrar nos serviços de hospedagem
  platform: "node", //pro tsup saber que estamos fazendo um build para node
});
