package edu.cosc578.group7.controller;

import edu.cosc578.group7.config.JwtUtil;
import edu.cosc578.group7.model.Agent;
import edu.cosc578.group7.model.AuthRequest;
import edu.cosc578.group7.model.AuthResponse;
import edu.cosc578.group7.repository.AgentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private AgentRepository agentRepository;

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AuthRequest authRequest) {
        Agent agent = agentRepository.authenticate(authRequest.getEmail(), authRequest.getPassword());
        
        if (agent != null) {
            // Generate JWT token
            String token = jwtUtil.generateToken(agent.getEmail(), agent.getAgent_id());
            
            // Create response with token and agent details
            AuthResponse response = new AuthResponse(
                token,
                agent.getAgent_id(),
                agent.getFirst_name(),
                agent.getLast_name()
            );
            
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid email or password");
        }
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Agent agent) {
        // Check if email already exists
        Agent existingAgent = agentRepository.findByEmail(agent.getEmail());
        if (existingAgent != null) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Email already registered");
        }
        
        // Insert new agent with auto-generated ID
        int generatedId = agentRepository.insertAgent(agent);
        
        // Generate token for the new agent
        String token = jwtUtil.generateToken(agent.getEmail(), generatedId);
        
        // Create response
        AuthResponse response = new AuthResponse(
            token,
            generatedId,
            agent.getFirst_name(),
            agent.getLast_name()
        );
        
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
} 