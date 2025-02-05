"use client";
import { useEffect, useState } from "react";
import styles from "./page.module.css";
import Logo from "@/components/Logo";
import Navbar from "@/components/Navbar";

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
      <Navbar mobile_view={isMobile} />

      <div
        style={{
          width: "55px",
          height: "55px",
          position: "absolute",
          top: "20px",
          left: "20px",
          zIndex: 1000,
        }}
      >
        <Logo borderWidth="2px" borderColor="white" />
      </div>
    </div>
  );
}
