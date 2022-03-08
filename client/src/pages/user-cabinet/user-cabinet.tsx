
import { Link, Outlet } from "react-router-dom";
import LogoutBtn from "../../components/btns/logout-btn/logout-btn";

const UserCabinet = () => {
    return (
        <div>
            User cabinet
            <LogoutBtn stylesById="" />
            <Link to='adminPanel'>Test</Link>
            <Outlet />
        </div>
    )
};
export default UserCabinet;