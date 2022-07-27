import { useCallback, useEffect, useMemo, useState } from "react";
import useFetching from "../../../../hooks/useFetching";
import { INotificationTypeObj } from "../../../../interfaces/services/notificationTypeServiceInterfaces";
import NotificationTypeService from "../../../../services/notification-type-service";
import MySelect, { MySelectOptionField } from "../../../../UI/my-select/my-select"

interface ISelectProps {
  disabled: boolean,
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void
}

const NotificationTypeSelect = ({ disabled, onChange }: ISelectProps) => {
  const [notificationTypes, setNotificationTypes] = useState<INotificationTypeObj[]>([]);
  const initialFields: MySelectOptionField[] = useMemo(() => (
    [
      { value: "undefined", name: "All types" },
      { value: null, name: "No type" }
    ]
  ), []);

  const selectFields: MySelectOptionField[] = useMemo(() => {
    const fields = notificationTypes.map(type => ({
      value: type.id,
      name: type.name
    }));

    return [...initialFields, ...fields]
  }, [notificationTypes, initialFields]);

  const getNotificationTypes = useCallback(async () => {
    const { data } = await NotificationTypeService.getNotificationTypes("", { id: 0, key: "createdAt", value: "", order: "DESC" }, undefined);
    setNotificationTypes(data.notificationTypes);
  }, []);
  const { executeCallback: fetchNotificationTypes, isLoading: typesLoading } = useFetching(getNotificationTypes);

  useEffect(() => {
    try {
      fetchNotificationTypes();
    } catch (e) {
      alert(e)
    }
  }, []);

  return <MySelect disabled={typesLoading || disabled} fields={selectFields} onChange={onChange} />
};

export default NotificationTypeSelect;