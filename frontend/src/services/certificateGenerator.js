import { jsPDF } from 'jspdf';

function loadImage(src, timeoutMs = 3000) {
  return new Promise((resolve) => {
    let settled = false;

    const timer = setTimeout(() => {
      if (!settled) {
        settled = true;
        resolve(null);
      }
    }, timeoutMs);

    const tryLoad = (imgSrc, useCors) => {
      const img = new Image();
      if (useCors) img.crossOrigin = 'anonymous';
      img.onload = () => {
        if (!settled) {
          settled = true;
          clearTimeout(timer);
          resolve(img);
        }
      };
      img.onerror = () => {
        if (useCors) {
          tryLoad(imgSrc, false);
        } else if (imgSrc.startsWith('/')) {
          tryLoad('.' + imgSrc, false);
        } else if (!settled) {
          settled = true;
          clearTimeout(timer);
          resolve(null);
        }
      };
      img.src = imgSrc;
    };

    tryLoad(src, false);
  });
}

/**
 * Helper to process photo of handwritten signature and remove paper background
 */
async function loadProcessedSignature(src, threshold = 220) {
  try {
    const img = await loadImage(src);
    if (!img || img.naturalWidth === 0) return null;

    const canvas = document.createElement('canvas');
    const MAX_WIDTH = 1000;
    let width = img.naturalWidth;
    let height = img.naturalHeight;

    if (width > MAX_WIDTH) {
      const ratio = MAX_WIDTH / width;
      width = MAX_WIDTH;
      height = Math.round(height * ratio);
    }

    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    ctx.drawImage(img, 0, 0, width, height);

    const imageData = ctx.getImageData(0, 0, width, height);
    const pixels = imageData.data;

    for (let i = 0; i < pixels.length; i += 4) {
      const origAlpha = pixels[i + 3];
      if (origAlpha === 0) continue; // Keep already-transparent pixels transparent

      const r = pixels[i];
      const g = pixels[i + 1];
      const b = pixels[i + 2];
      const brightness = 0.299 * r + 0.587 * g + 0.114 * b;

      if (brightness >= threshold) {
        pixels[i + 3] = 0;
      } else {
        pixels[i] = 10;
        pixels[i + 1] = 15;
        pixels[i + 2] = 20;
        pixels[i + 3] = origAlpha;
      }
    }

    ctx.putImageData(imageData, 0, 0);
    return canvas;
  } catch (err) {
    console.warn('loadProcessedSignature notice:', err);
    return null;
  }
}

/**
 * Renders the personalized executive certificate on an HTML5 Canvas matching the updated layout
 * @param {string} name - Recipient's full name to appear on certificate
 * @param {string} dateStr - Optional date string (e.g. "September 18, 2026")
 * @returns {Promise<HTMLCanvasElement>}
 */
