import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiService } from "@/services/ApiService";

type TipoConta = "usuario" | "ong";

export default function CadastroOng() {
  const [nome, setNome] = useState("");
  const [nomeOng, setNomeOng] = useState("");
  const [telefone, setTelefone] = useState("");
  const [senha, setSenha] = useState("");
  const [email, setEmail] = useState("");
  const [dataNascimento, setDataNascimento] = useState("");
  const [cnpj, setCnpj] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [tipoConta, setTipoConta] = useState<TipoConta>("ong");

  const navigate = useNavigate();

  // Formata o telefone
  function formatarTelefone(valor: string) {
    const numeros = valor.replace(/\D/g, "").slice(0, 11);

    if (numeros.length <= 10) {
      return numeros
        .replace(/^(\d{2})(\d)/, "($1) $2")
        .replace(/(\d{4})(\d)/, "$1-$2");
    }

    return numeros
      .replace(/^(\d{2})(\d)/, "($1) $2")
      .replace(/(\d{5})(\d)/, "$1-$2");
  }

  // Formata o CNPJ
  function formatarCNPJ(valor: string) {
    const numeros = valor.replace(/\D/g, "").slice(0, 14);

    if (numeros.length <= 2) {
      return numeros;
    }

    if (numeros.length <= 5) {
      return `${numeros.slice(0, 2)}.${numeros.slice(2)}`;
    }

    if (numeros.length <= 8) {
      return `${numeros.slice(0, 2)}.${numeros.slice(2, 5)}.${numeros.slice(5)}`;
    }

    if (numeros.length <= 12) {
      return `${numeros.slice(0, 2)}.${numeros.slice(
        2,
        5,
      )}.${numeros.slice(5, 8)}/${numeros.slice(8)}`;
    }

    return `${numeros.slice(0, 2)}.${numeros.slice(
      2,
      5,
    )}.${numeros.slice(5, 8)}/${numeros.slice(8, 12)}-${numeros.slice(12)}`;
  }

  // Formata a data de nascimento
  // Exemplo: 15081998 -> 15/08/1998
  function formatarDataNascimento(valor: string) {
    const numeros = valor.replace(/\D/g, "").slice(0, 8);

    return numeros
      .replace(/^(\d{2})(\d)/, "$1/$2")
      .replace(/^(\d{2})\/(\d{2})(\d)/, "$1/$2/$3");
  }

  // Verifica se a idade está entre 18 e 100 anos
  function validarIdade(data: string): boolean {
    if (data.length !== 10) {
      return false;
    }

    const [dia, mes, ano] = data.split("/").map(Number);

    // Verifica se os números são válidos
    if (!dia || !mes || !ano) {
      return false;
    }

    // Verifica se a data realmente existe
    const dataNascimento = new Date(ano, mes - 1, dia);

    if (
      dataNascimento.getFullYear() !== ano ||
      dataNascimento.getMonth() !== mes - 1 ||
      dataNascimento.getDate() !== dia
    ) {
      return false;
    }

    const hoje = new Date();

    let idade = hoje.getFullYear() - ano;

    // Verifica se a pessoa ainda não fez aniversário este ano
    const aniversarioAindaNaoChegou =
      hoje.getMonth() < mes - 1 ||
      (hoje.getMonth() === mes - 1 && hoje.getDate() < dia);

    if (aniversarioAindaNaoChegou) {
      idade--;
    }

    return idade >= 18 && idade <= 100;
  }

  const cadastrarOng = async () => {
    // Nome do responsável
    if (!nome.trim()) {
      alert("Informe o nome do responsável.");
      return;
    }

    // Nome da ONG
    if (!nomeOng.trim()) {
      alert("Informe o nome da ONG.");
      return;
    }

    // E-mail
    if (!email.trim()) {
      alert("Informe o e-mail.");
      return;
    }

    // Telefone
    if (!telefone.trim()) {
      alert("Informe o telefone.");
      return;
    }

    // Data de nascimento
    if (!dataNascimento.trim()) {
      alert("Informe a data de nascimento.");
      return;
    }

    // Verifica se a data está completa
    if (dataNascimento.length !== 10) {
      alert("Informe a data de nascimento completa.");
      return;
    }

    // Verifica idade e validade da data
    if (!validarIdade(dataNascimento)) {
      alert(
        "O responsável pela ONG deve ter entre 18 e 100 anos e informar uma data de nascimento válida.",
      );
      return;
    }

    // CNPJ
    if (!cnpj.trim()) {
      alert("Informe o CNPJ.");
      return;
    }

    // Senha
    if (!senha) {
      alert("Informe a senha.");
      return;
    }

    // Confirmar senha
    if (!confirmarSenha) {
      alert("Confirme a senha.");
      return;
    }

    // Verifica se as senhas são iguais
    if (senha !== confirmarSenha) {
      alert("As senhas não são iguais.");
      return;
    }

    // Converte DD/MM/AAAA para AAAA-MM-DD
    const [dia, mes, ano] = dataNascimento.split("/");

    const dataNascimentoFormatada = `${ano}-${mes}-${dia}`;

    try {
      const response = await apiService.post("/auth/register", {
        nome: nome,
        nomeOng: nomeOng,
        email: email,
        senha: senha,

        // Remove a máscara antes de enviar
        telefone: telefone.replace(/\D/g, ""),

        // Envia como AAAA-MM-DD
        dataNascimento: dataNascimentoFormatada,

        // Remove a máscara do CNPJ
        cnpj: cnpj.replace(/\D/g, ""),

        tipoUsuario: "ROLE_ONG",
      });

      console.log("Cadastro realizado:", response.data);

      alert("ONG cadastrada com sucesso!");

      // Limpa o formulário
      setNome("");
      setNomeOng("");
      setTelefone("");
      setSenha("");
      setEmail("");
      setDataNascimento("");
      setCnpj("");
      setConfirmarSenha("");
    } catch (error: any) {
      console.error("Erro completo:", error);

      if (error.response) {
        console.error("Status:", error.response.status);

        console.error("Resposta:", error.response.data);

        alert(
          error.response.data?.error ||
            error.response.data?.message ||
            "Erro ao cadastrar ONG.",
        );
      } else {
        alert("Não foi possível conectar ao servidor.");
      }
    }
  };

  return (
    <>
      <style>{`
        @import url("https://fonts.googleapis.com/css2?family=Courier+Prime:ital,wght@0,400;0,700;1,400;1,700&display=swap");
        @import url("https://fonts.googleapis.com/css2?family=Courier+Prime:ital,wght@0,400;0,700;1,400;1,700&family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap");

        body {
          font-family: "Inter", "Courier Prime", sans-serif;
          margin: 0px;
        }

        header {
          width: 100%;
          padding: 38px 0px 17px 0px;
        }

        nav {
          height: 18px;
          text-align: end;
        }

        #container {
          width: 100%;
          height: fit-content;
          background-color: white;
          align-items: center;
          justify-content: center;
          display: flex;
        }

        div#containerImagemEDiv {
          background-color: white;
          display: flex;
          flex-direction: column;
        }

        img {
          width: 629px;
          height: 929px;
          margin: 0px 0px 2px 506px;
        }

        #divCadastro {
          font-family: "Inter", sans-serif;
          background-color: white;
          box-shadow: 0px 0px 24px rgba(0, 0, 0, 0.25);
          width: auto;
          height: 100%;
          margin: 30px auto;
          padding: 30px 30px;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: start;
          border-radius: 20px;
        }

        nav > a {
          font-family: "Courier Prime", monospace;
          font-size: 16px;
          text-decoration: none;
          color: #aaaaaa;
          margin: 0px 33px 0px 33px;
        }

        nav > a:hover {
          text-decoration: underline;
        }

        div#divCadastro > a {
          text-decoration: none;
          font-size: 16px;
        }

        div#divCadastro a {
          text-decoration: none;
        }

        div#divCadastro a:hover {
          text-decoration: underline;
        }

        div#divCadastro > h1 {
          font-size: 32px;
          font-weight: 700;
          margin: 0px;
          align-self: flex-start;
        }

        form label,
        label#nomeCompleto {
          display: block;
          margin: 20px 0 10px 0;
          font-size: 16px;
          text-align: left;
        }

        label#nomeCompleto {
          margin: 0px 0 10px 0;
        }

        form input,
        input#nomeCompleto {
          background-color: rgba(0, 0, 0, 0.08);
          border-radius: 25px;
          border: 3px solid transparent;
          transition: border-color 0.25s ease;
          padding: 10px 12px;
          font-size: 16px;
          box-sizing: border-box;
        }

        form input {
          height: 45px;
          width: 87%;
        }

        form input:focus,
        input#nomeCompleto:focus {
          border-color: #36c3ff;
          outline: none;
        }

        input::placeholder {
          color: rgba(0, 0, 0, 0.5);
          text-align: left;
        }

        button.buttonCadastro {
          background-color: #36c3ff;
          color: white;
          border-radius: 20px;
          border: none;
          font-family: "Inter", sans-serif;
          font-weight: 300;
          text-align: center;
          margin: 32px 0px 41px 0px;
          width: 100px;
          height: 35px;
          cursor: pointer;
          transition: background-color 0.2s ease;
        }

        button.buttonCadastro:hover {
          background-color: rgb(26, 176, 240);
        }

        .toggle {
          position: relative;
          width: 148px;
          height: 37px;
          margin: 32px 0px 32px 0px;
          background: #fff;
          border-radius: 20px;
          box-shadow: inset 0 0px 8px rgba(0, 0, 0, 0.25);
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0px 8px;
        }

        .option {
          flex: 1;
          text-align: center;
          font-size: 14px;
          color: #000000;
          cursor: pointer;
          z-index: 2;
          user-select: none;
          transition: color 0.3s;
          line-height: 37px;
        }

        .slider {
          position: absolute;
          top: 0;
          left: 0;
          height: 37px;
          width: 86px;
          background: #27beff;
          border-radius: 37px;
          transition: left 0.3s;
          z-index: 1;
        }

        input[type="radio"] {
          display: none;
        }

        #usuario:checked ~ .slider {
          left: 0;
        }

        #usuario:checked ~ label[for="usuario"] {
          color: #fff;
        }

        #ong:checked ~ .slider {
          left: calc(140px - 70px);
          width: 78px;
        }

        #ong:checked ~ label[for="ong"] {
          color: #fff;
        }

        form#meuFormContainer {
          margin: 0px;
          padding: 0px;
          gap: 20px;
          display: flex;
          flex-direction: row;
          justify-content: center;
          width: 100%;
        }

        div#meuFormEsquerdo,
        div#meuFormDireito {
          margin: 0px;
          padding: 0px;
          text-align: center;
          flex-direction: column;
          width: 100%;
        }

        #divCadastro p {
          width: 100%;
          text-align: center;
          margin: 20px 0 0 0;
        }

        #divCadastro p > a {
          color: black;
          font-weight: bold;
        }
      `}</style>

      <header>
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

      <div id="container">
        <div id="containerImagemEDiv">
          {/* Logo */}
          <div style={{ margin: "0px auto" }}>
            <a href="/">
              <img
                src="/imagens/logoMelhor.png"
                alt="Logo"
                style={{
                  width: "104px",
                  height: "90px",
                  margin: "0px auto",
                }}
              />
            </a>
          </div>

          {/* Card */}
          <div id="divCadastro">
            <h1>Crie sua conta</h1>

            {/* Toggle Usuario Ong*/}
            <div
              style={{
                position: "relative",
                width: 148,
                height: 37,
                margin: "32px 0",
                background: "#fff",
                borderRadius: 20,
                boxShadow: "inset 0 0px 8px rgba(0,0,0,0.25)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "0 8px",
              }}
            >
              {/* Slider */}
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: tipoConta === "usuario" ? 0 : "calc(140px - 70px)",
                  height: 37,
                  width: tipoConta === "usuario" ? 86 : 78,
                  background: "#27beff",
                  borderRadius: 37,
                  transition: "left 0.3s, width 0.3s",
                  zIndex: 1,
                }}
              />

              {(["usuario", "ong"] as TipoConta[]).map((tipo) => (
                <button
                  key={tipo}
                  type="button"
                  onClick={() => {
                    setTipoConta(tipo);

                    if (tipo === "usuario") {
                      setTimeout(() => {
                        navigate("/cadastros/CadastroUsuario");
                      }, 300);
                    }
                  }}
                  style={{
                    flex: 1,
                    textAlign: "center",
                    fontSize: 14,
                    color: tipoConta === tipo ? "#fff" : "#000",
                    cursor: "pointer",
                    zIndex: 2,
                    userSelect: "none",
                    transition: "color 0.3s",
                    lineHeight: "37px",
                    background: "transparent",
                    border: "none",
                    padding: 0,
                  }}
                >
                  {tipo === "usuario" ? "Usuário" : "ONG"}
                </button>
              ))}
            </div>

            {/* Formulário */}
            <form id="meuFormContainer">
              {/* Coluna esquerda */}
              <div id="meuFormEsquerdo">
                {/* Nome do responsável */}
                <label htmlFor="nomeCompleto">Nome do responsável</label>

                <input
                  type="text"
                  name="nomeCompleto"
                  placeholder="Seu nome completo"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                />

                {/* Nome da ONG */}
                <label htmlFor="nomeUsuario">Nome da ONG</label>

                <input
                  type="text"
                  name="nomeUsuario"
                  id="nomeUsuario"
                  autoComplete="off"
                  tabIndex={0}
                  placeholder="Digite o nome da ONG"
                  value={nomeOng}
                  onChange={(e) => setNomeOng(e.target.value)}
                />

                {/* Telefone */}
                <label htmlFor="telefone">Telefone</label>

                <input
                  type="tel"
                  name="telefone"
                  id="telefone"
                  autoComplete="off"
                  tabIndex={0}
                  placeholder="(xx) xxxxx-xxxx"
                  maxLength={15}
                  value={telefone}
                  onChange={(e) =>
                    setTelefone(formatarTelefone(e.target.value))
                  }
                />

                {/* Senha */}
                <label htmlFor="password">Senha</label>

                <input
                  type="password"
                  name="password"
                  id="password"
                  autoComplete="off"
                  tabIndex={0}
                  placeholder="●●●●●●●"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                />
              </div>

              {/* Coluna direita */}
              <div id="meuFormDireito">
                {/* E-mail */}
                <label htmlFor="email">E-mail</label>

                <input
                  type="email"
                  name="email"
                  id="email"
                  autoComplete="off"
                  tabIndex={0}
                  placeholder="Digite seu e-mail"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />

                {/* Data de nascimento */}
                <label htmlFor="dataNascimento">Data de Nascimento</label>

                <input
                  type="text"
                  name="dataNascimento"
                  id="dataNascimento"
                  inputMode="numeric"
                  autoComplete="off"
                  tabIndex={0}
                  placeholder="dd/mm/aaaa"
                  maxLength={10}
                  value={dataNascimento}
                  onChange={(e) =>
                    setDataNascimento(formatarDataNascimento(e.target.value))
                  }
                />

                {/* CNPJ */}
                <label htmlFor="cnpj">CNPJ</label>

                <input
                  type="text"
                  name="cnpj"
                  id="cnpj"
                  autoComplete="off"
                  tabIndex={0}
                  placeholder="xx.xxx.xxx/xxxx-xx"
                  maxLength={18}
                  value={cnpj}
                  onChange={(e) => setCnpj(formatarCNPJ(e.target.value))}
                />

                {/* Confirmar senha */}
                <label htmlFor="confirmarSenha">Confirmar Senha</label>

                <input
                  type="password"
                  name="confirmarSenha"
                  id="confirmarSenha"
                  autoComplete="off"
                  tabIndex={0}
                  placeholder="●●●●●●●"
                  value={confirmarSenha}
                  onChange={(e) => setConfirmarSenha(e.target.value)}
                />
              </div>
            </form>

            {/* Botão cadastrar */}
            <button
              className="buttonCadastro"
              type="button"
              onClick={cadastrarOng}
            >
              Cadastrar
            </button>

            {/* Login */}
            <p>
              Já tem uma conta? <a href="/login">Fazer login</a>
            </p>
          </div>
        </div>

        {/* Cachorro */}
        <img src="/imagens/cachorro.png" alt="cachorro" />
      </div>
    </>
  );
}
