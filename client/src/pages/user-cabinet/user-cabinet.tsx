import { useContext } from "react";
import { Context } from "../..";

const UserCabinet = () => {
    const { userStore } = useContext(Context);
    return (
        <div>
            User cabinet
            <button onClick={() => userStore.logout()}>logout</button>
        </div>
    )
};
export default UserCabinet;