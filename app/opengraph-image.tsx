import { ImageResponse } from "next/og";
import { SITE_NAME, SITE_TAGLINE } from "@/lib/site";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = `${SITE_NAME} — ${SITE_TAGLINE}`;

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background: "#fff8f0",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", fontSize: 48, fontWeight: 800 }}>
          <span style={{ color: "#e8500f" }}>SNAP</span>
          <span style={{ color: "#1c1410" }}>THAI</span>
          <span
            style={{
              color: "#1c1410",
              background: "#ffb30f",
              padding: "0 14px",
              marginLeft: 8,
              borderRadius: 8,
            }}
          >
            HUB
          </span>
        </div>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            fontSize: 80,
            fontWeight: 800,
            color: "#1c1410",
            lineHeight: 1.05,
            marginTop: 40,
            maxWidth: 1000,
          }}
        >
          <span>Craving Thailand?&nbsp;</span>
          <span style={{ color: "#e8500f" }}>We ship it.</span>
        </div>
        <div style={{ fontSize: 34, color: "#6b5d52", marginTop: 28, maxWidth: 950 }}>
          Any product from Thailand — snap a photo or link, we buy it and ship it
          to your door worldwide. 🇹🇭
        </div>
      </div>
    ),
    { ...size }
  );
}
