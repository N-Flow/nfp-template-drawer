import React from "react";
import styles from "./drawer.module.sass"
import {rss, ScrollBar} from "../api";
import clsx from "clsx";

export default function Drawer() {

  return <div className={clsx(rss.drawer, styles.Drawer)}>
    <ScrollBar className={clsx(rss.main, 'bottom-margin-12')}>

    </ScrollBar>
  </div>
}
