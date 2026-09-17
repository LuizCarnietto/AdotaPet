package com.extensao.adotapet.raca;

import com.extensao.adotapet.Enum.Especie;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class RacaSeeder implements CommandLineRunner {

    private final RacaRepository racaRepository;

    public RacaSeeder(RacaRepository racaRepository) {
        this.racaRepository = racaRepository;
    }

    @Override
    public void run(String... args) {

        if (racaRepository.count() > 0) {
            return;
        }

        List<Raca> racas = List.of(

                // =========================
                // CACHORROS
                // =========================

                new Raca("SRD", Especie.CACHORRO),
                new Raca("Akita", Especie.CACHORRO),
                new Raca("Beagle", Especie.CACHORRO),
                new Raca("Border Collie", Especie.CACHORRO),
                new Raca("Boxer", Especie.CACHORRO),
                new Raca("Bulldog Francês", Especie.CACHORRO),
                new Raca("Bulldog Inglês", Especie.CACHORRO),
                new Raca("Chihuahua", Especie.CACHORRO),
                new Raca("Chow Chow", Especie.CACHORRO),
                new Raca("Cocker Spaniel", Especie.CACHORRO),
                new Raca("Dachshund", Especie.CACHORRO),
                new Raca("Doberman", Especie.CACHORRO),
                new Raca("Golden Retriever", Especie.CACHORRO),
                new Raca("Husky Siberiano", Especie.CACHORRO),
                new Raca("Labrador", Especie.CACHORRO),
                new Raca("Lhasa Apso", Especie.CACHORRO),
                new Raca("Maltês", Especie.CACHORRO),
                new Raca("Pastor Alemão", Especie.CACHORRO),
                new Raca("Pastor Belga Malinois", Especie.CACHORRO),
                new Raca("Pinscher", Especie.CACHORRO),
                new Raca("Pitbull", Especie.CACHORRO),
                new Raca("Poodle", Especie.CACHORRO),
                new Raca("Pug", Especie.CACHORRO),
                new Raca("Rottweiler", Especie.CACHORRO),
                new Raca("Shih Tzu", Especie.CACHORRO),
                new Raca("Spitz Alemão", Especie.CACHORRO),
                new Raca("Yorkshire Terrier", Especie.CACHORRO),

                // =========================
                // GATOS
                // =========================

                new Raca("SRD", Especie.GATO),
                new Raca("Angorá", Especie.GATO),
                new Raca("Bengal", Especie.GATO),
                new Raca("British Shorthair", Especie.GATO),
                new Raca("Maine Coon", Especie.GATO),
                new Raca("Persa", Especie.GATO),
                new Raca("Ragdoll", Especie.GATO),
                new Raca("Siamês", Especie.GATO),
                new Raca("Sphynx", Especie.GATO),
                new Raca("Scottish Fold", Especie.GATO),
                new Raca("Azul Russo", Especie.GATO),
                new Raca("Abissínio", Especie.GATO)
        );

        racaRepository.saveAll(racas);

        System.out.println("Raças cadastradas com sucesso!");
    }
}