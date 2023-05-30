import { compare, hash } from "bcrypt";
import { ICreateUser, IUpdateUser } from "../interfaces/UsersInterfaces";
import { UsersRepository } from "../repositories/UsersRepository";
import { v4 as uuid } from "uuid";
import { s3 } from "../config/aws";
import { sign } from "jsonwebtoken";

class UsersServices {
  private usersRepository: UsersRepository;

  constructor() {
    this.usersRepository = new UsersRepository();
  }

  async create({ name, email, password }: ICreateUser) {
    const findUser = await this.usersRepository.findUserByEmail(email);
    if (findUser) {
      throw new Error("User exists");
    }
    //criptografar a senha
    const hashPassword = await hash(password, 10);
    //criar user
    const create = await this.usersRepository.create({
      name,
      email,
      password: hashPassword,
    });
    return create;
  }

  async update({ user_id, name, oldPassword, newPassword, avatar_url }: IUpdateUser) {
    let password;
    if(oldPassword && newPassword){
      const findUser = await this.usersRepository.findUserById(user_id);
      if(!findUser){
        throw new Error('User not found');
      }
      const passwordMatch = compare(oldPassword, findUser.password);
      if (!passwordMatch) {
        throw new Error("Password invalid.");
      }
      password = await hash(newPassword, 10);
      await this.usersRepository.updatePassword(password, user_id);
    }

    if(avatar_url){
      const uploadImage = avatar_url?.buffer;
      const uploadS3 = await s3
        .upload({
          Bucket: "hero-week",
          Key: `${uuid()}-${avatar_url?.originalname}`,
          Body: uploadImage,
        })
        .promise();
      const location = uploadS3.Location;
      await this.usersRepository.update(name, location, user_id);
    }
    return {
      message: 'User updated successfully'
    };
  }

  async auth(email: string, password: string) {
    const findUser = await this.usersRepository.findUserByEmail(email);

    if (!findUser) {
      throw new Error("User or password invalid.");
    }

    const passwordMatch = compare(password, findUser.password);

    if (!passwordMatch) {
      throw new Error("User or password invalid.");
    }

    let secretKey : string | undefined =   process.env.ACCESS_KEY_TOKEN;
    if(!secretKey){
      return new Error('There is no token key');
    }

    const token = sign({email}, secretKey, {
      subject: findUser.id,
      expiresIn: 60 * 15, 
    });

    return {
      token,
      user: {
        name: findUser.name,
        email: findUser.email,
      }
    }
  }
}
export { UsersServices };
