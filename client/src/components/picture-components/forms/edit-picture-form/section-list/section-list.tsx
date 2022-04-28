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

  const deleteSection = async (sectionId: number, alreadyExists?: boolean) => {
    try {
      if (alreadyExists) {

        if (window.confirm(`Are you sure you want to delete this section?`)) {
          await PictureInfoService.deletePictureInfo(pictureId, +sectionId);
          setInitialSectionsArr(initialSectionsArr.filter(section => +section.id !== +sectionId));
        }
      }

      setSectionsArr(sectionsArr.filter(section => +section.id !== +sectionId));
    } catch (e: any | AxiosError | Error) {

      if (e.isAxiosError) {
        alert(e.response.data.message)
      }
    }

  };

  return (
    <section className={listStyles["section-list"]}>
      {
        sectionsArr.map(section => (
          <SectionItem section={section} deleteSection={deleteSection} editSection={editSection} />
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