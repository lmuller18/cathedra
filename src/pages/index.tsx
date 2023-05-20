import Head from "next/head";
import Link from "next/link";
import type { NextPage } from "next";
import { useState, useEffect } from "react";
import { motion, MotionConfig } from "framer-motion";

import Nav from "~/components/nav";
import { Button } from "~/elements/button";
import CollectionCard from "~/components/collection-card";

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Cathedra | Gundam Tracker</title>
        <meta
          name="description"
          content="Gundam collection and backlog tracker"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Nav />
      <main className="flex min-h-screen flex-col items-center justify-center">
        <HeroSection />
        <AboutSection />
      </main>
    </>
  );
};

const HeroSection = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  useEffect(() => {
    const interval = setInterval(
      () =>
        setActiveIndex((activeIndex) =>
          activeIndex + 1 >= KITS.length ? 0 : activeIndex + 1
        ),
      5000
    );

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="w-full py-16">
      <div className="container relative">
        <div className="lg:flex lg:justify-between">
          <div className="lg:w-1/2">
            <motion.h1
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-8 text-5xl font-bold leading-tight text-white lg:text-7xl"
            >
              Track your Gundam Models with ease.
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mb-8 text-xl text-gray-400 lg:text-2xl"
            >
              Say goodbye to forgetting which models you&apos;e purchased and
              which ones you&apos;ve built. With our tracking app, you can keep
              track of your collection with ease.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Button asChild>
                <Link href="/collection">Get Started </Link>
              </Button>
            </motion.div>
          </div>
          <div className="relative lg:w-1/2">
            <div className="ml-auto h-[419px] w-[350px]">
              <MotionConfig
                transition={{ duration: 0.7, ease: [0.32, 0.72, 0, 1] }}
              >
                <div>
                  <div className="mx-auto flex h-full max-w-7xl flex-col justify-center">
                    <div className="relative overflow-hidden">
                      <motion.div
                        animate={{ x: `-${activeIndex * 100}%` }}
                        className="flex"
                      >
                        {KITS.map((kit) => (
                          <div key={kit.id} className="w-[350px] flex-shrink-0">
                            <CollectionCard kit={kit} />
                          </div>
                        ))}
                      </motion.div>
                    </div>
                  </div>
                </div>
              </MotionConfig>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const AboutSection = () => {
  return (
    <section className="w-full bg-muted py-16">
      <div className="container">
        <div className="flex flex-col lg:flex-row lg:justify-between">
          <div className="lg:w-1/2 lg:pr-10">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mb-4 text-4xl font-bold text-primary"
            >
              Keep Track of Your Gundam Model Collection
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="mb-8 text-lg leading-relaxed"
            >
              Our Gundam model tracking website is the perfect tool for any
              Gundam model builder looking to organize their collection. With
              our simple and intuitive interface, you can keep track of which
              models you own, which ones you&apos;ve built, and much more.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <Button asChild>
                <Link href="/collection">Get Started</Link>
              </Button>
            </motion.div>
          </div>
          <div className="mt-12 lg:mt-0 lg:w-1/2">
            <CollectionDemo />
          </div>
        </div>
      </div>
    </section>
  );
};

const CollectionDemo = () => {
  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
      <CollectionCard
        kit={{
          id: "3",
          userId: "1",
          name: "RG ZGMF-X20A Strike Freedom Gundam",
          image: "/images/rg_strike_freedom_gundam.jpeg",
          grade: "RG",
          scale: "1/144",
          series: "SEED",
          status: "ORDERED",
          type: "MODEL",
          link: null,
          releaseDate: null,
          orderedDate: null,
          backlogOrder: null,
          createdAt: new Date("1/1/23"),
          updatedAt: new Date("1/1/23"),
        }}
      />
      <CollectionCard
        kit={{
          id: "3",
          userId: "1",
          name: "HG Sinanju Stein [Narrative Ver.]",
          image: "/images/hg_sinanju_stein.png",
          grade: "HF",
          scale: "1/144",
          series: "UC",
          status: "ASSEMBLED",
          type: "MODEL",
          link: null,
          releaseDate: null,
          orderedDate: null,
          backlogOrder: null,
          createdAt: new Date("1/1/23"),
          updatedAt: new Date("1/1/23"),
        }}
      />
    </div>
  );
};

const KITS = [
  {
    id: "1",
    userId: "1",
    name: "HG Gundam Aerial",
    image: "/images/hg_gundam_aerial.jpeg",
    grade: "HG",
    scale: "1/144",
    series: "G-Witch",
    status: "ASSEMBLED",
    type: "MODEL",
    link: null,
    releaseDate: null,
    orderedDate: null,
    backlogOrder: null,
    createdAt: new Date("1/1/23"),
    updatedAt: new Date("1/1/23"),
  },
  {
    id: "2",
    userId: "1",
    name: "MG Sazabi Ver. Ka",
    image: "/images/mg_sazabi_verka.jpeg",
    grade: "MG",
    scale: "1/100",
    series: "UC",
    status: "OWNED",
    type: "MODEL",
    link: null,
    releaseDate: null,
    orderedDate: null,
    backlogOrder: null,
    createdAt: new Date("1/1/23"),
    updatedAt: new Date("1/1/23"),
  },
  {
    id: "3",
    userId: "1",
    name: "PG Unicorm Gundam",
    image: "/images/pg_unicorn_gundam.jpeg",
    grade: "PG",
    scale: "1/60",
    series: "UC",
    status: "WISHLIST",
    type: "MODEL",
    link: null,
    releaseDate: null,
    orderedDate: null,
    backlogOrder: null,
    createdAt: new Date("1/1/23"),
    updatedAt: new Date("1/1/23"),
  },
] as const;

export default Home;
