"use client";

import { useEffect, useState } from "react";
import Script from "next/script";
import { isTestMode } from "./storage";
import { CONSENT_CHANGE_EVENT, readConsent } from "./consent";

/**
 * Google Analytics and Microsoft Clarity, loaded only for real visitors who chose "Accept" (decision 0012).
 * Nothing is requested before that choice. Test sessions never load either script, so a tester's visits are
 * not counted. Both checks need the browser, so the scripts are added after the page mounts; the host check
 * that limits them to production stays on the server in the layout.
 */
export default function AnalyticsScripts({ gaId, clarityId }: { gaId: string; clarityId: string }) {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (isTestMode()) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setEnabled(readConsent() === "accepted");
    // "Accept" starts analytics on this page. Withdrawing reloads the page (see writeConsent).
    const onChange = (event: Event) => setEnabled((event as CustomEvent<string>).detail === "accepted");
    window.addEventListener(CONSENT_CHANGE_EVENT, onChange);
    return () => window.removeEventListener(CONSENT_CHANGE_EVENT, onChange);
  }, []);

  if (!enabled) return null;

  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`} strategy="afterInteractive" />
      <Script id="ga4-init" strategy="afterInteractive">
        {`window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${gaId}');`}
      </Script>
      <Script id="ms-clarity-init" strategy="afterInteractive">
        {`(function(c,l,a,r,i,t,y){
          c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
          t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
          y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
        })(window, document, "clarity", "script", "${clarityId}");`}
      </Script>
    </>
  );
}
