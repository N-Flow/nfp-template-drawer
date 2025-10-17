import clsx from "clsx";
import {ThemeColor} from "next-flow-interface";
import React from "react";

import {rss, ScrollBar, ThemeProvider} from "next-flow-interface/api";

import styles from "./drawer.module.sass"

export default function Drawer() {

  return <ThemeProvider color={ThemeColor.PURPLE}>
    <div className={clsx(rss.drawer, styles.drawer)}>
      <ScrollBar className={rss.main} barPaddingEnd='0.75rem'>
        <div></div>
      </ScrollBar>
    </div>
  </ThemeProvider>
}
