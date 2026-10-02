import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { apiService } from "../../services/ApiService";

export function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  const navigate = useNavigate();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();

    setErro("");
    setCarregando(true);

    try {
      const response = await apiService.post("/auth/login", {
        email,
        senha,
      });

      console.log("Resposta do login:", response.data);

      const token = response.data.token;
      const tipoUsuario = response.data.tipoUsuario;

      localStorage.setItem("token", token);
      localStorage.setItem("tipoUsuario", tipoUsuario);

      if (tipoUsuario === "ROLE_ONG") {
        navigate("/cadastros/RegistroAnimal");
      } else if (tipoUsuario === "ROLE_ADOTANTE") {
        window.location.href = "/";
      }
    } catch {
      setErro("E-mail ou senha inválidos.");
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div style={styles.page}>
      {/* Header */}
      <header className="login-header">
        <nav className="login-nav">
          <a href="/">Home</a>
          <a href="/">Sobre</a>
          <a href="/#faq">F.A.Q</a>
        </nav>
      </header>

      <main className="login-container">
        <div className="login-gato-container">
          <img src="/imagens/gato.jpg" alt="Gato" className="login-gato" />
        </div>

        <div className="login-content">
          {/* Logo */}
          <div className="login-logo-container">
            <a href="/">
              <img
                src="/imagens/logoEscrita01.png"
                alt="Logo"
                className="login-logo"
              />
            </a>
          </div>

          {/* Card */}
          <div className="login-card">
            <h1 className="login-titulo">Faça seu Login</h1>

            <form onSubmit={handleLogin} className="login-form">
              <input
                className="login-input"
                type="email"
                placeholder="Digite seu e-mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="off"
              />

              <input
                className="login-input"
                type="password"
                placeholder="Senha"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                required
                autoComplete="off"
                style={{ marginBottom: 30 }}
              />

              {erro && <p style={styles.erro}>{erro}</p>}

              <button
                type="submit"
                className="login-botao"
                disabled={carregando}
              >
                {carregando ? "Entrando..." : "Log in"}
              </button>
            </form>

            <Link to="/cadastros/CadastroUsuario" className="login-cadastro">
              Cadastrar-se
            </Link>

            <Link to="/login/EsqueceuSenha" className="login-esqueceu">
              Esqueceu a senha?
            </Link>
          </div>
        </div>

        {/* Cachorro */}
        <div className="login-cachorro-container">
          <img
            src="/imagens/cachorro.png"
            alt="Cachorro"
            className="login-cachorro"
          />
        </div>
      </main>

      <style>
        {`
          .login-header {
            width: 100%;
            padding: 38px 0 17px 0;
            box-sizing: border-box;
          }

          .login-nav {
            display: flex;
            justify-content: flex-end;
            align-items: center;
            gap: 66px;
            padding: 0 72px;
            box-sizing: border-box;
          }

          .login-nav a {
            font-family: "Courier New", Courier, monospace;
            font-size: 16px;
            text-decoration: none;
            color: #aaaaaa;
            transition: color 0.2s ease;
          }

          .login-nav a:hover {
            text-decoration: underline;
          }

          .login-container {
            width: 100%;
            min-height: calc(100vh - 90px);

            display: flex;
            align-items: center;
            justify-content: center;

            position: relative;
            overflow: hidden;

            background-color: white;

            padding: 20px 40px 40px;
            box-sizing: border-box;
          }

          .login-content {
            width: 100%;
            max-width: 450px;

            display: flex;
            flex-direction: column;
            align-items: center;

            position: relative;
            z-index: 2;
          }

          .login-gato-container {
            position: absolute;

            left: 8%;
            bottom: 0;

            height: 85%;
            max-height: 720px;

            display: flex;
            align-items: flex-end;

            pointer-events: none;

            z-index: 1;
          }

          .login-gato {
            height: 100%;
            width: auto;
            object-fit: contain;
          }

          .login-logo-container {
            text-align: center;
            margin-bottom: 8px;
          }

          .login-logo {
            width: 104px;
            height: 90px;
            object-fit: contain;
          }

          .login-card {
            background-color: white;
            width: 100%;
            min-height: 500px;

            margin: 30px auto;
            padding: 40px 36px;

            display: flex;
            flex-direction: column;
            align-items: center;

            box-shadow: 0px 0px 24px rgba(0, 0, 0, 0.25);
            border-radius: 20px;
            box-sizing: border-box;
          }

          .login-titulo {
            width: 100%;

            font-size: 32px;
            font-weight: 700;
            font-family: "Inter", sans-serif;

            margin: 0 0 42px;

            text-align: left;
          }

          .login-form {
            width: 100%;
            text-align: center;
            margin-bottom: 42px;
          }

          .login-input {
            width: 87%;
            max-width: 300px;
            height: 45px;

            display: block;
            padding: 10px 12px;
            margin: 0 auto 20px;

            background-color: rgba(0, 0, 0, 0.08);
            border-radius: 25px;
            border: 3px solid transparent;

            outline: none;
            box-sizing: border-box;

            font-family: "Inter", sans-serif;
            font-size: 16px;
            text-align: center;

            transition:
              border-color 0.25s ease,
              background-color 0.25s ease;
          }

          .login-input:focus {
            border-color: #36c3ff;
          }

          .login-botao {
            font-family: "Inter", sans-serif;

            background-color: #36c3ff;

            border: none;
            color: white;

            border-radius: 20px;

            font-weight: 300;

            width: 100px;
            height: 35px;

            cursor: pointer;

            margin-bottom: 0px;

            font-size: 14px;

            transition: background-color 0.2s ease;
          }

          .login-botao:hover:not(:disabled) {
            background-color: rgb(26, 176, 240);
          }

          .login-botao:disabled {
            cursor: not-allowed;
            opacity: 0.7;
          }

          .login-cadastro {
            text-decoration: none;
            font-size: 16px;
            color: black;
            font-weight: bold;
            margin-bottom: 8px;
          }

          .login-cadastro:hover {
            text-decoration: underline;
          }

          .login-esqueceu {
            text-decoration: none;
            color: rgba(0, 0, 0, 0.5);
          }

          .login-esqueceu:hover {
            text-decoration: underline;
          }

          .login-cachorro-container {
            position: absolute;

            right: 8%;
            bottom: 0;

            height: 85%;
            max-height: 800px;

            display: flex;
            align-items: flex-end;

            pointer-events: none;

            z-index: 1;
          }

          .login-cachorro {
            height: 100%;
            width: auto;

            object-fit: contain;
          }


          /* Notebook / telas médias */
          @media (max-width: 1200px) {
            .login-gato-container,
            .login-cachorro-container {
              display: none;
            }

            .login-container {
              justify-content: center;
              padding: 20px 24px 40px;
            }

            .login-content {
              width: 100%;
              max-width: 450px;
              margin: 0 auto;
            }
          }


          /* Tablet */
          @media (max-width: 900px) {
            .login-header {
              padding: 25px 0 10px;
            }

            .login-nav {
              justify-content: center;

              gap: 40px;

              padding: 0 20px;
            }

            .login-container {
              min-height: auto;

              justify-content: center;

              padding: 25px 25px 50px;
            }

            .login-content {
              max-width: 450px;
            }

            .login-cachorro-container {
              display: none;
            }

            .login-card {
              min-height: auto;
            }
          }


          /* Celular */
          @media (max-width: 600px) {
            .login-header {
              padding: 22px 0 8px;
            }

            .login-nav {
              gap: 24px;

              padding: 0 12px;
            }

            .login-nav a {
              font-size: 14px;
            }

            .login-container {
              padding: 15px 16px 40px;
            }

            .login-content {
              max-width: 100%;
            }

            .login-logo {
              width: 85px;
              height: 75px;
            }

            .login-card {
              width: 100%;

              margin: 18px 0 0;

              padding: 32px 22px;

              border-radius: 18px;

              box-shadow: 0px 0px 16px rgba(0, 0, 0, 0.18);
            }

            .login-titulo {
              font-size: 26px;

              margin-bottom: 28px;

              text-align: center;
            }

            .login-input {
              width: 100%;
              max-width: 100%;

              height: 46px;
            }

            .login-botao {
              width: 110px;

              margin-top: 4px;
              margin-bottom: 32px;
            }

            .login-cadastro {
              font-size: 15px;
            }

            .login-esqueceu {
              font-size: 14px;
            }
          }


          /* Celulares pequenos */
          @media (max-width: 380px) {
            .login-nav {
              gap: 15px;
            }

            .login-nav a {
              font-size: 13px;
            }

            .login-container {
              padding-left: 12px;
              padding-right: 12px;
            }

            .login-card {
              padding: 28px 18px;
            }

            .login-titulo {
              font-size: 23px;
            }
          }


          /* Notebook com pouca altura */
          @media (max-height: 800px) and (min-width: 901px) {
            .login-header {
              padding-top: 20px;
              padding-bottom: 8px;
            }

            .login-container {
              min-height: calc(100vh - 55px);
            }

            .login-logo {
              width: 80px;
              height: 68px;
            }

            .login-card {
              min-height: 430px;

              margin-top: 12px;

              padding-top: 30px;
              padding-bottom: 30px;
            }

            .login-titulo {
              font-size: 28px;
              margin-bottom: 25px;
            }

            .login-cachorro-container {
              height: 88%;
            }
          }
        `}
      </style>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    fontFamily: '"Inter", sans-serif',
    margin: 0,
    width: "100%",
    minHeight: "100vh",
    overflowX: "hidden",
    backgroundColor: "white",
  },

  erro: {
    color: "red",
    fontSize: 13,
    marginBottom: 8,
    marginTop: -8,
  },
};
