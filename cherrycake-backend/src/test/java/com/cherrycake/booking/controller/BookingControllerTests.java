package com.cherrycake.booking.controller;

import static org.hamcrest.Matchers.startsWith;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.time.LocalDate;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@Transactional
class BookingControllerTests {

    @Autowired
    private MockMvc mvc;

    @Test
    void booksTableAndRejectsDoubleBookingWith409() throws Exception {
        String date = LocalDate.now().plusDays(1).toString();
        String body = """
                {
                  "date": "%s",
                  "time": "19:00:00",
                  "guests": 10,
                  "name": "Amir Karimov",
                  "phone": "+998901234567",
                  "email": "amir@example.com"
                }
                """.formatted(date);

        // Only T-06 has >= 10 seats, so first booking succeeds and second at same slot returns 409 Conflict
        mvc.perform(post("/api/bookings").contentType(MediaType.APPLICATION_JSON).content(body))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.bookingNumber").value(startsWith("BK-")))
                .andExpect(jsonPath("$.tableNumber").value("T-06"))
                .andExpect(jsonPath("$.guests").value(10));

        mvc.perform(post("/api/bookings").contentType(MediaType.APPLICATION_JSON).content(body))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.status").value(409));
    }

    @Test
    void rejectsGuestsOutsideOneToTwelveRange() throws Exception {
        String date = LocalDate.now().plusDays(1).toString();
        String body = """
                {
                  "date": "%s",
                  "time": "18:00:00",
                  "guests": 13,
                  "name": "Amir",
                  "phone": "+998901234567",
                  "email": "amir@example.com"
                }
                """.formatted(date);

        mvc.perform(post("/api/bookings").contentType(MediaType.APPLICATION_JSON).content(body))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status").value(400));
    }
}
