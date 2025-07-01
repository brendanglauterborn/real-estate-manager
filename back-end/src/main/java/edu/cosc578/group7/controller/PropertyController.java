package edu.cosc578.group7.controller;

import edu.cosc578.group7.model.Property;
import edu.cosc578.group7.repository.PropertyRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.HashMap;
import java.util.Map;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/property")
public class PropertyController {

    @Autowired
    private PropertyRepository propertyRepository;

    // Handles GET /property
    @GetMapping
    public List<Property> getAllProperties() {
        return propertyRepository.getAllProperty();  // This gets converted to JSON
    }
    
    // GET /property/{id} - Get property by ID
    @GetMapping("/{id}")
    public Property getPropertyById(@PathVariable int id) {
        // Note: This is a simplified implementation
        // In a real application, you'd have proper error handling
        List<Property> properties = propertyRepository.getAllProperty();
        return properties.stream()
                .filter(p -> p.getProperty_id() == id)
                .findFirst()
                .orElse(null);
    }

    // Handles POST /property
    @PostMapping
    public ResponseEntity<Map<String, Object>> insertProperty(@RequestBody Property property) {
        int generatedId = propertyRepository.insertProperty(property);
        
        Map<String, Object> response = new HashMap<>();
        response.put("property_id", generatedId);
        response.put("message", "Property created successfully");
        
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    // PUT /property/{id} - Update property with given ID
    @PutMapping("/{id}")
    public void updateProperty(@PathVariable int id, @RequestBody Property property) {
        property.setProperty_id(id); // ensure the ID from the URL is used
        propertyRepository.updateProperty(property);
    }

    // DELETE /property/{id} - Delete property with given ID
    @DeleteMapping("/{id}")
    public void deleteProperty(@PathVariable int id) {
        propertyRepository.deleteProperty(id);
    }
}
