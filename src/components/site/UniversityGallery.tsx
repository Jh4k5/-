"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { Expand } from "lucide-react";
import MediaFrame from "@/components/ui/MediaFrame";
import Tilt3D from "@/components/motion/Tilt3D";
import Reveal from "@/components/motion/Reveal";

const Lightbox = dynamic(() => import("@/components/motion/Lightbox"));

/** Campus gallery: tilting thumbnails that open a full-screen viewer. */
export default function UniversityGallery({
  images,
  title,
  alt,
}: {
  images: string[];
  title: string;
  alt: string;
}) {
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);

  if (images.length === 0) return null;

  return (
    <section className="container-page py-14">
      <h2 className="text-2xl font-extrabold text-trust-blue">{title}</h2>
      <span className="mt-3 block h-1 w-20 rounded-full bg-gradient-to-r from-china-red to-imperial-gold" />

      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {images.map((image, i) => (
          <Reveal key={`${image}-${i}`} delay={i * 70} direction="scale">
            <Tilt3D intensity={8} glare>
              <button
                type="button"
                onClick={() => {
                  setIndex(i);
                  setOpen(true);
                }}
                className="group relative block h-56 w-full overflow-hidden rounded-3xl shadow-[var(--shadow-card)]"
              >
                <span className="absolute inset-0 block transition-transform duration-[1300ms] group-hover:scale-110">
                  <MediaFrame src={image} alt={alt} />
                </span>
                <span className="absolute inset-0 bg-gradient-to-t from-trust-blue-dark/70 to-transparent opacity-60 transition-opacity duration-500 group-hover:opacity-90" />
                <span className="absolute bottom-4 inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur transition-transform duration-500 group-hover:scale-110 end-4">
                  <Expand className="h-4 w-4" />
                </span>
              </button>
            </Tilt3D>
          </Reveal>
        ))}
      </div>

      <Lightbox
        open={open}
        index={index}
        onIndexChange={setIndex}
        onClose={() => setOpen(false)}
        slides={images.map((image, i) => (
          <div key={`${image}-slide-${i}`} className="h-[70vh] w-full overflow-hidden rounded-2xl">
            <MediaFrame src={image} alt={alt} priority className="object-contain" />
          </div>
        ))}
      />
    </section>
  );
}
