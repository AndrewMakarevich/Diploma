import { useEffect, useState } from "react";
import DeleteButton from "../../../../../UI/delete-button/delete-button";
import StandartButton from "../../../../../UI/standart-button/standart-button";
import { newSectionObj } from "../create-picture-form";
import NewSectionItem from "../new-section-item/new-section-item";
import listStyles from "./new-section-list.module.css";


interface INewSectionListProps {
  setSections: React.Dispatch<React.SetStateAction<newSectionObj[]>>
}

const NewSectionList = ({ setSections }: INewSectionListProps) => {
  const [newSections, setNewSections] = useState<newSectionObj[]>([]);

  function addNewSection() {
    setNewSections([...newSections, { id: Date.now(), title: "", description: "" }]);
  }

  function editNewSection(paramName: string, paramValue: string, sectionToEditId: number) {
    setNewSections(newSections.map(newSection => {
      if (newSection.id !== sectionToEditId) {
        return newSection;
      }

      return { ...newSection, [paramName]: paramValue }
    }));
  }

  function deleteNewSection(sectionToDeleteId: number) {
    setNewSections(newSections.filter(newSection => newSection.id !== sectionToDeleteId));
  }

  useEffect(() => {
    setSections(newSections);
  }, [newSections])

  return (
    <section>
      {
        newSections.map(newSection =>
          <NewSectionItem newSection={newSection} editNewSection={editNewSection} deleteNewSection={deleteNewSection} />
        )
      }

      <StandartButton
        onClick={(e: React.ChangeEvent<any>) => {
          e.preventDefault();
          addNewSection();
        }}>add new section</StandartButton>
    </section>
  )
};

export default NewSectionList;