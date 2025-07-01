package edu.cosc578.group7.model;

public class Appointment {
    private int appointment_id;
    private String appointment_date;
    private String time;
    private String purpose;
    private String listing_price;
    private int listing_id;
    private int agent_id;
    private int client_id;

    public Appointment(){

    }

    public Appointment(int appointment_id, String appointment_date, String time, String purpose, String listing_price, int listing_id, int agent_id, int client_id ){
        this.appointment_id = appointment_id;
        this.appointment_date = appointment_date;
        this.time = time;
        this.purpose = purpose;
        this.listing_price = listing_price;
        this.listing_id = listing_id;
        this.agent_id = agent_id;
        this.client_id = client_id;
    
    }

    public int getAppointment_id(){
        return appointment_id;
    }

    public String getAppointment_date(){
        return appointment_date;
    }

    public String getTime(){
        return time;
    }

    public String getPurpose(){
        return purpose;
    }

    public String getListing_price(){
        return listing_price;
    }

    public int getListing_id(){
        return listing_id;
    }

    public int getAgent_id(){
        return agent_id;
    }

    public int getClient_id(){
        return client_id;
    }

    
    public void setAppointment_id(int appointment_id){
        this.appointment_id = appointment_id;
    }

    public void setAppointment_date(String appointment_date){
        this.appointment_date  = appointment_date;
    }

    public void setTime(String time){
        this.time = time;
    }

    public void setPurpose(String purpose){
        this.purpose = purpose;
    }

    public void setListing_price(String listing_price){
        this.listing_price = listing_price;
    }

    public void setListing_id(int listing_id){
        this.listing_id = listing_id;
    }

    public void setAgent_id(int agent_id){
        this.agent_id = agent_id;
    }

    public void setClient_id(int client_id){
        this.client_id = client_id;
    }
}
