package edu.cosc578.group7.controller;

import edu.cosc578.group7.model.Appointment;
import edu.cosc578.group7.repository.AppointmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/appointment")
public class AppointmentController {

    @Autowired
    private AppointmentRepository appointmentRepository;

    // GET /appointment
    @GetMapping
    public List<Appointment> getAllAppointments() {
        return appointmentRepository.getAllAppointment();
    }

    @GetMapping("/agent/{agentId}")
    public List<Appointment> getAppointmentsByAgentId(@PathVariable int agentId) {
        return appointmentRepository.getAppointmentsByAgentId(agentId);
    }

    @GetMapping("/listing/{listingId}")
    public List<Appointment> getAppointmentsByListingId(@PathVariable int listingId) {
        return appointmentRepository.getAppointmentsByListingId(listingId);
    }

    // POST /appointment - Modified to return the generated ID
    @PostMapping
    public ResponseEntity<Map<String, Object>> insertAppointment(@RequestBody Appointment appointment) {
        int generatedId = appointmentRepository.insertAppointment(appointment);
        
        Map<String, Object> response = new HashMap<>();
        response.put("appointment_id", generatedId);
        response.put("message", "Appointment created successfully");
        
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    // PUT /appointment/{id} - Update appointment with given ID
    @PutMapping("/{id}")
    public void updateAppointment(@PathVariable int id, @RequestBody Appointment appointment) {
        appointment.setAppointment_id(id);
        appointmentRepository.updateAppointment(appointment);
    }

    // DELETE /appointment/{id} - Delete appointment with given ID
    @DeleteMapping("/{id}")
    public void deleteAppointment(@PathVariable int id) {
        appointmentRepository.deleteAppointment(id);
    }
}
