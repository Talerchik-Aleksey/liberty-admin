import { UserType } from "../types/general";
import { compareSync } from "bcryptjs";
import { Users } from "../models/users";
import { connect } from "../utils/db";

connect();

export async function getUserByCredentials(
  user: UserType
): Promise<Users | null> {
  const foundUser = await Users.findOne({ where: { email: user.email } });
  if (!foundUser) {
    return null;
  }
  if (!compareSync(user.password, foundUser.password)) {
    return null;
  }
  return foundUser;
}
