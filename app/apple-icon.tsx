import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#111111",
        }}
      >
        <svg
          viewBox="0 0 80 80"
          width="110"
          height="110"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M0 0H40C62.0914 0 80 17.9086 80 40C80 62.0914 62.0914 80 40 80H0V0ZM18 18H40C52.1503 18 62 27.8497 62 40C62 52.1503 52.1503 62 40 62C27.8497 62 18 52.1503 18 40V18Z"
            fill="#ffffff"
          />
        </svg>
      </div>
    ),
    { ...size }
  );
}
