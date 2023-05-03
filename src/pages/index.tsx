import { type NextPage } from "next";
import Head from "next/head";

import { useEffect, useState } from "react";
import GundamCard, { type Model } from "~/components/gundam-card";

const TestSection = () => {
  return (
    <section className="bg-gray-100 py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
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
                  src={models[2]?.image}
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
                  src={models[0]?.image}
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
                  src={models[1]?.image}
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
          activeIndex + 1 >= models.length ? 0 : activeIndex + 1
        ),
      5000
    );

    return () => clearInterval(interval);
  }, []);

  const selectedModel = models[activeIndex % models.length];

  return (
    <section>
      <div className="container relative mx-auto px-6 py-16">
        <div className="lg:flex lg:justify-between">
          <div className="lg:w-1/2">
            <h1 className="mb-8 text-5xl font-bold leading-tight text-white lg:text-7xl">
              Track your Gundam Models with ease.
            </h1>
            <p className="mb-8 text-xl text-gray-400 lg:text-2xl">
              Say goodbye to forgetting which models you&apos;e purchased and
              which ones you&apos;ve built. With our tracking app, you can keep
              track of your collection with ease.
            </p>
            <button className="focus:shadow-outline transform rounded-full bg-red-500 px-8 py-4 font-bold text-white shadow-lg transition duration-300 ease-in-out hover:scale-105 hover:bg-red-700 focus:outline-none">
              Get started
            </button>
          </div>
          <div className="relative lg:w-1/2">
            <div className="ml-auto h-[520px] max-w-[350px]">
              {selectedModel && (
                <div key={selectedModel.name}>
                  <GundamCard model={selectedModel} />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const AboutSection = () => {
  return (
    <section className="bg-gray-50 py-16">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row lg:justify-between">
          <div className="lg:w-1/2 lg:pr-10">
            <h2 className="mb-4 text-4xl font-bold text-gray-800">
              Keep Track of Your Gundam Model Collection
            </h2>
            <p className="mb-8 text-lg leading-relaxed text-gray-600">
              Our Gundam model tracking website is the perfect tool for any
              Gundam model builder looking to organize their collection. With
              our simple and intuitive interface, you can keep track of which
              models you own, which ones you&apos;ve built, and much more.
            </p>
            <button className="rounded-lg bg-red-600 px-6 py-3 text-white hover:bg-red-700 focus:outline-none">
              Get Started
            </button>
          </div>
          <div className="mt-12 lg:mt-0 lg:w-1/2">
            <CollectionDemo />
          </div>
        </div>
      </div>
    </section>
  );
};

export const models = [
  {
    name: "RX-78-2 Gundam",
    status: "owned",
    image:
      "https://cdn.shopify.com/s/files/1/0727/8355/products/27d7884d-c254-401f-86be-23d2a83779fc_800x.jpg?v=1650457530",
    series: "Mobile Suit Gundam",
    releaseDate: "2013",
    scale: "1/110",
    grade: "MG",
    accessories: ["Beam Saber", "Beam Rifle", "Shield"],
    description:
      "The RX-78-2 Gundam is a prototype mobile suit developed by the Earth Federation. It was the first mobile suit to be designed with beam weapons and was piloted by Amuro Ray during the One Year War.",
  },
  {
    name: "MSZ-006 Zeta Gundam",
    status: "not-owned",
    image:
      "https://bbts1.azureedge.net/images/p/full/2020/06/8f145ff2-2689-41ac-a393-01ed014cd5c2.jpg",
    series: "Mobile Suit Zeta Gundam",
    releaseDate: "2016",
    scale: "1/144",
    grade: "RG",
    accessories: ["Beam Saber", "Beam Rifle", "Shield"],
    description:
      "The MSZ-006 Zeta Gundam is a transformable mobile suit developed by Anaheim Electronics. It was piloted by Kamille Bidan and is known for its advanced transformation capabilities.",
  },
  {
    name: "RX-0 Unicorn Gundam",
    status: "built",
    image:
      "https://cdn.shopify.com/s/files/1/0727/8355/products/9f9fe3f1-f9a8-4201-904c-30939796b9c1-removebg_800x.png?v=1620440309",
    series: "Mobile Suit Gundam Unicorn",
    releaseDate: "2018",
    scale: "1/144",
    grade: "HG",
    accessories: ["Beam Saber", "Shield"],
    description:
      "The RX-0 Unicorn Gundam is a transformable mobile suit developed by Anaheim Electronics. It was piloted by Banagher Links and is known for its advanced transformation capabilities and powerful weapons.",
  },
] satisfies [Model, Model, Model];

const CollectionDemo = () => {
  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
      <GundamCard model={models[0]} />
      <GundamCard model={models[1]} />
    </div>
  );
};

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Create T3 App</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center ">
        <HeroSection />

        <AboutSection />

        {/* <GundamForm /> */}

        <TestSection />
      </main>
    </>
  );
};

export default Home;
