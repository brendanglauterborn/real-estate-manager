package edu.cosc578.group7.model;

public class AuthResponse {
    private String token;
    private int agent_id;
    private String first_name;
    private String last_name;

    public AuthResponse() {
    }

    public AuthResponse(String token, int agent_id, String first_name, String last_name) {
        this.token = token;
        this.agent_id = agent_id;
        this.first_name = first_name;
        this.last_name = last_name;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public int getAgent_id() {
        return agent_id;
    }

    public void setAgent_id(int agent_id) {
        this.agent_id = agent_id;
    }

    public String getFirst_name() {
        return first_name;
    }

    public void setFirst_name(String first_name) {
        this.first_name = first_name;
    }

    public String getLast_name() {
        return last_name;
    }

    public void setLast_name(String last_name) {
        this.last_name = last_name;
    }
} 