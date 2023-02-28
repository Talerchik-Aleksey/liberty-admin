import { Posts } from "../models/posts";
import config from "config";
import { connect } from "../utils/db";
import { Op } from "sequelize";
import { Users } from "../models/users";
import moment from "moment";

type QueryType = {
  limit?: number;
  offset?: number;
  attributes?: string[];
  include?: {
    model: typeof Users;
    as: string;
    required: boolean;
    attributes: string[];
  };
  where?: any;
};

const PAGE_SIZE = config.get<number>("posts.perPage");

connect();

export async function getPosts(
  page: number,
  date?: string | string[] | undefined
) {
  let postsQuery: QueryType = {
    limit: PAGE_SIZE,
    offset: PAGE_SIZE * (page - 1),
    attributes: [
      "id",
      "title",
      "category",
      "description",
      "is_public",
      "geo",
      "lat",
      "lng",
      "created_at",
      "author_id",
      "is_blocked",
    ],
    include: {
      model: Users,
      as: "users",
      required: true,
      attributes: ["email"],
    },
  };
  let countQuery: QueryType = {};
  let startedDate: moment.Moment;
  let endDate: moment.Moment;

  if (date) {
    startedDate = moment.utc(`${date}`).startOf("day");
    endDate = moment.utc(`${date}`).endOf("day");
    postsQuery.where = { created_at: { [Op.between]: [startedDate, endDate] } };
    countQuery.where = { created_at: { [Op.between]: [startedDate, endDate] } };
  } else {
  }

  const posts = await Posts.findAll(postsQuery);
  const count = await Posts.count(countQuery);

  return { count, posts };
}

export async function editPost(postId: number, isBlocked: boolean) {
  await Posts.update(
    { is_blocked: isBlocked },
    {
      where: { id: postId },
    }
  );
}
