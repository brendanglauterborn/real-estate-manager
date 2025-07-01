package edu.cosc578.group7.model;

public class Client {
    private int client_id;
    private String email;
    private String first_name;
    private String last_name;
    private String phone_no;
    private int agent_id;


    public Client(){

    }

    public Client(int client_id, String email, String first_name, String last_name, String phone_no, int agent_id){
        this.client_id = client_id;
        this.email = email;
        this.first_name = first_name;
        this.last_name = last_name;
        this.phone_no = phone_no;
        this.agent_id = agent_id;
    }

    public Client(String email, String first_name, String last_name, String phone_no, int agent_id){
        this.email = email;
        this.first_name = first_name;
        this.last_name = last_name;
        this.phone_no = phone_no;
        this.agent_id = agent_id;
    }

    public int getClient_id(){
        return client_id;
    }

    public void setClient_id(int client_id){
        this.client_id = client_id;
    }

    public String getEmail(){
        return email;
    }

    public String getFirst_name(){
        return first_name;
    }

    public String getLast_name(){
        return last_name;
    }

    public String getPhone_no(){
        return phone_no;
    }

    public int getAgent_id(){
        return agent_id;
    }

    public void setFirst_name(String first_name){
        this.first_name = first_name;
    }

    public void setLast_name(String last_name){
        this.last_name = last_name;
    }

    public void setEmail(String email){
        this.email = email;
    }

    public void setPhone_no(String phone_no){
        this.phone_no = phone_no;
    }

    public void setAgent_id(int agent_id){
        this.agent_id = agent_id;
    }
}
