"use client";
import { useEffect, useState, useRef } from "react";
import styles from "./page.module.css";
import Logo from "@/components/Logo";
import Navbar from "@/components/Navbar";
import Image from 'next/image';
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import ScrollToPlugin from "gsap/dist/ScrollToPlugin";

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

export default function Home() {
  const [isMobile, setIsMobile] = useState(false);
  const [logoColor, setLogoColor] = useState("white");

  useEffect(() => {
    setIsMobile(window.innerWidth <= 840);
    
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 840);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const sections = gsap.utils.toArray("section");
    
    sections.forEach((section: any, i: number) => {
      // Only pin the hero section (i === 0)
      const shouldPin = i === 0;
      
      ScrollTrigger.create({
        trigger: section,
        start: "top top",
        pin: shouldPin,
        pinSpacing: false,
        snap: {
          snapTo: 1,
          duration: 0.4,
          delay: 0,
          ease: "power1.inOut",
          inertia: false,
          onComplete: undefined
        }
      });
    });

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const visionSection = document.querySelector(`.${styles.vision_section}`);
      if (!visionSection) return;

      const rect = visionSection.getBoundingClientRect();
      const logo = document.querySelector(`.${styles.logo}`);
      const logoRect = logo ? logo.getBoundingClientRect() : { bottom: 0 };
      const triggerPoint = logoRect.bottom;

      if (rect.top <= triggerPoint) {
        setLogoColor("black");
      } else {
        setLogoColor("white");
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleExploreClick = (e: React.MouseEvent) => {
    e.preventDefault();
    console.log('Explore clicked');
    
    const visionSection = document.querySelector(`.${styles.vision_section}`);
    if (visionSection) {
      console.log('Vision section found');
      gsap.to(window, {
        duration: 1,
        scrollTo: visionSection,
        ease: "power2.inOut"
      });
    } else {
      console.log('Vision section not found');
    }
  };

  const handleOsmosClick = (e: React.MouseEvent) => {
    e.preventDefault();
    
    const osmosSection = document.querySelector(`.${styles.osmos_section}`);
    if (osmosSection) {
      gsap.to(window, {
        duration: 1,
        scrollTo: osmosSection,
        ease: "power2.inOut"
      });
    }
  };

  return (
    <div className={styles.page}>
      {/* Top Nav bar */}
      <Navbar mobile_view={isMobile} color={logoColor} />


      <div className={styles.logo}>
        <Logo borderWidth="2px" borderColor={logoColor} />
      </div>

      {/* ---------------------------------------------------- */}
      {/* Hero Section */}
      <section className={styles.hero_section}>
        <h1>Zero</h1>
        <h2>Making Technology Humane</h2>
        <a href="#" className={styles.hero_cta} onClick={handleExploreClick}>Explore Zero</a>
        
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
        <div>
          <h1>Our Vision</h1>
          <p>
            At <strong>Ground Zero Lab</strong>, we are pushing the boundaries of <strong>AI</strong> to create technology that is not only powerful but also deeply <strong>intuitive and humane</strong>. Our mission is to bridge the gap between <strong>cutting-edge research</strong> and <strong>real-world applications</strong>, developing <strong>state-of-the-art AI systems</strong> that enhance human potential. From <strong>advanced deep learning</strong> architectures to innovative computing environments, we are re-imagining how AI integrates with daily life. Our focus spans <strong>LLMs</strong>, <strong>multimodal AI</strong>, <strong>generative models</strong>, and <strong>intelligent interfaces</strong>, all designed to make technology more expressive, accessible, and efficient. At Ground Zero Lab, we believe the future of AI isn't just about intelligence—it's about <strong>understanding</strong>, <strong>creativity</strong>, and <strong>seamless interaction</strong> with the world.
          </p>
        </div>

        <div>
          <Image
            src="/images/vision-formula1.png"
            alt="Vision Formula 1"
            width={300}
            height={0}
            style={{ height: 'auto' }}
            className={styles.vision_image}
          />
          <Image
            src="/images/vision-nn.png"
            alt="Vision Formula 2"
            width={300}
            height={0}
            style={{ height: 'auto' }}
            className={styles.vision_image}
          />
          <Image
            src="/images/vision-os.png"
            alt="Vision OS"
            width={300}
            height={0}
            style={{ height: 'auto' }}
            className={styles.vision_image}
          />
          <Image
            src="/images/vision-transformer.png"
            alt="Vision Transformer"
            width={300}
            height={0}
            style={{ height: 'auto' }}
            className={styles.vision_image}
          />
        </div>

        <div className={styles.go_to_osmos} onClick={handleOsmosClick}>
          <svg width="16" height="76" viewBox="0 0 16 76" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M7.29289 75.7071C7.68341 76.0976 8.31658 76.0976 8.7071 75.7071L15.0711 69.3431C15.4616 68.9526 15.4616 68.3195 15.0711 67.9289C14.6805 67.5384 14.0474 67.5384 13.6569 67.9289L8 73.5858L2.34314 67.9289C1.95262 67.5384 1.31945 67.5384 0.928929 67.9289C0.538405 68.3195 0.538405 68.9526 0.928929 69.3431L7.29289 75.7071ZM7 -4.37114e-08L7 75L9 75L9 4.37114e-08L7 -4.37114e-08Z" fill="#383838"/>
          </svg>

          <h2>
            Explore Our Products
          </h2>
        </div>
      </section>

      <section className={styles.osmos_section}>
        <h1>OsmOS!</h1>
        <div >

        </div>
      </section>
    </div>
  );
}
