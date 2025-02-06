"use client";
import { useEffect, useState } from "react";
import styles from "./page.module.css";
import Logo from "@/components/Logo";
import Navbar from "@/components/Navbar";
import Image from 'next/image';

export default function Home() {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 840);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    // Add resize event listener
    window.addEventListener("resize", handleResize);

    // Cleanup listener
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className={styles.page}>
      {/* Top Nav bar */}
      <Navbar mobile_view={isMobile} />


      <div className={styles.logo}>
        <Logo borderWidth="2px" borderColor="white" />
      </div>

      {/* ---------------------------------------------------- */}
      {/* Hero Section */}
      <section className={styles.hero_section}>
        <h1>Zero</h1>
        <h2>Making Technology Humane</h2>
        <div className={styles.hero_image_wrapper}>
          <Image
            src="/images/asper-old-black.png"
            alt="Asper Logo"
            width={360}
            height={550}
            className={styles.hero_bottom_image}
            priority
          />

          <div className={styles.hero_image_overlay}/>
        </div>
      </section>
      {/* ---------------------------------------------------- */}
      
      {/* Vision Section */}
      <section className={styles.vision_section}>

      </section>
    </div>
  );
}
