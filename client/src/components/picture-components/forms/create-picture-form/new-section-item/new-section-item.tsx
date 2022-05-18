import itemStyles from "./new-section-item.module.css";
import DeleteButton from "../../../../../UI/delete-button/delete-button";

interface INewSectionItem {
  newSection: { id: number, title: string, description: string },
  editNewSection: (paramName: string, paramValue: string, sectionToEditId: number) => void,
  deleteNewSection: (sectionToDeleteId: number) => void
}

const NewSectionItem = ({ newSection, editNewSection, deleteNewSection }: INewSectionItem) => {

  const onDeleteNewSection = () => {
    deleteNewSection(newSection.id);
  };

  return (
    <div key={newSection.id} className={itemStyles["new-section"]}>
      <label>
        <input
          placeholder="Title"
          value={newSection.title}
          onChange={(e) => editNewSection('title', e.target.value, newSection.id)}></input>
      </label>
      <label>
        <textarea
          placeholder="Description"
          value={newSection.description}
          onChange={(e) => editNewSection('description', e.target.value, newSection.id)}></textarea>
      </label>
      <DeleteButton
        type="button"
        onClick={onDeleteNewSection}>delete section</DeleteButton>
    </div>
  )
};

export default NewSectionItem;