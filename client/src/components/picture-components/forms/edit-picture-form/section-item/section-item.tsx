import itemStyles from "./section-item.module.css";
import DeleteButton from "../../../../../UI/delete-button/delete-button";
import StandartButton from "../../../../../UI/standart-button/standart-button";
import { sectionObj } from "../interfaces";

interface ISectionItemProps {
  section: sectionObj,
  deleteSection: (section: sectionObj, alreadyExists?: boolean) => void,
  reestablishSection: (sectionId: number) => void,
  editSection: (paramName: string, paramValue: string, sectionId: number) => void
}

const SectionItem = ({ section, deleteSection, reestablishSection, editSection }: ISectionItemProps) => {
  return (
    <div className={`${itemStyles["item-wrapper"]} ${section.toDelete ? itemStyles["to-delete"] : ""}`}>
      <textarea onChange={(e) => editSection("title", e.target.value, section.id)} value={section.title} />
      <textarea onChange={(e) => editSection("description", e.target.value, section.id)} value={section.description} />
      {
        section.toDelete ?
          <StandartButton type="button" className={itemStyles["reestablish-btn"]} onClick={() => reestablishSection(section.id)}>reestablish</StandartButton>
          : null
      }

      <DeleteButton type="button" onClick={(e) => {
        deleteSection(section, section.alreadyExists);
      }}>Delete section</DeleteButton>
    </div>
  )
};

export default SectionItem;