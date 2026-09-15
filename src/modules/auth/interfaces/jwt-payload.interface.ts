export interface RolePayload {
  id: number;
  name: string | null;
}

export interface JwtPayload {
  sub: number; // User ID
  email: string;
  roles: RolePayload[];
}
