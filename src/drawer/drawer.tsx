import React from "react";
import styles from "./drawer.module.sass"
import {rss, ScrollBar, ThemeProvider} from "../api";
import clsx from "clsx";
import {ThemeColor} from "oflow-interface";

export default function Drawer() {

  return <ThemeProvider theme={ThemeColor.PURPLE}>
    <div className={clsx(rss.drawer, styles.drawer)}>
      <ScrollBar className={rss.main} drawer>
        <div></div>
      </ScrollBar>
    </div>
  </ThemeProvider>
}
