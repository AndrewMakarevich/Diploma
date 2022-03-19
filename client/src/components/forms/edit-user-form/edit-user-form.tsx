import { observer } from 'mobx-react-lite';
import { useContext, useEffect, useRef, useState } from 'react';
import formStyles from './edit-user-form.module.css';
import { Context } from '../../..';
import MySelect from '../../inputs/pair-select';
import countriesList from '../../../consts/countries-list/countries-list';


interface IUserDataToEdit {
  [key: string]: any,
  avatar: File | undefined,
  profileBackground: File | undefined,
  nickname: string,
  firstName: string,
  surname: string,
  country: string,
  city: string
}

const EditUserForm = () => {
  const { userStore } = useContext(Context);
  const [userDataToEdit, setUserDataToEdit] = useState<IUserDataToEdit>({
    avatar: undefined,
    profileBackground: undefined,
    nickname: userStore.userData.nickname,
    firstName: userStore.userData.firstName,
    surname: userStore.userData.surname,
    country: userStore.userData.country,
    city: userStore.userData.city
  });
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const profileBackgroundInputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

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
    formRef.current?.reset();
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

  useEffect(() => {
    console.log(userDataToEdit);
  }, [userDataToEdit])

  return (
    <>
      <form ref={formRef} className={formStyles['form']}>
        <label className={formStyles['form__file-input-label']}>
          <input
            ref={avatarInputRef}
            className={formStyles['form__file-input']}
            type="file"
            accept='image/jpeg, image/jpg, image/png, image/webm'
            onChange={(e) => setUserDataToEdit({ ...userDataToEdit, avatar: e.target.files?.[0] })} />
          <span className={formStyles['label__header']}>Avatar</span>
        </label>
        <label>
          ProfileBackground
          <input
            ref={profileBackgroundInputRef}
            type="file"
            accept='image/jpeg, image/jpg, image/png, image/webm'
            onChange={(e) => setUserDataToEdit({ ...userDataToEdit, profileBackground: e.target.files?.[0] })}></input>
        </label>
        <label className={formStyles['form__label']}>
          Nickname:
          <input className={formStyles['form__input']}
            value={userDataToEdit.nickname}
            onChange={(e) => setUserDataToEdit({ ...userDataToEdit, nickname: e.target.value })} />
        </label>
        <label className={formStyles['form__label']}>
          FirstName:
          <input className={formStyles['form__input']}
            value={userDataToEdit.firstName}
            onChange={(e) => setUserDataToEdit({ ...userDataToEdit, firstName: e.target.value })} />
        </label>
        <label className={formStyles['form__label']}>
          FirstName:
          <input className={formStyles['form__input']}
            value={userDataToEdit.surname}
            onChange={(e) => setUserDataToEdit({ ...userDataToEdit, surname: e.target.value })} />
        </label>
        <label>
          <MySelect<IUserDataToEdit>
            valuesObj={countriesList}
            state={userDataToEdit}
            setState={setUserDataToEdit}
            firstOptName='country'
            secOptName='city' />
        </label>
        <button onClick={(e) => {
          e.preventDefault();
          userStore.editMyself(groupData());
        }
        }>Submit changes</button>
      </form>

      <button onClick={clearChanges}>
        Clear changes
      </button>
    </>

  )
};
export default observer(EditUserForm);