import { useEffect, useRef } from "react";

type Petal = {
  x: number;
  y: number;
  size: number;
  speed: number;
  drift: number;
  rotation: number;
  rotationSpeed: number;
  opacity: number;
  phase: number;
};

function createPetal(
  width: number,
  height: number,
  startAbove = false,
  isMobile = false,
): Petal {
  return {
    x: Math.random() * width,
    y: startAbove ? -40 - Math.random() * height * 0.32 : Math.random() * height,
    size: 24 + Math.random() * 14,
    speed: isMobile
      ? 0.85 + Math.random() * 0.65
      : 0.48 + Math.random() * 0.5,
    drift: -0.24 + Math.random() * 0.48,
    rotation: Math.random() * Math.PI * 2,
    rotationSpeed: -0.008 + Math.random() * 0.016,
    opacity: 0.42 + Math.random() * 0.32,
    phase: Math.random() * Math.PI * 2,
  };
}

function removeGreenBackground(image: HTMLImageElement) {
  const buffer = document.createElement("canvas");
  const context = buffer.getContext("2d");

  if (!context) {
    return image;
  }

  buffer.width = image.naturalWidth;
  buffer.height = image.naturalHeight;
  context.drawImage(image, 0, 0);

  const imageData = context.getImageData(0, 0, buffer.width, buffer.height);
  const data = imageData.data;

  for (let index = 0; index < data.length; index += 4) {
    const red = data[index];
    const green = data[index + 1];
    const blue = data[index + 2];
    const greenStrength = green - Math.max(red, blue);

    if (green > 120 && greenStrength > 45) {
      const alpha = Math.max(0, Math.min(255, (85 - greenStrength) * 4));
      data[index + 3] = alpha;

      if (alpha > 0) {
        data[index] = Math.min(255, red + greenStrength * 0.35);
        data[index + 1] = Math.max(0, green - greenStrength * 0.85);
      }
    } else if (red > 145 && green > 75 && green < 185 && blue < 95) {
      data[index] = Math.min(255, red + 26);
      data[index + 1] = Math.max(28, green * 0.42);
      data[index + 2] = Math.min(160, blue + 78);
    }
  }

  context.putImageData(imageData, 0, 0);

  return buffer;
}

function drawPetal(
  context: CanvasRenderingContext2D,
  petal: Petal,
  image: CanvasImageSource,
) {
  context.save();
  context.translate(petal.x, petal.y);
  context.rotate(petal.rotation);
  context.globalAlpha = petal.opacity;

  const drawWidth = petal.size;
  const drawHeight = petal.size;
  context.drawImage(image, -drawWidth / 2, -drawHeight / 2, drawWidth, drawHeight);
  context.restore();
}

function PetalOverlay() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (prefersReducedMotion) {
      return;
    }

    const isMobile = window.matchMedia("(max-width: 639px)").matches;

    const canvas = canvasRef.current;

    if (!canvas) {
      return;
    }

    const context = canvas.getContext("2d");

    if (!context) {
      return;
    }

    let width = window.innerWidth;
    let height = window.innerHeight;
    let animationFrame = 0;
    let lastTime = performance.now();
    let lastDrawTime = 0;
    let lastScrollY = window.scrollY;
    let scrollVelocity = 0;
    let petals: Petal[] = [];
    let petalImage: CanvasImageSource | null = null;

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      const ratio = isMobile ? 0.75 : Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = width * ratio;
      canvas.height = height * ratio;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(ratio, 0, 0, ratio, 0, 0);

      const targetCount = isMobile ? 3 : width < 1024 ? 10 : 14;
      petals = Array.from({ length: targetCount }, () =>
        createPetal(width, height, false, isMobile),
      );
    };

    const handleScroll = () => {
      const nextScrollY = window.scrollY;
      scrollVelocity = nextScrollY - lastScrollY;
      lastScrollY = nextScrollY;
    };

    const animate = (time: number) => {
      if (isMobile && time - lastDrawTime < 42) {
        animationFrame = requestAnimationFrame(animate);
        return;
      }

      lastDrawTime = time;
      const delta = Math.min((time - lastTime) / 16.67, 2);
      lastTime = time;

      context.clearRect(0, 0, width, height);

      if (!petalImage) {
        animationFrame = requestAnimationFrame(animate);
        return;
      }

      const petalSource = petalImage;

      petals.forEach((petal, index) => {
        const sway = Math.sin(time * 0.0014 + petal.phase) * 0.55;
        petal.x += (petal.drift + sway + scrollVelocity * 0.01) * delta;
        petal.y += (petal.speed + Math.abs(scrollVelocity) * 0.01) * delta;
        petal.rotation += petal.rotationSpeed * delta;

        if (petal.y > height + 40 || petal.x < -60 || petal.x > width + 60) {
          petals[index] = createPetal(width, height, true, isMobile);
        } else {
          drawPetal(context, petal, petalSource);
        }
      });

      scrollVelocity *= 0.88;
      animationFrame = requestAnimationFrame(animate);
    };

    resize();
    const image = new Image();
    image.onload = () => {
      petalImage = removeGreenBackground(image);
    };
    image.src = "/assets/sakura-petal-photo-key.png";

    window.addEventListener("resize", resize);
    window.addEventListener("scroll", handleScroll, { passive: true });
    animationFrame = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationFrame);
      window.removeEventListener("resize", resize);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-10"
    />
  );
}

export default PetalOverlay;
