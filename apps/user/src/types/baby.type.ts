export type Baby = {
  babyName: string;
  gender: Gender;
  birthDate: string;
  weight?: number;
};
enum Gender {
  boy,
  girl,
}
