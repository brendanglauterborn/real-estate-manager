package edu.cosc578.group7.controller;

import edu.cosc578.group7.model.Listing;
import edu.cosc578.group7.repository.ListingRepository;
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
@RequestMapping("/listing")
public class ListingController {

    @Autowired
    private ListingRepository listingRepository;
    
    @Autowired
    private PropertyRepository propertyRepository;

    // GET 
    @GetMapping
    public List<Listing> getAllListings() {
        return listingRepository.getAllListing();
    }
    
    // GET listings by agent ID
    @GetMapping("/agent/{agentId}")
    public List<Listing> getListingsByAgentId(@PathVariable int agentId) {
        return listingRepository.getListingsByAgentId(agentId);
    }

    // POST - Modified to return the generated ID
    @PostMapping
    public ResponseEntity<Map<String, Object>> insertListing(@RequestBody Listing listing) {
        int generatedId = listingRepository.insertListing(listing);
        
        Map<String, Object> response = new HashMap<>();
        response.put("listing_id", generatedId);
        response.put("message", "Listing created successfully");
        
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    // PUT 
    @PutMapping("/{id}")
    public void updateListing(@PathVariable int id, @RequestBody Listing listing) {
        listing.setListing_id(id);
        listingRepository.updateListing(listing);
    }

    // DELETE - Modified to also delete the associated property
    @DeleteMapping("/{id}")
    public void deleteListing(@PathVariable int id) {
        // Get the listing to find the property ID
        List<Listing> listings = listingRepository.getAllListing();
        Listing listingToDelete = listings.stream()
                .filter(l -> l.getListing_id() == id)
                .findFirst()
                .orElse(null);
        
        if (listingToDelete != null) {
            int propertyId = listingToDelete.getProperty_id();
            
            // Delete the listing first (due to foreign key constraints)
            listingRepository.deleteListing(id);
            
            // Then delete the associated property
            propertyRepository.deleteProperty(propertyId);
        } else {
            // If listing not found, just try to delete it
            listingRepository.deleteListing(id);
        }
    }
}
