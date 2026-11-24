"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CustomEase } from "gsap/CustomEase";
import { useGSAP } from "@gsap/react";
import { motion } from "@/lib/motion-tokens";

gsap.registerPlugin(ScrollTrigger, CustomEase, useGSAP);
CustomEase.create("flow", motion.ease.flow);
CustomEase.create("cine", motion.ease.cine);
gsap.defaults({ ease: "flow", duration: motion.dur.reveal });

export { gsap, ScrollTrigger, useGSAP };
