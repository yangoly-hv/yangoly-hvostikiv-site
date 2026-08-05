import { ImageResponse } from "next/og";

export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function OpenGraphImage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const isUkrainian = locale === "uk";

  return new ImageResponse(
    (
      <div
        style={{
          alignItems: "center",
          background: "linear-gradient(135deg, #fff6e7 0%, #ffdf9c 100%)",
          color: "#28190e",
          display: "flex",
          flexDirection: "column",
          height: "100%",
          justifyContent: "center",
          padding: "72px",
          position: "relative",
          width: "100%",
        }}
      >
        <div style={{ display: "flex", fontSize: 42, letterSpacing: 8, marginBottom: 26 }}>
          {isUkrainian ? "БЛАГОДІЙНИЙ ФОНД" : "CHARITY FOUNDATION"}
        </div>
        <div style={{ display: "flex", fontSize: 92, fontWeight: 800, lineHeight: 1, textAlign: "center" }}>
          {isUkrainian ? "Янголи Хвостиків" : "Angels of Tails"}
        </div>
        <div style={{ display: "flex", fontSize: 36, marginTop: 42, textAlign: "center" }}>
          {isUkrainian ? "Допомагаємо тваринам в Україні" : "Helping animals in Ukraine"}
        </div>
        <div
          style={{
            border: "10px solid #ff8b1f",
            borderRadius: 999,
            height: 130,
            position: "absolute",
            right: 88,
            top: 72,
            width: 130,
          }}
        />
      </div>
    ),
    size
  );
}
