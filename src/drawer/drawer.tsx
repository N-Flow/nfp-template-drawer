import clsx from "clsx";
import {ThemeColor} from "next-flow-interface";
import React from "react";

import {rss, ScrollBar, ThemeProvider} from "../api";

import styles from "./drawer.module.sass"

export default function Drawer() {

  return <ThemeProvider color={ThemeColor.PURPLE}>
    <div className={clsx(rss.drawer, styles.drawer)}>
      <ScrollBar className={rss.main} drawer>
        <div></div>
      </ScrollBar>
    </div>
  </ThemeProvider>
}
