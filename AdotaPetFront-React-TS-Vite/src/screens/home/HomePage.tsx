import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Header } from "@/components/Header";
import "./HomePage.css";

const token = localStorage.getItem("token");
const estaLogado = !!token;

const tipoUsuario = localStorage.getItem("tipoUsuario");

const ehAdotante = tipoUsuario === "ROLE_ADOTANTE";
const ehOng = tipoUsuario === "ROLE_ONG";

const comoFuncionaItems = [
  {
    bg: "url('/imagens/ongimg.png')",
    titulo: "Ongs/Protetores",
    desc: "Se cadastram e adicionam os pets resgatados.",
  },
  {
    bg: "url('/imagens/abracoDog.png')",
    titulo: "Adotantes",
    desc: "Buscam por animais, entram em contato e agendam visitas.",
  },
  {
    bg: "url('/imagens/pessoas.png')",
    titulo: "Juntos, fazemos a adoção acontecer",
    desc: "Com segurança e responsabilidade.",
  },
];

const faqEsquerdo = [
  {
    pergunta:
      "Como o site garante que as ONGs e animais cadastrados são confiáveis?",
    resposta:
      "O AdotaPet conecta pessoas interessadas em adotar com ONGs e protetores responsáveis pelos animais. As informações e fotos dos pets são fornecidas pelas próprias organizações. Recomendamos que o adotante converse com a ONG, tire suas dúvidas e conheça o animal antes de concluir a adoção.",
  },
  {
    pergunta: "Como faço para adotar um pet pelo site?",
    resposta:
      "Primeiro, crie uma conta como adotante. Depois, acesse a página de animais disponíveis, escolha o pet que deseja conhecer e preencha o formulário de adoção. A ONG responsável analisará sua candidatura e poderá entrar em contato para conversar e combinar os próximos passos.",
  },
  {
    pergunta: "Posso adotar um pet de outra cidade/estado?",
    resposta:
      "Sim! Você pode demonstrar interesse por animais de outras cidades ou estados. Porém, é importante conversar com a ONG responsável para verificar a possibilidade de visita, transporte e entrega do animal. Essas condições dependem da organização.",
  },
];

const faqDireito = [
  {
    pergunta:
      "Quais informações são obrigatórias para cadastrar um animal para adoção?",
    resposta:
      "É importante informar o nome do animal, espécie, idade aproximada, sexo, porte, localização e características de comportamento. Também recomendamos adicionar fotos e informações sobre vacinação, castração, saúde e histórico do pet, para ajudar os interessados a conhecê-lo melhor.",
  },
  {
    pergunta: "Como minha ONG pode se cadastrar no site?",
    resposta:
      "Acesse a opção de cadastro e escolha o perfil de ONG. Preencha as informações solicitadas e conclua seu cadastro. Depois, faça login para acessar as funcionalidades destinadas às organizações e cadastrar os animais disponíveis para adoção.",
  },
  {
    pergunta: "Existe algum custo para usar a plataforma?",
    resposta:
      "Não! O AdotaPet é uma plataforma gratuita, desenvolvida para aproximar ONGs, protetores e pessoas interessadas em adotar. O objetivo é facilitar o processo de adoção responsável e ajudar mais animais a encontrarem um lar.",
  },
];

