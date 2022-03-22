import AdminCabinet from "../../pages/admin-cabinet/admin-cabinet";
import HomePage from "../../pages/home-page/home-page";
import UserCabinet from "../../pages/user-cabinet/user-cabinet";
import EditUserModal from "../modal-window/edit-user-modal/edit-user-modal";

export const routePaths = {
    mainPage: '/',
    personalCabinet: {
        main: '/personalCabinet',
        adminPanel: 'adminPanel',
        editor: 'editor'
    },

}

export const guestPaths = [
    {
        id: 1,
        name: 'Home',
        path: routePaths.mainPage,
        component: HomePage
    }
];
export const userPaths = [
    {
        id: 2,
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
            // {
            //     id: 2,
            //     name: 'Editor',
            //     path: routePaths.personalCabinet.editor,
            //     component: EditUserModal
            // }
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