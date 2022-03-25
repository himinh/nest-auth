import { UserDocument } from 'src/user/schemas/user.schema';
import { Tokens } from '../types';

export class AuthReponseDto {
  user: UserDocument;
  tokens: Tokens;
}
