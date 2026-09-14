import { jsPDF } from 'jspdf';

/**
 * Renders the personalized executive certificate on an HTML5 Canvas matching the updated layout
 * @param {string} name - Recipient's full name to appear on certificate
 * @param {string} dateStr - Optional date string (e.g. "September 14, 2026")
 * @returns {Promise<HTMLCanvasElement>}
 */
export async function generateCertificateCanvas(name, dateStr) {
  const canvas = document.createElement('canvas');
  canvas.width = 1200;
  canvas.height = 800;
  const ctx = canvas.getContext('2d');

  const cleanName = (name || 'Gen Z Participant').trim();
  const formattedDate = dateStr || new Date().toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  // 1. Radial Background Gradient
  const bgGrad = ctx.createRadialGradient(600, 360, 0, 600, 360, 650);
  bgGrad.addColorStop(0, '#ffffff');
  bgGrad.addColorStop(0.6, '#fcfdfa');
  bgGrad.addColorStop(1.0, '#f3f7f2');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, 1200, 800);

  // Helper for drawing rotated ellipse waves
  const drawWave = (cx, cy, rx, ry, angleDeg, colorGradOrSolid) => {
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate((angleDeg * Math.PI) / 180);
    ctx.beginPath();
    ctx.ellipse(0, 0, rx, ry, 0, 0, 2 * Math.PI);
    ctx.fillStyle = colorGradOrSolid;
    ctx.fill();
    ctx.restore();
  };

  // 2. Decorative Left Waves
  drawWave(0, 650, 170, 430, -28, '#087f82');
  drawWave(40, 630, 150, 450, -28, '#56bfc0');
  drawWave(110, 620, 115, 450, -28, '#d9f1ed');

  // 3. Decorative Right Waves
  drawWave(1180, 0, 250, 125, 25, '#9bd9d7');
  drawWave(1140, 0, 210, 95, 25, '#e4f4ef');

  const rGrad = ctx.createLinearGradient(950, 630, 1200, 800);
  rGrad.addColorStop(0, '#e1efbf');
  rGrad.addColorStop(1, '#4aa89b');
  drawWave(1150, 780, 250, 150, -25, rGrad);

  // 4. Double Border & Corner Accents
  ctx.strokeStyle = '#087f82';
  ctx.lineWidth = 2;
  ctx.strokeRect(14, 14, 1172, 772);

  ctx.strokeStyle = '#dcae45';
  ctx.lineWidth = 1;
  ctx.strokeRect(20, 20, 1160, 760);

  // Corner Accents
  const drawCorner = (x, y, dx, dy) => {
    ctx.strokeStyle = '#087f82';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(x + dx, y);
    ctx.lineTo(x, y);
    ctx.lineTo(x, y + dy);
    ctx.stroke();
  };
  drawCorner(24, 24, 30, 30);
  drawCorner(1176, 24, -30, 30);
  drawCorner(24, 776, 30, -30);
  drawCorner(1176, 776, -30, -30);

  // 5. Load & Render GenZ Logo (logo.png) Top Left
  const logoImg = new Image();
  logoImg.crossOrigin = 'anonymous';
  logoImg.src = '/logo.png';
  await new Promise((resolve) => {
    logoImg.onload = resolve;
    logoImg.onerror = () => {
      const fallbackLogo = new Image();
      fallbackLogo.crossOrigin = 'anonymous';
      fallbackLogo.src = './logo.png';
      fallbackLogo.onload = resolve;
      fallbackLogo.onerror = resolve;
    };
  });

  if (logoImg.complete && logoImg.naturalWidth > 0) {
    ctx.drawImage(logoImg, 40, 24, 290, 115);
  } else {
    // Fallback logo text if image loading fails
    ctx.textAlign = 'left';
    ctx.textBaseline = 'alphabetic';
    ctx.font = "900 70px 'Montserrat', Arial, sans-serif";
    ctx.fillStyle = '#071e2a';
    ctx.fillText('Gen', 40, 95);
    ctx.fillStyle = '#168b82';
    ctx.fillText('Z', 165, 95);
  }

  // Tagline under GenZ Logo
  ctx.textAlign = 'left';
  ctx.textBaseline = 'alphabetic';
  ctx.font = "800 11.5px 'Montserrat', Arial, sans-serif";
  ctx.fillStyle = '#075d63';
  ctx.fillText('VOICES TODAY   |   A BRIGHTER TOMORROW', 40, 152);

  // 6. Gold Badge (Top Right)
  const badgeCx = 1005;
  const badgeCy = 220;

  // Ribbon Tails
  ctx.fillStyle = '#07666b';
  ctx.save();
  ctx.translate(badgeCx - 40, badgeCy + 40);
  ctx.rotate((14 * Math.PI) / 180);
  ctx.fillRect(0, 0, 36, 75);
  ctx.restore();

  ctx.save();
  ctx.translate(badgeCx + 10, badgeCy + 45);
  ctx.rotate((-14 * Math.PI) / 180);
  ctx.fillRect(0, 0, 36, 75);
  ctx.restore();

  // Outer Gold Gradient Circle
  const goldGrad = ctx.createRadialGradient(badgeCx - 15, badgeCy - 15, 10, badgeCx, badgeCy, 78);
  goldGrad.addColorStop(0, '#f6df86');
  goldGrad.addColorStop(0.5, '#dcae45');
  goldGrad.addColorStop(1, '#b8860b');

  ctx.beginPath();
  ctx.arc(badgeCx, badgeCy, 76, 0, 2 * Math.PI);
  ctx.fillStyle = goldGrad;
  ctx.shadowColor = 'rgba(7,62,67,0.22)';
  ctx.shadowBlur = 15;
  ctx.shadowOffsetY = 6;
  ctx.fill();
  ctx.shadowColor = 'transparent';

  // Inner Dark Teal Circle
  const tealGrad = ctx.createRadialGradient(badgeCx, badgeCy, 5, badgeCx, badgeCy, 66);
  tealGrad.addColorStop(0, '#075d63');
  tealGrad.addColorStop(1, '#063e46');

  ctx.beginPath();
  ctx.arc(badgeCx, badgeCy, 66, 0, 2 * Math.PI);
  ctx.fillStyle = tealGrad;
  ctx.fill();
  ctx.strokeStyle = '#f6df86';
  ctx.lineWidth = 3;
  ctx.stroke();

  // Badge Text
  ctx.textAlign = 'center';
  ctx.fillStyle = '#ffe69b';
  ctx.font = "22px serif";
  ctx.fillText('♛', badgeCx, badgeCy - 28);

  ctx.font = "900 12px 'Montserrat', Arial, sans-serif";
  ctx.fillText('GEN Z', badgeCx, badgeCy - 8);
  ctx.fillText('MAKES A', badgeCx, badgeCy + 8);
  ctx.fillText('DIFFERENCE', badgeCx, badgeCy + 24);

  ctx.font = "11px sans-serif";
  ctx.fillText('★★★', badgeCx, badgeCy + 42);

  // 7. Certificate Heading
  ctx.textAlign = 'center';
  ctx.fillStyle = '#063e46';
  ctx.font = "900 64px 'Montserrat', Arial, sans-serif";
  ctx.fillText('CERTIFICATE', 600, 180);

  // Subtitle Line
  ctx.font = "700 23px 'Montserrat', Arial, sans-serif";
  ctx.fillStyle = '#075d63';
  ctx.fillText('OF PARTICIPATION', 600, 216);

  ctx.fillStyle = '#167d83';
  ctx.fillRect(400, 208, 60, 2);
  ctx.fillRect(740, 208, 60, 2);

  // 8. Certificate Content
  ctx.fillStyle = '#172e33';
  ctx.font = "800 14px 'Montserrat', Arial, sans-serif";
  ctx.fillText('THIS IS TO CERTIFY THAT', 600, 280);

  // Participant Name
  let fontSize = 68;
  if (cleanName.length > 20) {
    fontSize = Math.max(38, Math.floor(68 * (20 / cleanName.length)));
  }
  ctx.fillStyle = '#08606a';
  ctx.font = `${fontSize}px 'Alex Brush', 'Dancing Script', 'Brush Script MT', cursive, serif`;
  ctx.fillText(cleanName, 600, 355);

  // Underline
  const nameGrad = ctx.createLinearGradient(320, 378, 880, 378);
  nameGrad.addColorStop(0, 'rgba(67,142,148,0)');
  nameGrad.addColorStop(0.5, 'rgba(67,142,148,1)');
  nameGrad.addColorStop(1, 'rgba(67,142,148,0)');
  ctx.fillStyle = nameGrad;
  ctx.fillRect(320, 378, 560, 2);

  // Description
  ctx.fillStyle = '#182c31';
  ctx.font = "500 18px 'Montserrat', Arial, sans-serif";
  ctx.fillText('has successfully completed the Gen Z Survey.', 600, 415);

  ctx.fillStyle = '#25363a';
  ctx.font = "400 16.5px 'Montserrat', Arial, sans-serif";
  ctx.fillText('Your valuable insights have contributed to a better understanding', 600, 450);
  ctx.fillText('of Gen Z perspectives and will help shape a brighter, more inclusive future.', 600, 475);

  ctx.fillStyle = '#063e46';
  ctx.font = "700 18.5px 'Montserrat', Arial, sans-serif";
  ctx.fillText('Thank you for making your voice count!', 600, 515);

  // Impact Line
  ctx.fillStyle = '#27838a';
  ctx.font = "800 12px 'Montserrat', Arial, sans-serif";
  ctx.fillText('SMALL RESPONSES. BIGGER CHANGE.', 600, 555);
  ctx.fillRect(385, 551, 55, 1);
  ctx.fillRect(760, 551, 55, 1);

  // 9. Supported By NRI (nrilogo.png) Bottom Left Aligned (Clean Without Colliding Side Lines)
  ctx.textAlign = 'center';
  ctx.fillStyle = '#0b5271';
  ctx.font = "700 13px 'Montserrat', Arial, sans-serif";
  ctx.fillText('GenZ Voices supported by', 260, 662);

  const nriImg = new Image();
  nriImg.crossOrigin = 'anonymous';
  nriImg.src = '/nrilogo.png';
  await new Promise((resolve) => {
    nriImg.onload = resolve;
    nriImg.onerror = () => {
      const fallbackNri = new Image();
      fallbackNri.crossOrigin = 'anonymous';
      fallbackNri.src = './nrilogo.png';
      fallbackNri.onload = resolve;
      fallbackNri.onerror = resolve;
    };
  });

  if (nriImg.complete && nriImg.naturalWidth > 0) {
    ctx.drawImage(nriImg, 170, 672, 180, 68);
  }

  // 10. Date of Completion (Bottom Right Aligned)
  ctx.textAlign = 'center';
  ctx.fillStyle = '#063e46';
  ctx.font = "700 17.5px Georgia, serif";
  ctx.fillText(formattedDate, 935, 670);

  const dateGrad = ctx.createLinearGradient(820, 678, 1050, 678);
  dateGrad.addColorStop(0, 'rgba(76,119,124,0)');
  dateGrad.addColorStop(0.5, 'rgba(76,119,124,1)');
  dateGrad.addColorStop(1, 'rgba(76,119,124,0)');
  ctx.fillStyle = dateGrad;
  ctx.fillRect(820, 678, 230, 1.5);

  ctx.fillStyle = '#263b3f';
  ctx.font = "800 10.5px 'Montserrat', Arial, sans-serif";
  ctx.fillText('DATE OF COMPLETION', 935, 695);

  // 11. Footer (Bottom Center Bar)
  ctx.fillStyle = '#075d63';
  ctx.font = "800 11px 'Montserrat', Arial, sans-serif";
  ctx.fillText('LISTEN   |   LEARN   |   BUILD TOGETHER', 600, 762);

  return canvas;
}

