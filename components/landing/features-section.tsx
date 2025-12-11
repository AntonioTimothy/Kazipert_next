"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";

 const employees = [
    "/employee1.jpg",
    "/employee2.jpg",
    "/employee3.jpg",
    "/employee4.jpg",
    "/employee5.jpg",
    "/employee6.jpg",
    "/employee7.jpg",
  ];

  // Use a deterministic initial value for SSR, then randomize after mount to avoid hydration mismatch
  const [cardImages, setCardImages] = useState<string[]>(() => employees.slice(0, 4));
  useEffect(() => {
    const shuffled = [...employees].sort(() => 0.5 - Math.random()).slice(0, 4);
    setCardImages(shuffled);
  }, []);

export default function FeaturesSection () {
 

  return (
    <section className="relative w-full bg-[#0F8A8D] py-24 overflow-hidden">

      {/* ---------------------------------------------------- */}
      {/* BACKGROUND DECORATIVE IMAGES BASED ON YOUR DESIGN    */}
      {/* ---------------------------------------------------- */}

      {/* LEFT FADED FULL-HEIGHT IMAGE */}
      <div className="absolute left-0 top-0 h-full w-[45%] opacity-25">
        <Image
          src="/employee1.jpg"
          alt="Background"
          fill
          sizes="(min-width: 768px) 45vw, 100vw"
          className="object-cover"
        />
      </div>

      {/* RIGHT FADED WIDE FAMILY IMAGE */}
      <div className="absolute right-0 bottom-0 h-[58%] w-[55%] opacity-25">
        <Image
          src="/employee3.jpg"
          alt="Background"
          fill
          sizes="(min-width: 768px) 55vw, 100vw"
          className="object-cover"
        />
      </div>

      {/* LARGE ANGLED TRAPEZIUM */}
      <div className="absolute inset-0 pointer-events-none">
        <svg
          className="absolute left-1/3 top-0 h-full hidden md:block"
          width="900"
          height="900"
          viewBox="0 0 900 900"
        >
          <path
            d="M0 0 L900 0 L450 900 L0 900 Z"
            fill="#2BA3A5"
            opacity="0.55"
          />
        </svg>
      </div>

      {/* LARGE TRANSPARENT TRIANGLE */}
      <div className="absolute inset-0 pointer-events-none">
        <svg
          className="absolute left-1/2 top-1/4 h-[420px] w-[420px] hidden md:block"
          viewBox="0 0 600 600"
        >
          <path
            d="M0 600 L300 0 L600 600 Z"
            fill="#2BA3A5"
            opacity="0.35"
          />
        </svg>
      </div>

      {/* ---------------------------------------------------- */}
      {/* MAIN CONTENT WRAPPER                                 */}
      {/* ---------------------------------------------------- */}

      <div className="relative z-10 max-w-7xl mx-auto px-6">

      

        {/* ---------------------------------------------------- */}
        {/* FOUR FEATURE / INSURANCE CARDS                       */}
        {/* ---------------------------------------------------- */}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

          {cardImages.map((img, i) => (
            <div
              key={i}
              className="bg-transparent border border-white/40 rounded-xl shadow-lg backdrop-blur-sm"
            >
              {/* TOP IMAGE */}
              <div className="w-full h-40 relative rounded-t-xl overflow-hidden">
                <Image
                  src={img}
                  alt="Employee card"
                  fill
                  sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                  className="object-cover"
                />
              </div>

              {/* TEXT AREA */}
              <div className="p-6">
                <h3 className="text-[#FDB913] text-lg font-semibold leading-tight mb-2">
                  Comprehensive <br /> Medical Insurance
                </h3>

                <p className="text-white/90 text-sm leading-relaxed">
                  Insurance cover beyond standard limits, equals absolute peace of mind
                </p>
              </div>
            </div>
          ))}

        </div>


          {/* CENTER ROUND IMAGE */}
        <div className="flex justify-left-16 mt-16">
          <div className="w-56 h-56 rounded-full overflow-hidden border-4 border-white/40 shadow-xl">
            <Image
              src="/employee5.jpg"
              alt="Center"
              width={350}
              height={350}
              className="object-cover"
            />
          </div>
        </div>

      </div>

    </section>
  );
}
