import SearchInput from "../../../UI/search-input/search-input"
import NotificationTypeSelect from "../inputs/notification-type-select/notification-type-select";
import NotificationsSortSelect from "../inputs/notifications-sort-select/notifications-sort-select"

import panelStyles from "./notification-search-panel.module.css";

interface ISearchPanelProps {
  onQueryStringChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
  onOrderSelectChange: (e: React.ChangeEvent<HTMLSelectElement>) => void,
  onNotificationTypeSelectChange: (e: React.ChangeEvent<HTMLSelectElement>) => void,
  isLoading: boolean
}

const NotificationSearchPanel = ({ onQueryStringChange, onOrderSelectChange, onNotificationTypeSelectChange, isLoading }: ISearchPanelProps) => {
  return <div className={panelStyles["search-panel"]}>
    <SearchInput disabled={isLoading} onChange={onQueryStringChange} />
    <NotificationsSortSelect disabled={isLoading} onChange={onOrderSelectChange} />
    <NotificationTypeSelect disabled={isLoading} onChange={onNotificationTypeSelectChange} />
  </div>
};

export default NotificationSearchPanel;