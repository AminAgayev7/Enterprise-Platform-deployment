"use client";

import { useReportWebVitals } from "next/web-vitals";

export function WebVitals() {
    useReportWebVitals((metric) => {
        console.log({
            name: metric.name,
            value: metric.value,
            rating: metric.rating,
        });
    });

    return null;
}