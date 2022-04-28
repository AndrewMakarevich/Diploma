import itemStyles from "./section-item.module.css";
import { sectionObj } from "../edit-picture-form";
import DeleteButton from "../../../../../UI/delete-button/delete-button";

interface ISectionItemProps {
  section: sectionObj,
  deleteSection: (sectionId: number, alreadyExists?: boolean) => void,
  editSection: (paramName: string, paramValue: string, sectionId: number) => void
}

const SectionItem = ({ section, deleteSection, editSection }: ISectionItemProps) => {
  return (
    <div className={itemStyles["item-wrapper"]}>
      <textarea onChange={(e) => editSection("title", e.target.value, section.id)} value={section.title} />
      <textarea onChange={(e) => editSection("description", e.target.value, section.id)} value={section.description} />
      <DeleteButton onClick={(e) => {
        e.preventDefault();
        deleteSection(section.id, section.alreadyExists);
      }}>Delete section</DeleteButton>
    </div>
  )
};

export default SectionItem;