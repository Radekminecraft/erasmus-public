import { useEffect } from 'react';
import styles from '@/styles/login.module.css';
import Header from '@/components/Header/Header';
import { signIn } from 'next-auth/react';

export default function Login() {
  const click = () => {
    signIn("google", { callbackUrl: "/"})
  }
  useEffect(() => {
    const loadFacebookSDK = () => {
      if (window.FB) return;
      window.fbAsyncInit = function() {
        FB.init({
          appId: '1075624657468765',
          cookie: true,
          xfbml: true,
          version: 'v20.0'
        });

        FB.AppEvents.logPageView();
        console.log('Facebook SDK initialized');
      };

      (function(d, s, id) {
        var js, fjs = d.getElementsByTagName(s)[0];
        if (d.getElementById(id)) return;
        js = d.createElement(s); js.id = id;
        js.src = "https://connect.facebook.net/en_US/sdk.js";
        fjs.parentNode.insertBefore(js, fjs);
      }(document, 'script', 'facebook-jssdk'));
    };

    loadFacebookSDK();
  }, []);

  const handleFacebookLogin = () => {
    if (!window.FB) {
      console.error('Facebook SDK not loaded yet.');
      return;
    }

    FB.login(function(response) {
      if (response.authResponse) {
        console.log('Welcome! Fetching your information.... ');
        FB.api('/me', function(response) {
          console.log('Successful login for: ' + response.name);
        });
      } else {
        console.log('User cancelled login or did not fully authorize.');
      }
    }, {scope: 'public_profile,email'});
  };

  return (
    <div className={styles.loginBody}>
      <h1 className={styles.loginText}>Login/Sign In</h1>
      <div className={styles.logBox}>
        <div className={styles.innerLogBox}>
          <button className={styles.Google} onClick={click}>Log in via Google</button>
        </div>
        {/*<div className={styles.innerLogBox}>
          <button className={styles.Facebook} onClick={handleFacebookLogin}>Přihlásit přes Facebook</button>
        </div>*/}
      </div>
    </div>
  );
}
