import PictureTypesPanel from "../../picture-types-components/picture-types-panel/picture-types-panel";

import panelStyles from "./picture-types-moderation-panel.module.css";

const PictureTypesModerationPanel = () => {
  return (
    <article className={panelStyles["moderation-panel"]}>
      <p className={panelStyles["panel-header"]}>Picture types moderation</p>
      <PictureTypesPanel />
    </article>
  )
};

export default PictureTypesModerationPanel