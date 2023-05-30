import { Request, Response, NextFunction } from "express";
import { UsersServices } from "../services/UsersServices";
import { v4 as uuid } from "uuid";
import { s3 } from "../config/aws";

class UsersController {
  private usersServices: UsersServices;

  constructor() {
    this.usersServices = new UsersServices();
  }

  //buscar todos
  async index() {}

  //buscar somente um
  async show() {}

  //criar
  async store(request: Request, response: Response, next: NextFunction) {
    const { name, email, password } = request.body;
    try {
      const result = await this.usersServices.create({ name, email, password });
      return response.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }

  //autenticar
  async auth(request: Request, response: Response, next: NextFunction) {
    const {email, password} = request.body;
    try{
      const result = await this.usersServices.auth(email, password);
      return response.status(201).json(result);
    }catch(err){
      next(err);
    }
  }

  //update
  async update(request: Request, response: Response, next: NextFunction) {
    const { name, oldPassword, newPassword } = request.body;
    const {user_id} = request;
    try {
      const result = await this.usersServices.update({
        user_id,
        name,
        oldPassword,
        newPassword,
        avatar_url: request.file,
      });
      return response.status(200).json(result);
    } catch (err) {
      next(err);
    }
  }
}

export { UsersController };
