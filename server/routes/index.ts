import express from "express";
import routerTokenSteps from "./tokenSteps" 

const router = express.Router()

router.use('/tokenSteps', routerTokenSteps);

export default router