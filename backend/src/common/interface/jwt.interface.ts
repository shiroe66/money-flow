export interface JwtPayload {
  [key: string]: any;
  email: string;
  sub: string;
  iat: number;
  exp: number;
}
