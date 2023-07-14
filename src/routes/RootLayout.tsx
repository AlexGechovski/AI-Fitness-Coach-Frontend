import Navbar from "./Navbar";
import { Outlet } from "react-router-dom";

interface RootLayoutProps {
    token: string | null;
    handleTokenUpdate: (newToken: string | null) => void;
  }
  

function RootLayout({ token, handleTokenUpdate }: RootLayoutProps){
    return (
        <>
        
        <Navbar token={token} handleTokenUpdate={handleTokenUpdate} />
        <Outlet />
        </>
    )
}
export default RootLayout;