import listStyles from "./section-list.module.css";
import { AxiosError } from "axios";
import { useEffect } from "react";
import PictureInfoService from "../../../../../services/picture-info-service";
import StandartButton from "../../../../../UI/standart-button/standart-button";
import { sectionObj } from "../edit-picture-form";
import SectionItem from "../section-item/section-item";

interface ISectionListProps {
  pictureId: number,
  sectionsArr: sectionObj[],
  setSectionsArr: React.Dispatch<React.SetStateAction<sectionObj[]>>,
  initialSectionsArr: sectionObj[],
  setInitialSectionsArr: React.Dispatch<React.SetStateAction<sectionObj[]>>
}

const SectionList = ({ pictureId, sectionsArr, setSectionsArr, initialSectionsArr, setInitialSectionsArr }: ISectionListProps) => {
  const addNewSection = () => {
    setSectionsArr([...sectionsArr, { id: Date.now(), title: "", description: "" }])
  };

  const editSection = (paramName: string, paramValue: string, sectionId: number) => {
    setSectionsArr(sectionsArr.map(section => {
      if (+section.id === +sectionId) {
        return { ...section, [paramName]: paramValue }
      }

      return section
    }));
  };

  const resetSectionToDeleteOption = (option: boolean, sectionId: number) => {
    setSectionsArr(sectionsArr.map(section => {
      if (+section.id === +sectionId) {
        return { ...section, toDelete: option }
      }
      return section
    }));
  }

  const deleteSection = async (section: sectionObj, alreadyExists?: boolean) => {
    if (!section.title.split(" ").join("") && !section.description.split(" ").join("") && !alreadyExists) {
      setSectionsArr(sectionsArr.filter(sectionObj => +sectionObj.id !== +section.id));
      return;
    }
    resetSectionToDeleteOption(true, section.id);
  };

  const reestablishSection = (sectionId: number) => {
    resetSectionToDeleteOption(false, sectionId);
  }

  return (
    <section className={listStyles["section-list"]}>
      {
        sectionsArr.map(section => (
          <SectionItem section={section} deleteSection={deleteSection} editSection={editSection} reestablishSection={reestablishSection} />
        ))
      }
      <StandartButton
        onClick={(e) => {
          e.preventDefault();
          addNewSection();
        }}>
        Add section
      </StandartButton>
    </section>
  )
};

export default SectionList;