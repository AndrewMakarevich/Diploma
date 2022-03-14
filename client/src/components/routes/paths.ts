import AdminCabinet from "../../pages/admin-cabinet/admin-cabinet";
import HomePage from "../../pages/home-page/home-page";
import UserCabinet from "../../pages/user-cabinet/user-cabinet";

export const guestPaths = [
    {
        id: 1,
        name: 'Home',
        path: '/',
        component: HomePage
    }
];
export const userPaths = [
    {
        id: 2,
        name: 'Personal cabinet',
        path: '/personalCabinet',
        component: UserCabinet,
        subPaths: [
            {
                id: 1,
                name: 'Admin panel',
                path: 'adminPanel',
                component: AdminCabinet
            }
        ]
    }
];
// export const adminPaths = [
//     {
//         name: 'Admin cabinet',
//         path: '/adminCabinet',
//         component: AdminCabinet
//     }
// ];