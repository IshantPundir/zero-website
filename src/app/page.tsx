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
  const [mouseX, setMouseX] = useState(0);
  const [mouseY, setMouseY] = useState(0);

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
      // Pin both hero section (i === 0) and asper section (i === 3)
      const shouldPin = i === 0 || i === 3;
      
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

  useEffect(() => {
    const carousel = document.querySelector('.osmos_carousel');
    if (!carousel) return;
    
    gsap.to(carousel, {
      x: () => -(carousel.scrollWidth - window.innerWidth),
      ease: "none",
      scrollTrigger: {
        trigger: ".osmos_section",
        start: "top top",
        end: "bottom bottom",
        scrub: true,
        pin: true,
        anticipatePin: 1
      }
    });

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
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

  const scrollToItem = (index: number) => {
    const carousel = document.querySelector(`.${styles.osmos_carousel}`) as HTMLElement;
    const items = document.querySelectorAll(`.${styles.osmos_carousel_item}`);
    const buttons = document.querySelectorAll(`.${styles.osmos_nav_button}`);
    const slider = document.querySelector(`.${styles.osmos_nav_slider}`) as HTMLElement;
    
    if (items[index]) {
      const scrollAmount = index * (window.innerWidth * 0.8 + 21);
      carousel.scrollTo({
        left: scrollAmount,
        behavior: 'smooth'
      });
      
      // Get the clicked button's position and width
      const activeButton = buttons[index] as HTMLElement;
      slider.style.width = `${activeButton.offsetWidth}px`;
      slider.style.left = `${activeButton.offsetLeft}px`;
      
      // Update active button state
      buttons.forEach((button, i) => {
        if (i === index) {
          button.classList.add(styles.active);
        } else {
          button.classList.remove(styles.active);
        }
      });
    }
  };

  // Make sure to install the ScrollToPlugin
  useEffect(() => {
    // Import ScrollToPlugin dynamically to avoid SSR issues
    const loadScrollToPlugin = async () => {
      const ScrollToPlugin = (await import('gsap/ScrollToPlugin')).default;
      gsap.registerPlugin(ScrollToPlugin);
    };
    
    loadScrollToPlugin();
  }, []);

  const updateNavigation = () => {
    const carousel = document.querySelector(`.${styles.osmos_carousel}`) as HTMLElement;
    const items = document.querySelectorAll(`.${styles.osmos_carousel_item}`);
    const buttons = document.querySelectorAll(`.${styles.osmos_nav_button}`);
    const slider = document.querySelector(`.${styles.osmos_nav_slider}`) as HTMLElement;

    // Calculate which item is most visible
    const scrollLeft = carousel.scrollLeft;
    const itemWidth = window.innerWidth * 0.8 + 21; // 80vw + gap
    const activeIndex = Math.round(scrollLeft / itemWidth);

    // Update navigation
    buttons.forEach((button, i) => {
      if (i === activeIndex) {
        button.classList.add(styles.active);
        const activeButton = button as HTMLElement;
        slider.style.width = `${activeButton.offsetWidth}px`;
        slider.style.left = `${activeButton.offsetLeft}px`;
      } else {
        button.classList.remove(styles.active);
      }
    });
  };

  useEffect(() => {
    const carousel = document.querySelector(`.${styles.osmos_carousel}`);
    
    // Initialize slider position
    const activeButton = document.querySelector(`.${styles.osmos_nav_button}.${styles.active}`) as HTMLElement;
    const slider = document.querySelector(`.${styles.osmos_nav_slider}`) as HTMLElement;
    
    if (activeButton && slider) {
      slider.style.width = `${activeButton.offsetWidth}px`;
      slider.style.left = `${activeButton.offsetLeft}px`;
    }

    // Add scroll event listener
    carousel?.addEventListener('scroll', updateNavigation);

    // Cleanup
    return () => {
      carousel?.removeEventListener('scroll', updateNavigation);
    };
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const asperSection = document.querySelector(`.${styles.asper_section}`);
      if (!asperSection) return;

      const rect = asperSection.getBoundingClientRect();
      if (e.clientY >= rect.top && e.clientY <= rect.bottom) {
        // Calculate mouse position relative to the center of the section
        const xValue = (e.clientX - window.innerWidth / 2) / 50;
        const yValue = (e.clientY - rect.top - rect.height / 2) / 50;
        
        setMouseX(-xValue); // Inverse movement for natural parallax feel
        setMouseY(-yValue);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

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
        <div className={styles.osmos_nav}>
          <div className={styles.osmos_nav_slider}></div>
          <button 
            className={`${styles.osmos_nav_button} ${styles.active}`}
            onClick={() => scrollToItem(0)}
          >
            Overview
          </button>
          <button 
            className={styles.osmos_nav_button}
            onClick={() => scrollToItem(1)}
          >
            Features
          </button>
          <button 
            className={styles.osmos_nav_button}
            onClick={() => scrollToItem(2)}
          >
            Technology
          </button>
          <button 
            className={styles.osmos_nav_button}
            onClick={() => scrollToItem(3)}
          >
            Benefits
          </button>
        </div>
        <div className={styles.osmos_carousel}>
          <div className={styles.osmos_carousel_item}>
            <div>
              <h2>OsmOS 1</h2>
              <p>
                OsmOS 1 is a new operating system that is designed to be a more intuitive and humane operating system. It is a new operating system that is designed to be a more intuitive and humane operating system.
              </p>
            </div>
            <Image src="/images/osmos-1.png" alt="OsmOS 1" width={300} height={0} style={{ height: 'auto' }} />
          </div>

          <div className={styles.osmos_carousel_item}>
            <div>
              <h2>OsmOS 2</h2>
              <p>
                OsmOS 1 is a new operating system that is designed to be a more intuitive and humane operating system. It is a new operating system that is designed to be a more intuitive and humane operating system.
              </p>
            </div>
            <Image src="/images/osmos-1.png" alt="OsmOS 1" width={300} height={0} style={{ height: 'auto' }} />
          </div>

          <div className={styles.osmos_carousel_item}>
            <div>
              <h2>OsmOS 3</h2>
              <p>
                OsmOS 1 is a new operating system that is designed to be a more intuitive and humane operating system. It is a new operating system that is designed to be a more intuitive and humane operating system.
              </p>
            </div>
            <Image src="/images/osmos-1.png" alt="OsmOS 1" width={300} height={0} style={{ height: 'auto' }} />
          </div>

          <div className={styles.osmos_carousel_item}>
            <div>
              <h2>OsmOS 4</h2>
              <p>
                OsmOS 1 is a new operating system that is designed to be a more intuitive and humane operating system. It is a new operating system that is designed to be a more intuitive and humane operating system.
              </p>
            </div>
            <Image src="/images/osmos-1.png" alt="OsmOS 1" width={300} height={0} style={{ height: 'auto' }} />
          </div>
        </div>
        
      </section>

      <section className={styles.asper_section}>
        <Image 
          src="/images/asper_new_all_trans.png" 
          alt="Aspers" 
          width={2606} 
          height={840}
          style={{
            transform: `translate(${mouseX}px, ${mouseY}px)`,
            transition: 'transform 0.2s ease-out'
          }}
        />

        <div className={styles.asper_section_text}>
          <h1>Asper</h1>
          <h2>Your personal companion, powered by OsmOS</h2>
          <div className={styles.asper_watch_demo_button}>
            <a href="#">
              <svg 
                width="21" 
                height="22" 
                viewBox="0 0 21 22" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path 
                  d="M1 11.0001V17.9671C1 20.2771 3.534 21.7361 5.597 20.6151L8.8 18.8731M1 7.00006V4.03306C1 1.72306 3.534 0.264063 5.597 1.38506L18.409 8.35306C18.8893 8.60847 19.291 8.98975 19.5712 9.45605C19.8514 9.92234 19.9994 10.4561 19.9994 11.0001C19.9994 11.544 19.8514 12.0778 19.5712 12.5441C19.291 13.0104 18.8893 13.3917 18.409 13.6471L12.003 17.1311" 
                  stroke="currentColor" 
                  strokeWidth="1.5" 
                  strokeLinecap="round"
                  className={styles.play_path}
                />
              </svg>
              Watch Demo
            </a>
          </div>
        </div>
      </section>

      <section className={styles.footer_section}>
        <div className={styles.footer_content}>
          <div className={styles.footer_left}>
            <h1>Let's Talk!</h1>
            <p>
              Ready to explore how our AI solutions can transform your business? 
              We're here to help you navigate the future of technology.
            </p>
            <a href="mailto:contact@groundzerolab.ai" className={styles.footer_cta}>
              Get in Touch
            </a>
          </div>
          <div className={styles.footer_right}>
            <div className={styles.footer_links}>
              <div className={styles.footer_links_column}>
                <h3>Products</h3>
                <a href="#">OsmOS</a>
                <a href="#">Asper</a>
                <a href="#">Research</a>
              </div>
              <div className={styles.footer_links_column}>
                <h3>Company</h3>
                <a href="#">About Us</a>
                <a href="#">Careers</a>
                <a href="#">Contact</a>
              </div>
            </div>
            <div className={styles.footer_socials}>
              <a href="#" aria-label="Twitter">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
              <a href="#" aria-label="LinkedIn">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.5 2h-17A1.5 1.5 0 002 3.5v17A1.5 1.5 0 003.5 22h17a1.5 1.5 0 001.5-1.5v-17A1.5 1.5 0 0020.5 2zM8 19H5v-9h3zM6.5 8.25A1.75 1.75 0 118.3 6.5a1.78 1.78 0 01-1.8 1.75zM19 19h-3v-4.74c0-1.42-.6-1.93-1.38-1.93A1.74 1.74 0 0013 14.19a.66.66 0 000 .14V19h-3v-9h2.9v1.3a3.11 3.11 0 012.7-1.4c1.55 0 3.36.86 3.36 3.66z"/>
                </svg>
              </a>
              <a href="#" aria-label="GitHub">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
        <div className={styles.footer_bottom}>
          <div className={styles.footer_bottom_left}>
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
            <a href="#">Cookie Policy</a>
          </div>
          <div>© {new Date().getFullYear()} Ground Zero Lab. All rights reserved.</div>
        </div>
      </section>
    </div>
  );
}
