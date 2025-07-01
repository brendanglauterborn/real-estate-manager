package edu.cosc578.group7.controller;
/* This class is the Rest controller. it manages the Agent related api endpoints
 * Maps requests to the correct methods and 
 * delegates db operations to the Agent repository
*/
import edu.cosc578.group7.model.Agent;
import edu.cosc578.group7.repository.AgentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/agent")
public class AgentController {

    @Autowired
    private AgentRepository agentRepository;

    // GET /agent
    @GetMapping
    public List<Agent> getAllAgents() {
        return agentRepository.getAllAgents();  // Returns all agents as JSON
    }

    // POST /agent
    @PostMapping
    public void insertAgent(@RequestBody Agent agent) {
        agentRepository.insertAgent(agent);  // Insert a new agent
    }

    // PUT /agent/{id} - Update agent with given ID
    @PutMapping("/{id}")
    public void updateAgent(@PathVariable int id, @RequestBody Agent agent) {
        agent.setAgent_id(id);
        agentRepository.updateAgent(agent); //updates an agent
    }

    // DELETE /agent/{id} - Delete agent with given ID
    @DeleteMapping("/{id}")
    public void deleteAgent(@PathVariable int id) {
        agentRepository.deleteAgent(id);//deltes an agent
    }
}
