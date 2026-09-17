package com.extensao.adotapet.localizacao;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestClient;

import java.util.List;

@Configuration
public class LocalizacaoSeeder {

    @Bean
    CommandLineRunner importarLocalizacoes(
            EstadoRepository estadoRepository,
            CidadeRepository cidadeRepository
    ) {

        return args -> {

            // Se já existem estados, não importa novamente
            if (estadoRepository.count() > 0) {
                System.out.println("Estados já cadastrados. Importação ignorada.");
                return;
            }

            RestClient restClient = RestClient.create();

            System.out.println("Iniciando importação dos estados...");

            // Busca os estados no IBGE
            EstadoIbge[] estados = restClient
                    .get()
                    .uri("https://servicodados.ibge.gov.br/api/v1/localidades/estados")
                    .retrieve()
                    .body(EstadoIbge[].class);

            if (estados == null) {
                throw new RuntimeException("Não foi possível buscar os estados no IBGE.");
            }

            for (EstadoIbge estadoIbge : estados) {

                Estado estado = new Estado();
                estado.setNome(estadoIbge.nome());
                estado.setSigla(estadoIbge.sigla());

                Estado estadoSalvo = estadoRepository.save(estado);

                System.out.println(
                        "Estado salvo: " + estadoSalvo.getNome()
                );

                // Busca as cidades desse estado
                CidadeIbge[] cidades = restClient
                        .get()
                        .uri(
                                "https://servicodados.ibge.gov.br/api/v1/localidades/estados/"
                                        + estadoIbge.id()
                                        + "/municipios"
                        )
                        .retrieve()
                        .body(CidadeIbge[].class);

                if (cidades == null) {
                    continue;
                }

                for (CidadeIbge cidadeIbge : cidades) {

                    Cidade cidade = new Cidade();

                    cidade.setNome(cidadeIbge.nome());
                    cidade.setCodigoIbge(cidadeIbge.id());
                    cidade.setEstado(estadoSalvo);

                    cidadeRepository.save(cidade);
                }

                System.out.println(
                        "Cidades de " + estadoSalvo.getNome() + " importadas."
                );
            }

            System.out.println("--------------------------------------");
            System.out.println("Importação de estados e cidades concluída!");
            System.out.println("--------------------------------------");
        };
    }

    // Estrutura recebida do IBGE para os estados
    public record EstadoIbge(
            Long id,
            String sigla,
            String nome
    ) {
    }

    // Estrutura recebida do IBGE para os municípios
    public record CidadeIbge(
            Long id,
            String nome
    ) {
    }
}