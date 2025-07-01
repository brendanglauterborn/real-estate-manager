package edu.cosc578.group7.controller;

import edu.cosc578.group7.model.Client;
import edu.cosc578.group7.repository.ClientRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/client")
public class ClientController {

    @Autowired
    private ClientRepository clientRepository;

    // Handles GET /client
    @GetMapping
    public List<Client> getAllClients() {
        return clientRepository.getAllClients();  // This gets converted to JSON
    }

    @GetMapping("/agent/{agentId}")
    public List<Client> getClientsByAgentId(@PathVariable int agentId) {
        return clientRepository.getClientsByAgentId(agentId);
    }

    // Handles POST /client - Modified to return the generated ID
    @PostMapping
    public ResponseEntity<Map<String, Object>> insertClient(@RequestBody Client client) {
        int generatedId = clientRepository.insertClient(client);
        
        Map<String, Object> response = new HashMap<>();
        response.put("client_id", generatedId);
        response.put("message", "Client created successfully");
        
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    // PUT /client/{id} - Update client with given ID
    @PutMapping("/{id}")
    public void updateClient(@PathVariable int id, @RequestBody Client client) {
        client.setClient_id(id); // ensure the ID from the URL is used
        clientRepository.updateClient(client);
    }

    // DELETE /client/{id} - Delete client with given ID
    @DeleteMapping("/{id}")
    public void deleteClient(@PathVariable int id) {
        clientRepository.deleteClient(id);
    }
}
