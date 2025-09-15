import { Routes, Route } from "react-router-dom";
import { RouterContainer } from "./routerContainer";
import { Screen } from "../views/Screen";


export const AppRoutes = () => {
    return (
        <Routes>
            <Route path={RouterContainer.ScreenView} element={<Screen />}></Route>
        </Routes>
    );
};