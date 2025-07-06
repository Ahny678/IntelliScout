export interface JwtPayload {
  id: string;
  name: string;
  email: string;
}
export interface AuthenticatedRequest extends Request {
  user: JwtPayload;
}