export async function generateCertificateCanvas(name, dateStr, certCode) {
  const canvas = document.createElement('canvas');
  canvas.width = 1200;
  canvas.height = 800;
  const ctx = canvas.getContext('2d');

  const cleanName = (name || 'Your Name').trim();
  const formattedDate = dateStr || new Date().toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });
  const finalCertCode = (certCode || 'CERT-GZ2026-89421').toUpperCase();

  // Ensure fonts are loaded if available
  if (document.fonts && document.fonts.ready) {
    try {
      await document.fonts.ready;
    } catch (_) {}
  }

  // 1. Radial Background Gradient
  const bgGrad = ctx.createRadialGradient(600, 360, 0, 600, 360, 650);
  bgGrad.addColorStop(0, '#ffffff');
  bgGrad.addColorStop(0.6, '#fcfdfa');
  bgGrad.addColorStop(1.0, '#f3f7f2');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, 1200, 800);

  // Helper for drawing rotated ellipse waves
  const drawWave = (cx, cy, rx, ry, angleDeg, colorGradOrSolid, opacity = 1) => {
    ctx.save();
    ctx.globalAlpha = opacity;
    ctx.translate(cx, cy);
    ctx.rotate((angleDeg * Math.PI) / 180);
    ctx.beginPath();
    ctx.ellipse(0, 0, rx, ry, 0, 0, 2 * Math.PI);
    ctx.fillStyle = colorGradOrSolid;
    ctx.fill();
    ctx.restore();
  };

  // 2. Decorative Left Waves
  drawWave(0, 650, 170, 430, -28, '#087f82', 0.95);
  drawWave(40, 630, 150, 450, -28, '#56bfc0', 0.90);
  drawWave(110, 620, 115, 450, -28, '#d9f1ed', 0.85);

  // 3. Decorative Right Waves
  drawWave(1180, 0, 250, 125, 25, '#9bd9d7', 0.75);
  drawWave(1140, 0, 210, 95, 25, '#e4f4ef', 0.80);

  const rGrad = ctx.createLinearGradient(950, 630, 1200, 800);
  rGrad.addColorStop(0, '#e1efbf');
  rGrad.addColorStop(1, '#4aa89b');
  drawWave(1150, 780, 250, 150, -25, rGrad, 0.85);

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

  // Load resources in parallel
  const [genzLogo, nriLogo, convenerSigCanvas, coordinatorSigCanvas] = await Promise.all([
    loadImage('/logo.png'),
    loadImage('/nrilogo.png'),
    loadProcessedSignature('/signatures/convener-signature.png', 220),
    loadProcessedSignature('/signatures/coordinator-signature.png', 220),
  ]);

  // 5. Gen Z Logo (Top Left)
  if (genzLogo && genzLogo.naturalWidth > 0) {
    const aspect = genzLogo.naturalWidth / genzLogo.naturalHeight;
    const h = 115;
    const w = h * aspect;
    ctx.drawImage(genzLogo, 40, 28, w, h);
  } else {
    ctx.textAlign = 'left';
    ctx.textBaseline = 'alphabetic';
    ctx.font = "900 60px 'Montserrat', Arial, sans-serif";
    ctx.fillStyle = '#063e46';
    ctx.fillText('GenZ', 40, 95);
  }

  // Tagline under Gen Z Logo
  ctx.textAlign = 'left';
  ctx.textBaseline = 'alphabetic';
  ctx.font = "800 11.5px 'Montserrat', Arial, sans-serif";
  ctx.fillStyle = '#075d63';
  ctx.fillText('VOICES TODAY   |   A BRIGHTER TOMORROW', 40, 152);

  // 6. NRI Logo (Top Right - Matching Image 2)
  if (nriLogo && nriLogo.naturalWidth > 0) {
    const aspect = nriLogo.naturalWidth / nriLogo.naturalHeight;
    const h = 92;
    const w = h * aspect;
    ctx.drawImage(nriLogo, 1142 - w, 28, w, h);
  }

  // 7. Gold Badge (Right Side)
  const badgeCx = 1015;
  const badgeCy = 252;

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

  // 8. Certificate Heading
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

  // 9. Main Body Content
  ctx.fillStyle = '#172e33';
  ctx.font = "800 14px 'Montserrat', Arial, sans-serif";
  ctx.fillText('THIS IS TO CERTIFY THAT', 600, 280);

  // Participant Name
  let fontSize = 54;
  if (cleanName.length > 20) {
    fontSize = Math.max(34, Math.floor(54 * (20 / cleanName.length)));
  }
  ctx.fillStyle = '#08606a';
  ctx.font = `bold ${fontSize}px Georgia, 'Times New Roman', serif`;
  ctx.fillText(cleanName, 600, 350);

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

  // 10. Left Signature (Dr. K.V. Sambasivarao)
  const leftSigCx = 325;
  if (convenerSigCanvas) {
    ctx.drawImage(convenerSigCanvas, leftSigCx - 82, 582, 165, 90);
  }
  ctx.fillStyle = '#0d4c63';
  ctx.fillRect(leftSigCx - 145, 672, 290, 1.5);

  ctx.textAlign = 'center';
  ctx.fillStyle = '#0b4660';
  ctx.font = "800 17px 'Montserrat', Arial, sans-serif";
  ctx.fillText('Dr. K.V. Sambasivarao', leftSigCx, 696);

  ctx.fillStyle = '#173a45';
  ctx.font = "400 14px 'Montserrat', Arial, sans-serif";
  ctx.fillText('Convener (Research Analytical Group)', leftSigCx, 714);
  ctx.font = "400 13px 'Montserrat', Arial, sans-serif";
  ctx.fillText('Director of Research & Development,', leftSigCx, 730);
  ctx.fillText('CSE Dept.', leftSigCx, 745);

  // 11. Center Date (Date of Completion)
  const centerDateCx = 600;
  ctx.textAlign = 'center';
  ctx.fillStyle = '#063e46';
  ctx.font = "700 17.5px Georgia, serif";
  ctx.fillText(formattedDate, centerDateCx, 668);

  const dateGrad = ctx.createLinearGradient(centerDateCx - 115, 674, centerDateCx + 115, 674);
  dateGrad.addColorStop(0, 'rgba(76,119,124,0)');
  dateGrad.addColorStop(0.5, 'rgba(76,119,124,1)');
  dateGrad.addColorStop(1, 'rgba(76,119,124,0)');
  ctx.fillStyle = dateGrad;
  ctx.fillRect(centerDateCx - 115, 674, 230, 1.5);

  ctx.fillStyle = '#263b3f';
  ctx.font = "800 10.5px 'Montserrat', Arial, sans-serif";
  ctx.fillText('DATE OF COMPLETION', centerDateCx, 690);

  // 12. Right Signature (J. Sai Praneeth)
  const rightSigCx = 885;
  if (coordinatorSigCanvas) {
    ctx.drawImage(coordinatorSigCanvas, rightSigCx - 85, 585, 170, 85);
  }
  ctx.fillStyle = '#0d4c63';
  ctx.fillRect(rightSigCx - 145, 672, 290, 1.5);

  ctx.textAlign = 'center';
  ctx.fillStyle = '#0b4660';
  ctx.font = "800 17px 'Montserrat', Arial, sans-serif";
  ctx.fillText('J. Sai Praneeth', rightSigCx, 696);

  ctx.fillStyle = '#173a45';
  ctx.font = "400 14px 'Montserrat', Arial, sans-serif";
  ctx.fillText('Coordinator (Research Analytical Group)', rightSigCx, 714);
  ctx.font = "400 13px 'Montserrat', Arial, sans-serif";
  ctx.fillText('CSE Dept.', rightSigCx, 730);

  // 13. Footer
  ctx.textAlign = 'left';
  ctx.fillStyle = '#075d63';
  ctx.font = "800 10px 'Montserrat', Arial, sans-serif";
  ctx.fillText('VERIFIED AUTHENTIC DOCUMENT', 48, 770);

  ctx.textAlign = 'center';
  ctx.fillStyle = '#075d63';
  ctx.font = "800 11px 'Montserrat', Arial, sans-serif";
  ctx.fillText('LISTEN   |   LEARN   |   BUILD TOGETHER', 600, 770);

  ctx.textAlign = 'right';
  ctx.fillStyle = '#075d63';
  ctx.font = "700 11px font-mono, monospace, sans-serif";
  ctx.fillText(`Certificate ID: ${finalCertCode}`, 1152, 770);

  return canvas;
}

/**
 * Returns Base64 PNG Data URL of personalized certificate
 */
export async function generateCertificateDataUrl(name, dateStr, certCode) {
  const canvas = await generateCertificateCanvas(name, dateStr, certCode);
  return canvas.toDataURL('image/png', 1.0);
}

/**
 * Triggers automatic browser download of PNG Certificate
 */
export async function downloadCertificateImage(name, dateStr, certCode) {
  const dataUrl = await generateCertificateDataUrl(name, dateStr, certCode);
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
export async function downloadCertificatePdf(name, dateStr, certCode) {
  const canvas = await generateCertificateCanvas(name, dateStr, certCode);
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

