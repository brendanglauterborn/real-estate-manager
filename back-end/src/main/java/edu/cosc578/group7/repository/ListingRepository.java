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
import edu.cosc578.group7.model.Listing;

@Repository
public class ListingRepository {
    @Autowired
    private JdbcTemplate jdbcTemplate;

    public List<Listing> getAllListing(){
        String sql = "Select * from Listing";
        return jdbcTemplate.query(sql, (rs, rowNum) -> mapRow(rs));
    }
    
    public List<Listing> getListingsByAgentId(int agentId){
        String sql = "Select * from Listing where agent_id = ?";
        return jdbcTemplate.query(sql, (rs, rowNum) -> mapRow(rs), agentId);
    }

    public int insertListing(Listing listing){
        String sql = "Insert into Listing (listing_date, status, description, listing_price, property_id, agent_id) values (?,?,?,?,?,?)";
        
        KeyHolder keyHolder = new GeneratedKeyHolder();
        
        jdbcTemplate.update(connection -> {
            PreparedStatement ps = connection.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
            ps.setString(1, listing.getListing_date());
            ps.setString(2, listing.getStatus());
            ps.setString(3, listing.getDescription());
            ps.setString(4, listing.getListing_price());
            ps.setInt(5, listing.getProperty_id());
            ps.setInt(6, listing.getAgent_id());
            return ps;
        }, keyHolder);
        
        int generatedId = keyHolder.getKey().intValue();
        listing.setListing_id(generatedId);
        
        return generatedId;
    }

    public void updateListing(Listing listing) {
        String sql = "Update Listing Set listing_date = ?, status = ?, description = ?, listing_price = ?, property_id = ?, agent_id = ? " +
                     "Where listing_id = ?";
        jdbcTemplate.update(sql, listing.getListing_date(), listing.getStatus(), listing.getDescription(), listing.getListing_price(), listing.getProperty_id(), listing.getAgent_id(), listing.getListing_id());
    }

    public void deleteListing(int listing_id) {
        String sql = "Delete From Listing Where listing_id = ?";
        jdbcTemplate.update(sql, listing_id);
    }

    private Listing mapRow(ResultSet rs) {
        Listing l = new Listing();
        try{
            l.setListing_id(rs.getInt("listing_id"));
            l.setListing_date(rs.getString("listing_date"));
            l.setStatus(rs.getString("status"));
            l.setDescription(rs.getString("description"));
            l.setListing_price(rs.getString("listing_price"));
            l.setProperty_id(rs.getInt("property_id"));
            l.setAgent_id(rs.getInt("agent_id"));       
            return l;
        } catch (Exception e ){
            return null;
        }
    }
}
