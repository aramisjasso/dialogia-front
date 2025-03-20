import { RouterProvider } from "react-router-dom";
import  DialogiaRouter from "./navigation/NaviRoutesDialogia";
import Footer from "./share/footer/components/Footer";

export default function AppDialogia() {
    return (
        <>
            <div id='div-app'>
            <h1>Dialogia</h1>
                <RouterProvider router={DialogiaRouter} />
                <div id='div-footer'>
                    <Footer />
                </div>
            </div>
        </> 
    );
}