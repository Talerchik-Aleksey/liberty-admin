import { Users } from "../models/users";

export async function findEmail(authorId: number) {
  const foundUser = await Users.findOne({ where: { id: authorId } });
  if (!foundUser) {
    return null;
  }

  return foundUser.email;
}
