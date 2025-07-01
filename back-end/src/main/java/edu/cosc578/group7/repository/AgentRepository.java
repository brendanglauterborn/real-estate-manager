package edu.cosc578.group7.repository;
/*This program handles all of the CRUD operations for the agent table
Executes sql queries and maps results to database
*/
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.Statement;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;
import edu.cosc578.group7.model.Agent;


@Repository
public class AgentRepository {
    @Autowired
    private JdbcTemplate jdbcTemplate;
    //Gets all data from the agent table
    public List<Agent> getAllAgents(){
        String sql = "Select * from Agent";
        return jdbcTemplate.query(sql, (rs, rowNum) -> mapRow(rs));
    }
    //Inserts new object into agent table
    public int insertAgent(Agent agent){
        String sql = "Insert into Agent (first_name, last_name, email, phone_no, region, role, branch_id, password) values (?,?,?,?,?,?,?,?)";
        
        KeyHolder keyHolder = new GeneratedKeyHolder();
        
        jdbcTemplate.update(connection -> {
            PreparedStatement ps = connection.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
            ps.setString(1, agent.getFirst_name());
            ps.setString(2, agent.getLast_name());
            ps.setString(3, agent.getEmail());
            ps.setString(4, agent.getPhone_no());
            ps.setString(5, agent.getRegion());
            ps.setString(6, agent.getRole());
            ps.setInt(7, agent.getBranch_id());
            ps.setString(8, agent.getPassword());
            return ps;
        }, keyHolder);
        
        int generatedId = keyHolder.getKey().intValue();
        agent.setAgent_id(generatedId);
        
        return generatedId;
    }

    //Updates an existing agent from agent table, maps by agent_id
    public void updateAgent(Agent agent) {
        String sql = "Update Agent set first_name = ?, last_name = ?, email = ?, phone_no = ?, region = ?, role = ?, branch_id = ?, password = ? " +
                     "Where agent_id = ?";
        jdbcTemplate.update(sql,
                agent.getFirst_name(),
                agent.getLast_name(),
                agent.getEmail(),
                agent.getPhone_no(),
                agent.getRegion(),
                agent.getRole(),
                agent.getBranch_id(),
                agent.getPassword(),
                agent.getAgent_id());
    }
    //Deletes an existing agent from the agent table, maps by agent_id
    public void deleteAgent(int agent_id) {
        String sql = "DELETE FROM Agent WHERE agent_id = ?";
        jdbcTemplate.update(sql, agent_id);
    }
    
    // Find agent by email
    public Agent findByEmail(String email) {
        String sql = "SELECT * FROM Agent WHERE email = ?";
        try {
            return jdbcTemplate.queryForObject(sql, (rs, rowNum) -> mapRow(rs), email);
        } catch (Exception e) {
            return null;
        }
    }
    
    // Authenticate agent by email and password
    public Agent authenticate(String email, String password) {
        String sql = "SELECT * FROM Agent WHERE email = ? AND password = ?";
        try {
            return jdbcTemplate.queryForObject(sql, (rs, rowNum) -> mapRow(rs), email, password);
        } catch (Exception e) {
            return null;
        }
    }


    //converts one tuple from the database into an object. Returns that for the Get
    private Agent mapRow(ResultSet rs) {
        Agent a = new Agent();
        try{
            a.setAgent_id(rs.getInt("agent_id"));
            a.setFirst_name(rs.getString("first_name"));
            a.setLast_name(rs.getString("last_name"));
            a.setEmail(rs.getString("email"));
            a.setPhone_no(rs.getString("Phone_no"));
            a.setRegion((rs.getString("region")));
            a.setRole(rs.getString("role"));
            a.setBranch_id(rs.getInt("branch_id"));
            a.setPassword(rs.getString("password"));
            return a;
        } catch (Exception e ){
            return null;
        }
    }
}
