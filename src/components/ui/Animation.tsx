"use client";

import React from "react";
import Lottie from "lottie-react";
import Searching from "@/assets/lottie/searching.json";
import Rocket from "@/assets/lottie/rocket.json";
import Jogging from "@/assets/lottie/jogging.json";
 
const ANIMATIONS = {
    searching: Searching,
    rocket: Rocket,
    jogging: Jogging,
};
 
export interface LottieProps extends React.ImgHTMLAttributes<HTMLImageElement> {
    name: keyof typeof ANIMATIONS;
    width?: number | string;
    height?: number | string;
    margin?: number | string;
}
 
export const Animation = ({
    name,
    width = 300,
    height = 300,
    margin,
}: LottieProps) => {
    const animationData = ANIMATIONS[name];
 
    return (
        <Lottie
            animationData={animationData}
            loop={true}
            autoplay={true}
            style={{ width: width, height: height, margin: margin }}
        />
    );
};
