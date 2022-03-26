import React, { useEffect } from "react";

const AdBanner = () => {
  useEffect(() => {
    try {
      ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push(
        {}
      );
    } catch (err) {
      console.log(err);
    }
  }, []);

  return (
    <div className="w-full">
      <ins
        className="adsbygoogle adbanner-customize w-full"
        style={{
          display: "block",
        }}
        data-ad-layout-key="-gu-18+5g-2f-83"
        data-ad-client="ca-pub-7796839762449273"
        data-ad-slot="3775988082"
      />
    </div>
  );
};

export default AdBanner;
