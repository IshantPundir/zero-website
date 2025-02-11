"use client";

import { useEffect, useState } from "react";
import Image from 'next/image';
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import ScrollToPlugin from "gsap/dist/ScrollToPlugin";

import styles from "./page.module.css";
import Logo from "@/components/Logo";
import Navbar from "@/components/Navbar";

// Constants
const MOBILE_BREAKPOINT = 840;
const TYPING_SPEEDS = {
  TYPING: 200,
  DELETING: 100,
  PAUSE_BEFORE_DELETE: 1000
};

const COMPANION_WORDS = ["companion", "assistant"];

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

export default function Home() {
  // State management
  const [isMobile, setIsMobile] = useState(false);
  const [logoColor, setLogoColor] = useState("white");
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  
  // Typing animation states
  const [companionWord, setCompanionWord] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [wordIndex, setWordIndex] = useState(0);

  // Add new state
  const [isAsperVisible, setIsAsperVisible] = useState(false);

  // Mobile detection
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= MOBILE_BREAKPOINT);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Section pinning
  useEffect(() => {
    const sections = gsap.utils.toArray("section") as Element[];
    const isMobile = window.innerWidth <= MOBILE_BREAKPOINT;
    
    sections.forEach((section: Element, index: number) => {
      const shouldPin = (index === 0 || index === 3) // Only pin on desktop
      const isFooter = index === sections.length - 1;
      
      if (!isFooter) {  // Only create ScrollTrigger for non-footer sections
        ScrollTrigger.create({
          trigger: section,
          start: "top top",
          pin: shouldPin,
          pinSpacing: false,
          snap: isMobile ? 0 : { // Disable snap on mobile
            snapTo: 1,
            duration: 0.4,
            delay: 0,
            ease: "power1.inOut",
            inertia: false
          }
        });
      }
    });

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  // Logo color management
  useEffect(() => {
    const handleScroll = () => {
      const visionSection = document.querySelector(`.${styles.vision_section}`);
      const logo = document.querySelector(`.${styles.logo}`);
      
      if (!visionSection || !logo) return;

      const visionRect = visionSection.getBoundingClientRect();
      const logoRect = logo.getBoundingClientRect();
      
      const newColor = isVideoPlaying ? "white" : 
                      visionRect.top <= logoRect.bottom ? "#383838" : "#f2f2f2";
      
      setLogoColor(newColor);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isVideoPlaying]);

  // Carousel animation
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

  // Navigation handlers
  const handleNavigation = {
    explore: (e: React.MouseEvent) => {
      e.preventDefault();
      const visionSection = document.querySelector(`.${styles.vision_section}`);
      if (visionSection) {
        gsap.to(window, {
          duration: 1,
          scrollTo: visionSection,
          ease: "power2.inOut"
        });
      }
    },

    osmos: (e: React.MouseEvent) => {
      e.preventDefault();
      const osmosSection = document.querySelector(`.${styles.osmos_section}`);
      if (osmosSection) {
        gsap.to(window, {
          duration: 1,
          scrollTo: osmosSection,
          ease: "power2.inOut"
        });
      }
    }
  };

  // Carousel navigation
  const scrollToItem = (index: number) => {
    const carousel = document.querySelector(`.${styles.osmos_carousel}`) as HTMLElement;
    const items = document.querySelectorAll(`.${styles.osmos_carousel_item}`);
    const buttons = document.querySelectorAll(`.${styles.osmos_nav_button}`);
    const slider = document.querySelector(`.${styles.osmos_nav_slider}`) as HTMLElement;
    
    if (!items[index]) return;

    const scrollAmount = index * (window.innerWidth * 0.8 + 21);
    const activeButton = buttons[index] as HTMLElement;

    // Update carousel position
    carousel.scrollTo({
      left: scrollAmount,
      behavior: 'smooth'
    });
    
    // Update slider position
    slider.style.width = `${activeButton.offsetWidth}px`;
    slider.style.left = `${activeButton.offsetLeft}px`;
    
    // Update button states
    buttons.forEach((button, i) => {
      button.classList.toggle(styles.active, i === index);
    });
  };

  // ScrollToPlugin initialization
  useEffect(() => {
    const loadScrollToPlugin = async () => {
      const ScrollToPlugin = (await import('gsap/ScrollToPlugin')).default;
      gsap.registerPlugin(ScrollToPlugin);
    };
    
    loadScrollToPlugin();
  }, []);

  // Carousel navigation update
  const updateNavigation = () => {
    const carousel = document.querySelector(`.${styles.osmos_carousel}`) as HTMLElement;
    const buttons = document.querySelectorAll(`.${styles.osmos_nav_button}`);
    const slider = document.querySelector(`.${styles.osmos_nav_slider}`) as HTMLElement;

    const itemWidth = window.innerWidth * 0.8 + 21;
    const activeIndex = Math.round(carousel.scrollLeft / itemWidth);

    buttons.forEach((button, i) => {
      const isActive = i === activeIndex;
      button.classList.toggle(styles.active, isActive);
      
      if (isActive) {
        const activeButton = button as HTMLElement;
        slider.style.width = `${activeButton.offsetWidth}px`;
        slider.style.left = `${activeButton.offsetLeft}px`;
      }
    });
  };

  // Initialize carousel navigation
  useEffect(() => {
    const carousel = document.querySelector(`.${styles.osmos_carousel}`);
    const activeButton = document.querySelector(`.${styles.osmos_nav_button}.${styles.active}`) as HTMLElement;
    const slider = document.querySelector(`.${styles.osmos_nav_slider}`) as HTMLElement;
    
    if (activeButton && slider) {
      slider.style.width = `${activeButton.offsetWidth}px`;
      slider.style.left = `${activeButton.offsetLeft}px`;
    }

    carousel?.addEventListener('scroll', updateNavigation);
    return () => carousel?.removeEventListener('scroll', updateNavigation);
  }, []);

  // Mouse parallax effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const asperSection = document.querySelector(`.${styles.asper_section}`);
      if (!asperSection) return;

      const rect = asperSection.getBoundingClientRect();
      if (e.clientY >= rect.top && e.clientY <= rect.bottom) {
        const xValue = (e.clientX - window.innerWidth / 2) / 50;
        const yValue = (e.clientY - rect.top - rect.height / 2) / 50;
        
        setMousePosition({ 
          x: -xValue,
          y: -yValue 
        });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Video visibility management
  useEffect(() => {
    const handleScroll = () => {
      const asperSection = document.querySelector(`.${styles.asper_section}`);
      if (!asperSection) return;

      const rect = asperSection.getBoundingClientRect();
      if (rect.top >= window.innerHeight || rect.bottom < 0) {
        console.log(rect.top, rect.bottom, window.innerHeight);
        setIsVideoPlaying(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Typing animation
  useEffect(() => {
    const targetWord = COMPANION_WORDS[wordIndex];
    const currentLength = companionWord.length;
    
    const timeout = setTimeout(() => {
      if (!isDeleting) {
        if (currentLength < targetWord.length) {
          setCompanionWord(targetWord.slice(0, currentLength + 1));
        } else {
          setTimeout(() => setIsDeleting(true), TYPING_SPEEDS.PAUSE_BEFORE_DELETE);
        }
      } else {
        if (currentLength > 0) {
          setCompanionWord(targetWord.slice(0, currentLength - 1));
        } else {
          setIsDeleting(false);
          setWordIndex((prev) => (prev + 1) % COMPANION_WORDS.length);
        }
      }
    }, isDeleting ? TYPING_SPEEDS.DELETING : TYPING_SPEEDS.TYPING);

    return () => clearTimeout(timeout);
  }, [companionWord, isDeleting, wordIndex]);

  // Add new effect to track Asper section visibility
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsAsperVisible(entry.isIntersecting);
      },
      { threshold: 0.1 } // Trigger when at least 10% of the section is visible
    );

    const asperSection = document.querySelector(`.${styles.asper_section}`);
    if (asperSection) {
      observer.observe(asperSection);
    }

    return () => observer.disconnect();
  }, []);

  // Vision section text animation for mobile
  useEffect(() => {
    const isMobile = window.innerWidth <= MOBILE_BREAKPOINT;
    
    if (isMobile) {
      // Vision title animation
      const visionTitle = document.querySelector(`.${styles.vision_section} h1`);
      
      if (visionTitle) {
        gsap.fromTo(visionTitle, 
          {
            fontSize: 'clamp(89px, 25vw, 200px)',
            opacity: 0.3
          },
          {
            fontSize: 'clamp(55px, 15vw, 89px)',
            opacity: 1,
            scrollTrigger: {
              trigger: `.${styles.vision_section}`,
              start: "top 70%",
              end: "top 30%",
              scrub: true,
              toggleActions: "play none none reverse"
            }
          }
        );
      }

      // OsmOS title animation - now using same font sizes as Vision
      const osmosTitle = document.querySelector(`.${styles.osmos_section} h1`);
      
      if (osmosTitle) {
        gsap.fromTo(osmosTitle, 
          {
            fontSize: 'clamp(89px, 25vw, 200px)',
            opacity: 0.3
          },
          {
            fontSize: 'clamp(55px, 15vw, 89px)', // Matched with Vision title
            opacity: 1,
            scrollTrigger: {
              trigger: `.${styles.osmos_section}`,
              start: "top 70%",
              end: "top 30%",
              scrub: true,
              toggleActions: "play none none reverse"
            }
          }
        );
      }
    }

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <div className={styles.page}>
      <Navbar mobile_view={isMobile} color={logoColor} />

      <div className={styles.logo} onClick={() => {
        gsap.to(window, {
          duration: 1,
          scrollTo: 0,
          ease: "power2.inOut"
        });
      }}>
        <Logo borderWidth="2px" borderColor={logoColor} />
      </div>

      {/* Hero Section */}
      <section className={styles.hero_section}>
        <h1>Zero</h1>
        <h2>Making Technology Humane</h2>
        <a href="#" className={styles.hero_cta} onClick={handleNavigation.explore}>
          Explore Zero
        </a>
        
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

      {/* Vision Section */}
      <section className={styles.vision_section}>
        <div>
          <h1>Our Vision</h1>
          <p>
            At <strong>Ground Zero Lab</strong>, we are pushing the boundaries of <strong>AI</strong> to create technology that is not only powerful but also deeply <strong>intuitive and humane</strong>. Our mission is to bridge the gap between <strong>cutting-edge research</strong> and <strong>real-world applications</strong>, developing <strong>state-of-the-art AI systems</strong> that enhance human potential. From <strong>advanced deep learning</strong> architectures to innovative computing environments, we are re-imagining how AI integrates with daily life. Our focus spans <strong>LLMs</strong>, <strong>multimodal AI</strong>, <strong>generative models</strong>, and <strong>intelligent interfaces</strong>, all designed to make technology more expressive, accessible, and efficient. At Ground Zero Lab, we believe the future of AI isn&apos;t just about intelligence—it&apos;s about <strong>understanding</strong>, <strong>creativity</strong>, and <strong>seamless interaction</strong> with the world.
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

        <div className={styles.go_to_osmos} onClick={handleNavigation.osmos}>
          <svg width="16" height="76" viewBox="0 0 16 76" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M7.29289 75.7071C7.68341 76.0976 8.31658 76.0976 8.7071 75.7071L15.0711 69.3431C15.4616 68.9526 15.4616 68.3195 15.0711 67.9289C14.6805 67.5384 14.0474 67.5384 13.6569 67.9289L8 73.5858L2.34314 67.9289C1.95262 67.5384 1.31945 67.5384 0.928929 67.9289C0.538405 68.3195 0.538405 68.9526 0.928929 69.3431L7.29289 75.7071ZM7 -4.37114e-08L7 75L9 75L9 4.37114e-08L7 -4.37114e-08Z" fill="#383838"/>
          </svg>

          <h2>
            Explore Our Products
          </h2>
        </div>
      </section>

      {/* OsmOS Section */}
      <section className={styles.osmos_section}>
        <h1>OsmOS!</h1>
        <div className={styles.osmos_nav}>
          <div className={styles.osmos_nav_slider}></div>
          <button 
            className={`${styles.osmos_nav_button} ${styles.active}`}
            onClick={() => scrollToItem(0)}
          >
            OsmOS
          </button>
          <button 
            className={styles.osmos_nav_button}
            onClick={() => scrollToItem(1)}
          >
            CGUI
          </button>
          <button 
            className={styles.osmos_nav_button}
            onClick={() => scrollToItem(2)}
          >
            Edge AI
          </button>
          <button 
            className={styles.osmos_nav_button}
            onClick={() => scrollToItem(3)}
          >
            Open & Private
          </button>
        </div>
        <div className={styles.osmos_carousel}>
          <div className={styles.osmos_carousel_item}>
            <div>
              <h2>AI Companion</h2>
              <p>
                <strong>OsmOS</strong> is not just another operating system; it is designed to be an <strong>intelligent companion</strong>. Unlike traditional utilitarian OS models, OsmOS integrates <strong>conversational AI</strong> with <strong>emotional intelligence</strong>, enabling a more <strong>natural and intuitive</strong> computing experience. It understands users beyond commands, interpreting <strong>facial cues</strong>, <strong>voice tone</strong>, and <strong>context</strong> to respond in a way that feels truly interactive and personal.  
              </p>
            </div>
            <Image src="/images/osmos/image1.png" alt="OsmOS 1" width={300} height={0} style={{ height: 'auto' }} />
          </div>

          <div className={styles.osmos_carousel_item}>
            <div>
              <h2>Natural Interaction</h2>
              <p>
                OsmOS redefines how users interact with applications by merging <strong>conversational AI</strong> with <strong>graphical interfaces</strong> we call <strong>CGUI</strong>. Instead of manually navigating through complex menus, users can control <strong>native Flutter applications</strong> through <strong>natural language commands</strong>. Unlike other AI assistants trying to simulate human actions on apps, OsmOS <strong>directly integrates</strong> with applications, allowing for <strong>fast and efficient execution</strong> of tasks at the system level.  
              </p>
            </div>
            <Image src="/images/osmos/image2.png" alt="OsmOS 1" width={300} height={0} style={{ height: 'auto' }} />
          </div>

          <div className={styles.osmos_carousel_item}>
            <div>
              <h2>Edge AI </h2>
              <p>
                OsmOS runs <strong> 10+ deep neural networks</strong> natively, ensuring <strong>real-time AI processing</strong>. It optimizes <strong>AI workloads</strong> to run efficiently on <strong>edge devices</strong>, delivering <strong>low-latency performance</strong> even on resource-constrained hardware. This makes OsmOS not only powerful but also <strong>energy-efficient</strong>, enabling next-generation AI experiences on personal devices.  
              </p>
            </div>
            <Image src="/images/osmos/image3.png" alt="OsmOS 1" width={300} height={0} style={{ height: 'auto' }} />
          </div>

          <div className={styles.osmos_carousel_item}>
            <div>
              <h2>Open & Private</h2>
              <p>
                <strong>Privacy</strong> is a core principle of OsmOS, with AI models running entirely <strong>offline</strong> on the host device, ensuring data remains <strong>secure</strong>. OsmOS is <strong>open-source</strong> and free, inviting developers to build upon its foundation and create innovative applications. With <strong>native AI APIs</strong>, developers can seamlessly integrate AI-rich features into their apps, making OsmOS a powerful platform for the future of <strong>AI-driven computing</strong>.  
              </p>
            </div>
            <Image src="/images/osmos/image4.png" alt="OsmOS 1" width={300} height={0} style={{ height: 'auto' }} />
          </div>
        </div>
      </section>

      {/* Asper section */}
      <section className={`${styles.asper_section} ${isVideoPlaying ? styles.video_playing : ''}`}>
        {isAsperVisible && (
          <div className={styles.background_wrapper} 
               style={{
                 transform: isVideoPlaying ? 'translate(-50%, -80%)' : `translate(-50%, -80%) translate(${mousePosition.x}px, ${mousePosition.y}px)`,
                 transition: 'transform 0.2s ease-out'
               }}>
            <div className={`${styles.asper_image}`}>
              <Image 
                src="/images/asper-gold-gs.png" 
                alt="Aspers" 
                width={2606} 
                height={840}
                style={{
                  transition: 'transform 0.2s ease-out',
                  height: '100%',
                  objectFit: 'contain'
                }}
              />
            </div>
            
            <div className={`${styles.asper_image}`}>
              <Image 
                src="/images/asper-gold-gs.png" 
                alt="Aspers" 
                width={2606} 
                height={840}
                style={{
                  transition: 'transform 0.2s ease-out',
                  height: '100%',
                  objectFit: 'contain'
                }}
              />
            </div>

            <div className={`${styles.asper_image}`}>
              <Image 
                src="/images/asper-gold-gs.png" 
                alt="Aspers" 
                width={2606} 
                height={840}
                style={{
                  transition: 'transform 0.2s ease-out',
                  height: '100%',
                  objectFit: 'contain'
                }}
              />

              {isVideoPlaying && (
                <div className={`${styles.asper_demo_video_frame} ${isVideoPlaying ? styles.visible : ''}`}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: '8px',
                    width: '100%',
                    height: '100%',
                    color: 'white',
                    fontSize: '1.5rem',
                    position: 'absolute',
                    opacity: '1',
                    transition: 'opacity 0.5s ease',
                    zIndex: 0
                  }}
                  className={styles.loading_text}>
                    <svg 
                      width="55" 
                      height="55" 
                      viewBox="0 0 24 24" 
                      xmlns="http://www.w3.org/2000/svg"
                      style={{
                        animation: 'spin 1s linear infinite'
                      }}
                    >
                      <style>{`
                        @keyframes spin {
                          0% { transform: rotate(0deg); }
                          100% { transform: rotate(360deg); }
                        }
                      `}</style>
                      <path
                        d="M12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2ZM12 4C16.4183 4 20 7.58172 20 12C20 16.4183 16.4183 20 12 20C7.58172 20 4 16.4183 4 12C4 7.58172 7.58172 4 12 4Z"
                        fill="currentColor"
                        fillOpacity="0.2"
                      />
                      <path
                        d="M12 2C6.47715 2 2 6.47715 2 12H4C4 7.58172 7.58172 4 12 4V2Z"
                        fill="currentColor"
                      />
                    </svg>
                  </div>
                  <iframe
                    width="853"
                    height="480"
                    src="https://www.youtube.com/embed/e4IrWh2_4_E?autoplay=1"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    style={{
                      display: 'none',
                      position: 'relative',
                      zIndex: 1
                    }}
                    onLoad={(e) => {
                      const target = e.target as HTMLIFrameElement;
                      const loadingText = target.parentElement?.querySelector(`.${styles.loading_text}`) as HTMLElement;
                      
                      setTimeout(() => {
                        target.style.display = 'block';
                        target.style.opacity = '0';
                        
                        requestAnimationFrame(() => {
                          target.style.opacity = '1';
                          target.style.transition = 'opacity 0.5s ease';
                          
                          if (loadingText) {
                            loadingText.style.opacity = '0';
                            setTimeout(() => {
                              loadingText.style.display = 'none';
                            }, 500);
                          }
                        });
                      }, 1000);
                    }}
                  />
                </div>
              )}
            </div>

            <div className={`${styles.asper_image}`}>
              <Image 
                src="/images/asper-gold-gs.png" 
                alt="Aspers" 
                width={2606} 
                height={840}
                style={{
                  transition: 'transform 0.2s ease-out',
                  height: '100%',
                  objectFit: 'contain'
                }}
              />
            </div>

            <div className={`${styles.asper_image}`}>
              <Image 
                src="/images/asper-gold-gs.png" 
                alt="Aspers" 
                width={2606} 
                height={840}
                style={{
                  transition: 'transform 0.2s ease-out',
                  height: '100%',
                  objectFit: 'contain'
                }}
              />
            </div>
          </div>
        )}

        <div className={styles.asper_section_text}>
          <h1>Asper</h1>
          <h2>Your personal <span className={styles.typewriter}>{companionWord}</span>, powered by OsmOS.</h2>
          <div className={styles.asper_watch_demo_button}>
            <a href="#" onClick={(e) => {
              e.preventDefault();
              setIsVideoPlaying(true);
              setLogoColor("white");
            }}>
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

      {/* Footer Section */}
      <section className={styles.footer_section}>
        <div className={styles.footer_content}>
          <div className={styles.footer_left}>
            <h1>Let&apos;s Talk!</h1>
            <p>
              Ready to explore how our AI solutions can transform your business? 
              We&apos;re here to help you navigate the future of technology.
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
          </div>
          <div>© {new Date().getFullYear()} Ground Zero Lab. All rights reserved.</div>
        </div>
      </section>
    </div>
  );
}
