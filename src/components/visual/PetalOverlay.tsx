import { type CSSProperties, useEffect, useRef } from "react";

const mobilePetals = [
  { x: "8vw", size: "26px", drift: "20vw", duration: "24s", delay: "-3.2s" },
  { x: "20vw", size: "22px", drift: "-12vw", duration: "20s", delay: "-8.8s" },
  { x: "34vw", size: "28px", drift: "16vw", duration: "22s", delay: "-14.9s" },
  { x: "48vw", size: "20px", drift: "-18vw", duration: "18s", delay: "-6s" },
  { x: "62vw", size: "25px", drift: "12vw", duration: "26s", delay: "-19.4s" },
  { x: "76vw", size: "23px", drift: "-20vw", duration: "21s", delay: "-11.9s" },
  { x: "88vw", size: "29px", drift: "10vw", duration: "23s", delay: "-1.4s" },
  { x: "96vw", size: "19px", drift: "-24vw", duration: "19s", delay: "-15.7s" },
];

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
    y: startAbove
      ? -40 - Math.random() * height * 0.32
      : Math.random() * height,
    size: isMobile ? 16 + Math.random() * 9 : 24 + Math.random() * 14,
    speed: isMobile ? 2.7 + Math.random() * 1.55 : 0.48 + Math.random() * 0.5,
    drift: isMobile
      ? -0.34 + Math.random() * 0.68
      : -0.24 + Math.random() * 0.48,
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

function createPetalSprite(image: HTMLImageElement) {
  const source = removeGreenBackground(image);
  const sprite = document.createElement("canvas");
  const context = sprite.getContext("2d");

  if (!context) {
    return source;
  }

  sprite.width = 48;
  sprite.height = 48;
  context.drawImage(source, 0, 0, sprite.width, sprite.height);

  return sprite;
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
  context.drawImage(
    image,
    -drawWidth / 2,
    -drawHeight / 2,
    drawWidth,
    drawHeight,
  );
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

    if (isMobile) {
      return;
    }

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

      const targetCount = isMobile ? 7 : width < 1024 ? 10 : 14;
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
      petalImage = createPetalSprite(image);
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
    <>
      <div
        aria-hidden="true"
        className="mobile-petal-overlay pointer-events-none fixed inset-0 z-10 overflow-hidden sm:hidden"
      >
        {mobilePetals.map((petal, index) => (
          <span
            key={index}
            className="mobile-petal"
            style={
              {
                "--petal-x": petal.x,
                "--petal-size": petal.size,
                "--petal-drift": petal.drift,
                "--petal-duration": petal.duration,
                "--petal-delay": petal.delay,
              } as CSSProperties
            }
          />
        ))}
      </div>
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-10 hidden sm:block"
      />
    </>
  );
}

export default PetalOverlay;
