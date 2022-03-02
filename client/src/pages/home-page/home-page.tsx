import { Outlet } from "react-router-dom";

const HomePage = () => {
    return (
        <div>
            Home page
            <Outlet />
        </div>
    )
}
export default HomePage;