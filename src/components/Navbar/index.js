"use client";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import styles from "./navbar.module.scss";

const nav_show_timeline = gsap.timeline({
    paused: true,
    defaults: {
        duration: 0.5,
        ease: "power2.inOut"
    }
});

const NavBarForMobile = (props) => {
    const [mobile_nav_expanded, set_mobile_nav_expanded] = useState(false);
    const nav_ref = useRef();


    function show_nav() {
        nav_show_timeline.play();
    }

    function hide_nav() {
        nav_show_timeline.pause();
        nav_show_timeline.reverse();
        set_mobile_nav_expanded(false);
    }

    function toggele_nav() {
        if(mobile_nav_expanded) {
            hide_nav();
        }
        else {
            show_nav();
        }

        set_mobile_nav_expanded(!mobile_nav_expanded);
    }

    function handlePreorder(e) {
        // Check if callback exists before calling
        console.log("Setting pre-order");
        e.preventDefault();
        hide_nav();
        if (props.popupCallback) {
            props.popupCallback(true);
        }
        }

    useEffect(() => {
        // Update timeline configuration
        nav_show_timeline.eventCallback("onStart", () => {
            nav_ref.current.style.display = "block";
            // document.getElementById("background-noise").style.zIndex = 101;
        });

        nav_show_timeline.eventCallback("onReverseComplete", () => {
            nav_ref.current.style.display = "none";
            // document.getElementById("background-noise").style.zIndex = 1;
        });
        
        nav_show_timeline
        .to("#mobile-navbar", {
            opacity: 1
        }, "-=1")
        .from("#mobile-nav-stagger-animation", {
            opacity: 0,
            yPercent: -50,
            stagger: 0.1
        }, "-=0.5")
        .from("#mobile-nav-zro", {
            opacity: 0,
            xPercent: -100
        }, "-=1");
        
      return () => {
        nav_show_timeline.kill();
      };
    }, []);
    
    return (
        <>
            <button className={`${styles.menu_icon} ${ mobile_nav_expanded ? styles.opened:{}}`} onClick={toggele_nav} aria-label="Main Menu">
                <svg width="50" height="50" viewBox="0 0 100 100">
                    <path className={`${styles.line} ${styles.line1}`} d="M 20,29.000046 H 80.000231 C 80.000231,29.000046 94.498839,28.817352 94.532987,66.711331 94.543142,77.980673 90.966081,81.670246 85.259173,81.668997 79.552261,81.667751 75.000211,74.999942 75.000211,74.999942 L 25.000021,25.000058" />
                    <path className={`${styles.line} ${styles.line2}`} d="M 20,50 H 80" />
                    <path className={`${styles.line} ${styles.line3}`} d="M 20,70.999954 H 80.000231 C 80.000231,70.999954 94.498839,71.182648 94.532987,33.288669 94.543142,22.019327 90.966081,18.329754 85.259173,18.331003 79.552261,18.332249 75.000211,25.000058 75.000211,25.000058 L 25.000021,74.999942" />
                </svg>
            </button>

            <div className={styles.mobile_navbar} id="mobile-navbar" ref={nav_ref}>
                <ul className={styles.primary_nav}>
                    <li><a href="#" id="mobile-nav-stagger-animation">Vision</a></li>
                    <li><a href="#" id="mobile-nav-stagger-animation">Products</a></li>
                    <li><a href="#" id="mobile-nav-stagger-animation">About Us</a></li>
                    <li><a href="#" id="mobile-nav-stagger-animation">Contact Us</a></li>
                </ul>

                <div className={styles.social_links}>
                    <h1 id="mobile-nav-zro">Zero</h1>

                    <ul className={styles.navbar_contact_links}>
                        <li id="mobile-nav-stagger-animation">
                            <a href="https://www.instagram.com/heyasper/" target="_blank" rel="noopener noreferrer">
                                <img src="/instagram.svg" alt="Our Instagram link"/>
                                @heyAsper
                            </a>
                        </li>
                        <li id="mobile-nav-stagger-animation">
                            <a href="https://twitter.com/heyasper?t=ULkeBpXmS2Jf0n2CKaal_A&s=09" target="_blank" rel="noopener noreferrer">
                                <img src="/twitter.svg" alt="Our Twitter link"/>
                                @heyAsper
                            </a>
                        </li>
                        <li id="mobile-nav-stagger-animation">
                            <a href="mailto: contact@zro.company"  target="_blank" rel="noopener noreferrer">
                                <img src="/email.svg" alt="Our Email link"/>
                                ishant@groundzerolab.com
                            </a>
                        </li>
                    </ul>

                    <a href="#" alt="Pre oreder Asper" className={styles.preorder_cta} onClick={handlePreorder}>
                        Get OsmOS
                    </a>
                </div>
            </div>
        </>
    );
}

const NavBarForDesktop = () => {

    return (
        <div className={styles.desktop_navbar}>
            <ul className={styles.nav_links}>
                <li><a href="#" id="mobile-nav-stagger-animation">Vision</a></li>
                <li><a href="#" id="mobile-nav-stagger-animation">Products</a></li>
                <li><a href="#" id="mobile-nav-stagger-animation">About Us</a></li>
                <li><a href="#" id="mobile-nav-stagger-animation">Contact Us</a></li>
            </ul>

            <a alt="Pre oreder Asper" className={styles.cta} onClick={()=>{/* TODO: Add email collection form*/}}>
                Get OsmOS
            </a>
        </div>
    );
};

// TODO: Add Desktop view
export default function NavBar(props) {

    return (
        props.mobile_view ? <NavBarForMobile popupCallback={props.popupCallback}/> : <NavBarForDesktop/>
    );
}