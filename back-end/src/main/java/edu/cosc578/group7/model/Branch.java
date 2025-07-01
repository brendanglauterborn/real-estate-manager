package edu.cosc578.group7.model;

//import io.micrometer.common.lang.NonNull;
//import javax.validation.constraints.NotNull;


public class Branch {

    //@NotNull(message = "branch_id cannot be null")
    private int branch_id;
    private String name;
    private String address;
    private String phone_no;

    public Branch() {

    }

    public Branch(int branch_id, String name, String address, String phone_no) {
        this.branch_id = branch_id;
        this.name = name;
        this.address = address;
        this.phone_no = phone_no;
    }

    public int getBranch_id() {
        return branch_id;
    }

    public void setBranch_id(int branch_id) {
        this.branch_id = branch_id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getPhone_no() {
        return phone_no;
    }

    public void setPhone_no(String phone_no) {
        this.phone_no = phone_no;
    }

    // For backward compatibility
    public String getLocation() {
        return address;
    }

    public void setLocation(String location) {
        this.address = location;
    }
}
