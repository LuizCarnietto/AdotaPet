package com.extensao.adotapet.Animal;

import com.extensao.adotapet.Enum.*;
import org.springframework.data.jpa.domain.Specification;

public class AnimalSpecification {

    public static Specification<Animal> disponivel() {
        return (root, query, cb) ->
                cb.equal(root.get("status"), Status.DISPONIVEL);
    }

    public static Specification<Animal> especie(Especie especie) {
        return (root, query, cb) ->
                cb.equal(root.get("especie"), especie);
    }

    public static Specification<Animal> raca(String raca) {
        return (root, query, cb) ->
                cb.like(cb.lower(root.get("raca")),
                        "%" + raca.toLowerCase() + "%");
    }

    public static Specification<Animal> sexo(Sexo sexo) {
        return (root, query, cb) ->
                cb.equal(root.get("sexo"), sexo);
    }

    public static Specification<Animal> cor(String cor) {
        return (root, query, cb) ->
                cb.like(cb.lower(root.get("cor")),
                        "%" + cor.toLowerCase() + "%");
    }

    public static Specification<Animal> idade(Idade idade) {
        return (root, query, cb) ->
                cb.equal(root.get("idade"), idade);
    }

    public static Specification<Animal> porte(Porte porte) {
        return (root, query, cb) ->
                cb.equal(root.get("porte"), porte);
    }

    public static Specification<Animal> possuiChip(Boolean chip) {
        return (root, query, cb) ->
                cb.equal(root.get("possuiChip"), chip);
    }

    public static Specification<Animal> vacinado(Boolean vacinado) {
        return (root, query, cb) ->
                cb.equal(root.get("vacinado"), vacinado);
    }

    public static Specification<Animal> localizacao(String localizacao) {
        return (root, query, cb) ->
                cb.like(cb.lower(root.get("localizacao")),
                        "%" + localizacao.toLowerCase() + "%");
    }
}
