export interface JwtPayload {
  id: number;
  name: string;
  email: string;
}
export interface AuthenticatedRequest extends Request {
  user: JwtPayload;
}
