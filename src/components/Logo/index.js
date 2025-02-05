"use client";
import { useEffect, useState } from "react";
import styles from "./logo.module.scss";

export default function Logo({ 
    borderWidth = "5px",
    borderColor = "white",
    containerStyle = {},
    ringStyle = {}
}) {
    const [animate, set_animate] = useState(false);

    useEffect(() => {
        set_animate(true);

        // Need this for safari. it my solution for logo's inner rings drifting after it being out-of-focus
        window.addEventListener("focus", () => {
            set_animate(false);
            setTimeout(() => {
                set_animate(true);
            }, 100);
        });
        return () => {
            window.removeEventListener("focus", {})
        }
    }, []);

    const baseContainerStyle = {
        border: `${borderWidth} solid ${borderColor}`,
        ...containerStyle
    };

    const baseRingStyle = {
        border: `${borderWidth} solid ${borderColor}`,
        ...ringStyle
    };

    return (
        <div className={styles.logo_container} style={baseContainerStyle}>
            <div className={`${styles.inner_pair} ${animate ? styles.clockwise_rotation_animation:null}`}>
                <div className={styles.inner_ring} style={baseRingStyle} />
                <div className={`${styles.inner_ring} ${styles.inner_ring_overlap}`} style={baseRingStyle} />
            </div>

            <div className={`${styles.inner_pair} ${animate ? styles.anticlockwise_rotation_animation:null}`}>
                <div className={styles.inner_ring} style={baseRingStyle} />
                <div className={`${styles.inner_ring} ${styles.inner_ring_overlap}`} style={baseRingStyle} />
            </div>
        </div>
    );
}