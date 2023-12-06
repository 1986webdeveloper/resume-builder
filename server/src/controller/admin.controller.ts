
import { Request, Response } from 'express'

//resume controller resume
export class AdminController {
    constructor() { }

    //#region  create user basic details
    static async createSkils(req: Request, res: Response): Promise<Response> {
        const userInput = req.body

        return res.json()
    }
    //#endregion
}