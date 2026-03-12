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
          width: "100%",
          maxWidth: 1280,
          display: "grid",
          gridTemplateColumns: "minmax(320px, 460px) minmax(360px, 620px)",
          alignItems: "center",
          justifyContent: "center",
          gap: "4rem",
        }}
      >
        <div style={{ maxWidth: 430 }}>
          <div
            style={{
              fontSize: 72,
              fontWeight: 800,
              color: "#4ade80",
              fontFamily: "'Sora', sans-serif",
              lineHeight: 1,
              marginBottom: 14,
            }}
          >
            404
          </div>

          <h1
            style={{
              fontSize: 44,
              color: "#f8fafc",
              margin: "0 0 12px",
              fontWeight: 800,
              lineHeight: 1.08,
            }}
          >
            Página não encontrada
          </h1>

          <p
            style={{
              color: "#94a3b8",
              fontSize: 16,
              lineHeight: 1.7,
              marginBottom: 28,
            }}
          >
            A página que você tentou acessar não existe ou foi movida.
          </p>

          <button
            onClick={() => (window.location.href = "/")}
            style={{
              padding: "0.95rem 1.6rem",
              borderRadius: 14,
              border: "none",
              fontWeight: 700,
              background: "linear-gradient(135deg,#4ade80,#22d3ee)",
              color: "#052e16",
              cursor: "pointer",
              fontSize: 14,
              boxShadow: "0 12px 30px rgba(34,211,238,0.18)",
            }}
          >
            Voltar para o início
          </button>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <img
            src={svg404}
            alt="Página não encontrada"
            style={{
              width: "100%",
              maxWidth: 620,
              height: "auto",
              display: "block",
            }}
          />
        </div>
      </div>
    </div>
  );
}