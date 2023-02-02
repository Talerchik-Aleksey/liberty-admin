import { Posts } from "../models/posts";
import config from "config";
import { connect } from "../utils/db";
import { Op } from "sequelize";
import { Users } from "../models/users";

const PAGE_SIZE = config.get<number>("posts.perPage");

connect();

export async function getPosts(
  page: number,
  date?: string | string[] | undefined
) {
  if (date) {
    const startedDate = new Date(`${date.concat(" 00:00:00 UTC")}`);
    const endDate = new Date(`${date.concat(" 23:59:59 UTC")}`);

    const posts = await Posts.findAll({
      where: { created_at: { [Op.between]: [startedDate, endDate] } },
      limit: PAGE_SIZE,
      offset: PAGE_SIZE * (page - 1),
      attributes: [
        "id",
        "title",
        "category",
        "description",
        "is_public",
        "geo",
        "created_at",
        "author_id",
        "is_enabled",
      ],
      include: {
        model: Users,
        as: "users",
        required: true,
        attributes: ["email"],
      },
    });

    const count = await Posts.count({
      where: { created_at: { [Op.between]: [startedDate, endDate] } },
    });

    return { count, posts };
  }

  const posts = await Posts.findAll({
    limit: PAGE_SIZE,
    offset: PAGE_SIZE * (page - 1),
    attributes: [
      "id",
      "title",
      "category",
      "description",
      "is_public",
      "geo",
      "created_at",
      "author_id",
      "is_enabled",
    ],
    include: {
      model: Users,
      as: "users",
      required: true,
      attributes: ["email"],
    },
  });

  const count = await Posts.count();

  return { count, posts };
}

export async function editPost(postId: number, isBlocked: boolean) {
  await Posts.update(
    { is_enabled: isBlocked },
    {
      where: { id: postId },
    }
  );
}
