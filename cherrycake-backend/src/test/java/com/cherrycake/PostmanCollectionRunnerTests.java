package com.cherrycake;

import static org.assertj.core.api.Assertions.assertThat;

import java.io.BufferedReader;
import java.io.File;
import java.io.InputStreamReader;
import java.nio.file.Path;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.test.context.ActiveProfiles;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@ActiveProfiles("test")
class PostmanCollectionRunnerTests {

    @LocalServerPort
    private int port;

    @Test
    void runPostmanCollectionWithNewman() throws Exception {
        Path projectRoot = Path.of("..").toAbsolutePath().normalize();
        File collection = projectRoot.resolve("qa/CherryCake_API.postman_collection.json").toFile();
        if (!collection.exists()) {
            collection = new File("qa/CherryCake_API.postman_collection.json");
        }

        assertThat(collection).exists();

        // Check if newman is available on PATH
        boolean newmanAvailable = true;
        try {
            Process p = new ProcessBuilder("cmd.exe", "/c", "newman", "-v").start();
            p.waitFor();
        } catch (Exception e) {
            newmanAvailable = false;
        }

        if (!newmanAvailable) {
            System.out.println("Newman CLI not found, skipping automated Postman run.");
            return;
        }

        ProcessBuilder pb = new ProcessBuilder(
                "cmd.exe", "/c", "newman", "run", collection.getAbsolutePath(),
                "--env-var", "baseUrl=http://localhost:" + port
        );
        pb.redirectErrorStream(true);
        Process process = pb.start();

        StringBuilder output = new StringBuilder();
        try (BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()))) {
            String line;
            while ((line = reader.readLine()) != null) {
                output.append(line).append(System.lineSeparator());
                System.out.println(line);
            }
        }

        int exitCode = process.waitFor();
        assertThat(exitCode).withFailMessage("Newman tests failed:\n" + output).isZero();
    }
}
