package edu.cosc578.group7.model;

public class Listing {
    private int listing_id;
    private String listing_date;
    private String status;
    private String description;
    private String listing_price;
    private int property_id;
    private int agent_id;

    public Listing(){

    }

    public Listing(int listing_id, String listing_date, String status, String description, String listing_price, int property_id, int agent_id){
        this.listing_id = listing_id;
        this.listing_date = listing_date;
        this.status = status;
        this.description = description;
        this.listing_price = listing_price;
        this.property_id = property_id;
        this.agent_id = agent_id;
    }

    public int getListing_id(){
        return listing_id;
    }

    public String getListing_date(){
        return listing_date;
    }

    public String getStatus(){
        return status;
    }

    public String getDescription(){
        return description;
    }

    public String getListing_price(){
        return listing_price;
    }

    public int getProperty_id(){
        return property_id;
    }

    public int getAgent_id(){
        return agent_id;
    }


    public void setListing_id(int listing_id){
        this.listing_id = listing_id;
    }

    public void setListing_date(String listing_date){
        this.listing_date = listing_date;
    }

    public void setStatus(String status){
        this.status = status;
    }

    public void setDescription(String description){
        this.description = description;
    }

    public void setListing_price(String listing_price){
        this.listing_price = listing_price;
    }

    public void setProperty_id(int property_id){
        this.property_id = property_id;
    }

    public void setAgent_id(int agent_id){
        this.agent_id = agent_id;
    }
}
