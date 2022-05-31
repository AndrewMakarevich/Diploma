import PictureTagsPanel from "../../picture-tags-components/picture-tags-panel/picture-tags-panel";

import panelStyles from "./picture-tags-moderation-panel.module.css"

const PictureTagsModerationPanel = () => {
  return (
    <div className={panelStyles["container"]}>
      <p>Picture tags moderation</p>
      <PictureTagsPanel />
    </div>

  )
};

export default PictureTagsModerationPanel;