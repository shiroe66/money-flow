export interface JwtPayload {
  [key: string]: any;
  sub: string;
  iat: number;
  exp: number;
}
