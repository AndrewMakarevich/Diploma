import { useState } from "react";
import ArrowIcon from "../../assets/img/icons/arrow-icon/arrow-icon";

import barStyles from "./side-bar.module.css";

interface ISideBarProps {
  children: React.ReactElement
}
const SideBar = ({ children }: ISideBarProps) => {
  const [sideBarOpen, setSideBarOpen] = useState(true);
  const sideBarClassName = `${barStyles["side-bar"]} ${!sideBarOpen ? barStyles["closed"] : ""}`;

  return (
    <aside className={sideBarClassName}>
      <div className={barStyles["side-bar__content"]}>
        {children}
      </div>
      <button
        className={barStyles["close-btn"]}
        onClick={() => setSideBarOpen(!sideBarOpen)}>
        <ArrowIcon id={barStyles["arrow-icon"]} />
      </button>
    </aside>
  )
};

export default SideBar;