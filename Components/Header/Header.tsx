import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import type { NextRouter } from "next/router";
import { useRouter } from "next/router";
import Link from "next/link";
import styles from "./Header.module.scss";
import LibertyMeetsLogo from "../LibertyMeetsLogo";
import LogOut from "./buttons/logOut";
import LogIn from "./buttons/logIn";
import Image from "next/image";

const buttonMap = {
  showLogOut: ["", "posts"],
  showLogIn: [""],
};

export default function Header() {
  const { data: session } = useSession();
  const [isLogin, setIsLogin] = useState<boolean>(false);
  const [visible, setVisible] = useState<boolean>(false);
  const router: NextRouter = useRouter();
  const url: Array<string> = router.route.split("/");
  const page: string = url.slice(1, url.length).join("/");

  useEffect(() => {
    if (session) {
      setIsLogin(true);
    }
  }, [session]);

  return (
    <>
      <header className={styles.header}>
        <div className={styles.logo}>
          <Link href={"/"}>
            <LibertyMeetsLogo />
          </Link>
          <div
            className={styles.burgerButton}
            onClick={() => setVisible(!visible)}
          >
            {visible ? (
              <Image src="/decor/close.svg" alt="" width={60} height={60} />
            ) : (
              <Image src="/decor/menu.svg" alt="" width={60} height={60} />
            )}
          </div>
        </div>

        <div className={visible ? styles.visible : styles.navigation}>
          {isLogin ? (
            <ul className={styles.navigationItemContainer}>
              {buttonMap.showLogOut.indexOf(page) !== -1 && <LogOut />}
            </ul>
          ) : (
            <ul className={styles.navigationItemContainer}>
              {buttonMap.showLogIn.indexOf(page) !== -1 && <LogIn />}
            </ul>
          )}
        </div>
      </header>
    </>
  );
}
