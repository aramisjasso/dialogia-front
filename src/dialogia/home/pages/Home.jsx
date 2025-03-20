import { Outlet} from "react-router-dom";
import AppBar from "../../../share/bars/components/DialogiaAppBar"

export default function Home() {
    return (
       <div id='div-home'>
         {/* <h2>Home Page - Dialogia</h2> */}
         <div id='div-appbar'>
            <AppBar/>
         </div>
         <div id="detail"> 
            <Outlet /> 
         </div> 
      </div>  
    );
  }