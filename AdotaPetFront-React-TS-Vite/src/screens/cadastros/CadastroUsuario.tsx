import { useState, ChangeEvent, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { apiService } from "../../services/ApiService";

type TipoConta = "usuario" | "ong";

interface FormState {
  nomeCompleto: string;
  cpf: string;
  telefone: string;
  senha: string;
  email: string;
  dataNascimento: string;
  confirmarSenha: string;
}

// Formata a data de nascimento automaticamente
function formatarDataNascimento(valor: string) {
  const numeros = valor.replace(/\D/g, "").slice(0, 8);

  return numeros
    .replace(/^(\d{2})(\d)/, "$1/$2")
    .replace(/^(\d{2})\/(\d{2})(\d)/, "$1/$2/$3");
}

// Valida a idade entre 18 e 100 anos
function validarIdade(data: string): boolean {
  const partes = data.split("/");

  if (partes.length !== 3) {
    return false;
  }

  const dia = Number(partes[0]);
  const mes = Number(partes[1]);
  const ano = Number(partes[2]);

  if (!dia || !mes || !ano) {
    return false;
  }

  const nascimento = new Date(ano, mes - 1, dia);
  const hoje = new Date();

  // Verifica se a data realmente existe
  if (
    nascimento.getFullYear() !== ano ||
    nascimento.getMonth() !== mes - 1 ||
    nascimento.getDate() !== dia
  ) {
    return false;
  }

  // Não permite data futura
  if (nascimento > hoje) {
    return false;
  }

  let idade = hoje.getFullYear() - ano;

  const aniversarioAindaNaoChegou =
    hoje.getMonth() < mes - 1 ||
    (hoje.getMonth() === mes - 1 && hoje.getDate() < dia);

  if (aniversarioAindaNaoChegou) {
    idade--;
  }

  return idade >= 18 && idade <= 100;
}

// Formata o CPF automaticamente
function formatarCPF(valor: string) {
  const numeros = valor.replace(/\D/g, "").slice(0, 11);

  return numeros
    .replace(/^(\d{3})(\d)/, "$1.$2")
    .replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3")
    .replace(/^(\d{3})\.(\d{3})\.(\d{3})(\d)/, "$1.$2.$3-$4");
}

// Formata o telefone automaticamente
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

export default function CadastroUsuario() {
  const navigate = useNavigate();
  const [tipoConta, setTipoConta] = useState<TipoConta>("usuario");

  const [form, setForm] = useState<FormState>({
    nomeCompleto: "",
    cpf: "",
    telefone: "",
    senha: "",
    email: "",
    dataNascimento: "",
    confirmarSenha: "",
  });

  

  const [erro, setErro] = useState<string | null>(null);
  const [sucesso, setSucesso] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;

    // Formatação automática do CPF
    if (name === "cpf") {
      setForm((prev) => ({
        ...prev,
        cpf: formatarCPF(value),
      }));

      return;
    }

    // Formatação automática do telefone
    if (name === "telefone") {
      setForm((prev) => ({
        ...prev,
        telefone: formatarTelefone(value),
      }));

      return;
    }

    // Formatação automática da data de nascimento
    if (name === "dataNascimento") {
      setForm((prev) => ({
        ...prev,
        dataNascimento: formatarDataNascimento(value),
      }));

      return;
    }

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: FormEvent): Promise<void> => {
    e.preventDefault();

    setErro(null);
    setSucesso(false);

    if (!form.nomeCompleto.trim()) {
      setErro("Informe o nome completo.");
      return;
    }

    if (!form.email.trim()) {
      setErro("Informe o e-mail.");
      return;
    }

    if (!form.cpf.trim()) {
      setErro("Informe o CPF.");
      return;
    }

    // Verifica se o CPF está completo
    if (form.cpf.replace(/\D/g, "").length !== 11) {
      setErro("Informe um CPF completo.");
      return;
    }

    if (!form.telefone.trim()) {
      setErro("Informe o telefone.");
      return;
    }

    // Verifica se o telefone está completo
    if (form.telefone.replace(/\D/g, "").length !== 11) {
      setErro("Informe um telefone completo.");
      return;
    }

    if (!form.dataNascimento.trim()) {
      setErro("Informe a data de nascimento.");
      return;
    }

    // Verifica se a data está completa
    if (form.dataNascimento.replace(/\D/g, "").length !== 8) {
      setErro("Informe a data de nascimento completa.");
      return;
    }

    // Verifica se a idade está entre 18 e 100 anos
    if (!validarIdade(form.dataNascimento)) {
      setErro("Você deve ter entre 18 e 100 anos.");
      return;
    }

    if (!form.senha) {
      setErro("Informe a senha.");
      return;
    }

    if (!form.confirmarSenha) {
      setErro("Confirme a senha.");
      return;
    }

    if (form.senha !== form.confirmarSenha) {
      setErro("As senhas não coincidem.");
      return;
    }

    // Converte DD/MM/AAAA para AAAA-MM-DD
    const partesData = form.dataNascimento.split("/");

    const dataNascimentoFormatada = `${partesData[2]}-${partesData[1]}-${partesData[0]}`;

    try {
      const response = await apiService.post("/auth/register", {
        nome: form.nomeCompleto,

        email: form.email,

        senha: form.senha,

        // Remove a máscara antes de enviar para o Java
        telefone: form.telefone.replace(/\D/g, ""),

        // Remove a máscara do CPF antes de enviar
        cpf: form.cpf.replace(/\D/g, ""),

        // Envia para o Java no formato LocalDate
        // AAAA-MM-DD
        dataNascimento: dataNascimentoFormatada,

        tipoUsuario: tipoConta === "ong" ? "ROLE_ONG" : "ROLE_ADOTANTE",
      });

      console.log("Cadastro realizado:", response.data);

      setSucesso(true);

      // Limpa o formulário após o cadastro
      setForm({
        nomeCompleto: "",
        cpf: "",
        telefone: "",
        senha: "",
        email: "",
        dataNascimento: "",
        confirmarSenha: "",
      });
    } catch (error: any) {
      console.error("Erro ao cadastrar usuário:", error);

      const mensagem =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Erro ao cadastrar usuário.";

      setErro(mensagem);
    }
  };

  const inputClass =
    "h-[45px] bg-black/[0.08] rounded-full border-[3px] border-transparent px-3 text-base outline-none focus:border-[#36c3ff] transition-colors placeholder:text-black/50";

  return (
    <div
      style={{
        fontFamily: '"Inter", "Courier Prime", sans-serif',
        margin: 0,
      }}
    >
      {/* Header */}
      <header
        style={{
          width: "100%",
          padding: "38px 0 17px 0",
        }}
      >
        <nav
          style={{
            height: 18,
            textAlign: "right",
          }}
        >
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

      {/* Container principal */}
      <div
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "white",
        }}
      >
        {/* Coluna esquerda */}
        <div
          style={{
            backgroundColor: "white",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Logo */}
          <div style={{ margin: "0 auto" }}>
            <a href="/">
              <img
                src="/imagens/DetalhesAnimal/logoMelhor.png"
                alt="Logo"
                style={{
                  width: 104,
                  height: 90,
                  display: "block",
                  margin: "0 auto",
                }}
              />
            </a>
          </div>

          {/* Card de cadastro */}
          <div
            style={{
              fontFamily: '"Inter", sans-serif',
              backgroundColor: "white",
              boxShadow: "0px 0px 24px rgba(0,0,0,0.25)",
              width: "auto",
              margin: "30px auto",
              padding: "30px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              borderRadius: 20,
            }}
          >
            <h1
              style={{
                fontSize: 32,
                fontWeight: 700,
                margin: 0,
                alignSelf: "flex-start",
              }}
            >
              Crie sua conta
            </h1>

            {/* Toggle Usuário / ONG */}
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

              {/* Usuário */}
              <button
                type="button"
                onClick={() => {
                  setTipoConta("usuario");
                }}
                style={{
                  flex: 1,
                  textAlign: "center",
                  fontSize: 14,
                  color: tipoConta === "usuario" ? "#fff" : "#000",
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
                Usuário
              </button>

              {/* ONG */}
              <button
                type="button"
                onClick={() => {
                  setTipoConta("ong");

                  // Pequeno atraso para permitir
                  // que o slider deslize antes da troca
                  setTimeout(() => {
                    navigate("/cadastros/CadastroOng");
                  }, 300);
                }}
                style={{
                  flex: 1,
                  textAlign: "center",
                  fontSize: 14,
                  color: tipoConta === "ong" ? "#fff" : "#000",
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
                ONG
              </button>
            </div>

            {/* Feedback de erro */}
            {erro && (
              <div
                style={{
                  width: "100%",
                  marginBottom: 12,
                  background: "#fff5f5",
                  border: "1px solid #fca5a5",
                  color: "#b91c1c",
                  borderRadius: 12,
                  padding: "8px 16px",
                  fontSize: 14,
                }}
              >
                ⚠️ {erro}
              </div>
            )}

            {/* Feedback de sucesso */}
            {sucesso && (
              <div
                style={{
                  width: "100%",
                  marginBottom: 12,
                  background: "#f0fdf4",
                  border: "1px solid #86efac",
                  color: "#15803d",
                  borderRadius: 12,
                  padding: "8px 16px",
                  fontSize: 14,
                }}
              >
                ✅ Conta criada com sucesso!
              </div>
            )}

            {/* Nome completo */}
            <label
              htmlFor="nomeCompleto"
              style={{
                display: "block",
                textAlign: "left",
                margin: "0 0 10px 0",
                fontSize: 16,
                width: "100%",
              }}
            >
              Nome completo
            </label>

            <input
              id="nomeCompleto"
              name="nomeCompleto"
              type="text"
              value={form.nomeCompleto}
              onChange={handleChange}
              placeholder="Seu nome completo"
              style={{
                height: 45,
                width: "95%",
                backgroundColor: "rgba(0,0,0,0.08)",
                borderRadius: 25,
                border: "3px solid transparent",
                padding: "10px 12px",
                fontSize: 16,
                outline: "none",
                boxSizing: "border-box",
              }}
              onFocus={(e) => (e.currentTarget.style.borderColor = "#36c3ff")}
              onBlur={(e) =>
                (e.currentTarget.style.borderColor = "transparent")
              }
            />

            {/* Grid 2 colunas */}
            <form
              onSubmit={handleSubmit}
              style={{
                margin: 0,
                padding: 0,
                gap: 20,
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
                width: "100%",
              }}
            >
              {/* Coluna esquerda */}
              <div
                style={{
                  margin: 0,
                  padding: 0,
                  textAlign: "center",
                  display: "flex",
                  flexDirection: "column",
                  width: "100%",
                }}
              >
                {/* CPF */}
                <div>
                  <label
                    htmlFor="cpf"
                    style={{
                      display: "block",
                      textAlign: "left",
                      margin: "20px 0 10px 0",
                      fontSize: 16,
                    }}
                  >
                    CPF
                  </label>

                  <input
                    id="cpf"
                    name="cpf"
                    type="text"
                    value={form.cpf}
                    onChange={handleChange}
                    placeholder="Digite seu CPF"
                    autoComplete="off"
                    maxLength={14}
                    className={inputClass}
                    style={{
                      height: 45,
                      width: "87%",
                      backgroundColor: "rgba(0,0,0,0.08)",
                      borderRadius: 25,
                      border: "3px solid transparent",
                      padding: "10px 12px",
                      fontSize: 16,
                      outline: "none",
                      boxSizing: "border-box",
                    }}
                    onFocus={(e) =>
                      (e.currentTarget.style.borderColor = "#36c3ff")
                    }
                    onBlur={(e) =>
                      (e.currentTarget.style.borderColor = "transparent")
                    }
                  />
                </div>

                {/* Telefone */}
                <div>
                  <label
                    htmlFor="telefone"
                    style={{
                      display: "block",
                      textAlign: "left",
                      margin: "20px 0 10px 0",
                      fontSize: 16,
                    }}
                  >
                    Telefone
                  </label>

                  <input
                    id="telefone"
                    name="telefone"
                    type="tel"
                    value={form.telefone}
                    onChange={handleChange}
                    placeholder="(xx) xxxxx-xxxx"
                    autoComplete="off"
                    maxLength={15}
                    className={inputClass}
                    style={{
                      height: 45,
                      width: "87%",
                      backgroundColor: "rgba(0,0,0,0.08)",
                      borderRadius: 25,
                      border: "3px solid transparent",
                      padding: "10px 12px",
                      fontSize: 16,
                      outline: "none",
                      boxSizing: "border-box",
                    }}
                    onFocus={(e) =>
                      (e.currentTarget.style.borderColor = "#36c3ff")
                    }
                    onBlur={(e) =>
                      (e.currentTarget.style.borderColor = "transparent")
                    }
                  />
                </div>

                {/* Senha */}
                <div>
                  <label
                    htmlFor="senha"
                    style={{
                      display: "block",
                      textAlign: "left",
                      margin: "20px 0 10px 0",
                      fontSize: 16,
                    }}
                  >
                    Senha
                  </label>

                  <input
                    id="senha"
                    name="senha"
                    type="password"
                    value={form.senha}
                    onChange={handleChange}
                    placeholder="●●●●●●●"
                    autoComplete="off"
                    className={inputClass}
                    style={{
                      height: 45,
                      width: "87%",
                      backgroundColor: "rgba(0,0,0,0.08)",
                      borderRadius: 25,
                      border: "3px solid transparent",
                      padding: "10px 12px",
                      fontSize: 16,
                      outline: "none",
                      boxSizing: "border-box",
                    }}
                    onFocus={(e) =>
                      (e.currentTarget.style.borderColor = "#36c3ff")
                    }
                    onBlur={(e) =>
                      (e.currentTarget.style.borderColor = "transparent")
                    }
                  />
                </div>
              </div>

              {/* Coluna direita */}
              <div
                style={{
                  margin: 0,
                  padding: 0,
                  textAlign: "center",
                  display: "flex",
                  flexDirection: "column",
                  width: "100%",
                }}
              >
                {/* E-mail */}
                <div>
                  <label
                    htmlFor="email"
                    style={{
                      display: "block",
                      textAlign: "left",
                      margin: "20px 0 10px 0",
                      fontSize: 16,
                    }}
                  >
                    E-mail
                  </label>

                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="Digite seu e-mail"
                    autoComplete="off"
                    className={inputClass}
                    style={{
                      height: 45,
                      width: "87%",
                      backgroundColor: "rgba(0,0,0,0.08)",
                      borderRadius: 25,
                      border: "3px solid transparent",
                      padding: "10px 12px",
                      fontSize: 16,
                      outline: "none",
                      boxSizing: "border-box",
                    }}
                    onFocus={(e) =>
                      (e.currentTarget.style.borderColor = "#36c3ff")
                    }
                    onBlur={(e) =>
                      (e.currentTarget.style.borderColor = "transparent")
                    }
                  />
                </div>

                {/* Data de nascimento */}
                <div>
                  <label
                    htmlFor="dataNascimento"
                    style={{
                      display: "block",
                      textAlign: "left",
                      margin: "20px 0 10px 0",
                      fontSize: 16,
                    }}
                  >
                    Data de Nascimento
                  </label>

                  <input
                    id="dataNascimento"
                    name="dataNascimento"
                    type="text"
                    inputMode="numeric"
                    value={form.dataNascimento}
                    onChange={handleChange}
                    placeholder="dd/mm/aaaa"
                    autoComplete="off"
                    maxLength={10}
                    className={inputClass}
                    style={{
                      height: 45,
                      width: "87%",
                      backgroundColor: "rgba(0,0,0,0.08)",
                      borderRadius: 25,
                      border: "3px solid transparent",
                      padding: "10px 12px",
                      fontSize: 16,
                      outline: "none",
                      boxSizing: "border-box",
                    }}
                    onFocus={(e) =>
                      (e.currentTarget.style.borderColor = "#36c3ff")
                    }
                    onBlur={(e) =>
                      (e.currentTarget.style.borderColor = "transparent")
                    }
                  />
                </div>

                {/* Confirmar senha */}
                <div>
                  <label
                    htmlFor="confirmarSenha"
                    style={{
                      display: "block",
                      textAlign: "left",
                      margin: "20px 0 10px 0",
                      fontSize: 16,
                    }}
                  >
                    Confirmar Senha
                  </label>

                  <input
                    id="confirmarSenha"
                    name="confirmarSenha"
                    type="password"
                    value={form.confirmarSenha}
                    onChange={handleChange}
                    placeholder="●●●●●●●"
                    autoComplete="off"
                    className={inputClass}
                    style={{
                      height: 45,
                      width: "87%",
                      backgroundColor: "rgba(0,0,0,0.08)",
                      borderRadius: 25,
                      border: "3px solid transparent",
                      padding: "10px 12px",
                      fontSize: 16,
                      outline: "none",
                      boxSizing: "border-box",
                    }}
                    onFocus={(e) =>
                      (e.currentTarget.style.borderColor = "#36c3ff")
                    }
                    onBlur={(e) =>
                      (e.currentTarget.style.borderColor = "transparent")
                    }
                  />
                </div>
              </div>
            </form>

            {/* Botão cadastrar */}
            <button
              type="button"
              onClick={() =>
                handleSubmit({
                  preventDefault: () => {},
                } as FormEvent)
              }
              style={{
                backgroundColor: "#36c3ff",
                color: "white",
                borderRadius: 20,
                border: "none",
                fontFamily: '"Inter", sans-serif',
                fontWeight: 300,
                textAlign: "center",
                margin: "32px 0 41px 0",
                width: 100,
                height: 35,
                cursor: "pointer",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = "#1ab0f0")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = "#36c3ff")
              }
            >
              Cadastrar
            </button>

            {/* Login */}
            <p
              style={{
                width: "100%",
                textAlign: "center",
                margin: "20px 0 0 0",
              }}
            >
              Já tem uma conta?{" "}
              <a
                href="/login"
                style={{
                  color: "black",
                  fontWeight: "bold",
                  textDecoration: "none",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.textDecoration = "underline")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.textDecoration = "none")
                }
              >
                Fazer login
              </a>
            </p>
          </div>
        </div>

        {/* Imagem lateral do cachorro */}
        <img
          src="/imagens/cachorro.png"
          alt="cachorro"
          style={{
            width: 629,
            height: 929,
            marginLeft: 506,
            marginBottom: 2,
          }}
        />
      </div>
    </div>
  );
}
