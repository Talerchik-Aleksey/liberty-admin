import { Posts } from "../models/posts";
import config from "config";
import { connect } from "../utils/db";

const PAGE_SIZE = config.get<number>("posts.perPage");

connect();

export async function getPosts(
  page: number,
  date?: string | string[] | undefined
) {
  // const arrDates = [
  //   date?.concat(" 00:00:00.000+03"),
  //   date?.concat(" 23:59:59.999+03"),
  // ];
  // const arrDates = [
  //   date?.concat("T00:00:00.000Z"),
  //   date?.concat("T23:59:59.999Z"),
  // ];
  const arrDates = [
    new Date("2023-01-30 01:00:00"),
    new Date("2023-01-30 23:59:59"),
  ];
  // console.log("arrDates <-------", arrDates);
  const posts = await Posts.findAll({
    // where: {
    //   created_at: {
    //     $between: arrDates,
    //   },
    // },
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
  });
  const count = await Posts.count(/* {
    where: {
      created_at: {
        [Op.substring]: `${date}`,
      },
    },
  } */);
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
