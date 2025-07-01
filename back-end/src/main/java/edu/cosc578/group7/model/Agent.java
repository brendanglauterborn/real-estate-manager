package edu.cosc578.group7.model;
/*This program sets the structure of the Agent table.
 * It will convert json to objects (tuples) 
 * and also convert objects into json for the front
*/
public class Agent {
    
    //atributes of Agent table
    private int agent_id;
    private String first_name;
    private String last_name;
    private String email;
    private String phone_no;
    private String  region;
    private String role;
    private int branch_id;
    private String password;
    
    //Default constructor required by Spring
    public Agent(){

    }
    //Constructor to initialize all agent attributes
    public Agent(int agent_id, String first_name, String last_name, String email, String phone_no, String region, String role, int branch_id, String password){
        this.agent_id = agent_id;
        this.first_name = first_name;
        this.last_name = last_name;
        this.email = email;
        this.phone_no = phone_no;
        this.region = region;
        this.role = role;
        this.branch_id = branch_id;
        this.password = password;
    }
    //Get values
    //Convert object to json
    public int getAgent_id(){
        return agent_id;
    }

    public String getFirst_name(){
        return first_name;
    }

    public String getLast_name(){
        return last_name;
    }

    public String getEmail(){
        return email;
    }

    public String getPhone_no(){
        return phone_no;
    }

    public String getRegion(){
        return region;
    }

    public String getRole(){
        return role;
    }

    public int getBranch_id(){
        return branch_id;
    }
    
    public String getPassword(){
        return password;
    }

    //Set values
    //convert json to objects
    public void setAgent_id(int agent_id){
        this.agent_id = agent_id;
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

    public void setRegion(String region){
        this.region = region;
    }

    public void setRole(String role){
        this.role = role;
    }

    public void setBranch_id(int branch_id){
        this.branch_id = branch_id;
    }
    
    public void setPassword(String password){
        this.password = password;
    }

}
