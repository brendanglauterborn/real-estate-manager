package edu.cosc578.group7.repository;

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
import edu.cosc578.group7.model.Client;

@Repository
public class ClientRepository {
    @Autowired
    private JdbcTemplate jdbcTemplate;

    public List<Client> getAllClients(){
        String sql = "Select * from Client";
        return jdbcTemplate.query(sql, (rs, rowNum) -> mapRow(rs));
    }
    
    public List<Client> getClientsByAgentId(int agentId){
        String sql = "Select * from Client where agent_id = ?";
        return jdbcTemplate.query(sql, (rs, rowNum) -> mapRow(rs), agentId);
    }

    public int insertClient(Client client){
        String sql = "Insert into Client (first_name, last_name, email, phone_no, agent_id) values (?,?,?,?,?)";
        
        KeyHolder keyHolder = new GeneratedKeyHolder();
        
        jdbcTemplate.update(connection -> {
            PreparedStatement ps = connection.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
            ps.setString(1, client.getFirst_name());
            ps.setString(2, client.getLast_name());
            ps.setString(3, client.getEmail());
            ps.setString(4, client.getPhone_no());
            ps.setInt(5, client.getAgent_id());
            return ps;
        }, keyHolder);
        
        int generatedId = keyHolder.getKey().intValue();
        client.setClient_id(generatedId);
        
        return generatedId;
    }
 
    public void updateClient(Client client) {
        String sql = "Update Client Set first_name = ?, last_name = ?, email = ?, phone_no = ?, agent_id = ? WHERE client_id = ?";
        jdbcTemplate.update(sql, 
            client.getFirst_name(), 
            client.getLast_name(), 
            client.getEmail(), 
            client.getPhone_no(), 
            client.getAgent_id(),
            client.getClient_id());
    }
    
    public void deleteClient(int client_id) {
        String sql = "Delete From Client Where client_id = ?";
        jdbcTemplate.update(sql, client_id);
    }

    private Client mapRow(ResultSet rs) {
        Client c = new Client();
        try{
            c.setClient_id(rs.getInt("client_id"));
            c.setFirst_name(rs.getString("first_name"));
            c.setLast_name(rs.getString("last_name"));
            c.setEmail(rs.getString("email"));
            c.setPhone_no(rs.getString("Phone_no"));
            c.setAgent_id(rs.getInt("agent_id"));
            return c;
        } catch (Exception e ){
            return null;
        }
    }
    
}