/**
 * Returns Base64 PNG Data URL of personalized certificate
 */
export async function generateCertificateDataUrl(name, dateStr) {
  const canvas = await generateCertificateCanvas(name, dateStr);
  return canvas.toDataURL('image/png', 1.0);
}

/**
 * Triggers automatic browser download of PNG Certificate
 */
export async function downloadCertificateImage(name, dateStr) {
  const dataUrl = await generateCertificateDataUrl(name, dateStr);
  const cleanName = (name || 'Participant').trim().replace(/[^a-zA-Z0-9]/g, '_');
  const link = document.createElement('a');
  link.download = `GenZ_Certificate_${cleanName}.png`;
  link.href = dataUrl;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Triggers automatic browser download of PDF Certificate using jsPDF
 */
export async function downloadCertificatePdf(name, dateStr) {
  const canvas = await generateCertificateCanvas(name, dateStr);
  const imgData = canvas.toDataURL('image/png', 1.0);

  const pdf = new jsPDF({
    orientation: 'landscape',
    unit: 'px',
    format: [1200, 800],
  });

  pdf.addImage(imgData, 'PNG', 0, 0, 1200, 800);
  const cleanName = (name || 'Participant').trim().replace(/[^a-zA-Z0-9]/g, '_');
  pdf.save(`GenZ_Certificate_${cleanName}.pdf`);
}
