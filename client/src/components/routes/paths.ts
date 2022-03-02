import AdminCabinet from "../../pages/admin-cabinet/admin-cabinet";
import HomePage from "../../pages/home-page/home-page";
import UserCabinet from "../../pages/user-cabinet/user-cabinet";

export const guestPaths = [
    {
        name: 'Home',
        path: '/',
        component: HomePage
    }
];
export const userPaths = [
    {
        name: 'Personal cabinet',
        path: '/personalCabinet',
        component: UserCabinet
    }
];
export const adminPaths = [
    {
        name: 'Admin cabinet',
        path: '/adminCabinet',
        component: AdminCabinet
    }
];