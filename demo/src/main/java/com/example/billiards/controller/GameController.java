package com.example.billiards.controller;

import com.example.billiards.model.GameSession;
import com.example.billiards.service.GameService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/game")
public class GameController {

    private final GameService gameService;

    public GameController(GameService gameService) {
        this.gameService = gameService;
    }

    // START GAME
    // Example: http://localhost:8080/api/game/start?playerName=Ishita
    @GetMapping("/start")
    public GameSession startGame(@RequestParam String playerName) {
        return gameService.startGame(playerName);
    }

    // PLAY SHOT
    // Example: http://localhost:8080/api/game/shot?sessionId=xxx&shot=straight&points=10
    @PostMapping("/shot")
    public GameSession playShot(
            @RequestParam String sessionId,
            @RequestParam String shot,
            @RequestParam int points) {

        return gameService.playShot(sessionId, shot, points);
    }

    // END GAME
    // Example: http://localhost:8080/api/game/end?sessionId=xxx
    @PostMapping("/end")
    public GameSession endGame(@RequestParam String sessionId) {
        return gameService.endGame(sessionId);
    }

    // GET SESSION STATUS
    // Example: http://localhost:8080/api/game/status?sessionId=xxx
    @GetMapping("/status")
    public GameSession getStatus(@RequestParam String sessionId) {
        return gameService.getSession(sessionId);
    }
}
