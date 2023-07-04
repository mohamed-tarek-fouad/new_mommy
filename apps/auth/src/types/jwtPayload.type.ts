export type JwtPayload = {
  email: string;
  id: string;
  role: UserRole;
};
enum UserRole {
  user,
  admin,
}
