package com.extensao.adotapet.Utils;

public class Util {
    public static String normalizar(String texto) {
        if (texto == null) {
            return null;
        }

        return texto.trim().toLowerCase();
    }
}
