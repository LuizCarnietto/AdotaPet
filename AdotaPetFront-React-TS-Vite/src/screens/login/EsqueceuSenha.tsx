import { useState, ChangeEvent, FormEvent } from "react";

type Etapa = "email" | "codigo" | "novaSenha" | "sucesso";

interface FormState {
  email:          string;
  codigo:         string;
  novaSenha:      string;
  confirmarSenha: string;
}

export default function EsqueceuSenha() {
  const [etapa, setEtapa]   = useState<Etapa>("email");
  const [form, setForm]     = useState<FormState>({ email: "", codigo: "", novaSenha: "", confirmarSenha: "" });
  const [erro, setErro]     = useState<string | null>(null);

  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleEmail = (e: FormEvent): void => {
    e.preventDefault();
    setErro(null);
    if (!form.email.trim()) return setErro("Informe o seu e-mail.");
    // TODO: chamar API para enviar código
    setEtapa("codigo");
  };

  const handleCodigo = (e: FormEvent): void => {
    e.preventDefault();
    setErro(null);
    if (!form.codigo.trim()) return setErro("Informe o código recebido.");
    // TODO: chamar API para validar código
    setEtapa("novaSenha");
  };

  const handleNovaSenha = (e: FormEvent): void => {
    e.preventDefault();
    setErro(null);
    if (!form.novaSenha)                          return setErro("Informe a nova senha.");
    if (form.novaSenha !== form.confirmarSenha)   return setErro("As senhas não coincidem.");
    // TODO: chamar API para redefinir senha
    setEtapa("sucesso");
  };

  return (
    <>
      <style>{`
        @import url("https://fonts.googleapis.com/css2?family=Courier+Prime:ital,wght@0,400;0,700;1,400;1,700&display=swap");
        @import url("https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap");

        body {
          font-family: "Inter", "Courier Prime", sans-serif;
          margin: 0px;
          background-color: white;
        }

        .es-header {
          width: 100%;
          padding: 38px 0px 17px 0px;
        }

        .es-nav {
          height: 18px;
          text-align: end;
        }

        .es-nav > a {
          font-family: "Courier Prime", monospace;
          font-size: 16px;
          text-decoration: none;
          color: #aaaaaa;
          margin: 0px 33px 0px 33px;
        }

        .es-nav > a:hover {
          text-decoration: underline;
        }

        .es-container {
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background-color: white;
        }

        .es-card {
          font-family: "Inter", sans-serif;
          background-color: white;
          box-shadow: 0px 0px 24px rgba(0, 0, 0, 0.25);
          width: 420px;
          margin: 30px auto;
          padding: 40px 36px;
          display: flex;
          flex-direction: column;
          align-items: center;
          border-radius: 20px;
        }

        .es-card h1 {
          font-size: 32px;
          font-weight: 700;
          margin: 0px 0px 8px 0px;
          align-self: flex-start;
        }

        .es-card p.es-subtitulo {
          font-size: 14px;
          color: #888;
          align-self: flex-start;
          margin: 0px 0px 28px 0px;
          line-height: 1.5;
        }

        /* Indicador de etapas */
        .es-steps {
          display: flex;
          align-items: center;
          gap: 0px;
          margin-bottom: 32px;
          width: 100%;
          justify-content: center;
        }

        .es-step-circle {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 13px;
          font-weight: 700;
          border: 2px solid #ddd;
          color: #bbb;
          background: white;
          transition: all 0.3s;
          flex-shrink: 0;
        }

        .es-step-circle.ativa {
          background-color: #36c3ff;
          border-color: #36c3ff;
          color: white;
        }

        .es-step-circle.concluida {
          background-color: #36c3ff;
          border-color: #36c3ff;
          color: white;
        }

        .es-step-line {
          flex: 1;
          height: 2px;
          background-color: #ddd;
          max-width: 60px;
          transition: background-color 0.3s;
        }

        .es-step-line.concluida {
          background-color: #36c3ff;
        }

        /* Labels e inputs */
        .es-form {
          width: 100%;
          display: flex;
          flex-direction: column;
        }

        .es-form label {
          display: block;
          text-align: left;
          margin: 0px 0 10px 0;
          font-size: 16px;
        }

        .es-form label + label {
          margin-top: 20px;
        }

        .es-form input {
          background-color: rgba(0, 0, 0, 0.08);
          border-radius: 25px;
          border: 3px solid transparent;
          transition: border-color 0.25s ease;
          padding: 10px 12px;
          font-size: 16px;
          height: 45px;
          width: 100%;
          box-sizing: border-box;
          outline: none;
          margin-bottom: 0px;
        }

        .es-form input:focus {
          border-color: #36c3ff;
          outline: none;
        }

        .es-form input::placeholder {
          color: rgba(0, 0, 0, 0.5);
        }

        .es-label-gap {
          margin-top: 20px;
        }

        /* Botão principal */
        .es-btn {
          background-color: #36c3ff;
          color: white;
          border-radius: 20px;
          border: none;
          font-family: "Inter", sans-serif;
          font-weight: 300;
          font-size: 14px;
          text-align: center;
          margin: 32px auto 0;
          display: block;
          width: 30%;
          min-width: 120px;
          height: 35px;
          cursor: pointer;
          transition: background-color 0.2s;
        }

        .es-btn:hover {
          background-color: #1ab0f0;
        }

        /* Link de reenvio / voltar */
        .es-rodape {
          width: 100%;
          text-align: center;
          margin: 20px 0 0 0;
          font-size: 14px;
          color: #888;
        }

        .es-rodape a {
          color: black;
          font-weight: bold;
          text-decoration: none;
        }

        .es-rodape a:hover {
          text-decoration: underline;
        }

        /* Erro */
        .es-erro {
          width: 100%;
          margin-bottom: 16px;
          background: #fff5f5;
          border: 1px solid #fca5a5;
          color: #b91c1c;
          border-radius: 12px;
          padding: 8px 16px;
          font-size: 14px;
          box-sizing: border-box;
        }

        /* Sucesso */
        .es-sucesso-icone {
          width: 72px;
          height: 72px;
          border-radius: 50%;
          background-color: #36c3ff;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 24px;
        }

        .es-sucesso-icone span {
          font-size: 36px;
          color: white;
        }

        .es-card h2.es-sucesso-titulo {
          font-size: 24px;
          font-weight: 700;
          margin: 0 0 10px 0;
          text-align: center;
        }

        .es-card p.es-sucesso-texto {
          font-size: 14px;
          color: #888;
          text-align: center;
          margin: 0 0 32px 0;
          line-height: 1.5;
        }

        /* Input de código grande */
        .es-codigo-input {
          background-color: rgba(0, 0, 0, 0.08);
          border-radius: 25px;
          border: 3px solid transparent;
          transition: border-color 0.25s ease;
          padding: 10px 12px;
          font-size: 28px;
          font-weight: 700;
          letter-spacing: 12px;
          text-align: center;
          height: 50px;
          width: 100%;
          box-sizing: border-box;
          outline: none;
        }

        .es-codigo-input:focus {
          border-color: #36c3ff;
        }

        .es-codigo-input::placeholder {
          font-size: 16px;
          font-weight: 400;
          letter-spacing: 0px;
          color: rgba(0,0,0,0.4);
        }
      `}</style>

      {/* Header */}
      <header style={{ width: "100%", padding: "38px 0 17px 0" }}>
        <nav style={{ height: 18, textAlign: "right" }}>
          {(["Home", "Sobre", "F.A.Q"] as const).map((item, i) => (
            <a
              key={item}
              href={item === "F.A.Q" ? "/#faq" : "/"}
              style={{
                fontFamily: '"Courier Prime", monospace',
                fontSize: 16,
                textDecoration: "none",
                color: "#aaaaaa",
                margin: i === 2 ? "0 72px 0 33px" : "0 33px",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.textDecoration = "underline")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.textDecoration = "none")
              }
            >
              {item}
            </a>
          ))}
        </nav>
      </header>

      {/* Container */}
      <div className="es-container">

        {/* Logo */}
        <div style={{ margin: "0px auto" }}>
          <a href="/">
            <img
              src="/imagens/logoMelhor.png"
              alt="Logo"
              style={{ width: "104px", height: "90px", display: "block", margin: "0px auto" }}
            />
          </a>
        </div>

        {/* Card */}
        <div className="es-card">

          {/* ── Etapa 1: E-mail ── */}
          {etapa === "email" && (
            <>
              <h1>Esqueceu a senha?</h1>
              <p className="es-subtitulo">
                Informe o e-mail cadastrado e enviaremos um código de verificação.
              </p>

              {/* Indicador de etapas */}
              <div className="es-steps">
                <div className="es-step-circle ativa">1</div>
                <div className="es-step-line"></div>
                <div className="es-step-circle">2</div>
                <div className="es-step-line"></div>
                <div className="es-step-circle">3</div>
              </div>

              {erro && <div className="es-erro">⚠️ {erro}</div>}

              <form className="es-form" onSubmit={handleEmail}>
                <label htmlFor="email">E-mail</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="Digite seu e-mail"
                  autoComplete="off"
                />
                <button className="es-btn" type="submit">Enviar código</button>
              </form>

              <p className="es-rodape">
                Lembrou a senha? <a href="/login">Fazer login</a>
              </p>
            </>
          )}

          {/* ── Etapa 2: Código ── */}
          {etapa === "codigo" && (
            <>
              <h1>Código enviado</h1>
              <p className="es-subtitulo">
                Enviamos um código de 6 dígitos para <strong>{form.email}</strong>. Verifique sua caixa de entrada.
              </p>

              <div className="es-steps">
                <div className="es-step-circle concluida">✓</div>
                <div className="es-step-line concluida"></div>
                <div className="es-step-circle ativa">2</div>
                <div className="es-step-line"></div>
                <div className="es-step-circle">3</div>
              </div>

              {erro && <div className="es-erro">⚠️ {erro}</div>}

              <form className="es-form" onSubmit={handleCodigo}>
                <label htmlFor="codigo">Código de verificação</label>
                <input
                  id="codigo"
                  name="codigo"
                  type="text"
                  value={form.codigo}
                  onChange={handleChange}
                  placeholder="Digite o código"
                  autoComplete="off"
                  maxLength={6}
                  className="es-codigo-input"
                />
                <button className="es-btn" type="submit">Verificar código</button>
              </form>

              <p className="es-rodape">
                Não recebeu?{" "}
                <a href="#" onClick={(e) => { e.preventDefault(); setErro(null); }}>
                  Reenviar código
                </a>
              </p>
            </>
          )}

          {/* ── Etapa 3: Nova senha ── */}
          {etapa === "novaSenha" && (
            <>
              <h1>Nova senha</h1>
              <p className="es-subtitulo">
                Crie uma nova senha para a sua conta.
              </p>

              <div className="es-steps">
                <div className="es-step-circle concluida">✓</div>
                <div className="es-step-line concluida"></div>
                <div className="es-step-circle concluida">✓</div>
                <div className="es-step-line concluida"></div>
                <div className="es-step-circle ativa">3</div>
              </div>

              {erro && <div className="es-erro">⚠️ {erro}</div>}

              <form className="es-form" onSubmit={handleNovaSenha}>
                <label htmlFor="novaSenha">Nova senha</label>
                <input
                  id="novaSenha"
                  name="novaSenha"
                  type="password"
                  value={form.novaSenha}
                  onChange={handleChange}
                  placeholder="●●●●●●●"
                  autoComplete="off"
                />
                <label htmlFor="confirmarSenha" className="es-label-gap">Confirmar nova senha</label>
                <input
                  id="confirmarSenha"
                  name="confirmarSenha"
                  type="password"
                  value={form.confirmarSenha}
                  onChange={handleChange}
                  placeholder="●●●●●●●"
                  autoComplete="off"
                />
                <button className="es-btn" type="submit">Redefinir senha</button>
              </form>
            </>
          )}

          {/* ── Sucesso ── */}
          {etapa === "sucesso" && (
            <>
              <div className="es-sucesso-icone">
                <span>✓</span>
              </div>
              <h2 className="es-sucesso-titulo">Senha redefinida!</h2>
              <p className="es-sucesso-texto">
                Sua senha foi alterada com sucesso. Agora você já pode fazer login com a nova senha.
              </p>
              <a href="login.html" style={{ width: "100%" }}>
                <button className="es-btn" type="button" style={{ margin: 0 }}>
                  Ir para o login
                </button>
              </a>
            </>
          )}

        </div>
      </div>
    </>
  );
}