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
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@600;700;800&family=DM+Sans:wght@400;500;700&display=swap');

        @keyframes float404 {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }

        @keyframes fadeUp404 {
          from {
            opacity: 0;
            transform: translateY(16px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .nf-wrap {
          width: 100%;
          max-width: 1280px;
          display: grid;
          grid-template-columns: minmax(380px, 520px) minmax(420px, 640px);
          align-items: center;
          justify-content: center;
          gap: 4.5rem;
          animation: fadeUp404 0.45s ease;
        }

        .nf-copy {
          max-width: 500px;
        }

        .nf-code {
          font-size: 78px;
          font-weight: 800;
          color: #4ade80;
          font-family: 'Sora', sans-serif;
          line-height: 1;
          margin-bottom: 14px;
          letter-spacing: -2px;
        }

        .nf-title {
          font-size: 48px;
          color: #f8fafc;
          margin: 0 0 14px;
          font-weight: 800;
          line-height: 1.08;
          font-family: 'Sora', sans-serif;
          letter-spacing: -1.4px;
        }

        .nf-text {
          color: #94a3b8;
          font-size: 16px;
          line-height: 1.75;
          margin-bottom: 30px;
          max-width: 460px;
        }

        .nf-btn {
          padding: 0.98rem 1.7rem;
          border-radius: 14px;
          border: none;
          font-weight: 700;
          background: linear-gradient(135deg, #4ade80, #22d3ee);
          color: #052e16;
          cursor: pointer;
          font-size: 14px;
          font-family: 'Sora', sans-serif;
          box-shadow: 0 14px 34px rgba(34, 211, 238, 0.18);
          transition: transform 0.2s ease, box-shadow 0.2s ease, opacity 0.2s ease;
        }

        .nf-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 18px 40px rgba(34, 211, 238, 0.24);
          opacity: 0.96;
        }

        .nf-btn:active {
          transform: translateY(0);
        }

        .nf-art {
          display: flex;
          align-items: center;
          justify-content: center;
          animation: float404 4.8s ease-in-out infinite;
        }

        .nf-art img {
          width: 100%;
          max-width: 640px;
          height: auto;
          display: block;
          filter: drop-shadow(0 24px 48px rgba(0, 0, 0, 0.28));
        }

        @media (max-width: 980px) {
          .nf-wrap {
            grid-template-columns: 1fr;
            gap: 2.5rem;
            text-align: center;
          }

          .nf-copy {
            max-width: 680px;
            margin: 0 auto;
            order: 2;
          }

          .nf-text {
            max-width: 100%;
            margin-left: auto;
            margin-right: auto;
          }

          .nf-art {
            order: 1;
          }

          .nf-art img {
            max-width: 500px;
          }
        }

        @media (max-width: 640px) {
          .nf-code {
            font-size: 60px;
          }

          .nf-title {
            font-size: 36px;
            letter-spacing: -1px;
          }

          .nf-text {
            font-size: 15px;
            line-height: 1.7;
          }

          .nf-btn {
            width: 100%;
            max-width: 280px;
          }

          .nf-art img {
            max-width: 360px;
          }
        }
      `}</style>

      <div className="nf-wrap">
        <div className="nf-copy">
          <div className="nf-code">404</div>

          <h1 className="nf-title">Página não encontrada</h1>

          <p className="nf-text">
            A página que você tentou acessar não existe, foi movida ou saiu do
            radar. Vamos te colocar de volta no caminho certo.
          </p>

          <button
            className="nf-btn"
            onClick={() => (window.location.href = "/")}
          >
            Voltar para o início
          </button>
        </div>

        <div className="nf-art">
          <img src={svg404} alt="Página não encontrada" />
        </div>
      </div>
    </div>
  );
}