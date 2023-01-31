import { Pagination, Table } from "antd";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { PostType } from "../types/general";
import { DatePicker, Space } from "antd";
import type { DatePickerProps } from "antd/es/date-picker";
import moment from "moment";

type PropsType = {
  appUrl: string;
  postsPerPage: number;
  initialPosts: PostType[];
  initialCount: number;
};

const columns = [
  {
    title: "Status",
    dataIndex: "status",
    key: "status",
  },
  {
    title: "PostsTitle",
    dataIndex: "title",
    key: "title",
  },
];

export default function Posts({
  appUrl,
  postsPerPage,
  initialPosts,
  initialCount,
}: PropsType) {
  const [current, setCurrent] = useState<number>(1);
  const [posts, setPosts] = useState<PostType[]>([]);
  const [totalCount, setTotalCount] = useState<number>(initialCount);
  const [category, setCategory] = useState<string | undefined>(undefined);
  const router = useRouter();

  useEffect(() => {
    setPosts(initialPosts);
    setTotalCount(initialCount);
  }, [initialPosts, initialCount]);

  let page = 1;
  useEffect(() => {
    if (router.query?.page) {
      setCurrent(Number(router.query?.page));
    }
    if (router.query.category && typeof router.query.category === "string") {
      setCategory(router.query.category);
    }
  }, [router.query.category, router.query?.page]);

  const queryPage = router.query.page;
  if (queryPage && +queryPage) {
    page = +queryPage;
  }

  function changePageNumber(page: number) {
    setCurrent(page);
    if (category) {
      router.push({
        pathname: `${appUrl}/posts`,
        query: { page, category },
      });

      return;
    }
    router.push({
      pathname: `${appUrl}/posts`,
      query: { page },
    });
  }

  const onChange = (
    value: DatePickerProps["value"],
    dateString: [string, string] | string
  ) => {
    // console.log("Formatted Selected Time: ", dateString);
    console.log(
      "moment(dateString) <-------",
      moment(dateString).format("YYYY-MM-D")
    );
    router.push({
      pathname: `${appUrl}/posts`,
      query: { date: `${moment(dateString).format("YYYY-MM-D")}` },
    });
  };

  function onChangeRow(item: any) {
    console.log("item <-------", item);
  }

  return (
    <div className="postsPageContainer">
      <div className="wrapPosts">
        <div className="containerPosts">
          <Space direction="vertical" size={12}>
            <DatePicker onChange={onChange} format="MMM D, YYYY" />
          </Space>
          <Table dataSource={posts} columns={columns} pagination={false}/>
            {/* <div>
              <Table.Column key="title" title="PostsTitle" dataIndex="title" />
            </div> */}
          {/* <table className="tablePosts">
            <tr className="trPosts">
              <th>Status</th>
              <th>PostTitle</th>
            </tr>
            {posts.map((item) => (
              <tr>
                <td>данные</td>
                <td>{item.title}</td>
              </tr>
            ))}
          </table> */}
          <Pagination
            className="pagination"
            current={current}
            onChange={changePageNumber}
            total={totalCount}
            defaultPageSize={postsPerPage}
            itemRender={(page, type, element) => {
              return (
                <>
                  {page === current ? (
                    <span
                      className="active"
                      style={{
                        display: "inline-block",
                        backgroundColor: "#921A64",
                        borderRadius: "50px",
                        width: "32px",
                        height: "32px",
                        color: "#ffffff",
                        fontSize: "14px",
                      }}
                    >
                      {element}
                    </span>
                  ) : (
                    <div>{element}</div>
                  )}
                </>
              );
            }}
          />
        </div>
      </div>
    </div>
  );
}
