import { ImageResponse } from "next/og";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: "16px",
          background: "linear-gradient(135deg, #d0492f, #a32d17)",
          color: "#f4d488",
          fontSize: "40px",
          fontWeight: 700,
          fontFamily: "sans-serif",
        }}
      >
        C
      </div>
    ),
    size,
  );
}
