package com.example.billiards.service;

import com.example.billiards.model.GameSession;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class GameService {

    // In-memory storage (acts like CMD/runtime memory)
    private final Map<String, GameSession> sessions = new HashMap<>();

    public GameSession startGame(String playerName) {
        GameSession session = new GameSession(playerName);
        sessions.put(session.getSessionId(), session);
        return session;
    }

    public GameSession playShot(String sessionId, String shotType, int points) {
        GameSession session = getSession(sessionId);
        session.addShot(shotType);
        session.addScore(points);
        return session;
    }

    public GameSession endGame(String sessionId) {
        GameSession session = getSession(sessionId);
        session.endGame();
        return session;
    }

    public GameSession getSession(String sessionId) {
        GameSession session = sessions.get(sessionId);
        if (session == null) {
            throw new RuntimeException("Session not found");
        }
        return session;
    }
}
