import React from "react";
import Image from "next/image";
import { signIn, useSession } from "next-auth/react";
import { Button, Form, Input } from "antd";
import { useRouter } from "next/router";
import Link from "next/link";
import url from "url";
import styles from "./Login.module.scss";

export default function Login() {
  const router = useRouter();
  const { data: session } = useSession();

  function goBack() {
    const callback = `${router.query.callbackUrl}`;
    const { pathname } = url.parse(callback);
    return pathname ? router.push(`${pathname}`) : router.push("/");
  }

  if (session) {
    goBack();
  }

  async function onFinish(values: any) {
    await signIn("credentials", { ...values, callbackUrl: "/posts" });
  }

  return (
    <section className={styles.loginWrapper}>
      <div className={styles.formBlock}>
        <div className={styles.logoInfo}>
          <div className={styles.goods}>
            <Image
              src="/decor/Unframed.svg"
              alt=""
              width={238}
              height={280}
              className={styles.logoImage}
            />
          </div>
        </div>
        <Form
          name="normal_login"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          className={styles.form}
          validateTrigger={false}
        >
          <Form.Item
            name="email"
            rules={[
              { required: true },
              { type: "email" },
              { type: "string", max: 100 },
            ]}
            colon={false}
            labelAlign="left"
            label="Email"
            labelCol={{ span: 3 }}
            className={styles.username}
          >
            <Input
              suffix={
                <Image
                  src="/decor/fax.svg"
                  alt=""
                  width={20}
                  height={20}
                  className={styles.vector}
                />
              }
              placeholder="Username"
              className={styles.usernameInput}
            />
          </Form.Item>
          <Form.Item
            label="Password"
            name="password"
            colon={false}
            labelCol={{ span: 3 }}
            labelAlign="left"
            className={styles.password}
            rules={[{ required: true }, { type: "string", min: 4, max: 100 }]}
          >
            <Input
              suffix={
                <Image
                  src="/decor/lock.svg"
                  alt=""
                  width={20}
                  height={20}
                  className={styles.vector}
                />
              }
              type="password"
              placeholder="Password"
              className={styles.inputPassword}
            />
          </Form.Item>
          <Form.Item className={styles.logIn}>
            <Button
              type="primary"
              htmlType="submit"
              className={styles.buttonLogIns}
            >
              <Image
                src="/decor/login.svg"
                alt=""
                width={20}
                height={20}
                className={styles.vector}
              />
              <span className={styles.buttonLogInsText}>Log in</span>
            </Button>
          </Form.Item>
        </Form>
      </div>
    </section>
  );
}
