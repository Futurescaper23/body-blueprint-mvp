import { ImageResponse } from "next/og";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          height: "100%",
          width: "100%",
          background: "linear-gradient(135deg, #081118 0%, #0b0f14 45%, #12202c 100%)",
          color: "#f8fafc",
          fontFamily: "sans-serif",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: "auto auto -120px -60px",
            width: 420,
            height: 420,
            borderRadius: 9999,
            background: "rgba(61, 214, 166, 0.16)",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: -120,
            right: -80,
            width: 360,
            height: 360,
            borderRadius: 9999,
            background: "rgba(140, 199, 255, 0.14)",
          }}
        />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            width: "100%",
            padding: "56px 64px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 20,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 88,
                height: 88,
                borderRadius: 24,
                background: "#0b0f14",
                border: "3px solid rgba(255,255,255,0.08)",
                boxShadow: "0 18px 40px rgba(0,0,0,0.28)",
                fontSize: 34,
                fontWeight: 800,
              }}
            >
              BB
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 8,
              }}
            >
              <div
                style={{
                  fontSize: 22,
                  letterSpacing: 3,
                  textTransform: "uppercase",
                  color: "#6ee7bf",
                }}
              >
                Body Blueprint
              </div>
              <div
                style={{
                  fontSize: 24,
                  color: "#cbd5e1",
                }}
              >
                Workout plans built for real people
              </div>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 18,
              maxWidth: 760,
            }}
          >
            <div
              style={{
                fontSize: 76,
                lineHeight: 1.02,
                fontWeight: 800,
                letterSpacing: -2,
              }}
            >
              Simple plans, clear demos, and nutrition tracking on your phone.
            </div>
            <div
              style={{
                fontSize: 28,
                lineHeight: 1.4,
                color: "#cbd5e1",
              }}
            >
              Follow sessions, track progress, and keep everything in one place.
            </div>
          </div>

          <div
            style={{
              display: "flex",
              gap: 18,
              alignItems: "center",
            }}
          >
            {["Workout plans", "Exercise library", "Nutrition tracker"].map((item) => (
              <div
                key={item}
                style={{
                  display: "flex",
                  alignItems: "center",
                  padding: "14px 20px",
                  borderRadius: 9999,
                  background: "rgba(255,255,255,0.08)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  fontSize: 24,
                  color: "#e2e8f0",
                }}
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
    size,
  );
}
