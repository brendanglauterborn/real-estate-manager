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

import edu.cosc578.group7.model.Property;

@Repository
public class PropertyRepository {
    @Autowired
    private JdbcTemplate jdbcTemplate;

    public List<Property> getAllProperty(){
        String sql = "Select * from Property";
        return jdbcTemplate.query(sql, (rs, rowNum) -> mapRow(rs));
    }

    public int insertProperty(Property property){
        String sql = "Insert into Property (address, type, features) values (?,?,?)";
        
        KeyHolder keyHolder = new GeneratedKeyHolder();
        
        jdbcTemplate.update(connection -> {
            PreparedStatement ps = connection.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
            ps.setString(1, property.getAddress());
            ps.setString(2, property.getType());
            ps.setString(3, property.getFeatures());
            return ps;
        }, keyHolder);
        
        int generatedId = keyHolder.getKey().intValue();
        property.setProperty_id(generatedId);
        
        return generatedId;
    }
    
    public void updateProperty(Property property) {
        String sql = "Update Property Set address = ?, type = ?, features = ? Where property_id = ?";
        jdbcTemplate.update(sql, property.getAddress(), property.getType(), property.getFeatures(), property.getProperty_id());
    }

    public void deleteProperty(int property_id) {
        String sql = "Delete From Property Where property_id = ?";
        jdbcTemplate.update(sql, property_id);
    }

    private Property mapRow(ResultSet rs) {
        Property p = new Property();
        try{
            p.setProperty_id(rs.getInt("property_id"));
            p.setAddress(rs.getString("address"));
            p.setType(rs.getString("type"));
            p.setFeatures(rs.getString("features"));
            return p;
        } catch (Exception e ){
            return null;
        }
    }
}
