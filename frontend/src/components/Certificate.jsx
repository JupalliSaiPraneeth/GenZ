import React, { useEffect, useRef, useState } from "react";

/*
===============================================================
 GEN Z VOICES - CERTIFICATE OF PARTICIPATION
===============================================================

Required files:

public/
│
├── logo.png
├── nrilogo.png
│
└── signatures/
    ├── convener-signature.png
    └── coordinator-signature.png

The signature photographs are processed in the browser:
- Original handwritten strokes are preserved
- Light paper/background is removed
- Signature is converted to black ink
- Transparent background is created
===============================================================
*/


/* ============================================================
   SIGNATURE PROCESSOR
   ============================================================ */

const Signature = ({
  src,
  alt,
  className = "",
  threshold = 220,
}) => {
  const canvasRef = useRef(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const img = new Image();

    img.onload = () => {
      const canvas = canvasRef.current;

      if (!canvas) return;

      const ctx = canvas.getContext("2d", {
        willReadFrequently: true,
      });

      const MAX_WIDTH = 1000;

      let width = img.naturalWidth;
      let height = img.naturalHeight;

      /*
       Keep enough resolution while avoiding
       unnecessarily huge canvas processing.
      */
      if (width > MAX_WIDTH) {
        const ratio = MAX_WIDTH / width;

        width = MAX_WIDTH;
        height = Math.round(height * ratio);
      }

      canvas.width = width;
      canvas.height = height;

      ctx.clearRect(0, 0, width, height);

      ctx.drawImage(
        img,
        0,
        0,
        width,
        height
      );

      const imageData = ctx.getImageData(
        0,
        0,
        width,
        height
      );

      const pixels = imageData.data;

      /*
       Convert photographed paper background
       into transparency.

       Dark handwritten ink remains.
      */

      for (let i = 0; i < pixels.length; i += 4) {
        const origAlpha = pixels[i + 3];
        if (origAlpha === 0) continue; // Keep already-transparent pixels transparent

        const r = pixels[i];
        const g = pixels[i + 1];
        const b = pixels[i + 2];

        /*
         Luminance calculation
        */
        const brightness =
          0.299 * r +
          0.587 * g +
          0.114 * b;

        /*
         Dark pixels = signature
         Light pixels = background
        */
        if (brightness >= threshold) {
          pixels[i + 3] = 0;
        } else {
          pixels[i] = 10;
          pixels[i + 1] = 15;
          pixels[i + 2] = 20;
          pixels[i + 3] = origAlpha;
        }
      }

      ctx.putImageData(
        imageData,
        0,
        0
      );

      setReady(true);
    };

    img.onerror = () => {
      console.error(
        `Unable to load signature: ${src}`
      );
    };

    img.src = src;
  }, [src, threshold]);

  return (
    <canvas
      ref={canvasRef}
      className={`signature-canvas ${className}`}
      aria-label={alt}
      style={{
        opacity: ready ? 1 : 0,
      }}
    />
  );
};


/* ============================================================
   CERTIFICATE COMPONENT
   ============================================================ */

