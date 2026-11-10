package com.cherrycake.order.controller;

import static org.hamcrest.Matchers.hasSize;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.time.LocalDate;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class LogisticsControllerTests {

    @Autowired
    private MockMvc mvc;

    @Test
    void returnsPickupPointsAndDeliveryZonesForRegion() throws Exception {
        mvc.perform(get("/api/pickup-points").param("region", "UZB"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(2)))
                .andExpect(jsonPath("$[0].name").value("Tashkent Center Flagship"));

        mvc.perform(get("/api/delivery-zones").param("region", "GEO"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].deliveryFee").value(8.00));
    }

    @Test
    void returnsTimeSlotsWithAvailabilityFlag() throws Exception {
        String today = LocalDate.now().toString();
        mvc.perform(get("/api/time-slots").param("date", today))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(6)))
                .andExpect(jsonPath("$[0].isAvailable").value(true));
    }

    @Test
    void returns404OnUnknownRegion() throws Exception {
        mvc.perform(get("/api/pickup-points").param("region", "XYZ"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.status").value(404));
    }
}

