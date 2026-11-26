
import { Lottie } from "lottie-react";

type TelaLoadingProps = {
  mensagem?: string;
};

export function TelaLoading({
  mensagem = "Carregando...",
}: TelaLoadingProps) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="w-52 h-52">
        <Lottie
          src="/animations/loading.json"
          autoplay
          loop
        />
      </div>

      <p className="text-gray-600 font-medium">
        {mensagem}
      </p>
    </div>
  );
}
