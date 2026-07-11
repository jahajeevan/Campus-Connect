import { ImageResponse } from "next/og";
import { site } from "@/lib/site";

export const alt = `${site.name} — Live Canteen Menus`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background:
            "linear-gradient(135deg, #fbfaf7 0%, #f5f1ea 60%, #f8f0df 100%)",
          padding: "72px",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <div
            style={{
              width: "72px",
              height: "72px",
              borderRadius: "20px",
              background: "linear-gradient(135deg, #d0492f, #a32d17)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#f8f0df",
              fontSize: "40px",
              fontWeight: 700,
            }}
          >
            C
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontSize: "34px", fontWeight: 700, color: "#211e1a" }}>
              {site.name}
            </span>
            <span style={{ fontSize: "20px", color: "#6c665e" }}>
              {site.university}
            </span>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <span
            style={{
              fontSize: "68px",
              fontWeight: 700,
              color: "#211e1a",
              lineHeight: 1.05,
              letterSpacing: "-0.02em",
            }}
          >
            Live canteen menus,
          </span>
          <span
            style={{
              fontSize: "68px",
              fontWeight: 700,
              lineHeight: 1.05,
              letterSpacing: "-0.02em",
              color: "#c1391f",
            }}
          >
            before you leave the hostel.
          </span>
        </div>

        <span style={{ fontSize: "26px", color: "#6c665e" }}>
          {site.campus} · See what&rsquo;s available &amp; what it costs, in real time.
        </span>
      </div>
    ),
    size,
  );
}
