package com.extensao.adotapet.exception;

import java.time.LocalDateTime;

public class ErrorResponse {

    private int status;
    private String error;
    private LocalDateTime timestamp;

    public ErrorResponse(int status, String error, LocalDateTime timestamp) {
        this.status = status;
        this.error = error;
        this.timestamp = timestamp;
    }

    public int getStatus() {
        return status;
    }

    public String getError() {
        return error;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }
}
