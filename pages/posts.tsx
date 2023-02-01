import { GetServerSideProps } from "next";
import config from "config";
import { PostType } from "../types/general";
import { getPosts } from "../services/posts";
import Posts from "../Components/Posts/Posts";

type PostsPageProps = {
  appUrl: string;
  postsPerPage: number;
  posts: PostType[];
  count: number;
};

export default function PostsPage({
  appUrl,
  postsPerPage,
  posts,
  count,
}: PostsPageProps) {
  return (
    <>
      <Posts
        appUrl={appUrl}
        postsPerPage={postsPerPage}
        initialPosts={posts}
        initialCount={count}
      />
    </>
  );
}

export const getServerSideProps: GetServerSideProps<PostsPageProps> = async (
  ctx
) => {
  const appUrl = process.env.NEXTAUTH_URL || config.get<string>("appUrl");
  const postsPerPage = config.get<number>("posts.perPage");
  let page = Number(ctx.query.page);
  if (isNaN(page)) {
    page = 1;
  }

  const res = await getPosts(page, ctx.query.date);
  if (!res) {
    return {
      notFound: true,
    };
  }

  const posts = res.posts
    .map((item) => item.toJSON())
    .map((item) => {
      item.created_at = item.created_at.toISOString();
      return item;
    });

  const count = res.count;

  return {
    props: {
      appUrl,
      postsPerPage,
      posts,
      count,
    },
  };
};
