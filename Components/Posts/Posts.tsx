import { Button, Drawer, Pagination, Table } from "antd";
import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/router";
import { PostType } from "../../types/general";
import { DatePicker, Space } from "antd";
import axios from "axios";
import type { DatePickerProps } from "antd/es/date-picker";
import moment from "moment";
import styles from "./Posts.module.scss";
import dynamic from "next/dynamic";

type PropsType = {
  appUrl: string;
  postsPerPage: number;
  initialPosts: PostType[];
  initialCount: number;
};

export default function Posts({
  appUrl,
  postsPerPage,
  initialPosts,
  initialCount,
}: PropsType) {
  const [current, setCurrent] = useState<number>(1);
  const [posts, setPosts] = useState<PostType[]>([]);
  const [totalCount, setTotalCount] = useState<number>(initialCount);
  const [open, setOpen] = useState(false);
  const [post, setPost] = useState<PostType>();
  const [filterDate, setFilterDate] = useState<string>("");
  const router = useRouter();

  const Map = useMemo(
    () =>
      dynamic(() => import("../Map/Map"), {
        loading: () => <p>A map is loading</p>,
        ssr: false,
      }),
    []
  );

  useEffect(() => {
    router.push({
      pathname: `${appUrl}/posts`,
    });
  }, []);

  useEffect(() => {
    setPosts(initialPosts);
    setTotalCount(initialCount);
  }, [initialPosts, initialCount]);

  let page = 1;
  useEffect(() => {
    if (router.query?.page) {
      setCurrent(Number(router.query?.page));
    }
  }, [router.query?.page]);

  const queryPage = router.query.page;
  if (queryPage && +queryPage) {
    page = +queryPage;
  }

  function changePageNumber(page: number) {
    setCurrent(page);
    if (filterDate) {
      router.push({
        pathname: `${appUrl}/posts`,
        query: { page, date: filterDate },
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
    if (dateString) {
      setFilterDate(`${moment(dateString).format("YYYY-MM-DD")}`);
      router.push({
        pathname: `${appUrl}/posts`,
        query: { page: 1, date: `${moment(dateString).format("YYYY-MM-DD")}` },
      });
      return;
    }
    setFilterDate("");
    router.push({
      pathname: `${appUrl}/posts`,
      query: { page: 1 },
    });
  };

  async function changeStatus(item: PostType) {
    setPost(item);
    showDrawer();
  }

  async function setIsBlocked(isBlocked: boolean) {
    const res = await axios.post(`${appUrl}/api/posts/edit`, {
      postId: post?.id,
      isBlocked,
    });
    if (res.status === 200) {
      const currentPosts = posts;
      const foundPost = currentPosts.find((item) => item.id === post?.id);
      if (!foundPost) {
        return;
      }
      foundPost.is_blocked = res.data.data.isBlocked;
      setPosts([...currentPosts]);
      onClose();
    }
  }

  function showDrawer() {
    setOpen(true);
  }

  function onClose() {
    setOpen(false);
  }

  return (
    <div className={styles.postsPageContainer}>
      <div className={styles.wrapPosts}>
        <div className={styles.containerPosts}>
          <Space direction="vertical" size={12}>
            <DatePicker onChange={onChange} format="MMM D, YYYY" />
          </Space>
          <Table dataSource={posts} pagination={false} bordered>
            <Table.Column
              key="status"
              title="Status"
              dataIndex="status"
              render={(text, record: PostType, index) => {
                return (
                  <>
                    {!record.is_blocked ? (
                      <></>
                    ) : (
                      <div key={record.id}>blocked</div>
                    )}
                  </>
                );
              }}
            />
            <Table.Column
              key="name"
              title="Name"
              dataIndex="name"
              render={(text, record: PostType, index) => {
                return (
                  <div
                    className={styles.cursor}
                    key={record.id}
                    onClick={() => changeStatus(record)}
                  >
                    {record.title}
                  </div>
                );
              }}
            />
          </Table>
          <Drawer
            className={styles.drawer}
            title={<div>Post {post?.title}</div>}
            placement="right"
            onClose={onClose}
            open={open}
          >
            <p>Date: {moment(post?.created_at).format("MMM D, YYYY")}</p>
            <div className={styles.isPublic}>
              Public: {!post?.isPublic ? <div>yes</div> : <div>no</div>}
            </div>
            <p>Author: {post?.users.email}</p>
            <p>Description: {post?.description}</p>
            <p>Location: {post?.geo}</p>
            <div className={styles.map}>
              <Map
                lat={post?.lat as number}
                lng={post?.lng as number}
                // setLat={setLat}
                // setLng={setLng}
                isAllowDrag={true}
              />
            </div>
            <Button
              className={styles.buttonPost}
              onClick={() => setIsBlocked(!post?.is_blocked)}
            >
              {post?.is_blocked ? <div>Unblock</div> : <div>Block</div>}
            </Button>
          </Drawer>
          <Pagination
            className={styles.pagination}
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
