import AdminCabinet from "../../pages/admin-cabinet/admin-cabinet";
import HomePage from "../../pages/home-page/home-page";
import UserCabinet from "../../pages/user-cabinet/user-cabinet";
import UserPage from "../../pages/user-page/user-page";
import MyGallery from "../my-gallery/my-gallery";

export const routePaths = {
    mainPage: '/',
    userPage: '/user/:userId',
    personalCabinet: {
        main: '/personalCabinet',
        adminPanel: 'adminPanel',
        myGallery: 'myGallery'
    },

}

export const guestPaths = [
    {
        id: 1,
        inNavBar: true,
        name: 'Home',
        path: routePaths.mainPage,
        component: HomePage
    },
    {
        id: 2,
        inNavBar: false,
        name: 'User page',
        path: routePaths.userPage,
        component: UserPage
    },
];
export const userPaths = [
    {
        id: 2,
        inNavBar: true,
        name: 'Personal cabinet',
        path: routePaths.personalCabinet.main,
        component: UserCabinet,
        subPaths: [
            {
                id: 1,
                name: 'Admin panel',
                path: routePaths.personalCabinet.adminPanel,
                component: AdminCabinet
            },
            {
                id: 2,
                name: 'My gallery',
                path: routePaths.personalCabinet.myGallery,
                component: MyGallery
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