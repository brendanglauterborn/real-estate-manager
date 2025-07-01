package edu.cosc578.group7.model;

public class Property {
    private int property_id;
    private String address;
    private String type;
    private String features;

    public Property(){

    }

    public Property(int property_id, String address, String type, String features){
        this.property_id = property_id;
        this.address = address;
        this.type = type;
        this.features = features;
    
    }

    public int getProperty_id(){
        return property_id;
    }

    public String getAddress(){
        return address;
    }

    public String getType(){
        return type;
    }

    public String getFeatures(){
        return features;
    }

    public void setProperty_id(int property_id){
        this.property_id = property_id;
    }

    public void setAddress(String address){
        this.address = address;
    }

    public void setType(String type){
        this.type = type;
    }

    public void setFeatures(String features){
        this.features = features;
    }
}

