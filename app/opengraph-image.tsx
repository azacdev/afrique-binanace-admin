import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "Afrique Bitcoin Conference 2026";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "linear-gradient(135deg, #155E63 0%, #1B4441 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "sans-serif",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Background decorative elements */}
        <div
          style={{
            position: "absolute",
            top: "-100px",
            right: "-100px",
            width: "400px",
            height: "400px",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(108, 191, 109, 0.3) 0%, transparent 70%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "-150px",
            left: "-100px",
            width: "500px",
            height: "500px",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(255, 202, 5, 0.2) 0%, transparent 70%)",
          }}
        />

        {/* Logo placeholder */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: "20px",
          }}
        >
          <svg
            width="80"
            height="88"
            viewBox="0 0 58 64"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M1.92489 22.4414C2.11814 22.1516 2.21477 21.9584 2.40801 21.7651C4.82362 18.9633 10.6211 17.4175 15.9354 18.3836C16.1287 18.3836 16.4185 18.4802 16.6118 18.4802C17.2882 18.6735 17.9645 18.7701 18.5443 19.0599C19.7038 19.4464 20.67 20.0261 21.443 20.6058C22.216 21.2821 22.7957 22.055 23.0856 22.8279C23.1822 23.1178 23.2789 23.4076 23.2789 23.6974C23.3755 24.4704 23.1822 25.2433 22.6991 26.0162C22.3126 26.6925 21.7329 27.2722 21.0565 27.7553C18.351 29.7842 13.4232 30.847 8.68859 30.074C4.63037 29.3977 2.02152 27.562 1.44177 25.3399C1.1519 24.3737 1.34515 23.4076 1.92489 22.4414Z"
              fill="white"
            />
            <path
              d="M40.8643 24.7603C38.0622 22.828 31.1052 24.1806 24.3415 28.0452C16.6116 32.4895 10.8141 39.2526 12.7466 42.9239C14.8723 47.0784 25.3078 44.7596 34.1006 38.2864C41.5407 32.6827 43.9563 26.8858 40.8643 24.7603Z"
              fill="#FFCA05"
            />
            <path
              d="M14.7761 0.219996C8.4955 1.28276 4.9204 5.43722 3.47104 7.36952C3.18116 7.75598 2.98792 8.04583 2.89129 8.14244C0.089186 12.3935 -0.200687 16.9344 0.0891862 20.316C1.05543 19.543 2.1183 18.8667 3.08454 18.0938C3.08454 17.3209 2.98792 10.5578 8.59213 6.21014C12.747 3.02184 18.3512 2.34553 23.279 4.47106C24.825 4.18122 26.371 3.79476 27.917 3.50491C26.9507 2.82861 21.8297 -0.939387 14.7761 0.219996ZM56.1313 20.2193C55.1651 20.0261 54.2954 19.8329 53.3292 19.9295C47.9182 20.5092 45.9857 12.9732 43.86 9.10859C43.9566 10.4612 43.3769 11.8138 42.4106 13.0698C44.7296 17.9006 46.4689 23.1178 53.1359 23.0212C54.7786 23.0212 54.8752 23.2144 54.1988 24.7603C51.3967 30.5572 46.179 34.9049 45.0195 41.4747C44.0533 47.9479 40.8647 56.8365 35.0672 60.5079C31.9752 62.247 28.7866 56.1602 28.0136 53.8414C27.2406 51.4261 27.5305 48.9141 27.5305 46.4987C27.5305 46.2088 27.5305 45.919 27.5305 45.6291C26.4676 46.0156 25.4048 46.4021 24.3419 46.7885C24.3419 46.9818 24.3419 47.175 24.2453 47.5614C24.1486 49.1073 23.8588 52.9719 25.7913 57.0297C26.6609 58.8654 27.917 60.6045 29.463 62.1503C38.2558 69.5897 45.9857 52.4888 47.2419 45.7258C48.3047 40.7984 49.9473 36.4507 53.0393 32.4895C54.6819 30.1707 61.0591 21.4753 56.1313 20.2193Z"
              fill="white"
            />
            <path
              d="M32.026 17.9021C39.4089 16.7599 44.8514 12.3288 44.1824 8.00503C43.5133 3.68121 36.986 1.10201 29.6031 2.24421C22.2203 3.38641 16.7777 7.8175 17.4468 12.1413C18.1159 16.4651 24.6432 19.0443 32.026 17.9021Z"
              fill="#6CBF6D"
            />
          </svg>
        </div>

        {/* Main title */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "0px",
          }}
        >
          <span
            style={{
              fontSize: "72px",
              fontWeight: "bold",
              color: "white",
              letterSpacing: "-2px",
              lineHeight: "1",
            }}
          >
            CONFERENCE
          </span>
          <span
            style={{
              fontSize: "72px",
              fontWeight: "bold",
              color: "white",
              letterSpacing: "-2px",
              lineHeight: "1",
            }}
          >
            BITCOIN AFRIQUE
          </span>
        </div>

        {/* Year */}
        <span
          style={{
            fontSize: "140px",
            fontWeight: "bold",
            fontStyle: "italic",
            color: "#D4D261",
            letterSpacing: "-4px",
            lineHeight: "1",
            marginTop: "10px",
          }}
        >
          2026
        </span>

        {/* Date and location */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "4px",
            marginTop: "24px",
          }}
        >
          <span
            style={{
              fontSize: "20px",
              fontWeight: "500",
              color: "#F9D633",
              letterSpacing: "4px",
              textTransform: "uppercase",
            }}
          >
            APRIL 11-13, 2026
          </span>
          <span
            style={{
              fontSize: "20px",
              fontWeight: "500",
              color: "#F9D633",
              letterSpacing: "4px",
              textTransform: "uppercase",
            }}
          >
            COTONOU, BÉNIN
          </span>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
