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
      const response = await apiService.post("/auth/login", { email, senha });
      console.log("Resposta do login:", response.data);
      const token = response.data.token;
      const tipoUsuario = response.data.tipoUsuario;

      localStorage.setItem("token", token);
      localStorage.setItem("tipoUsuario", tipoUsuario);

      // Redireciona conforme o tipo
      if (tipoUsuario === "ROLE_ONG") {
        navigate("/cadastros/RegistroAnimal");
      } else if (tipoUsuario === "ROLE_ADOTANTE") {
        navigate("/");
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

      <div style={styles.container}>
        <div style={styles.inner}>
          {/* Logo */}
          <div style={{ textAlign: "center", marginBottom: 8 }}>
            <a href="/">
              <img
                src="/imagens/DetalhesAnimal/logoMelhor.png"
                alt="Logo"
                style={styles.logo}
              />
            </a>
          </div>

          {/* Card */}
          <div style={styles.card}>
            <h1 style={styles.titulo}>Faça seu Login</h1>
            {/* Formulário */}
            <form onSubmit={handleLogin} style={{ textAlign: "center" }}>
              <input
                style={styles.input}
                type="email"
                placeholder="Digite seu e-mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onFocus={(e) => (e.currentTarget.style.borderColor = "#36c3ff")}
                onBlur={(e) => (e.currentTarget.style.borderColor = "transparent")}
                required
                autoComplete="off"
              />
              <input
                style={styles.input}
                type="password"
                placeholder="Senha"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                onFocus={(e) => (e.currentTarget.style.borderColor = "#36c3ff")}
                onBlur={(e) => (e.currentTarget.style.borderColor = "transparent")}
                required
                autoComplete="off"
              />

              {erro && <p style={styles.erro}>{erro}</p>}

              <button
                type="submit"
                style={styles.botao}
                disabled={carregando}
                onMouseEnter={(e) => {
                  if (!carregando) {
                    e.currentTarget.style.backgroundColor = "rgb(26, 176, 240)";
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "#36c3ff";
                }}
              >
                {carregando ? "Entrando..." : "Log in"}
              </button>
            </form>

            <Link
              to="/cadastros/CadastroUsuario"
              style={styles.linkCadastro}
              onMouseEnter={(e) => (e.currentTarget.style.textDecoration = "underline")}
              onMouseLeave={(e) => (e.currentTarget.style.textDecoration = "none")}
            >
              Cadastrar-se
            </Link>
            <Link
              to="/login/EsqueceuSenha"
              style={styles.linkEsqueceu}
              onMouseEnter={(e) => (e.currentTarget.style.textDecoration = "underline")}
              onMouseLeave={(e) => (e.currentTarget.style.textDecoration = "none")}
            >
              Esqueceu a senha?
            </Link>
          </div>
        </div>

        <img
          src="/imagens/cachorro.png"
          alt="cachorro"
          style={styles.imagemCachorro}
        />
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    fontFamily: '"Inter", sans-serif',
    margin: 0,
  },
  header: {
    width: "100%",
    padding: "38px 0 17px 0",
  },
  nav: {
    height: 18,
    textAlign: "end",
  },
  navLink: {
    fontFamily: '"Courier Prime", monospace',
    fontSize: 16,
    textDecoration: "none",
    color: "#AAAAAA",
    margin: "0 33px",
  },
  container: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
  },
  inner: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width: "100%",
  },
  logo: {
    width: 104,
    height: 90,
  },
  card: {
    backgroundColor: "white",
    boxShadow: "0px 0px 24px rgba(0,0,0,0.25)",
    width: 450,
    height: 500,
    margin: "30px auto",
    padding:"40px 36px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    borderRadius: 20,
    justifyContent: "flex-start",
    boxSizing: "border-box",
  },
  titulo: {
    fontSize: 32,
    fontWeight: 700,
    fontFamily: '"Inter", sans-serif',
    margin: 0,
    marginBottom: 32,
    alignSelf: "flex-start",
  },
  toggle: {
    position: "relative",
    width: 150,
    height: 37,
    margin: "59px 0 43px 0",
    background: "#fff",
    borderRadius: 20,
    boxShadow: "inset 0 0 8px rgba(0,0,0,0.25)",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0 8px",
    cursor: "pointer",
  },
  slider: {
    position: "absolute",
    top: 0,
    height: 37,
    backgroundColor: "#27BEFF",
    borderRadius: 37,
    transition: "left 0.3s, width 0.3s",
    zIndex: 1,
  },
  option: {
    flex: 1,
    textAlign: "center",
    fontSize: 14,
    zIndex: 2,
    userSelect: "none",
    lineHeight: "37px",
    transition: "color 0.3s",
  },
  input: {
    backgroundColor: "rgba(0, 0, 0, 0.08)",
    borderRadius: 25,
    border: "3px solid transparent",
    transition: "border-color 0.25s ease",
    padding: "10px 12px",
    fontSize: 16,
    height: 45,
    width: "87%",
    maxWidth: 300,
    fontFamily: '"Inter", sans-serif',
    marginBottom: 20,
    textAlign: "center",
    display: "block",
    marginLeft: "auto",
    marginRight: "auto",
    outline: "none",
    boxSizing: "border-box",
  } as React.CSSProperties & {"&:focus": React.CSSProperties},
  erro: {
    color: "red",
    fontSize: 13,
    marginBottom: 8,
    marginTop: -24,
  },
  botao: {
    fontFamily: '"Inter", sans-serif',
    backgroundColor: "#36c3ff",
    border: "none",
    color: "white",
    borderRadius: 20,
    fontWeight: 300,
    width: 100,
    height: 35,
    cursor: "pointer",
    marginBottom: 41,
    fontSize: 14,
    transition: "background-color 0.2s ease",
  },
  linkCadastro: {
    textDecoration: "none",
    fontSize: 16,
    color: "black",
    fontWeight: "bold",
    marginBottom: 22,
  },
  linkEsqueceu: {
    textDecoration: "none",
    color: "rgba(0,0,0,0.5)",
  },
  imagemCachorro: {
    width: 629,
    height: 929,
    marginLeft: 506,
    marginBottom: 2,
  },
};
