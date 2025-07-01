package edu.cosc578.group7.controller;

import edu.cosc578.group7.model.Branch;
import edu.cosc578.group7.repository.BranchRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

//@CrossOrigin(origins = "http://localhost:1738") 
@Validated
@RestController
@RequestMapping("/branch")
public class BranchController {

    @Autowired
    private BranchRepository branchRepository;

    // GET 
    @GetMapping
    public List<Branch> getAllBranch() {
        return branchRepository.getAllBranch();  
    }

    
    // POST 
    @PostMapping
    public void insertBranch(@RequestBody Branch branch) {
        branchRepository.insertBranch(branch); 
    }

    // PUT 
    @PutMapping("/{id}")
    public void updateBranch(@PathVariable int id, @RequestBody Branch branch) {
        branch.setBranch_id(id); // make sure the URL ID is used
        branchRepository.updateBranch(branch);
    }

    // DELETE 
    @DeleteMapping("/{id}")
    public void deleteBranch(@PathVariable int id) {
        branchRepository.deleteBranch(id);
    }
}
