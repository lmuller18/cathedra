import Head from "next/head";
import { type NextPage } from "next";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import Nav from "~/components/nav";
import CollectionCard from "~/components/collection-card";
import { Button } from "~/components/ui/button";
import Link from "next/link";

const TestSection = () => {
  return (
    <section className="w-full bg-gray-100 py-12">
      <div className="container">
        <div className="lg:text-center">
          <h2 className="text-base font-semibold uppercase tracking-wide text-indigo-600">
            Featured Models
          </h2>
          <p className="mt-2 text-3xl font-extrabold leading-8 tracking-tight text-gray-900 sm:text-4xl">
            Check out some of our top picks!
          </p>
          <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
            Lorem ipsum dolor sit amet consect adipisicing elit. Possimus magnam
            voluptatum cupiditate veritatis in accusamus quisquam.
          </p>
        </div>

        <div className="mt-10">
          <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
            {/* Model Card */}
            <div className="relative">
              <div className="relative overflow-hidden rounded-lg">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={kits[2]?.image}
                  alt="Gundam Model"
                  className="h-56 w-full object-cover object-center"
                />
              </div>
              <div className="mt-4">
                <h3 className="text-lg font-medium text-gray-900">
                  RG Strike Freedom Gundam
                </h3>
                <p className="mt-1 text-sm text-gray-600">
                  Real Grade 1/144 Scale
                </p>
                <p className="mt-1 text-sm text-gray-600">MSRP: $29.99</p>
              </div>
            </div>

            {/* Model Card */}
            <div className="relative">
              <div className="relative overflow-hidden rounded-lg">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={kits[0]?.image}
                  alt="Gundam Model"
                  className="h-56 w-full object-cover object-center"
                />
              </div>
              <div className="mt-4">
                <h3 className="text-lg font-medium text-gray-900">
                  MG Gundam Deathscythe Hell
                </h3>
                <p className="mt-1 text-sm text-gray-600">
                  Master Grade 1/100 Scale
                </p>
                <p className="mt-1 text-sm text-gray-600">MSRP: $49.99</p>
              </div>
            </div>

            {/* Model Card */}
            <div className="relative">
              <div className="relative overflow-hidden rounded-lg">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={kits[1]?.image}
                  alt="Gundam Model"
                  className="h-56 w-full object-cover object-center"
                />
              </div>
              <div className="mt-4">
                <h3 className="text-lg font-medium text-gray-900">
                  HGUC Sinanju Stein Narrative Ver.
                </h3>
                <p className="mt-1 text-sm text-gray-600">
                  High Grade Universal Century 1/144 Scale
                </p>
                <p className="mt-1 text-sm text-gray-600">MSRP: $26.99</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const HeroSection = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  useEffect(() => {
    const interval = setInterval(
      () =>
        setActiveIndex((activeIndex) =>
          activeIndex + 1 >= kits.length ? 0 : activeIndex + 1
        ),
      5000
    );

    return () => clearInterval(interval);
  }, []);

  const selectedModel = kits[activeIndex % kits.length];

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
              <Link href="/collection">
                <Button> Get Started</Button>
              </Link>
            </motion.div>
          </div>
          <div className="relative lg:w-1/2">
            <div className="ml-auto h-[419px] w-[350px]">
              <AnimatePresence>
                {selectedModel && (
                  <motion.div
                    key={selectedModel.id}
                    initial={{ x: 100, opacity: 0, position: "absolute" }}
                    animate={{
                      x: 0,
                      opacity: 1,
                      position: "static",
                      transition: { duration: 0.6 },
                    }}
                    exit={{
                      x: -100,
                      opacity: 0,
                      position: "absolute",
                      transition: { duration: 0.3 },
                    }}
                  >
                    <CollectionCard kit={selectedModel} />
                  </motion.div>
                )}
              </AnimatePresence>
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
              <Link href="/collection">
                <Button> Get Started</Button>
              </Link>
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

const kits = [
  {
    id: "1",
    userId: "1",
    name: "HG Gundam Aerial",
    image: "/images/hg_gundam_aerial.jpeg",
    grade: "HG",
    scale: "1/144",
    series: "G-Witch",
    status: "ASSEMBLED",
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
    link: null,
    releaseDate: null,
    orderedDate: null,
    backlogOrder: null,
    createdAt: new Date("1/1/23"),
    updatedAt: new Date("1/1/23"),
  },
] as const;

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

        <TestSection />
      </main>
    </>
  );
};

export default Home;
