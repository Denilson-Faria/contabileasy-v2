import svg404 from "../assets/404.svg";

export default function NotFound() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#07090f",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem",
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      <div
        style={{
          maxWidth: 900,
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 40,
          flexWrap: "wrap",
        }}
      >
        {/* Texto */}
        <div style={{ flex: 1, minWidth: 280 }}>
          <div
            style={{
              fontSize: 60,
              fontWeight: 800,
              color: "#4ade80",
              fontFamily: "'Sora', sans-serif",
              marginBottom: 10,
            }}
          >
            404
          </div>

          <h1
            style={{
              fontSize: 32,
              color: "#f1f5f9",
              marginBottom: 10,
              fontWeight: 700,
            }}
          >
            Página não encontrada
          </h1>

          <p
            style={{
              color: "#94a3b8",
              fontSize: 15,
              lineHeight: 1.6,
              marginBottom: 25,
            }}
          >
            A página que você tentou acessar não existe ou foi movida.
          </p>

          <button
            onClick={() => (window.location.href = "/")}
            style={{
              padding: "0.9rem 1.6rem",
              borderRadius: 12,
              border: "none",
              fontWeight: 700,
              background: "linear-gradient(135deg,#4ade80,#22d3ee)",
              color: "#052e16",
              cursor: "pointer",
              fontSize: 14,
            }}
          >
            Voltar para o início
          </button>
        </div>

        {/* SVG */}
        <div style={{ flex: 1, minWidth: 260 }}>
          <img
            src={svg404}
            alt="Página não encontrada"
            style={{ width: "100%", maxWidth: 420 }}
          />
        </div>
      </div>
    </div>
  );
}