export default function HomePage() {
  const [faqAberto, setFaqAberto] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setFaqAberto((prev) => (prev === index ? null : index));
  };

  return (
    <div style={styles.body}>
      {estaLogado ? (
        <Header
          corFundo="rgb(54, 195, 255)"
          logoSrc="/imagens/logoEscrita01.png"
          homeComoAdotar={true}
          mostrarRegistrarAnimal={ehOng}
        />
      ) : (
        <header style={styles.header}>
          <nav style={styles.nav}>
            <Link
              to="/login"
              className="nav-link"
              style={styles.navLink}
              onMouseEnter={(e) =>
                (e.currentTarget.style.textDecoration = "underline")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.textDecoration = "none")
              }
            >
              Entrar
            </Link>
            <Link
              to="/listaadotar"
              className="nav-link"
              style={styles.navLink}
              onMouseEnter={(e) =>
                (e.currentTarget.style.textDecoration = "underline")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.textDecoration = "none")
              }
            >
              Adotar
            </Link>
            <Link to="/">
              <img
                src="/imagens/logoEscrita.png"
                alt="Logo Escrita"
                style={styles.logoNav}
                onMouseEnter={(e) => {
                  e.currentTarget.style.opacity = "0.7";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.opacity = "1";
                }}
              />
            </Link>
            <a
              href="#sobre"
              className="nav-link"
              style={styles.navLink}
              onMouseEnter={(e) =>
                (e.currentTarget.style.textDecoration = "underline")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.textDecoration = "none")
              }
            >
              Sobre
            </a>
            <a
              href="#faq"
              className="nav-link"
              style={styles.navLink}
              onMouseEnter={(e) =>
                (e.currentTarget.style.textDecoration = "underline")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.textDecoration = "none")
              }
            >
              F.A.Q
            </a>
          </nav>
        </header>
      )}

      <div style={styles.divInicial}>
        <div style={{ position: "relative", width: "100%", height: "100%" }}>
          <p style={styles.heroTextoAdote}>ADOTE</p>
          <img
            src="/imagens/dogTransparente.png"
            alt="Gato e Cachorro"
            style={styles.heroImagem}
          />
          <p style={styles.heroSubtitulo} className="home-hero-subtitle">
            Adicione <span style={{ color: "#FFEA00" }}>cor</span> à <br />
            vida deles
          </p>
        </div>
      </div>

      {/* Logo + Sobre */}

      <h1 style={styles.titPreto}>Sobre</h1>
      <p style={styles.pInfo}>
        Bem-vindo ao Adota Pet, a plataforma que conecta ONGs de proteção <br />
        animal a pessoas dispostas a dar um lar cheio de amor a gatos e
        cachorros <br />
        resgatados! <br />
        Adote! Não compre! Salve vidas!
      </p>

      {/* O que fazemos */}
      <div style={styles.divImagem}>
        <div style={{ width: "50%" }} />
        <div style={styles.container}>
          <h1 style={styles.titBranco}>O que fazemos?</h1>
          <p style={styles.pDestaque}>Nosso site é uma ponte digital entre:</p>
          <div style={styles.cardContainer}>
            <div style={{ ...styles.card, marginRight: 27 }}>
              <h3 style={styles.cardTitulo}>ONGs e Protetores</h3>
              <p style={styles.cardDesc}>
                Que podem cadastrar animais resgatados para adoção, com fotos,
                histórias e informações.
              </p>
            </div>
            <div style={{ ...styles.card, marginLeft: 27 }}>
              <h3 style={styles.cardTitulo}>Pessoas que querem adotar</h3>
              <p style={styles.cardDesc}>
                Que encontram perfis de pets disponíveis e podem entrar em
                contato diretamente com a ONG responsável.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Como funciona */}
      <h1 style={{ ...styles.titPreto, marginBottom: 64 }}>Como funciona?</h1>
      <div style={styles.containerGrid}>
        {comoFuncionaItems.map((item, i) => (
          <div key={i} style={styles.gridItem}>
            <div style={{ ...styles.cardGridImg, backgroundImage: item.bg }} />
            <div>
              <h3 style={styles.cardGridTitulo}>{item.titulo}</h3>
              <p style={styles.cardGridDesc}>{item.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* CTA */}
      {!estaLogado && (
        <>
          <h1 style={{ ...styles.titPreto, marginBottom: 44 }}>
            Quer fazer parte disso?
          </h1>
          <Link to="/cadastros/CadastroUsuario" style={styles.botaoRegistre}>
            Registre-se agora
          </Link>
        </>
      )}

      {/* FAQ */}
      <div id="faq" style={styles.faqSection}>
        <h1 style={styles.faqTitulo}>Perguntas frequentes</h1>

        <div style={styles.faqGrid}>
          {/* Coluna esquerda */}
          <div style={styles.faqColuna}>
            {faqEsquerdo.map((item, i) => (
              <div key={i} style={styles.faqItem}>
                <button
                  type="button"
                  style={{
                    ...styles.botaoFaq,
                    backgroundColor:
                      faqAberto === i ? "rgba(0,0,0,0.6)" : "rgba(0,0,0,0.4)",
                  }}
                  onClick={() => toggleFaq(i)}
                  aria-expanded={faqAberto === i}
                >
                  {item.pergunta}
                  <span>{faqAberto === i ? "−" : "+"}</span>
                </button>

                {faqAberto === i && (
                  <div style={styles.faqResposta}>{item.resposta}</div>
                )}
              </div>
            ))}
          </div>

          {/* Coluna direita */}
          <div style={styles.faqColuna}>
            {faqDireito.map((item, i) => (
              <div key={i + 10} style={styles.faqItem}>
                <button
                  type="button"
                  style={{
                    ...styles.botaoFaq,
                    backgroundColor:
                      faqAberto === i + 10
                        ? "rgba(0,0,0,0.6)"
                        : "rgba(0,0,0,0.4)",
                  }}
                  onClick={() => toggleFaq(i + 10)}
                  aria-expanded={faqAberto === i + 10}
                >
                  {item.pergunta}
                  <span>{faqAberto === i + 10 ? "−" : "+"}</span>
                </button>

                {faqAberto === i + 10 && (
                  <div style={styles.faqResposta}>{item.resposta}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Estilos ─────────
const styles: Record<string, React.CSSProperties> = {
  body: {
    margin: 0,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    fontFamily: "'Montserrat', sans-serif",
  },
  header: {
    backgroundColor: "#36C3FF",
    width: "100%",
  },
  nav: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 80,
    padding: "20px 0px 20px 0px",
  },
  navLink: {
    textDecoration: "none",
    color: "black",
    fontFamily: "'Courier New', Courier, monospace",
  },
  logoNav: {
    height: 120,
    width: 120,
    opacity: 1,
  },
  logoNavHover: {
    opacity: 0.7,
  },
  divInicial: {
    backgroundColor: "#36C3FF",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    width: "100%",
    height: 435,
  },
  heroTextoAdote: {
    fontFamily: "'Italiana', sans-serif",
    fontSize: 350,
    letterSpacing: 38.5,
    textAlign: "center",
    margin: 0,
    lineHeight: 1,
    userSelect: "none" as any,
  },
  heroImagem: {
    position: "absolute",
    left: "50%",
    top: "50%",
    transform: "translate(-50%, -50%)",
    width: 353,
    height: 436,
  },
  heroSubtitulo: {
    fontFamily: "'Italianno', cursive",
    fontSize: 96,
    position: "absolute",
    left: 0,
    bottom: 0,
    margin: "0 32px 0 350px",
    color: "black",
    lineHeight: "68%",
  },
  titPreto: {
    fontFamily: "'Montserrat', sans-serif",
    fontWeight: 800,
    fontSize: 32,
    color: "black",
    textDecoration: "underline",
    textAlign: "center",
    marginTop: 38,
    marginBottom: 38,
  },
  pInfo: {
    fontFamily: "'Montserrat', sans-serif",
    fontWeight: "normal",
    fontSize: 20,
    color: "black",
    textAlign: "center",
    marginBottom: 133,
    marginTop: 0,
  },
  divImagem: {
    backgroundImage: "url('/imagens/pessoaEcachorro.png')",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center 80%",
    backgroundSize: "cover",
    margin: "0 auto 84px auto",
    display: "flex",
    justifyContent: "center",
    borderRadius: 100,
    boxShadow: "0px 4px 12px rgba(0,0,0,0.3)",
    width: 1244,
    height: 512,
  },
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    width: "50%",
    color: "white",
  },
  titBranco: {
    fontFamily: "'Montserrat', sans-serif",
    fontWeight: 800,
    fontSize: 32,
    color: "rgba(255,255,255,0.8)",
    textDecoration: "underline",
    marginTop: 55,
    marginBottom: 43,
  },
  pDestaque: {
    fontFamily: "'Montserrat', sans-serif",
    fontWeight: "bold",
    fontSize: 20,
    color: "rgba(255,255,255,0.8)",
    margin: 0,
  },
  cardContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    color: "black",
  },
  card: {
    backgroundColor: "rgba(255,255,255,0.6)",
    display: "flex",
    textAlign: "center",
    flexDirection: "column",
    marginBottom: 102,
    marginTop: 38,
    borderRadius: 20,
    width: 238,
    height: 228,
  },
  cardTitulo: {
    fontFamily: "'Montserrat', sans-serif",
    fontSize: 18,
    fontWeight: "bold",
    margin: "35px 0 28px",
  },
  cardDesc: {
    fontFamily: "'Montserrat', sans-serif",
    fontSize: 14,
    margin: "0 auto",
  },
  containerGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    justifyContent: "center",
    width: 836,
    gap: 52,
    marginBottom: 104,
  },
  gridItem: {
    width: "100%",
    height: 391,
    boxShadow: "0px 4px 12px rgba(0,0,0,0.3)",
    borderRadius: 20,
    display: "flex",
    flexDirection: "column",
  },
  cardGridImg: {
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
    backgroundPosition: "center",
    height: 226,
    margin: 9,
    borderRadius: 10,
  },
  cardGridTitulo: {
    fontFamily: "'Montserrat', sans-serif",
    fontSize: 18,
    fontWeight: "bold",
    margin: "5px 0 0 9px",
  },
  cardGridDesc: {
    fontFamily: "'Montserrat', sans-serif",
    fontSize: 14,
    fontWeight: "normal",
    margin: "14px 0 0 9px",
  },
  botaoRegistre: {
    fontFamily: "'Montserrat', sans-serif",
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
    backgroundColor: "#36C3FF",
    borderRadius: 40,
    width: 300,
    height: 59,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 90,
    textDecoration: "none",
  },
  faqSection: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundImage: "linear-gradient(135deg, #4BDEFF 25%, #46A2DA 100%)",
    width: "100%",
    minHeight: 656,
    borderRadius: "100px 100px 0 0",
    boxShadow: "0px 4px 12px rgba(0,0,0,0.3)",
  },
  faqTitulo: {
    fontFamily: "'Montserrat', sans-serif",
    fontWeight: 800,
    fontSize: 32,
    color: "rgba(0,0,0,0.8)",
    textDecoration: "underline",
    textAlign: "center",
    margin: "59px auto",
  },
  faqGrid: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "flex-start",
    gap: 92,
    paddingBottom: 60,
  },
  faqColuna: {
    display: "flex",
    flexDirection: "column",
    gap: 53,
    width: "40%",
  },

  faqItem: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    gap: 12,
  },

  faqResposta: {
    backgroundColor: "rgba(255,255,255,0.9)",
    color: "#222",
    borderRadius: 20,
    padding: "20px 24px",
    fontFamily: "'Montserrat', sans-serif",
    fontSize: 15,
    lineHeight: 1.7,
    boxShadow: "0px 4px 10px rgba(0,0,0,0.12)",
    animation: "faqDescer 0.25s ease",
  },

  botaoFaq: {
    backgroundColor: "rgba(0,0,0,0.4)",
    border: "none",
    borderRadius: 40,
    width: "100%",
    fontFamily: "'Montserrat', sans-serif",
    fontWeight: "bold",
    fontSize: 18,
    color: "white",
    padding: 20,
    cursor: "pointer",
    transition: "background-color 0.2s",
    textAlign: "center",

    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
};
