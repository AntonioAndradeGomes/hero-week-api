export interface ICreateUser{
  name: string,
  email: string,
  password: string,
}


export interface IUpdateUser{
  user_id: string;
  name: string;
  oldPassword: string;
  newPassword: string;
  avatar_url?: FileUpload;
}

interface FileUpload{
  fieldname:string,
  originalname: string,
  encoding: string,
  mimetype: string,
  buffer: Buffer,
  size: number,
}