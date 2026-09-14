import React from "react";

const Certificate = ({
  participantName = "Your Name",
  completionDate = "September 14, 2026",
}) => {
  return (
    <>
      <style>{`
        * {
          box-sizing: border-box;
        }

        body {
          margin: 0;
          padding: 0;
          background: #f2f4f3;
          font-family: "Montserrat", "Inter", Arial, sans-serif;
        }

        /* =========================================
           CERTIFICATE CONTAINER
        ========================================= */

        .certificate-wrapper {
          width: 100%;
          overflow-x: auto;
          padding: 20px;
          display: flex;
          justify-content: center;
        }

        .certificate {
          position: relative;
          width: 1200px;
          height: 800px;
          overflow: hidden;
          background: radial-gradient(
            circle at 50% 45%,
            #ffffff 0%,
            #fcfdfa 60%,
            #f3f7f2 100%
          );
          color: #092d35;
          box-shadow: 0 20px 60px rgba(7, 93, 99, 0.12);
        }

        /* =========================================
           BORDERS & ACCENTS
        ========================================= */

        .certificate-border-outer {
          position: absolute;
          top: 14px;
          left: 14px;
          right: 14px;
          bottom: 14px;
          border: 2px solid #087f82;
          pointer-events: none;
          z-index: 50;
        }

        .certificate-border-inner {
          position: absolute;
          top: 20px;
          left: 20px;
          right: 20px;
          bottom: 20px;
          border: 1px solid #dcae45;
          pointer-events: none;
          z-index: 50;
        }

        /* CORNER ACCENTS */
        .corner-accent {
          position: absolute;
          width: 40px;
          height: 40px;
          pointer-events: none;
          z-index: 52;
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

        /* =========================================
           DECORATIVE WAVES
        ========================================= */

        .wave {
          position: absolute;
          pointer-events: none;
        }

        /* LEFT WAVES */
        .wave-left-1 {
          width: 340px;
          height: 860px;
          left: -250px;
          bottom: -150px;
          background: #087f82;
          border-radius: 50%;
          transform: rotate(-28deg);
          opacity: 0.95;
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
        }

        /* RIGHT TOP WAVES */
        .wave-right-1 {
          width: 500px;
          height: 250px;
          right: -220px;
          top: -120px;
          border-radius: 50%;
          background: #9bd9d7;
          transform: rotate(25deg);
          opacity: 0.75;
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
        }

        /* RIGHT BOTTOM WAVE */
        .wave-right-3 {
          width: 500px;
          height: 300px;
          right: -250px;
          bottom: -170px;
          background: linear-gradient(135deg, #e1efbf, #4aa89b);
          border-radius: 50%;
          transform: rotate(-25deg);
          opacity: 0.85;
        }

        /* =========================================
           GEN Z LOGO HEADER (TOP LEFT)
        ========================================= */

        .genz-logo-container {
          position: absolute;
          left: 40px;
          top: 28px;
          z-index: 10;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
        }

        .genz-logo-img {
          height: 135px;
          width: auto;
          object-fit: contain;
          filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.12));
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

        /* =========================================
           MAIN HEADING
        ========================================= */

        .certificate-heading {
          position: absolute;
          top: 125px;
          left: 50%;
          transform: translateX(-50%);
          text-align: center;
          z-index: 10;
          width: 760px;
        }

        .certificate-heading h1 {
          margin: 0;
          font-family: "Montserrat", "Playfair Display", serif;
          font-size: 64px;
          font-weight: 900;
          letter-spacing: 3px;
          color: #063e46;
          line-height: 1;
          text-shadow: 0 1px 2px rgba(6, 62, 70, 0.1);
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
          background: linear-gradient(90deg, transparent, #167d83, transparent);
        }

        /* =========================================
           MAIN CONTENT
        ========================================= */

        .certificate-content {
          position: absolute;
          top: 265px;
          left: 50%;
          transform: translateX(-50%);
          width: 780px;
          text-align: center;
          z-index: 10;
        }

        .certify {
          margin: 0;
          font-size: 14px;
          font-weight: 800;
          letter-spacing: 6px;
          color: #172e33;
          text-transform: uppercase;
        }

        /* PARTICIPANT NAME */
        .participant-name {
          margin: 18px 0 0;
          font-family: "Alex Brush", "Dancing Script", "Great Vibes", "Brush Script MT", cursive;
          font-size: 68px;
          font-weight: 400;
          color: #08606a;
          line-height: 1.15;
          min-height: 80px;
          text-shadow: 0 1px 2px rgba(8, 96, 106, 0.15);
        }

        .name-line {
          width: 560px;
          height: 2px;
          background: linear-gradient(90deg, transparent, #438e94, transparent);
          margin: 4px auto 18px;
        }

        /* DESCRIPTION */
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

        /* IMPACT LINE */
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

        /* =========================================
           GOLD BADGE (TOP RIGHT)
        ========================================= */

        .badge {
          position: absolute;
          right: 85px;
          top: 145px;
          width: 155px;
          height: 155px;
          border-radius: 50%;
          background: linear-gradient(135deg, #f6df86 0%, #dcae45 50%, #b8860b 100%);
          padding: 8px;
          box-shadow: 0 8px 24px rgba(7, 62, 67, 0.22);
          z-index: 15;
        }

        .badge-inner {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          background: radial-gradient(circle, #075d63 0%, #063e46 100%);
          border: 3px solid #f6df86;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          color: #ffe69b;
          box-shadow: inset 0 2px 6px rgba(0, 0, 0, 0.4);
        }

        .crown {
          font-size: 22px;
          line-height: 1;
          color: #f6df86;
          filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.3));
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

        .ribbon-left,
        .ribbon-right {
          position: absolute;
          width: 36px;
          height: 75px;
          bottom: -50px;
          background: #07666b;
          z-index: -1;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
        }

        .ribbon-left {
          left: 24px;
          transform: rotate(14deg);
          clip-path: polygon(0 0, 100% 0, 100% 100%, 50% 80%, 0 100%);
        }

        .ribbon-right {
          right: 24px;
          transform: rotate(-14deg);
          clip-path: polygon(0 0, 100% 0, 100% 100%, 50% 80%, 0 100%);
        }

        /* =========================================
           SUPPORTED BY NRI (BOTTOM LEFT ALIGNED)
        ========================================= */

        .supported-left {
          position: absolute;
          left: 140px;
          bottom: 85px;
          width: 260px;
          text-align: center;
          z-index: 15;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .supported-title {
          color: #0b5271;
          font-size: 13px;
          font-weight: 700;
          letter-spacing: 1.5px;
          margin-bottom: 6px;
          white-space: nowrap;
          text-transform: uppercase;
          text-align: center;
        }

        .nri-logo {
          height: 80px;
          width: auto;
          object-fit: contain;
          filter: drop-shadow(0 3px 6px rgba(0, 0, 0, 0.1));
        }

        /* =========================================
           COMPLETION DATE (BOTTOM RIGHT ALIGNED)
        ========================================= */

        .date-section {
          position: absolute;
          right: 145px;
          bottom: 108px;
          width: 230px;
          text-align: center;
          z-index: 15;
        }

        .date {
          font-family: Georgia, "Times New Roman", serif;
          font-size: 17.5px;
          font-weight: 700;
          color: #063e46;
        }

        .date-line {
          height: 1.5px;
          width: 100%;
          background: linear-gradient(90deg, transparent, #4c777c, transparent);
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

        /* =========================================
           FOOTER (BOTTOM CENTER BAR)
        ========================================= */

        .footer {
          position: absolute;
          bottom: 38px;
          left: 50%;
          transform: translateX(-50%);
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 5px;
          color: #075d63;
          z-index: 10;
          white-space: nowrap;
          text-transform: uppercase;
        }

        /* PRINT STYLES */
        @media print {
          @page {
            size: landscape;
            margin: 0;
          }
          body {
            background: white;
          }
          .certificate-wrapper {
            padding: 0;
          }
          .certificate {
            margin: 0;
            width: 100vw;
            height: 100vh;
            box-shadow: none;
          }
        }
      `}</style>

      <div className="certificate-wrapper">
        <div className="certificate">

          {/* DECORATIVE WAVES */}
          <div className="wave wave-left-1"></div>
          <div className="wave wave-left-2"></div>
          <div className="wave wave-left-3"></div>

          <div className="wave wave-right-1"></div>
          <div className="wave wave-right-2"></div>
          <div className="wave wave-right-3"></div>

          {/* BORDERS & CORNER ACCENTS */}
          <div className="certificate-border-outer"></div>
          <div className="certificate-border-inner"></div>
          <div className="corner-accent corner-top-left"></div>
          <div className="corner-accent corner-top-right"></div>
          <div className="corner-accent corner-bottom-left"></div>
          <div className="corner-accent corner-bottom-right"></div>

          {/* GEN Z LOGO (TOP LEFT) */}
          <div className="genz-logo-container">
            <img
              src="/logo.png"
              alt="Gen Z Voices"
              className="genz-logo-img"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "/nrilogo.png";
              }}
            />
            <div className="genz-tagline">
              VOICES TODAY &nbsp;|&nbsp; A BRIGHTER TOMORROW
            </div>
          </div>

          {/* MAIN HEADING */}
          <div className="certificate-heading">
            <h1>CERTIFICATE</h1>
            <div className="heading-subtitle">
              <span></span>
              OF PARTICIPATION
              <span></span>
            </div>
          </div>

          {/* CERTIFICATE CONTENT */}
          <div className="certificate-content">
            <p className="certify">THIS IS TO CERTIFY THAT</p>

            <h2 className="participant-name">
              {participantName}
            </h2>

            <div className="name-line"></div>

            <p className="completion-text">
              has successfully completed the <strong>Gen Z Survey</strong>.
            </p>

            <p className="description">
              Your valuable insights have contributed to a better understanding
              <br />
              of Gen Z perspectives and will help shape a brighter, more inclusive future.
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

          {/* GOLD BADGE (TOP RIGHT) */}
          <div className="badge">
            <div className="badge-inner">
              <div className="crown">♛</div>
              <div className="badge-text">
                GEN Z
                <br />
                MAKES A
                <br />
                DIFFERENCE
              </div>
              <div className="stars">★★★</div>
            </div>
            <div className="ribbon-left"></div>
            <div className="ribbon-right"></div>
          </div>

          {/* SUPPORTED BY NRI (BOTTOM LEFT ALIGNED) */}
          <div className="supported-left">
            <div className="supported-title">
              GenZ Voices supported by
            </div>
            <img
              src="/nrilogo.png"
              alt="NRI University"
              className="nri-logo"
            />
          </div>

          {/* COMPLETION DATE (BOTTOM RIGHT ALIGNED) */}
          <div className="date-section">
            <div className="date">{completionDate}</div>
            <div className="date-line"></div>
            <div className="date-label">DATE OF COMPLETION</div>
          </div>

          {/* FOOTER */}
          <div className="footer">
            LISTEN &nbsp;&nbsp;|&nbsp;&nbsp; LEARN &nbsp;&nbsp;|&nbsp;&nbsp; BUILD TOGETHER
          </div>

        </div>
      </div>
    </>
  );
};

export default Certificate;
