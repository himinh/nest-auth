import { JwtPayload } from './jwtPayload';

export type JwtPayloadWithRt = JwtPayload & { rfToken: string };
