package edu.cosc578.group7.repository;

import java.sql.ResultSet;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;
import edu.cosc578.group7.model.Branch;

@Repository
public class BranchRepository {
    @Autowired
    private JdbcTemplate jdbcTemplate;

    public List<Branch> getAllBranch(){
        String sql = "Select * from Branch";
        return jdbcTemplate.query(sql, (rs, rowNum) -> mapRow(rs));
    }

    public void insertBranch(Branch branch){
        String sql = "Insert into Branch (branch_id, name, address, phone_no) values (?,?,?,?)";
        jdbcTemplate.update(sql, 
            branch.getBranch_id(), 
            branch.getName(), 
            branch.getAddress(), 
            branch.getPhone_no());
    }

    public void updateBranch(Branch branch) {
        String sql = "Update Branch set name = ?, address = ?, phone_no = ? where branch_id = ?";
        jdbcTemplate.update(sql, 
            branch.getName(), 
            branch.getAddress(), 
            branch.getPhone_no(), 
            branch.getBranch_id());
    }

    public void deleteBranch(int branch_id) {
        String sql = "Delete From Branch Where branch_id = ?";
        jdbcTemplate.update(sql, branch_id);
    }

    private Branch mapRow(ResultSet rs) {
        Branch b = new Branch();
        try{
            b.setBranch_id(rs.getInt("branch_id"));
            b.setName(rs.getString("name"));
            b.setAddress(rs.getString("address"));
            b.setPhone_no(rs.getString("phone_no"));
            return b;
        } catch (Exception e ){
            return null;
        }
    }
}
