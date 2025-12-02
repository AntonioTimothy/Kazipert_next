"use client"

import Link from "next/link"
import Image from "next/image"
import { useState } from "react"

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-white py-12 lg:py-16">

      <div className="container mx-auto px-6 lg:px-12">

        {/* GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6items-center">

          {/* LEFT COLUMN */}
          <div className="flex flex-col items-center text-center">

            {/* Logo */}
            <Image
              src="/logo.png"
              width={180}
              height={100}
              alt="Kazipert Logo"
              className="mb-4"
            />

            {/* Tagline */}
            <p className="text-lg text-[#463189] mb-4">
              Dignity for domestic work starts with us
            </p>

            {/* WORLD FIRST */}
            <div className="flex flex-col items-center mb-8">
              <Image
                src="/world-first-icon.png"
                width={150}
                height={150}
                alt="World First"
              />

            </div>

            {/* APPROVAL BOX */}
            <div className="bg-white border shadow-md rounded-2xl px-6 py-6 w-80 flex flex-col items-center">
              {/* <Image
                src="/kenya-seal.png"
                width={70}
                height={70}
                alt="Kenya Seal"
              /> */}

              {/* <p className="text-xs text-gray-600 mt-3 text-center leading-relaxed">
                EMBASSY OF THE REPUBLIC OF KENYA <br />
                MUSCAT, SULTANATE OF OMAN
              </p> */}

              <Image
                src="/approved-stamp.png"
                width={110}
                height={110}
                alt="Approved Stamp"
                className="mt-3 opacity-90"
              />
            </div>
          </div>

          {/* RIGHT COLUMN */}
          {/* make it responsive and margin top on mobile */}
          <div className="bg-[#f3efff] backdrop-blur-md shadow-xl rounded-3xl p-10 border border-gray-200 mt-10 md:mt-0">

            {/* Title */}
            <h2 className="text-4xl font-extrabold text-[#463189] mb-3 text-center">
              Choose your Profile
            </h2>

            <p className="text-gray-700 text-center mb-6 text-lg">
              Select how you want to use Kazipert
            </p>

            {/* SECURE ROW */}
            <div className="flex items-center justify-center gap-4 mb-10">
              <Image
                src="/secure-icon.svg"
                width={55}
                height={55}
                alt="Secure"
              />
              <div className="text-gray-600 text-sm leading-snug max-w-xs">
                <strong className="text-[#463189]">100% Secure and Trusted Platform</strong><br />
                Your data is protected with enterprise-grade security.<br />
                We comply with global data standards for safety.
              </div>
            </div>

            {/* BUTTON 1 */}
            <Link href="/signup">
              <div
                className="w-full rounded-2xl py-5 px-6 mb-6 cursor-pointer shadow-lg transition-all hover:opacity-90"
                style={{
                  backgroundColor: "#009CA6",
                  color: "#FDB913",
                }}
              >
                <p className="text-2xl font-extrabold">
                  Register as a Worker
                </p>
                <p className="text-white text-sm mt-1 opacity-90">
                  Find verified employers for domestic work abroad
                </p>
              </div>
            </Link>

            {/* BUTTON 2 */}
            <Link href="/signup">
              <div
                className="w-full rounded-2xl py-5 px-6 cursor-pointer shadow-lg transition-all hover:opacity-90"
                style={{
                  backgroundColor: "#C7BEEA",
                  color: "#2C2C5A",
                }}
              >
                <p className="text-2xl font-extrabold">
                  Register as an Employer
                </p>
                <p className="text-[#463189] text-sm mt-1 opacity-90">
                  Find trusted workers from thousands of verified profiles
                </p>
              </div>
            </Link>

          </div>

        </div>
      </div>
    </section>
  )
}
