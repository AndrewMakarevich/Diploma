import { observer } from 'mobx-react-lite';
import { useContext, useRef, useState } from 'react';
import formStyles from './edit-user-form.module.css';
import { Context } from '../../..';
import PairSelects from '../../inputs/pair-select';
import countriesList from '../../../consts/countries-list/countries-list';
import { IUserDataToEdit } from '../../../interfaces/forms/edit-user-interfaces';
import useFetching from '../../../hooks/useFetching';

const EditUserForm = () => {
  const { userStore } = useContext(Context);
  const userAvatarImgLink = process.env.REACT_APP_BACK_LINK + '/img/avatar/' + userStore.userData.avatar;
  const profileBgImgLink = process.env.REACT_APP_BACK_LINK + '/img/profile-background/' + userStore.userData.profileBackground;

  const [userDataToEdit, setUserDataToEdit] = useState<IUserDataToEdit>({
    avatar: undefined,
    profileBackground: undefined,
    nickname: userStore.userData.nickname,
    firstName: userStore.userData.firstName,
    surname: userStore.userData.surname,
    country: userStore.userData.country,
    city: userStore.userData.city
  });
  const { executeCallback: sendDataToEdit, isLoading: isEditLoading } = useFetching(() => userStore.editMyself(groupData()))

  const formRef = useRef<HTMLFormElement>(null);
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const currentAvatarInputImgRef = useRef<HTMLImageElement>(null);
  const profileBackgroundInputRef = useRef<HTMLInputElement>(null);
  const currentProfileBackgroundInputRef = useRef<HTMLImageElement>(null);


  function clearChanges() {
    setUserDataToEdit({
      avatar: undefined,
      profileBackground: undefined,
      nickname: userStore.userData.nickname,
      firstName: userStore.userData.firstName,
      surname: userStore.userData.surname,
      country: userStore.userData.country,
      city: userStore.userData.city
    });
    // Reset form when user click on clear changes button
    formRef.current?.reset();
    // Set current user img into the input img tag
    setFileInputCurrentImg(currentAvatarInputImgRef, avatarInputRef.current?.files?.[0], userAvatarImgLink);
    setFileInputCurrentImg(currentProfileBackgroundInputRef, profileBackgroundInputRef.current?.files?.[0], profileBgImgLink);
  }

  function groupData() {
    const infoToEdit = new FormData();
    for (let key in userDataToEdit) {
      if (!userDataToEdit[key]) {
        continue;
      }
      if (userDataToEdit[key] !== userStore.userData[key] || userDataToEdit[key] instanceof File) {
        infoToEdit.append(key, userDataToEdit[key]);
      }
    }
    return infoToEdit;
  }

  function setFileInputCurrentImg(inputImgRef: React.RefObject<HTMLImageElement>, inputFile: File | undefined, standartImgLink: string) {
    if (inputFile && inputImgRef.current) {
      const fr = new FileReader();
      fr.readAsDataURL(inputFile);
      fr.addEventListener('load', () => {
        inputImgRef.current!.src = String(fr.result)
      });
      return;
    }
    inputImgRef.current!.src = standartImgLink;
    return;
  }

  return (
    <>
      <form ref={formRef} className={formStyles['form']}>

        <label className={`${formStyles['img-input-label']} ${formStyles['avatar-input-label']}`}>
          <input
            ref={avatarInputRef}
            className={formStyles['avatar-input']}
            type="file"
            accept='image/jpeg, image/jpg, image/png, image/webm'
            onChange={(e) => {
              setUserDataToEdit({ ...userDataToEdit, avatar: e.target.files?.[0] });
              setFileInputCurrentImg(currentAvatarInputImgRef, e.target.files?.[0], userAvatarImgLink);
            }
            } />

          <img className={formStyles['avatar-input__current-img']}
            ref={currentAvatarInputImgRef}
            alt="Avatar"
            src={userAvatarImgLink} />
          <span className={formStyles['avatar-header']}>AVATAR</span>
        </label>

        <label className={`${formStyles['img-input-label']} ${formStyles['profileBg-input-label']}`}>
          <input
            ref={profileBackgroundInputRef}
            className={formStyles['profileBg-input']}
            type="file"
            accept='image/jpeg, image/jpg, image/png, image/webm'
            onChange={(e) => {
              setUserDataToEdit({ ...userDataToEdit, profileBackground: e.target.files?.[0] });
              setFileInputCurrentImg(currentProfileBackgroundInputRef, e.target.files?.[0], profileBgImgLink);
            }
            } />
          <img className={formStyles['profileBg-input__current-img']}
            ref={currentProfileBackgroundInputRef}
            alt="Profile background"
            src={profileBgImgLink} />
          <span className={formStyles['profileBg-header']}>PROFILE BACKGROUND</span>
        </label>

        <hr className={formStyles['split-line']}></hr>

        <label className={formStyles['input__label']}>
          Nickname:
          <input className={formStyles['input']}
            value={userDataToEdit.nickname}
            onChange={(e) => setUserDataToEdit({ ...userDataToEdit, nickname: e.target.value })} />
          <span className={formStyles['input__span']}></span>
        </label>

        <label className={formStyles['input__label']}>
          First name:
          <input className={formStyles['input']}
            value={userDataToEdit.firstName}
            onChange={(e) => setUserDataToEdit({ ...userDataToEdit, firstName: e.target.value })} />
          <span className={formStyles['input__span']}></span>
        </label>

        <label className={formStyles['input__label']}>
          Surname:
          <input className={formStyles['input']}
            value={userDataToEdit.surname}
            onChange={(e) => setUserDataToEdit({ ...userDataToEdit, surname: e.target.value })} />
          <span className={formStyles['input__span']}></span>
        </label>

        <label className={formStyles['input__label']}>
          Location:
          <PairSelects<IUserDataToEdit>
            firstOptStyles={formStyles['country-input']}
            secOptStyles={formStyles['city-input']}
            valuesObj={countriesList}
            state={userDataToEdit}
            setState={setUserDataToEdit}
            firstOptName='country'
            secOptName='city' />
        </label>

        <button
          className={formStyles['submit-changes-btn']}
          onClick={(e) => {
            e.preventDefault();
            sendDataToEdit();
          }}
          disabled={isEditLoading}>Submit changes</button>

      </form>

      <button
        className={formStyles['clear-changes-btn']}
        onClick={clearChanges}>
        Clear changes
      </button>
    </>

  )
};
export default observer(EditUserForm);