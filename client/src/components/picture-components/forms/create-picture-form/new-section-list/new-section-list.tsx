import { useEffect, useState } from "react";
import DeleteButton from "../../../../../UI/delete-button/delete-button";
import StandartButton from "../../../../../UI/standart-button/standart-button";
import { newSectionObj } from "../create-picture-form";
import NewSectionItem from "../new-section-item/new-section-item";
import listStyles from "./new-section-list.module.css";


interface INewSectionListProps {
  setSections: React.Dispatch<React.SetStateAction<newSectionObj[]>>;
  sections: newSectionObj[]
}

const NewSectionList = ({ setSections, sections }: INewSectionListProps) => {

  function addNewSection() {
    setSections([...sections, { id: Date.now(), title: "", description: "" }]);
  }

  function editNewSection(paramName: string, paramValue: string, sectionToEditId: number) {
    setSections(sections.map(section => {
      if (section.id !== sectionToEditId) {
        return section;
      }

      return { ...section, [paramName]: paramValue }
    }));
  }

  function deleteNewSection(sectionToDeleteId: number) {
    setSections(sections.filter(section => section.id !== sectionToDeleteId));
  }

  return (
    <section>
      {
        sections.map(section =>
          <NewSectionItem newSection={section} editNewSection={editNewSection} deleteNewSection={deleteNewSection} />
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