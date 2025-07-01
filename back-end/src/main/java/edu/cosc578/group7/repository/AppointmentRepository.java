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
import edu.cosc578.group7.model.Appointment;

@Repository
public class AppointmentRepository {
    @Autowired
    private JdbcTemplate jdbcTemplate;

    public List<Appointment> getAllAppointment(){
        String sql = "Select * from Appointment";
        return jdbcTemplate.query(sql, (rs, rowNum) -> mapRow(rs));
    }
    
    public List<Appointment> getAppointmentsByAgentId(int agentId){
        String sql = "Select * from Appointment where agent_id = ?";
        return jdbcTemplate.query(sql, (rs, rowNum) -> mapRow(rs), agentId);
    }
    
    public List<Appointment> getAppointmentsByListingId(int listingId){
        String sql = "Select * from Appointment where listing_id = ?";
        return jdbcTemplate.query(sql, (rs, rowNum) -> mapRow(rs), listingId);
    }

    public int insertAppointment(Appointment appointment){
        String sql = "Insert into Appointment (appointment_date, time, purpose, listing_price, listing_id, agent_id, client_id) values (?,?,?,?,?,?,?)";
        
        KeyHolder keyHolder = new GeneratedKeyHolder();
        
        jdbcTemplate.update(connection -> {
            PreparedStatement ps = connection.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
            ps.setString(1, appointment.getAppointment_date());
            ps.setString(2, appointment.getTime());
            ps.setString(3, appointment.getPurpose());
            ps.setString(4, appointment.getListing_price());
            ps.setInt(5, appointment.getListing_id());
            ps.setInt(6, appointment.getAgent_id());
            ps.setInt(7, appointment.getClient_id());
            return ps;
        }, keyHolder);
        
        int generatedId = keyHolder.getKey().intValue();
        appointment.setAppointment_id(generatedId);
        
        return generatedId;
    }

    public void updateAppointment(Appointment appointment) {
        String sql = "Update Appointment Set appointment_date = ?, time = ?, purpose = ?, listing_price = ?, listing_id = ?, agent_id = ?, client_id = ? " +
                     "Where appointment_id = ?";
        jdbcTemplate.update(sql, appointment.getAppointment_date(), appointment.getTime(), appointment.getPurpose(), appointment.getListing_price(), appointment.getListing_id(),
        appointment.getAgent_id(), appointment.getClient_id(), appointment.getAppointment_id());
    }

    public void deleteAppointment(int appointment_id) {
        String sql = "Delete From Appointment Where appointment_id = ?";
        jdbcTemplate.update(sql, appointment_id);
    }

    private Appointment mapRow(ResultSet rs) {
        Appointment a = new Appointment();
        try{
            a.setAppointment_id(rs.getInt("appointment_id"));
            a.setAppointment_date(rs.getString("appointment_date"));
            a.setTime(rs.getString("time"));
            a.setPurpose(rs.getString("purpose"));
            a.setListing_price(rs.getString("listing_price"));
            a.setListing_id(rs.getInt("listing_id"));
            a.setAgent_id(rs.getInt("agent_id"));
            a.setClient_id(rs.getInt("client_id"));         
            return a;
        } catch (Exception e ){
            return null;
        }
    }
}