const Certificate = ({
  participantName = "Your Name",
  completionDate = "September 18, 2026",
  certificateNumber = "CERT-GZ2026-89421",
}) => {

  return (
    <>
      <style>{`

        /* =====================================================
           GLOBAL
        ===================================================== */

        * {
          box-sizing: border-box;
        }

        body {
          margin: 0;
          padding: 0;
          background: #f2f4f3;
          font-family:
            "Montserrat",
            "Inter",
            Arial,
            sans-serif;
        }


        /* =====================================================
           CERTIFICATE WRAPPER
        ===================================================== */

        .certificate-wrapper {
          width: 100%;
          min-height: 100vh;
          overflow-x: auto;

          padding: 20px;

          display: flex;
          justify-content: center;
          align-items: center;
        }


        /* =====================================================
           MAIN CERTIFICATE
        ===================================================== */

        .certificate {
          position: relative;

          width: 1200px;
          height: 800px;

          overflow: hidden;

          background:
            radial-gradient(
              circle at 50% 45%,
              #ffffff 0%,
              #fcfdfa 60%,
              #f3f7f2 100%
            );

          color: #092d35;

          box-shadow:
            0 20px 60px
            rgba(7, 93, 99, 0.12);

          flex-shrink: 0;
        }


        /* =====================================================
           OUTER BORDER
        ===================================================== */

        .certificate-border-outer {
          position: absolute;

          top: 14px;
          left: 14px;
          right: 14px;
          bottom: 14px;

          border: 2px solid #087f82;

          pointer-events: none;

          z-index: 100;
        }


        /* =====================================================
           INNER GOLD BORDER
        ===================================================== */

        .certificate-border-inner {
          position: absolute;

          top: 20px;
          left: 20px;
          right: 20px;
          bottom: 20px;

          border: 1px solid #dcae45;

          pointer-events: none;

          z-index: 100;
        }


        /* =====================================================
           CORNER ACCENTS
        ===================================================== */

        .corner-accent {
          position: absolute;

          width: 40px;
          height: 40px;

          pointer-events: none;

          z-index: 105;
        }

        .corner-top-left {
          top: 24px;
          left: 24px;

          border-top: 3px solid #087f82;
          border-left: 3px solid #087f82;
        }

        .corner-top-right {
          top: 24px;
          right: 24px;

          border-top: 3px solid #087f82;
          border-right: 3px solid #087f82;
        }

        .corner-bottom-left {
          bottom: 24px;
          left: 24px;

          border-bottom: 3px solid #087f82;
          border-left: 3px solid #087f82;
        }

        .corner-bottom-right {
          bottom: 24px;
          right: 24px;

          border-bottom: 3px solid #087f82;
          border-right: 3px solid #087f82;
        }


        /* =====================================================
           DECORATIVE WAVES
        ===================================================== */

        .wave {
          position: absolute;
          pointer-events: none;
        }


        /* LEFT */

        .wave-left-1 {
          width: 340px;
          height: 860px;

          left: -250px;
          bottom: -150px;

          background: #087f82;

          border-radius: 50%;

          transform: rotate(-28deg);

          opacity: 0.95;

          z-index: 1;
        }

        .wave-left-2 {
          width: 300px;
          height: 900px;

          left: -210px;
          bottom: -170px;

          background: #56bfc0;

          border-radius: 50%;

          transform: rotate(-28deg);

          opacity: 0.9;

          z-index: 1;
        }

        .wave-left-3 {
          width: 230px;
          height: 900px;

          left: -140px;
          bottom: -180px;

          background: #d9f1ed;

          border-radius: 50%;

          transform: rotate(-28deg);

          opacity: 0.85;

          z-index: 1;
        }


        /* TOP RIGHT */

        .wave-right-1 {
          width: 500px;
          height: 250px;

          right: -220px;
          top: -120px;

          border-radius: 50%;

          background: #9bd9d7;

          transform: rotate(25deg);

          opacity: 0.75;

          z-index: 1;
        }

        .wave-right-2 {
          width: 420px;
          height: 190px;

          right: -180px;
          top: -90px;

          border-radius: 50%;

          background: #e4f4ef;

          transform: rotate(25deg);

          opacity: 0.8;

          z-index: 1;
        }


        /* BOTTOM RIGHT */

        .wave-right-3 {
          width: 500px;
          height: 300px;

          right: -250px;
          bottom: -170px;

          background:
            linear-gradient(
              135deg,
              #e1efbf,
              #4aa89b
            );

          border-radius: 50%;

          transform: rotate(-25deg);

          opacity: 0.85;

          z-index: 1;
        }


        /* =====================================================
           GEN Z LOGO
        ===================================================== */

        .genz-logo-container {
          position: absolute;

          left: 40px;
          top: 28px;

          z-index: 20;

          display: flex;
          flex-direction: column;
          align-items: flex-start;
        }

        .genz-logo-img {
          height: 135px;
          width: auto;

          object-fit: contain;

          filter:
            drop-shadow(
              0 4px 8px
              rgba(0, 0, 0, 0.12)
            );
        }

        .genz-tagline {
          margin-top: 10px;

          font-size: 11.5px;

          font-weight: 800;

          letter-spacing: 3.5px;

          line-height: 1.4;

          color: #075d63;

          text-transform: uppercase;
        }


        /* =====================================================
           NRI LOGO - TOP RIGHT
        ===================================================== */

        .nri-top-logo {
          position: absolute;

          top: 28px;
          right: 58px;

          z-index: 20;

          height: 92px;

          width: auto;

          object-fit: contain;

          filter:
            drop-shadow(
              0 3px 6px
              rgba(0, 0, 0, 0.10)
            );
        }


        /* =====================================================
           MAIN HEADING
        ===================================================== */

        .certificate-heading {
          position: absolute;

          top: 125px;
          left: 50%;

          transform: translateX(-50%);

          text-align: center;

          z-index: 20;

          width: 760px;
        }

        .certificate-heading h1 {
          margin: 0;

          font-family:
            "Montserrat",
            Arial,
            sans-serif;

          font-size: 64px;

          font-weight: 900;

          letter-spacing: 3px;

          color: #063e46;

          line-height: 1;

          text-shadow:
            0 1px 2px
            rgba(6, 62, 70, 0.1);
        }

        .heading-subtitle {
          display: flex;

          justify-content: center;
          align-items: center;

          gap: 20px;

          margin-top: 14px;

          font-size: 23px;

          font-weight: 700;

          letter-spacing: 8px;

          color: #075d63;

          text-transform: uppercase;
        }

        .heading-subtitle span {
          width: 60px;
          height: 2px;

          background:
            linear-gradient(
              90deg,
              transparent,
              #167d83,
              transparent
            );
        }


        /* =====================================================
           MAIN CONTENT
        ===================================================== */

        .certificate-content {
          position: absolute;

          top: 265px;
          left: 50%;

          transform: translateX(-50%);

          width: 780px;

          text-align: center;

          z-index: 20;
        }

        .certify {
          margin: 0;

          font-size: 14px;

          font-weight: 800;

          letter-spacing: 6px;

          color: #172e33;

          text-transform: uppercase;
        }


        /* =====================================================
           PARTICIPANT NAME
        ===================================================== */

        .participant-name {
          margin: 14px 0 0;

          font-family:
            Georgia,
            "Times New Roman",
            serif;

          font-size: 54px;

          font-weight: 700;

          color: #08606a;

          line-height: 1.15;

          min-height: 80px;

          text-shadow:
            0 1px 2px
            rgba(8, 96, 106, 0.15);
        }

        .name-line {
          width: 560px;

          height: 2px;

          background:
            linear-gradient(
              90deg,
              transparent,
              #438e94,
              transparent
            );

          margin: 4px auto 18px;
        }


        /* =====================================================
           DESCRIPTION
        ===================================================== */

        .completion-text {
          font-size: 18px;

          margin: 0;

          color: #182c31;

          font-weight: 500;
        }

        .completion-text strong {
          color: #075d63;

          font-weight: 800;
        }

        .description {
          margin-top: 10px;

          font-size: 16.5px;

          line-height: 1.55;

          color: #25363a;

          font-weight: 400;
        }

        .thank-you {
          margin-top: 16px;

          font-size: 18.5px;

          font-weight: 700;

          color: #063e46;
        }


        /* =====================================================
           IMPACT LINE
        ===================================================== */

        .impact-line {
          display: flex;

          align-items: center;

          justify-content: center;

          gap: 20px;

          margin-top: 18px;

          font-size: 12px;

          font-weight: 800;

          letter-spacing: 5px;

          color: #27838a;

          text-transform: uppercase;
        }

        .impact-line span {
          width: 55px;
          height: 1px;

          background: #27838a;
        }


        /* =====================================================
           GOLD BADGE
        ===================================================== */

        .badge {
          position: absolute;

          right: 75px;
          top: 175px;

          width: 155px;
          height: 155px;

          border-radius: 50%;

          background:
            linear-gradient(
              135deg,
              #f6df86 0%,
              #dcae45 50%,
              #b8860b 100%
            );

          padding: 8px;

          box-shadow:
            0 8px 24px
            rgba(7, 62, 67, 0.22);

          z-index: 25;
        }

        .badge-inner {
          width: 100%;
          height: 100%;

          border-radius: 50%;

          background:
            radial-gradient(
              circle,
              #075d63 0%,
              #063e46 100%
            );

          border: 3px solid #f6df86;

          display: flex;

          flex-direction: column;

          align-items: center;

          justify-content: center;

          text-align: center;

          color: #ffe69b;

          box-shadow:
            inset 0 2px 6px
            rgba(0, 0, 0, 0.4);
        }

        .crown {
          font-size: 22px;

          line-height: 1;

          color: #f6df86;

          filter:
            drop-shadow(
              0 1px 2px
              rgba(0, 0, 0, 0.3)
            );
        }

        .badge-text {
          margin-top: 4px;

          font-size: 12px;

          font-weight: 900;

          line-height: 1.25;

          letter-spacing: 1px;

          text-transform: uppercase;
        }

        .stars {
          margin-top: 4px;

          font-size: 11px;

          color: #f6df86;

          letter-spacing: 2px;
        }


        /* =====================================================
           BADGE RIBBONS
        ===================================================== */

        .ribbon-left,
        .ribbon-right {
          position: absolute;

          width: 36px;
          height: 75px;

          bottom: -50px;

          background: #07666b;

          z-index: -1;

          box-shadow:
            0 4px 10px
            rgba(0, 0, 0, 0.15);
        }

        .ribbon-left {
          left: 24px;

          transform: rotate(14deg);

          clip-path:
            polygon(
              0 0,
              100% 0,
              100% 100%,
              50% 80%,
              0 100%
            );
        }

        .ribbon-right {
          right: 24px;

          transform: rotate(-14deg);

          clip-path:
            polygon(
              0 0,
              100% 0,
              100% 100%,
              50% 80%,
              0 100%
            );
        }


        /* =====================================================
           SIGNATURE AREA
        ===================================================== */

        .signature-section {
          position: absolute;

          bottom: 72px;

          z-index: 30;

          text-align: center;
        }


        /* LEFT SIGNATURE */

        .convener-section {
          left: 175px;

          width: 300px;
        }


        /* RIGHT SIGNATURE */

        .coordinator-section {
          right: 165px;

          width: 300px;
        }


        /* SIGNATURE CANVAS */

        .signature-canvas {
          display: block;

          width: 160px;
          height: 85px;

          object-fit: contain;

          margin: 0 auto -4px;

          background: transparent;

          transition: opacity 0.2s ease;
        }


        /* Slightly larger first signature */

        .convener-section .signature-canvas {
          width: 165px;
          height: 90px;
        }


        /* Second signature */

        .coordinator-section .signature-canvas {
          width: 170px;
          height: 85px;
        }


        /* SIGNATURE LINE */

        .signature-line {
          width: 290px;

          height: 1.5px;

          margin: 0 auto 7px;

          background: #0d4c63;
        }


        /* NAME */

        .signatory-name {
          font-size: 17px;

          font-weight: 800;

          color: #0b4660;

          line-height: 1.2;
        }


        /* TITLE */

        .signatory-title {
          margin-top: 3px;

          font-size: 14px;

          color: #173a45;

          line-height: 1.3;
        }

        .signatory-department {
          font-size: 13px;

          color: #173a45;

          line-height: 1.25;
        }


        /* =====================================================
           DATE - CENTER
        ===================================================== */

        .date-section {
          position: absolute;

          bottom: 93px;

          left: 50%;

          transform: translateX(-50%);

          width: 230px;

          text-align: center;

          z-index: 30;
        }

        .date {
          font-family:
            Georgia,
            "Times New Roman",
            serif;

          font-size: 17.5px;

          font-weight: 700;

          color: #063e46;
        }

        .date-line {
          height: 1.5px;

          width: 100%;

          background:
            linear-gradient(
              90deg,
              transparent,
              #4c777c,
              transparent
            );

          margin-top: 6px;
        }

        .date-label {
          margin-top: 6px;

          font-size: 10.5px;

          font-weight: 800;

          letter-spacing: 3.5px;

          color: #263b3f;

          text-transform: uppercase;
        }


        /* =====================================================
           FOOTER
        ===================================================== */

        .footer {
          position: absolute;
          bottom: 28px;
          left: 50%;
          transform: translateX(-50%);
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 5px;
          color: #075d63;
          z-index: 30;
          white-space: nowrap;
          text-transform: uppercase;
        }

        .cert-id-corner {
          position: absolute;
          bottom: 26px;
          right: 48px;
          font-family: monospace, "Courier New", sans-serif;
          font-size: 11px;
          font-weight: 700;
          color: #075d63;
          letter-spacing: 0.5px;
          z-index: 30;
        }

        .cert-verify-corner {
          position: absolute;
          bottom: 26px;
          left: 48px;
          font-family: "Montserrat", sans-serif;
          font-size: 10px;
          font-weight: 800;
          color: #075d63;
          letter-spacing: 1px;
          z-index: 30;
          text-transform: uppercase;
        }


        /* =====================================================
           RESPONSIVE PREVIEW
        ===================================================== */

        @media screen and (max-width: 1250px) {

          .certificate-wrapper {
            justify-content: flex-start;
          }

        }


        /* =====================================================
           PRINT
        ===================================================== */

        @media print {

          @page {
            size: landscape;
            margin: 0;
          }

          html,
          body {
            width: 100%;
            height: 100%;
            background: white;
          }

          .certificate-wrapper {
            padding: 0;

            width: 100%;
            height: 100%;

            min-height: 0;

            display: flex;

            justify-content: center;
            align-items: center;
          }

          .certificate {
            margin: 0;

            width: 1200px;
            height: 800px;

            box-shadow: none;

            transform: none;
          }
        }

      `}</style>


      {/* ========================================================
          CERTIFICATE
      ======================================================== */}

      <div className="certificate-wrapper">

        <div className="certificate">


          {/* ====================================================
              DECORATIVE WAVES
          ==================================================== */}

          <div className="wave wave-left-1"></div>

          <div className="wave wave-left-2"></div>

          <div className="wave wave-left-3"></div>

          <div className="wave wave-right-1"></div>

          <div className="wave wave-right-2"></div>

          <div className="wave wave-right-3"></div>


          {/* ====================================================
              BORDERS
          ==================================================== */}

          <div className="certificate-border-outer"></div>

          <div className="certificate-border-inner"></div>


          {/* ====================================================
              CORNERS
          ==================================================== */}

          <div className="
            corner-accent
            corner-top-left
          "></div>

          <div className="
            corner-accent
            corner-top-right
          "></div>

          <div className="
            corner-accent
            corner-bottom-left
          "></div>

          <div className="
            corner-accent
            corner-bottom-right
          "></div>


          {/* ====================================================
              GEN Z LOGO
          ==================================================== */}

          <div className="genz-logo-container">

            <img
              src="/logo.png"
              alt="Gen Z Voices"
              className="genz-logo-img"
            />

            <div className="genz-tagline">
              VOICES TODAY
              &nbsp; | &nbsp;
              A BRIGHTER TOMORROW
            </div>

          </div>


          {/* ====================================================
              NRI LOGO - TOP RIGHT
          ==================================================== */}

          <img
            src="/nrilogo.png"
            alt="Dr. RVR NRI Institute of Technology Deemed to be University"
            className="nri-top-logo"
          />


          {/* ====================================================
              MAIN HEADING
          ==================================================== */}

          <div className="certificate-heading">

            <h1>
              CERTIFICATE
            </h1>

            <div className="heading-subtitle">

              <span></span>

              OF PARTICIPATION

              <span></span>

            </div>

          </div>


          {/* ====================================================
              MAIN CONTENT
          ==================================================== */}

          <div className="certificate-content">

            <p className="certify">
              THIS IS TO CERTIFY THAT
            </p>


            <h2 className="participant-name">
              {participantName}
            </h2>


            <div className="name-line"></div>


            <p className="completion-text">

              has successfully completed the{" "}

              <strong>
                Gen Z Survey
              </strong>

              .

            </p>


            <p className="description">

              Your valuable insights have contributed to a
              better understanding

              <br />

              of Gen Z perspectives and will help shape a
              brighter, more inclusive future.

            </p>


            <p className="thank-you">

              Thank you for making your voice count!

            </p>


            <div className="impact-line">

              <span></span>

              SMALL RESPONSES. BIGGER CHANGE.

              <span></span>

            </div>

          </div>


          {/* ====================================================
              GOLD BADGE
          ==================================================== */}

          <div className="badge">

            <div className="badge-inner">

              <div className="crown">
                ♛
              </div>

              <div className="badge-text">

                GEN Z

                <br />

                MAKES A

                <br />

                DIFFERENCE

              </div>

              <div className="stars">
                ★★★
              </div>

            </div>


            <div className="ribbon-left"></div>

            <div className="ribbon-right"></div>

          </div>


          {/* ====================================================
              LEFT SIGNATURE
              DR. K.V. SAMBASIVARAO
          ==================================================== */}

          <div className="
            signature-section
            convener-section
          ">

            <Signature
              src="/signatures/convener-signature.png"
              alt="Dr. K.V. Sambasivarao signature"
              className="convener-signature"
            />


            <div className="signature-line"></div>


            <div className="signatory-name">
              Dr. K.V. Sambasivarao
            </div>


            <div className="signatory-title">
              Convener (Research Analytical Group)
            </div>


            <div className="signatory-department">
              Director of Research &amp; Development,
            </div>


            <div className="signatory-department">
              CSE Dept.
            </div>

          </div>


          {/* ====================================================
              CENTER DATE
          ==================================================== */}

          <div className="date-section">

            <div className="date">
              {completionDate}
            </div>

            <div className="date-line"></div>

            <div className="date-label">
              DATE OF COMPLETION
            </div>

          </div>


          {/* ====================================================
              RIGHT SIGNATURE
              J. SAI PRANEETH
          ==================================================== */}

          <div className="
            signature-section
            coordinator-section
          ">

            <Signature
              src="/signatures/coordinator-signature.png"
              alt="J. Sai Praneeth signature"
              className="coordinator-signature"
            />


            <div className="signature-line"></div>


            <div className="signatory-name">
              J. Sai Praneeth
            </div>


            <div className="signatory-title">
              Coordinator (Research Analytical Group)
            </div>


            <div className="signatory-department">
              CSE Dept.
            </div>

          </div>


          {/* ====================================================
              FOOTER
          ==================================================== */}

          <div className="cert-verify-corner">
            VERIFIED AUTHENTIC DOCUMENT
          </div>

          <div className="footer">
            LISTEN &nbsp; | &nbsp; LEARN &nbsp; | &nbsp; BUILD TOGETHER
          </div>

          <div className="cert-id-corner">
            Certificate ID: {certificateNumber}
          </div>


        </div>

      </div>
    </>
  );
};


export default Certificate;