package com.example.billiards.model;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

public class GameSession {

    private String sessionId;
    private String playerName;
    private int score;
    private int turn;
    private boolean active;
    private LocalDateTime startedAt;
    private List<String> shots;

    public GameSession(String playerName) {
        this.sessionId = UUID.randomUUID().toString();
        this.playerName = playerName;
        this.score = 0;
        this.turn = 1;
        this.active = true;
        this.startedAt = LocalDateTime.now();
        this.shots = new ArrayList<>();
    }

    public void addShot(String shot) {
        if (!active) {
            throw new IllegalStateException("Game already ended");
        }
        shots.add(shot);
        turn++;
    }

    public void addScore(int points) {
        score += points;
    }

    public void endGame() {
        active = false;
    }

    public String getSessionId() {
        return sessionId;
    }

    public String getPlayerName() {
        return playerName;
    }

    public int getScore() {
        return score;
    }

    public int getTurn() {
        return turn;
    }

    public boolean isActive() {
        return active;
    }

    public LocalDateTime getStartedAt() {
        return startedAt;
    }

    public List<String> getShots() {
        return shots;
    }
}
