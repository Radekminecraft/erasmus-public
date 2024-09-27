import { signOut } from "next-auth/react";
import { Link } from "next/link";

function Header({ session }) {
  return (
    <header className="header">
      <a className="header-title" href=".">Parkago</a>
      <div className="header-links">
        {session ? 
          (
            <>
              <a className="header-link" href="/login" onClick={() => signOut({redirect: true, callbackUrl: "/"})}>Logout</a>
              <a className="header-link" href="/createParking">Create a parking spot</a>
            </>
          )
           : (
            <a className="header-link" href="/login">Login</a>
           )}
      </div>
    </header>
  );
}
export default Header;